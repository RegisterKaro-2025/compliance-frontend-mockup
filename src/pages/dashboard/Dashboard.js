import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import EntityManagerDashboard from './EntityManagerDashboard';
import ComplianceOfficerDashboard from './ComplianceOfficerDashboard';
import ManagementDashboard from './ManagementDashboard';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    entities, 
    compliances, 
    complianceTypes, 
    getUpcomingCompliances, 
    getOverdueCompliances,
    getComplianceStats,
    getEntityById,
    getComplianceTypeById
  } = useCompliance();
  const { notifications } = useNotification();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  
  // Set first entity as selected by default
  useEffect(() => {
    if (entities.length > 0 && !selectedEntity) {
      setSelectedEntity(entities[0]);
    }
  }, [entities]);
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEntitySelect = (entity) => {
    setSelectedEntity(entity);
    handleMenuClose();
  };
  
  const handleViewAllCompliances = () => {
    navigate('/compliance');
  };
  
  const handleViewCalendar = () => {
    navigate('/compliance/calendar');
  };
  
  const handleViewUpcoming = () => {
    navigate('/compliance?filter=upcoming');
  };
  
  const handleViewOverdue = () => {
    navigate('/compliance?filter=overdue');
  };
  
  const handleViewComplianceDetails = (complianceId) => {
    navigate(`/compliance/${complianceId}`);
  };
  
  // Get appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <ManagementDashboard />;
      case 'compliance_officer':
        return <ComplianceOfficerDashboard />;
      case 'entity_manager':
        return <EntityManagerDashboard />;
      default:
        return <EntityManagerDashboard />;
    }
  };
  
  // Admin Dashboard with system-wide metrics
  const renderAdminDashboard = () => {
    const stats = getComplianceStats();
    const upcomingCompliances = getUpcomingCompliances();
    const overdueCompliances = getOverdueCompliances();
    
    // Data for compliance status chart
    const statusChartData = {
      labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [stats.completed, stats.inProgress, stats.pending, stats.overdue],
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
          hoverBackgroundColor: ['#388e3c', '#1976d2', '#f57c00', '#d32f2f'],
        },
      ],
    };
    
    // Data for compliance by type chart
    const typeData = {};
    compliances.forEach(compliance => {
      const type = complianceTypes.find(t => t.id === compliance.complianceTypeId);
      if (type) {
        typeData[type.name] = (typeData[type.name] || 0) + 1;
      }
    });
    
    const typeChartData = {
      labels: Object.keys(typeData),
      datasets: [
        {
          data: Object.values(typeData),
          backgroundColor: [
            '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'
          ],
        },
      ],
    };
    
    // Data for entity compliance chart
    const entityComplianceData = {};
    entities.forEach(entity => {
      const entityStats = getComplianceStats(entity.id);
      entityComplianceData[entity.name] = entityStats.completionRate;
    });
    
    const entityChartData = {
      labels: Object.keys(entityComplianceData),
      datasets: [
        {
          label: 'Compliance Rate (%)',
          data: Object.values(entityComplianceData),
          backgroundColor: 'rgba(33, 150, 243, 0.6)',
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    const entityChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Entity Compliance Rates',
          font: {
            size: 16,
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Completion Rate (%)'
          }
        }
      }
    };
    
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          System Dashboard
        </Typography>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Entities
                </Typography>
                <Typography variant="h3" component="div">
                  {entities.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active in the system
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Compliances
                </Typography>
                <Typography variant="h3" component="div">
                  {stats.total}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip 
                    size="small" 
                    color="success" 
                    label={`${stats.completed} Completed`} 
                  />
                  <Chip 
                    size="small" 
                    color="error" 
                    label={`${stats.overdue} Overdue`} 
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Upcoming Deadlines
                </Typography>
                <Typography variant="h3" component="div">
                  {upcomingCompliances.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Due in the next 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  System Compliance Rate
                </Typography>
                <Typography variant="h3" component="div">
                  {stats.total > 0 ? Math.round(stats.completionRate) : 0}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.total > 0 ? stats.completionRate : 0}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Bar 
                data={entityChartData} 
                options={entityChartOptions}
                height={80}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Compliance by Status
              </Typography>
              <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
                <Pie data={statusChartData} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Upcoming Deadlines
                  </Typography>
                  <Button 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleViewUpcoming}
                  >
                    View All
                  </Button>
                </Box>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {upcomingCompliances.length > 0 ? (
                    upcomingCompliances.slice(0, 5).map((compliance) => {
                      const entity = getEntityById(compliance.entityId);
                      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                      
                      return (
                        <ListItem 
                          key={compliance.id}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              aria-label="view" 
                              onClick={() => handleViewComplianceDetails(compliance.id)}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <AccessTimeIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={complianceType?.name || 'Unknown Compliance'}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {entity?.name || 'Unknown Entity'}
                                </Typography>
                                {` — Due ${new Date(compliance.dueDate).toLocaleDateString()}`}
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No upcoming deadlines"
                        secondary="All compliance deadlines are more than 30 days away"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Activity
                  </Typography>
                  <Button 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleViewAllCompliances}
                  >
                    View All
                  </Button>
                </Box>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <ListItem 
                        key={notification.id}
                        sx={{ 
                          backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                          '&:hover': {
                            backgroundColor: 'action.selected',
                          }
                        }}
                      >
                        <ListItemIcon>
                          {notification.type === 'DEADLINE_APPROACHING' && <AccessTimeIcon color="warning" />}
                          {notification.type === 'DOCUMENT_UPLOADED' && <DescriptionIcon color="info" />}
                          {notification.type === 'STATUS_CHANGE' && <CheckCircleIcon color="primary" />}
                          {notification.type === 'DOCUMENT_VERIFICATION' && <ErrorIcon color="error" />}
                          {notification.type === 'FILING_SUCCESS' && <CheckCircleIcon color="success" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <React.Fragment>
                              {notification.message}
                              <Typography variant="caption" display="block" color="text.secondary">
                                {new Date(notification.createdAt).toLocaleString()}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No recent activity"
                        secondary="There has been no recent compliance activity"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  // Compliance Officer Dashboard focusing on work items
  const renderComplianceOfficerDashboard = () => {
    // This would include metrics specific to compliance officer duties
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Compliance Officer Dashboard
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Overview" />
            <Tab label="My Tasks" />
            <Tab label="Document Verification" />
          </Tabs>
        </Box>
        
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {/* Summary cards would go here */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Workload Summary
                  </Typography>
                  <Typography variant="h3">
                    {compliances.filter(c => c.assignedTo === currentUser.id).length}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Assigned Compliances
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        In Progress
                      </Typography>
                      <Typography variant="h5">
                        {compliances.filter(c => c.assignedTo === currentUser.id && c.status === 'IN_PROGRESS').length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Pending
                      </Typography>
                      <Typography variant="h5">
                        {compliances.filter(c => c.assignedTo === currentUser.id && c.status === 'PENDING').length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Completed
                      </Typography>
                      <Typography variant="h5">
                        {compliances.filter(c => c.assignedTo === currentUser.id && c.status === 'COMPLETED').length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Overdue
                      </Typography>
                      <Typography variant="h5" color="error">
                        {getOverdueCompliances().filter(c => c.assignedTo === currentUser.id).length}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Document Verification Queue
                  </Typography>
                  <Typography variant="h3">12</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Documents Pending Verification
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/documents/verification')}
                  >
                    Go to Verification Queue
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Urgent Tasks
                    </Typography>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/compliance?filter=urgent')}
                    >
                      View All
                    </Button>
                  </Box>
                  
                  <List>
                    {getUpcomingCompliances()
                      .filter(c => c.assignedTo === currentUser.id)
                      .slice(0, 5)
                      .map((compliance) => {
                        const entity = getEntityById(compliance.entityId);
                        const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                        const dueDate = new Date(compliance.dueDate);
                        const now = new Date();
                        const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <ListItem 
                            key={compliance.id}
                            secondaryAction={
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => handleViewComplianceDetails(compliance.id)}
                              >
                                View
                              </Button>
                            }
                          >
                            <ListItemIcon>
                              {daysRemaining <= 7 ? (
                                <ErrorIcon color="error" />
                              ) : (
                                <WarningIcon color="warning" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={complianceType?.name}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {entity?.name}
                                  </Typography>
                                  {` — Due in ${daysRemaining} days (${dueDate.toLocaleDateString()})`}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        );
                      })}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {selectedTab === 1 && (
          <Typography variant="h6">My Tasks Content</Typography>
          // Task list would go here
        )}
        
        {selectedTab === 2 && (
          <Typography variant="h6">Document Verification Content</Typography>
          // Document verification queue would go here
        )}
      </Box>
    );
  };
  
  // Entity Dashboard focusing on a specific entity
  const renderEntityDashboard = () => {
    if (!selectedEntity) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom>
            No entity selected
          </Typography>
          <Typography variant="body1">
            Please select an entity to view its compliance dashboard.
          </Typography>
        </Box>
      );
    }
    
    const entityStats = getComplianceStats(selectedEntity.id);
    const entityCompliances = compliances.filter(c => c.entityId === selectedEntity.id);
    const upcomingEntityCompliances = getUpcomingCompliances().filter(c => c.entityId === selectedEntity.id);
    const overdueEntityCompliances = getOverdueCompliances().filter(c => c.entityId === selectedEntity.id);
    
    // Data for compliance status chart
    const statusChartData = {
      labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [
            entityStats.completed,
            entityStats.inProgress,
            entityStats.pending,
            entityStats.overdue
          ],
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
          hoverBackgroundColor: ['#388e3c', '#1976d2', '#f57c00', '#d32f2f'],
        },
      ],
    };
    
    // Data for compliance by type chart
    const typeData = {};
    entityCompliances.forEach(compliance => {
      const type = complianceTypes.find(t => t.id === compliance.complianceTypeId);
      if (type) {
        typeData[type.name] = (typeData[type.name] || 0) + 1;
      }
    });
    
    const typeChartData = {
      labels: Object.keys(typeData),
      datasets: [
        {
          data: Object.values(typeData),
          backgroundColor: [
            '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'
          ],
        },
      ],
    };
    
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <BusinessIcon />
          </Avatar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            {selectedEntity.name}
          </Typography>
          <Button
            endIcon={<MoreVertIcon />}
            onClick={handleMenuClick}
          >
            Switch Entity
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {entities.map((entity) => (
              <MenuItem 
                key={entity.id} 
                onClick={() => handleEntitySelect(entity)}
                selected={selectedEntity.id === entity.id}
              >
                {entity.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle1" color="textSecondary">
            {selectedEntity.entityType} | CIN: {selectedEntity.cin}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Incorporated on {new Date(selectedEntity.incorporationDate).toLocaleDateString()}
          </Typography>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Compliances
                </Typography>
                <Typography variant="h3" component="div">
                  {entityStats.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  For this entity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Compliance Rate
                </Typography>
                <Typography variant="h3" component="div">
                  {entityStats.total > 0 ? Math.round(entityStats.completionRate) : 0}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={entityStats.total > 0 ? entityStats.completionRate : 0}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Upcoming Deadlines
                </Typography>
                <Typography variant="h3" component="div">
                  {upcomingEntityCompliances.length}
                </Typography>
                <Button 
                  size="small" 
                  variant="text" 
                  onClick={handleViewUpcoming}
                  sx={{ mt: 1 }}
                >
                  View Deadlines
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Overdue Items
                </Typography>
                <Typography variant="h3" component="div" color="error">
                  {overdueEntityCompliances.length}
                </Typography>
                <Button 
                  size="small" 
                  variant="text" 
                  color="error"
                  onClick={handleViewOverdue}
                  sx={{ mt: 1 }}
                >
                  View Overdue
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Charts and Lists */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Compliance by Status
              </Typography>
              <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
                <Pie data={statusChartData} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Compliance by Type
              </Typography>
              <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
                <Pie data={typeChartData} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Upcoming Compliance Deadlines
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={handleViewCalendar}
                  >
                    View Calendar
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {upcomingEntityCompliances.length > 0 ? (
                  <List>
                    {upcomingEntityCompliances.slice(0, 5).map((compliance) => {
                      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                      const dueDate = new Date(compliance.dueDate);
                      const now = new Date();
                      const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <ListItem 
                          key={compliance.id}
                          secondaryAction={
                            <Button 
                              variant="contained" 
                              size="small"
                              onClick={() => handleViewComplianceDetails(compliance.id)}
                            >
                              View Details
                            </Button>
                          }
                          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                        >
                          <ListItemIcon>
                            {daysRemaining <= 7 ? (
                              <ErrorIcon color="error" />
                            ) : (
                              <WarningIcon color="warning" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={complianceType?.name}
                            secondary={
                              <React.Fragment>
                                <Typography variant="body2" color="text.primary">
                                  Due in {daysRemaining} days
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Due date: {dueDate.toLocaleDateString()}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body1">
                      No upcoming compliance deadlines for the next 30 days.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  return renderDashboard();
};

export default Dashboard;