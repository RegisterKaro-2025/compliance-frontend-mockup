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
  Badge
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
  Assessment,
  Upload,
  Download,
  Visibility,
  Edit,
  MoreVert
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const EntityDashboard = () => {
  const { entityId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [entityData, setEntityData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockEntityData = {
      id: entityId,
      name: 'XYZ Private Limited',
      cin: 'U12345MH2020PTC123456',
      pan: 'AADCB2230M',
      gstin: '27AADCB2230M1ZR',
      incorporationDate: '2020-03-15',
      registeredAddress: 'Mumbai, Maharashtra',
      complianceOfficer: 'John Doe',
      status: 'Active',
      complianceHealth: {
        overall: 85,
        statutory: 90,
        internal: 80,
        governance: 85
      },
      upcomingDeadlines: [
        {
          id: 1,
          type: 'GST Return - GSTR-3B',
          dueDate: '2023-06-20',
          status: 'pending',
          priority: 'high',
          daysRemaining: 5
        },
        {
          id: 2,
          type: 'TDS Return - Form 24Q',
          dueDate: '2023-07-31',
          status: 'in_progress',
          priority: 'medium',
          daysRemaining: 46
        },
        {
          id: 3,
          type: 'Annual ROC Filing',
          dueDate: '2023-10-30',
          status: 'not_started',
          priority: 'high',
          daysRemaining: 137
        }
      ],
      complianceStatus: [
        { name: 'Completed', value: 18, color: '#4caf50' },
        { name: 'In Progress', value: 4, color: '#ff9800' },
        { name: 'Pending', value: 2, color: '#f44336' },
        { name: 'Overdue', value: 0, color: '#9c27b0' }
      ],
      monthlyTrend: [
        { month: 'Jan', completed: 3, pending: 1 },
        { month: 'Feb', completed: 2, pending: 0 },
        { month: 'Mar', completed: 4, pending: 1 },
        { month: 'Apr', completed: 3, pending: 2 },
        { month: 'May', completed: 6, pending: 0 },
        { month: 'Jun', completed: 0, pending: 2 }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'document_uploaded',
          description: 'Financial statements uploaded for AOC-4 filing',
          timestamp: '2023-06-10T14:30:00Z',
          user: 'Client User'
        },
        {
          id: 2,
          type: 'compliance_completed',
          description: 'GST Return GSTR-1 filed successfully',
          timestamp: '2023-06-08T11:15:00Z',
          user: 'John Doe'
        },
        {
          id: 3,
          type: 'status_updated',
          description: 'TDS Return moved to verification stage',
          timestamp: '2023-06-07T16:45:00Z',
          user: 'Jane Smith'
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Financial Statements FY 2022-23',
          type: 'Financial',
          status: 'verified',
          uploadDate: '2023-06-10',
          size: '2.4 MB'
        },
        {
          id: 2,
          name: 'Board Resolution - AGM',
          type: 'Legal',
          status: 'pending_verification',
          uploadDate: '2023-06-09',
          size: '1.2 MB'
        },
        {
          id: 3,
          name: 'GST Invoice Register - May 2023',
          type: 'Tax',
          status: 'verified',
          uploadDate: '2023-06-05',
          size: '5.8 MB'
        }
      ]
    };

    setTimeout(() => {
      setEntityData(mockEntityData);
      setLoading(false);
    }, 1000);
  }, [entityId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading entity dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Entity Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <Business fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {entityData.name}
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  CIN: {entityData.cin}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  PAN: {entityData.pan}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  GSTIN: {entityData.gstin}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={entityData.status} 
                color="success" 
                size="small" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`Officer: ${entityData.complianceOfficer}`} 
                variant="outlined" 
                size="small" 
              />
            </Box>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<Edit />}>
              Edit Entity
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Compliance Health Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Overall Health</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {entityData.complianceHealth.overall}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={entityData.complianceHealth.overall} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Statutory</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {entityData.complianceHealth.statutory}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={entityData.complianceHealth.statutory} 
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
                {entityData.complianceHealth.internal}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={entityData.complianceHealth.internal} 
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
                {entityData.complianceHealth.governance}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={entityData.complianceHealth.governance} 
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
          <Tab label="Overview" />
          <Tab label="Compliance Status" />
          <Tab label="Documents" />
          <Tab label="Activities" />
        </Tabs>

        {/* Overview Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Upcoming Deadlines */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Upcoming Deadlines" 
                    action={
                      <IconButton>
                        <CalendarToday />
                      </IconButton>
                    }
                  />
                  <CardContent>
                    <List>
                      {entityData.upcomingDeadlines.map((deadline) => (
                        <ListItem key={deadline.id} divider>
                          <ListItemIcon>
                            <Badge 
                              badgeContent={deadline.daysRemaining} 
                              color={deadline.daysRemaining <= 7 ? 'error' : 'primary'}
                            >
                              <Schedule />
                            </Badge>
                          </ListItemIcon>
                          <ListItemText
                            primary={deadline.type}
                            secondary={`Due: ${deadline.dueDate}`}
                          />
                          <Box>
                            <Chip 
                              label={deadline.status.replace('_', ' ')} 
                              color={getStatusColor(deadline.status)}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={deadline.priority} 
                              color={getPriorityColor(deadline.priority)}
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
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Compliance Status Distribution" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={entityData.complianceStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {entityData.complianceStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Monthly Trend */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Monthly Compliance Trend" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={entityData.monthlyTrend}>
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

        {/* Compliance Status Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Detailed compliance status and tracking information for {entityData.name}
            </Alert>
            {/* Add detailed compliance status content here */}
            <Typography variant="body1">
              Detailed compliance status view will be implemented here with filterable compliance items,
              status tracking, and action buttons.
            </Typography>
          </Box>
        )}

        {/* Documents Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Document Management</Typography>
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
                    <TableCell>Status</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entityData.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={doc.status.replace('_', ' ')} 
                          color={doc.status === 'verified' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Activities Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {entityData.recentActivities.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemIcon>
                    {activity.type === 'document_uploaded' && <Upload />}
                    {activity.type === 'compliance_completed' && <CheckCircle />}
                    {activity.type === 'status_updated' && <Notifications />}
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
    </Container>
  );
};

export default EntityDashboard;