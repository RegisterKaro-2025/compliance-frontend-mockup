import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  FormHelperText,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  FileCopy as FileCopyIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  InsertDriveFile as InsertDriveFileIcon,
  BusinessCenter as BusinessCenterIcon,
  Business as BusinessIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useAuth } from '../../contexts/AuthContext';

// Helper functions
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileIcon = (fileType) => {
  if (fileType.includes('pdf')) {
    return <PictureAsPdfIcon color="error" />;
  } else if (fileType.includes('image')) {
    return <ImageIcon color="primary" />;
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return <FileCopyIcon color="primary" />;
  } else {
    return <InsertDriveFileIcon />;
  }
};

const DocumentUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // document ID for edit mode
  const queryParams = new URLSearchParams(location.search);
  const complianceIdParam = queryParams.get('complianceId');
  const entityIdParam = queryParams.get('entityId');
  
  const fileInputRef = useRef(null);
  
  const { currentUser } = useAuth();
  const { 
    compliances, 
    entities, 
    complianceTypes,
    documentTypes,
    getComplianceById,
    getEntityById,
    getComplianceTypeById,
    uploadDocument,
    updateDocument,
    loading,
    error
  } = useCompliance();
  
  const isEditMode = Boolean(id);
  
  // State variables
  const [selectedCompliance, setSelectedCompliance] = useState(
    complianceIdParam ? getComplianceById(complianceIdParam) : null
  );
  const [selectedEntity, setSelectedEntity] = useState(
    entityIdParam ? getEntityById(entityIdParam) : 
    (selectedCompliance ? getEntityById(selectedCompliance.entityId) : null)
  );
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    complianceId: complianceIdParam || '',
    entityId: entityIdParam || '',
    validFrom: '',
    validUntil: '',
    isVerified: false,
    verificationNotes: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Effect to update entity when compliance changes
  useEffect(() => {
    if (selectedCompliance) {
      const entity = getEntityById(selectedCompliance.entityId);
      setSelectedEntity(entity);
      setFormData(prev => ({
        ...prev,
        entityId: entity?.id || '',
        complianceId: selectedCompliance.id
      }));
    }
  }, [selectedCompliance, getEntityById]);
  
  // Effect to load document data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, fetch document data by ID
      // Mock implementation for this mockup
      const mockDocumentData = {
        id,
        name: 'Annual Financial Statement',
        type: 'FINANCIAL_STATEMENT',
        description: 'Financial statement for FY 2022-23',
        complianceId: complianceIdParam || '',
        entityId: entityIdParam || '',
        validFrom: '2022-04-01',
        validUntil: '2023-03-31',
        isVerified: true,
        verificationNotes: 'Verified by compliance team',
        tags: ['financial', 'annual', 'statement'],
        file: {
          name: 'financial-statement-2022-23.pdf',
          size: 2045000,
          type: 'application/pdf'
        }
      };
      
      setFormData(mockDocumentData);
      setSelectedCompliance(getComplianceById(mockDocumentData.complianceId));
      setSelectedEntity(getEntityById(mockDocumentData.entityId));
      
      // Simulate file already uploaded
      setFiles([{
        file: null, // In edit mode, file might be null initially
        name: mockDocumentData.file.name,
        size: mockDocumentData.file.size,
        type: mockDocumentData.file.type,
        uploaded: true,
        id: id
      }]);
      setSelectedFile(0); // Select the first file
    }
  }, [isEditMode, id, getComplianceById, getEntityById, complianceIdParam, entityIdParam]);
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    // Create file objects with additional metadata
    const newFiles = selectedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false,
      progress: 0,
      error: null
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Select the first file if none is selected
    if (selectedFile === null && newFiles.length > 0) {
      setSelectedFile(files.length);
      
      // Auto-fill name based on file name
      setFormData(prev => ({
        ...prev,
        name: newFiles[0].name.split('.')[0].replace(/[-_]/g, ' ')
      }));
    }
    
    // Reset the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle file removal
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    
    // Update selected file if needed
    if (selectedFile === index) {
      setSelectedFile(files.length > 1 ? 0 : null);
    } else if (selectedFile > index) {
      setSelectedFile(selectedFile - 1);
    }
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle tag input change
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle compliance selection
  const handleComplianceChange = (e) => {
    const complianceId = e.target.value;
    const compliance = getComplianceById(complianceId);
    setSelectedCompliance(compliance);
    
    setFormData(prev => ({
      ...prev,
      complianceId
    }));
  };
  
  // Handle entity selection
  const handleEntityChange = (e) => {
    const entityId = e.target.value;
    const entity = getEntityById(entityId);
    setSelectedEntity(entity);
    
    setFormData(prev => ({
      ...prev,
      entityId
    }));
  };
  
  // Handle file selection for editing
  const handleSelectFile = (index) => {
    setSelectedFile(index);
    
    // Auto-fill name based on file name if empty
    if (!formData.name) {
      setFormData(prev => ({
        ...prev,
        name: files[index].name.split('.')[0].replace(/[-_]/g, ' ')
      }));
    }
  };
  
  // Handle preview dialog open
  const handlePreviewOpen = () => {
    setPreviewDialogOpen(true);
  };
  
  // Handle preview dialog close
  const handlePreviewClose = () => {
    setPreviewDialogOpen(false);
  };
  
  // Navigate to next step
  const handleNext = () => {
    const isValid = validateStep(activeStep);
    if (isValid) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Validate current step
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};
    
    switch (step) {
      case 0: // File Selection
        if (files.length === 0) {
          newErrors.files = 'Please select at least one file to upload';
          isValid = false;
        }
        break;
      
      case 1: // Document Details
        if (!formData.name) {
          newErrors.name = 'Document name is required';
          isValid = false;
        }
        
        if (!formData.type) {
          newErrors.type = 'Document type is required';
          isValid = false;
        }
        
        if (!formData.complianceId && !formData.entityId) {
          newErrors.complianceId = 'Please select a compliance or entity';
          isValid = false;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Validate all form fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    if (files.length === 0) {
      newErrors.files = 'Please select at least one file to upload';
      isValid = false;
    }
    
    if (!formData.name) {
      newErrors.name = 'Document name is required';
      isValid = false;
    }
    
    if (!formData.type) {
      newErrors.type = 'Document type is required';
      isValid = false;
    }
    
    if (!formData.complianceId && !formData.entityId) {
      newErrors.complianceId = 'Please select a compliance or entity';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        
        // Skip files that are already uploaded (in edit mode)
        if (fileData.uploaded) continue;
        
        // Update progress
        setUploadProgress(prev => ({
          ...prev,
          [i]: { progress: 0, status: 'uploading' }
        }));
        
        // Simulate upload with progress
        await new Promise(resolve => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            
            setUploadProgress(prev => ({
              ...prev,
              [i]: { progress, status: 'uploading' }
            }));
            
            if (progress >= 100) {
              clearInterval(interval);
              
              setUploadProgress(prev => ({
                ...prev,
                [i]: { progress: 100, status: 'complete' }
              }));
              
              resolve();
            }
          }, 300);
        });
        
        // In a real app, upload the file to server
        // Here we're just simulating the upload
        
        // Prepare document data
        const documentData = {
          ...formData,
          fileId: `file-${Date.now()}`, // This would be returned by the server
          uploadedBy: currentUser.id,
          uploadedAt: new Date().toISOString(),
          fileName: fileData.name,
          fileSize: fileData.size,
          fileType: fileData.type,
          status: 'UPLOADED',
        };
        
        // In a real app, send document data to server
        if (isEditMode) {
          await updateDocument(id, documentData);
        } else {
          await uploadDocument(documentData);
        }
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: isEditMode ? 'Document updated successfully' : 'Documents uploaded successfully',
        severity: 'success'
      });
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error('Error uploading documents:', err);
      
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'upload'} documents. Please try again.`,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Mock document types
  const mockDocumentTypes = [
    { id: 'FINANCIAL_STATEMENT', name: 'Financial Statement' },
    { id: 'ANNUAL_RETURN', name: 'Annual Return' },
    { id: 'TAX_FILING', name: 'Tax Filing' },
    { id: 'BOARD_RESOLUTION', name: 'Board Resolution' },
    { id: 'CERTIFICATE', name: 'Certificate' },
    { id: 'PROOF_OF_ADDRESS', name: 'Proof of Address' },
    { id: 'IDENTITY_PROOF', name: 'Identity Proof' },
    { id: 'LEGAL_AGREEMENT', name: 'Legal Agreement' },
    { id: 'OTHER', name: 'Other' }
  ];
  
  // Define steps
  const steps = [
    {
      label: 'Select Files',
      description: 'Choose the files you want to upload',
      content: (
        <Box sx={{ mt: 2 }}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3, border: '2px dashed', borderColor: 'divider' }}>
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Drag and drop files here, or click to select
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB per file)
              </Typography>
              
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2 }}
                startIcon={<AttachFileIcon />}
              >
                Select Files
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileSelect}
                />
              </Button>
            </Box>
          </Paper>
          
          {errors.files && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.files}
            </Alert>
          )}
          
          {files.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Selected Files ({files.length})
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
                    {files.map((file, index) => (
                      <ListItem
                        key={index}
                        button
                        selected={selectedFile === index}
                        onClick={() => handleSelectFile(index)}
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(index);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          {getFileIcon(file.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={formatBytes(file.size)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  {selectedFile !== null && (
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            File Preview
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={handlePreviewOpen}
                            disabled={files[selectedFile].file === null} // Disable in edit mode if file is not loaded
                          >
                            Full Preview
                          </Button>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getFileIcon(files[selectedFile].type)}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="subtitle1">
                              {files[selectedFile].name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatBytes(files[selectedFile].size)} • {files[selectedFile].type}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {uploadProgress[selectedFile] && (
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                {uploadProgress[selectedFile].status === 'complete' 
                                  ? 'Upload complete' 
                                  : 'Uploading...'}
                              </Typography>
                              <Typography variant="body2">
                                {uploadProgress[selectedFile].progress}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={uploadProgress[selectedFile].progress} 
                              color={uploadProgress[selectedFile].status === 'complete' ? 'success' : 'primary'}
                            />
                          </Box>
                        )}
                        
                        {files[selectedFile].uploaded && (
                          <Box sx={{ mt: 2 }}>
                            <Alert severity="success" icon={<CheckCircleIcon />}>
                              This file has already been uploaded
                            </Alert>
                          </Box>
                        )}
                        
                        {files[selectedFile].type.includes('image') ? (
                          <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <img
                              src={files[selectedFile].file ? URL.createObjectURL(files[selectedFile].file) : '#'}
                              alt="Preview"
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: 200, 
                                objectFit: 'contain',
                                display: files[selectedFile].file ? 'block' : 'none'
                              }}
                            />
                            {!files[selectedFile].file && (
                              <Typography variant="body2" color="text.secondary">
                                Preview not available in edit mode
                              </Typography>
                            )}
                          </Box>
                        ) : files[selectedFile].type.includes('pdf') ? (
                          <Box sx={{ mt: 2, textAlign: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <PictureAsPdfIcon sx={{ fontSize: 60, color: 'error.main' }} />
                            <Typography variant="body2">
                              PDF preview available in full screen mode
                            </Typography>
                          </Box>
                        ) : (
                          <Box sx={{ mt: 2, textAlign: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            {getFileIcon(files[selectedFile].type)}
                            <Typography variant="body2">
                              Preview not available for this file type
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      )
    },
    {
      label: 'Document Details',
      description: 'Provide information about the document',
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Document Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.type)}>
                <InputLabel id="document-type-label">Document Type *</InputLabel>
                <Select
                  labelId="document-type-label"
                  id="type"
                  name="type"
                  value={formData.type}
                  label="Document Type *"
                  onChange={handleChange}
                >
                  {mockDocumentTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(errors.complianceId)}>
                <InputLabel id="compliance-label">Compliance Requirement</InputLabel>
                <Select
                  labelId="compliance-label"
                  id="complianceId"
                  name="complianceId"
                  value={formData.complianceId}
                  label="Compliance Requirement"
                  onChange={handleComplianceChange}
                  disabled={Boolean(complianceIdParam)}
                >
                  <MenuItem value="">None</MenuItem>
                  {compliances.map((compliance) => {
                    const complianceType = getComplianceTypeById(compliance.complianceTypeId);
                    return (
                      <MenuItem key={compliance.id} value={compliance.id}>
                        {complianceType?.name} ({compliance.financialYear})
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.complianceId && <FormHelperText>{errors.complianceId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="entity-label">Entity</InputLabel>
                <Select
                  labelId="entity-label"
                  id="entityId"
                  name="entityId"
                  value={formData.entityId}
                  label="Entity"
                  onChange={handleEntityChange}
                  disabled={Boolean(selectedCompliance) || Boolean(entityIdParam)}
                >
                  <MenuItem value="">None</MenuItem>
                  {entities.map((entity) => (
                    <MenuItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid From"
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valid Until"
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a description of this document"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Add Tags"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type and press Enter"
                    size="small"
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
                {formData.tags.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No tags added yet
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          
          {isEditMode && (
            <Box sx={{ mt: 3 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="verification-content"
                  id="verification-header"
                >
                  <Typography>Verification Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isVerified}
                            onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                            color="primary"
                          />
                        }
                        label="Verified"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Verification Notes"
                        multiline
                        rows={2}
                        name="verificationNotes"
                        value={formData.verificationNotes}
                        onChange={handleChange}
                        placeholder="Enter notes about the verification process"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>
      )
    },
    {
      label: 'Review & Upload',
      description: 'Review document details and upload',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please review the document details before uploading
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Document Information
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Name"
                        secondary={formData.name || 'Not specified'}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <FileCopyIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Type"
                        secondary={
                          mockDocumentTypes.find(t => t.id === formData.type)?.name || 'Not specified'
                        }
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <BusinessCenterIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Compliance Requirement"
                        secondary={
                          formData.complianceId 
                            ? (() => {
                                const compliance = getComplianceById(formData.complianceId);
                                const complianceType = compliance 
                                  ? getComplianceTypeById(compliance.complianceTypeId) 
                                  : null;
                                return complianceType 
                                  ? `${complianceType.name} (${compliance.financialYear})` 
                                  : 'Unknown';
                              })()
                            : 'None'
                        }
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Entity"
                        secondary={
                          formData.entityId 
                            ? getEntityById(formData.entityId)?.name || 'Unknown' 
                            : 'None'
                        }
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText
                        primary="Validity Period"
                        secondary={
                          formData.validFrom && formData.validUntil
                            ? `${new Date(formData.validFrom).toLocaleDateString()} to ${new Date(formData.validUntil).toLocaleDateString()}`
                            : 'Not specified'
                        }
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText
                        primary="Description"
                        secondary={formData.description || 'No description provided'}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText
                        primary="Tags"
                        secondary={
                          formData.tags.length > 0
                            ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                  {formData.tags.map(tag => (
                                    <Chip 
                                      key={tag} 
                                      label={tag} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              )
                            : 'No tags'
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Files to Upload ({files.length})
                  </Typography>
                  
                  <List dense>
                    {files.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getFileIcon(file.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={formatBytes(file.size)}
                        />
                        <ListItemSecondaryAction>
                          {file.uploaded ? (
                            <Chip
                              size="small"
                              icon={<CheckCircleIcon />}
                              label="Uploaded"
                              color="success"
                            />
                          ) : (
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )
    }
  ];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {isEditMode ? 'Edit Document' : 'Upload Documents'}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {steps[activeStep].content}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={24} /> : <CloudUploadIcon />}
              >
                {isEditMode ? 'Update Document' : 'Upload Documents'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Document Preview
            </Typography>
            <IconButton onClick={handlePreviewClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedFile !== null && files[selectedFile] && (
            <>
              {files[selectedFile].type.includes('image') ? (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={URL.createObjectURL(files[selectedFile].file)}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 500 }}
                  />
                </Box>
              ) : files[selectedFile].type.includes('pdf') && files[selectedFile].file ? (
                <Box sx={{ height: 500 }}>
                  <iframe
                    src={URL.createObjectURL(files[selectedFile].file)}
                    width="100%"
                    height="100%"
                    title="PDF Preview"
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {getFileIcon(files[selectedFile].type)}
                  </Box>
                  <Typography variant="body1">
                    Preview not available for this file type
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {files[selectedFile].name} ({formatBytes(files[selectedFile].size)})
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentUpload;