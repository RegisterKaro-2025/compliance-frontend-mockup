import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, CssBaseline } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <CssBaseline />
      
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 3,
          bgcolor: 'background.paper',
          boxShadow: 1
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" align="center" color="primary">
            RegisterKaro Compliance Module
          </Typography>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container 
        component="main" 
        maxWidth="sm" 
        sx={{ 
          mt: 8, 
          mb: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          flexGrow: 1
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2
          }}
        >
          <Outlet />
        </Paper>
      </Container>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} RegisterKaro. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;