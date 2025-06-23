import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Edit,
  Visibility,
  Add,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { formatCurrency, getStatusColor } from '../utils/entityDataEnhancer';

const EntitySubscriptionsTab = ({ entityData, subscriptions, recommendations, getServiceById }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Active Subscriptions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Active Service Subscriptions" 
              action={
                <Button variant="contained" startIcon={<Add />}>
                  Add Service
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Subscription Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((subscription) => {
                      const service = getServiceById(subscription.serviceId);
                      return (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                                {service?.name?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {service?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {service?.description?.substring(0, 50)}...
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={service?.category} 
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {subscription.subscriptionType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(subscription.amount)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              /{subscription.billingCycle.toLowerCase()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(subscription.startDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(subscription.endDate).toLocaleDateString()}
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
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Recommendations */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Recommended Services" 
              subheader="Based on your entity type and current subscriptions"
            />
            <CardContent>
              <Grid container spacing={2}>
                {recommendations.slice(0, 4).map((service) => (
                  <Grid item xs={12} md={6} key={service.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {service.name}
                          </Typography>
                          {service.recommended && (
                            <Chip 
                              label="Recommended" 
                              color="primary" 
                              size="small"
                              icon={<Star />}
                            />
                          )}
                          {service.popular && (
                            <Chip 
                              label="Popular" 
                              color="warning" 
                              size="small"
                              icon={<TrendingUp />}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {service.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {formatCurrency(service.pricing.annual)}/year
                          </Typography>
                          <Button variant="outlined" size="small">
                            Subscribe
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Subscription Summary" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Total Active Services
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {subscriptions.length}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Cost
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(subscriptions.reduce((total, sub) => 
                      total + (sub.billingCycle === 'MONTHLY' ? sub.amount : sub.amount / 12), 0
                    ))}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Annual Cost
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(subscriptions.reduce((total, sub) => 
                      total + (sub.billingCycle === 'ANNUAL' ? sub.amount : sub.amount * 12), 0
                    ))}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Next Renewal
                  </Typography>
                  <Typography variant="body1">
                    {subscriptions.length > 0 ? 
                      new Date(Math.min(...subscriptions.map(s => new Date(s.endDate)))).toLocaleDateString() :
                      'N/A'
                    }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Features */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Subscribed Service Features" />
            <CardContent>
              <Grid container spacing={3}>
                {subscriptions.map((subscription) => {
                  const service = getServiceById(subscription.serviceId);
                  return (
                    <Grid item xs={12} md={6} key={subscription.id}>
                      <Card variant="outlined">
                        <CardHeader 
                          title={service?.name}
                          subheader={service?.category}
                          avatar={
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {service?.name?.charAt(0)}
                            </Avatar>
                          }
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Included Features:
                          </Typography>
                          <List dense>
                            {service?.features?.slice(0, 4).map((feature, index) => (
                              <ListItem key={index} sx={{ py: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircle color="success" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={feature}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                          {subscription.customizations?.excludedCompliances?.length > 0 && (
                            <>
                              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                Excluded:
                              </Typography>
                              <List dense>
                                {subscription.customizations.excludedCompliances.map((excluded, index) => (
                                  <ListItem key={index} sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                      <Cancel color="error" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={excluded}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntitySubscriptionsTab;