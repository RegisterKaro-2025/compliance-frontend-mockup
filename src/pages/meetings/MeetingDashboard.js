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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Stack,
  Badge,
  Menu,
  MenuList,
  ListItemButton
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Schedule as RescheduleIcon,
  Notes as NotesIcon,
  Link as LinkIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useMeeting } from '../../contexts/MeetingContext';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MeetingDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    meetings,
    spocs,
    getMeetingsByClient,
    getUpcomingMeetings,
    getMeetingStats,
    getSpocById,
    cancelMeeting,
    rescheduleMeeting,
    addMeetingNotes,
    loading,
    error
  } = useMeeting();
  const { getEntityById, getComplianceById, getComplianceTypeById } = useCompliance();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rescheduleDateTime, setRescheduleDateTime] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const userMeetings = getMeetingsByClient(currentUser?.id);
  const upcomingMeetings = getUpcomingMeetings(currentUser?.id);
  const meetingStats = getMeetingStats(currentUser?.id);

  const filteredMeetings = {
    all: userMeetings,
    upcoming: userMeetings.filter(m => new Date(m.scheduledDateTime) > new Date() && m.status === 'SCHEDULED'),
    completed: userMeetings.filter(m => m.status === 'COMPLETED'),
    cancelled: userMeetings.filter(m => m.status === 'CANCELLED')
  };

  const tabLabels = [
    { label: 'All Meetings', count: filteredMeetings.all.length },
    { label: 'Upcoming', count: filteredMeetings.upcoming.length },
    { label: 'Completed', count: filteredMeetings.completed.length },
    { label: 'Cancelled', count: filteredMeetings.cancelled.length }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event, meeting) => {
    setAnchorEl(event.currentTarget);
    setSelectedMeeting(meeting);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMeeting(null);
  };

  const handleAction = (action) => {
    setActionType(action);
    setActionDialogOpen(true);
    handleMenuClose();
    
    if (action === 'notes') {
      setMeetingNotes(selectedMeeting?.notes || '');
    }
  };

  const handleActionSubmit = async () => {
    try {
      switch (actionType) {
        case 'cancel':
          await cancelMeeting(selectedMeeting.id, cancellationReason);
          break;
        case 'reschedule':
          await rescheduleMeeting(selectedMeeting.id, rescheduleDateTime.toISOString(), 'Rescheduled by client');
          break;
        case 'notes':
          await addMeetingNotes(selectedMeeting.id, meetingNotes);
          break;
      }
      
      setActionDialogOpen(false);
      resetActionState();
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const resetActionState = () => {
    setSelectedMeeting(null);
    setActionType('');
    setCancellationReason('');
    setRescheduleDateTime(null);
    setMeetingNotes('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'IN_PROGRESS':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <ScheduleIcon />;
      case 'COMPLETED':
        return <CheckCircleIcon />;
      case 'CANCELLED':
        return <ErrorIcon />;
      case 'IN_PROGRESS':
        return <WarningIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
        return 'error';
      case 'URGENT':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format('MMM DD, YYYY [at] h:mm A');
  };

  const isUpcoming = (dateTime) => {
    return new Date(dateTime) > new Date();
  };

  const renderMeetingCard = (meeting) => {
    const spoc = getSpocById(meeting.spocId);
    const entity = getEntityById(meeting.entityId);
    const compliance = getComplianceById(meeting.complianceId);
    const complianceType = compliance ? getComplianceTypeById(compliance.complianceTypeId) : null;

    return (
      <Card key={meeting.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {meeting.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  icon={getStatusIcon(meeting.status)}
                  label={meeting.status}
                  color={getStatusColor(meeting.status)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={meeting.priority}
                  color={getPriorityColor(meeting.priority)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <IconButton onClick={(e) => handleMenuOpen(e, meeting)}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {formatDateTime(meeting.scheduledDateTime)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {meeting.duration} minutes
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {spoc?.name} - {spoc?.designation}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {entity && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Entity: {entity.name}
                  </Typography>
                </Box>
              )}
              
              {complianceType && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Compliance: {complianceType.name}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Type: {meeting.meetingType}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {meeting.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {meeting.description}
            </Typography>
          )}

          {meeting.agenda && meeting.agenda.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Agenda:
              </Typography>
              <List dense>
                {meeting.agenda.map((item, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemText primary={`${index + 1}. ${item}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
        
        <CardActions>
          {meeting.status === 'SCHEDULED' && isUpcoming(meeting.scheduledDateTime) && (
            <>
              <Button
                startIcon={<VideoCallIcon />}
                variant="contained"
                href={meeting.googleMeet?.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Meeting
              </Button>
              
              <Button
                startIcon={<LinkIcon />}
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(meeting.googleMeet?.joinUrl);
                  // You could add a snackbar notification here
                }}
              >
                Copy Link
              </Button>
            </>
          )}
          
          {meeting.status === 'COMPLETED' && meeting.recordings && meeting.recordings.length > 0 && (
            <Button
              startIcon={<VideoCallIcon />}
              variant="outlined"
              href={meeting.recordings[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Recording
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Meetings
            </Typography>
            <Typography variant="h4">
              {meetingStats.total}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Upcoming
            </Typography>
            <Typography variant="h4" color="primary">
              {meetingStats.upcoming}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h4" color="success.main">
              {meetingStats.completed}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Completion Rate
            </Typography>
            <Typography variant="h4" color="info.main">
              {Math.round(meetingStats.completionRate)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const getCurrentMeetings = () => {
    switch (activeTab) {
      case 0:
        return filteredMeetings.all;
      case 1:
        return filteredMeetings.upcoming;
      case 2:
        return filteredMeetings.completed;
      case 3:
        return filteredMeetings.cancelled;
      default:
        return filteredMeetings.all;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Meeting Dashboard
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/meetings/schedule')}
          >
            Schedule Meeting
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {renderStatsCards()}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabLabels.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Badge badgeContent={tab.count} color="primary">
                  {tab.label}
                </Badge>
              }
            />
          ))}
        </Tabs>
      </Paper>

      <Box>
        {getCurrentMeetings().length > 0 ? (
          getCurrentMeetings()
            .sort((a, b) => new Date(b.scheduledDateTime) - new Date(a.scheduledDateTime))
            .map(renderMeetingCard)
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No meetings found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {activeTab === 1 
                ? "You don't have any upcoming meetings scheduled."
                : "No meetings found for this category."
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/meetings/schedule')}
            >
              Schedule Your First Meeting
            </Button>
          </Paper>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          {selectedMeeting?.status === 'SCHEDULED' && isUpcoming(selectedMeeting?.scheduledDateTime) && (
            <>
              <ListItemButton onClick={() => handleAction('reschedule')}>
                <ListItemIcon>
                  <RescheduleIcon />
                </ListItemIcon>
                <ListItemText primary="Reschedule" />
              </ListItemButton>
              
              <ListItemButton onClick={() => handleAction('cancel')}>
                <ListItemIcon>
                  <CancelIcon />
                </ListItemIcon>
                <ListItemText primary="Cancel" />
              </ListItemButton>
              
              <Divider />
            </>
          )}
          
          <ListItemButton onClick={() => handleAction('notes')}>
            <ListItemIcon>
              <NotesIcon />
            </ListItemIcon>
            <ListItemText primary="Add Notes" />
          </ListItemButton>
        </MenuList>
      </Menu>

      {/* Action Dialogs */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'cancel' && 'Cancel Meeting'}
          {actionType === 'reschedule' && 'Reschedule Meeting'}
          {actionType === 'notes' && 'Meeting Notes'}
        </DialogTitle>
        
        <DialogContent>
          {actionType === 'cancel' && (
            <TextField
              label="Cancellation Reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
              required
            />
          )}
          
          {actionType === 'reschedule' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="New Date & Time"
                value={rescheduleDateTime}
                onChange={setRescheduleDateTime}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
            </LocalizationProvider>
          )}
          
          {actionType === 'notes' && (
            <TextField
              label="Meeting Notes"
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder="Add your notes about this meeting..."
            />
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleActionSubmit}
            variant="contained"
            disabled={
              (actionType === 'cancel' && !cancellationReason.trim()) ||
              (actionType === 'reschedule' && !rescheduleDateTime)
            }
          >
            {actionType === 'cancel' && 'Cancel Meeting'}
            {actionType === 'reschedule' && 'Reschedule'}
            {actionType === 'notes' && 'Save Notes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetingDashboard;