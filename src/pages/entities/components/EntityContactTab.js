import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Edit,
  Message,
  VideoCall
} from '@mui/icons-material';

const EntityContactTab = ({ entityData }) => {
  const contacts = [
    {
      ...entityData.contactDetails.primaryContact,
      role: 'Primary Contact',
      avatar: 'R',
      color: 'primary'
    },
    {
      ...entityData.contactDetails.authorizedSignatory,
      role: 'Authorized Signatory',
      avatar: 'P',
      color: 'secondary'
    },
    {
      ...entityData.contactDetails.complianceOfficer,
      role: 'Compliance Officer (SPOC)',
      avatar: 'A',
      color: 'success'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Contact Cards */}
        {contacts.map((contact, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: `${contact.color}.main` }}>
                    {contact.avatar}
                  </Avatar>
                }
                title={contact.name}
                subheader={contact.role}
                action={
                  <IconButton>
                    <Edit />
                  </IconButton>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Designation
                    </Typography>
                    <Typography variant="body1">
                      {contact.designation}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {contact.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {contact.phone}
                      </Typography>
                    </Box>
                  </Grid>
                  {contact.mobile && contact.mobile !== contact.phone && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {contact.mobile} (Mobile)
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Email />}
                        variant="outlined"
                        href={`mailto:${contact.email}`}
                      >
                        Email
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Message />}
                        variant="outlined"
                      >
                        Chat
                      </Button>
                      {contact.spocId && (
                        <Button
                          size="small"
                          startIcon={<VideoCall />}
                          variant="contained"
                          color="success"
                        >
                          Meet
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Communication Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Communication Preferences" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Preferred Communication Method
                  </Typography>
                  <Chip label="Email" color="primary" sx={{ mr: 1 }} />
                  <Chip label="WhatsApp" color="success" variant="outlined" sx={{ mr: 1 }} />
                  <Chip label="Phone" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notification Frequency
                  </Typography>
                  <Chip label="Real-time" color="warning" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Business Hours
                  </Typography>
                  <Typography variant="body1">
                    Monday - Friday: 9:00 AM - 6:00 PM IST
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Time Zone
                  </Typography>
                  <Typography variant="body1">
                    Asia/Kolkata (UTC+5:30)
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contacts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Emergency Contacts" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        RegisterKaro Support
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        24/7 Emergency Support
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        +91 98765 00000
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        support@registerkaro.in
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Compliance Escalation
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Senior Compliance Manager
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        +91 98765 11111
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        escalation@registerkaro.in
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Communications */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Recent Communications" />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  {
                    type: 'Email',
                    subject: 'Monthly Compliance Update - November 2024',
                    from: 'Amit Patel',
                    date: '2024-12-20',
                    status: 'Read'
                  },
                  {
                    type: 'WhatsApp',
                    subject: 'Document submission reminder',
                    from: 'Amit Patel',
                    date: '2024-12-19',
                    status: 'Delivered'
                  },
                  {
                    type: 'Phone Call',
                    subject: 'Compliance review discussion',
                    from: 'Rajesh Kumar',
                    date: '2024-12-18',
                    status: 'Completed'
                  }
                ].map((comm, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {comm.type === 'Email' && <Email />}
                          {comm.type === 'WhatsApp' && <Message />}
                          {comm.type === 'Phone Call' && <Phone />}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {comm.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comm.type} • {comm.from} • {new Date(comm.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={comm.status} 
                        size="small" 
                        color={comm.status === 'Read' || comm.status === 'Completed' ? 'success' : 'default'}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntityContactTab;