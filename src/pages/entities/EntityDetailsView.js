import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompliance } from '../../contexts/ComplianceContext';
import { useService } from '../../contexts/ServiceContext';
import EntityHeader from './components/EntityHeader';
import EntityMetrics from './components/EntityMetrics';
import EntityOverviewTab from './components/EntityOverviewTab';
import EntityComplianceTab from './components/EntityComplianceTab';
import EntityCredentialsTab from './components/EntityCredentialsTab';
import EntityFinancialTab from './components/EntityFinancialTab';
import EntityContactTab from './components/EntityContactTab';
import EntitySubscriptionsTab from './components/EntitySubscriptionsTab';
import EntityRiskTab from './components/EntityRiskTab';
import EntityActivitiesTab from './components/EntityActivitiesTab';
import { enhanceEntityData } from './utils/entityDataEnhancer';

// Add comprehensive logging for debugging
const log = (message, data = null) => {
  console.log(`[EntityDetailsView] ${message}`, data || '');
};

const EntityDetailsView = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced debug logging
  useEffect(() => {
    log('--- EntityDetailsView MOUNTED ---');
    log('entityId param:', entityId);
    log('window.location.href:', window.location.href);
    log('navigate function type:', typeof navigate);
  }, [entityId, navigate]);

  // Context hooks
  const {
    getEntityById,
    getCompliancesByEntity,
    getComplianceStats,
    getUpcomingCompliances,
    getOverdueCompliances,
    complianceTypes,
    entities
  } = useCompliance();

  const {
    getActiveSubscriptions,
    getServiceById,
    getServiceRecommendations
  } = useService();

  // Extra debug: log context and entity lookup
  useEffect(() => {
    log('useCompliance context entities:', entities);
    log('getEntityById function:', typeof getEntityById);
    if (getEntityById && entityId) {
      const found = getEntityById(entityId);
      log('getEntityById(entityId) result:', found);
    }
  }, [entities, getEntityById, entityId]);

  // State for entity data
  const [entityData, setEntityData] = useState(null);
  const [complianceData, setComplianceData] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    log('useEffect triggered with entityId:', entityId);
    if (entityId) {
      loadEntityData();
    } else {
      log('No entityId provided, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [entityId, navigate]);

  const loadEntityData = async () => {
    log('Loading entity data for ID:', entityId);
    setLoading(true);
    try {
      // Get entity details
      const entity = getEntityById(entityId);
      log('Entity found:', entity ? 'Yes' : 'No');
      
      if (!entity) {
        log('Entity not found, setting error state');
        console.error(`Entity not found for ID: ${entityId}`);
        setEntityData(null);
        setLoading(false);
        return;
      }

      // Get compliance data
      log('Getting compliance data for entity:', entityId);
      const entityCompliances = getCompliancesByEntity(entityId);
      const stats = getComplianceStats(entityId);
      const upcoming = getUpcomingCompliances().filter(c => c.entityId === entityId);
      const overdue = getOverdueCompliances().filter(c => c.entityId === entityId);

      // Get service subscriptions
      log('Getting service subscriptions for entity:', entityId);
      const activeSubscriptions = getActiveSubscriptions(entityId);
      const serviceRecommendations = getServiceRecommendations(entity);

      // Enhanced entity data with additional information
      log('Enhancing entity data');
      const enhancedEntity = enhanceEntityData(entity, stats);

      log('Setting entity data - Enhanced entity:', enhancedEntity.name);
      setEntityData(enhancedEntity);
      setComplianceData(entityCompliances);
      setSubscriptions(activeSubscriptions);
      setRecommendations(serviceRecommendations);
      
    } catch (error) {
      log('Error loading entity data:', error);
      console.error('Error loading entity data:', error);
      setEntityData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEntityData();
    setRefreshing(false);
  };

  if (loading) {
    log('Rendering loading state');
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading entity details...</Typography>
      </Container>
    );
  }

  if (!entityData) {
    log('Rendering no entity data state');
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Entity not found</Alert>
      </Container>
    );
  }

  log('Rendering entity details for:', entityData.name);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Entity Header */}
      <EntityHeader 
        entityData={entityData}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Key Metrics Overview */}
      <EntityMetrics entityData={entityData} />

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Compliance Status" />
          <Tab label="Credentials & Certificates" />
          <Tab label="Financial Details" />
          <Tab label="Contact Information" />
          <Tab label="Service Subscriptions" />
          <Tab label="Risk Assessment" />
          <Tab label="Activities & Timeline" />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <EntityOverviewTab 
            entityData={entityData}
            complianceData={complianceData}
            complianceTypes={complianceTypes}
          />
        )}

        {tabValue === 1 && (
          <EntityComplianceTab 
            entityData={entityData}
            complianceData={complianceData}
            complianceTypes={complianceTypes}
          />
        )}

        {tabValue === 2 && (
          <EntityCredentialsTab 
            entityData={entityData}
          />
        )}

        {tabValue === 3 && (
          <EntityFinancialTab 
            entityData={entityData}
          />
        )}

        {tabValue === 4 && (
          <EntityContactTab 
            entityData={entityData}
          />
        )}

        {tabValue === 5 && (
          <EntitySubscriptionsTab 
            entityData={entityData}
            subscriptions={subscriptions}
            recommendations={recommendations}
            getServiceById={getServiceById}
          />
        )}

        {tabValue === 6 && (
          <EntityRiskTab 
            entityData={entityData}
          />
        )}

        {tabValue === 7 && (
          <EntityActivitiesTab 
            entityData={entityData}
          />
        )}
      </Paper>
    </Container>
  );
};

export default EntityDetailsView;