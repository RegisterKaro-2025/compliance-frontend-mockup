import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Typography, Box, Container, Paper } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import EntityDashboard from './pages/dashboard/EntityDashboard';
import ComplianceOfficerDashboard from './pages/dashboard/ComplianceOfficerDashboard';
import ManagementDashboard from './pages/dashboard/ManagementDashboard';

// Compliance Pages
import ComplianceCalendar from './pages/compliance/ComplianceCalendar';
import ComplianceList from './pages/compliance/ComplianceList';
import ComplianceDetails from './pages/compliance/ComplianceDetails';
import ComplianceForm from './pages/compliance/ComplianceForm';

// Document Pages
import DocumentList from './pages/documents/DocumentList';
import DocumentDetails from './pages/documents/DocumentDetails';
import DocumentUpload from './pages/documents/DocumentUpload';
import DocumentVerification from './pages/documents/DocumentVerification';
import TemplateManagement from './pages/documents/TemplateManagement';

// Reports Pages
import ReportsList from './pages/reports/ReportsList';
import ReportBuilder from './pages/reports/ReportBuilder';
import ReportViewer from './pages/reports/ReportViewer';

// Portal Integration Pages
import PortalIntegrations from './pages/portals/PortalIntegrations';
import PortalSubmissions from './pages/portals/PortalSubmissions';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';
import ClientCredentialManagement from './pages/admin/ClientCredentialManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Service Pages
import ServiceCatalog from './pages/services/ServiceCatalog';
import SubscriptionManagement from './pages/services/SubscriptionManagement';
import ComplianceConfiguration from './pages/services/ComplianceConfiguration';
import BillingDashboard from './pages/services/BillingDashboard';

// Placeholder component for missing pages
const PlaceholderPage = ({ title }) => (
  <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title || 'Page Under Construction'}
      </Typography>
      <Typography variant="body1">
        This page is currently being developed and will be available soon.
      </Typography>
    </Paper>
  </Container>
);

// Placeholder components for missing pages
const ForgotPassword = () => <PlaceholderPage title="Forgot Password" />;
const SubmissionDetails = () => <PlaceholderPage title="Submission Details" />;
const RoleManagement = () => <PlaceholderPage title="Role Management" />;
const NotFound = () => <PlaceholderPage title="404 - Page Not Found" />;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/entity/:entityId" element={<EntityDashboard />} />
          <Route path="/dashboard/compliance-officer" element={<ComplianceOfficerDashboard />} />
          <Route path="/dashboard/management" element={<ManagementDashboard />} />
          
          {/* Compliance */}
          <Route path="/compliance" element={<ComplianceList />} />
          <Route path="/compliance/calendar" element={<ComplianceCalendar />} />
          <Route path="/compliance/:complianceId" element={<ComplianceDetails />} />
          <Route path="/compliance/create" element={<ComplianceForm />} />
          <Route path="/compliance/edit/:complianceId" element={<ComplianceForm />} />
          
          {/* Documents */}
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/documents/:documentId" element={<DocumentDetails />} />
          <Route path="/documents/upload" element={<DocumentUpload />} />
          <Route path="/documents/upload/:id" element={<DocumentUpload />} />
          <Route path="/documents/verification/:id" element={<DocumentVerification />} />
          <Route path="/documents/templates" element={<TemplateManagement />} />
          
          {/* Reports */}
          <Route path="/reports" element={<ReportsList />} />
          <Route path="/reports/builder" element={<ReportBuilder />} />
          <Route path="/reports/:reportId" element={<ReportViewer />} />
          
          {/* Portal Integrations */}
          <Route path="/portals" element={<PortalIntegrations />} />
          <Route path="/portals/submissions" element={<PortalSubmissions />} />
          <Route path="/portals/submissions/:submissionId" element={<SubmissionDetails />} />
          
          {/* Services */}
          <Route path="/services/catalog" element={<ServiceCatalog />} />
          <Route path="/services/subscriptions" element={<SubscriptionManagement />} />
          <Route path="/services/configuration" element={<ComplianceConfiguration />} />
          <Route path="/services/billing" element={<BillingDashboard />} />
          
          {/* Admin */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/roles" element={<RoleManagement />} />
          <Route path="/admin/credentials" element={<ClientCredentialManagement />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;