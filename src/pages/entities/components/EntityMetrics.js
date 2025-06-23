import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  MonetizationOn,
  Security
} from '@mui/icons-material';
import { formatCurrency } from '../utils/entityDataEnhancer';

const EntityMetrics = ({ entityData }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Compliance Health</Typography>
            </Box>
            <Typography variant="h3" color="primary">
              {entityData.complianceHealth.overall}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={entityData.complianceHealth.overall} 
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Last assessed: {new Date(entityData.complianceHealth.lastAssessment).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Active Compliances</Typography>
            </Box>
            <Typography variant="h3" color="success.main">
              {entityData.keyMetrics.totalCompliances}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {entityData.keyMetrics.completedCompliances} completed, {entityData.keyMetrics.pendingCompliances} pending
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MonetizationOn color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Cost Savings</Typography>
            </Box>
            <Typography variant="h3" color="warning.main">
              {formatCurrency(entityData.keyMetrics.costSavings)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This financial year
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">Risk Mitigation</Typography>
            </Box>
            <Typography variant="h3" color="info.main">
              {entityData.keyMetrics.riskMitigation}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Risk score: {entityData.complianceHealth.riskScore}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EntityMetrics;