import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Menu,
  Tabs,
  Tab
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useService } from '../../contexts/ServiceContext';
import { useCompliance } from '../../contexts/ComplianceContext';

const SubscriptionManagement = () => {
  const { 
    entitySubscriptions, 
    serviceCatalog, 
    getServiceById, 
    updateSubscription, 
    cancelSubscription,
    loading 
  } = useService();
  const { entities, getEntityById } = useCompliance();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editData, setEditData] = useState({});
  const [cancelReason, setCancelReason] = useState('');

  const activeSubscriptions = entitySubscriptions.filter(sub => sub.status === 'ACTIVE');
  const inactiveSubscriptions = entitySubscriptions.filter(sub => sub.status !== 'ACTIVE');

  const handleMenuOpen = (event, subscription) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubscription(subscription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubscription(null);
  };

  const handleEdit = () => {
    setEditData(selectedSubscription);
    setEditDialog(true);
    handleMenuClose();
  };

  const handleCancelSubscription = () => {
    setCancelDialog(true);
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      await updateSubscription(selectedSubscription.id, editData);
      setEditDialog(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancelSubmit = async () => {
    try {
      await cancelSubscription(selectedSubscription.id, cancelReason);
      setCancelDialog(false);
      setSelectedSubscription(null);
      setCancelReason('');
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'CANCELLED': return 'error';
      case 'SUSPENDED': return 'warning';
      case 'EXPIRED': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const SubscriptionCard = ({ subscription }) => {
    const service = getServiceById(subscription.serviceId);
    const entity = getEntityById(subscription.entityId);
    
    if (!service || !entity) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" component="h3">
                {service.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entity.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                label={subscription.status} 
                color={getStatusColor(subscription.status)}
                size="small"
              />
              <IconButton 
                size="small"
                onClick={(e) => handleMenuOpen(e, subscription)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" ml={1}>
                  ₹{subscription.amount.toLocaleString()}/{subscription.billingCycle.toLowerCase()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" ml={1}>
                  {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <RefreshIcon fontSize="small" color="action" />
                <Typography variant="body2" ml={1}>
                  Auto-renewal: {subscription.autoRenewal ? 'Yes' : 'No'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box display="flex" alignItems="center" mb={1}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography variant="body2" ml={1}>
                  {service.category}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {subscription.customizations.specialInstructions && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Special Instructions: {subscription.customizations.specialInstructions}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const SubscriptionTable = ({ subscriptions }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Period</TableCell>
            <TableCell>Auto-Renewal</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions.map((subscription) => {
            const service = getServiceById(subscription.serviceId);
            const entity = getEntityById(subscription.entityId);
            
            if (!service || !entity) return null;

            return (
              <TableRow key={subscription.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {service.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {service.category}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {entity.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {entity.entityType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={subscription.status} 
                    color={getStatusColor(subscription.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  ₹{subscription.amount.toLocaleString()}/{subscription.billingCycle.toLowerCase()}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(subscription.startDate)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    to {formatDate(subscription.endDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {subscription.autoRenewal ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <WarningIcon color="warning" fontSize="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small"
                    onClick={(e) => handleMenuOpen(e, subscription)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Manage your service subscriptions, billing, and renewals.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label={`Active Subscriptions (${activeSubscriptions.length})`} />
          <Tab label={`Inactive Subscriptions (${inactiveSubscriptions.length})`} />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <Box>
          {activeSubscriptions.length === 0 ? (
            <Alert severity="info">
              No active subscriptions found. Visit the Service Catalog to subscribe to services.
            </Alert>
          ) : (
            <Box>
              {activeSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          {inactiveSubscriptions.length === 0 ? (
            <Alert severity="info">
              No inactive subscriptions found.
            </Alert>
          ) : (
            <SubscriptionTable subscriptions={inactiveSubscriptions} />
          )}
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Subscription</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCancelSubscription}>
          <ListItemIcon>
            <CancelIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cancel Subscription</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Subscription</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Billing Cycle</InputLabel>
                    <Select
                      value={editData.billingCycle || selectedSubscription.billingCycle}
                      label="Billing Cycle"
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        billingCycle: e.target.value
                      }))}
                    >
                      <MenuItem value="MONTHLY">Monthly</MenuItem>
                      <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                      <MenuItem value="ANNUAL">Annual</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editData.autoRenewal !== undefined ? editData.autoRenewal : selectedSubscription.autoRenewal}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          autoRenewal: e.target.checked
                        }))}
                      />
                    }
                    label="Auto-renewal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Special Instructions"
                    multiline
                    rows={3}
                    value={editData.customizations?.specialInstructions || selectedSubscription.customizations?.specialInstructions || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      customizations: {
                        ...prev.customizations,
                        specialInstructions: e.target.value
                      }
                    }))}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit} disabled={loading}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog 
        open={cancelDialog} 
        onClose={() => setCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Are you sure you want to cancel this subscription? This action cannot be undone.
          </Alert>
          <TextField
            fullWidth
            label="Reason for Cancellation"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please provide a reason for cancellation..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Keep Subscription</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleCancelSubmit}
            disabled={!cancelReason.trim() || loading}
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionManagement;