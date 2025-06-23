import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const ServiceContext = createContext();

// Mock service catalog data
const mockServiceCatalog = [
  {
    id: 'service-001',
    code: 'MCA_BASIC',
    name: 'MCA Basic Compliance',
    description: 'Essential MCA filings for private limited companies including Annual Return, Financial Statements, and Director KYC',
    category: 'MCA/ROC',
    serviceType: 'COMPLIANCE_PACKAGE',
    pricing: {
      monthly: 2500,
      quarterly: 7000,
      annual: 25000,
      currency: 'INR'
    },
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
    complianceTypes: [
      'MCA_ANNUAL_RETURN',
      'MCA_FINANCIAL_STATEMENTS', 
      'DIRECTOR_KYC'
    ],
    features: [
      'Annual Return (MGT-7) filing',
      'Financial Statements (AOC-4) filing',
      'Director KYC (DIR-3) filing',
      'Document collection and verification',
      'Government portal submission',
      'Acknowledgment tracking'
    ],
    deliverables: [
      'Filed forms with SRN',
      'Government acknowledgments',
      'Compliance certificates',
      'Annual compliance calendar'
    ],
    sla: {
      documentCollection: 3, // days
      formPreparation: 5,
      filing: 2,
      acknowledgment: 1
    },
    active: true,
    popular: true,
    recommended: false
  },
  {
    id: 'service-002',
    code: 'MCA_PREMIUM',
    name: 'MCA Premium Compliance',
    description: 'Comprehensive MCA compliance with additional services including board meeting support and regulatory updates',
    category: 'MCA/ROC',
    serviceType: 'COMPLIANCE_PACKAGE',
    pricing: {
      monthly: 4000,
      quarterly: 11000,
      annual: 40000,
      currency: 'INR'
    },
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
    complianceTypes: [
      'MCA_ANNUAL_RETURN',
      'MCA_FINANCIAL_STATEMENTS',
      'DIRECTOR_KYC',
      'BOARD_MEETING_COMPLIANCE',
      'COMPANY_UPDATES'
    ],
    features: [
      'All Basic package features',
      'Board meeting minutes preparation',
      'Company update filings (INC-20A, INC-22A)',
      'Regulatory change notifications',
      'Priority support',
      'Dedicated compliance manager'
    ],
    deliverables: [
      'All Basic package deliverables',
      'Board meeting documentation',
      'Regulatory compliance reports',
      'Monthly compliance updates'
    ],
    sla: {
      documentCollection: 2,
      formPreparation: 3,
      filing: 1,
      acknowledgment: 1
    },
    active: true,
    popular: false,
    recommended: true
  },
  {
    id: 'service-003',
    code: 'GST_COMPLETE',
    name: 'GST Complete Service',
    description: 'End-to-end GST compliance including monthly returns, annual returns, and reconciliation',
    category: 'GST',
    serviceType: 'COMPLIANCE_PACKAGE',
    pricing: {
      monthly: 1500,
      quarterly: 4200,
      annual: 15000,
      currency: 'INR'
    },
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PROPRIETORSHIP'],
    complianceTypes: [
      'GST_MONTHLY_RETURN',
      'GST_ANNUAL_RETURN'
    ],
    features: [
      'Monthly GSTR-3B filing',
      'Annual GSTR-9 filing',
      'Purchase-sales reconciliation',
      'ITC optimization',
      'GST payment processing',
      'Notice handling support'
    ],
    deliverables: [
      'Monthly GST returns',
      'Annual GST return',
      'Reconciliation reports',
      'Tax payment receipts',
      'ITC analysis reports'
    ],
    sla: {
      dataCollection: 5,
      reconciliation: 3,
      filing: 2,
      acknowledgment: 1
    },
    active: true,
    popular: true,
    recommended: false
  },
  {
    id: 'service-004',
    code: 'INCOME_TAX_CORPORATE',
    name: 'Corporate Income Tax Service',
    description: 'Complete income tax compliance for companies including ITR filing and TDS returns',
    category: 'INCOME_TAX',
    serviceType: 'COMPLIANCE_PACKAGE',
    pricing: {
      monthly: 2000,
      quarterly: 5500,
      annual: 20000,
      currency: 'INR'
    },
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
    complianceTypes: [
      'INCOME_TAX_RETURN',
      'TDS_RETURN_24Q',
      'TDS_RETURN_26Q'
    ],
    features: [
      'Corporate ITR-6 filing',
      'TDS return filing (24Q, 26Q)',
      'Tax computation and planning',
      'Advance tax calculation',
      'TDS certificate generation',
      'Assessment support'
    ],
    deliverables: [
      'Filed income tax return',
      'TDS returns and certificates',
      'Tax computation statements',
      'Advance tax challans',
      'Tax planning reports'
    ],
    sla: {
      dataCollection: 7,
      taxComputation: 5,
      filing: 3,
      acknowledgment: 2
    },
    active: true,
    popular: false,
    recommended: false
  },
  {
    id: 'service-005',
    code: 'PAYROLL_COMPLIANCE',
    name: 'Payroll & Labor Compliance',
    description: 'Complete payroll compliance including PF, ESI, and labor law requirements',
    category: 'PAYROLL',
    serviceType: 'COMPLIANCE_PACKAGE',
    pricing: {
      monthly: 1200,
      quarterly: 3300,
      annual: 12000,
      currency: 'INR'
    },
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP'],
    complianceTypes: [
      'PF_MONTHLY_RETURN',
      'ESI_MONTHLY_RETURN',
      'LABOR_LAW_COMPLIANCE'
    ],
    features: [
      'Monthly PF return filing',
      'Monthly ESI return filing',
      'Salary register maintenance',
      'Statutory bonus calculation',
      'Labor law compliance tracking',
      'Employee onboarding support'
    ],
    deliverables: [
      'PF and ESI returns',
      'Salary registers',
      'Statutory compliance reports',
      'Employee benefit statements',
      'Labor law compliance certificates'
    ],
    sla: {
      dataCollection: 3,
      processing: 2,
      filing: 1,
      acknowledgment: 1
    },
    active: true,
    popular: false,
    recommended: false
  }
];

// Mock entity service subscriptions
const mockEntitySubscriptions = [
  {
    id: 'sub-001',
    entityId: 'ent-001',
    serviceId: 'service-001',
    status: 'ACTIVE',
    subscriptionType: 'ANNUAL',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2025-03-31T23:59:59Z',
    autoRenewal: true,
    billingCycle: 'ANNUAL',
    amount: 25000,
    currency: 'INR',
    customizations: {
      excludedCompliances: [],
      additionalCompliances: ['BOARD_MEETING_COMPLIANCE'],
      specialInstructions: 'Priority filing required for all submissions'
    },
    assignedManager: 'user-001',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z'
  },
  {
    id: 'sub-002',
    entityId: 'ent-001',
    serviceId: 'service-003',
    status: 'ACTIVE',
    subscriptionType: 'ANNUAL',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2025-03-31T23:59:59Z',
    autoRenewal: true,
    billingCycle: 'MONTHLY',
    amount: 1500,
    currency: 'INR',
    customizations: {
      excludedCompliances: [],
      additionalCompliances: [],
      specialInstructions: 'Monthly reconciliation reports required'
    },
    assignedManager: 'user-002',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z'
  },
  {
    id: 'sub-003',
    entityId: 'ent-002',
    serviceId: 'service-002',
    status: 'ACTIVE',
    subscriptionType: 'ANNUAL',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    autoRenewal: false,
    billingCycle: 'ANNUAL',
    amount: 40000,
    currency: 'INR',
    customizations: {
      excludedCompliances: ['COMPANY_UPDATES'],
      additionalCompliances: [],
      specialInstructions: 'Client prefers email notifications only'
    },
    assignedManager: 'user-001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock compliance applicability rules
const mockApplicabilityRules = [
  {
    id: 'rule-001',
    complianceTypeCode: 'MCA_ANNUAL_RETURN',
    applicabilityConditions: {
      entityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
      mandatoryForEntityType: true,
      thresholdCriteria: null,
      registrationRequirements: {
        requiresCIN: true,
        requiresGST: false,
        requiresPAN: true
      }
    },
    exemptions: [
      {
        condition: 'DORMANT_COMPANY',
        description: 'Dormant companies may file simplified returns'
      }
    ],
    dueDateCalculation: {
      baseDate: 'AGM_DATE',
      offsetDays: 60,
      maxDate: 'NOVEMBER_30'
    }
  },
  {
    id: 'rule-002',
    complianceTypeCode: 'GST_MONTHLY_RETURN',
    applicabilityConditions: {
      entityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PROPRIETORSHIP'],
      mandatoryForEntityType: false,
      thresholdCriteria: {
        gstRegistration: true
      },
      registrationRequirements: {
        requiresCIN: false,
        requiresGST: true,
        requiresPAN: true
      }
    },
    exemptions: [
      {
        condition: 'COMPOSITION_SCHEME',
        description: 'Composition dealers file quarterly returns'
      },
      {
        condition: 'TURNOVER_BELOW_THRESHOLD',
        description: 'Entities below ₹40 lakh turnover may be exempt'
      }
    ],
    dueDateCalculation: {
      baseDate: 'MONTH_END',
      offsetDays: 20,
      maxDate: null
    }
  },
  {
    id: 'rule-003',
    complianceTypeCode: 'DIRECTOR_KYC',
    applicabilityConditions: {
      entityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
      mandatoryForEntityType: true,
      thresholdCriteria: null,
      registrationRequirements: {
        requiresCIN: true,
        requiresGST: false,
        requiresPAN: false
      }
    },
    exemptions: [],
    dueDateCalculation: {
      baseDate: 'FIXED_DATE',
      fixedMonth: 9,
      fixedDay: 30,
      offsetDays: 0
    }
  }
];

export const ServiceProvider = ({ children }) => {
  const [serviceCatalog, setServiceCatalog] = useState(mockServiceCatalog);
  const [entitySubscriptions, setEntitySubscriptions] = useState(mockEntitySubscriptions);
  const [applicabilityRules, setApplicabilityRules] = useState(mockApplicabilityRules);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get service by ID
  const getServiceById = (serviceId) => {
    return serviceCatalog.find(service => service.id === serviceId);
  };

  // Get services by category
  const getServicesByCategory = (category) => {
    return serviceCatalog.filter(service => service.category === category && service.active);
  };

  // Get applicable services for entity
  const getApplicableServices = (entityType) => {
    return serviceCatalog.filter(service => 
      service.active && service.applicableEntityTypes.includes(entityType)
    );
  };

  // Get entity subscriptions
  const getEntitySubscriptions = (entityId) => {
    return entitySubscriptions.filter(sub => sub.entityId === entityId);
  };

  // Get active subscriptions for entity
  const getActiveSubscriptions = (entityId) => {
    return entitySubscriptions.filter(sub => 
      sub.entityId === entityId && sub.status === 'ACTIVE'
    );
  };

  // Check if entity has service subscription
  const hasServiceSubscription = (entityId, serviceId) => {
    return entitySubscriptions.some(sub => 
      sub.entityId === entityId && 
      sub.serviceId === serviceId && 
      sub.status === 'ACTIVE'
    );
  };

  // Get subscribed compliance types for entity
  const getSubscribedComplianceTypes = (entityId) => {
    const activeSubscriptions = getActiveSubscriptions(entityId);
    const complianceTypes = new Set();
    
    activeSubscriptions.forEach(subscription => {
      const service = getServiceById(subscription.serviceId);
      if (service) {
        service.complianceTypes.forEach(type => {
          if (!subscription.customizations.excludedCompliances.includes(type)) {
            complianceTypes.add(type);
          }
        });
        subscription.customizations.additionalCompliances.forEach(type => {
          complianceTypes.add(type);
        });
      }
    });
    
    return Array.from(complianceTypes);
  };

  // Calculate applicable compliances for entity
  const calculateApplicableCompliances = (entity) => {
    const applicableCompliances = [];
    
    applicabilityRules.forEach(rule => {
      const conditions = rule.applicabilityConditions;
      let isApplicable = false;
      
      // Check entity type
      if (conditions.entityTypes.includes(entity.entityType)) {
        isApplicable = true;
      }
      
      // Check threshold criteria
      if (isApplicable && conditions.thresholdCriteria) {
        if (conditions.thresholdCriteria.gstRegistration && !entity.gstRegistration) {
          isApplicable = false;
        }
      }
      
      // Check registration requirements
      if (isApplicable && conditions.registrationRequirements) {
        const reqs = conditions.registrationRequirements;
        if (reqs.requiresCIN && !entity.cin) isApplicable = false;
        if (reqs.requiresGST && !entity.gstRegistration) isApplicable = false;
        if (reqs.requiresPAN && !entity.panNumber) isApplicable = false;
      }
      
      if (isApplicable) {
        applicableCompliances.push({
          complianceTypeCode: rule.complianceTypeCode,
          mandatory: conditions.mandatoryForEntityType,
          dueDateCalculation: rule.dueDateCalculation,
          exemptions: rule.exemptions
        });
      }
    });
    
    return applicableCompliances;
  };

  // Subscribe to service
  const subscribeToService = (subscriptionData) => {
    setLoading(true);
    setError('');

    try {
      const newSubscription = {
        id: `sub-${uuidv4().substring(0, 8)}`,
        ...subscriptionData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setEntitySubscriptions(prev => [...prev, newSubscription]);
      setLoading(false);
      return newSubscription;
    } catch (err) {
      setError('Failed to create subscription');
      setLoading(false);
      throw err;
    }
  };

  // Update subscription
  const updateSubscription = (subscriptionId, updates) => {
    setLoading(true);
    setError('');

    try {
      setEntitySubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId
            ? { ...sub, ...updates, updatedAt: new Date().toISOString() }
            : sub
        )
      );
      
      setLoading(false);
      return entitySubscriptions.find(sub => sub.id === subscriptionId);
    } catch (err) {
      setError('Failed to update subscription');
      setLoading(false);
      throw err;
    }
  };

  // Cancel subscription
  const cancelSubscription = (subscriptionId, reason = '') => {
    setLoading(true);
    setError('');

    try {
      setEntitySubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId
            ? { 
                ...sub, 
                status: 'CANCELLED',
                cancellationReason: reason,
                cancelledAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : sub
        )
      );
      
      setLoading(false);
    } catch (err) {
      setError('Failed to cancel subscription');
      setLoading(false);
      throw err;
    }
  };

  // Get service recommendations for entity
  const getServiceRecommendations = (entity) => {
    const applicableServices = getApplicableServices(entity.entityType);
    const currentSubscriptions = getActiveSubscriptions(entity.id);
    const subscribedServiceIds = currentSubscriptions.map(sub => sub.serviceId);
    
    return applicableServices
      .filter(service => !subscribedServiceIds.includes(service.id))
      .sort((a, b) => {
        // Prioritize recommended services
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        // Then popular services
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        // Finally by price (ascending)
        return a.pricing.annual - b.pricing.annual;
      });
  };

  const value = {
    serviceCatalog,
    entitySubscriptions,
    applicabilityRules,
    loading,
    error,
    getServiceById,
    getServicesByCategory,
    getApplicableServices,
    getEntitySubscriptions,
    getActiveSubscriptions,
    hasServiceSubscription,
    getSubscribedComplianceTypes,
    calculateApplicableCompliances,
    subscribeToService,
    updateSubscription,
    cancelSubscription,
    getServiceRecommendations
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

// Custom hook to use the service context
export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};