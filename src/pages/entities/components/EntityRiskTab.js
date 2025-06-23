import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Security,
  Warning,
  CheckCircle,
  TrendingUp,
  Assessment,
  Shield
} from '@mui/icons-material';
import { getRiskColor } from '../utils/entityDataEnhancer';

const EntityRiskTab = ({ entityData }) => {
  const riskMetrics = [
    {
      category: 'Compliance Risk',
      score: entityData.riskAssessment.complianceRisk,
      value: 15,
      description: 'Risk of non-compliance with regulatory requirements'
    },
    {
      category: 'Financial Risk',
      score: entityData.riskAssessment.financialRisk,
      value: 35,
      description: 'Risk related to financial stability and performance'
    },
    {
      category: 'Operational Risk',
      score: entityData.riskAssessment.operationalRisk,
      value: 20,
      description: 'Risk from operational processes and procedures'
    }
  ];

  const riskMitigationActions = [
    {
      id: 1,
      action: 'Automated Compliance Monitoring',
      status: 'Active',
      impact: 'High',
      description: 'Real-time monitoring of compliance deadlines and requirements'
    },
    {
      id: 2,
      action: 'Regular Financial Health Checks',
      status: 'Active',
      impact: 'Medium',
      description: 'Quarterly financial analysis and reporting'
    },
    {
      id: 3,
      action: 'Document Management System',
      status: 'Active',
      impact: 'High',
      description: 'Centralized document storage and version control'
    },
    {
      id: 4,
      action: 'Regulatory Update Notifications',
      status: 'Active',
      impact: 'Medium',
      description: 'Proactive notifications about regulatory changes'
    }
  ];

  const getScoreColor = (score) => {
    if (score <= 25) return 'success';
    if (score <= 50) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Overall Risk Assessment */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Overall Risk Score" 
              avatar={<Security color="primary" />}
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" gutterBottom>
                {((100 - entityData.keyMetrics.riskMitigation) * 0.3).toFixed(0)}
              </Typography>
              <Typography variant="h6" gutterBottom>
                out of 100
              </Typography>
              <Chip 
                label={entityData.riskAssessment.overallRisk} 
                color={getRiskColor(entityData.riskAssessment.overallRisk)}
                size="large"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Last Assessment: {new Date(entityData.complianceHealth.lastAssessment).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next Assessment: {new Date(entityData.complianceHealth.nextAssessment).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Breakdown */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Risk Category Breakdown" />
            <CardContent>
              <Grid container spacing={3}>
                {riskMetrics.map((metric, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {metric.category}
                      </Typography>
                      <Typography variant="h4" color={getScoreColor(metric.value)} gutterBottom>
                        {metric.value}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.value} 
                        color={getScoreColor(metric.value)}
                        sx={{ mb: 2 }}
                      />
                      <Chip 
                        label={metric.score} 
                        color={getRiskColor(metric.score)}
                        size="small"
                      />
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                        {metric.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Factors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Risk Factors Analysis" />
            <CardContent>
              <List>
                {entityData.riskAssessment.riskFactors.map((factor, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        bgcolor: factor.score >= 8 ? 'success.main' : factor.score >= 6 ? 'warning.main' : 'error.main',
                        width: 40,
                        height: 40
                      }}>
                        <Typography variant="body2" fontWeight="bold">
                          {factor.score}
                        </Typography>
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={factor.factor}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {factor.description}
                          </Typography>
                          <Chip 
                            label={factor.status} 
                            size="small" 
                            color={factor.status === 'Good' ? 'success' : factor.status === 'Moderate' ? 'warning' : 'error'}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Mitigation Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Risk Mitigation Actions" />
            <CardContent>
              <List>
                {riskMitigationActions.map((action) => (
                  <ListItem key={action.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <Shield />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={action.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip 
                              label={action.status} 
                              size="small" 
                              color="success"
                            />
                            <Chip 
                              label={`${action.impact} Impact`} 
                              size="small" 
                              color={action.impact === 'High' ? 'error' : 'warning'}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Trends */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Risk Trend Analysis" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      Improving
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall risk trend over the last 6 months
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Assessment color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="primary">
                      95%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk mitigation effectiveness
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Months without major incidents
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Warning color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="warning.main">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active risk alerts
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntityRiskTab;