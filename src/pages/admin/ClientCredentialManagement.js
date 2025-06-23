import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemButton,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  FormGroup,
  Checkbox
} from '@mui/material';
import {
  VpnKey,
  Security,
  Business,
  AccountBalance,
  Receipt,
  Assignment,
  MonetizationOn,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Search,
  FilterList,
  Download,
  Upload,
  Refresh,
  Warning,
  CheckCircle,
  Error,
  Schedule,
  Person,
  Group,
  Lock,
  LockOpen,
  History,
  Backup,
  RestoreFromTrash,
  ExpandMore,
  MoreVert,
  ContentCopy,
  Launch,
  Notifications,
  NotificationsActive,
  Shield,
  AdminPanelSettings,
  SupervisorAccount
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCompliance } from '../../contexts/ComplianceContext';

const ClientCredentialManagement = () => {
  const { currentUser } = useAuth();
  const { entities } = useCompliance();
  
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPortal, setFilterPortal] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // view, add, edit
  const [showPassword, setShowPassword] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // Mock government portals data
  const governmentPortals = [
    {
      id: 'mca',
      name: 'MCA Portal',
      fullName: 'Ministry of Corporate Affairs',
      icon: <AccountBalance />,
      color: '#1976d2',
      url: 'https://mca.gov.in',
      credentialTypes: ['Login ID', 'Password', 'DSC', 'Mobile OTP'],
      description: 'Corporate filings, annual returns, director KYC'
    },
    {
      id: 'gst',
      name: 'GST Portal',
      fullName: 'Goods and Services Tax Network',
      icon: <Receipt />,
      color: '#388e3c',
      url: 'https://gst.gov.in',
      credentialTypes: ['GSTIN', 'Username', 'Password', 'Mobile OTP'],
      description: 'GST returns, payments, refunds'
    },
    {
      id: 'income_tax',
      name: 'Income Tax Portal',
      fullName: 'Income Tax Department',
      icon: <MonetizationOn />,
      color: '#f57c00',
      url: 'https://incometax.gov.in',
      credentialTypes: ['PAN', 'Password', 'Date of Birth', 'Mobile OTP'],
      description: 'ITR filing, TDS returns, tax payments'
    },
    {
      id: 'pf',
      name: 'PF Portal',
      fullName: 'Employees Provident Fund Organisation',
      icon: <Business />,
      color: '#7b1fa2',
      url: 'https://epfindia.gov.in',
      credentialTypes: ['Establishment Code', 'Username', 'Password', 'Mobile OTP'],
      description: 'PF returns, ECR uploads, member management'
    },
    {
      id: 'esic',
      name: 'ESIC Portal',
      fullName: 'Employees State Insurance Corporation',
      icon: <Shield />,
      color: '#d32f2f',
      url: 'https://esic.in',
      credentialTypes: ['Employer Code', 'Username', 'Password', 'Mobile OTP'],
      description: 'ESI returns, contributions, member registration'
    },
    {
      id: 'roc',
      name: 'ROC Portal',
      fullName: 'Registrar of Companies',
      icon: <Assignment />,
      color: '#303f9f',
      url: 'https://roc.gov.in',
      credentialTypes: ['SRN', 'Username', 'Password', 'DSC'],
      description: 'Company registrations, amendments, compliance certificates'
    }
  ];

  // Mock team members
  const teamMembers = [
    { id: 'compliance_officer_1', name: 'Priya Sharma', role: 'Senior Compliance Officer' },
    { id: 'compliance_officer_2', name: 'Rajesh Kumar', role: 'Compliance Officer' },
    { id: 'compliance_officer_3', name: 'Anita Singh', role: 'Junior Compliance Officer' },
    { id: 'admin', name: 'Admin User', role: 'System Administrator' }
  ];

  // Mock client credentials data
  const [clientCredentials, setClientCredentials] = useState([
    {
      id: 'cred-001',
      clientId: 'ent-001',
      clientName: 'XYZ Private Limited',
      portalId: 'mca',
      portalName: 'MCA Portal',
      credentials: {
        'Login ID': 'xyz_pvt_ltd@email.com',
        'Password': '••••••••••',
        'DSC': 'DSC_XYZ_2024.p12',
        'Mobile OTP': '+91-9876543210'
      },
      status: 'active',
      lastUsed: '2024-01-15T10:30:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      createdBy: 'admin',
      createdAt: '2023-04-01T09:00:00Z',
      updatedBy: 'compliance_officer_1',
      updatedAt: '2024-01-10T14:20:00Z',
      accessLog: [
        { timestamp: '2024-01-15T10:30:00Z', action: 'LOGIN', user: 'compliance_officer_1', success: true },
        { timestamp: '2024-01-14T15:45:00Z', action: 'FILING_SUBMISSION', user: 'compliance_officer_2', success: true },
        { timestamp: '2024-01-13T11:20:00Z', action: 'LOGIN', user: 'compliance_officer_1', success: false }
      ],
      assignedTeam: ['compliance_officer_1', 'compliance_officer_2'],
      notes: 'Primary MCA credentials for annual filings'
    },
    {
      id: 'cred-002',
      clientId: 'ent-001',
      clientName: 'XYZ Private Limited',
      portalId: 'gst',
      portalName: 'GST Portal',
      credentials: {
        'GSTIN': '27AABCU9603R1ZX',
        'Username': 'xyz_gst_user',
        'Password': '••••••••••',
        'Mobile OTP': '+91-9876543210'
      },
      status: 'active',
      lastUsed: '2024-01-16T09:15:00Z',
      expiryDate: '2024-06-30T23:59:59Z',
      createdBy: 'admin',
      createdAt: '2023-04-01T09:00:00Z',
      updatedBy: 'compliance_officer_1',
      updatedAt: '2024-01-12T16:30:00Z',
      accessLog: [
        { timestamp: '2024-01-16T09:15:00Z', action: 'GSTR3B_FILING', user: 'compliance_officer_1', success: true },
        { timestamp: '2024-01-15T14:30:00Z', action: 'LOGIN', user: 'compliance_officer_2', success: true }
      ],
      assignedTeam: ['compliance_officer_1', 'compliance_officer_2'],
      notes: 'GST credentials for monthly returns'
    },
    {
      id: 'cred-003',
      clientId: 'ent-002',
      clientName: 'ABC Industries Ltd',
      portalId: 'income_tax',
      portalName: 'Income Tax Portal',
      credentials: {
        'PAN': 'AABCA1234C',
        'Password': '••••••••••',
        'Date of Birth': '15/03/1985',
        'Mobile OTP': '+91-9876543211'
      },
      status: 'expiring_soon',
      lastUsed: '2024-01-10T11:45:00Z',
      expiryDate: '2024-02-28T23:59:59Z',
      createdBy: 'admin',
      createdAt: '2023-05-15T10:00:00Z',
      updatedBy: 'compliance_officer_3',
      updatedAt: '2024-01-05T12:15:00Z',
      accessLog: [
        { timestamp: '2024-01-10T11:45:00Z', action: 'ITR_FILING', user: 'compliance_officer_3', success: true }
      ],
      assignedTeam: ['compliance_officer_3'],
      notes: 'Income tax credentials - password expires soon'
    },
    {
      id: 'cred-004',
      clientId: 'ent-003',
      clientName: 'DEF Enterprises',
      portalId: 'pf',
      portalName: 'PF Portal',
      credentials: {
        'Establishment Code': 'DL/CPM/1234567',
        'Username': 'def_pf_admin',
        'Password': '••••••••••',
        'Mobile OTP': '+91-9876543212'
      },
      status: 'inactive',
      lastUsed: '2023-12-20T16:20:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      createdBy: 'admin',
      createdAt: '2023-06-01T11:00:00Z',
      updatedBy: 'compliance_officer_2',
      updatedAt: '2023-12-20T16:20:00Z',
      accessLog: [
        { timestamp: '2023-12-20T16:20:00Z', action: 'ECR_UPLOAD', user: 'compliance_officer_2', success: false }
      ],
      assignedTeam: ['compliance_officer_2'],
      notes: 'PF credentials - needs verification'
    }
  ]);

  // Form state for add/edit dialog
  const [formData, setFormData] = useState({
    clientId: '',
    portalId: '',
    credentials: {},
    expiryDate: '',
    assignedTeam: [],
    notes: ''
  });

  useEffect(() => {
    // Initialize form data when dialog opens
    if (openDialog && dialogMode === 'edit' && selectedCredential) {
      setFormData({
        clientId: selectedCredential.clientId,
        portalId: selectedCredential.portalId,
        credentials: { ...selectedCredential.credentials },
        expiryDate: selectedCredential.expiryDate ? selectedCredential.expiryDate.split('T')[0] : '',
        assignedTeam: [...selectedCredential.assignedTeam],
        notes: selectedCredential.notes || ''
      });
    } else if (openDialog && dialogMode === 'add') {
      setFormData({
        clientId: '',
        portalId: '',
        credentials: {},
        expiryDate: '',
        assignedTeam: [],
        notes: ''
      });
    }
  }, [openDialog, dialogMode, selectedCredential]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'portal') {
      setFilterPortal(value);
    } else if (type === 'status') {
      setFilterStatus(value);
    }
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (mode, credential = null) => {
    setDialogMode(mode);
    setSelectedCredential(credential);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCredential(null);
    setFormData({
      clientId: '',
      portalId: '',
      credentials: {},
      expiryDate: '',
      assignedTeam: [],
      notes: ''
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCredentialChange = (credType, value) => {
    setFormData(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [credType]: value
      }
    }));
  };

  const handleSaveCredential = () => {
    if (dialogMode === 'add') {
      const newCredential = {
        id: `cred-${Date.now()}`,
        clientId: formData.clientId,
        clientName: entities.find(e => e.id === formData.clientId)?.name || 'Unknown Client',
        portalId: formData.portalId,
        portalName: governmentPortals.find(p => p.id === formData.portalId)?.name || 'Unknown Portal',
        credentials: formData.credentials,
        status: 'active',
        lastUsed: null,
        expiryDate: formData.expiryDate ? `${formData.expiryDate}T23:59:59Z` : null,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedBy: currentUser.id,
        updatedAt: new Date().toISOString(),
        accessLog: [],
        assignedTeam: formData.assignedTeam,
        notes: formData.notes
      };
      setClientCredentials(prev => [...prev, newCredential]);
    } else if (dialogMode === 'edit') {
      setClientCredentials(prev => prev.map(cred => 
        cred.id === selectedCredential.id 
          ? {
              ...cred,
              credentials: formData.credentials,
              expiryDate: formData.expiryDate ? `${formData.expiryDate}T23:59:59Z` : null,
              assignedTeam: formData.assignedTeam,
              notes: formData.notes,
              updatedBy: currentUser.id,
              updatedAt: new Date().toISOString()
            }
          : cred
      ));
    }
    handleCloseDialog();
  };

  const handleDeleteCredential = (credentialId) => {
    setClientCredentials(prev => prev.filter(cred => cred.id !== credentialId));
  };

  const togglePasswordVisibility = (credentialId, credType) => {
    setShowPassword(prev => ({
      ...prev,
      [`${credentialId}-${credType}`]: !prev[`${credentialId}-${credType}`]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'expiring_soon': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'inactive': return <Error />;
      case 'expiring_soon': return <Warning />;
      case 'expired': return <Error />;
      default: return <Error />;
    }
  };

  const filteredCredentials = clientCredentials.filter(cred => {
    const matchesSearch = cred.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.portalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPortal = filterPortal === 'all' || cred.portalId === filterPortal;
    const matchesStatus = filterStatus === 'all' || cred.status === filterStatus;
    
    return matchesSearch && matchesPortal && matchesStatus;
  });

  const paginatedCredentials = filteredCredentials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get portal statistics
  const getPortalStats = () => {
    const stats = {};
    governmentPortals.forEach(portal => {
      const portalCreds = clientCredentials.filter(cred => cred.portalId === portal.id);
      stats[portal.id] = {
        total: portalCreds.length,
        active: portalCreds.filter(cred => cred.status === 'active').length,
        expiring: portalCreds.filter(cred => cred.status === 'expiring_soon').length,
        inactive: portalCreds.filter(cred => cred.status === 'inactive').length
      };
    });
    return stats;
  };

  const portalStats = getPortalStats();

  // Render overview tab
  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VpnKey color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4">{clientCredentials.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Credentials
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle color="success" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4">
                  {clientCredentials.filter(cred => cred.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Credentials
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning color="warning" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4">
                  {clientCredentials.filter(cred => cred.status === 'expiring_soon').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expiring Soon
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Business color="info" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4">{governmentPortals.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Government Portals
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Portal Statistics */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Portal-wise Credential Statistics
          </Typography>
          <Grid container spacing={2}>
            {governmentPortals.map(portal => (
              <Grid item xs={12} sm={6} md={4} key={portal.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        bgcolor: portal.color, 
                        color: 'white', 
                        p: 1, 
                        borderRadius: 1, 
                        mr: 2 
                      }}>
                        {portal.icon}
                      </Box>
                      <Typography variant="h6">{portal.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {portalStats[portal.id]?.total || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">Active:</Typography>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {portalStats[portal.id]?.active || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="warning.main">Expiring:</Typography>
                      <Typography variant="body2" color="warning.main" fontWeight="bold">
                        {portalStats[portal.id]?.expiring || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="error.main">Inactive:</Typography>
                      <Typography variant="body2" color="error.main" fontWeight="bold">
                        {portalStats[portal.id]?.inactive || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  // Render credentials management tab
  const renderCredentialsTab = () => (
    <Box>
      {/* Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search clients or portals..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Portal</InputLabel>
            <Select
              value={filterPortal}
              label="Portal"
              onChange={(e) => handleFilterChange('portal', e.target.value)}
            >
              <MenuItem value="all">All Portals</MenuItem>
              {governmentPortals.map(portal => (
                <MenuItem key={portal.id} value={portal.id}>{portal.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="expiring_soon">Expiring Soon</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<Upload />}>
            Import
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Credentials
          </Button>
        </Box>
      </Box>

      {/* Credentials Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Portal</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Assigned Team</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCredentials.map((credential) => (
                <TableRow key={credential.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{credential.clientName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {credential.clientId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        bgcolor: governmentPortals.find(p => p.id === credential.portalId)?.color || '#grey', 
                        color: 'white', 
                        p: 0.5, 
                        borderRadius: 1, 
                        mr: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {governmentPortals.find(p => p.id === credential.portalId)?.icon}
                      </Box>
                      <Typography variant="body2">{credential.portalName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(credential.status)}
                      label={credential.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(credential.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {credential.lastUsed 
                        ? new Date(credential.lastUsed).toLocaleDateString()
                        : 'Never'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {credential.expiryDate 
                        ? new Date(credential.expiryDate).toLocaleDateString()
                        : 'No expiry'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                      {credential.assignedTeam.map((userId, index) => (
                        <Avatar key={userId} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {userId.charAt(0).toUpperCase()}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDialog('view', credential)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDialog('edit', credential)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCredential(credential.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCredentials.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );

  // Render portal configuration tab
  const renderPortalConfigTab = () => (
    <Grid container spacing={3}>
      {governmentPortals.map(portal => (
        <Grid item xs={12} key={portal.id}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{
                  bgcolor: portal.color,
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  mr: 2
                }}>
                  {portal.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{portal.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {portal.fullName}
                  </Typography>
                </Box>
                <Chip
                  label={`${portalStats[portal.id]?.total || 0} clients`}
                  color="primary"
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Portal Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Launch />
                      </ListItemIcon>
                      <ListItemText
                        primary="Portal URL"
                        secondary={portal.url}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <VpnKey />
                      </ListItemIcon>
                      <ListItemText
                        primary="Required Credentials"
                        secondary={portal.credentialTypes.join(', ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Assignment />
                      </ListItemIcon>
                      <ListItemText
                        primary="Description"
                        secondary={portal.description}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Client Statistics
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Total Clients:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {portalStats[portal.id]?.total || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="success.main">Active:</Typography>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {portalStats[portal.id]?.active || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="warning.main">Expiring:</Typography>
                      <Typography variant="body2" color="warning.main" fontWeight="bold">
                        {portalStats[portal.id]?.expiring || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="error.main">Inactive:</Typography>
                      <Typography variant="body2" color="error.main" fontWeight="bold">
                        {portalStats[portal.id]?.inactive || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );

  // Render access logs tab
  const renderAccessLogsTab = () => {
    const allAccessLogs = clientCredentials.flatMap(cred =>
      cred.accessLog.map(log => ({
        ...log,
        credentialId: cred.id,
        clientName: cred.clientName,
        portalName: cred.portalName
      }))
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Recent Access Logs
        </Typography>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Portal</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allAccessLogs.slice(0, 20).map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.clientName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.portalName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.action}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.user}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.success ? 'Success' : 'Failed'}
                        color={log.success ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  };

  // Render credential dialog
  const renderCredentialDialog = () => {
    const selectedPortal = governmentPortals.find(p => p.id === formData.portalId);
    
    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'view' ? 'View Credentials' :
           dialogMode === 'edit' ? 'Edit Credentials' : 'Add New Credentials'}
        </DialogTitle>
        <DialogContent>
          {dialogMode !== 'view' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={formData.clientId}
                    label="Client"
                    onChange={(e) => handleFormChange('clientId', e.target.value)}
                    disabled={dialogMode === 'edit'}
                  >
                    {entities.map(entity => (
                      <MenuItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Portal</InputLabel>
                  <Select
                    value={formData.portalId}
                    label="Portal"
                    onChange={(e) => handleFormChange('portalId', e.target.value)}
                    disabled={dialogMode === 'edit'}
                  >
                    {governmentPortals.map(portal => (
                      <MenuItem key={portal.id} value={portal.id}>
                        {portal.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {(selectedPortal || selectedCredential) && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Credentials
              </Typography>
              <Grid container spacing={2}>
                {(selectedPortal?.credentialTypes ||
                  governmentPortals.find(p => p.id === selectedCredential?.portalId)?.credentialTypes || []
                ).map(credType => (
                  <Grid item xs={12} md={6} key={credType}>
                    <TextField
                      fullWidth
                      label={credType}
                      type={credType.toLowerCase().includes('password') ? 'password' : 'text'}
                      value={dialogMode === 'view'
                        ? selectedCredential?.credentials[credType] || ''
                        : formData.credentials[credType] || ''
                      }
                      onChange={(e) => handleCredentialChange(credType, e.target.value)}
                      disabled={dialogMode === 'view'}
                      InputProps={credType.toLowerCase().includes('password') ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility(selectedCredential?.id || 'new', credType)}
                              edge="end"
                            >
                              {showPassword[`${selectedCredential?.id || 'new'}-${credType}`] ?
                                <VisibilityOff /> : <Visibility />
                              }
                            </IconButton>
                          </InputAdornment>
                        )
                      } : undefined}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {dialogMode !== 'view' && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Assigned Team</InputLabel>
                    <Select
                      multiple
                      value={formData.assignedTeam}
                      label="Assigned Team"
                      onChange={(e) => handleFormChange('assignedTeam', e.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={teamMembers.find(m => m.id === value)?.name || value}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {teamMembers.map(member => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {dialogMode === 'view' && selectedCredential && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Access Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Last Used:</Typography>
                  <Typography variant="body1">
                    {selectedCredential.lastUsed
                      ? new Date(selectedCredential.lastUsed).toLocaleString()
                      : 'Never'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Created By:</Typography>
                  <Typography variant="body1">{selectedCredential.createdBy}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Created At:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedCredential.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedCredential.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Notes:</Typography>
                  <Typography variant="body1">{selectedCredential.notes || 'No notes'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button
              onClick={handleSaveCredential}
              variant="contained"
              disabled={!formData.clientId || !formData.portalId}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  const tabs = [
    { label: 'Overview', content: renderOverviewTab },
    { label: 'Credentials', content: renderCredentialsTab },
    { label: 'Portal Config', content: renderPortalConfigTab },
    { label: 'Access Logs', content: renderAccessLogsTab }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Client Credential Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Backup />}>
            Backup Credentials
          </Button>
        </Box>
      </Box>

      {/* Alert for expiring credentials */}
      {clientCredentials.filter(cred => cred.status === 'expiring_soon').length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {clientCredentials.filter(cred => cred.status === 'expiring_soon').length} credentials are expiring soon.
          Please review and update them.
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabs[tabValue]?.content()}
        </Box>
      </Paper>

      {/* Credential Dialog */}
      {renderCredentialDialog()}
    </Container>
  );
};

export default ClientCredentialManagement;