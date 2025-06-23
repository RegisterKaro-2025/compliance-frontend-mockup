import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ComplianceProvider } from './contexts/ComplianceContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { MeetingProvider } from './contexts/MeetingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ServiceProvider>
          <ComplianceProvider>
            <MeetingProvider>
              <NotificationProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </NotificationProvider>
            </MeetingProvider>
          </ComplianceProvider>
        </ServiceProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);