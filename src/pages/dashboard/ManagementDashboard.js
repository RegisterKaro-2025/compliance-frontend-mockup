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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  TrendingDown,
  Assessment,
  People,
  Business,
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule,
  Speed,
  Star,
  Group,
  Assignment,
  AccountBalance,
  Analytics,
  Insights,
  MonetizationOn,
  Security,
  Refresh,
  Download,
  FilterList,
  DateRange
} from '@mui/icons-material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const ManagementDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockDashboardData = {
      kpis: {
        totalRevenue: 1850000,
        revenueGrowth: 18.5,
        totalEntities: 120,
        entityGrowth: 15.2,
        complianceRate: 94.2,
        complianceImprovement: 2.3,
        clientSatisfaction: 4.6,
        satisfactionChange: 0.3
      },
      complianceHealth: {
        overall: 94.2,
        statutory: 96.5,
        internal: 91.8,
        governance: 94.0,
        trend: 'improving'
      },
      resourceMetrics: {
        totalStaff: 25,
        utilizationRate: 87.5,
        avgProcessingTime: 2.3,
        slaCompliance: 94.2,
        capacityUtilization: 82.0
      },
      revenueAnalysis: {
        byComplianceType: [
          { type: 'GST Returns', revenue: 520000, percentage: 28.1, growth: 15.2 },
          { type: 'Income Tax', revenue: 380000, percentage: 20.5, growth: 22.1 },
          { type: 'Annual ROC Filing', revenue: 350000, percentage: 18.9, growth: 12.8 },
          { type: 'TDS Returns', revenue: 280000, percentage: 15.1, growth: 18.5 },
          { type: 'Other', revenue: 320000, percentage: 17.3, growth: 20.3 }
        ],
        monthlyTrend: [
          { month: 'Jan', revenue: 145000, target: 140000 },
          { month: 'Feb', revenue: 152000, target: 145000 },
          { month: 'Mar', revenue: 168000, target: 150000 },
          { month: 'Apr', revenue: 175000, target: 155000 },
          { month: 'May', revenue: 182000, target: 160000 },
          { month: 'Jun', revenue: 195000, target: 165000 }
        ]
      },
      riskAssessment: {
        overallRisk: 'medium',
        riskFactors: [
          { factor: 'Compliance Delays', level: 'medium', impact: 'high', trend: 'stable' },
          { factor: 'Resource Capacity', level: 'low', impact: 'medium', trend: 'improving' },
          { factor: 'Regulatory Changes', level: 'high', impact: 'high', trend: 'increasing' },
          { factor: 'Client Satisfaction', level: 'low', impact: 'medium', trend: 'stable' }
        ],
        complianceRiskHeatmap: [
          { entity: 'High-Risk Entities', count: 8, percentage: 6.7 },
          { entity: 'Medium-Risk Entities', count: 25, percentage: 20.8 },
          { entity: 'Low-Risk Entities', count: 87, percentage: 72.5 }
        ]
      },
      performanceMetrics: {
        teamPerformance: [
          { officer: 'John Doe', entities: 15, sla: 96.2, satisfaction: 4.8, efficiency: 92 },
          { officer: 'Jane Smith', entities: 12, sla: 94.5, satisfaction: 4.6, efficiency: 89 },
          { officer: 'Mike Johnson', entities: 18, sla: 92.1, satisfaction: 4.4, efficiency: 85 },
          { officer: 'Sarah Wilson', entities: 14, sla: 97.8, satisfaction: 4.9, efficiency: 95 }
        ],
        complianceTypePerformance: [
          { type: 'GST Returns', volume: 520, sla: 96.5, avgTime: 1.8, satisfaction: 4.7 },
          { type: 'Income Tax', volume: 180, sla: 92.1, avgTime: 3.2, satisfaction: 4.5 },
          { type: 'Annual ROC', volume: 120, sla: 89.5, avgTime: 4.5, satisfaction: 4.3 },
          { type: 'TDS Returns', volume: 240, sla: 94.8, avgTime: 2.1, satisfaction: 4.6 }
        ]
      },
      trendAnalysis: {
        volumeTrends: [
          { period: 'Q1 2023', volume: 285, growth: 12.5 },
          { period: 'Q2 2023', volume: 320, growth: 15.2 },
          { period: 'Q3 2023', volume: 298, growth: 8.9 },
          { period: 'Q4 2023', volume: 342, growth: 18.7 }
        ],
        efficiencyTrends: [
          { month: 'Jan', efficiency: 85.2, target: 85.0 },
          { month: 'Feb', efficiency: 87.1, target: 86.0 },
          { month: 'Mar', efficiency: 89.5, target: 87.0 },
          { month: 'Apr', efficiency: 91.2, target: 88.0 },
          { month: 'May', efficiency: 92.8, target: 89.0 },
          { month: 'Jun', efficiency: 94.1, target: 90.0 }
        ]
      },
      alerts: [
        {
          id: 1,
          type: 'warning',
          title: 'Capacity Alert',
          message: 'Team utilization approaching 90% threshold',
          priority: 'medium',
          timestamp: '2023-06-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'error',
          title: 'SLA Breach',
          message: '3 compliance items missed SLA in the last week',
          priority: 'high',
          timestamp: '2023-06-15T09:15:00Z'
        },
        {
          id: 3,
          type: 'info',
          title: 'Revenue Milestone',
          message: 'Monthly revenue target achieved 5 days early',
          priority: 'low',
          timestamp: '2023-06-14T16:45:00Z'
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading management dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Management Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Refresh />}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {dashboardData.alerts.map((alert) => (
            <Grid item xs={12} md={4} key={alert.id}>
              <Alert 
                severity={alert.type} 
                action={
                  <IconButton size="small">
                    <FilterList />
                  </IconButton>
                }
              >
                <Typography variant="subtitle2">{alert.title}</Typography>
                <Typography variant="body2">{alert.message}</Typography>
              </Alert>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary">
                    {formatCurrency(dashboardData.kpis.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getGrowthIcon(dashboardData.kpis.revenueGrowth)}
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +{dashboardData.kpis.revenueGrowth}%
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <MonetizationOn />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {dashboardData.kpis.totalEntities}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entities
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getGrowthIcon(dashboardData.kpis.entityGrowth)}
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +{dashboardData.kpis.entityGrowth}%
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Business />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {dashboardData.kpis.complianceRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getGrowthIcon(dashboardData.kpis.complianceImprovement)}
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +{dashboardData.kpis.complianceImprovement}%
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {dashboardData.kpis.clientSatisfaction}/5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Client Satisfaction
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {getGrowthIcon(dashboardData.kpis.satisfactionChange)}
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +{dashboardData.kpis.satisfactionChange}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Revenue Analytics" />
          <Tab label="Performance Metrics" />
          <Tab label="Risk Assessment" />
          <Tab label="Trend Analysis" />
        </Tabs>

        {/* Revenue Analytics Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Revenue by Compliance Type */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader title="Revenue by Compliance Type" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.revenueAnalysis.byComplianceType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#2196f3" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Revenue Distribution */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Revenue Distribution" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.revenueAnalysis.byComplianceType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percentage }) => `${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {dashboardData.revenueAnalysis.byComplianceType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Monthly Revenue Trend */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Monthly Revenue vs Target" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData.revenueAnalysis.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={3} name="Actual Revenue" />
                        <Line type="monotone" dataKey="target" stroke="#ff9800" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Performance Metrics Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Team Performance */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Team Performance Overview" />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Officer</TableCell>
                            <TableCell align="right">Entities</TableCell>
                            <TableCell align="right">SLA Compliance</TableCell>
                            <TableCell align="right">Client Satisfaction</TableCell>
                            <TableCell align="right">Efficiency</TableCell>
                            <TableCell align="right">Performance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboardData.performanceMetrics.teamPerformance.map((officer) => (
                            <TableRow key={officer.officer}>
                              <TableCell>{officer.officer}</TableCell>
                              <TableCell align="right">{officer.entities}</TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                  <Typography variant="body2" sx={{ mr: 1 }}>
                                    {officer.sla}%
                                  </Typography>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={officer.sla} 
                                    sx={{ width: 60 }}
                                    color={officer.sla >= 95 ? 'success' : officer.sla >= 90 ? 'warning' : 'error'}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell align="right">{officer.satisfaction}/5</TableCell>
                              <TableCell align="right">{officer.efficiency}%</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={officer.efficiency >= 90 ? 'Excellent' : officer.efficiency >= 80 ? 'Good' : 'Needs Improvement'}
                                  color={officer.efficiency >= 90 ? 'success' : officer.efficiency >= 80 ? 'warning' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Compliance Type Performance */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Compliance Type Performance" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.performanceMetrics.complianceTypePerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sla" fill="#4caf50" name="SLA Compliance %" />
                        <Bar dataKey="satisfaction" fill="#2196f3" name="Satisfaction (x20)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Risk Assessment Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Risk Factors */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardHeader title="Risk Factor Analysis" />
                  <CardContent>
                    <List>
                      {dashboardData.riskAssessment.riskFactors.map((factor, index) => (
                        <ListItem key={index} divider>
                          <ListItemIcon>
                            <Warning color={getRiskColor(factor.level)} />
                          </ListItemIcon>
                          <ListItemText
                            primary={factor.factor}
                            secondary={`Impact: ${factor.impact} | Trend: ${factor.trend}`}
                          />
                          <Chip 
                            label={factor.level} 
                            color={getRiskColor(factor.level)}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Risk Distribution */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Entity Risk Distribution" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.riskAssessment.complianceRiskHeatmap}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ entity, percentage }) => `${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          <Cell fill="#f44336" />
                          <Cell fill="#ff9800" />
                          <Cell fill="#4caf50" />
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

        {/* Trend Analysis Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Volume Trends */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Volume Trends" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={dashboardData.trendAnalysis.volumeTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="volume" stroke="#2196f3" fill="#2196f3" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Efficiency Trends */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Efficiency Trends" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData.trendAnalysis.efficiencyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" stroke="#4caf50" strokeWidth={3} name="Actual Efficiency" />
                        <Line type="monotone" dataKey="target" stroke="#ff9800" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ManagementDashboard;