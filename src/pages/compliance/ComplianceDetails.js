import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent
} from '@mui/lab';
import {
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`compliance-tabpanel-${index}`}
      aria-labelledby={`compliance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ComplianceDetails = () => {
  const { complianceId } = useParams();
  const navigate = useNavigate();
  const { currentUser, hasPermission } = useAuth();
  const {
    getComplianceById,
    getComplianceTypeById,
    getEntityById,
    getDocumentsByCompliance,
    getSubmissionsByCompliance,
    updateComplianceStatus,
    updateWorkflowState,
    updateDocumentStatus
  } = useCompliance();

  const [compliance, setCompliance] = useState(null);
  const [complianceType, setComplianceType] = useState(null);
  const [entity, setEntity] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  // Load compliance data
  useEffect(() => {
    if (complianceId) {
      loadComplianceData();
    }
  }, [complianceId]);

  // Load compliance data and related information
  const loadComplianceData = () => {
    setLoading(true);
    setError('');

    try {
      // Get compliance data
      const complianceData = getComplianceById(complianceId);
      if (!complianceData) {
        setError('Compliance not found');
        setLoading(false);
        return;
      }

      setCompliance(complianceData);

      // Get compliance type
      const typeData = getComplianceTypeById(complianceData.complianceTypeId);
      setComplianceType(typeData);

      // Get entity data
      const entityData = getEntityById(complianceData.entityId);
      setEntity(entityData);

      // Get documents
      const documentData = getDocumentsByCompliance(complianceId);
      setDocuments(documentData);

      // Get submissions
      const submissionData = getSubmissionsByCompliance(complianceId);
      setSubmissions(submissionData);

      setLoading(false);
    } catch (err) {
      setError('Failed to load compliance data');
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle status update dialog
  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateComplianceStatus(complianceId, newStatus, currentUser.id);
      setStatusUpdateSuccess(true);
      handleCloseDialog();
      loadComplianceData();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  // Handle workflow state update
  const handleWorkflowUpdate = async (newState) => {
    try {
      await updateWorkflowState(complianceId, newState, currentUser.id);
      setStatusUpdateSuccess(true);
      handleCloseDialog();
      loadComplianceData();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update workflow state');
    }
  };

  // Handle document status update
  const handleDocumentStatusUpdate = async (documentId, newStatus) => {
    try {
      await updateDocumentStatus(documentId, newStatus, currentUser.id);
      loadComplianceData();
    } catch (err) {
      setError('Failed to update document status');
    }
  };

  // Handle navigate back
  const handleBack = () => {
    navigate('/compliance');
  };

  // Handle navigate to edit page
  const handleEdit = () => {
    navigate(`/compliance/edit/${complianceId}`);
  };

  // Handle navigate to upload document
  const handleUploadDocument = () => {
    navigate(`/documents/upload?complianceId=${complianceId}`);
  };

  // Handle navigate to submission
  const handleViewSubmission = (submissionId) => {
    navigate(`/portals/submissions/${submissionId}`);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckIcon />;
      case 'IN_PROGRESS':
        return <AccessTimeIcon />;
      case 'PENDING':
        return <WarningIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  // Helper function to get document status color
  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Helper function to format workflow state
  const formatWorkflowState = (state) => {
    return state
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Compliance List
        </Button>
      </Box>
    );
  }

  // If compliance not found
  if (!compliance || !complianceType || !entity) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Compliance information not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Compliance List
        </Button>
      </Box>
    );
  }

  // Calculate days remaining or overdue
  const dueDate = new Date(compliance.dueDate);
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0;

  // Define available workflow steps
  const workflowSteps = getWorkflowSteps(complianceType?.code);

  // Get current workflow step index
  const currentStepIndex = workflowSteps.findIndex(step => step.value === compliance.workflowState);

  return (
    <Box>
      {/* Success message */}
      {statusUpdateSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Compliance updated successfully
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          {complianceType.name}
        </Typography>
        {hasPermission('edit_compliance') && (
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            sx={{ ml: 2 }}
          >
            Edit
          </Button>
        )}
      </Box>

      {/* Status header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" component="div">
                {entity.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {entity.entityType} | CIN: {entity.cin}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} color={isOverdue ? 'error' : 'primary'} />
              <Typography variant="h6" component="div" color={isOverdue ? 'error.main' : 'text.primary'}>
                {isOverdue 
                  ? `Overdue by ${Math.abs(daysRemaining)} days` 
                  : `Due in ${daysRemaining} days`}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Due Date: {formatDate(compliance.dueDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Chip 
              label={compliance.status} 
              color={getStatusColor(compliance.status)}
              icon={getStatusIcon(compliance.status)}
              sx={{ fontWeight: 'bold', fontSize: '1rem', p: 2, height: 'auto' }}
            />
            {compliance.status !== 'COMPLETED' && hasPermission('edit_compliance') && (
              <Box sx={{ mt: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  onClick={() => handleOpenDialog('changeStatus')}
                >
                  Update Status
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Workflow Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Workflow Progress</Typography>
          {hasPermission('edit_compliance') && (
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => handleOpenDialog('changeWorkflow')}
            >
              Update Workflow
            </Button>
          )}
        </Box>
        <Stepper 
          activeStep={currentStepIndex !== -1 ? currentStepIndex : 0} 
          alternativeLabel
          sx={{ overflowX: 'auto' }}
        >
          {workflowSteps.map((step, index) => (
            <Step key={step.value}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="compliance tabs">
            <Tab label="Overview" id="compliance-tab-0" aria-controls="compliance-tabpanel-0" />
            <Tab label="Documents" id="compliance-tab-1" aria-controls="compliance-tabpanel-1" />
            <Tab label="History" id="compliance-tab-2" aria-controls="compliance-tabpanel-2" />
            <Tab label="Submissions" id="compliance-tab-3" aria-controls="compliance-tabpanel-3" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Compliance Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Compliance Type
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {complianceType.name}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {complianceType.category}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Frequency
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {complianceType.frequency}
                      </Typography>
                    </Grid>
                    
                    {compliance.financialYear && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Financial Year
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {compliance.financialYear}
                        </Typography>
                      </Grid>
                    )}
                    
                    {compliance.assessmentYear && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Assessment Year
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {compliance.assessmentYear}
                        </Typography>
                      </Grid>
                    )}
                    
                    {compliance.returnPeriod && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Return Period
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {`${compliance.returnPeriod.substring(0, 2)}/${compliance.returnPeriod.substring(2)}`}
                        </Typography>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {complianceType.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {compliance.metadata && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {Object.entries(compliance.metadata).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {formatMetadataKey(key)}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {formatMetadataValue(value)}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Assigned To
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {compliance.assignedTo === currentUser.id ? 'You' : 'Another Compliance Officer'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Required Documents</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={handleUploadDocument}
            >
              Upload Document
            </Button>
          </Box>
          
          {compliance.documents && compliance.documents.length > 0 ? (
            <Grid container spacing={2}>
              {compliance.documents.map((doc) => (
                <Grid item xs={12} key={doc.id}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            {doc.documentType}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Chip 
                          label={doc.status} 
                          color={getDocumentStatusColor(doc.status)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6} md={4} sx={{ textAlign: 'right' }}>
                        {hasPermission('verify_documents') && doc.status === 'PENDING' && (
                          <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleDocumentStatusUpdate(doc.id, 'VERIFIED')}
                          >
                            Verify
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                        >
                          View
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No documents uploaded yet. Required documents for this compliance should be uploaded.
            </Alert>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Required Document Types
            </Typography>
            <List>
              {complianceType.requiredDocuments && complianceType.requiredDocuments.map((docType) => {
                const isUploaded = compliance.documents && compliance.documents.some(doc => doc.documentType === docType);
                
                return (
                  <ListItem key={docType}>
                    <ListItemIcon>
                      {isUploaded ? <CheckIcon color="success" /> : <WarningIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={docType}
                      secondary={isUploaded ? 'Uploaded' : 'Not uploaded yet'}
                    />
                    {!isUploaded && (
                      <ListItemSecondaryAction>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UploadIcon />}
                          onClick={() => navigate(`/documents/upload?complianceId=${complianceId}&documentType=${docType}`)}
                        >
                          Upload
                        </Button>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Compliance Timeline
          </Typography>
          
          {compliance.history && compliance.history.length > 0 ? (
            <Timeline position="alternate">
              {compliance.history.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary">
                    {new Date(event.timestamp).toLocaleString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getTimelineDotColor(event.state)} />
                    {index < compliance.history.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {formatWorkflowState(event.state)}
                    </Typography>
                    <Typography>
                      Updated by {event.user === currentUser.id ? 'You' : 'Compliance Officer'}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          ) : (
            <Alert severity="info">
              No history available for this compliance.
            </Alert>
          )}
        </TabPanel>

        {/* Submissions Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Portal Submissions</Typography>
            {submissions.length === 0 && compliance.status !== 'COMPLETED' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={() => navigate(`/portals?complianceId=${complianceId}`)}
              >
                Submit to Portal
              </Button>
            )}
          </Box>
          
          {submissions && submissions.length > 0 ? (
            <List>
              {submissions.map((submission) => (
                <Paper key={submission.id} sx={{ mb: 2, p: 0 }}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <Button
                        variant="outlined"
                        onClick={() => handleViewSubmission(submission.id)}
                      >
                        View Details
                      </Button>
                    }
                  >
                    <ListItemIcon>
                      <CloudUploadIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {submission.portalType} - {submission.formType}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            Status: {submission.submissionStatus}
                          </Typography>
                          <Typography variant="body2" display="block">
                            Submitted: {new Date(submission.submissionTimeline.submitted).toLocaleString()}
                          </Typography>
                          {submission.portalReferenceIds && submission.portalReferenceIds.srn && (
                            <Typography variant="body2">
                              SRN: {submission.portalReferenceIds.srn}
                            </Typography>
                          )}
                          {submission.acknowledgment && (
                            <Typography variant="body2">
                              Acknowledgment: {submission.acknowledgment.acknowledgmentNumber}
                            </Typography>
                          )}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No submissions have been made for this compliance.
            </Alert>
          )}
        </TabPanel>
      </Box>

      {/* Status Update Dialog */}
      <Dialog open={openDialog && dialogAction === 'changeStatus'} onClose={handleCloseDialog}>
        <DialogTitle>Update Compliance Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the status of this compliance item:
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="outlined" 
                  color="warning" 
                  fullWidth
                  onClick={() => handleStatusUpdate('PENDING')}
                  disabled={compliance.status === 'PENDING'}
                >
                  Pending
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  disabled={compliance.status === 'IN_PROGRESS'}
                >
                  In Progress
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  variant="outlined" 
                  color="success" 
                  fullWidth
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={compliance.status === 'COMPLETED'}
                >
                  Completed
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Update Dialog */}
      <Dialog open={openDialog && dialogAction === 'changeWorkflow'} onClose={handleCloseDialog}>
        <DialogTitle>Update Workflow State</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the workflow state of this compliance item:
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <List>
              {workflowSteps.map((step) => (
                <ListItem 
                  key={step.value}
                  button
                  selected={compliance.workflowState === step.value}
                  onClick={() => handleWorkflowUpdate(step.value)}
                >
                  <ListItemIcon>
                    {compliance.workflowState === step.value ? <CheckIcon color="primary" /> : <AssignmentIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={step.label}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to format metadata key
const formatMetadataKey = (key) => {
  return key
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to format metadata value
const formatMetadataValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

// Helper function to get timeline dot color
const getTimelineDotColor = (state) => {
  if (state === 'ACKNOWLEDGED' || state === 'COMPLETED') {
    return 'success';
  }
  if (state === 'FILED' || state === 'DIGITAL_SIGNING') {
    return 'primary';
  }
  if (state.includes('DATA') || state.includes('PREPARATION') || state.includes('COLLECTION')) {
    return 'info';
  }
  if (state.includes('REVIEW')) {
    return 'warning';
  }
  return 'grey';
};

// Helper function to get workflow steps based on compliance type
const getWorkflowSteps = (complianceTypeCode) => {
  // Define workflows based on compliance type
  switch (complianceTypeCode) {
    case 'MCA_ANNUAL_RETURN':
      return [
        { value: 'DATA_COLLECTION', label: 'Data Collection' },
        { value: 'FORM_PREPARATION', label: 'Form Preparation' },
        { value: 'INTERNAL_REVIEW', label: 'Internal Review' },
        { value: 'CLIENT_REVIEW', label: 'Client Review' },
        { value: 'DIGITAL_SIGNING', label: 'Digital Signing' },
        { value: 'FILED', label: 'Filed' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
    case 'MCA_FINANCIAL_STATEMENTS':
      return [
        { value: 'FINANCIAL_DATA_COLLECTION', label: 'Financial Data Collection' },
        { value: 'AUDITOR_REVIEW', label: 'Auditor Review' },
        { value: 'FORM_PREPARATION', label: 'Form Preparation' },
        { value: 'INTERNAL_REVIEW', label: 'Internal Review' },
        { value: 'CLIENT_REVIEW', label: 'Client Review' },
        { value: 'DIGITAL_SIGNING', label: 'Digital Signing' },
        { value: 'FILED', label: 'Filed' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
    case 'DIRECTOR_KYC':
      return [
        { value: 'DIRECTOR_DATA_COLLECTION', label: 'Director Data Collection' },
        { value: 'DOCUMENT_COLLECTION', label: 'Document Collection' },
        { value: 'VERIFICATION', label: 'Verification' },
        { value: 'FORM_PREPARATION', label: 'Form Preparation' },
        { value: 'DIRECTOR_REVIEW', label: 'Director Review' },
        { value: 'DIGITAL_SIGNING', label: 'Digital Signing' },
        { value: 'FILED', label: 'Filed' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
    case 'GST_MONTHLY_RETURN':
    case 'GST_RETURN':
      return [
        { value: 'TRANSACTION_DATA_COLLECTION', label: 'Transaction Data Collection' },
        { value: 'DATA_VALIDATION', label: 'Data Validation' },
        { value: 'RECONCILIATION', label: 'Reconciliation' },
        { value: 'FORM_PREPARATION', label: 'Form Preparation' },
        { value: 'CLIENT_REVIEW', label: 'Client Review' },
        { value: 'TAX_PAYMENT', label: 'Tax Payment' },
        { value: 'FILED', label: 'Filed' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
    case 'GST_ANNUAL_RETURN':
      return [
        { value: 'ANNUAL_DATA_COMPILATION', label: 'Annual Data Compilation' },
        { value: 'RECONCILIATION_WITH_FINANCIALS', label: 'Reconciliation with Financials' },
        { value: 'FORM_PREPARATION', label: 'Form Preparation' },
        { value: 'INTERNAL_REVIEW', label: 'Internal Review' },
        { value: 'CLIENT_REVIEW', label: 'Client Review' },
        { value: 'FINAL_CALCULATION', label: 'Final Calculation' },
        { value: 'ADDITIONAL_PAYMENT', label: 'Additional Payment' },
        { value: 'FILED', label: 'Filed' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
    case 'INCOME_TAX_RETURN':
      return [
        { value: 'FINANCIAL_DATA_COLLECTION', label: 'Financial Data Collection' },
        { value: 'TAX_AUDIT', label: 'Tax Audit' },
        { value: 'TAX_CALCULATION', label: 'Tax Calculation' },
        { value: 'FORM_PREPARATION', label: 'Form Preparation' },
        { value: 'INTERNAL_REVIEW', label: 'Internal Review' },
        { value: 'CLIENT_REVIEW', label: 'Client Review' },
        { value: 'DIGITAL_SIGNING', label: 'Digital Signing' },
        { value: 'FILED', label: 'Filed' },
        { value: 'VERIFICATION_PROCESS', label: 'Verification Process' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
    default:
      return [
        { value: 'DATA_COLLECTION', label: 'Data Collection' },
        { value: 'DOCUMENT_PREPARATION', label: 'Document Preparation' },
        { value: 'REVIEW', label: 'Review' },
        { value: 'APPROVAL', label: 'Approval' },
        { value: 'SUBMISSION', label: 'Submission' },
        { value: 'ACKNOWLEDGED', label: 'Acknowledged' }
      ];
  }
};

export default ComplianceDetails;