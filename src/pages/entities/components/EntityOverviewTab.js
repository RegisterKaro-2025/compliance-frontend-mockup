import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CheckCircle,
  Upload,
  CalendarToday,
  Flag,
  MoreVert,
  Visibility,
  Edit
} from '@mui/icons-material';
import { getStatusColor } from '../utils/entityDataEnhancer';

const EntityOverviewTab = ({ entityData, complianceData, complianceTypes }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Compliance Health Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Compliance Health Breakdown" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Statutory</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={entityData.complianceHealth.statutory} 
                    color="success"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">{entityData.complianceHealth.statutory}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Internal</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={entityData.complianceHealth.internal} 
                    color="warning"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">{entityData.complianceHealth.internal}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Governance</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={entityData.complianceHealth.governance} 
                    color="info"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">{entityData.complianceHealth.governance}%</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Recent Activities" 
              action={
                <IconButton>
                  <MoreVert />
                </IconButton>
              }
            />
            <CardContent>
              <List dense>
                {entityData.recentActivities.slice(0, 4).map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      {activity.type === 'compliance_completed' && <CheckCircle color="success" />}
                      {activity.type === 'document_uploaded' && <Upload color="info" />}
                      {activity.type === 'meeting_scheduled' && <CalendarToday color="primary" />}
                      {activity.type === 'alert_resolved' && <Flag color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label={activity.status} 
                      color={getStatusColor(activity.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Upcoming Compliance Deadlines" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Compliance Type</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complianceData.filter(c => c.status !== 'COMPLETED').slice(0, 5).map((compliance) => {
                      const complianceType = complianceTypes.find(ct => ct.id === compliance.complianceTypeId);
                      const daysUntilDue = Math.ceil((new Date(compliance.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <TableRow key={compliance.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {complianceType?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {complianceType?.category}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(compliance.dueDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color={daysUntilDue <= 7 ? 'error' : 'text.secondary'}>
                              {daysUntilDue > 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                            </Typography>
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
                              {entityData.contactDetails.complianceOfficer.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={daysUntilDue <= 7 ? 'High' : daysUntilDue <= 30 ? 'Medium' : 'Low'} 
                              color={daysUntilDue <= 7 ? 'error' : daysUntilDue <= 30 ? 'warning' : 'info'}
                              size="small"
                              variant="outlined"
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
      </Grid>
    </Box>
  );
};

export default EntityOverviewTab;