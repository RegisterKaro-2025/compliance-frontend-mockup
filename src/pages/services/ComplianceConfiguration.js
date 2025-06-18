import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useService } from '../../contexts/ServiceContext';
import { useCompliance } from '../../contexts/ComplianceContext';

const ComplianceConfiguration = () => {
  const { 
    getActiveSubscriptions, 
    getSubscribedComplianceTypes, 
    calculateApplicableCompliances,
    updateSubscription,
    loading 
  } = useService();
  const { entities, getEntityById, complianceTypes } = useCompliance();
  
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [configDialog, setConfigDialog] = useState(false);
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [entityConfig, setEntityConfig] = useState({});

  useEffect(() => {
    if (selectedEntity) {
      loadEntityConfiguration();
    }
  }, [selectedEntity]);

  const loadEntityConfiguration = () => {
    const entity = getEntityById(selectedEntity);
    if (!entity) return;

    const applicableCompliances = calculateApplicableCompliances(entity);
    const subscribedTypes = getSubscribedComplianceTypes(selectedEntity);
    const activeSubscriptions = getActiveSubscriptions(selectedEntity);

    setEntityConfig({
      entity,
      applicableCompliances,
      subscribedTypes,
      activeSubscriptions
    });
  };

  const getComplianceTypeById = (typeCode) => {
    return complianceTypes.find(type => type.code === typeCode);
  };

  const isComplianceActive = (complianceCode) => {
    return entityConfig.subscribedTypes?.includes(complianceCode);
  };

  const isComplianceMandatory = (complianceCode) => {
    const applicable = entityConfig.applicableCompliances?.find(
      comp => comp.complianceTypeCode === complianceCode
    );
    return applicable?.mandatory || false;
  };

  const handleComplianceToggle = async (complianceCode, enabled) => {
    if (!selectedEntity || isComplianceMandatory(complianceCode)) return;

    try {
      // Update subscription customizations
      const subscriptions = entityConfig.activeSubscriptions;
      for (const subscription of subscriptions) {
        const currentExcluded = subscription.customizations.excludedCompliances || [];
        const currentAdditional = subscription.customizations.additionalCompliances || [];
        
        let newExcluded = [...currentExcluded];
        let newAdditional = [...currentAdditional];

        if (enabled) {
          // Remove from excluded, add to additional if not in service
          newExcluded = newExcluded.filter(code => code !== complianceCode);
          if (!newAdditional.includes(complianceCode)) {
            newAdditional.push(complianceCode);
          }
        } else {
          // Add to excluded, remove from additional
          if (!newExcluded.includes(complianceCode)) {
            newExcluded.push(complianceCode);
          }
          newAdditional = newAdditional.filter(code => code !== complianceCode);
        }

        await updateSubscription(subscription.id, {
          customizations: {
            ...subscription.customizations,
            excludedCompliances: newExcluded,
            additionalCompliances: newAdditional
          }
        });
      }

      loadEntityConfiguration();
    } catch (error) {
      console.error('Failed to update compliance configuration:', error);
    }
  };

  const ComplianceConfigurationTable = () => {
    if (!entityConfig.entity) return null;

    const allCompliances = entityConfig.applicableCompliances || [];
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Compliance Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Mandatory</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allCompliances.map((compliance) => {
              const complianceType = getComplianceTypeById(compliance.complianceTypeCode);
              if (!complianceType) return null;

              const isActive = isComplianceActive(compliance.complianceTypeCode);
              const isMandatory = compliance.mandatory;

              return (
                <TableRow key={compliance.complianceTypeCode}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {complianceType.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {complianceType.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={complianceType.category} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {complianceType.periodicityRules?.frequency || 'YEARLY'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isMandatory ? (
                      <Chip label="Mandatory" color="error" size="small" />
                    ) : (
                      <Chip label="Optional" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {isMandatory ? (
                      <CheckCircleIcon color="error" fontSize="small" />
                    ) : (
                      <InfoIcon color="action" fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={isActive}
                      onChange={(e) => handleComplianceToggle(
                        compliance.complianceTypeCode, 
                        e.target.checked
                      )}
                      disabled={isMandatory || loading}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedCompliance(complianceType);
                        setConfigDialog(true);
                      }}
                    >
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const EntityConfigurationWizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    
    const steps = [
      'Select Entity',
      'Review Applicable Compliances',
      'Configure Services',
      'Finalize Setup'
    ];

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" mb={3}>
            Entity Configuration Wizard
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Select Entity</StepLabel>
              <StepContent>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Entity</InputLabel>
                  <Select
                    value={selectedEntity}
                    label="Select Entity"
                    onChange={(e) => setSelectedEntity(e.target.value)}
                  >
                    {entities.map(entity => (
                      <MenuItem key={entity.id} value={entity.id}>
                        {entity.name} ({entity.entityType})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(1)}
                  disabled={!selectedEntity}
                >
                  Continue
                </Button>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Review Applicable Compliances</StepLabel>
              <StepContent>
                {entityConfig.applicableCompliances && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Based on your entity type and registrations, {entityConfig.applicableCompliances.length} compliance types are applicable.
                    </Alert>
                    <List>
                      {entityConfig.applicableCompliances.slice(0, 3).map((compliance) => {
                        const complianceType = getComplianceTypeById(compliance.complianceTypeCode);
                        return (
                          <ListItem key={compliance.complianceTypeCode}>
                            <ListItemIcon>
                              {compliance.mandatory ? (
                                <CheckCircleIcon color="error" />
                              ) : (
                                <InfoIcon color="action" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={complianceType?.name}
                              secondary={compliance.mandatory ? 'Mandatory' : 'Optional'}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(2)}
                      sx={{ mt: 2 }}
                    >
                      Continue
                    </Button>
                  </Box>
                )}
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Configure Services</StepLabel>
              <StepContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Subscribe to service packages to activate compliance management.
                </Alert>
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = '/services/catalog'}
                  sx={{ mr: 2 }}
                >
                  Browse Services
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(3)}
                >
                  Skip for Now
                </Button>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Finalize Setup</StepLabel>
              <StepContent>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Configuration complete! You can now manage compliance for this entity.
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(0)}
                >
                  Configure Another Entity
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Compliance Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Configure compliance requirements and service settings for your entities.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <EntityConfigurationWizard />
        </Grid>

        <Grid item xs={12} lg={8}>
          {selectedEntity ? (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">
                    Compliance Configuration - {entityConfig.entity?.name}
                  </Typography>
                  <Chip 
                    label={entityConfig.entity?.entityType} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab label="Applicable Compliances" />
                    <Tab label="Active Subscriptions" />
                    <Tab label="Configuration Summary" />
                  </Tabs>
                </Box>

                {selectedTab === 0 && <ComplianceConfigurationTable />}

                {selectedTab === 1 && (
                  <Box>
                    {entityConfig.activeSubscriptions?.length > 0 ? (
                      <List>
                        {entityConfig.activeSubscriptions.map((subscription) => (
                          <ListItem key={subscription.id}>
                            <ListItemIcon>
                              <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={subscription.serviceId}
                              secondary={`₹${subscription.amount.toLocaleString()}/${subscription.billingCycle.toLowerCase()}`}
                            />
                            <ListItemSecondaryAction>
                              <Chip label={subscription.status} color="success" size="small" />
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Alert severity="info">
                        No active subscriptions found. Subscribe to services to enable compliance management.
                      </Alert>
                    )}
                  </Box>
                )}

                {selectedTab === 2 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" color="primary">
                              {entityConfig.applicableCompliances?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Applicable Compliances
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" color="success.main">
                              {entityConfig.subscribedTypes?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Active Compliances
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" color="warning.main">
                              {entityConfig.activeSubscriptions?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Active Subscriptions
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box textAlign="center" py={8}>
                  <SettingsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    Select an Entity to Configure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose an entity from the wizard to configure its compliance requirements.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Compliance Details Dialog */}
      <Dialog 
        open={configDialog} 
        onClose={() => setConfigDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure {selectedCompliance?.name}
        </DialogTitle>
        <DialogContent>
          {selectedCompliance && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                {selectedCompliance.description}
              </Alert>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Required Documents</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedCompliance.requiredDocuments?.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary={doc} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Deliverables</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedCompliance.deliverables?.map((deliverable, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={deliverable} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComplianceConfiguration;