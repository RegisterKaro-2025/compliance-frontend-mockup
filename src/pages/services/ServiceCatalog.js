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
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Recommend as RecommendIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { useService } from '../../contexts/ServiceContext';
import { useCompliance } from '../../contexts/ComplianceContext';

const ServiceCatalog = () => {
  const { serviceCatalog, subscribeToService, loading } = useService();
  const { entities } = useCompliance();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState('ALL');
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    entityId: '',
    subscriptionType: 'ANNUAL',
    billingCycle: 'ANNUAL',
    autoRenewal: true,
    customizations: {
      excludedCompliances: [],
      additionalCompliances: [],
      specialInstructions: ''
    }
  });

  const categories = ['ALL', 'MCA/ROC', 'GST', 'INCOME_TAX', 'PAYROLL'];
  const entityTypes = ['ALL', 'PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PROPRIETORSHIP'];

  const filteredServices = serviceCatalog.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    const matchesEntityType = selectedEntityType === 'ALL' || 
                             service.applicableEntityTypes.includes(selectedEntityType);
    
    return matchesSearch && matchesCategory && matchesEntityType && service.active;
  });

  const handleSubscribe = (service) => {
    setSelectedService(service);
    setSubscriptionData(prev => ({
      ...prev,
      serviceId: service.id,
      amount: service.pricing.annual
    }));
    setSubscriptionDialog(true);
  };

  const handleSubscriptionSubmit = async () => {
    try {
      await subscribeToService({
        ...subscriptionData,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      });
      setSubscriptionDialog(false);
      setSelectedService(null);
      // Show success message
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'MCA/ROC': return <BusinessIcon />;
      case 'GST': return <ReceiptIcon />;
      case 'INCOME_TAX': return <AccountBalanceIcon />;
      case 'PAYROLL': return <PeopleIcon />;
      default: return <BusinessIcon />;
    }
  };

  const ServiceCard = ({ service }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        '&:hover': { boxShadow: 6 }
      }}
    >
      {service.popular && (
        <Chip
          label="Popular"
          color="primary"
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        />
      )}
      {service.recommended && (
        <Chip
          label="Recommended"
          color="secondary"
          size="small"
          icon={<RecommendIcon />}
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pt: service.popular || service.recommended ? 5 : 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          {getCategoryIcon(service.category)}
          <Typography variant="h6" component="h3" ml={1}>
            {service.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {service.description}
        </Typography>

        <Box mb={2}>
          <Chip label={service.category} size="small" variant="outlined" />
          <Chip 
            label={`${service.applicableEntityTypes.length} Entity Types`} 
            size="small" 
            variant="outlined" 
            sx={{ ml: 1 }}
          />
        </Box>

        <Typography variant="h5" color="primary" mb={1}>
          ₹{service.pricing.annual.toLocaleString()}/year
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          ₹{service.pricing.monthly.toLocaleString()}/month
        </Typography>

        <Typography variant="subtitle2" mb={1}>Key Features:</Typography>
        <List dense>
          {service.features.slice(0, 3).map((feature, index) => (
            <ListItem key={index} sx={{ py: 0, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 20 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={feature} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
          {service.features.length > 3 && (
            <ListItem sx={{ py: 0, px: 0 }}>
              <ListItemText 
                primary={`+${service.features.length - 3} more features`}
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => handleSubscribe(service)}
          disabled={loading}
        >
          Subscribe
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Service Catalog
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Choose from our comprehensive compliance service packages designed for your business needs.
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category === 'ALL' ? 'All Categories' : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={selectedEntityType}
                  label="Entity Type"
                  onChange={(e) => setSelectedEntityType(e.target.value)}
                >
                  {entityTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type === 'ALL' ? 'All Entity Types' : type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredServices.length} services found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Service Grid */}
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <ServiceCard service={service} />
          </Grid>
        ))}
      </Grid>

      {filteredServices.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No services found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}

      {/* Subscription Dialog */}
      <Dialog 
        open={subscriptionDialog} 
        onClose={() => setSubscriptionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Subscribe to {selectedService?.name}
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                You're subscribing to {selectedService.name} for ₹{selectedService.pricing.annual.toLocaleString()}/year
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Entity</InputLabel>
                    <Select
                      value={subscriptionData.entityId}
                      label="Select Entity"
                      onChange={(e) => setSubscriptionData(prev => ({
                        ...prev,
                        entityId: e.target.value
                      }))}
                    >
                      {entities.map(entity => (
                        <MenuItem key={entity.id} value={entity.id}>
                          {entity.name} ({entity.entityType})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Subscription Type</InputLabel>
                    <Select
                      value={subscriptionData.subscriptionType}
                      label="Subscription Type"
                      onChange={(e) => setSubscriptionData(prev => ({
                        ...prev,
                        subscriptionType: e.target.value
                      }))}
                    >
                      <MenuItem value="ANNUAL">Annual</MenuItem>
                      <MenuItem value="MONTHLY">Monthly</MenuItem>
                      <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Billing Cycle</InputLabel>
                    <Select
                      value={subscriptionData.billingCycle}
                      label="Billing Cycle"
                      onChange={(e) => setSubscriptionData(prev => ({
                        ...prev,
                        billingCycle: e.target.value
                      }))}
                    >
                      <MenuItem value="ANNUAL">Annual</MenuItem>
                      <MenuItem value="MONTHLY">Monthly</MenuItem>
                      <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={subscriptionData.autoRenewal}
                        onChange={(e) => setSubscriptionData(prev => ({
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
                    value={subscriptionData.customizations.specialInstructions}
                    onChange={(e) => setSubscriptionData(prev => ({
                      ...prev,
                      customizations: {
                        ...prev.customizations,
                        specialInstructions: e.target.value
                      }
                    }))}
                    placeholder="Any special requirements or instructions..."
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" mb={2}>Service Includes:</Typography>
              <List>
                {selectedService.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubscriptionDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubscriptionSubmit}
            disabled={!subscriptionData.entityId || loading}
          >
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceCatalog;