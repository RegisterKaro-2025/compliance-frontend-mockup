import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, error, loading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Call login function from auth context
    login(formData.email, formData.password);
  };

  // Navigate to dashboard when authentication is successful
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // Sample login credentials
  const sampleCredentials = [
    { role: 'Admin', email: 'admin@registerkaro.com', password: 'admin123' },
    { role: 'Compliance Officer', email: 'officer@registerkaro.com', password: 'officer123' },
    { role: 'Entity Manager', email: 'entity@registerkaro.com', password: 'entity123' }
  ];
  
  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 70,
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            mb: 2
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography component="h1" variant="h5">
          Sign in to Compliance Module
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleInputChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Sample Login Credentials
        </Typography>
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
          {sampleCredentials.map((cred, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              <strong>{cred.role}:</strong> {cred.email} / {cred.password}
            </Typography>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Login;