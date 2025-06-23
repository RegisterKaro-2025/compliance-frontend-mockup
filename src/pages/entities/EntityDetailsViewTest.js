import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { useParams } from 'react-router-dom';

const EntityDetailsViewTest = () => {
  const { entityId } = useParams();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Entity Details Test Page
        </Typography>
        <Typography variant="h6" color="primary">
          Entity ID: {entityId}
        </Typography>
      </Paper>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🎉 Success!
          </Typography>
          <Typography variant="body1" paragraph>
            The EntityDetailsView route is working correctly. You have successfully navigated to the entity details page.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is a simplified test version to verify routing functionality.
            The full EntityDetailsView with all tabs and features is available in the main component.
          </Typography>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Navigation Instructions:
            </Typography>
            <Typography variant="body2">
              • URL Pattern: <code>/entities/:entityId/details</code>
            </Typography>
            <Typography variant="body2">
              • Current URL: <code>/entities/{entityId}/details</code>
            </Typography>
            <Typography variant="body2">
              • Try different entity IDs: 1, 2, ent-001, ent-002
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EntityDetailsViewTest;