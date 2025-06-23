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
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  Badge,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Person,
  PersonAdd,
  Group,
  Security,
  Settings,
  Email,
  Phone,
  Business,
  Assignment,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  ExpandMore,
  MoreVert,
  Lock,
  LockOpen,
  Refresh,
  Download,
  Upload,
  VpnKey,
  AdminPanelSettings,
  SupervisorAccount,
  AccountCircle,
  Shield,
  Key,
  History,
  AccessTime,
  LocationOn,
  Computer,
  Smartphone
} from '@mui/icons-material';
// Date picker functionality removed for compatibility

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('view'); // view, edit, create
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkActions, setBulkActions] = useState([]);

  // Mock data for users
  const mockUsers = [
    {
      id: 'USR-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@registerkaro.in',
      phone: '+91 9876543210',
      role: 'System Admin',
      status: 'active',
      lastLogin: '2023-06-15T10:30:00Z',
      createdAt: '2023-01-15T09:00:00Z',
      department: 'IT',
      entities: ['All Entities'],
      permissions: ['full_access'],
      avatar: null,
      loginHistory: [
        { date: '2023-06-15T10:30:00Z', ip: '192.168.1.100', device: 'Chrome on Windows' },
        { date: '2023-06-14T09:15:00Z', ip: '192.168.1.100', device: 'Chrome on Windows' },
        { date: '2023-06-13T14:45:00Z', ip: '10.0.0.50', device: 'Safari on iPhone' }
      ]
    },
    {
      id: 'USR-002',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@registerkaro.in',
      phone: '+91 9876543211',
      role: 'Compliance Officer',
      status: 'active',
      lastLogin: '2023-06-15T08:45:00Z',
      createdAt: '2023-02-01T10:00:00Z',
      department: 'Compliance',
      entities: ['ABC Corporation', 'XYZ Limited', 'DEF Industries'],
      permissions: ['compliance_management', 'document_access', 'report_generation'],
      avatar: null,
      loginHistory: [
        { date: '2023-06-15T08:45:00Z', ip: '192.168.1.101', device: 'Chrome on Windows' },
        { date: '2023-06-14T08:30:00Z', ip: '192.168.1.101', device: 'Chrome on Windows' }
      ]
    },
    {
      id: 'USR-003',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@registerkaro.in',
      phone: '+91 9876543212',
      role: 'Client Admin',
      status: 'active',
      lastLogin: '2023-06-14T16:20:00Z',
      createdAt: '2023-03-10T11:30:00Z',
      department: 'Client Services',
      entities: ['GHI Private Ltd'],
      permissions: ['entity_management', 'compliance_view', 'document_upload'],
      avatar: null,
      loginHistory: [
        { date: '2023-06-14T16:20:00Z', ip: '203.0.113.45', device: 'Chrome on MacOS' },
        { date: '2023-06-13T10:15:00Z', ip: '203.0.113.45', device: 'Chrome on MacOS' }
      ]
    },
    {
      id: 'USR-004',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@registerkaro.in',
      phone: '+91 9876543213',
      role: 'Auditor',
      status: 'inactive',
      lastLogin: '2023-06-10T12:00:00Z',
      createdAt: '2023-04-05T14:15:00Z',
      department: 'Audit',
      entities: ['All Entities'],
      permissions: ['audit_access', 'report_generation', 'compliance_view'],
      avatar: null,
      loginHistory: [
        { date: '2023-06-10T12:00:00Z', ip: '192.168.1.102', device: 'Firefox on Windows' }
      ]
    },
    {
      id: 'USR-005',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@registerkaro.in',
      phone: '+91 9876543214',
      role: 'Regular User',
      status: 'pending',
      lastLogin: null,
      createdAt: '2023-06-14T16:00:00Z',
      department: 'Operations',
      entities: ['JKL Company'],
      permissions: ['basic_access', 'document_view'],
      avatar: null,
      loginHistory: []
    }
  ];

  // Mock data for roles
  const mockRoles = [
    {
      id: 'ROLE-001',
      name: 'System Admin',
      description: 'Full system access with all administrative privileges',
      permissions: [
        'user_management', 'role_management', 'system_settings', 'full_access',
        'compliance_management', 'document_management', 'report_generation',
        'audit_access', 'entity_management', 'portal_integration'
      ],
      userCount: 2,
      isSystem: true
    },
    {
      id: 'ROLE-002',
      name: 'Compliance Officer',
      description: 'Manages compliance activities and oversees multiple entities',
      permissions: [
        'compliance_management', 'document_access', 'report_generation',
        'entity_view', 'task_assignment', 'notification_management'
      ],
      userCount: 8,
      isSystem: false
    },
    {
      id: 'ROLE-003',
      name: 'Client Admin',
      description: 'Administrative access for specific client entities',
      permissions: [
        'entity_management', 'compliance_view', 'document_upload',
        'user_invite', 'basic_reporting'
      ],
      userCount: 15,
      isSystem: false
    },
    {
      id: 'ROLE-004',
      name: 'Auditor',
      description: 'Read-only access for audit and compliance review',
      permissions: [
        'audit_access', 'report_generation', 'compliance_view',
        'document_view', 'entity_view'
      ],
      userCount: 5,
      isSystem: false
    },
    {
      id: 'ROLE-005',
      name: 'Regular User',
      description: 'Basic access for viewing assigned compliance items',
      permissions: [
        'basic_access', 'document_view', 'compliance_view_assigned'
      ],
      userCount: 25,
      isSystem: false
    }
  ];

  const userStats = {
    total: 55,
    active: 45,
    inactive: 8,
    pending: 2,
    lastWeekSignups: 5
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setRoles(mockRoles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle />;
      case 'inactive':
        return <Cancel />;
      case 'pending':
        return <Warning />;
      default:
        return <Info />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'System Admin':
        return <AdminPanelSettings />;
      case 'Compliance Officer':
        return <SupervisorAccount />;
      case 'Client Admin':
        return <AccountCircle />;
      case 'Auditor':
        return <Shield />;
      case 'Regular User':
        return <Person />;
      default:
        return <Person />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || user.status === statusFilter;
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDialogType('view');
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogType('edit');
    setDialogOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogType('create');
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    console.log('Deleting user:', userId);
    // Implement delete logic
  };

  const handleToggleUserStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log('Toggling user status:', userId, newStatus);
    // Implement status toggle logic
  };

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const renderUserDialog = () => {
    if (!selectedUser && dialogType !== 'create') return null;

    return (
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'create' ? 'Create New User' : 
           dialogType === 'edit' ? 'Edit User' : 'User Details'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Basic Info" />
            <Tab label="Permissions" />
            <Tab label="Activity" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={selectedUser?.firstName || ''}
                  disabled={dialogType === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={selectedUser?.lastName || ''}
                  disabled={dialogType === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedUser?.email || ''}
                  disabled={dialogType === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedUser?.phone || ''}
                  disabled={dialogType === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={selectedUser?.role || ''}
                    label="Role"
                    disabled={dialogType === 'view'}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedUser?.department || ''}
                    label="Department"
                    disabled={dialogType === 'view'}
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="Compliance">Compliance</MenuItem>
                    <MenuItem value="Client Services">Client Services</MenuItem>
                    <MenuItem value="Audit">Audit</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Assigned Entities</InputLabel>
                  <Select
                    multiple
                    value={selectedUser?.entities || []}
                    label="Assigned Entities"
                    disabled={dialogType === 'view'}
                  >
                    <MenuItem value="All Entities">All Entities</MenuItem>
                    <MenuItem value="ABC Corporation">ABC Corporation</MenuItem>
                    <MenuItem value="XYZ Limited">XYZ Limited</MenuItem>
                    <MenuItem value="DEF Industries">DEF Industries</MenuItem>
                    <MenuItem value="GHI Private Ltd">GHI Private Ltd</MenuItem>
                    <MenuItem value="JKL Company">JKL Company</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {dialogType !== 'create' && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={selectedUser?.status === 'active'}
                        disabled={dialogType === 'view'}
                      />
                    }
                    label="Active Status"
                  />
                </Grid>
              )}
            </Grid>
          )}

          {tabValue === 1 && selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>User Permissions</Typography>
              <FormGroup>
                {selectedUser.permissions.map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={<Checkbox checked disabled={dialogType === 'view'} />}
                    label={permission.replace('_', ' ').toUpperCase()}
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          {tabValue === 2 && selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Login History</Typography>
              <List>
                {selectedUser.loginHistory.map((login, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary={new Date(login.date).toLocaleString()}
                      secondary={`${login.device} - IP: ${login.ip}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {dialogType === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogType !== 'view' && (
            <Button variant="contained">
              {dialogType === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Download />}>
            Export Users
          </Button>
          <Button variant="outlined" startIcon={<Upload />}>
            Import Users
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PersonAdd />}
            onClick={handleCreateUser}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{userStats.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{userStats.active}</Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{userStats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonAdd sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{userStats.lastWeekSignups}</Typography>
              <Typography variant="body2" color="text.secondary">
                New This Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Entities</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {user.firstName[0]}{user.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Box>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status.toUpperCase()}
                      color={getStatusColor(user.status)}
                      icon={getStatusIcon(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.entities.length > 1 ? `${user.entities.length} entities` : user.entities[0]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewUser(user)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                        >
                          {user.status === 'active' ? <Lock /> : <LockOpen />}
                        </IconButton>
                      </Tooltip>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuClick(e, user)}
                      >
                        <MoreVert />
                      </IconButton>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleViewUser(selectedUser); handleMenuClose(); }}>
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => { handleEditUser(selectedUser); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} /> Edit User
        </MenuItem>
        <MenuItem onClick={() => { console.log('Reset password'); handleMenuClose(); }}>
          <VpnKey sx={{ mr: 1 }} /> Reset Password
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => { handleDeleteUser(selectedUser?.id); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} /> Delete User
        </MenuItem>
      </Menu>

      {/* User Dialog */}
      {renderUserDialog()}
    </Container>
  );
};

export default UserManagement;