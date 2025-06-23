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
  CardActions,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  LinearProgress,
  Menu,
  MenuList,
  ListItemButton,
  Avatar,
  Badge
} from '@mui/material';
import {
  Add,
  Assessment,
  Download,
  Share,
  Schedule,
  Visibility,
  Edit,
  Delete,
  MoreVert,
  FilterList,
  Search,
  Refresh,
  TrendingUp,
  PieChart,
  BarChart,
  TableChart,
  DateRange,
  Business,
  Assignment,
  AccountBalance,
  MonetizationOn,
  Speed,
  Star,
  Warning,
  CheckCircle,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ReportsList = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        name: 'Compliance Status Summary',
        description: 'Overall compliance status across all entities',
        category: 'compliance',
        type: 'summary',
        lastGenerated: '2023-06-15T10:30:00Z',
        generatedBy: 'System',
        format: 'PDF',
        size: '2.4 MB',
        downloadCount: 145,
        isScheduled: false,
        tags: ['compliance', 'summary', 'monthly'],
        chartType: 'pie',
        dataPoints: 24,
        entities: 120
      },
      {
        id: 2,
        name: 'Revenue Analytics Report',
        description: 'Detailed revenue analysis by compliance type and period',
        category: 'financial',
        type: 'analytics',
        lastGenerated: '2023-06-14T16:45:00Z',
        generatedBy: 'John Doe',
        format: 'Excel',
        size: '5.8 MB',
        downloadCount: 89,
        isScheduled: true,
        tags: ['revenue', 'analytics', 'quarterly'],
        chartType: 'bar',
        dataPoints: 156,
        entities: 120
      },
      {
        id: 3,
        name: 'SLA Performance Report',
        description: 'Service level agreement compliance and performance metrics',
        category: 'performance',
        type: 'metrics',
        lastGenerated: '2023-06-13T09:15:00Z',
        generatedBy: 'Jane Smith',
        format: 'PDF',
        size: '1.2 MB',
        downloadCount: 67,
        isScheduled: true,
        tags: ['sla', 'performance', 'weekly'],
        chartType: 'line',
        dataPoints: 52,
        entities: 120
      },
      {
        id: 4,
        name: 'Entity Risk Assessment',
        description: 'Risk analysis and compliance health for all entities',
        category: 'risk',
        type: 'assessment',
        lastGenerated: '2023-06-12T14:20:00Z',
        generatedBy: 'Mike Johnson',
        format: 'PDF',
        size: '3.6 MB',
        downloadCount: 123,
        isScheduled: false,
        tags: ['risk', 'assessment', 'monthly'],
        chartType: 'radar',
        dataPoints: 48,
        entities: 120
      },
      {
        id: 5,
        name: 'Document Status Report',
        description: 'Status of all compliance documents across entities',
        category: 'documents',
        type: 'status',
        lastGenerated: '2023-06-11T11:30:00Z',
        generatedBy: 'Sarah Wilson',
        format: 'Excel',
        size: '4.2 MB',
        downloadCount: 78,
        isScheduled: true,
        tags: ['documents', 'status', 'daily'],
        chartType: 'table',
        dataPoints: 892,
        entities: 120
      },
      {
        id: 6,
        name: 'Deadline Tracking Report',
        description: 'Upcoming deadlines and overdue compliance items',
        category: 'deadlines',
        type: 'tracking',
        lastGenerated: '2023-06-10T08:45:00Z',
        generatedBy: 'System',
        format: 'PDF',
        size: '1.8 MB',
        downloadCount: 234,
        isScheduled: true,
        tags: ['deadlines', 'tracking', 'daily'],
        chartType: 'timeline',
        dataPoints: 67,
        entities: 120
      }
    ];

    const mockScheduledReports = [
      {
        id: 1,
        reportId: 2,
        name: 'Revenue Analytics Report',
        schedule: 'Weekly - Monday 9:00 AM',
        nextRun: '2023-06-19T09:00:00Z',
        status: 'active',
        recipients: ['management@registerkaro.com', 'finance@registerkaro.com'],
        format: 'Excel',
        lastRun: '2023-06-12T09:00:00Z',
        runCount: 24
      },
      {
        id: 2,
        reportId: 3,
        name: 'SLA Performance Report',
        schedule: 'Daily - 6:00 AM',
        nextRun: '2023-06-16T06:00:00Z',
        status: 'active',
        recipients: ['operations@registerkaro.com'],
        format: 'PDF',
        lastRun: '2023-06-15T06:00:00Z',
        runCount: 156
      },
      {
        id: 3,
        reportId: 5,
        name: 'Document Status Report',
        schedule: 'Monthly - 1st day 10:00 AM',
        nextRun: '2023-07-01T10:00:00Z',
        status: 'paused',
        recipients: ['compliance@registerkaro.com'],
        format: 'Excel',
        lastRun: '2023-06-01T10:00:00Z',
        runCount: 6
      }
    ];

    setTimeout(() => {
      setReports(mockReports);
      setScheduledReports(mockScheduledReports);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'compliance': return 'primary';
      case 'financial': return 'success';
      case 'performance': return 'info';
      case 'risk': return 'warning';
      case 'documents': return 'secondary';
      case 'deadlines': return 'error';
      default: return 'default';
    }
  };

  const getChartIcon = (chartType) => {
    switch (chartType) {
      case 'pie': return <PieChart />;
      case 'bar': return <BarChart />;
      case 'line': return <TrendingUp />;
      case 'table': return <TableChart />;
      case 'radar': return <Assessment />;
      default: return <Assessment />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'error';
      default: return 'default';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading reports...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/reports/builder')}>
            Report Builder
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/reports/builder')}>
            Create Report
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{reports.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Reports</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{scheduledReports.filter(r => r.status === 'active').length}</Typography>
              <Typography variant="body2" color="text.secondary">Active Schedules</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Download color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{reports.reduce((sum, r) => sum + r.downloadCount, 0)}</Typography>
              <Typography variant="body2" color="text.secondary">Total Downloads</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">120</Typography>
              <Typography variant="body2" color="text.secondary">Entities Covered</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="compliance">Compliance</MenuItem>
                <MenuItem value="financial">Financial</MenuItem>
                <MenuItem value="performance">Performance</MenuItem>
                <MenuItem value="risk">Risk</MenuItem>
                <MenuItem value="documents">Documents</MenuItem>
                <MenuItem value="deadlines">Deadlines</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="outlined" startIcon={<FilterList />} fullWidth>
              More Filters
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button variant="outlined" startIcon={<Refresh />} fullWidth>
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="All Reports" />
          <Tab label="Scheduled Reports" />
          <Tab label="Recent Activity" />
        </Tabs>

        {/* All Reports Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredReports.map((report) => (
                <Grid item xs={12} md={6} lg={4} key={report.id}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: getCategoryColor(report.category) + '.main' }}>
                          {getChartIcon(report.chartType)}
                        </Avatar>
                      }
                      title={report.name}
                      subheader={report.description}
                      action={
                        <IconButton onClick={(e) => handleMenuOpen(e, report)}>
                          <MoreVert />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={report.category} 
                          color={getCategoryColor(report.category)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={report.type} 
                          variant="outlined"
                          size="small"
                        />
                        {report.isScheduled && (
                          <Chip 
                            label="Scheduled" 
                            color="info"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Format: {report.format} • Size: {report.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Downloads: {report.downloadCount} • Data Points: {report.dataPoints}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Generated: {new Date(report.lastGenerated).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Visibility />} onClick={() => navigate(`/reports/${report.id}`)}>
                        View
                      </Button>
                      <Button size="small" startIcon={<Download />}>
                        Download
                      </Button>
                      <Button size="small" startIcon={<Share />}>
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Scheduled Reports Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Scheduled Reports</Typography>
              <Button variant="contained" startIcon={<Add />}>
                Schedule Report
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Recipients</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Run Count</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduledReports.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.name}</TableCell>
                      <TableCell>{schedule.schedule}</TableCell>
                      <TableCell>{new Date(schedule.nextRun).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge badgeContent={schedule.recipients.length} color="primary">
                          <Typography variant="body2">Recipients</Typography>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={schedule.status} 
                          color={getStatusColor(schedule.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{schedule.runCount}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          {schedule.status === 'active' ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Stop />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Recent Activity Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Report Activity</Typography>
            <List>
              {reports.slice(0, 10).map((report) => (
                <ListItem key={report.id} divider>
                  <ListItemIcon>
                    {getChartIcon(report.chartType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${report.name} generated`}
                    secondary={`${report.generatedBy} • ${new Date(report.lastGenerated).toLocaleString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <Download />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <ListItemButton onClick={() => navigate(`/reports/${selectedReport?.id}`)}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText>View Report</ListItemText>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon><Download /></ListItemIcon>
            <ListItemText>Download</ListItemText>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon><Share /></ListItemIcon>
            <ListItemText>Share</ListItemText>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon><Schedule /></ListItemIcon>
            <ListItemText>Schedule</ListItemText>
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemIcon><Edit /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon><Delete /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </ListItemButton>
        </MenuList>
      </Menu>
    </Container>
  );
};

export default ReportsList;