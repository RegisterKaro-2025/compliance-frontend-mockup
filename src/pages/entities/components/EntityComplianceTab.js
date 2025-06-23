import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import {
  Visibility,
  Edit
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { getStatusColor } from '../utils/entityDataEnhancer';

const EntityComplianceTab = ({ entityData, complianceData, complianceTypes }) => {
  const chartData = [
    { name: 'Completed', value: entityData.keyMetrics.completedCompliances, color: '#4caf50' },
    { name: 'In Progress', value: entityData.keyMetrics.totalCompliances - entityData.keyMetrics.completedCompliances - entityData.keyMetrics.pendingCompliances, color: '#ff9800' },
    { name: 'Pending', value: entityData.keyMetrics.pendingCompliances, color: '#f44336' },
    { name: 'Overdue', value: entityData.keyMetrics.overdueCompliances, color: '#9c27b0' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Compliance Status Overview" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Compliance Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Workflow State</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complianceData.map((compliance) => {
                      const complianceType = complianceTypes.find(ct => ct.id === compliance.complianceTypeId);
                      return (
                        <TableRow key={compliance.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {complianceType?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {complianceType?.formType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={complianceType?.category} 
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={compliance.status.replace('_', ' ')} 
                              color={getStatusColor(compliance.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(compliance.dueDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {compliance.workflowState?.replace('_', ' ')}
                            </Typography>
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
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Compliance Statistics" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntityComplianceTab;