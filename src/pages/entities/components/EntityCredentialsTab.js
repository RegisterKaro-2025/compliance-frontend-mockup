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
  IconButton,
  Button,
  Avatar
} from '@mui/material';
import {
  Download,
  Visibility,
  VerifiedUser,
  Security,
  AccountBalance,
  Receipt
} from '@mui/icons-material';
import { getStatusColor } from '../utils/entityDataEnhancer';

const EntityCredentialsTab = ({ entityData }) => {
  const getCredentialIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'certificate of incorporation':
        return <AccountBalance />;
      case 'gst registration certificate':
        return <Receipt />;
      case 'pan card':
        return <Security />;
      case 'pf registration':
        return <VerifiedUser />;
      default:
        return <Security />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Credentials Overview */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Credentials & Certificates" 
              action={
                <Button variant="outlined" startIcon={<Download />}>
                  Download All
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Type</TableCell>
                      <TableCell>Number/ID</TableCell>
                      <TableCell>Issue Date</TableCell>
                      <TableCell>Valid Until</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Issuing Authority</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entityData.credentials.map((credential) => (
                      <TableRow key={credential.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                              {getCredentialIcon(credential.type)}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {credential.type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {credential.number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(credential.issueDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {credential.validUpto ? new Date(credential.validUpto).toLocaleDateString() : 'Permanent'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={credential.status} 
                            color={getStatusColor(credential.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {credential.authority}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" title="View Document">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" title="Download">
                            <Download />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Regulatory Status Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Regulatory Status Summary" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">MCA Status</Typography>
                  <Chip 
                    label={entityData.regulatoryInfo.mcaStatus} 
                    color="success" 
                    size="small" 
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">GST Status</Typography>
                  <Chip 
                    label={entityData.regulatoryInfo.gstStatus} 
                    color="success" 
                    size="small" 
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    PF Registration
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {entityData.regulatoryInfo.pfRegistration}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    TAN Number
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {entityData.regulatoryInfo.tanNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Udyam Registration
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {entityData.regulatoryInfo.udyamRegistration}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Verification Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Document Verification Status" />
            <CardContent>
              <Grid container spacing={2}>
                {entityData.credentials.map((credential) => (
                  <Grid item xs={12} key={credential.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32, bgcolor: 'primary.light' }}>
                          {getCredentialIcon(credential.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {credential.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last verified: {new Date(credential.issueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label="Verified" 
                        color="success" 
                        size="small"
                        icon={<VerifiedUser />}
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

export default EntityCredentialsTab;