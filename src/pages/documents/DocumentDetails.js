import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Description as DescriptionIcon,
  CloudDownload as CloudDownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  InsertDriveFile as InsertDriveFileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  TableChart as SpreadsheetIcon,
  Folder as FolderIcon,
  TextSnippet as TextIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock document viewer component
const DocumentViewer = ({ document }) => {
  const fileType = document.fileType || 'application/pdf';
  
  // Render different viewers based on file type
  const renderViewer = () => {
    if (fileType.includes('pdf')) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: '70vh', 
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <PdfIcon sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            PDF Viewer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In a real application, a PDF viewer would be embedded here
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudDownloadIcon />}
            sx={{ mt: 2 }}
          >
            Download PDF
          </Button>
        </Box>
      );
    } else if (fileType.includes('image')) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: '70vh', 
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <ImageIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Image Viewer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In a real application, an image viewer would be embedded here
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudDownloadIcon />}
            sx={{ mt: 2 }}
          >
            Download Image
          </Button>
        </Box>
      );
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: '70vh', 
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <SpreadsheetIcon sx={{ fontSize: 80, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Spreadsheet Viewer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In a real application, a spreadsheet viewer would be embedded here
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudDownloadIcon />}
            sx={{ mt: 2 }}
          >
            Download Spreadsheet
          </Button>
        </Box>
      );
    } else {
      return (
        <Box 
          sx={{ 
            width: '100%', 
            height: '70vh', 
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <InsertDriveFileIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Generic File Viewer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This file type cannot be previewed
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudDownloadIcon />}
            sx={{ mt: 2 }}
          >
            Download File
          </Button>
        </Box>
      );
    }
  };
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {renderViewer()}
    </Paper>
  );
};

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
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

const DocumentDetails = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { currentUser, hasPermission } = useAuth();
  const { updateDocumentStatus } = useCompliance();
  
  const [document, setDocument] = useState(null);
  const [relatedCompliance, setRelatedCompliance] = useState(null);
  const [relatedEntity, setRelatedEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [verificationComment, setVerificationComment] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  
  // Mock function to get document by ID
  const getDocumentById = (id) => {
    // This would be replaced with actual API call
    const mockDocuments = [
      {
        id: 'doc-001',
        entityId: 'ent-001',
        complianceId: 'comp-001',
        documentType: 'BOARD_RESOLUTION',
        fileName: 'board_resolution_2023.pdf',
        fileType: 'application/pdf',
        fileSize: 1024000,
        uploadedBy: 'user-002',
        uploadedAt: '2023-09-10T14:30:00Z',
        status: 'VERIFIED',
        verifiedBy: 'user-001',
        verifiedAt: '2023-09-12T11:15:00Z',
        comments: 'Verified and confirmed with board minutes',
        fileUrl: '/documents/board_resolution_2023.pdf'
      },
      {
        id: 'doc-002',
        entityId: 'ent-001',
        complianceId: 'comp-001',
        documentType: 'SHAREHOLDER_LIST',
        fileName: 'shareholder_list_2023.xlsx',
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileSize: 512000,
        uploadedBy: 'user-002',
        uploadedAt: '2023-09-11T10:45:00Z',
        status: 'VERIFIED',
        verifiedBy: 'user-001',
        verifiedAt: '2023-09-13T09:30:00Z',
        comments: 'All shareholder details are correct',
        fileUrl: '/documents/shareholder_list_2023.xlsx'
      },
      {
        id: 'doc-004',
        entityId: 'ent-001',
        complianceId: 'comp-002',
        documentType: 'BALANCE_SHEET',
        fileName: 'balance_sheet_fy_2022_23.pdf',
        fileType: 'application/pdf',
        fileSize: 1536000,
        uploadedBy: 'user-002',
        uploadedAt: '2023-08-15T15:20:00Z',
        status: 'VERIFIED',
        verifiedBy: 'user-004',
        verifiedAt: '2023-08-18T11:45:00Z',
        comments: 'Verified with audited financial statements',
        fileUrl: '/documents/balance_sheet_fy_2022_23.pdf'
      },
      {
        id: 'doc-010',
        entityId: 'ent-001',
        complianceId: 'comp-004',
        documentType: 'FINANCIAL_STATEMENTS',
        fileName: 'financial_statements_fy_2022_23.pdf',
        fileType: 'application/pdf',
        fileSize: 2048000,
        uploadedBy: 'user-003',
        uploadedAt: '2023-08-15T10:00:00Z',
        status: 'VERIFIED',
        verifiedBy: 'user-001',
        verifiedAt: '2023-08-16T11:30:00Z',
        comments: 'Verified financial statements',
        fileUrl: '/documents/financial_statements_fy_2022_23.pdf'
      },
      {
        id: 'doc-014',
        entityId: 'ent-001',
        complianceId: 'comp-005',
        documentType: 'IDENTITY_PROOF',
        fileName: 'director_passport.jpg',
        fileType: 'image/jpeg',
        fileSize: 512000,
        uploadedBy: 'user-003',
        uploadedAt: '2023-08-01T10:30:00Z',
        status: 'PENDING',
        comments: '',
        fileUrl: '/documents/director_passport.jpg'
      }
    ];
    
    return mockDocuments.find(doc => doc.id === id);
  };
  
  // Mock function to get entity by ID
  const getEntityById = (id) => {
    const mockEntities = [
      {
        id: 'ent-001',
        name: 'XYZ Private Limited',
        cin: 'U12345MH2020PTC123456',
        incorporationDate: '2020-06-15',
        registeredAddress: '123 Business Park, Mumbai, Maharashtra 400001',
        businessActivity: 'IT Services',
        entityType: 'PRIVATE_LIMITED',
        gstRegistration: '27AADCB2230M1ZR'
      }
    ];
    
    return mockEntities.find(entity => entity.id === id);
  };
  
  // Mock function to get compliance by ID
  const getComplianceById = (id) => {
    const mockCompliances = [
      {
        id: 'comp-001',
        entityId: 'ent-001',
        complianceTypeId: 'comp-type-001',
        financialYear: '2022-23',
        dueDate: '2023-11-29T23:59:59Z',
        agmDate: '2023-09-30T11:00:00Z',
        status: 'COMPLETED',
        workflowState: 'ACKNOWLEDGED'
      },
      {
        id: 'comp-002',
        entityId: 'ent-001',
        complianceTypeId: 'comp-type-002',
        financialYear: '2022-23',
        dueDate: '2023-10-30T23:59:59Z',
        agmDate: '2023-09-30T11:00:00Z',
        status: 'COMPLETED',
        workflowState: 'ACKNOWLEDGED'
      },
      {
        id: 'comp-004',
        entityId: 'ent-001',
        complianceTypeId: 'comp-type-006',
        financialYear: '2022-23',
        assessmentYear: '2023-24',
        dueDate: '2023-10-31T23:59:59Z',
        status: 'IN_PROGRESS',
        workflowState: 'FORM_PREPARATION'
      },
      {
        id: 'comp-005',
        entityId: 'ent-001',
        complianceTypeId: 'comp-type-003',
        financialYear: '2023-24',
        dueDate: '2023-09-30T23:59:59Z',
        status: 'PENDING',
        workflowState: 'DIRECTOR_DATA_COLLECTION'
      }
    ];
    
    return mockCompliances.find(comp => comp.id === id);
  };
  
  // Mock function to get compliance type by ID
  const getComplianceTypeById = (id) => {
    const complianceTypes = [
      {
        id: 'comp-type-001',
        code: 'MCA_ANNUAL_RETURN',
        name: 'Annual Return (MGT-7)',
        category: 'MCA/ROC'
      },
      {
        id: 'comp-type-002',
        code: 'MCA_FINANCIAL_STATEMENTS',
        name: 'Financial Statements Filing (AOC-4)',
        category: 'MCA/ROC'
      },
      {
        id: 'comp-type-003',
        code: 'DIRECTOR_KYC',
        name: 'Director\'s KYC (DIR-3 KYC)',
        category: 'MCA/ROC'
      },
      {
        id: 'comp-type-006',
        code: 'INCOME_TAX_RETURN',
        name: 'Corporate Income Tax Return (ITR-6)',
        category: 'INCOME_TAX'
      }
    ];
    
    return complianceTypes.find(type => type.id === id);
  };
  
  // Load document data
  useEffect(() => {
    if (documentId) {
      loadDocumentData();
    }
  }, [documentId]);
  
  // Load document data and related information
  const loadDocumentData = () => {
    setLoading(true);
    setError('');
    
    try {
      // Get document data
      const documentData = getDocumentById(documentId);
      if (!documentData) {
        setError('Document not found');
        setLoading(false);
        return;
      }
      
      setDocument(documentData);
      
      // Get related compliance data
      if (documentData.complianceId) {
        const complianceData = getComplianceById(documentData.complianceId);
        setRelatedCompliance(complianceData);
        
        // Get related compliance type
        if (complianceData && complianceData.complianceTypeId) {
          complianceData.type = getComplianceTypeById(complianceData.complianceTypeId);
        }
      }
      
      // Get related entity data
      if (documentData.entityId) {
        const entityData = getEntityById(documentData.entityId);
        setRelatedEntity(entityData);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load document data');
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle dialog open
  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setOpenDialog(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setVerificationComment('');
  };
  
  // Handle document verification
  const handleVerifyDocument = async () => {
    try {
      await updateDocumentStatus(documentId, 'VERIFIED', currentUser.id, verificationComment);
      setStatusUpdateSuccess(true);
      handleCloseDialog();
      loadDocumentData();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to verify document');
    }
  };
  
  // Handle document rejection
  const handleRejectDocument = async () => {
    try {
      await updateDocumentStatus(documentId, 'REJECTED', currentUser.id, verificationComment);
      setStatusUpdateSuccess(true);
      handleCloseDialog();
      loadDocumentData();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to reject document');
    }
  };
  
  // Handle navigate back
  const handleBack = () => {
    navigate('/documents');
  };
  
  // Handle navigate to compliance details
  const handleViewCompliance = () => {
    if (relatedCompliance) {
      navigate(`/compliance/${relatedCompliance.id}`);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  };
  
  // Get icon for file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <InsertDriveFileIcon />;
    
    if (fileType.includes('pdf')) {
      return <PdfIcon color="error" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon color="success" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <SpreadsheetIcon color="primary" />;
    } else if (fileType.includes('word')) {
      return <TextIcon color="primary" />;
    } else {
      return <InsertDriveFileIcon color="action" />;
    }
  };
  
  // Get color for document status
  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Get icon for document status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckIcon />;
      case 'PENDING':
        return <VisibilityIcon />;
      case 'REJECTED':
        return <CloseIcon />;
      default:
        return <VisibilityIcon />;
    }
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
          Back to Documents
        </Button>
      </Box>
    );
  }
  
  // If document not found
  if (!document) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Document not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Documents
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Success message */}
      {statusUpdateSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Document status updated successfully
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
          Document Details
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<CloudDownloadIcon />}
          sx={{ ml: 2 }}
        >
          Download
        </Button>
      </Box>
      
      {/* Document Info Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getFileIcon(document.fileType)}
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                {document.fileName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {document.documentType} • {formatFileSize(document.fileSize)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
            <Typography variant="body2" color="text.secondary">
              Uploaded on {new Date(document.uploadedAt).toLocaleDateString()}
            </Typography>
            {relatedEntity && (
              <Typography variant="body2" color="text.secondary">
                {relatedEntity.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Chip 
              label={document.status} 
              color={getStatusColor(document.status)}
              icon={getStatusIcon(document.status)}
              sx={{ fontWeight: 'bold' }}
            />
            
            {document.status === 'PENDING' && hasPermission('verify_documents') && (
              <Box sx={{ mt: 1 }}>
                <Button 
                  variant="outlined" 
                  color="success" 
                  size="small"
                  onClick={() => handleOpenDialog('verify')}
                  sx={{ mr: 1 }}
                >
                  Verify
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => handleOpenDialog('reject')}
                >
                  Reject
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="document tabs">
            <Tab label="Preview" id="document-tab-0" aria-controls="document-tabpanel-0" />
            <Tab label="Details" id="document-tab-1" aria-controls="document-tabpanel-1" />
            <Tab label="Compliance Info" id="document-tab-2" aria-controls="document-tabpanel-2" />
          </Tabs>
        </Box>
        
        {/* Preview Tab */}
        <TabPanel value={tabValue} index={0}>
          <DocumentViewer document={document} />
        </TabPanel>
        
        {/* Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Document Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Document Type
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {document.documentType}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        File Name
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {document.fileName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        File Type
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {document.fileType}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        File Size
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {formatFileSize(document.fileSize)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Upload Date
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {new Date(document.uploadedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Uploaded By
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {document.uploadedBy === currentUser.id ? 'You' : 'Another User'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip 
                        label={document.status} 
                        color={getStatusColor(document.status)}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    
                    {document.verifiedBy && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Verified By
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {document.verifiedBy === currentUser.id ? 'You' : 'Another User'}
                        </Typography>
                      </Grid>
                    )}
                    
                    {document.verifiedAt && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Verified At
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {new Date(document.verifiedAt).toLocaleString()}
                        </Typography>
                      </Grid>
                    )}
                    
                    {document.comments && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Comments
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {document.comments}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Verification History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {document.status === 'VERIFIED' ? (
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Document Verified"
                          secondary={`Verified on ${new Date(document.verifiedAt).toLocaleString()} by ${document.verifiedBy === currentUser.id ? 'You' : 'Another User'}`}
                        />
                      </ListItem>
                      {document.comments && (
                        <ListItem>
                          <ListItemIcon>
                            <DescriptionIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Verification Comments"
                            secondary={document.comments}
                          />
                        </ListItem>
                      )}
                    </List>
                  ) : document.status === 'REJECTED' ? (
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CloseIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Document Rejected"
                          secondary={`Rejected on ${new Date(document.verifiedAt).toLocaleString()} by ${document.verifiedBy === currentUser.id ? 'You' : 'Another User'}`}
                        />
                      </ListItem>
                      {document.comments && (
                        <ListItem>
                          <ListItemIcon>
                            <DescriptionIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Rejection Reason"
                            secondary={document.comments}
                          />
                        </ListItem>
                      )}
                    </List>
                  ) : (
                    <Alert severity="info">
                      This document is pending verification.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Compliance Info Tab */}
        <TabPanel value={tabValue} index={2}>
          {relatedCompliance ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Related Compliance
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={handleViewCompliance}
                  >
                    View Compliance Details
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Compliance Type
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {relatedCompliance.type?.name || 'Unknown'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {relatedCompliance.type?.category || 'Unknown'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip 
                      label={relatedCompliance.status} 
                      color={getComplianceStatusColor(relatedCompliance.status)}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(relatedCompliance.dueDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  {relatedCompliance.financialYear && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Financial Year
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {relatedCompliance.financialYear}
                      </Typography>
                    </Grid>
                  )}
                  
                  {relatedCompliance.workflowState && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Current Workflow State
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {formatWorkflowState(relatedCompliance.workflowState)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">
              No compliance information associated with this document.
            </Alert>
          )}
        </TabPanel>
      </Box>
      
      {/* Verification Dialog */}
      <Dialog open={openDialog && dialogAction === 'verify'} onClose={handleCloseDialog}>
        <DialogTitle>Verify Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm that you have reviewed this document and it meets all requirements.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="verification-comment"
            label="Verification Comments"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={verificationComment}
            onChange={(e) => setVerificationComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleVerifyDocument} color="success" variant="contained">
            Verify Document
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={openDialog && dialogAction === 'reject'} onClose={handleCloseDialog}>
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this document.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejection-comment"
            label="Rejection Reason"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={verificationComment}
            onChange={(e) => setVerificationComment(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleRejectDocument} 
            color="error" 
            variant="contained"
            disabled={!verificationComment}
          >
            Reject Document
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to format workflow state
const formatWorkflowState = (state) => {
  return state
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to get compliance status color
const getComplianceStatusColor = (status) => {
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

export default DocumentDetails;