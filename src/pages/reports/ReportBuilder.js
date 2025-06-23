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
  Checkbox,
  FormControlLabel,
  FormGroup,
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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Slider,
  RadioGroup,
  Radio,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Remove,
  ExpandMore,
  Settings,
  Preview,
  Save,
  Download,
  Share,
  Refresh,
  DragIndicator,
  Visibility,
  VisibilityOff,
  FilterList,
  Sort,
  TableChart,
  BarChart,
  PieChart,
  TrendingUp,
  Assessment,
  DateRange,
  Business,
  Assignment,
  Description,
  AccountBalance,
  MonetizationOn,
  Speed,
  CheckCircle,
  Warning
} from '@mui/icons-material';
// Date picker functionality removed for compatibility

const ReportBuilder = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    category: '',
    type: 'summary',
    dataSource: '',
    dateRange: {
      start: null,
      end: null,
      preset: 'last_month'
    },
    filters: [],
    groupBy: [],
    metrics: [],
    visualizations: [],
    format: 'pdf',
    schedule: null
  });
  const [previewData, setPreviewData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const steps = [
    'Basic Information',
    'Data Source & Filters',
    'Metrics & Grouping',
    'Visualizations',
    'Format & Schedule',
    'Preview & Save'
  ];

  const dataSources = [
    { id: 'compliance', name: 'Compliance Data', description: 'All compliance records and status' },
    { id: 'entities', name: 'Entity Data', description: 'Entity information and relationships' },
    { id: 'documents', name: 'Document Data', description: 'Document status and metadata' },
    { id: 'financial', name: 'Financial Data', description: 'Revenue and financial metrics' },
    { id: 'performance', name: 'Performance Data', description: 'SLA and performance metrics' },
    { id: 'users', name: 'User Activity', description: 'User actions and activity logs' }
  ];

  const availableMetrics = {
    compliance: [
      { id: 'total_compliances', name: 'Total Compliances', type: 'count' },
      { id: 'completed_compliances', name: 'Completed Compliances', type: 'count' },
      { id: 'pending_compliances', name: 'Pending Compliances', type: 'count' },
      { id: 'overdue_compliances', name: 'Overdue Compliances', type: 'count' },
      { id: 'compliance_rate', name: 'Compliance Rate', type: 'percentage' },
      { id: 'avg_completion_time', name: 'Average Completion Time', type: 'duration' }
    ],
    financial: [
      { id: 'total_revenue', name: 'Total Revenue', type: 'currency' },
      { id: 'revenue_growth', name: 'Revenue Growth', type: 'percentage' },
      { id: 'avg_revenue_per_entity', name: 'Average Revenue per Entity', type: 'currency' },
      { id: 'revenue_by_service', name: 'Revenue by Service Type', type: 'currency' }
    ],
    performance: [
      { id: 'sla_compliance', name: 'SLA Compliance', type: 'percentage' },
      { id: 'avg_processing_time', name: 'Average Processing Time', type: 'duration' },
      { id: 'client_satisfaction', name: 'Client Satisfaction', type: 'rating' },
      { id: 'task_completion_rate', name: 'Task Completion Rate', type: 'percentage' }
    ]
  };

  const visualizationTypes = [
    { id: 'table', name: 'Data Table', icon: <TableChart />, description: 'Tabular data display' },
    { id: 'bar', name: 'Bar Chart', icon: <BarChart />, description: 'Compare values across categories' },
    { id: 'pie', name: 'Pie Chart', icon: <PieChart />, description: 'Show proportions of a whole' },
    { id: 'line', name: 'Line Chart', icon: <TrendingUp />, description: 'Show trends over time' },
    { id: 'summary', name: 'Summary Cards', icon: <Assessment />, description: 'Key metrics overview' }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const updateReportConfig = (field, value) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: '',
      type: 'text'
    };
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const removeFilter = (filterId) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.id !== filterId)
    }));
  };

  const addMetric = (metric) => {
    if (!reportConfig.metrics.find(m => m.id === metric.id)) {
      setReportConfig(prev => ({
        ...prev,
        metrics: [...prev.metrics, metric]
      }));
    }
  };

  const removeMetric = (metricId) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m.id !== metricId)
    }));
  };

  const addVisualization = (vizType) => {
    const newViz = {
      id: Date.now(),
      type: vizType.id,
      name: vizType.name,
      config: {}
    };
    setReportConfig(prev => ({
      ...prev,
      visualizations: [...prev.visualizations, newViz]
    }));
  };

  const generatePreview = () => {
    // Mock preview data generation
    const mockData = {
      summary: {
        totalRecords: 1245,
        dateRange: '2023-01-01 to 2023-06-15',
        lastUpdated: new Date().toISOString()
      },
      data: [
        { category: 'GST Returns', count: 520, percentage: 41.8 },
        { category: 'Income Tax', count: 180, percentage: 14.5 },
        { category: 'Annual ROC', count: 120, percentage: 9.6 },
        { category: 'Other', count: 425, percentage: 34.1 }
      ]
    };
    setPreviewData(mockData);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Name"
                value={reportConfig.name}
                onChange={(e) => updateReportConfig('name', e.target.value)}
                placeholder="Enter report name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={reportConfig.description}
                onChange={(e) => updateReportConfig('description', e.target.value)}
                placeholder="Describe what this report shows"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={reportConfig.category}
                  label="Category"
                  onChange={(e) => updateReportConfig('category', e.target.value)}
                >
                  <MenuItem value="compliance">Compliance</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="performance">Performance</MenuItem>
                  <MenuItem value="risk">Risk</MenuItem>
                  <MenuItem value="operational">Operational</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportConfig.type}
                  label="Report Type"
                  onChange={(e) => updateReportConfig('type', e.target.value)}
                >
                  <MenuItem value="summary">Summary</MenuItem>
                  <MenuItem value="detailed">Detailed</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="comparison">Comparison</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Select Data Source</Typography>
              <Grid container spacing={2}>
                {dataSources.map((source) => (
                  <Grid item xs={12} md={6} key={source.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: reportConfig.dataSource === source.id ? 2 : 1,
                        borderColor: reportConfig.dataSource === source.id ? 'primary.main' : 'divider'
                      }}
                      onClick={() => updateReportConfig('dataSource', source.id)}
                    >
                      <CardContent>
                        <Typography variant="h6">{source.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {source.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Date Range</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Preset Range</InputLabel>
                    <Select
                      value={reportConfig.dateRange.preset}
                      label="Preset Range"
                      onChange={(e) => updateReportConfig('dateRange', { ...reportConfig.dateRange, preset: e.target.value })}
                    >
                      <MenuItem value="last_week">Last Week</MenuItem>
                      <MenuItem value="last_month">Last Month</MenuItem>
                      <MenuItem value="last_quarter">Last Quarter</MenuItem>
                      <MenuItem value="last_year">Last Year</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {reportConfig.dateRange.preset === 'custom' && (
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={reportConfig.dateRange.start || ''}
                        onChange={(e) => updateReportConfig('dateRange', { ...reportConfig.dateRange, start: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={reportConfig.dateRange.end || ''}
                        onChange={(e) => updateReportConfig('dateRange', { ...reportConfig.dateRange, end: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <Button startIcon={<Add />} onClick={addFilter}>
                  Add Filter
                </Button>
              </Box>
              {reportConfig.filters.map((filter, index) => (
                <Card key={filter.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Field"
                          value={filter.field}
                          onChange={(e) => {
                            const updatedFilters = [...reportConfig.filters];
                            updatedFilters[index].field = e.target.value;
                            updateReportConfig('filters', updatedFilters);
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Operator</InputLabel>
                          <Select
                            value={filter.operator}
                            label="Operator"
                            onChange={(e) => {
                              const updatedFilters = [...reportConfig.filters];
                              updatedFilters[index].operator = e.target.value;
                              updateReportConfig('filters', updatedFilters);
                            }}
                          >
                            <MenuItem value="equals">Equals</MenuItem>
                            <MenuItem value="contains">Contains</MenuItem>
                            <MenuItem value="greater_than">Greater Than</MenuItem>
                            <MenuItem value="less_than">Less Than</MenuItem>
                            <MenuItem value="between">Between</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Value"
                          value={filter.value}
                          onChange={(e) => {
                            const updatedFilters = [...reportConfig.filters];
                            updatedFilters[index].value = e.target.value;
                            updateReportConfig('filters', updatedFilters);
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton onClick={() => removeFilter(filter.id)} color="error">
                          <Remove />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Available Metrics</Typography>
              {reportConfig.dataSource && availableMetrics[reportConfig.dataSource] && (
                <List>
                  {availableMetrics[reportConfig.dataSource].map((metric) => (
                    <ListItem key={metric.id}>
                      <ListItemText
                        primary={metric.name}
                        secondary={`Type: ${metric.type}`}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          onClick={() => addMetric(metric)}
                          disabled={reportConfig.metrics.find(m => m.id === metric.id)}
                        >
                          Add
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Selected Metrics</Typography>
              <List>
                {reportConfig.metrics.map((metric) => (
                  <ListItem key={metric.id}>
                    <ListItemIcon>
                      <DragIndicator />
                    </ListItemIcon>
                    <ListItemText
                      primary={metric.name}
                      secondary={`Type: ${metric.type}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeMetric(metric.id)} color="error">
                        <Remove />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Group By</Typography>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Entity"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Compliance Type"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Status"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Date"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Assigned Officer"
                />
              </FormGroup>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Add Visualizations</Typography>
              <Grid container spacing={2}>
                {visualizationTypes.map((viz) => (
                  <Grid item xs={12} md={6} lg={4} key={viz.id}>
                    <Card sx={{ cursor: 'pointer' }} onClick={() => addVisualization(viz)}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        {viz.icon}
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          {viz.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {viz.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Selected Visualizations</Typography>
              {reportConfig.visualizations.map((viz, index) => (
                <Card key={viz.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{viz.name}</Typography>
                      <IconButton 
                        onClick={() => {
                          const updatedViz = reportConfig.visualizations.filter(v => v.id !== viz.id);
                          updateReportConfig('visualizations', updatedViz);
                        }}
                        color="error"
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Output Format</Typography>
              <RadioGroup
                value={reportConfig.format}
                onChange={(e) => updateReportConfig('format', e.target.value)}
              >
                <FormControlLabel value="pdf" control={<Radio />} label="PDF Document" />
                <FormControlLabel value="excel" control={<Radio />} label="Excel Spreadsheet" />
                <FormControlLabel value="csv" control={<Radio />} label="CSV File" />
                <FormControlLabel value="html" control={<Radio />} label="HTML Report" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Schedule (Optional)</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={!!reportConfig.schedule}
                    onChange={(e) => updateReportConfig('schedule', e.target.checked ? {} : null)}
                  />
                }
                label="Enable Scheduling"
              />
              {reportConfig.schedule && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Frequency</InputLabel>
                    <Select label="Frequency">
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Recipients (comma-separated emails)"
                    placeholder="user1@example.com, user2@example.com"
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        );

      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Review your report configuration and generate a preview before saving.
              </Alert>
              
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Report Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Name:</strong> {reportConfig.name || 'Untitled Report'}</Typography>
                    <Typography variant="body2"><strong>Category:</strong> {reportConfig.category || 'Not specified'}</Typography>
                    <Typography variant="body2"><strong>Data Source:</strong> {reportConfig.dataSource || 'Not selected'}</Typography>
                    <Typography variant="body2"><strong>Metrics:</strong> {reportConfig.metrics.length} selected</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Filters:</strong> {reportConfig.filters.length} applied</Typography>
                    <Typography variant="body2"><strong>Visualizations:</strong> {reportConfig.visualizations.length} added</Typography>
                    <Typography variant="body2"><strong>Format:</strong> {reportConfig.format.toUpperCase()}</Typography>
                    <Typography variant="body2"><strong>Scheduled:</strong> {reportConfig.schedule ? 'Yes' : 'No'}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button variant="outlined" startIcon={<Preview />} onClick={generatePreview}>
                  Generate Preview
                </Button>
                <Button variant="contained" startIcon={<Save />}>
                  Save Report
                </Button>
              </Box>

              {previewData && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Preview</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Records: {previewData.summary.totalRecords} | 
                    Date Range: {previewData.summary.dateRange} | 
                    Last Updated: {new Date(previewData.summary.lastUpdated).toLocaleString()}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {previewData.data.map((item, index) => (
                      <Grid item xs={12} md={3} key={index}>
                        <Card>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4">{item.count}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.category}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {item.percentage}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Report Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Reset
          </Button>
          <Button variant="outlined">
            Load Template
          </Button>
        </Box>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Box sx={{ mt: 2, mb: 2 }}>
                  {renderStepContent(index)}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={index === steps.length - 1}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default ReportBuilder;