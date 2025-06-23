import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  AlertTitle,
  IconButton,
  Chip,
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
  Snackbar,
  Stack,
  Tooltip,
  LinearProgress,
  Tabs,
  Tab,
  Badge,
  FormControlLabel,
  Switch,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  Warning as WarningIcon,
  InsertDriveFile as InsertDriveFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  VerifiedUser as VerifiedUserIcon,
  NotInterested as NotInterestedIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  Comment as CommentIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarMonthIcon,
  Visibility as VisibilityIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

// Helper function to get file icon based on file type
const getFileIcon = (fileType) => {
  if (!fileType) return <InsertDriveFileIcon />;
  
  if (fileType.includes('pdf')) {
    return <PictureAsPdfIcon color="error" />;
  } else if (fileType.includes('image')) {
    return <ImageIcon color="primary" />;
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return <FileCopyIcon color="primary" />;
  } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return <FileCopyIcon color="success" />;
  } else {
    return <InsertDriveFileIcon />;
  }
};

// Helper function to format bytes
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// History timeline item component
const HistoryItem = ({ action, user, timestamp, details, iconColor }) => {
  let icon;
  
  switch (action) {
    case 'UPLOADED':
      icon = <InsertDriveFileIcon color="primary" />;
      break;
    case 'VERIFIED':
      icon = <CheckCircleIcon color="success" />;
      break;
    case 'REJECTED':
      icon = <CancelIcon color="error" />;
      break;
    case 'UPDATED':
      icon = <EditIcon color="info" />;
      break;
    case 'COMMENT':
      icon = <CommentIcon color="action" />;
      break;
    default:
      icon = <InfoIcon color={iconColor || "primary"} />;
  }
  
  return (
    <ListItem alignItems="flex-start" sx={{ position: 'relative' }}>
      <ListItemIcon>
        <Avatar sx={{ bgcolor: iconColor || 'primary.main' }}>
          {icon}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="subtitle1" component="span">
            {action}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.primary">
              {user}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(timestamp).toLocaleString()}
            </Typography>
            {details && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {details}
              </Typography>
            )}
          </>
        }
      />
    </ListItem>
  );
};

// Tab panel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`verification-tabpanel-${index}`}
      aria-labelledby={`verification-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DocumentVerification = () => {
  const { id } = useParams(); // document ID
  const navigate = useNavigate();
  
  const { currentUser } = useAuth();
  const { 
    getDocumentById, 
    verifyDocument,
    getComplianceById,
    getEntityById,
    loading, 
    error 
  } = useCompliance();
  
  // States
  const [document, setDocument] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('VERIFIED');
  const [tabValue, setTabValue] = useState(0);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareWithId, setCompareWithId] = useState('');
  const [compareDocument, setCompareDocument] = useState(null);
  
  // Fetch document data
  useEffect(() => {
    if (id) {
      // In a real app, fetch the document by ID
      const doc = getDocumentById(id);
      
      if (doc) {
        setDocument(doc);
        // Initialize verification notes if the document has them
        if (doc.verificationNotes) {
          setVerificationNotes(doc.verificationNotes);
        }
        // Initialize verification status if the document has it
        if (doc.status) {
          setVerificationStatus(doc.status === 'REJECTED' ? 'REJECTED' : 'VERIFIED');
        }
      }
    }
  }, [id, getDocumentById]);
  
  // Mock document for demo purposes if real document isn't available
  useEffect(() => {
    if (!document && id) {
      // Create a mock document for the demo
      const mockDocument = {
        id,
        name: 'Annual Financial Statement FY 2022-23',
        fileName: 'financial-statement-2022-23.pdf',
        fileType: 'application/pdf',
        fileSize: 2456789,
        type: 'FINANCIAL_STATEMENT',
        status: 'UPLOADED',
        entityId: 'entity-1',
        complianceId: 'compliance-1',
        uploadedBy: 'John Doe',
        uploadedAt: '2023-05-15T10:30:00Z',
        description: 'Annual financial statement for the financial year 2022-23 containing balance sheet, profit and loss account, and cash flow statement.',
        validFrom: '2022-04-01',
        validUntil: '2023-03-31',
        tags: ['financial', 'annual', 'audit'],
        history: [
          {
            action: 'UPLOADED',
            user: 'John Doe',
            timestamp: '2023-05-15T10:30:00Z',
            details: 'Document uploaded initially'
          },
          {
            action: 'COMMENT',
            user: 'Jane Smith',
            timestamp: '2023-05-16T09:15:00Z',
            details: 'Please verify the balance sheet figures on page 12'
          }
        ]
      };
      
      setDocument(mockDocument);
    }
  }, [document, id, getDocumentById]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle notes change
  const handleNotesChange = (e) => {
    setVerificationNotes(e.target.value);
  };
  
  // Handle status change
  const handleStatusChange = (e) => {
    setVerificationStatus(e.target.value);
  };
  
  // Handle verify action
  const handleVerify = () => {
    setConfirmDialogOpen(true);
  };
  
  // Handle annotation toggle
  const handleAnnotationToggle = () => {
    setAnnotationMode(!annotationMode);
  };
  
  // Handle compare toggle
  const handleCompareToggle = () => {
    setCompareMode(!compareMode);
    
    if (!compareMode) {
      // In a real app, fetch related documents for comparison
      // For the mockup, just create a sample
      const mockCompareDocument = {
        id: 'doc-2',
        name: 'Annual Financial Statement FY 2021-22',
        fileName: 'financial-statement-2021-22.pdf',
        fileType: 'application/pdf',
        fileSize: 2356789,
        type: 'FINANCIAL_STATEMENT',
        status: 'VERIFIED',
        entityId: 'entity-1',
        complianceId: 'compliance-2',
        uploadedBy: 'John Doe',
        uploadedAt: '2022-05-20T11:30:00Z',
        description: 'Annual financial statement for the previous financial year 2021-22.',
        validFrom: '2021-04-01',
        validUntil: '2022-03-31',
      };
      
      setCompareDocument(mockCompareDocument);
      setCompareWithId('doc-2');
    } else {
      setCompareDocument(null);
      setCompareWithId('');
    }
  };
  
  // Handle add comment
  const handleAddComment = () => {
    const newComment = {
      action: 'COMMENT',
      user: currentUser.name || 'Current User',
      timestamp: new Date().toISOString(),
      details: verificationNotes
    };
    
    setDocument(prev => ({
      ...prev,
      history: [...(prev.history || []), newComment]
    }));
    
    setSnackbar({
      open: true,
      message: 'Comment added successfully',
      severity: 'success'
    });
  };
  
  // Handle confirm verification
  const handleConfirmVerification = async () => {
    setIsVerifying(true);
    
    try {
      // In a real app, call the API to verify the document
      const verificationData = {
        status: verificationStatus,
        verificationNotes,
        verifiedBy: currentUser.id,
        verifiedAt: new Date().toISOString()
      };
      
      await verifyDocument(id, verificationData);
      
      // Update the document locally
      const newHistory = {
        action: verificationStatus,
        user: currentUser.name || 'Current User',
        timestamp: new Date().toISOString(),
        details: verificationNotes
      };
      
      setDocument(prev => ({
        ...prev,
        status: verificationStatus,
        verificationNotes,
        verifiedBy: currentUser.id,
        verifiedAt: new Date().toISOString(),
        history: [...(prev.history || []), newHistory]
      }));
      
      setSnackbar({
        open: true,
        message: `Document ${verificationStatus === 'VERIFIED' ? 'verified' : 'rejected'} successfully`,
        severity: 'success'
      });
      
      // Close the dialog
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error('Error verifying document:', err);
      
      setSnackbar({
        open: true,
        message: 'Failed to verify document. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Mock document types
  const documentTypes = [
    { id: 'FINANCIAL_STATEMENT', name: 'Financial Statement' },
    { id: 'ANNUAL_RETURN', name: 'Annual Return' },
    { id: 'TAX_FILING', name: 'Tax Filing' },
    { id: 'BOARD_RESOLUTION', name: 'Board Resolution' },
    { id: 'CERTIFICATE', name: 'Certificate' },
    { id: 'PROOF_OF_ADDRESS', name: 'Proof of Address' },
    { id: 'IDENTITY_PROOF', name: 'Identity Proof' },
    { id: 'LEGAL_AGREEMENT', name: 'Legal Agreement' },
    { id: 'OTHER', name: 'Other' }
  ];
  
  // Render loading state
  if (loading || !document) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Get entity and compliance details
  const entity = getEntityById(document.entityId);
  const compliance = getComplianceById(document.complianceId);
  const documentType = documentTypes.find(t => t.id === document.type);
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Document Verification
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Alert 
          severity={
            document.status === 'VERIFIED' ? 'success' : 
            document.status === 'REJECTED' ? 'error' : 
            'info'
          }
          icon={
            document.status === 'VERIFIED' ? <CheckCircleIcon /> : 
            document.status === 'REJECTED' ? <CancelIcon /> : 
            <InfoIcon />
          }
          sx={{ mb: 3 }}
        >
          <AlertTitle>
            {document.status === 'VERIFIED' ? 'Verified Document' : 
             document.status === 'REJECTED' ? 'Rejected Document' : 
             'Pending Verification'}
          </AlertTitle>
          {document.status === 'VERIFIED' ? (
            <>This document has been verified on {new Date(document.verifiedAt).toLocaleDateString()} by {document.verifiedBy}</>
          ) : document.status === 'REJECTED' ? (
            <>This document was rejected on {new Date(document.verifiedAt).toLocaleDateString()} by {document.verifiedBy}</>
          ) : (
            <>This document is awaiting verification. Please review it carefully before approving or rejecting.</>
          )}
        </Alert>
        
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: 'grey.100' }}>
                    <Typography variant="h6">
                      {document.name}
                    </Typography>
                    <Box>
                      <Chip 
                        label={document.status} 
                        color={
                          document.status === 'VERIFIED' ? 'success' : 
                          document.status === 'REJECTED' ? 'error' : 
                          'warning'
                        }
                        variant={document.status === 'VERIFIED' ? 'filled' : 'outlined'}
                        size="small"
                        icon={
                          document.status === 'VERIFIED' ? <CheckCircleIcon /> : 
                          document.status === 'REJECTED' ? <CancelIcon /> : 
                          <WarningIcon />
                        }
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 0 }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="document tabs"
                    >
                      <Tab 
                        icon={<VisibilityIcon />} 
                        label="Preview" 
                        id="doc-tab-0" 
                        aria-controls="doc-tabpanel-0"
                      />
                      <Tab 
                        icon={<DescriptionIcon />} 
                        label="Details" 
                        id="doc-tab-1" 
                        aria-controls="doc-tabpanel-1" 
                      />
                      <Tab 
                        icon={<HistoryIcon />} 
                        label="History" 
                        id="doc-tab-2" 
                        aria-controls="doc-tabpanel-2"
                      />
                      {compareMode && (
                        <Tab 
                          icon={<CompareIcon />} 
                          label="Compare" 
                          id="doc-tab-3" 
                          aria-controls="doc-tabpanel-3"
                        />
                      )}
                    </Tabs>
                  </Box>
                  
                  <Box sx={{ minHeight: 500 }}>
                    <TabPanel value={tabValue} index={0}>
                      <Box sx={{ position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<DownloadIcon />}
                            >
                              Download
                            </Button>
                            
                            <Tooltip title="Toggle annotation mode">
                              <Button
                                variant="outlined"
                                color={annotationMode ? "primary" : "inherit"}
                                size="small"
                                onClick={handleAnnotationToggle}
                                startIcon={<EditIcon />}
                              >
                                Annotate
                              </Button>
                            </Tooltip>
                            
                            <Tooltip title="Compare with previous version">
                              <Button
                                variant="outlined"
                                color={compareMode ? "primary" : "inherit"}
                                size="small"
                                onClick={handleCompareToggle}
                                startIcon={<CompareIcon />}
                              >
                                Compare
                              </Button>
                            </Tooltip>
                          </Stack>
                        </Box>
                        
                        {document.fileType && document.fileType.includes('pdf') ? (
                          <Box 
                            sx={{ 
                              height: 500, 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              bgcolor: 'grey.200',
                              border: '1px solid',
                              borderColor: 'grey.300',
                              borderRadius: 1,
                              p: 2
                            }}
                          >
                            <Box sx={{ textAlign: 'center' }}>
                              <PictureAsPdfIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
                              <Typography variant="body1" gutterBottom>
                                PDF Preview
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {document.fileName} ({formatBytes(document.fileSize)})
                              </Typography>
                              <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                startIcon={<VisibilityIcon />}
                              >
                                Open Full Preview
                              </Button>
                            </Box>
                          </Box>
                        ) : document.fileType && document.fileType.includes('image') ? (
                          <Box 
                            sx={{ 
                              height: 500, 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              bgcolor: 'grey.200',
                              border: '1px solid',
                              borderColor: 'grey.300',
                              borderRadius: 1,
                              p: 2
                            }}
                          >
                            <img
                              src="https://via.placeholder.com/800x600"
                              alt="Document Preview"
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          </Box>
                        ) : (
                          <Box 
                            sx={{ 
                              height: 500, 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              bgcolor: 'grey.200',
                              border: '1px solid',
                              borderColor: 'grey.300',
                              borderRadius: 1,
                              p: 2
                            }}
                          >
                            <Box sx={{ textAlign: 'center' }}>
                              {getFileIcon(document.fileType)}
                              <Typography variant="body1" sx={{ mt: 2 }} gutterBottom>
                                Preview not available for this file type
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {document.fileName} ({formatBytes(document.fileSize)})
                              </Typography>
                              <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                startIcon={<DownloadIcon />}
                              >
                                Download to View
                              </Button>
                            </Box>
                          </Box>
                        )}
                        
                        {annotationMode && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            <AlertTitle>Annotation Mode</AlertTitle>
                            In a real application, users would be able to add annotations directly on the document.
                            These annotations could be used to highlight issues or areas that need attention.
                          </Alert>
                        )}
                      </Box>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={1}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Document Name
                              </Typography>
                              <Typography variant="body1">
                                {document.name}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                File Name
                              </Typography>
                              <Typography variant="body1">
                                {document.fileName}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                File Type
                              </Typography>
                              <Typography variant="body1">
                                {documentType?.name || 'Unknown'}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                File Size
                              </Typography>
                              <Typography variant="body1">
                                {formatBytes(document.fileSize)}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Entity
                              </Typography>
                              <Typography variant="body1">
                                {entity?.name || 'Unknown Entity'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Compliance Requirement
                              </Typography>
                              <Typography variant="body1">
                                {compliance?.name || 'Not specified'}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Uploaded By
                              </Typography>
                              <Typography variant="body1">
                                {document.uploadedBy}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Uploaded On
                              </Typography>
                              <Typography variant="body1">
                                {new Date(document.uploadedAt).toLocaleString()}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Valid Period
                              </Typography>
                              <Typography variant="body1">
                                {document.validFrom && document.validUntil ? (
                                  `${new Date(document.validFrom).toLocaleDateString()} to ${new Date(document.validUntil).toLocaleDateString()}`
                                ) : 'Not specified'}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Tags
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {document.tags && document.tags.length > 0 ? (
                                  document.tags.map(tag => (
                                    <Chip key={tag} label={tag} size="small" />
                                  ))
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No tags
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Description
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {document.description || 'No description provided'}
                          </Typography>
                          
                          {document.status === 'VERIFIED' || document.status === 'REJECTED' ? (
                            <>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Verification Notes
                              </Typography>
                              <Typography variant="body1">
                                {document.verificationNotes || 'No verification notes provided'}
                              </Typography>
                            </>
                          ) : null}
                        </Grid>
                      </Grid>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={2}>
                      <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                        <List>
                          {document.history && document.history.length > 0 ? (
                            document.history.map((item, index) => (
                              <React.Fragment key={index}>
                                <HistoryItem
                                  action={item.action}
                                  user={item.user}
                                  timestamp={item.timestamp}
                                  details={item.details}
                                  iconColor={
                                    item.action === 'VERIFIED' ? 'success.main' :
                                    item.action === 'REJECTED' ? 'error.main' :
                                    item.action === 'UPLOADED' ? 'primary.main' :
                                    'grey.500'
                                  }
                                />
                                {index < document.history.length - 1 && <Divider variant="inset" component="li" />}
                              </React.Fragment>
                            ))
                          ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body1" color="text.secondary">
                                No history available
                              </Typography>
                            </Box>
                          )}
                        </List>
                      </Box>
                    </TabPanel>
                    
                    {compareMode && (
                      <TabPanel value={tabValue} index={3}>
                        {compareDocument ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="h6" gutterBottom align="center">
                                Current Document
                              </Typography>
                              <Box
                                sx={{
                                  height: 400,
                                  bgcolor: 'grey.100',
                                  p: 2,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Box sx={{ textAlign: 'center' }}>
                                  <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                                  <Typography variant="body1" gutterBottom>
                                    {document.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {document.fileName}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                              <Typography variant="h6" gutterBottom align="center">
                                Previous Version
                              </Typography>
                              <Box
                                sx={{
                                  height: 400,
                                  bgcolor: 'grey.100',
                                  p: 2,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Box sx={{ textAlign: 'center' }}>
                                  <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                                  <Typography variant="body1" gutterBottom>
                                    {compareDocument.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {compareDocument.fileName}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Alert severity="info">
                                <AlertTitle>Document Comparison</AlertTitle>
                                In a real application, users would see a side-by-side comparison of the documents with differences highlighted.
                                This would allow for easier verification by comparing changes between document versions.
                              </Alert>
                            </Grid>
                          </Grid>
                        ) : (
                          <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                              No previous version available for comparison
                            </Typography>
                          </Box>
                        )}
                      </TabPanel>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Verification Actions
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="verification-status-label">Verification Status</InputLabel>
                    <Select
                      labelId="verification-status-label"
                      id="verification-status"
                      value={verificationStatus}
                      label="Verification Status"
                      onChange={handleStatusChange}
                      disabled={document.status === 'VERIFIED' || document.status === 'REJECTED'}
                    >
                      <MenuItem value="VERIFIED">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                          Verified
                        </Box>
                      </MenuItem>
                      <MenuItem value="REJECTED">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CancelIcon color="error" sx={{ mr: 1 }} />
                          Rejected
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Verification Notes"
                    multiline
                    rows={6}
                    value={verificationNotes}
                    onChange={handleNotesChange}
                    placeholder="Enter detailed notes about your verification decision..."
                    disabled={document.status === 'VERIFIED' || document.status === 'REJECTED'}
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={document.status !== 'VERIFIED' && document.status !== 'REJECTED'}
                          disabled={true}
                        />
                      }
                      label="Document Editable"
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Documents can no longer be edited after verification
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<CommentIcon />}
                      onClick={handleAddComment}
                      disabled={!verificationNotes}
                    >
                      Add Comment
                    </Button>
                    
                    <Button
                      variant="contained"
                      color={verificationStatus === 'VERIFIED' ? 'success' : 'error'}
                      startIcon={verificationStatus === 'VERIFIED' ? <CheckCircleIcon /> : <CancelIcon />}
                      onClick={handleVerify}
                      disabled={document.status === 'VERIFIED' || document.status === 'REJECTED' || !verificationNotes}
                    >
                      {verificationStatus === 'VERIFIED' ? 'Verify Document' : 'Reject Document'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Verification Checklist
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Document is correctly formatted" 
                        secondary="Verify document layout and structure"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Document contains required information" 
                        secondary="Check for all mandatory fields and sections"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <HelpIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Document is signed by authorized personnel" 
                        secondary="Verify signatures match authorized signatories"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <HelpIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Document dates are valid" 
                        secondary="Check effective dates and expiration"
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <HelpIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Financial figures match other records" 
                        secondary="Cross-check with balance sheets and other documents"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Related Documents
                  </Typography>
                  
                  <List dense>
                    <ListItem button>
                      <ListItemIcon>
                        <PictureAsPdfIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Balance Sheet FY 2022-23" 
                        secondary="Uploaded on May 10, 2023"
                      />
                    </ListItem>
                    
                    <ListItem button>
                      <ListItemIcon>
                        <PictureAsPdfIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Profit & Loss Statement FY 2022-23" 
                        secondary="Uploaded on May 10, 2023"
                      />
                    </ListItem>
                    
                    <ListItem button>
                      <ListItemIcon>
                        <FileCopyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Auditor's Report FY 2022-23" 
                        secondary="Uploaded on May 12, 2023"
                      />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small">View All Related Documents</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          {verificationStatus === 'VERIFIED' ? 'Confirm Document Verification' : 'Confirm Document Rejection'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {verificationStatus === 'VERIFIED' 
              ? 'Are you sure you want to verify this document? This action will mark the document as verified and cannot be easily undone.'
              : 'Are you sure you want to reject this document? This action will mark the document as rejected and will require the user to upload a new version.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmVerification} 
            color={verificationStatus === 'VERIFIED' ? 'success' : 'error'}
            variant="contained"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <CircularProgress size={24} />
            ) : (
              verificationStatus === 'VERIFIED' ? 'Verify' : 'Reject'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
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

export default DocumentVerification;