import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  AddCircle as AddCircleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portal-tabpanel-${index}`}
      aria-labelledby={`portal-tab-${index}`}
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

const PortalIntegrations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const complianceIdParam = queryParams.get('complianceId');
  
  const { currentUser } = useAuth();
  const { 
    entities, 
    compliances, 
    complianceTypes, 
    getComplianceById, 
    getComplianceTypeById, 
    getEntityById,
    createSubmission 
  } = useCompliance();
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [selectedCompliance, setSelectedCompliance] = useState(
    complianceIdParam ? getComplianceById(complianceIdParam) : null
  );
  const [selectedEntity, setSelectedEntity] = useState(
    selectedCompliance ? getEntityById(selectedCompliance.entityId) : null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState(0);
  const [formData, setFormData] = useState({
    formType: '',
    financialYear: '',
    preparationStatus: false,
    documentStatus: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  
  // Define available portals
  const availablePortals = [
    {
      id: 'mca-portal',
      name: 'MCA Portal',
      description: 'Ministry of Corporate Affairs portal for company filings',
      icon: <AccountBalanceIcon sx={{ fontSize: 60 }} />,
      color: '#3f51b5',
      formTypes: ['AOC-4', 'MGT-7', 'DIR-3 KYC', 'INC-20A', 'INC-22A', 'MGT-14', 'ADT-1'],
      requiredCredentials: ['DSC', 'MCA Login'],
      complianceTypes: ['MCA_ANNUAL_RETURN', 'MCA_FINANCIAL_STATEMENTS', 'DIRECTOR_KYC']
    },
    {
      id: 'gst-portal',
      name: 'GST Portal',
      description: 'Goods and Services Tax filing portal',
      icon: <ReceiptIcon sx={{ fontSize: 60 }} />,
      color: '#4caf50',
      formTypes: ['GSTR-1', 'GSTR-3B', 'GSTR-9'],
      requiredCredentials: ['GST Login', 'DSC'],
      complianceTypes: ['GST_MONTHLY_RETURN', 'GST_ANNUAL_RETURN']
    },
    {
      id: 'income-tax-portal',
      name: 'Income Tax Portal',
      description: 'Income Tax e-filing portal for ITR and TDS returns',
      icon: <AssignmentIcon sx={{ fontSize: 60 }} />,
      color: '#ff9800',
      formTypes: ['ITR-6', 'Form 26Q', 'Form 24Q'],
      requiredCredentials: ['Income Tax Login', 'DSC/EVC'],
      complianceTypes: ['INCOME_TAX_RETURN']
    }
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle portal selection
  const handlePortalSelect = (portal) => {
    setSelectedPortal(portal);
    setOpenDialog(true);
    setDialogStep(0);
    setFormData({
      formType: '',
      financialYear: '',
      preparationStatus: false,
      documentStatus: false
    });
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogStep(0);
  };
  
  // Handle form data change
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle compliance selection
  const handleComplianceSelect = (complianceId) => {
    const compliance = getComplianceById(complianceId);
    setSelectedCompliance(compliance);
    
    if (compliance) {
      setSelectedEntity(getEntityById(compliance.entityId));
      
      // Auto-select form type based on compliance type
      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
      if (complianceType) {
        switch (complianceType.code) {
          case 'MCA_ANNUAL_RETURN':
            setFormData({
              ...formData,
              formType: 'MGT-7',
              financialYear: compliance.financialYear
            });
            break;
          case 'MCA_FINANCIAL_STATEMENTS':
            setFormData({
              ...formData,
              formType: 'AOC-4',
              financialYear: compliance.financialYear
            });
            break;
          case 'DIRECTOR_KYC':
            setFormData({
              ...formData,
              formType: 'DIR-3 KYC',
              financialYear: compliance.financialYear
            });
            break;
          case 'GST_MONTHLY_RETURN':
            setFormData({
              ...formData,
              formType: 'GSTR-3B',
              financialYear: compliance.financialYear
            });
            break;
          case 'GST_ANNUAL_RETURN':
            setFormData({
              ...formData,
              formType: 'GSTR-9',
              financialYear: compliance.financialYear
            });
            break;
          case 'INCOME_TAX_RETURN':
            setFormData({
              ...formData,
              formType: 'ITR-6',
              financialYear: compliance.financialYear
            });
            break;
          default:
            break;
        }
      }
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    setDialogStep(dialogStep + 1);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setDialogStep(dialogStep - 1);
  };
  
  // Handle submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError('');
    
    try {
      // In a real application, this would make an API call
      // For mockup, we'll simulate a submission
      
      // Create mock portal reference IDs
      const portalReferenceIds = {
        srn: `SRN${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        challanId: `CH${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        acknowledgmentId: `ACK${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`
      };
      
      // Create submission data
      const submissionData = {
        entityId: selectedEntity.id,
        complianceId: selectedCompliance.id,
        portalType: selectedPortal.name.replace(' ', '_').toUpperCase(),
        formType: formData.formType,
        financialYear: formData.financialYear,
        submissionStatus: 'SUBMITTED',
        submissionTimeline: {
          prepared: new Date().toISOString(),
          validated: new Date().toISOString(),
          submitted: new Date().toISOString()
        },
        portalReferenceIds,
        submittedBy: currentUser.id,
        submissionData: {
          dataHash: Math.random().toString(36).substring(2, 15),
          dataSnapshotId: `SNAP${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`
        },
        responses: [
          {
            timestamp: new Date().toISOString(),
            status: 'RECEIVED',
            message: 'Filing received for processing',
            referenceId: portalReferenceIds.srn
          }
        ]
      };
      
      // Submit to the server (mock)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create submission
      const newSubmission = await createSubmission(submissionData);
      
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      
      // Reset after 3 seconds and navigate to submission details
      setTimeout(() => {
        setSubmissionSuccess(false);
        handleCloseDialog();
        navigate(`/portals/submissions/${newSubmission.id}`);
      }, 3000);
    } catch (err) {
      setSubmissionError('Failed to submit to portal. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Get available compliances for a portal
  const getAvailableCompliances = (portal) => {
    if (!portal) return [];
    
    return compliances.filter(compliance => {
      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
      return (
        complianceType && 
        portal.complianceTypes.includes(complianceType.code) &&
        (compliance.status === 'PENDING' || compliance.status === 'IN_PROGRESS')
      );
    });
  };
  
  // Render portal cards
  const renderPortalCards = () => {
    return (
      <Grid container spacing={3}>
        {availablePortals.map((portal) => (
          <Grid item xs={12} sm={6} md={4} key={portal.id}>
            <Card>
              <CardActionArea onClick={() => handlePortalSelect(portal)}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: portal.color,
                  height: 120,
                  color: 'white'
                }}>
                  {portal.icon}
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {portal.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {portal.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Forms:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {portal.formTypes.slice(0, 3).map((form) => (
                        <Chip key={form} label={form} size="small" sx={{ mb: 0.5 }} />
                      ))}
                      {portal.formTypes.length > 3 && (
                        <Chip label={`+${portal.formTypes.length - 3} more`} size="small" variant="outlined" />
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render credential management UI
  const renderCredentialManagement = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Portal Credentials
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Manage your credentials for various government portals. These credentials are securely stored and used for automated submissions.
        </Alert>
        
        <Grid container spacing={3}>
          {availablePortals.map((portal) => (
            <Grid item xs={12} key={portal.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    mr: 2, 
                    bgcolor: portal.color, 
                    width: 50, 
                    height: 50, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'white',
                    borderRadius: 1
                  }}>
                    {portal.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {portal.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {portal.description}
                    </Typography>
                  </Box>
                  <Button variant="outlined" startIcon={<SettingsIcon />}>
                    Manage Credentials
                  </Button>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {portal.requiredCredentials.map((credential) => (
                    <ListItem key={credential}>
                      <ListItemIcon>
                        <VpnKeyIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={credential}
                        secondary={
                          credential === 'DSC' 
                            ? 'Digital Signature Certificate for electronic signing'
                            : `Login credentials for ${portal.name}`
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label="Configured"
                          color="success"
                          size="small"
                          icon={<CheckIcon />}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  // Render submission history
  const renderSubmissionHistory = () => {
    // Mock submission history data
    const mockSubmissions = [
      {
        id: 'sub-001',
        portalType: 'MCA_PORTAL',
        formType: 'MGT-7',
        entityName: 'XYZ Private Limited',
        financialYear: '2022-23',
        submissionDate: '2023-10-15T14:30:00Z',
        status: 'ACKNOWLEDGED',
        referenceNumber: 'T12345678'
      },
      {
        id: 'sub-002',
        portalType: 'MCA_PORTAL',
        formType: 'AOC-4',
        entityName: 'XYZ Private Limited',
        financialYear: '2022-23',
        submissionDate: '2023-10-10T10:45:00Z',
        status: 'ACKNOWLEDGED',
        referenceNumber: 'T87654321'
      },
      {
        id: 'sub-003',
        portalType: 'GST_PORTAL',
        formType: 'GSTR-3B',
        entityName: 'XYZ Private Limited',
        financialYear: '2022-23',
        submissionDate: '2023-06-18T15:30:00Z',
        status: 'ACKNOWLEDGED',
        referenceNumber: 'GST1234567890'
      }
    ];
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Recent Submissions
        </Typography>
        
        <List>
          {mockSubmissions.map((submission) => (
            <Paper key={submission.id} sx={{ mb: 2 }}>
              <ListItem
                button
                onClick={() => navigate(`/portals/submissions/${submission.id}`)}
              >
                <ListItemIcon>
                  {submission.portalType === 'MCA_PORTAL' && <AccountBalanceIcon color="primary" />}
                  {submission.portalType === 'GST_PORTAL' && <ReceiptIcon color="success" />}
                  {submission.portalType === 'INCOME_TAX_PORTAL' && <AssignmentIcon color="warning" />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {submission.formType}
                      </Typography>
                      <Chip 
                        label={submission.status} 
                        color="success" 
                        size="small" 
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {submission.entityName} • {submission.financialYear}
                      </Typography>
                      <Typography variant="body2">
                        Submitted on {new Date(submission.submissionDate).toLocaleDateString()} • 
                        Ref: {submission.referenceNumber}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => navigate(`/portals/submissions/${submission.id}`)}>
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/portals/submissions')}
          >
            View All Submissions
          </Button>
        </Box>
      </Box>
    );
  };
  
  // Render dialog content based on step
  const renderDialogContent = () => {
    switch (dialogStep) {
      case 0:
        return (
          <>
            <DialogTitle>
              Submit to {selectedPortal?.name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 3 }}>
                Select the compliance you want to submit to {selectedPortal?.name}.
              </DialogContentText>
              
              {complianceIdParam ? (
                <Box sx={{ mb: 3 }}>
                  <Alert severity="info">
                    Using pre-selected compliance: {
                      selectedCompliance ? (
                        <>
                          {getComplianceTypeById(selectedCompliance.complianceTypeId)?.name} for {selectedEntity?.name}
                        </>
                      ) : 'Unknown compliance'
                    }
                  </Alert>
                </Box>
              ) : (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="compliance-select-label">Select Compliance</InputLabel>
                  <Select
                    labelId="compliance-select-label"
                    id="compliance-select"
                    value={selectedCompliance?.id || ''}
                    label="Select Compliance"
                    onChange={(e) => handleComplianceSelect(e.target.value)}
                  >
                    {getAvailableCompliances(selectedPortal).map((compliance) => {
                      const entity = getEntityById(compliance.entityId);
                      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                      
                      return (
                        <MenuItem key={compliance.id} value={compliance.id}>
                          {complianceType?.name} - {entity?.name} ({compliance.financialYear})
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="form-type-label">Form Type</InputLabel>
                <Select
                  labelId="form-type-label"
                  id="form-type"
                  name="formType"
                  value={formData.formType}
                  label="Form Type"
                  onChange={handleFormDataChange}
                >
                  {selectedPortal?.formTypes.map((formType) => (
                    <MenuItem key={formType} value={formType}>
                      {formType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="financial-year-label">Financial Year</InputLabel>
                <Select
                  labelId="financial-year-label"
                  id="financial-year"
                  name="financialYear"
                  value={formData.financialYear}
                  label="Financial Year"
                  onChange={handleFormDataChange}
                >
                  <MenuItem value="2023-24">2023-24</MenuItem>
                  <MenuItem value="2022-23">2022-23</MenuItem>
                  <MenuItem value="2021-22">2021-22</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                onClick={handleNextStep}
                disabled={!selectedCompliance || !formData.formType || !formData.financialYear}
                variant="contained"
              >
                Next
              </Button>
            </DialogActions>
          </>
        );
      
      case 1:
        return (
          <>
            <DialogTitle>
              Verify Submission Requirements
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 3 }}>
                Please verify that all requirements are met before submitting to {selectedPortal?.name}.
              </DialogContentText>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                You are about to submit {formData.formType} for {selectedEntity?.name} ({formData.financialYear})
              </Alert>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    {selectedCompliance?.documents?.filter(doc => doc.status === 'VERIFIED').length > 0 ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Required Documents"
                    secondary={
                      selectedCompliance?.documents?.filter(doc => doc.status === 'VERIFIED').length > 0 ?
                      "All required documents have been verified" :
                      "Some required documents are missing or not verified"
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Portal Credentials"
                    secondary="Credentials are configured and valid"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Form Data"
                    secondary="Form data is ready for submission"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Digital Signature"
                    secondary="Digital signature is available for signing"
                  />
                </ListItem>
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePrevStep}>Back</Button>
              <Button 
                onClick={handleNextStep}
                variant="contained"
              >
                Next
              </Button>
            </DialogActions>
          </>
        );
      
      case 2:
        return (
          <>
            <DialogTitle>
              Confirm Submission
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 3 }}>
                Please review the submission details and confirm to proceed.
              </DialogContentText>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Portal:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPortal?.name}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Entity:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedEntity?.name} ({selectedEntity?.cin})
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Form Type:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.formType}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Financial Year:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.financialYear}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Compliance:
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {getComplianceTypeById(selectedCompliance?.complianceTypeId)?.name}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Due Date:
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedCompliance?.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Alert severity="warning">
                By clicking "Submit", you confirm that all information is correct and ready for submission to the government portal.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePrevStep}>Back</Button>
              <Button 
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </DialogActions>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portal Integrations
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="portal tabs">
          <Tab label="Available Portals" id="portal-tab-0" aria-controls="portal-tabpanel-0" />
          <Tab label="Credentials" id="portal-tab-1" aria-controls="portal-tabpanel-1" />
          <Tab label="Submission History" id="portal-tab-2" aria-controls="portal-tabpanel-2" />
        </Tabs>
      </Paper>
      
      <TabPanel value={tabValue} index={0}>
        {renderPortalCards()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderCredentialManagement()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderSubmissionHistory()}
      </TabPanel>
      
      {/* Submission Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {submissionSuccess ? (
          <>
            <DialogTitle>
              Submission Successful
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Submission to {selectedPortal?.name} successful!
                </Typography>
                <Typography variant="body1">
                  Your filing has been submitted successfully. You will be redirected to the submission details page.
                </Typography>
              </Box>
            </DialogContent>
          </>
        ) : (
          <>
            {submissionError && (
              <Alert severity="error" sx={{ m: 2 }}>
                {submissionError}
              </Alert>
            )}
            
            <Box sx={{ px: 3, pt: 2 }}>
              <Stepper activeStep={dialogStep} alternativeLabel>
                <Step key="select">
                  <StepLabel>Select Compliance</StepLabel>
                </Step>
                <Step key="verify">
                  <StepLabel>Verify Requirements</StepLabel>
                </Step>
                <Step key="submit">
                  <StepLabel>Submit</StepLabel>
                </Step>
              </Stepper>
            </Box>
            
            {renderDialogContent()}
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PortalIntegrations;