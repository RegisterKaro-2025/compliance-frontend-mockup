import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  CheckCircle,
  Upload,
  CalendarToday,
  Flag,
  Assignment,
  Description,
  Person,
  Schedule,
  Notifications,
  TrendingUp
} from '@mui/icons-material';
import { getStatusColor } from '../utils/entityDataEnhancer';

const EntityActivitiesTab = ({ entityData }) => {
  // Extended activity timeline with more historical data
  const extendedActivities = [
    ...entityData.recentActivities,
    {
      id: 5,
      type: 'compliance_filed',
      title: 'Annual Return Filed',
      description: 'MGT-7 Annual Return for FY 2022-23 filed with MCA',
      timestamp: '2024-12-15T10:30:00Z',
      user: 'Amit Patel',
      status: 'completed',
      category: 'MCA'
    },
    {
      id: 6,
      type: 'document_verified',
      title: 'Financial Statements Verified',
      description: 'Audited financial statements verified and approved',
      timestamp: '2024-12-10T14:20:00Z',
      user: 'CA Sharma',
      status: 'verified',
      category: 'Finance'
    },
    {
      id: 7,
      type: 'payment_processed',
      title: 'Service Fee Payment',
      description: 'Annual compliance service fee payment processed',
      timestamp: '2024-12-05T11:45:00Z',
      user: 'System',
      status: 'completed',
      category: 'Payment'
    },
    {
      id: 8,
      type: 'notification_sent',
      title: 'Compliance Reminder',
      description: 'Reminder sent for upcoming GST return deadline',
      timestamp: '2024-12-01T09:00:00Z',
      user: 'System',
      status: 'sent',
      category: 'Notification'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'compliance_completed':
      case 'compliance_filed':
        return <CheckCircle />;
      case 'document_uploaded':
      case 'document_verified':
        return <Upload />;
      case 'meeting_scheduled':
        return <CalendarToday />;
      case 'alert_resolved':
        return <Flag />;
      case 'payment_processed':
        return <TrendingUp />;
      case 'notification_sent':
        return <Notifications />;
      default:
        return <Assignment />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'compliance_completed':
      case 'compliance_filed':
        return 'success';
      case 'document_uploaded':
      case 'document_verified':
        return 'info';
      case 'meeting_scheduled':
        return 'primary';
      case 'alert_resolved':
        return 'warning';
      case 'payment_processed':
        return 'success';
      case 'notification_sent':
        return 'primary'; // Changed from 'default' to 'primary'
      default:
        return 'primary'; // Changed from 'default' to 'primary'
    }
  };

  // Activity statistics
  const activityStats = {
    thisMonth: extendedActivities.filter(a => 
      new Date(a.timestamp).getMonth() === new Date().getMonth()
    ).length,
    thisWeek: extendedActivities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    }).length,
    byCategory: extendedActivities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Activity Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Activity Summary" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    This Week
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {activityStats.thisWeek}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    This Month
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {activityStats.thisMonth}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    By Category
                  </Typography>
                  {Object.entries(activityStats.byCategory).map(([category, count]) => (
                    <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{category}</Typography>
                      <Chip label={count} size="small" />
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Recent Activities" 
              action={
                <Button variant="outlined" size="small">
                  View All
                </Button>
              }
            />
            <CardContent>
              <List>
                {extendedActivities.slice(0, 6).map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: `${getActivityColor(activity.type)}.main` }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(activity.timestamp).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              • {activity.user}
                            </Typography>
                            <Chip 
                              label={activity.category} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
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

        {/* Activity Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Activity Timeline" />
            <CardContent>
              <Timeline>
                {extendedActivities.slice(0, 8).map((activity, index) => (
                  <TimelineItem key={activity.id}>
                    <TimelineSeparator>
                      <TimelineDot color={getActivityColor(activity.type)}>
                        {getActivityIcon(activity.type)}
                      </TimelineDot>
                      {index < extendedActivities.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" component="span">
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {activity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            label={activity.category} 
                            size="small" 
                            variant="outlined"
                          />
                          <Chip 
                            label={activity.status} 
                            color={getStatusColor(activity.status)}
                            size="small"
                          />
                          <Chip 
                            label={activity.user} 
                            size="small" 
                            icon={<Person />}
                          />
                        </Box>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Upcoming Activities" />
            <CardContent>
              <List>
                {[
                  {
                    title: 'GST Return Filing',
                    description: 'GSTR-3B for December 2024',
                    dueDate: '2025-01-20',
                    priority: 'High'
                  },
                  {
                    title: 'TDS Return Preparation',
                    description: 'Form 24Q for Q3 FY 2024-25',
                    dueDate: '2025-01-31',
                    priority: 'Medium'
                  },
                  {
                    title: 'Board Meeting',
                    description: 'Quarterly board meeting',
                    dueDate: '2025-02-15',
                    priority: 'Medium'
                  }
                ].map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <Schedule color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </Typography>
                            <Chip 
                              label={item.priority} 
                              size="small" 
                              color={item.priority === 'High' ? 'error' : 'warning'}
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

        {/* Activity Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Activity Insights" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" color="success.dark">
                      High Activity Period
                    </Typography>
                    <Typography variant="caption" color="success.dark">
                      December has been your most active month with 12 completed activities
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" color="info.dark">
                      Compliance Health
                    </Typography>
                    <Typography variant="caption" color="info.dark">
                      All critical compliance activities completed on time this quarter
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="medium" color="warning.dark">
                      Upcoming Deadlines
                    </Typography>
                    <Typography variant="caption" color="warning.dark">
                      3 important deadlines approaching in the next 30 days
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

export default EntityActivitiesTab;