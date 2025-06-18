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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Download,
  Upload,
  Visibility,
  FileCopy,
  History,
  Settings,
  Description,
  Assignment,
  CheckCircle,
  Warning,
  ExpandMore,
  Code,
  Preview,
  Save,
  Cancel,
  Refresh,
  Search,
  FilterList,
  MoreVert
} from '@mui/icons-material';

const TemplateManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // create, edit, view
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data
  useEffect(() => {
    const mockTemplates = [
      {
        id: 1,
        name: 'Form AOC-4 Template',
        description: 'Annual filing of financial statements with ROC',
        category: 'MCA_FILING',
        complianceType: 'Annual ROC Filing',
        version: '2023-24',
        status: 'active',
        lastModified: '2023-06-10',
        createdBy: 'System Admin',
        fileFormat: 'PDF',
        fileSize: '2.4 MB',
        downloadCount: 145,
        mappingFields: [
          { field: 'companyName', source: 'entity.name', required: true },
          { field: 'cin', source: 'entity.cin', required: true },
          { field: 'financialYear', source: 'compliance.financialYear', required: true }
        ],
        validationRules: [
          { rule: 'CIN format validation', type: 'regex', pattern: '^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$' },
          { rule: 'Financial year validation', type: 'date_range', required: true }
        ]
      },
      {
        id: 2,
        name: 'GSTR-3B Template',
        description: 'Monthly GST return summary template',
        category: 'GST_FILING',
        complianceType: 'GST Return',
        version: '2023',
        status: 'active',
        lastModified: '2023-06-08',
        createdBy: 'Tax Team',
        fileFormat: 'JSON',
        fileSize: '156 KB',
        downloadCount: 289,
        mappingFields: [
          { field: 'gstin', source: 'entity.gstin', required: true },
          { field: 'returnPeriod', source: 'compliance.returnPeriod', required: true },
          { field: 'outwardSupplies', source: 'transaction.outwardSupplies', required: true }
        ],
        validationRules: [
          { rule: 'GSTIN format validation', type: 'regex', pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$' },
          { rule: 'Tax amount validation', type: 'numeric', min: 0 }
        ]
      },
      {
        id: 3,
        name: 'ITR-6 Template',
        description: 'Income tax return for companies',
        category: 'INCOME_TAX',
        complianceType: 'Income Tax Return',
        version: 'AY 2023-24',
        status: 'draft',
        lastModified: '2023-06-05',
        createdBy: 'Compliance Team',
        fileFormat: 'XML',
        fileSize: '3.2 MB',
        downloadCount: 67,
        mappingFields: [
          { field: 'pan', source: 'entity.pan', required: true },
          { field: 'assessmentYear', source: 'compliance.assessmentYear', required: true },
          { field: 'totalIncome', source: 'financial.totalIncome', required: true }
        ],
        validationRules: [
          { rule: 'PAN format validation', type: 'regex', pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
          { rule: 'Income validation', type: 'numeric', min: 0 }
        ]
      },
      {
        id: 4,
        name: 'DIR-3 KYC Template',
        description: 'Annual KYC for directors',
        category: 'MCA_FILING',
        complianceType: 'Director KYC',
        version: '2023-24',
        status: 'active',
        lastModified: '2023-06-01',
        createdBy: 'Legal Team',
        fileFormat: 'PDF',
        fileSize: '1.8 MB',
        downloadCount: 98,
        mappingFields: [
          { field: 'din', source: 'person.din', required: true },
          { field: 'directorName', source: 'person.name', required: true },
          { field: 'address', source: 'person.address', required: true }
        ],
        validationRules: [
          { rule: 'DIN format validation', type: 'regex', pattern: '^[0-9]{8}$' },
          { rule: 'Address validation', type: 'required', required: true }
        ]
      }
    ];

    setTimeout(() => {
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (mode, template = null) => {
    setDialogMode(mode);
    setSelectedTemplate(template);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTemplate(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'deprecated': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'MCA_FILING': return 'primary';
      case 'GST_FILING': return 'secondary';
      case 'INCOME_TAX': return 'info';
      case 'TDS_FILING': return 'warning';
      default: return 'default';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading template management...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Template Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Upload />}>
            Import Template
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog('create')}>
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search templates..."
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
                <MenuItem value="MCA_FILING">MCA Filing</MenuItem>
                <MenuItem value="GST_FILING">GST Filing</MenuItem>
                <MenuItem value="INCOME_TAX">Income Tax</MenuItem>
                <MenuItem value="TDS_FILING">TDS Filing</MenuItem>
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
          <Tab label="Template Library" />
          <Tab label="Template Builder" />
          <Tab label="Version History" />
          <Tab label="Settings" />
        </Tabs>

        {/* Template Library Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredTemplates.map((template) => (
                <Grid item xs={12} md={6} lg={4} key={template.id}>
                  <Card>
                    <CardHeader
                      title={template.name}
                      subheader={template.description}
                      action={
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={template.category.replace('_', ' ')} 
                          color={getCategoryColor(template.category)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={template.status} 
                          color={getStatusColor(template.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Version: {template.version}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Format: {template.fileFormat} • Size: {template.fileSize}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Downloads: {template.downloadCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Modified: {template.lastModified}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Visibility />} onClick={() => handleOpenDialog('view', template)}>
                        View
                      </Button>
                      <Button size="small" startIcon={<Edit />} onClick={() => handleOpenDialog('edit', template)}>
                        Edit
                      </Button>
                      <Button size="small" startIcon={<Download />}>
                        Download
                      </Button>
                      <Button size="small" startIcon={<FileCopy />}>
                        Clone
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Template Builder Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Template Builder allows you to create and customize compliance document templates with dynamic field mapping and validation rules.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Template Properties" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Template Name" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Description" multiline rows={3} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select label="Category">
                            <MenuItem value="MCA_FILING">MCA Filing</MenuItem>
                            <MenuItem value="GST_FILING">GST Filing</MenuItem>
                            <MenuItem value="INCOME_TAX">Income Tax</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>File Format</InputLabel>
                          <Select label="File Format">
                            <MenuItem value="PDF">PDF</MenuItem>
                            <MenuItem value="XML">XML</MenuItem>
                            <MenuItem value="JSON">JSON</MenuItem>
                            <MenuItem value="EXCEL">Excel</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Field Mapping" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Configure how data fields map to template placeholders
                    </Typography>
                    <Button variant="outlined" startIcon={<Add />} fullWidth>
                      Add Field Mapping
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Version History Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Template</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell>Modified Date</TableCell>
                    <TableCell>Modified By</TableCell>
                    <TableCell>Changes</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.version}</TableCell>
                      <TableCell>{template.lastModified}</TableCell>
                      <TableCell>{template.createdBy}</TableCell>
                      <TableCell>Field mapping updates</TableCell>
                      <TableCell>
                        <Chip 
                          label={template.status} 
                          color={getStatusColor(template.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                        <IconButton size="small">
                          <History />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Settings Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Template Management Settings</Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Auto-Update Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable automatic template updates"
                />
                <Typography variant="body2" color="text.secondary">
                  Automatically update templates when regulatory changes are detected
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Validation Rules</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enforce strict validation"
                />
                <Typography variant="body2" color="text.secondary">
                  Require all validation rules to pass before template activation
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Version Control</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Maintain version history"
                />
                <Typography variant="body2" color="text.secondary">
                  Keep historical versions of templates for audit purposes
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>

      {/* Template Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Create New Template'}
          {dialogMode === 'edit' && 'Edit Template'}
          {dialogMode === 'view' && 'Template Details'}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{selectedTemplate.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTemplate.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Template Information</Typography>
                  <Typography variant="body2">Category: {selectedTemplate.category}</Typography>
                  <Typography variant="body2">Version: {selectedTemplate.version}</Typography>
                  <Typography variant="body2">Format: {selectedTemplate.fileFormat}</Typography>
                  <Typography variant="body2">Size: {selectedTemplate.fileSize}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Usage Statistics</Typography>
                  <Typography variant="body2">Downloads: {selectedTemplate.downloadCount}</Typography>
                  <Typography variant="body2">Last Modified: {selectedTemplate.lastModified}</Typography>
                  <Typography variant="body2">Created By: {selectedTemplate.createdBy}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Field Mappings</Typography>
                  <List dense>
                    {selectedTemplate.mappingFields?.map((field, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Code />
                        </ListItemIcon>
                        <ListItemText
                          primary={field.field}
                          secondary={`Source: ${field.source} ${field.required ? '(Required)' : ''}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Validation Rules</Typography>
                  <List dense>
                    {selectedTemplate.validationRules?.map((rule, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle />
                        </ListItemIcon>
                        <ListItemText
                          primary={rule.rule}
                          secondary={`Type: ${rule.type}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button variant="contained" startIcon={<Save />}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TemplateManagement;