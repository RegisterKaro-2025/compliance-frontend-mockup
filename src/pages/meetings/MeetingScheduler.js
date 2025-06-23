import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Language as LanguageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useMeeting } from '../../contexts/MeetingContext';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

const MeetingScheduler = () => {
  const { currentUser } = useAuth();
  const { 
    spocs, 
    createMeeting, 
    getAvailableTimeSlots, 
    loading, 
    error 
  } = useMeeting();
  const { 
    entities, 
    compliances, 
    complianceTypes, 
    getEntityById, 
    getComplianceTypeById 
  } = useCompliance();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedSpoc, setSelectedSpoc] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    entityId: '',
    complianceId: '',
    duration: 60,
    meetingType: 'CONSULTATION',
    priority: 'MEDIUM',
    agenda: ['']
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const steps = [
    'Select SPOC',
    'Choose Date & Time',
    'Meeting Details',
    'Confirmation'
  ];

  const meetingTypes = [
    { value: 'CONSULTATION', label: 'Consultation', description: 'General compliance consultation' },
    { value: 'SUPPORT', label: 'Support', description: 'Technical support and issue resolution' },
    { value: 'REVIEW', label: 'Review', description: 'Compliance review and assessment' },
    { value: 'TRAINING', label: 'Training', description: 'Compliance training session' },
    { value: 'FOLLOW_UP', label: 'Follow-up', description: 'Follow-up on previous discussions' }
  ];

  const priorityLevels = [
    { value: 'LOW', label: 'Low', color: 'success' },
    { value: 'MEDIUM', label: 'Medium', color: 'warning' },
    { value: 'HIGH', label: 'High', color: 'error' },
    { value: 'URGENT', label: 'Urgent', color: 'error' }
  ];

  // Load available time slots when SPOC and date are selected
  useEffect(() => {
    if (selectedSpoc && selectedDate) {
      const slots = getAvailableTimeSlots(selectedSpoc.id, selectedDate.format('YYYY-MM-DD'));
      setAvailableSlots(slots);
    }
  }, [selectedSpoc, selectedDate, getAvailableTimeSlots]);

  const handleSpocSelect = (spoc) => {
    setSelectedSpoc(spoc);
    setActiveStep(1);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot);
    setActiveStep(2);
  };

  const handleMeetingDataChange = (field, value) => {
    setMeetingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgendaChange = (index, value) => {
    const newAgenda = [...meetingData.agenda];
    newAgenda[index] = value;
    setMeetingData(prev => ({
      ...prev,
      agenda: newAgenda
    }));
  };

  const addAgendaItem = () => {
    setMeetingData(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const removeAgendaItem = (index) => {
    const newAgenda = meetingData.agenda.filter((_, i) => i !== index);
    setMeetingData(prev => ({
      ...prev,
      agenda: newAgenda
    }));
  };

  const handleNext = () => {
    if (activeStep === 2) {
      // Validate meeting details
      if (!meetingData.title.trim()) {
        alert('Please enter a meeting title');
        return;
      }
      
      // Prepare confirmation data
      const scheduledDateTime = dayjs(selectedDate)
        .hour(parseInt(selectedTime.time.split(':')[0]))
        .minute(parseInt(selectedTime.time.split(':')[1]))
        .toISOString();

      setConfirmationData({
        ...meetingData,
        spocId: selectedSpoc.id,
        clientId: currentUser.id,
        scheduledDateTime,
        agenda: meetingData.agenda.filter(item => item.trim() !== '')
      });
      
      setActiveStep(3);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleScheduleMeeting = async () => {
    try {
      const meeting = await createMeeting(confirmationData);
      setDialogOpen(true);
      
      // Don't reset form immediately - wait for dialog to close
      // The reset will happen when dialog closes or user navigates away
    } catch (err) {
      console.error('Failed to schedule meeting:', err);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    
    // Reset form after dialog closes
    setActiveStep(0);
    setSelectedSpoc(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setMeetingData({
      title: '',
      description: '',
      entityId: '',
      complianceId: '',
      duration: 60,
      meetingType: 'CONSULTATION',
      priority: 'MEDIUM',
      agenda: ['']
    });
    setConfirmationData(null);
  };

  const renderSpocSelection = () => (
    <Grid container spacing={3}>
      {spocs.map((spoc) => (
        <Grid item xs={12} md={6} lg={4} key={spoc.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
            onClick={() => handleSpocSelect(spoc)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={spoc.avatar} 
                  sx={{ width: 60, height: 60, mr: 2 }}
                >
                  {spoc.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {spoc.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {spoc.designation}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={spoc.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {spoc.rating} ({spoc.totalMeetings} meetings)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {spoc.email}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {spoc.phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Specializations:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {spoc.specializations.map((spec) => (
                    <Chip 
                      key={spec} 
                      label={spec} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Languages:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {spoc.languages.join(', ')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            
            <CardActions>
              <Button 
                variant="contained" 
                startIcon={<ScheduleIcon />}
                fullWidth
              >
                Schedule Meeting
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDateTimeSelection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateSelect}
              minDate={dayjs()}
              maxDate={dayjs().add(3, 'month')}
              shouldDisableDate={(date) => {
                const dayOfWeek = date.day();
                return !selectedSpoc.availability.workingDays.includes(dayOfWeek) ||
                       selectedSpoc.availability.unavailableDates.includes(date.format('YYYY-MM-DD'));
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined'
                }
              }}
            />
          </LocalizationProvider>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Available Time Slots
          </Typography>
          {selectedDate ? (
            availableSlots.length > 0 ? (
              <Grid container spacing={1}>
                {availableSlots.map((slot, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Button
                      variant={selectedTime?.time === slot.time ? 'contained' : 'outlined'}
                      onClick={() => handleTimeSelect(slot)}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      {slot.time}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No available slots for this date. Please select another date.
              </Alert>
            )
          ) : (
            <Typography variant="body2" color="text.secondary">
              Please select a date to view available time slots.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderMeetingDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Meeting Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Meeting Title"
                value={meetingData.title}
                onChange={(e) => handleMeetingDataChange('title', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={meetingData.description}
                onChange={(e) => handleMeetingDataChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Entity</InputLabel>
                <Select
                  value={meetingData.entityId}
                  onChange={(e) => handleMeetingDataChange('entityId', e.target.value)}
                  label="Entity"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {entities.map((entity) => (
                    <MenuItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Related Compliance</InputLabel>
                <Select
                  value={meetingData.complianceId}
                  onChange={(e) => handleMeetingDataChange('complianceId', e.target.value)}
                  label="Related Compliance"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {compliances
                    .filter(comp => !meetingData.entityId || comp.entityId === meetingData.entityId)
                    .map((compliance) => {
                      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                      return (
                        <MenuItem key={compliance.id} value={compliance.id}>
                          {complianceType?.name || 'Unknown'} - {compliance.financialYear || compliance.returnPeriod}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Meeting Type</InputLabel>
                <Select
                  value={meetingData.meetingType}
                  onChange={(e) => handleMeetingDataChange('meetingType', e.target.value)}
                  label="Meeting Type"
                >
                  {meetingTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={meetingData.priority}
                  onChange={(e) => handleMeetingDataChange('priority', e.target.value)}
                  label="Priority"
                >
                  {priorityLevels.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Chip 
                        label={priority.label} 
                        color={priority.color} 
                        size="small" 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (minutes)"
                type="number"
                value={meetingData.duration}
                onChange={(e) => handleMeetingDataChange('duration', parseInt(e.target.value))}
                fullWidth
                inputProps={{ min: 15, max: 180, step: 15 }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Meeting Agenda
          </Typography>
          
          {meetingData.agenda.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label={`Agenda Item ${index + 1}`}
                value={item}
                onChange={(e) => handleAgendaChange(index, e.target.value)}
                fullWidth
                size="small"
              />
              {meetingData.agenda.length > 1 && (
                <IconButton 
                  onClick={() => removeAgendaItem(index)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addAgendaItem}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          >
            Add Agenda Item
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderConfirmation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Meeting Summary
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="SPOC"
                secondary={selectedSpoc ? `${selectedSpoc.name} - ${selectedSpoc.designation}` : 'N/A'}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText
                primary="Date & Time"
                secondary={selectedDate && selectedTime ? `${selectedDate.format('MMMM DD, YYYY')} at ${selectedTime.time}` : 'N/A'}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <TimeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Duration"
                secondary={`${meetingData.duration || 60} minutes`}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <VideoCallIcon />
              </ListItemIcon>
              <ListItemText
                primary="Meeting Type"
                secondary={meetingTypes.find(t => t.value === meetingData.meetingType)?.label || 'N/A'}
              />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            {meetingData.title}
          </Typography>
          
          {meetingData.description && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {meetingData.description}
            </Typography>
          )}
          
          {meetingData.agenda.filter(item => item.trim()).length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Agenda:
              </Typography>
              <List dense>
                {meetingData.agenda
                  .filter(item => item.trim())
                  .map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${index + 1}. ${item}`} />
                    </ListItem>
                  ))}
              </List>
            </>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            What happens next?
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText
                primary="1. Google Meet link created"
                secondary="You'll receive a meeting link via email"
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="2. Calendar invites sent"
                secondary="Both you and the SPOC will receive calendar invites"
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="3. Reminder notifications"
                secondary="You'll receive reminders 24 hours and 1 hour before the meeting"
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="4. Meeting preparation"
                secondary="The SPOC will review your case before the meeting"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Schedule Meeting with SPOC
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Schedule a meeting with our compliance experts to discuss your requirements and get personalized guidance.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {index === 0 && renderSpocSelection()}
                {index === 1 && renderDateTimeSelection()}
                {index === 2 && renderMeetingDetails()}
                {index === 3 && renderConfirmation()}
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    disabled={
                      (index === 1 && !selectedTime) ||
                      (index === 2 && !meetingData.title.trim()) ||
                      loading
                    }
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleScheduleMeeting : handleNext}
                    sx={{ mr: 1 }}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {index === steps.length - 1 ? 'Schedule Meeting' : 'Continue'}
                  </Button>
                  
                  {index > 0 && (
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Meeting Scheduled Successfully!</Typography>
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your meeting has been scheduled successfully. You will receive a confirmation email with the Google Meet link and calendar invite.
          </Alert>
          
          <Typography variant="body1" gutterBottom>
            Meeting Details:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText
                primary="Date & Time"
                secondary={selectedDate && selectedTime ? 
                  `${selectedDate.format('MMMM DD, YYYY')} at ${selectedTime.time}` : 
                  'N/A'
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="SPOC"
                secondary={selectedSpoc?.name}
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Meeting Title"
                secondary={meetingData.title}
              />
            </ListItem>
          </List>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetingScheduler;