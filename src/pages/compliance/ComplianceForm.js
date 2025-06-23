import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Divider,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CircularProgress,
  Autocomplete,
  Snackbar,
  Switch,
  FormGroup,
  FormControlLabel,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CalendarMonth as CalendarMonthIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  NotificationsActive as NotificationsActiveIcon,
  Business as BusinessIcon,
  PermContactCalendar as PermContactCalendarIcon,
  Description as DescriptionIcon,
  Accessibility as AccessibilityIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

const ComplianceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // compliance ID for edit mode
  const isEditMode = Boolean(id);
  
  const { currentUser } = useAuth();
  const { 
    compliances, 
    complianceTypes, 
    entities, 
    getComplianceById, 
    getComplianceTypeById, 
    getEntityById,
    createCompliance,
    updateCompliance,
    loading,
    error
  } = useCompliance();
  
  // Form state
  const [formData, setFormData] = useState({
    entityId: '',
    complianceTypeId: '',
    financialYear: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    description: '',
    assignedTo: [],
    documents: [],
    reminders: [],
    notes: ''
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // UI state
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [enableAutoReminders, setEnableAutoReminders] = useState(true);
  
  // Load compliance data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const compliance = getComplianceById(id);
      if (compliance) {
        setFormData({
          ...compliance,
          // Ensure all required fields exist even if the loaded data doesn't have them
          assignedTo: compliance.assignedTo || [],
          documents: compliance.documents || [],
          reminders: compliance.reminders || [],
          notes: compliance.notes || ''
        });
      }
    }
  }, [isEditMode, id, getComplianceById]);
  
  // Effect to update compliance type-specific fields when type changes
  useEffect(() => {
    if (formData.complianceTypeId) {
      const complianceType = getComplianceTypeById(formData.complianceTypeId);
      if (complianceType) {
        // Here you could set default values based on compliance type
        // For example, set default required documents, etc.
      }
    }
  }, [formData.complianceTypeId, getComplianceTypeById]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle assignee changes
  const handleAssigneesChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: newValue
    }));
  };
  
  // Handle reminder add
  const handleAddReminder = () => {
    const newReminder = {
      id: `reminder-${Date.now()}`,
      date: '',
      type: 'EMAIL',
      recipients: [],
      message: '',
      status: 'SCHEDULED'
    };
    
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, newReminder]
    }));
  };
  
  // Handle reminder remove
  const handleRemoveReminder = (reminderId) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(reminder => reminder.id !== reminderId)
    }));
  };
  
  // Handle reminder field change
  const handleReminderChange = (reminderId, field, value) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, [field]: value } 
          : reminder
      )
    }));
  };
  
  // Handle document add
  const handleAddDocument = () => {
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: '',
      type: '',
      required: true,
      status: 'PENDING',
      description: ''
    };
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
  };
  
  // Handle document remove
  const handleRemoveDocument = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };
  
  // Handle document field change
  const handleDocumentChange = (documentId, field, value) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, [field]: value } 
          : doc
      )
    }));
  };
  
  // Generate auto reminders
  const generateAutoReminders = () => {
    if (!formData.dueDate) return;
    
    const dueDate = new Date(formData.dueDate);
    
    // Clear existing reminders
    const reminders = [];
    
    // Add reminders at 30, 15, and 5 days before due date
    const reminderDays = [30, 15, 5];
    
    reminderDays.forEach(days => {
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - days);
      
      // Skip if reminder date is in the past
      if (reminderDate < new Date()) return;
      
      reminders.push({
        id: `reminder-${Date.now()}-${days}`,
        date: reminderDate.toISOString().split('T')[0],
        type: 'EMAIL',
        recipients: [],
        message: `Reminder: ${days} days until compliance due date`,
        status: 'SCHEDULED'
      });
    });
    
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, ...reminders]
    }));
  };
  
  // Handle step navigation
  const handleNext = () => {
    // Validate current step before proceeding
    const isValid = validateStep(activeStep);
    if (isValid) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Validate step fields
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};
    
    switch (step) {
      case 0: // Basic Information
        if (!formData.entityId) {
          newErrors.entityId = 'Entity is required';
          isValid = false;
        }
        
        if (!formData.complianceTypeId) {
          newErrors.complianceTypeId = 'Compliance type is required';
          isValid = false;
        }
        
        if (!formData.financialYear) {
          newErrors.financialYear = 'Financial year is required';
          isValid = false;
        }
        
        if (!formData.dueDate) {
          newErrors.dueDate = 'Due date is required';
          isValid = false;
        }
        break;
        
      case 1: // Documents
        // No required validation for documents
        break;
        
      case 2: // Reminders & Assignments
        // No required validation for reminders and assignments
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Validate all form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate basic information
    if (!formData.entityId) {
      newErrors.entityId = 'Entity is required';
      isValid = false;
    }
    
    if (!formData.complianceTypeId) {
      newErrors.complianceTypeId = 'Compliance type is required';
      isValid = false;
    }
    
    if (!formData.financialYear) {
      newErrors.financialYear = 'Financial year is required';
      isValid = false;
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    if (!isValid) {
      // Find the first step with an error and navigate to it
      const errorSteps = Object.keys(errors).map(field => {
        if (field === 'entityId' || field === 'complianceTypeId' || field === 'financialYear' || field === 'dueDate') {
          return 0; // Basic Information step
        } else if (field === 'documents') {
          return 1; // Documents step
        } else if (field === 'assignedTo' || field === 'reminders') {
          return 2; // Reminders & Assignments step
        }
        return -1;
      }).filter(step => step !== -1);
      
      if (errorSteps.length > 0) {
        setActiveStep(Math.min(...errorSteps));
      }
      
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        ...formData,
        // Add metadata
        updatedAt: new Date().toISOString(),
      };
      
      if (!isEditMode) {
        // Add creation metadata for new compliance
        submissionData.createdAt = new Date().toISOString();
        submissionData.createdBy = currentUser.id;
      }
      
      // Save the compliance
      if (isEditMode) {
        await updateCompliance(id, submissionData);
      } else {
        await createCompliance(submissionData);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: isEditMode ? 'Compliance updated successfully' : 'Compliance created successfully',
        severity: 'success'
      });
      
      // Navigate back to list after a short delay
      setTimeout(() => {
        navigate('/compliance/list');
      }, 1500);
    } catch (err) {
      console.error('Error saving compliance:', err);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} compliance. Please try again.`,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Mock data for assignees
  const mockAssignees = [
    { id: 'user-1', name: 'John Doe', role: 'Compliance Officer' },
    { id: 'user-2', name: 'Jane Smith', role: 'Director' },
    { id: 'user-3', name: 'Robert Johnson', role: 'Company Secretary' },
    { id: 'user-4', name: 'Emily Williams', role: 'CFO' },
    { id: 'user-5', name: 'Michael Brown', role: 'Legal Advisor' }
  ];
  
  // Create form steps
  const steps = [
    {
      label: 'Basic Information',
      description: 'Enter the core compliance details',
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.entityId)}>
              <InputLabel id="entity-label">Entity *</InputLabel>
              <Select
                labelId="entity-label"
                id="entityId"
                name="entityId"
                value={formData.entityId}
                label="Entity *"
                onChange={handleChange}
              >
                {entities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.entityId && <FormHelperText>{errors.entityId}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.complianceTypeId)}>
              <InputLabel id="compliance-type-label">Compliance Type *</InputLabel>
              <Select
                labelId="compliance-type-label"
                id="complianceTypeId"
                name="complianceTypeId"
                value={formData.complianceTypeId}
                label="Compliance Type *"
                onChange={handleChange}
              >
                {complianceTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.complianceTypeId && <FormHelperText>{errors.complianceTypeId}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.financialYear)}>
              <InputLabel id="financial-year-label">Financial Year *</InputLabel>
              <Select
                labelId="financial-year-label"
                id="financialYear"
                name="financialYear"
                value={formData.financialYear}
                label="Financial Year *"
                onChange={handleChange}
              >
                <MenuItem value="2023-24">2023-24</MenuItem>
                <MenuItem value="2022-23">2022-23</MenuItem>
                <MenuItem value="2021-22">2021-22</MenuItem>
                <MenuItem value="2020-21">2020-21</MenuItem>
              </Select>
              {errors.financialYear && <FormHelperText>{errors.financialYear}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date *"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleChange}
              >
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description of the compliance requirement"
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Required Documents',
      description: 'Specify the documents needed for this compliance',
      content: (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Required Documents</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddDocument}
            >
              Add Document
            </Button>
          </Box>
          
          {formData.documents.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No documents added yet. Add required documents for this compliance.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {formData.documents.map((document, index) => (
                <Card key={document.id} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Document {index + 1}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRemoveDocument(document.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Document Name"
                          name="name"
                          value={document.name}
                          onChange={(e) => handleDocumentChange(document.id, 'name', e.target.value)}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`document-type-label-${index}`}>Document Type</InputLabel>
                          <Select
                            labelId={`document-type-label-${index}`}
                            value={document.type}
                            label="Document Type"
                            onChange={(e) => handleDocumentChange(document.id, 'type', e.target.value)}
                          >
                            <MenuItem value="FINANCIAL_STATEMENT">Financial Statement</MenuItem>
                            <MenuItem value="ANNUAL_RETURN">Annual Return</MenuItem>
                            <MenuItem value="TAX_FILING">Tax Filing</MenuItem>
                            <MenuItem value="BOARD_RESOLUTION">Board Resolution</MenuItem>
                            <MenuItem value="CERTIFICATE">Certificate</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`document-status-label-${index}`}>Status</InputLabel>
                          <Select
                            labelId={`document-status-label-${index}`}
                            value={document.status}
                            label="Status"
                            onChange={(e) => handleDocumentChange(document.id, 'status', e.target.value)}
                          >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="UPLOADED">Uploaded</MenuItem>
                            <MenuItem value="VERIFIED">Verified</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={document.required}
                              onChange={(e) => handleDocumentChange(document.id, 'required', e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Required"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={2}
                          value={document.description}
                          onChange={(e) => handleDocumentChange(document.id, 'description', e.target.value)}
                          size="small"
                          placeholder="Document details or requirements"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" icon={<InfoIcon />}>
              Documents can be uploaded after saving the compliance item.
            </Alert>
          </Box>
        </Box>
      )
    },
    {
      label: 'Reminders & Assignments',
      description: 'Set up notifications and assign responsibilities',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Assign Stakeholders
          </Typography>
          
          <Autocomplete
            multiple
            options={mockAssignees}
            getOptionLabel={(option) => `${option.name} (${option.role})`}
            value={formData.assignedTo}
            onChange={handleAssigneesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assignees"
                placeholder="Select stakeholders responsible for this compliance"
                fullWidth
                margin="normal"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={`${option.name} (${option.role})`}
                  {...getTagProps({ index })}
                  avatar={<PermContactCalendarIcon />}
                />
              ))
            }
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Reminders</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableAutoReminders}
                    onChange={(e) => setEnableAutoReminders(e.target.checked)}
                    color="primary"
                  />
                }
                label="Auto-generate reminders"
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddReminder}
                sx={{ ml: 2 }}
              >
                Add Reminder
              </Button>
            </Box>
          </Box>
          
          {formData.reminders.length === 0 ? (
            <Box sx={{ mb: 2 }}>
              {enableAutoReminders ? (
                <Alert 
                  severity="info" 
                  action={
                    <Button 
                      color="inherit" 
                      size="small"
                      onClick={generateAutoReminders}
                      disabled={!formData.dueDate}
                    >
                      Generate Now
                    </Button>
                  }
                >
                  {formData.dueDate 
                    ? "Automatic reminders will be generated based on the due date." 
                    : "Set a due date to enable automatic reminder generation."}
                </Alert>
              ) : (
                <Alert severity="info">
                  No reminders added yet. Add reminders to notify stakeholders about this compliance.
                </Alert>
              )}
            </Box>
          ) : (
            <Stack spacing={2} sx={{ mb: 3 }}>
              {formData.reminders.map((reminder, index) => (
                <Card key={reminder.id} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Reminder {index + 1}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRemoveReminder(reminder.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Reminder Date"
                          type="date"
                          value={reminder.date}
                          onChange={(e) => handleReminderChange(reminder.id, 'date', e.target.value)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`reminder-type-label-${index}`}>Notification Type</InputLabel>
                          <Select
                            labelId={`reminder-type-label-${index}`}
                            value={reminder.type}
                            label="Notification Type"
                            onChange={(e) => handleReminderChange(reminder.id, 'type', e.target.value)}
                          >
                            <MenuItem value="EMAIL">Email</MenuItem>
                            <MenuItem value="SMS">SMS</MenuItem>
                            <MenuItem value="APP">App Notification</MenuItem>
                            <MenuItem value="WHATSAPP">WhatsApp</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          options={mockAssignees}
                          getOptionLabel={(option) => `${option.name} (${option.role})`}
                          value={reminder.recipients}
                          onChange={(event, newValue) => {
                            handleReminderChange(reminder.id, 'recipients', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Recipients"
                              placeholder="Select recipients for this reminder"
                              size="small"
                            />
                          )}
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={2}
                          value={reminder.message}
                          onChange={(e) => handleReminderChange(reminder.id, 'message', e.target.value)}
                          size="small"
                          placeholder="Reminder message content"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Additional Notes
          </Typography>
          
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes or comments about this compliance"
          />
        </Box>
      )
    }
  ];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/compliance/list')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {isEditMode ? 'Edit Compliance' : 'Create New Compliance'}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle1">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {step.description}
                  </Typography>
                  
                  {step.content}
                  
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>
                All steps completed - Review and save
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusinessIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Basic Information</Typography>
                      </Box>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Entity:</strong> {getEntityById(formData.entityId)?.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Type:</strong> {getComplianceTypeById(formData.complianceTypeId)?.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Financial Year:</strong> {formData.financialYear}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Due Date:</strong> {new Date(formData.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Priority:</strong> {formData.priority}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> {formData.status}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Description:</strong> {formData.description || 'No description provided'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Documents & Assignments</Typography>
                      </Box>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Required Documents:</strong> {formData.documents.length}
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Assigned To:</strong> {formData.assignedTo.length > 0 
                          ? formData.assignedTo.map(a => a.name).join(', ') 
                          : 'No assignees'}
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Reminders:</strong> {formData.reminders.length}
                      </Typography>
                      
                      <Typography variant="body2">
                        <strong>Notes:</strong> {formData.notes || 'No additional notes'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    isEditMode ? 'Update Compliance' : 'Save Compliance'
                  )}
                </Button>
              </Box>
            </Paper>
          )}
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComplianceForm;