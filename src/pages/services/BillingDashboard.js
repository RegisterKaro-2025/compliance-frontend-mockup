import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
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
  LinearProgress,
  Tabs,
  Tab,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List
} from '@mui/material';
import {
  Receipt as BillingIcon,
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  AccountBalance as BankIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { useService } from '../../contexts/ServiceContext';

const BillingDashboard = () => {
  const { entitySubscriptions } = useService();
  const [selectedTab, setSelectedTab] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock billing data
  const [billingData, setBillingData] = useState({
    overview: {
      totalDue: 45000,
      nextPaymentDate: '2025-01-15',
      monthlySpend: 15000,
      yearlySpend: 180000,
      activeSubscriptions: 3,
      pendingInvoices: 2
    },
    invoices: [
      {
        id: 'INV-2025-001',
        subscriptionId: 'sub-001',
        serviceName: 'MCA Premium Package',
        amount: 25000,
        dueDate: '2025-01-15',
        status: 'pending',
        issueDate: '2024-12-15',
        items: [
          { description: 'MCA Premium Package - Monthly', quantity: 1, rate: 20000, amount: 20000 },
          { description: 'Additional Entity Setup', quantity: 2, rate: 2500, amount: 5000 }
        ]
      },
      {
        id: 'INV-2025-002',
        subscriptionId: 'sub-002',
        serviceName: 'GST Complete Package',
        amount: 20000,
        dueDate: '2025-01-20',
        status: 'pending',
        issueDate: '2024-12-20',
        items: [
          { description: 'GST Complete Package - Monthly', quantity: 1, rate: 18000, amount: 18000 },
          { description: 'GST Filing Support', quantity: 1, rate: 2000, amount: 2000 }
        ]
      },
      {
        id: 'INV-2024-012',
        subscriptionId: 'sub-001',
        serviceName: 'MCA Premium Package',
        amount: 25000,
        dueDate: '2024-12-15',
        status: 'paid',
        issueDate: '2024-11-15',
        paidDate: '2024-12-10',
        items: [
          { description: 'MCA Premium Package - Monthly', quantity: 1, rate: 25000, amount: 25000 }
        ]
      }
    ],
    paymentMethods: [
      {
        id: 'pm-001',
        type: 'bank_transfer',
        name: 'HDFC Bank - ****1234',
        isDefault: true,
        status: 'active'
      },
      {
        id: 'pm-002',
        type: 'credit_card',
        name: 'Visa - ****5678',
        isDefault: false,
        status: 'active'
      }
    ],
    paymentHistory: [
      {
        id: 'pay-001',
        invoiceId: 'INV-2024-012',
        amount: 25000,
        date: '2024-12-10',
        method: 'Bank Transfer',
        status: 'completed',
        transactionId: 'TXN-2024-001'
      },
      {
        id: 'pay-002',
        invoiceId: 'INV-2024-011',
        amount: 20000,
        date: '2024-11-10',
        method: 'Credit Card',
        status: 'completed',
        transactionId: 'TXN-2024-002'
      }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      // Update invoice status
      setBillingData(prev => ({
        ...prev,
        invoices: prev.invoices.map(inv => 
          inv.id === selectedInvoice.id 
            ? { ...inv, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
            : inv
        )
      }));
      setLoading(false);
      setPaymentDialogOpen(false);
      setSelectedInvoice(null);
      setPaymentMethod('');
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`billing-tabpanel-${index}`}
      aria-labelledby={`billing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Billing & Payments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your subscription billing, invoices, and payment methods
        </Typography>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {formatCurrency(billingData.overview.totalDue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Due
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Next payment: {billingData.overview.nextPaymentDate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {formatCurrency(billingData.overview.monthlySpend)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Spend
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                +12% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {billingData.overview.activeSubscriptions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Subscriptions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                All services running
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {billingData.overview.pendingInvoices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Invoices
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="warning.main">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Invoices" />
            <Tab label="Payment History" />
            <Tab label="Payment Methods" />
            <Tab label="Subscription Billing" />
          </Tabs>
        </Box>

        {/* Invoices Tab */}
        <TabPanel value={selectedTab} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingData.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.serviceName}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={invoice.status.toUpperCase()} 
                        color={getStatusColor(invoice.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => {}}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => {}}>
                        <DownloadIcon />
                      </IconButton>
                      {invoice.status === 'pending' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handlePayInvoice(invoice)}
                          sx={{ ml: 1 }}
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Payment History Tab */}
        <TabPanel value={selectedTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingData.paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.invoiceId}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status.toUpperCase()} 
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{payment.transactionId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Payment Methods Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Grid container spacing={3}>
            {billingData.paymentMethods.map((method) => (
              <Grid item xs={12} md={6} key={method.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {method.type === 'bank_transfer' ? <BankIcon /> : <CardIcon />}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{method.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.type === 'bank_transfer' ? 'Bank Transfer' : 'Credit Card'}
                        </Typography>
                      </Box>
                      {method.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ border: '2px dashed', borderColor: 'grey.300' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <PaymentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Add Payment Method
                  </Typography>
                  <Button variant="contained" color="primary">
                    Add New Method
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Subscription Billing Tab */}
        <TabPanel value={selectedTab} index={3}>
          <List>
            {entitySubscriptions.map((subscription) => (
              <ListItem key={subscription.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <BillingIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={subscription.serviceName}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Entity: {subscription.entityName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Billing Cycle: {subscription.billingCycle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Next Billing: {subscription.nextBillingDate}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(subscription.monthlyPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per month
                  </Typography>
                  <Chip 
                    label={subscription.status.toUpperCase()} 
                    color={subscription.status === 'active' ? 'success' : 'default'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Pay Invoice {selectedInvoice?.id}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {formatCurrency(selectedInvoice.amount)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedInvoice.serviceName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due: {selectedInvoice.dueDate}
              </Typography>
            </Box>
          )}
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              {billingData.paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  {method.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Processing payment...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handlePaymentSubmit} 
            variant="contained" 
            disabled={!paymentMethod || loading}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BillingDashboard;