import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Alert,
  Tooltip,
  Divider,
  Badge,
  Tabs,
  Tab,
  Snackbar,
  LinearProgress,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  FileCopy as FileCopyIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
  CloudUpload as CloudUploadIcon,
  Business as BusinessIcon,
  FolderOpen as FolderOpenIcon,
  History as HistoryIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Close as CloseIcon,
  VerifiedUser as VerifiedUserIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Status chip component
const StatusChip = ({ status }) => {
  let color;
  let icon;
  
  switch(status) {
    case 'PENDING':
      color = 'warning';
      icon = <WarningIcon fontSize="small" />;
      break;
    case 'UPLOADED':
      color = 'info';
      icon = <InfoIcon fontSize="small" />;
      break;
    case 'VERIFIED':
      color = 'success';
      icon = <CheckCircleIcon fontSize="small" />;
      break;
    case 'REJECTED':
      color = 'error';
      icon = <CancelIcon fontSize="small" />;
      break;
    default:
      color = 'default';
      icon = <InfoIcon fontSize="small" />;
  }
  
  return (
    <Chip 
      icon={icon}
      label={status} 
      color={color} 
      size="small"
      variant={status === 'VERIFIED' ? 'filled' : 'outlined'}
    />
  );
};

// Tab panel component
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

const DocumentList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const entityIdParam = queryParams.get('entityId');
  const complianceIdParam = queryParams.get('complianceId');
  
  const { currentUser } = useAuth();
  const { 
    documents, 
    entities, 
    compliances, 
    getComplianceById,
    getEntityById,
    getDocumentsByComplianceId,
    getDocumentsByEntityId,
    deleteDocument,
    verifyDocument,
    loading, 
    error 
  } = useCompliance();
  
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState(entityIdParam || '');
  const [complianceFilter, setComplianceFilter] = useState(complianceIdParam || '');
  const [sortField, setSortField] = useState('uploadedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [tabValue, setTabValue] = useState(0);
  
  // Action menu state
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // Verification state
  const [verificationStatus, setVerificationStatus] = useState('VERIFIED');
  const [verificationNotes, setVerificationNotes] = useState('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Document stats
  const documentStats = {
    total: documents.length,
    verified: documents.filter(doc => doc.status === 'VERIFIED').length,
    pending: documents.filter(doc => doc.status === 'PENDING').length,
    rejected: documents.filter(doc => doc.status === 'REJECTED').length
  };
  
  // Document preview state
  const [previewDocument, setPreviewDocument] = useState(null);
  
  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      (document.name && document.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (document.description && document.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (document.fileName && document.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? document.status === statusFilter : true;
    const matchesType = typeFilter ? document.type === typeFilter : true;
    const matchesEntity = entityFilter ? document.entityId === entityFilter : true;
    const matchesCompliance = complianceFilter ? document.complianceId === complianceFilter : true;
    
    // Tab filter
    let matchesTab = true;
    if (tabValue === 1) { // Pending verification
      matchesTab = document.status === 'UPLOADED' || document.status === 'PENDING';
    } else if (tabValue === 2) { // Verified
      matchesTab = document.status === 'VERIFIED';
    } else if (tabValue === 3) { // Rejected
      matchesTab = document.status === 'REJECTED';
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesEntity && matchesCompliance && matchesTab;
  });
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortField) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'uploadedAt':
        aValue = new Date(a.uploadedAt || 0).getTime();
        bValue = new Date(b.uploadedAt || 0).getTime();
        break;
      case 'fileSize':
        aValue = a.fileSize || 0;
        bValue = b.fileSize || 0;
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'entityName':
        aValue = getEntityById(a.entityId)?.name || '';
        bValue = getEntityById(b.entityId)?.name || '';
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });
  
  // Pagination
  const paginatedDocuments = sortedDocuments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle action menu open
  const handleActionMenuOpen = (event, documentId) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedDocumentId(documentId);
  };
  
  // Handle action menu close
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedDocumentId(null);
  };
  
  // Handle view details
  const handleViewDetails = () => {
    handleActionMenuClose();
    navigate(`/documents/details/${selectedDocumentId}`);
  };
  
  // Handle edit
  const handleEdit = () => {
    handleActionMenuClose();
    navigate(`/documents/upload/${selectedDocumentId}`);
  };
  
  // Handle delete dialog open
  const handleDeleteDialogOpen = () => {
    handleActionMenuClose();
    setDeleteDialogOpen(true);
  };
  
  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteDocument(selectedDocumentId);
      setSnackbar({
        open: true,
        message: 'Document deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete document',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  // Handle verify dialog open
  const handleVerifyDialogOpen = () => {
    handleActionMenuClose();
    setVerifyDialogOpen(true);
  };
  
  // Handle verify dialog close
  const handleVerifyDialogClose = () => {
    setVerifyDialogOpen(false);
    setVerificationStatus('VERIFIED');
    setVerificationNotes('');
  };
  
  // Handle verify confirmation
  const handleVerifyConfirm = async () => {
    try {
      await verifyDocument(selectedDocumentId, {
        status: verificationStatus,
        verificationNotes: verificationNotes,
        verifiedBy: currentUser.id,
        verifiedAt: new Date().toISOString()
      });
      
      setSnackbar({
        open: true,
        message: `Document ${verificationStatus === 'VERIFIED' ? 'verified' : 'rejected'} successfully`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update document verification status',
        severity: 'error'
      });
    } finally {
      setVerifyDialogOpen(false);
    }
  };
  
  // Handle share dialog open
  const handleShareDialogOpen = () => {
    handleActionMenuClose();
    setShareDialogOpen(true);
  };
  
  // Handle share dialog close
  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };
  
  // Handle preview dialog open
  const handlePreviewDialogOpen = (document) => {
    setPreviewDocument(document);
    setPreviewDialogOpen(true);
  };
  
  // Handle preview dialog close
  const handlePreviewDialogClose = () => {
    setPreviewDialogOpen(false);
    setPreviewDocument(null);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };
  
  // Handle download
  const handleDownload = () => {
    handleActionMenuClose();
    
    // In a real app, this would trigger a file download
    // For the mockup, just show a snackbar
    setSnackbar({
      open: true,
      message: 'Document download started',
      severity: 'info'
    });
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setEntityFilter(entityIdParam || '');
    setComplianceFilter(complianceIdParam || '');
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Document types
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
  
  // Document statuses
  const documentStatuses = [
    { id: 'PENDING', name: 'Pending' },
    { id: 'UPLOADED', name: 'Uploaded' },
    { id: 'VERIFIED', name: 'Verified' },
    { id: 'REJECTED', name: 'Rejected' }
  ];
  
  // Document summary card for stats
  const renderSummaryCards = () => {
    const summaryItems = [
      {
        title: 'Total Documents',
        count: documentStats.total,
        color: 'primary.main',
        icon: <DescriptionIcon />,
        onClick: () => setTabValue(0)
      },
      {
        title: 'Pending Verification',
        count: documentStats.pending,
        color: 'warning.main',
        icon: <WarningIcon />,
        onClick: () => setTabValue(1)
      },
      {
        title: 'Verified',
        count: documentStats.verified,
        color: 'success.main',
        icon: <CheckCircleIcon />,
        onClick: () => setTabValue(2)
      },
      {
        title: 'Rejected',
        count: documentStats.rejected,
        color: 'error.main',
        icon: <ErrorIcon />,
        onClick: () => setTabValue(3)
      }
    ];
    
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryItems.map((item) => (
          <Grid item xs={6} sm={3} key={item.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={item.onClick}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h3" component="div" fontWeight="bold">
                      {item.count}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {item.title}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    bgcolor: item.color, 
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40
                  }}>
                    {item.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <FolderOpenIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No documents found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {(searchTerm || statusFilter || typeFilter || entityFilter || complianceFilter) ? 
          'Try clearing your filters or search term' : 
          'Upload your first document to get started'}
      </Typography>
      {(searchTerm || statusFilter || typeFilter || entityFilter || complianceFilter) ? (
        <Button 
          variant="outlined" 
          startIcon={<FilterListIcon />}
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      ) : (
        <Button 
          variant="contained" 
          startIcon={<CloudUploadIcon />}
          onClick={() => navigate('/documents/upload')}
        >
          Upload Document
        </Button>
      )}
    </Box>
  );
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={8}>
          <Typography variant="h4" gutterBottom>
            Document Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View, manage, and verify all compliance documents
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => navigate('/documents/upload')}
            sx={{ mr: 1 }}
          >
            Upload Documents
          </Button>
        </Grid>
      </Grid>
      
      {/* Summary Cards */}
      {renderSummaryCards()}
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="document tabs"
        >
          <Tab 
            icon={<DescriptionIcon />} 
            label="All Documents" 
            id="document-tab-0" 
            aria-controls="document-tabpanel-0" 
          />
          <Tab 
            icon={<WarningIcon />} 
            label={`Pending Verification (${documentStats.pending})`} 
            id="document-tab-1" 
            aria-controls="document-tabpanel-1" 
          />
          <Tab 
            icon={<CheckCircleIcon />} 
            label={`Verified (${documentStats.verified})`} 
            id="document-tab-2" 
            aria-controls="document-tabpanel-2" 
          />
          <Tab 
            icon={<ErrorIcon />} 
            label={`Rejected (${documentStats.rejected})`} 
            id="document-tab-3" 
            aria-controls="document-tabpanel-3" 
          />
        </Tabs>
      </Paper>
      
      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, description, or filename"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {documentStatuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="type-filter-label">Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    id="type-filter"
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {documentTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="entity-filter-label">Entity</InputLabel>
                  <Select
                    labelId="entity-filter-label"
                    id="entity-filter"
                    value={entityFilter}
                    label="Entity"
                    onChange={(e) => setEntityFilter(e.target.value)}
                    disabled={Boolean(entityIdParam)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {entities.map((entity) => (
                      <MenuItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="compliance-filter-label">Compliance</InputLabel>
                  <Select
                    labelId="compliance-filter-label"
                    id="compliance-filter"
                    value={complianceFilter}
                    label="Compliance"
                    onChange={(e) => setComplianceFilter(e.target.value)}
                    disabled={Boolean(complianceIdParam)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {compliances.map((compliance) => (
                      <MenuItem key={compliance.id} value={compliance.id}>
                        {compliance.name || `Compliance ${compliance.id.substring(0, 8)}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {(searchTerm || statusFilter || typeFilter || entityFilter || complianceFilter) && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Document Table */}
      <Paper>
        {filteredDocuments.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell 
                      onClick={() => handleSort('name')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell 
                      onClick={() => handleSort('entityName')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Entity
                        {sortField === 'entityName' && (
                          sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell 
                      onClick={() => handleSort('uploadedAt')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Uploaded On
                        {sortField === 'uploadedAt' && (
                          sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell 
                      onClick={() => handleSort('status')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Status
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDocuments.map((document) => {
                    const entity = getEntityById(document.entityId);
                    const docType = documentTypes.find(t => t.id === document.type);
                    
                    return (
                      <TableRow 
                        key={document.id} 
                        hover
                        onClick={() => handlePreviewDialogOpen(document)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getFileIcon(document.fileType)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {document.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {document.fileName}
                          </Typography>
                        </TableCell>
                        <TableCell>{entity?.name || 'Unknown Entity'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={docType?.name || 'Unknown Type'} 
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={document.status} />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionMenuOpen(e, document.id);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={filteredDocuments.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleVerifyDialogOpen}>
          <ListItemIcon>
            <VerifiedUserIcon fontSize="small" />
          </ListItemIcon>
          Verify / Reject
        </MenuItem>
        <MenuItem onClick={handleShareDialogOpen}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteDialogOpen} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Verify Dialog */}
      <Dialog
        open={verifyDialogOpen}
        onClose={handleVerifyDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Verify Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Review the document and update its verification status.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="verification-status-label">Verification Status</InputLabel>
            <Select
              labelId="verification-status-label"
              id="verification-status"
              value={verificationStatus}
              label="Verification Status"
              onChange={(e) => setVerificationStatus(e.target.value)}
            >
              <MenuItem value="VERIFIED">Verified</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Verification Notes"
            multiline
            rows={4}
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
            placeholder="Enter any notes about the verification process"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerifyDialogClose}>Cancel</Button>
          <Button 
            onClick={handleVerifyConfirm} 
            color={verificationStatus === 'VERIFIED' ? 'success' : 'error'} 
            variant="contained"
          >
            {verificationStatus === 'VERIFIED' ? 'Verify' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Share this document with other users or stakeholders.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="share-with-label">Share With</InputLabel>
            <Select
              labelId="share-with-label"
              id="share-with"
              multiple
              value={[]}
              label="Share With"
            >
              <MenuItem value="user-1">John Doe (Administrator)</MenuItem>
              <MenuItem value="user-2">Jane Smith (Director)</MenuItem>
              <MenuItem value="user-3">Robert Johnson (Company Secretary)</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="permission-label">Permission</InputLabel>
            <Select
              labelId="permission-label"
              id="permission"
              value="view"
              label="Permission"
            >
              <MenuItem value="view">View Only</MenuItem>
              <MenuItem value="edit">Edit</MenuItem>
              <MenuItem value="full">Full Access</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Message (Optional)"
            multiline
            rows={2}
            placeholder="Add a note to the recipients"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareDialogClose}>Cancel</Button>
          <Button 
            onClick={() => {
              handleShareDialogClose();
              setSnackbar({
                open: true,
                message: 'Document shared successfully',
                severity: 'success'
              });
            }} 
            color="primary" 
            variant="contained"
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handlePreviewDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Document Preview
            </Typography>
            <IconButton onClick={handlePreviewDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {previewDocument && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
                    {previewDocument.fileType && previewDocument.fileType.includes('image') ? (
                      <img
                        src="https://via.placeholder.com/600x400"
                        alt="Document Preview"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    ) : previewDocument.fileType && previewDocument.fileType.includes('pdf') ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 1 }} />
                        <Typography variant="body2">
                          PDF Preview
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        {getFileIcon(previewDocument.fileType)}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Preview not available for this file type
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                      sx={{ mr: 1 }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/documents/details/${previewDocument.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={5}>
                  <Typography variant="h6" gutterBottom>
                    {previewDocument.name}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <StatusChip status={previewDocument.status} />
                  </Box>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        File Name
                      </Typography>
                      <Typography variant="body2">
                        {previewDocument.fileName || 'Unknown'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        File Type
                      </Typography>
                      <Typography variant="body2">
                        {documentTypes.find(t => t.id === previewDocument.type)?.name || 'Unknown'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        File Size
                      </Typography>
                      <Typography variant="body2">
                        {previewDocument.fileSize ? formatBytes(previewDocument.fileSize) : 'Unknown'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Entity
                      </Typography>
                      <Typography variant="body2">
                        {getEntityById(previewDocument.entityId)?.name || 'Unknown Entity'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Uploaded By
                      </Typography>
                      <Typography variant="body2">
                        {previewDocument.uploadedBy || 'Unknown User'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Uploaded On
                      </Typography>
                      <Typography variant="body2">
                        {previewDocument.uploadedAt ? new Date(previewDocument.uploadedAt).toLocaleString() : 'Unknown'}
                      </Typography>
                    </Box>
                    
                    {previewDocument.status === 'VERIFIED' && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Verified By
                        </Typography>
                        <Typography variant="body2">
                          {previewDocument.verifiedBy || 'Unknown User'}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body2">
                        {previewDocument.description || 'No description provided'}
                      </Typography>
                    </Box>
                    
                    {previewDocument.verificationNotes && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Verification Notes
                        </Typography>
                        <Typography variant="body2">
                          {previewDocument.verificationNotes}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
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

export default DocumentList;