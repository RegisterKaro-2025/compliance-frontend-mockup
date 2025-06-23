import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Download,
  Share,
  Print,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  NavigateBefore,
  NavigateNext,
  GetApp,
  Email,
  Schedule,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  TrendingDown,
  Assessment,
  PieChart,
  BarChart,
  TableChart,
  DateRange,
  Business,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const ReportViewer = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock report data
  const mockReport = {
    id: reportId || 'RPT-001',
    name: 'Monthly Compliance Summary',
    description: 'Comprehensive overview of compliance status across all entities',
    category: 'Compliance',
    type: 'Summary',
    generatedAt: '2023-06-15T10:30:00Z',
    generatedBy: 'John Doe',
    dateRange: {
      start: '2023-05-01',
      end: '2023-05-31'
    },
    status: 'completed',
    format: 'html',
    summary: {
      totalEntities: 45,
      totalCompliances: 1250,
      completedCompliances: 1180,
      pendingCompliances: 45,
      overdueCompliances: 25,
      complianceRate: 94.4,
      avgCompletionTime: '3.2 days'
    },
    charts: [
      {
        id: 'compliance-status',
        type: 'pie',
        title: 'Compliance Status Distribution',
        data: [
          { name: 'Completed', value: 1180, color: '#4caf50' },
          { name: 'Pending', value: 45, color: '#ff9800' },
          { name: 'Overdue', value: 25, color: '#f44336' }
        ]
      },
      {
        id: 'monthly-trend',
        type: 'line',
        title: 'Monthly Compliance Trend',
        data: [
          { month: 'Jan', completed: 95, pending: 8, overdue: 2 },
          { month: 'Feb', completed: 102, pending: 6, overdue: 1 },
          { month: 'Mar', completed: 118, pending: 9, overdue: 3 },
          { month: 'Apr', completed: 125, pending: 7, overdue: 2 },
          { month: 'May', completed: 135, pending: 5, overdue: 1 }
        ]
      },
      {
        id: 'entity-performance',
        type: 'bar',
        title: 'Top Performing Entities',
        data: [
          { entity: 'ABC Corp', rate: 98.5 },
          { entity: 'XYZ Ltd', rate: 96.2 },
          { entity: 'DEF Inc', rate: 94.8 },
          { entity: 'GHI Pvt', rate: 92.1 },
          { entity: 'JKL Co', rate: 89.7 }
        ]
      }
    ],
    tableData: [
      {
        id: 1,
        entity: 'ABC Corporation',
        type: 'GST Return',
        dueDate: '2023-05-20',
        status: 'Completed',
        completedDate: '2023-05-18',
        officer: 'Sarah Wilson'
      },
      {
        id: 2,
        entity: 'XYZ Limited',
        type: 'Income Tax',
        dueDate: '2023-05-31',
        status: 'Pending',
        completedDate: null,
        officer: 'Mike Johnson'
      },
      {
        id: 3,
        entity: 'DEF Industries',
        type: 'Annual ROC',
        dueDate: '2023-05-15',
        status: 'Overdue',
        completedDate: null,
        officer: 'Emily Davis'
      },
      {
        id: 4,
        entity: 'GHI Private Ltd',
        type: 'PF Return',
        dueDate: '2023-05-25',
        status: 'Completed',
        completedDate: '2023-05-23',
        officer: 'David Brown'
      },
      {
        id: 5,
        entity: 'JKL Company',
        type: 'ESI Return',
        dueDate: '2023-05-30',
        status: 'Pending',
        completedDate: null,
        officer: 'Lisa Anderson'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReport(mockReport);
      setLoading(false);
    }, 1000);
  }, [reportId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = (format) => {
    console.log(`Downloading report in ${format} format`);
    handleMenuClose();
  };

  const handleShare = () => {
    console.log('Sharing report');
    handleMenuClose();
  };

  const handlePrint = () => {
    window.print();
    handleMenuClose();
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle />;
      case 'pending':
        return <Warning />;
      case 'overdue':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const filteredTableData = report?.tableData.filter(row =>
    row.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.officer.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(row => 
    filterValue === '' || row.status.toLowerCase() === filterValue.toLowerCase()
  ) || [];

  const paginatedData = filteredTableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Report...
        </Typography>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Report not found or failed to load.
        </Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth={isFullscreen ? false : "xl"} 
      sx={{ 
        mt: isFullscreen ? 0 : 4, 
        mb: isFullscreen ? 0 : 4,
        p: isFullscreen ? 2 : 3,
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
        minHeight: isFullscreen ? '100vh' : 'auto'
      }}
    >
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Breadcrumbs sx={{ mb: 1 }}>
              <Link color="inherit" href="/reports">
                Reports
              </Link>
              <Typography color="text.primary">{report.name}</Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
              {report.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {report.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              <Chip label={report.category} color="primary" size="small" />
              <Chip label={report.type} variant="outlined" size="small" />
              <Chip 
                label={`${report.dateRange.start} to ${report.dateRange.end}`} 
                icon={<DateRange />} 
                variant="outlined" 
                size="small" 
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
              {zoom}%
            </Typography>
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleMenuClick}
            >
              Export
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleDownload('pdf')}>
                <GetApp sx={{ mr: 1 }} /> Download PDF
              </MenuItem>
              <MenuItem onClick={() => handleDownload('excel')}>
                <GetApp sx={{ mr: 1 }} /> Download Excel
              </MenuItem>
              <MenuItem onClick={() => handleDownload('csv')}>
                <GetApp sx={{ mr: 1 }} /> Download CSV
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleShare}>
                <Share sx={{ mr: 1 }} /> Share Report
              </MenuItem>
              <MenuItem onClick={handlePrint}>
                <Print sx={{ mr: 1 }} /> Print
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Generated on {new Date(report.generatedAt).toLocaleString()} by {report.generatedBy}
            </Typography>
          </Box>
          <Chip 
            label={report.status} 
            color={getStatusColor(report.status)} 
            icon={getStatusIcon(report.status)}
          />
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{report.summary.totalEntities}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Entities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{report.summary.totalCompliances}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Compliances
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{report.summary.complianceRate}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Compliance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{report.summary.avgCompletionTime}</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Completion Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Charts" />
          <Tab label="Detailed Data" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Compliance Status Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={report.charts[0].data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {report.charts[0].data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Monthly Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={report.charts[1].data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#4caf50" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="#ff9800" strokeWidth={2} />
                    <Line type="monotone" dataKey="overdue" stroke="#f44336" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {report.charts.map((chart, index) => (
                <Grid item xs={12} md={6} lg={4} key={chart.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{chart.title}</Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        {chart.type === 'pie' && (
                          <RechartsPieChart>
                            <Pie
                              data={chart.data}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {chart.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </RechartsPieChart>
                        )}
                        {chart.type === 'bar' && (
                          <RechartsBarChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="entity" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="rate" fill="#8884d8" />
                          </RechartsBarChart>
                        )}
                        {chart.type === 'line' && (
                          <LineChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="completed" stroke="#4caf50" />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Toolbar sx={{ pl: 0, pr: 0 }}>
              <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
                Detailed Compliance Data
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search..."
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
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterValue}
                    label="Status"
                    onChange={(e) => setFilterValue(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Toolbar>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entity</TableCell>
                    <TableCell>Compliance Type</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Completed Date</TableCell>
                    <TableCell>Assigned Officer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.entity}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={row.status} 
                          color={getStatusColor(row.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{row.completedDate || '-'}</TableCell>
                      <TableCell>{row.officer}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ReportViewer;