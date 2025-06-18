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
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Avatar,
  AvatarGroup,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Refresh,
  Upload,
  Download,
  Visibility,
  Edit,
  Delete,
  Send,
  CheckCircle,
  Warning,
  Error,
  Schedule,
  AccountBalance,
  Receipt,
  Assignment,
  CloudUpload,
  CloudDownload,
  Sync,
  SyncProblem,
  History,
  Info,
  ExpandMore,
  Launch,
  AttachFile,
  Comment,
  Notifications,
  NotificationsActive,
  Person,
  Business,
  DateRange,
  MonetizationOn,
  Assessment,
  TrendingUp,
  Speed,
  Timer,
  PlayArrow,
  Pause,
  Stop,
  Replay
} from '@mui/icons-material';
// Date picker functionality removed for compatibility
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';

const PortalSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [portalFilter, setPortalFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newSubmissionDialog, setNewSubmissionDialog] = useState(false);

  // Mock data for portal submissions
  const mockSubmissions = [
    {
      id: 'SUB-001',
      entity: 'ABC Corporation',
      portal: 'MCA',
      submissionType: 'Annual Return (AOC-4)',
      status: 'submitted',
      submittedDate: '2023-06-15T10:30:00Z',
      dueDate: '2023-06-30',
      acknowledgmentNumber: 'ACK123456789',
      officer: 'Sarah Wilson',
      documents: ['annual-return.pdf', 'balance-sheet.pdf'],
      fees: 5000,
      progress: 100,
      timeline: [
        { step: 'Document Preparation', status: 'completed', date: '2023-06-10' },
        { step: 'Internal Review', status: 'completed', date: '2023-06-12' },
        { step: 'Portal Submission', status: 'completed', date: '2023-06-15' },
        { step: 'Acknowledgment', status: 'completed', date: '2023-06-15' }
      ]
    },
    {
      id: 'SUB-002',
      entity: 'XYZ Limited',
      portal: 'GST',
      submissionType: 'GSTR-3B',
      status: 'in_progress',
      submittedDate: null,
      dueDate: '2023-06-20',
      acknowledgmentNumber: null,
      officer: 'Mike Johnson',
      documents: ['gstr3b-draft.pdf'],
      fees: 0,
      progress: 75,
      timeline: [
        { step: 'Data Collection', status: 'completed', date: '2023-06-08' },
        { step: 'Return Preparation', status: 'completed', date: '2023-06-12' },
        { step: 'Review & Validation', status: 'in_progress', date: null },
        { step: 'Portal Submission', status: 'pending', date: null }
      ]
    },
    {
      id: 'SUB-003',
      entity: 'DEF Industries',
      portal: 'Income Tax',
      submissionType: 'ITR-6',
      status: 'failed',
      submittedDate: '2023-06-14T15:45:00Z',
      dueDate: '2023-07-31',
      acknowledgmentNumber: null,
      officer: 'Emily Davis',
      documents: ['itr6-form.pdf', 'audit-report.pdf'],
      fees: 10000,
      progress: 50,
      error: 'Invalid PAN format in section 2.1',
      timeline: [
        { step: 'Document Preparation', status: 'completed', date: '2023-06-10' },
        { step: 'Internal Review', status: 'completed', date: '2023-06-13' },
        { step: 'Portal Submission', status: 'failed', date: '2023-06-14' },
        { step: 'Error Resolution', status: 'in_progress', date: null }
      ]
    },
    {
      id: 'SUB-004',
      entity: 'GHI Private Ltd',
      portal: 'PF',
      submissionType: 'ECR Upload',
      status: 'draft',
      submittedDate: null,
      dueDate: '2023-06-25',
      acknowledgmentNumber: null,
      officer: 'David Brown',
      documents: ['ecr-file.txt'],
      fees: 0,
      progress: 25,
      timeline: [
        { step: 'Employee Data Collection', status: 'completed', date: '2023-06-05' },
        { step: 'ECR Generation', status: 'in_progress', date: null },
        { step: 'Validation', status: 'pending', date: null },
        { step: 'Portal Upload', status: 'pending', date: null }
      ]
    },
    {
      id: 'SUB-005',
      entity: 'JKL Company',
      portal: 'ESI',
      submissionType: 'Monthly Return',
      status: 'pending_review',
      submittedDate: null,
      dueDate: '2023-06-21',
      acknowledgmentNumber: null,
      officer: 'Lisa Anderson',
      documents: ['esi-return.pdf'],
      fees: 0,
      progress: 90,
      timeline: [
        { step: 'Data Compilation', status: 'completed', date: '2023-06-08' },
        { step: 'Return Preparation', status: 'completed', date: '2023-06-12' },
        { step: 'Internal Review', status: 'pending', date: null },
        { step: 'Portal Submission', status: 'pending', date: null }
      ]
    }
  ];

  const portalStats = {
    total: 25,
    submitted: 8,
    in_progress: 12,
    failed: 3,
    draft: 2,
    success_rate: 85.7,
    avg_processing_time: '2.3 days'
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubmissions(mockSubmissions);
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
      case 'submitted':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'failed':
        return 'error';
      case 'draft':
        return 'default';
      case 'pending_review':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle />;
      case 'in_progress':
        return <Schedule />;
      case 'failed':
        return <Error />;
      case 'draft':
        return <Edit />;
      case 'pending_review':
        return <Warning />;
      default:
        return <Info />;
    }
  };

  const getPortalIcon = (portal) => {
    switch (portal) {
      case 'MCA':
        return <AccountBalance />;
      case 'GST':
        return <Receipt />;
      case 'Income Tax':
        return <MonetizationOn />;
      case 'PF':
        return <Person />;
      case 'ESI':
        return <Assignment />;
      default:
        return <Business />;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.submissionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || submission.status === statusFilter;
    const matchesPortal = portalFilter === '' || submission.portal === portalFilter;
    
    return matchesSearch && matchesStatus && matchesPortal;
  });

  const paginatedSubmissions = filteredSubmissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleRetrySubmission = (submissionId) => {
    console.log('Retrying submission:', submissionId);
    // Implement retry logic
  };

  const handleCancelSubmission = (submissionId) => {
    console.log('Cancelling submission:', submissionId);
    // Implement cancel logic
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Portal Submissions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Sync All
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setNewSubmissionDialog(true)}
          >
            New Submission
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{portalStats.total}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Submissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{portalStats.submitted}</Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully Submitted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{portalStats.success_rate}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Speed sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{portalStats.avg_processing_time}</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Processing Time
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
              placeholder="Search submissions..."
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
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending_review">Pending Review</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Portal</InputLabel>
              <Select
                value={portalFilter}
                label="Portal"
                onChange={(e) => setPortalFilter(e.target.value)}
              >
                <MenuItem value="">All Portals</MenuItem>
                <MenuItem value="MCA">MCA</MenuItem>
                <MenuItem value="GST">GST</MenuItem>
                <MenuItem value="Income Tax">Income Tax</MenuItem>
                <MenuItem value="PF">PF</MenuItem>
                <MenuItem value="ESI">ESI</MenuItem>
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

      {/* Submissions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Submission ID</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Portal</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Officer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSubmissions.map((submission) => (
                <TableRow key={submission.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {submission.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{submission.entity}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPortalIcon(submission.portal)}
                      {submission.portal}
                    </Box>
                  </TableCell>
                  <TableCell>{submission.submissionType}</TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(submission.status)}
                      icon={getStatusIcon(submission.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={submission.progress}
                        sx={{ width: 60, height: 6 }}
                      />
                      <Typography variant="body2">{submission.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={new Date(submission.dueDate) < new Date() ? 'error' : 'text.primary'}
                    >
                      {submission.dueDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {submission.officer.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2">{submission.officer}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(submission)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {submission.status === 'failed' && (
                        <Tooltip title="Retry">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleRetrySubmission(submission.id)}
                          >
                            <Replay />
                          </IconButton>
                        </Tooltip>
                      )}
                      {submission.status === 'in_progress' && (
                        <Tooltip title="Cancel">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleCancelSubmission(submission.id)}
                          >
                            <Stop />
                          </IconButton>
                        </Tooltip>
                      )}
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
          count={filteredSubmissions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Submission Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedSubmission && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Submission Details - {selectedSubmission.id}
                </Typography>
                <Chip
                  label={selectedSubmission.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(selectedSubmission.status)}
                  icon={getStatusIcon(selectedSubmission.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Timeline" />
                <Tab label="Documents" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Entity</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedSubmission.entity}</Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>Portal</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {getPortalIcon(selectedSubmission.portal)}
                      <Typography variant="body1">{selectedSubmission.portal}</Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>Submission Type</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedSubmission.submissionType}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Due Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedSubmission.dueDate}</Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>Assigned Officer</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedSubmission.officer}</Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>Fees</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>₹{selectedSubmission.fees.toLocaleString()}</Typography>
                  </Grid>
                  {selectedSubmission.acknowledgmentNumber && (
                    <Grid item xs={12}>
                      <Alert severity="success">
                        <Typography variant="subtitle2">Acknowledgment Number</Typography>
                        <Typography variant="body1">{selectedSubmission.acknowledgmentNumber}</Typography>
                      </Alert>
                    </Grid>
                  )}
                  {selectedSubmission.error && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        <Typography variant="subtitle2">Error Details</Typography>
                        <Typography variant="body1">{selectedSubmission.error}</Typography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              )}

              {tabValue === 1 && (
                <Timeline>
                  {selectedSubmission.timeline.map((step, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {step.date || 'Pending'}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot 
                          color={
                            step.status === 'completed' ? 'success' : 
                            step.status === 'in_progress' ? 'primary' : 
                            step.status === 'failed' ? 'error' : 'grey'
                          }
                        >
                          {step.status === 'completed' && <CheckCircle />}
                          {step.status === 'in_progress' && <Schedule />}
                          {step.status === 'failed' && <Error />}
                          {step.status === 'pending' && <Timer />}
                        </TimelineDot>
                        {index < selectedSubmission.timeline.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="h6" component="span">
                          {step.step}
                        </Typography>
                        <Typography color="text.secondary">
                          Status: {step.status.replace('_', ' ').toUpperCase()}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              )}

              {tabValue === 2 && (
                <List>
                  {selectedSubmission.documents.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <ListItemText primary={doc} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end">
                          <Download />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedSubmission.status === 'failed' && (
                <Button 
                  variant="contained" 
                  startIcon={<Replay />}
                  onClick={() => handleRetrySubmission(selectedSubmission.id)}
                >
                  Retry Submission
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Submission Dialog */}
      <Dialog 
        open={newSubmissionDialog} 
        onClose={() => setNewSubmissionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Submission</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Entity</InputLabel>
                <Select label="Entity">
                  <MenuItem value="ABC Corporation">ABC Corporation</MenuItem>
                  <MenuItem value="XYZ Limited">XYZ Limited</MenuItem>
                  <MenuItem value="DEF Industries">DEF Industries</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Portal</InputLabel>
                <Select label="Portal">
                  <MenuItem value="MCA">MCA</MenuItem>
                  <MenuItem value="GST">GST</MenuItem>
                  <MenuItem value="Income Tax">Income Tax</MenuItem>
                  <MenuItem value="PF">PF</MenuItem>
                  <MenuItem value="ESI">ESI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Submission Type</InputLabel>
                <Select label="Submission Type">
                  <MenuItem value="Annual Return">Annual Return</MenuItem>
                  <MenuItem value="GST Return">GST Return</MenuItem>
                  <MenuItem value="Income Tax Return">Income Tax Return</MenuItem>
                  <MenuItem value="PF Return">PF Return</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSubmissionDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Submission</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PortalSubmissions;