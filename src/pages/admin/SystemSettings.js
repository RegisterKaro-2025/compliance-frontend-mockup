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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  FormGroup,
  Checkbox
} from '@mui/material';
import {
  Settings,
  Security,
  Notifications,
  Email,
  Sms,
  Storage,
  CloudSync,
  Api,
  Database,
  Schedule,
  Backup,
  Update,
  Monitor,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  Save,
  Refresh,
  RestoreFromTrash,
  Download,
  Upload,
  VpnKey,
  Shield,
  Lock,
  Visibility,
  VisibilityOff,
  Timer,
  Speed,
  Memory,
  NetworkCheck,
  CloudQueue,
  // Integration icon doesn't exist, using Api instead
  Webhook,
  Code,
  BugReport,
  Analytics,
  Dashboard,
  Report,
  Assignment,
  Business,
  AccountBalance,
  Receipt,
  MonetizationOn
} from '@mui/icons-material';

const SystemSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [testDialog, setTestDialog] = useState(false);
  const [backupDialog, setBackupDialog] = useState(false);

  // Mock settings data
  const mockSettings = {
    general: {
      systemName: 'RegisterKaro Compliance Portal',
      systemVersion: '2.1.0',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR',
      language: 'en',
      sessionTimeout: 30,
      maxFileSize: 50,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png']
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiry: 90
      },
      twoFactorAuth: true,
      loginAttempts: 5,
      lockoutDuration: 15,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      sslRequired: true,
      auditLogging: true
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      emailServer: {
        host: 'smtp.gmail.com',
        port: 587,
        username: 'notifications@registerkaro.in',
        password: '••••••••',
        encryption: 'TLS'
      },
      smsProvider: {
        provider: 'Twilio',
        apiKey: '••••••••',
        fromNumber: '+91XXXXXXXXXX'
      },
      templates: {
        complianceReminder: true,
        documentExpiry: true,
        taskAssignment: true,
        systemAlerts: true
      }
    },
    integrations: {
      mcaPortal: {
        enabled: true,
        apiUrl: 'https://mca.gov.in/api',
        credentials: '••••••••',
        syncInterval: 24
      },
      gstPortal: {
        enabled: true,
        apiUrl: 'https://gst.gov.in/api',
        credentials: '••••••••',
        syncInterval: 12
      },
      incomeTaxPortal: {
        enabled: true,
        apiUrl: 'https://incometax.gov.in/api',
        credentials: '••••••••',
        syncInterval: 24
      },
      pfPortal: {
        enabled: false,
        apiUrl: 'https://epfindia.gov.in/api',
        credentials: '',
        syncInterval: 24
      }
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionPeriod: 30,
      cloudStorage: {
        provider: 'AWS S3',
        bucket: 'registerkaro-backups',
        region: 'ap-south-1'
      }
    },
    performance: {
      cacheEnabled: true,
      cacheTTL: 3600,
      compressionEnabled: true,
      cdnEnabled: true,
      maxConcurrentUsers: 1000,
      apiRateLimit: 1000,
      databasePoolSize: 20
    }
  };

  useEffect(() => {
    setSettings(mockSettings);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category, parentKey, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parentKey]: {
          ...prev[category][parentKey],
          [key]: value
        }
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = (service) => {
    console.log('Testing connection for:', service);
    setTestDialog(true);
  };

  const handleBackup = () => {
    console.log('Creating backup...');
    setBackupDialog(true);
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="System Name"
          value={settings.general?.systemName || ''}
          onChange={(e) => handleSettingChange('general', 'systemName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="System Version"
          value={settings.general?.systemVersion || ''}
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={settings.general?.timezone || ''}
            label="Timezone"
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          >
            <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
            <MenuItem value="UTC">UTC</MenuItem>
            <MenuItem value="America/New_York">America/New_York</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Date Format</InputLabel>
          <Select
            value={settings.general?.dateFormat || ''}
            label="Date Format"
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
          >
            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Session Timeout (minutes)"
          type="number"
          value={settings.general?.sessionTimeout || ''}
          onChange={(e) => handleSettingChange('general', 'sessionTimeout', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Max File Size (MB)"
          type="number"
          value={settings.general?.maxFileSize || ''}
          onChange={(e) => handleSettingChange('general', 'maxFileSize', parseInt(e.target.value))}
        />
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Password Policy</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Minimum Length"
          type="number"
          value={settings.security?.passwordPolicy?.minLength || ''}
          onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Password Expiry (days)"
          type="number"
          value={settings.security?.passwordPolicy?.passwordExpiry || ''}
          onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'passwordExpiry', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.security?.passwordPolicy?.requireUppercase || false}
                onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
              />
            }
            label="Require Uppercase"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.security?.passwordPolicy?.requireLowercase || false}
                onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'requireLowercase', e.target.checked)}
              />
            }
            label="Require Lowercase"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.security?.passwordPolicy?.requireNumbers || false}
                onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
              />
            }
            label="Require Numbers"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.security?.passwordPolicy?.requireSpecialChars || false}
                onChange={(e) => handleNestedSettingChange('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
              />
            }
            label="Require Special Characters"
          />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Authentication Settings</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.security?.twoFactorAuth || false}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            />
          }
          label="Two-Factor Authentication"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.security?.auditLogging || false}
              onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
            />
          }
          label="Audit Logging"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Max Login Attempts"
          type="number"
          value={settings.security?.loginAttempts || ''}
          onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Lockout Duration (minutes)"
          type="number"
          value={settings.security?.lockoutDuration || ''}
          onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
        />
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Notification Channels</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.notifications?.emailEnabled || false}
              onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
            />
          }
          label="Email Notifications"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.notifications?.smsEnabled || false}
              onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
            />
          }
          label="SMS Notifications"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.notifications?.pushEnabled || false}
              onChange={(e) => handleSettingChange('notifications', 'pushEnabled', e.target.checked)}
            />
          }
          label="Push Notifications"
        />
      </Grid>
      
      {settings.notifications?.emailEnabled && (
        <>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Email Server Configuration</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SMTP Host"
              value={settings.notifications?.emailServer?.host || ''}
              onChange={(e) => handleNestedSettingChange('notifications', 'emailServer', 'host', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="SMTP Port"
              type="number"
              value={settings.notifications?.emailServer?.port || ''}
              onChange={(e) => handleNestedSettingChange('notifications', 'emailServer', 'port', parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              value={settings.notifications?.emailServer?.username || ''}
              onChange={(e) => handleNestedSettingChange('notifications', 'emailServer', 'username', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={settings.notifications?.emailServer?.password || ''}
              onChange={(e) => handleNestedSettingChange('notifications', 'emailServer', 'password', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button 
              variant="outlined" 
              startIcon={<NetworkCheck />}
              onClick={() => handleTestConnection('email')}
            >
              Test Email Connection
            </Button>
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Notification Templates</Typography>
      </Grid>
      <Grid item xs={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.notifications?.templates?.complianceReminder || false}
                onChange={(e) => handleNestedSettingChange('notifications', 'templates', 'complianceReminder', e.target.checked)}
              />
            }
            label="Compliance Reminder Notifications"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.notifications?.templates?.documentExpiry || false}
                onChange={(e) => handleNestedSettingChange('notifications', 'templates', 'documentExpiry', e.target.checked)}
              />
            }
            label="Document Expiry Notifications"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.notifications?.templates?.taskAssignment || false}
                onChange={(e) => handleNestedSettingChange('notifications', 'templates', 'taskAssignment', e.target.checked)}
              />
            }
            label="Task Assignment Notifications"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={settings.notifications?.templates?.systemAlerts || false}
                onChange={(e) => handleNestedSettingChange('notifications', 'templates', 'systemAlerts', e.target.checked)}
              />
            }
            label="System Alert Notifications"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );

  const renderIntegrationSettings = () => (
    <Grid container spacing={3}>
      {Object.entries(settings.integrations || {}).map(([portal, config]) => (
        <Grid item xs={12} key={portal}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {portal === 'mcaPortal' && <AccountBalance />}
                  {portal === 'gstPortal' && <Receipt />}
                  {portal === 'incomeTaxPortal' && <MonetizationOn />}
                  {portal === 'pfPortal' && <Business />}
                  <Typography variant="h6">
                    {portal.replace('Portal', '').toUpperCase()} Portal
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip 
                    label={config.enabled ? 'Enabled' : 'Disabled'}
                    color={config.enabled ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={config.enabled || false}
                        onChange={(e) => handleNestedSettingChange('integrations', portal, 'enabled', e.target.checked)}
                      />
                    }
                    label="Enable Integration"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="API URL"
                    value={config.apiUrl || ''}
                    onChange={(e) => handleNestedSettingChange('integrations', portal, 'apiUrl', e.target.value)}
                    disabled={!config.enabled}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sync Interval (hours)"
                    type="number"
                    value={config.syncInterval || ''}
                    onChange={(e) => handleNestedSettingChange('integrations', portal, 'syncInterval', parseInt(e.target.value))}
                    disabled={!config.enabled}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="API Credentials"
                    type="password"
                    value={config.credentials || ''}
                    onChange={(e) => handleNestedSettingChange('integrations', portal, 'credentials', e.target.value)}
                    disabled={!config.enabled}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button 
                    variant="outlined" 
                    startIcon={<NetworkCheck />}
                    onClick={() => handleTestConnection(portal)}
                    disabled={!config.enabled}
                  >
                    Test Connection
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );

  const renderBackupSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.backup?.autoBackup || false}
              onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
            />
          }
          label="Enable Automatic Backups"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Backup Frequency</InputLabel>
          <Select
            value={settings.backup?.backupFrequency || ''}
            label="Backup Frequency"
            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
            disabled={!settings.backup?.autoBackup}
          >
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Backup Time"
          type="time"
          value={settings.backup?.backupTime || ''}
          onChange={(e) => handleSettingChange('backup', 'backupTime', e.target.value)}
          disabled={!settings.backup?.autoBackup}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Retention Period (days)"
          type="number"
          value={settings.backup?.retentionPeriod || ''}
          onChange={(e) => handleSettingChange('backup', 'retentionPeriod', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<Backup />}
            onClick={handleBackup}
          >
            Create Backup Now
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RestoreFromTrash />}
          >
            Restore from Backup
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Download />}
          >
            Download Backup
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderPerformanceSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.performance?.cacheEnabled || false}
              onChange={(e) => handleSettingChange('performance', 'cacheEnabled', e.target.checked)}
            />
          }
          label="Enable Caching"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch 
              checked={settings.performance?.compressionEnabled || false}
              onChange={(e) => handleSettingChange('performance', 'compressionEnabled', e.target.checked)}
            />
          }
          label="Enable Compression"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Cache TTL (seconds)"
          type="number"
          value={settings.performance?.cacheTTL || ''}
          onChange={(e) => handleSettingChange('performance', 'cacheTTL', parseInt(e.target.value))}
          disabled={!settings.performance?.cacheEnabled}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="API Rate Limit (requests/hour)"
          type="number"
          value={settings.performance?.apiRateLimit || ''}
          onChange={(e) => handleSettingChange('performance', 'apiRateLimit', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Max Concurrent Users"
          type="number"
          value={settings.performance?.maxConcurrentUsers || ''}
          onChange={(e) => handleSettingChange('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Database Pool Size"
          type="number"
          value={settings.performance?.databasePoolSize || ''}
          onChange={(e) => handleSettingChange('performance', 'databasePoolSize', parseInt(e.target.value))}
        />
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: 'General', icon: <Settings />, content: renderGeneralSettings },
    { label: 'Security', icon: <Security />, content: renderSecuritySettings },
    { label: 'Notifications', icon: <Notifications />, content: renderNotificationSettings },
    { label: 'Integrations', icon: <Api />, content: renderIntegrationSettings },
    { label: 'Backup', icon: <Backup />, content: renderBackupSettings },
    { label: 'Performance', icon: <Speed />, content: renderPerformanceSettings }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Reset to Defaults
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Save />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert 
          severity={saveStatus} 
          sx={{ mb: 3 }}
          onClose={() => setSaveStatus(null)}
        >
          {saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings. Please try again.'}
        </Alert>
      )}

      {/* Settings Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabs[tabValue]?.content()}
        </Box>
      </Paper>

      {/* Test Connection Dialog */}
      <Dialog open={testDialog} onClose={() => setTestDialog(false)}>
        <DialogTitle>Connection Test</DialogTitle>
        <DialogContent>
          <Alert severity="success">
            Connection test successful! All services are responding correctly.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>Backup Created</DialogTitle>
        <DialogContent>
          <Alert severity="success">
            System backup has been created successfully. Backup ID: BKP-{Date.now()}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SystemSettings;