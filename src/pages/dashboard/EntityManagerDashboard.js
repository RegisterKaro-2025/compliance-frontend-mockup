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
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Divider,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Business,
  Assignment,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Description,
  Notifications,
  CalendarToday,
  Upload,
  Download,
  Visibility,
  Edit,
  MoreVert,
  TaskAlt,
  PendingActions,
  AccessTime,
  AccountBalance,
  Receipt,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EntityManagerDashboard = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState('entity-1');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from API based on user's assigned entities
  useEffect(() => {
    const mockDashboardData = {
      userInfo: {
        name: currentUser?.name || 'Entity Manager',
        role: 'Entity Manager',
        assignedEntities: 3,
        lastLogin: '2023-06-15T09:30:00Z'
      },
      entities: [
        {
          id: 'entity-1',
          name: 'ABC Private Limited',
          cin: 'U12345MH2020PTC123456',
          status: 'Active',
          complianceHealth: 85,
          upcomingDeadlines: 3,
          pendingTasks: 5,
          recentActivity: '2023-06-15'
        },
        {
          id: 'entity-2',
          name: 'XYZ Solutions Pvt Ltd',
          cin: 'U67890DL2019PTC789012',
          status: 'Active',
          complianceHealth: 92,
          upcomingDeadlines: 1,
          pendingTasks: 2,
          recentActivity: '2023-06-14'
        },
        {
          id: 'entity-3',
          name: 'DEF Industries Ltd',
          cin: 'U11111KA2021PTC111111',
          status: 'Active',
          complianceHealth: 78,
          upcomingDeadlines: 4,
          pendingTasks: 7,
          recentActivity: '2023-06-13'
        }
      ],
      selectedEntityData: {
        'entity-1': {
          name: 'ABC Private Limited',
          cin: 'U12345MH2020PTC123456',
          pan: 'AADCB2230M',
          gstin: '27AADCB2230M1ZR',
          complianceOfficer: 'John Doe',
          complianceHealth: {
            overall: 85,
            statutory: 90,
            internal: 80,
            governance: 85
          },
          upcomingTasks: [
            {
              id: 1,
              type: 'GST Return - GSTR-3B',
              dueDate: '2023-06-20',
              status: 'pending',
              priority: 'high',
              daysRemaining: 5,
              assignedTo: 'John Doe'
            },
            {
              id: 2,
              type: 'TDS Return - Form 24Q',
              dueDate: '2023-07-31',
              status: 'in_progress',
              priority: 'medium',
              daysRemaining: 46,
              assignedTo: 'John Doe'
            },
            {
              id: 3,
              type: 'Board Meeting Minutes',
              dueDate: '2023-06-25',
              status: 'pending',
              priority: 'medium',
              daysRemaining: 10,
              assignedTo: 'Internal'
            }
          ],
          complianceStatus: [
            { name: 'Completed', value: 18, color: '#4caf50' },
            { name: 'In Progress', value: 4, color: '#ff9800' },
            { name: 'Pending', value: 3, color: '#f44336' },
            { name: 'Overdue', value: 0, color: '#9c27b0' }
          ],
          monthlyTrend: [
            { month: 'Jan', completed: 3, pending: 1 },
            { month: 'Feb', completed: 2, pending: 0 },
            { month: 'Mar', completed: 4, pending: 1 },
            { month: 'Apr', completed: 3, pending: 2 },
            { month: 'May', completed: 6, pending: 0 },
            { month: 'Jun', completed: 0, pending: 3 }
          ],
          recentActivities: [
            {
              id: 1,
              type: 'document_uploaded',
              description: 'Financial statements uploaded for AOC-4 filing',
              timestamp: '2023-06-15T14:30:00Z',
              user: 'You'
            },
            {
              id: 2,
              type: 'compliance_updated',
              description: 'GST Return GSTR-1 status updated to completed',
              timestamp: '2023-06-14T11:15:00Z',
              user: 'John Doe'
            },
            {
              id: 3,
              type: 'reminder_sent',
              description: 'Reminder sent for TDS Return submission',
              timestamp: '2023-06-13T16:45:00Z',
              user: 'System'
            }
          ],
          pendingDocuments: [
            {
              id: 1,
              name: 'Board Resolution - AGM',
              type: 'Legal',
              dueDate: '2023-06-18',
              status: 'required',
              complianceType: 'Annual ROC Filing'
            },
            {
              id: 2,
              name: 'Bank Statement - May 2023',
              type: 'Financial',
              dueDate: '2023-06-20',
              status: 'required',
              complianceType: 'GST Return'
            },
            {
              id: 3,
              name: 'Salary Register - Q1 2023',
              type: 'HR',
              dueDate: '2023-06-25',
              status: 'optional',
              complianceType: 'TDS Return'
            }
          ]
        }
      }
    };

    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEntityChange = (event) => {
    setSelectedEntity(event.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'error';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'success';
    if (health >= 75) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading entity manager dashboard...</Typography>
      </Container>
    );
  }

  const currentEntityData = dashboardData.selectedEntityData[selectedEntity];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* User Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main' }}>
              <Business fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {dashboardData.userInfo.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Entity Manager
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Chip 
                  label={`${dashboardData.userInfo.assignedEntities} Entities`} 
                  color="primary" 
                  size="small" 
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`Last login: ${new Date(dashboardData.userInfo.lastLogin).toLocaleDateString()}`} 
                  variant="outlined" 
                  size="small" 
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Entity</InputLabel>
              <Select
                value={selectedEntity}
                label="Select Entity"
                onChange={handleEntityChange}
              >
                {dashboardData.entities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Entity Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {dashboardData.entities.map((entity) => (
          <Grid item xs={12} md={4} key={entity.id}>
            <Card sx={{ 
              border: selectedEntity === entity.id ? 2 : 0,
              borderColor: selectedEntity === entity.id ? 'primary.main' : 'transparent'
            }}>
              <CardHeader
                title={entity.name}
                subheader={entity.cin}
                action={
                  <Chip 
                    label={entity.status} 
                    color="success" 
                    size="small"
                  />
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color={getHealthColor(entity.complianceHealth)}>
                        {entity.complianceHealth}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Health Score
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {entity.upcomingDeadlines}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upcoming
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {entity.pendingTasks} pending tasks • Last activity: {entity.recentActivity}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant={selectedEntity === entity.id ? "contained" : "outlined"} 
                    size="small" 
                    fullWidth
                    onClick={() => setSelectedEntity(entity.id)}
                  >
                    {selectedEntity === entity.id ? "Selected" : "View Details"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Selected Entity Details */}
      {currentEntityData && (
        <>
          {/* Entity Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                  <AccountBalance fontSize="large" />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" gutterBottom>
                  {currentEntityData.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      CIN: {currentEntityData.cin}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      PAN: {currentEntityData.pan}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      GSTIN: {currentEntityData.gstin}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`Compliance Officer: ${currentEntityData.complianceOfficer}`} 
                    variant="outlined" 
                    size="small" 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Compliance Health Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Overall Health</Typography>
                  </Box>
                  <Typography variant="h3" color="primary">
                    {currentEntityData.complianceHealth.overall}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentEntityData.complianceHealth.overall} 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Statutory</Typography>
                  </Box>
                  <Typography variant="h3" color="success.main">
                    {currentEntityData.complianceHealth.statutory}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentEntityData.complianceHealth.statutory} 
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Description color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Internal</Typography>
                  </Box>
                  <Typography variant="h3" color="warning.main">
                    {currentEntityData.complianceHealth.internal}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentEntityData.complianceHealth.internal} 
                    color="warning"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Governance</Typography>
                  </Box>
                  <Typography variant="h3" color="info.main">
                    {currentEntityData.complianceHealth.governance}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentEntityData.complianceHealth.governance} 
                    color="info"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Tasks & Deadlines" />
              <Tab label="Documents" />
              <Tab label="Compliance Status" />
              <Tab label="Activities" />
            </Tabs>

            {/* Tasks & Deadlines Tab */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Upcoming Tasks */}
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardHeader 
                        title="Upcoming Tasks & Deadlines" 
                        action={
                          <IconButton>
                            <CalendarToday />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <List>
                          {currentEntityData.upcomingTasks.map((task) => (
                            <ListItem key={task.id} divider>
                              <ListItemIcon>
                                <Badge 
                                  badgeContent={task.daysRemaining} 
                                  color={task.daysRemaining <= 7 ? 'error' : 'primary'}
                                >
                                  <Schedule />
                                </Badge>
                              </ListItemIcon>
                              <ListItemText
                                primary={task.type}
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Due: {task.dueDate} • Assigned to: {task.assignedTo}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Box>
                                <Chip 
                                  label={task.status.replace('_', ' ')} 
                                  color={getStatusColor(task.status)}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  label={task.priority} 
                                  color={getPriorityColor(task.priority)}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Compliance Status Chart */}
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardHeader title="Compliance Status" />
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={currentEntityData.complianceStatus}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {currentEntityData.complianceStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Documents Tab */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Pending Document Submissions</Typography>
                  <Button variant="contained" startIcon={<Upload />}>
                    Upload Document
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Compliance</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentEntityData.pendingDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.complianceType}</TableCell>
                          <TableCell>{doc.dueDate}</TableCell>
                          <TableCell>
                            <Chip 
                              label={doc.status} 
                              color={doc.status === 'required' ? 'error' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <Upload />
                            </IconButton>
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Compliance Status Tab */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Monthly Trend */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Monthly Compliance Trend" />
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={currentEntityData.monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" fill="#4caf50" name="Completed" />
                            <Bar dataKey="pending" fill="#f44336" name="Pending" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Activities Tab */}
            {tabValue === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Activities</Typography>
                <List>
                  {currentEntityData.recentActivities.map((activity) => (
                    <ListItem key={activity.id} divider>
                      <ListItemIcon>
                        {activity.type === 'document_uploaded' && <Upload />}
                        {activity.type === 'compliance_updated' && <CheckCircle />}
                        {activity.type === 'reminder_sent' && <Notifications />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={`${activity.user} • ${new Date(activity.timestamp).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default EntityManagerDashboard;