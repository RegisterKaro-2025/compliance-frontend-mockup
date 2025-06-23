import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Business,
  LocationOn,
  Edit,
  Refresh,
  Print,
  Share
} from '@mui/icons-material';
import { getRiskColor } from '../utils/entityDataEnhancer';

const EntityHeader = ({ entityData, onRefresh, refreshing }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSave = () => {
    // TODO: Implement edit functionality
    setEditDialogOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
              <Business fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                {entityData.name}
              </Typography>
              <Chip 
                label={entityData.regulatoryInfo.mcaStatus} 
                color="success" 
                size="small" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`Risk: ${entityData.riskAssessment.overallRisk}`} 
                color={getRiskColor(entityData.riskAssessment.overallRisk)}
                size="small" 
                variant="outlined"
              />
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  <strong>CIN:</strong> {entityData.cin}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  <strong>GST:</strong> {entityData.gstRegistration}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  <strong>Entity Type:</strong> {entityData.entityType.replace('_', ' ')}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary">
              <LocationOn fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
              {entityData.registeredAddress}
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <IconButton onClick={onRefresh} disabled={refreshing}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print Report">
                <IconButton>
                  <Print />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton>
                  <Share />
                </IconButton>
              </Tooltip>
              <Button 
                variant="contained" 
                startIcon={<Edit />}
                onClick={handleEditClick}
              >
                Edit Entity
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Entity Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Entity Name"
                defaultValue={entityData.name}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CIN"
                defaultValue={entityData.cin}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Registration"
                defaultValue={entityData.gstRegistration}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Registered Address"
                defaultValue={entityData.registeredAddress}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Activity"
                defaultValue={entityData.businessActivity}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Incorporation Date"
                type="date"
                defaultValue={entityData.incorporationDate}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntityHeader;