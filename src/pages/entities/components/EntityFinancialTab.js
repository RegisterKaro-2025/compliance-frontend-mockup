import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Chip
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Assessment,
  MonetizationOn
} from '@mui/icons-material';
import { formatCurrency } from '../utils/entityDataEnhancer';

const EntityFinancialTab = ({ entityData }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Capital Structure */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Capital Structure" 
              avatar={<AccountBalance color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Authorized Capital
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(entityData.financialDetails.authorizedCapital)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Paid-up Capital
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(entityData.financialDetails.paidUpCapital)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Capital Utilization
                  </Typography>
                  <Typography variant="body1">
                    {((entityData.financialDetails.paidUpCapital / entityData.financialDetails.authorizedCapital) * 100).toFixed(1)}% utilized
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Financial Performance" 
              avatar={<TrendingUp color="success" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Last Audited Turnover ({entityData.financialDetails.lastFiledFY})
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(entityData.financialDetails.lastAuditedTurnover)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Current Financial Year
                  </Typography>
                  <Typography variant="body1">
                    {entityData.financialDetails.currentFY}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Last Filed Financial Year
                  </Typography>
                  <Typography variant="body1">
                    {entityData.financialDetails.lastFiledFY}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Banking Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Banking Information" 
              avatar={<AccountBalance color="info" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Primary Bank
                  </Typography>
                  <Typography variant="h6">
                    {entityData.financialDetails.bankDetails.primaryBank}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Account Number
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {entityData.financialDetails.bankDetails.accountNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    IFSC Code
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {entityData.financialDetails.bankDetails.ifscCode}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Branch
                  </Typography>
                  <Typography variant="body1">
                    {entityData.financialDetails.bankDetails.branch}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Ratios & Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Financial Analysis" 
              avatar={<Assessment color="warning" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Debt-to-Equity Ratio
                    </Typography>
                    <Chip label="0.25" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Ratio
                    </Typography>
                    <Chip label="2.1" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Return on Equity
                    </Typography>
                    <Chip label="15.2%" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Profit Margin
                    </Typography>
                    <Chip label="12.8%" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Based on last audited financial statements
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tax Information */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Tax & Regulatory Information" 
              avatar={<MonetizationOn color="error" />}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    PAN Number
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    AADCB2230M
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    TAN Number
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {entityData.regulatoryInfo.tanNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    GST Registration
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {entityData.gstRegistration}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Udyam Registration
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {entityData.regulatoryInfo.udyamRegistration}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntityFinancialTab;