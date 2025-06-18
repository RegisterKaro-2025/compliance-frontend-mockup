import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
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
  Tooltip,
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
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Stack,
  Badge,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileUpload as FileUploadIcon,
  CalendarMonth as CalendarMonthIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  NotificationsActive as NotificationsActiveIcon,
  Close as CloseIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

// Status chip component
const StatusChip = ({ status }) => {
  let color;
  let icon;
  
  switch(status) {
    case 'PENDING':
      color = 'warning';
      icon = <WarningIcon fontSize="small" />;
      break;
    case 'IN_PROGRESS':
      color = 'info';
      icon = <InfoIcon fontSize="small" />;
      break;
    case 'COMPLETED':
      color = 'success';
      icon = <CheckCircleIcon fontSize="small" />;
      break;
    case 'OVERDUE':
      color = 'error';
      icon = <WarningIcon fontSize="small" />;
      break;
    default:
      color = 'default';
      icon = null;
  }
  
  return (
    <Chip 
      icon={icon}
      label={status} 
      color={color} 
      size="small" 
      variant={status === 'PENDING' || status === 'IN_PROGRESS' ? 'outlined' : 'filled'}
    />
  );
};

// Priority chip component
const PriorityChip = ({ priority }) => {
  let color;
  
  switch(priority) {
    case 'HIGH':
      color = 'error';
      break;
    case 'MEDIUM':
      color = 'warning';
      break;
    case 'LOW':
      color = 'success';
      break;
    default:
      color = 'default';
  }
  
  return (
    <Chip label={priority} color={color} size="small" variant="outlined" />
  );
};

const ComplianceList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    compliances, 
    complianceTypes, 
    entities, 
    loading, 
    error,
    getComplianceById,
    getComplianceTypeById,
    getEntityById,
    updateCompliance,
    deleteCompliance,
    createCompliance
  } = useCompliance();
  
  // State for table and filters
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Action menu state
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedComplianceId, setSelectedComplianceId] = useState(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Form data for create compliance
  const [formData, setFormData] = useState({
    complianceTypeId: '',
    entityId: '',
    financialYear: '',
    dueDate: '',
    priority: 'MEDIUM',
    description: ''
  });
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Filter compliances based on search and filters
  const filteredCompliances = compliances.filter(compliance => {
    const entity = getEntityById(compliance.entityId);
    const complianceType = getComplianceTypeById(compliance.complianceTypeId);
    
    const matchesSearch = 
      (complianceType && complianceType.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entity && entity.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (compliance.description && compliance.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (compliance.financialYear && compliance.financialYear.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter ? compliance.status === statusFilter : true;
    const matchesType = typeFilter ? compliance.complianceTypeId === typeFilter : true;
    const matchesEntity = entityFilter ? compliance.entityId === entityFilter : true;
    
    // Due date filter logic
    let matchesDueDate = true;
    if (dueDateFilter) {
      const today = new Date();
      const dueDate = new Date(compliance.dueDate);
      
      switch(dueDateFilter) {
        case 'upcoming7':
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          matchesDueDate = dueDate > today && dueDate <= nextWeek;
          break;
        case 'upcoming30':
          const nextMonth = new Date();
          nextMonth.setDate(today.getDate() + 30);
          matchesDueDate = dueDate > today && dueDate <= nextMonth;
          break;
        case 'overdue':
          matchesDueDate = dueDate < today && compliance.status !== 'COMPLETED';
          break;
        default:
          matchesDueDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesEntity && matchesDueDate;
  });
  
  // Sort compliances
  const sortedCompliances = [...filteredCompliances].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortField) {
      case 'entityName':
        aValue = getEntityById(a.entityId)?.name || '';
        bValue = getEntityById(b.entityId)?.name || '';
        break;
      case 'complianceType':
        aValue = getComplianceTypeById(a.complianceTypeId)?.name || '';
        bValue = getComplianceTypeById(b.complianceTypeId)?.name || '';
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'dueDate':
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
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
  const paginatedCompliances = sortedCompliances.slice(
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
  const handleActionMenuOpen = (event, complianceId) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedComplianceId(complianceId);
  };
  
  // Handle action menu close
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedComplianceId(null);
  };
  
  // Handle view details
  const handleViewDetails = () => {
    handleActionMenuClose();
    navigate(`/compliance/${selectedComplianceId}`);
  };
  
  // Handle edit
  const handleEdit = () => {
    handleActionMenuClose();
    navigate(`/compliance/edit/${selectedComplianceId}`);
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
      await deleteCompliance(selectedComplianceId);
      setSnackbar({
        open: true,
        message: 'Compliance deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete compliance',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  // Handle document upload
  const handleUploadDocuments = () => {
    handleActionMenuClose();
    navigate(`/documents/upload?complianceId=${selectedComplianceId}`);
  };
  
  // Handle view calendar
  const handleViewCalendar = () => {
    handleActionMenuClose();
    navigate(`/compliance/calendar?complianceId=${selectedComplianceId}`);
  };
  
  // Handle government portal integration
  const handlePortalIntegration = () => {
    handleActionMenuClose();
    navigate(`/portals/integrations?complianceId=${selectedComplianceId}`);
  };
  
  // Handle notify dialog open
  const handleNotifyDialogOpen = () => {
    handleActionMenuClose();
    setNotifyDialogOpen(true);
  };
  
  // Handle notify dialog close
  const handleNotifyDialogClose = () => {
    setNotifyDialogOpen(false);
  };
  
  // Handle notify confirmation
  const handleNotifyConfirm = async () => {
    // In a real app, this would send notifications
    setSnackbar({
      open: true,
      message: 'Notifications sent successfully',
      severity: 'success'
    });
    setNotifyDialogOpen(false);
  };
  
  // Handle create dialog open
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  
  // Handle create dialog close
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setFormData({
      complianceTypeId: '',
      entityId: '',
      financialYear: '',
      dueDate: '',
      priority: 'MEDIUM',
      description: ''
    });
  };
  
  // Handle form data change
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle create compliance
  const handleCreateCompliance = async () => {
    try {
      // Add additional fields
      const newCompliance = {
        ...formData,
        status: 'PENDING',
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await createCompliance(newCompliance);
      
      setSnackbar({
        open: true,
        message: 'Compliance created successfully',
        severity: 'success'
      });
      
      handleCreateDialogClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create compliance',
        severity: 'error'
      });
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setEntityFilter('');
    setDueDateFilter('');
  };
  
  // Get compliance status stats
  const getComplianceStats = () => {
    return compliances.reduce((stats, compliance) => {
      const status = compliance.status;
      stats[status] = (stats[status] || 0) + 1;
      
      // Check for overdue items
      if (status !== 'COMPLETED' && new Date(compliance.dueDate) < new Date()) {
        stats.OVERDUE = (stats.OVERDUE || 0) + 1;
      }
      
      return stats;
    }, {});
  };
  
  // Get stats
  const stats = getComplianceStats();
  
  // Generate compliance summary cards
  const generateSummaryCards = () => {
    const summaryItems = [
      {
        title: 'Pending',
        count: stats.PENDING || 0,
        color: 'warning.main',
        icon: <WarningIcon />,
        onClick: () => setStatusFilter('PENDING')
      },
      {
        title: 'In Progress',
        count: stats.IN_PROGRESS || 0,
        color: 'info.main',
        icon: <InfoIcon />,
        onClick: () => setStatusFilter('IN_PROGRESS')
      },
      {
        title: 'Completed',
        count: stats.COMPLETED || 0,
        color: 'success.main',
        icon: <CheckCircleIcon />,
        onClick: () => setStatusFilter('COMPLETED')
      },
      {
        title: 'Overdue',
        count: stats.OVERDUE || 0,
        color: 'error.main',
        icon: <WarningIcon />,
        onClick: () => setDueDateFilter('overdue')
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
  
  // Empty state
  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No compliance items found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {(searchTerm || statusFilter || typeFilter || entityFilter || dueDateFilter) ? 
          'Try clearing your filters or search term' : 
          'Create your first compliance item to get started'}
      </Typography>
      {(searchTerm || statusFilter || typeFilter || entityFilter || dueDateFilter) ? (
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
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Compliance
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
            Compliance Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all compliance requirements for your entities
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
            sx={{ mr: 1 }}
          >
            Add Compliance
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            onClick={() => navigate('/compliance/calendar')}
          >
            Calendar View
          </Button>
        </Grid>
      </Grid>
      
      {/* Summary Cards */}
      {generateSummaryCards()}
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, entity, or description"
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
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
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
                    {complianceTypes.map((type) => (
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
                  <InputLabel id="due-date-filter-label">Due Date</InputLabel>
                  <Select
                    labelId="due-date-filter-label"
                    id="due-date-filter"
                    value={dueDateFilter}
                    label="Due Date"
                    onChange={(e) => setDueDateFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="upcoming7">Next 7 days</MenuItem>
                    <MenuItem value="upcoming30">Next 30 days</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {(searchTerm || statusFilter || typeFilter || entityFilter || dueDateFilter) && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Paper>
      
      <Paper>
        {filteredCompliances.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      onClick={() => handleSort('complianceType')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Compliance Type
                        {sortField === 'complianceType' && (
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
                    <TableCell 
                      onClick={() => handleSort('financialYear')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Financial Year
                        {sortField === 'financialYear' && (
                          sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell 
                      onClick={() => handleSort('dueDate')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Due Date
                        {sortField === 'dueDate' && (
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
                    <TableCell 
                      onClick={() => handleSort('priority')}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Priority
                        {sortField === 'priority' && (
                          sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>Documents</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCompliances.map((compliance) => {
                    const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                    const entity = getEntityById(compliance.entityId);
                    const isOverdue = new Date(compliance.dueDate) < new Date() && compliance.status !== 'COMPLETED';
                    
                    return (
                      <TableRow key={compliance.id} hover>
                        <TableCell>
                          {complianceType?.name || 'Unknown Type'}
                        </TableCell>
                        <TableCell>{entity?.name || 'Unknown Entity'}</TableCell>
                        <TableCell>{compliance.financialYear}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {new Date(compliance.dueDate).toLocaleDateString()}
                            {isOverdue && (
                              <Tooltip title="Overdue">
                                <WarningIcon color="error" fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={isOverdue ? 'OVERDUE' : compliance.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityChip priority={compliance.priority} />
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={compliance.documents?.length || 0} color="primary">
                            <DescriptionIcon color="action" />
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small"
                            onClick={(e) => handleActionMenuOpen(e, compliance.id)}
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
              count={filteredCompliances.length}
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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleUploadDocuments}>
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          Upload Documents
        </MenuItem>
        <MenuItem onClick={handleViewCalendar}>
          <ListItemIcon>
            <CalendarMonthIcon fontSize="small" />
          </ListItemIcon>
          View in Calendar
        </MenuItem>
        <MenuItem onClick={handlePortalIntegration}>
          <ListItemIcon>
            <CloudUploadIcon fontSize="small" />
          </ListItemIcon>
          Government Portal
        </MenuItem>
        <MenuItem onClick={handleNotifyDialogOpen}>
          <ListItemIcon>
            <NotificationsActiveIcon fontSize="small" />
          </ListItemIcon>
          Send Notifications
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
        <DialogTitle>Delete Compliance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this compliance item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notify Dialog */}
      <Dialog
        open={notifyDialogOpen}
        onClose={handleNotifyDialogClose}
      >
        <DialogTitle>Send Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Send notification reminders about this compliance requirement to stakeholders.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="notification-type-label">Notification Type</InputLabel>
            <Select
              labelId="notification-type-label"
              id="notification-type"
              value="reminder"
              label="Notification Type"
            >
              <MenuItem value="reminder">Due Date Reminder</MenuItem>
              <MenuItem value="update">Status Update</MenuItem>
              <MenuItem value="document">Document Request</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="recipients-label">Recipients</InputLabel>
            <Select
              labelId="recipients-label"
              id="recipients"
              value="all"
              label="Recipients"
            >
              <MenuItem value="all">All Stakeholders</MenuItem>
              <MenuItem value="directors">Directors Only</MenuItem>
              <MenuItem value="admins">Administrators Only</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Additional Message"
            multiline
            rows={3}
            placeholder="Add a custom message to include with the notification"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotifyDialogClose}>Cancel</Button>
          <Button 
            onClick={handleNotifyConfirm} 
            color="primary" 
            variant="contained"
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Compliance Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Compliance</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add a new compliance requirement for an entity.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="entity-label">Entity</InputLabel>
                <Select
                  labelId="entity-label"
                  id="entityId"
                  name="entityId"
                  value={formData.entityId}
                  label="Entity"
                  onChange={handleFormDataChange}
                >
                  {entities.map((entity) => (
                    <MenuItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="compliance-type-label">Compliance Type</InputLabel>
                <Select
                  labelId="compliance-type-label"
                  id="complianceTypeId"
                  name="complianceTypeId"
                  value={formData.complianceTypeId}
                  label="Compliance Type"
                  onChange={handleFormDataChange}
                >
                  {complianceTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="financial-year-label">Financial Year</InputLabel>
                <Select
                  labelId="financial-year-label"
                  id="financialYear"
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
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleFormDataChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleFormDataChange}
                >
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormDataChange}
                placeholder="Enter any additional details or notes about this compliance requirement"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button 
            onClick={handleCreateCompliance} 
            color="primary" 
            variant="contained"
            disabled={!formData.complianceTypeId || !formData.entityId || !formData.financialYear || !formData.dueDate}
          >
            Create
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

export default ComplianceList;