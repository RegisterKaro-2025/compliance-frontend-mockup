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
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Assignment,
  Warning,
  CheckCircle,
  Schedule,
  TrendingUp,
  Description,
  Notifications,
  CalendarToday,
  Assessment,
  Business,
  TaskAlt,
  PendingActions,
  Speed,
  Search,
  FilterList,
  Refresh,
  MoreVert,
  Visibility,
  Edit,
  PlayArrow
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ComplianceOfficerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockDashboardData = {
      officer: {
        name: 'John Doe',
        id: 'CO001',
        specialization: 'Corporate Compliance',
        experience: '5 years',
        certifications: ['CA', 'CS']
      },
      workloadSummary: {
        totalEntities: 15,
        activeCompliances: 45,
        pendingTasks: 28,
        overdueItems: 3,
        completedThisMonth: 42
      },
      performanceMetrics: {
        slaCompliance: 94.2,
        avgProcessingTime: 2.3, // days
        taskCompletionRate: 96.8,
        clientSatisfaction: 4.6 // out of 5
      },
      taskQueue: [
        {
          id: 1,
          entityName: 'ABC Pvt Ltd',
          taskType: 'Document Verification',
          complianceType: 'GST Return',
          priority: 'high',
          dueDate: '2023-06-16',
          status: 'pending',
          estimatedTime: '2 hours'
        },
        {
          id: 2,
          entityName: 'XYZ Corp',
          taskType: 'Form Preparation',
          complianceType: 'Annual ROC Filing',
          priority: 'medium',
          dueDate: '2023-06-18',
          status: 'in_progress',
          estimatedTime: '4 hours'
        },
        {
          id: 3,
          entityName: 'DEF Industries',
          taskType: 'Portal Filing',
          complianceType: 'TDS Return',
          priority: 'high',
          dueDate: '2023-06-17',
          status: 'ready',
          estimatedTime: '1 hour'
        },
        {
          id: 4,
          entityName: 'GHI Solutions',
          taskType: 'Client Review',
          complianceType: 'Income Tax Return',
          priority: 'low',
          dueDate: '2023-06-20',
          status: 'pending',
          estimatedTime: '3 hours'
        }
      ],
      entityWorkload: [
        {
          id: 1,
          name: 'ABC Pvt Ltd',
          activeItems: 5,
          pendingTasks: 3,
          upcomingDeadlines: 2,
          riskLevel: 'medium',
          lastActivity: '2023-06-15'
        },
        {
          id: 2,
          name: 'XYZ Corp',
          activeItems: 8,
          pendingTasks: 5,
          upcomingDeadlines: 1,
          riskLevel: 'low',
          lastActivity: '2023-06-14'
        },
        {
          id: 3,
          name: 'DEF Industries',
          activeItems: 3,
          pendingTasks: 2,
          upcomingDeadlines: 3,
          riskLevel: 'high',
          lastActivity: '2023-06-13'
        }
      ],
      weeklyProgress: [
        { day: 'Mon', completed: 8, assigned: 10 },
        { day: 'Tue', completed: 6, assigned: 8 },
        { day: 'Wed', completed: 9, assigned: 12 },
        { day: 'Thu', completed: 7, assigned: 9 },
        { day: 'Fri', completed: 5, assigned: 7 },
        { day: 'Sat', completed: 2, assigned: 3 },
        { day: 'Sun', completed: 1, assigned: 1 }
      ],
      taskDistribution: [
        { name: 'Document Verification', value: 12, color: '#4caf50' },
        { name: 'Form Preparation', value: 8, color: '#2196f3' },
        { name: 'Portal Filing', value: 5, color: '#ff9800' },
        { name: 'Client Review', value: 3, color: '#9c27b0' }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'task_completed',
          description: 'Completed GST Return verification for ABC Pvt Ltd',
          timestamp: '2023-06-15T16:30:00Z',
          entityName: 'ABC Pvt Ltd'
        },
        {
          id: 2,
          type: 'filing_submitted',
          description: 'Filed TDS Return for XYZ Corp successfully',
          timestamp: '2023-06-15T14:15:00Z',
          entityName: 'XYZ Corp'
        },
        {
          id: 3,
          type: 'document_reviewed',
          description: 'Reviewed financial statements for DEF Industries',
          timestamp: '2023-06-15T11:45:00Z',
          entityName: 'DEF Industries'
        }
      ]
    };

    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'ready': return 'warning';
      case 'pending': return 'default';
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const filteredTasks = dashboardData?.taskQueue.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = searchTerm === '' || 
      task.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.complianceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading compliance officer dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Officer Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <Person fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {dashboardData.officer.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Compliance Officer ({dashboardData.officer.id})
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Chip 
                  label={dashboardData.officer.specialization} 
                  color="primary" 
                  size="small" 
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`${dashboardData.officer.experience} experience`} 
                  variant="outlined" 
                  size="small" 
                />
              </Grid>
              {dashboardData.officer.certifications.map((cert) => (
                <Grid item key={cert}>
                  <Chip 
                    label={cert} 
                    color="success" 
                    variant="outlined" 
                    size="small" 
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<Refresh />}>
              Refresh Data
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Speed color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">SLA Compliance</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {dashboardData.performanceMetrics.slaCompliance}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={dashboardData.performanceMetrics.slaCompliance} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Processing</Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {dashboardData.performanceMetrics.avgProcessingTime}d
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days per task
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskAlt color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Completion Rate</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {dashboardData.performanceMetrics.taskCompletionRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={dashboardData.performanceMetrics.taskCompletionRate} 
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
                <TrendingUp color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Client Rating</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {dashboardData.performanceMetrics.clientSatisfaction}/5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average satisfaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workload Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.workloadSummary.totalEntities}</Typography>
              <Typography variant="body2" color="text.secondary">Total Entities</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.workloadSummary.activeCompliances}</Typography>
              <Typography variant="body2" color="text.secondary">Active Compliances</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingActions color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.workloadSummary.pendingTasks}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Tasks</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.workloadSummary.overdueItems}</Typography>
              <Typography variant="body2" color="text.secondary">Overdue Items</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.workloadSummary.completedThisMonth}</Typography>
              <Typography variant="body2" color="text.secondary">Completed This Month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Task Queue" />
          <Tab label="Entity Workload" />
          <Tab label="Performance" />
          <Tab label="Activities" />
        </Tabs>

        {/* Task Queue Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="ready">Ready</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filterPriority}
                    label="Priority"
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  sx={{ height: '56px' }}
                >
                  More Filters
                </Button>
              </Grid>
            </Grid>

            {/* Task List */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entity</TableCell>
                    <TableCell>Task Type</TableCell>
                    <TableCell>Compliance</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Est. Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.entityName}</TableCell>
                      <TableCell>{task.taskType}</TableCell>
                      <TableCell>{task.complianceType}</TableCell>
                      <TableCell>
                        <Chip 
                          label={task.priority} 
                          color={getPriorityColor(task.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status.replace('_', ' ')} 
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{task.estimatedTime}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <PlayArrow />
                        </IconButton>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Entity Workload Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {dashboardData.entityWorkload.map((entity) => (
                <Grid item xs={12} md={4} key={entity.id}>
                  <Card>
                    <CardHeader
                      title={entity.name}
                      action={
                        <Chip 
                          label={entity.riskLevel} 
                          color={getRiskColor(entity.riskLevel)}
                          size="small"
                        />
                      }
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="h4" color="primary">
                            {entity.activeItems}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Active Items
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h4" color="warning.main">
                            {entity.pendingTasks}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pending Tasks
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h4" color="error.main">
                            {entity.upcomingDeadlines}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Upcoming Deadlines
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Last Activity: {entity.lastActivity}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" fullWidth>
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Performance Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Weekly Progress */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader title="Weekly Task Progress" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#4caf50" name="Completed" />
                        <Bar dataKey="assigned" fill="#2196f3" name="Assigned" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Task Distribution */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Task Distribution" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.taskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dashboardData.taskDistribution.map((entry, index) => (
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

        {/* Activities Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {dashboardData.recentActivities.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemIcon>
                    {activity.type === 'task_completed' && <CheckCircle color="success" />}
                    {activity.type === 'filing_submitted' && <Assignment color="primary" />}
                    {activity.type === 'document_reviewed' && <Description color="info" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={`${activity.entityName} • ${new Date(activity.timestamp).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ComplianceOfficerDashboard;