# Database Schema Extensions for Compliance Integration

## Overview

This document details the specific database schema extensions required to integrate compliance functionality into the existing customer portal backend. All extensions follow the established patterns from the current system.

## Model Extensions

### 1. ComplianceService Model

```javascript
const ComplianceServiceSchema = new mongoose.Schema({
  // Core references - linking to existing models
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: [true, 'Entity ID is required'],
    index: true
  },
  customerServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerService',
    required: [true, 'Customer Service ID is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Compliance service identification
  complianceServiceNumber: {
    type: String,
    required: [true, 'Compliance service number is required'],
    trim: true,
    unique: true
  },
  complianceType: {
    type: String,
    required: [true, 'Compliance type is required'],
    enum: [
      'GST_FILING',
      'INCOME_TAX_FILING',
      'ROC_COMPLIANCE',
      'LABOR_COMPLIANCE',
      'ENVIRONMENTAL_COMPLIANCE',
      'FEMA_COMPLIANCE',
      'SEBI_COMPLIANCE',
      'RBI_COMPLIANCE',
      'STATUTORY_AUDIT',
      'INTERNAL_AUDIT',
      'TAX_AUDIT',
      'ANNUAL_RETURN',
      'BOARD_RESOLUTION',
      'REGULATORY_FILING',
      'OTHER'
    ],
    index: true
  },
  complianceCategory: {
    type: String,
    required: [true, 'Compliance category is required'],
    enum: [
      'PERIODIC_FILING',
      'ANNUAL_COMPLIANCE',
      'EVENT_BASED',
      'REGULATORY_RESPONSE',
      'AUDIT_COMPLIANCE',
      'STATUTORY_REQUIREMENT',
      'VOLUNTARY_COMPLIANCE'
    ],
    index: true
  },

  // Compliance details
  complianceName: {
    type: String,
    required: [true, 'Compliance name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  regulatoryAuthority: {
    type: String,
    required: [true, 'Regulatory authority is required'],
    enum: [
      'GST_DEPARTMENT',
      'INCOME_TAX_DEPARTMENT',
      'MCA',
      'SEBI',
      'RBI',
      'LABOR_DEPARTMENT',
      'POLLUTION_CONTROL_BOARD',
      'FEMA',
      'CUSTOMS',
      'EXCISE',
      'SERVICE_TAX',
      'STATE_GOVERNMENT',
      'CENTRAL_GOVERNMENT',
      'OTHER'
    ],
    index: true
  },

  // Due dates and penalties
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    index: true
  },
  extendedDueDate: {
    type: Date
  },
  penaltyDate: {
    type: Date,
    index: true
  },
  penaltyStructure: {
    basePenalty: {
      type: Number,
      default: 0
    },
    dailyPenalty: {
      type: Number,
      default: 0
    },
    maxPenalty: {
      type: Number,
      default: 0
    },
    penaltyCalculationMethod: {
      type: String,
      enum: ['FIXED', 'PERCENTAGE', 'DAILY', 'COMPOUND'],
      default: 'FIXED'
    }
  },

  // Recurring compliance
  isRecurring: {
    type: Boolean,
    default: false,
    index: true
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'CUSTOM']
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    nextDueDate: Date
  },

  // Status and workflow
  status: {
    type: String,
    enum: [
      'SCHEDULED',
      'IN_PREPARATION',
      'UNDER_REVIEW',
      'READY_TO_FILE',
      'FILED',
      'ACKNOWLEDGED',
      'REJECTED',
      'COMPLETED',
      'OVERDUE',
      'CANCELLED'
    ],
    default: 'SCHEDULED',
    index: true
  },
  currentStageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceStage'
  },

  // Filing details
  filingDetails: {
    filingMethod: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'HYBRID']
    },
    filingReference: String,
    filingDate: Date,
    acknowledgmentNumber: String,
    acknowledgmentDate: Date
  },

  // Government portal integration
  governmentPortalIntegrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GovernmentPortalIntegration'
  },

  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
ComplianceServiceSchema.index({ entityId: 1, complianceType: 1 });
ComplianceServiceSchema.index({ dueDate: 1, status: 1 });
ComplianceServiceSchema.index({ isRecurring: 1, 'recurringPattern.nextDueDate': 1 });
ComplianceServiceSchema.index({ regulatoryAuthority: 1, status: 1 });
```

### 2. ComplianceStatus Model

```javascript
const ComplianceStatusSchema = new mongoose.Schema({
  // Status identification
  code: {
    type: String,
    required: [true, 'Status code is required'],
    trim: true,
    uppercase: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Status name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },

  // Compliance-specific status type
  complianceType: {
    type: String,
    enum: [
      'PENDING',
      'IN_PROGRESS',
      'FILED',
      'APPROVED',
      'REJECTED',
      'OVERDUE',
      'COMPLETED',
      'CANCELLED'
    ],
    required: [true, 'Compliance type is required']
  },

  // Status properties
  isTerminal: {
    type: Boolean,
    default: false
  },
  requiresAction: {
    type: Boolean,
    default: false
  },
  penaltyApplicable: {
    type: Boolean,
    default: false
  },

  // Auto-transition rules
  autoTransitionRules: {
    enabled: {
      type: Boolean,
      default: false
    },
    conditions: [{
      trigger: {
        type: String,
        enum: ['DUE_DATE_REACHED', 'DOCUMENT_UPLOADED', 'PAYMENT_COMPLETED', 'EXTERNAL_RESPONSE']
      },
      targetStatus: String,
      delayMinutes: {
        type: Number,
        default: 0
      }
    }]
  },

  // Notification configuration
  notificationTriggers: {
    onEntry: {
      type: Boolean,
      default: false
    },
    onExit: {
      type: Boolean,
      default: false
    },
    reminderSchedule: [{
      daysBefore: Number,
      notificationType: {
        type: String,
        enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP']
      }
    }]
  },

  // Display properties
  color: {
    type: String,
    trim: true,
    default: '#3498db'
  },
  icon: {
    type: String,
    trim: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
ComplianceStatusSchema.index({ code: 1 }, { unique: true });
ComplianceStatusSchema.index({ complianceType: 1 });
ComplianceStatusSchema.index({ status: 1 });
```

### 3. ComplianceStage Model

```javascript
const ComplianceStageSchema = new mongoose.Schema({
  // Stage identification
  code: {
    type: String,
    required: [true, 'Stage code is required'],
    trim: true,
    uppercase: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Stage name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },

  // Compliance service reference
  complianceServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceService',
    required: [true, 'Compliance service is required']
  },

  // Stage properties
  sequence: {
    type: Number,
    required: [true, 'Sequence is required'],
    min: 0
  },
  stageType: {
    type: String,
    enum: [
      'PREPARATION',
      'REVIEW',
      'APPROVAL',
      'FILING',
      'VERIFICATION',
      'ACKNOWLEDGMENT',
      'COMPLETION'
    ],
    required: [true, 'Stage type is required']
  },

  // Duration estimates
  estimatedDuration: {
    value: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      enum: ['HOURS', 'DAYS', 'WEEKS'],
      default: 'DAYS'
    }
  },

  // Government portal integration
  governmentPortalRequired: {
    type: Boolean,
    default: false
  },
  portalType: {
    type: String,
    enum: ['MCA', 'GST', 'INCOME_TAX', 'LABOR', 'ENVIRONMENTAL', 'OTHER']
  },

  // Automation capabilities
  automationCapable: {
    type: Boolean,
    default: false
  },
  automationConfig: {
    enabled: {
      type: Boolean,
      default: false
    },
    automationType: {
      type: String,
      enum: ['FULL', 'PARTIAL', 'ASSISTED']
    },
    requiredApprovals: [{
      approverRole: String,
      required: Boolean
    }]
  },

  // Document requirements
  documentRequirements: [{
    documentTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentType',
      required: true
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    verificationRequired: {
      type: Boolean,
      default: false
    },
    governmentPortalUpload: {
      type: Boolean,
      default: false
    }
  }],

  // Form requirements
  formRequirements: [{
    formTemplateId: {
      type: String,
      required: true,
      ref: 'FormTemplate'
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    modelType: {
      type: String,
      required: true,
      enum: ['Entity', 'Person', 'Document', 'ComplianceService', 'Other']
    }
  }],

  // Verification requirements
  verificationRequirements: {
    internalVerification: {
      required: {
        type: Boolean,
        default: false
      },
      verifierRole: String,
      verificationCriteria: [String]
    },
    externalVerification: {
      required: {
        type: Boolean,
        default: false
      },
      verificationSource: String,
      verificationMethod: String
    }
  },

  // Status
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
ComplianceStageSchema.index({ code: 1 }, { unique: true });
ComplianceStageSchema.index({ complianceServiceId: 1, sequence: 1 });
ComplianceStageSchema.index({ stageType: 1 });
ComplianceStageSchema.index({ status: 1 });
```

### 4. GovernmentPortalIntegration Model

```javascript
const GovernmentPortalIntegrationSchema = new mongoose.Schema({
  // Entity reference
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: [true, 'Entity ID is required'],
    index: true
  },

  // Portal identification
  portalType: {
    type: String,
    required: [true, 'Portal type is required'],
    enum: [
      'MCA',
      'GST',
      'INCOME_TAX',
      'LABOR_DEPARTMENT',
      'POLLUTION_CONTROL_BOARD',
      'SEBI',
      'RBI',
      'FEMA',
      'CUSTOMS',
      'EXCISE',
      'STATE_PORTAL',
      'OTHER'
    ],
    index: true
  },
  portalName: {
    type: String,
    required: [true, 'Portal name is required'],
    trim: true
  },
  portalUrl: {
    type: String,
    trim: true
  },

  // Authentication credentials (encrypted)
  credentials: {
    username: {
      type: String,
      required: true,
      // Note: This should be encrypted in production
    },
    password: {
      type: String,
      required: true,
      // Note: This should be encrypted in production
    },
    additionalFields: {
      type: Map,
      of: String
      // For fields like PAN, TAN, etc.
    }
  },

  // Integration status
  integrationStatus: {
    type: String,
    enum: [
      'ACTIVE',
      'INACTIVE',
      'ERROR',
      'PENDING_VERIFICATION',
      'EXPIRED',
      'SUSPENDED'
    ],
    default: 'PENDING_VERIFICATION',
    index: true
  },

  // Sync information
  lastSyncDate: {
    type: Date,
    index: true
  },
  lastSuccessfulSync: {
    type: Date
  },
  syncFrequency: {
    type: String,
    enum: ['REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MANUAL'],
    default: 'DAILY'
  },

  // API configuration
  apiConfig: {
    baseUrl: String,
    apiVersion: String,
    authMethod: {
      type: String,
      enum: ['BASIC', 'OAUTH', 'API_KEY', 'CERTIFICATE']
    },
    rateLimits: {
      requestsPerMinute: Number,
      requestsPerHour: Number,
      requestsPerDay: Number
    }
  },

  // Filing history
  filingHistory: [{
    complianceServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComplianceService'
    },
    filingType: String,
    filingDate: Date,
    filingReference: String,
    status: {
      type: String,
      enum: ['SUBMITTED', 'ACKNOWLEDGED', 'REJECTED', 'PROCESSED']
    },
    response: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  }],

  // Error tracking
  errorLog: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    errorType: String,
    errorMessage: String,
    errorDetails: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],

  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
GovernmentPortalIntegrationSchema.index({ entityId: 1, portalType: 1 }, { unique: true });
GovernmentPortalIntegrationSchema.index({ integrationStatus: 1 });
GovernmentPortalIntegrationSchema.index({ lastSyncDate: 1 });
```

### 5. ComplianceCalendar Model

```javascript
const ComplianceCalendarSchema = new mongoose.Schema({
  // Entity reference
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: [true, 'Entity ID is required'],
    index: true
  },

  // Compliance reference
  complianceServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceService'
  },

  // Calendar entry details
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  complianceType: {
    type: String,
    required: [true, 'Compliance type is required'],
    index: true
  },

  // Date information
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    index: true
  },
  penaltyDate: {
    type: Date,
    index: true
  },
  reminderDates: [{
    date: Date,
    type: {
      type: String,
      enum: ['EARLY_WARNING', 'REMINDER', 'URGENT', 'OVERDUE']
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],

  // Recurring information
  isRecurring: {
    type: Boolean,
    default: false,
    index: true
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'CUSTOM']
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    nextOccurrence: Date
  },

  // Status
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'OVERDUE', 'CANCELLED'],
    default: 'SCHEDULED',
    index: true
  },

  // Notification schedule
  notificationSchedule: [{
    daysBefore: {
      type: Number,
      required: true
    },
    notificationType: {
      type: String,
      enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
      required: true
    },
    recipients: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String
    }],
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],

  // Priority and categorization
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
    index: true
  },
  category: {
    type: String,
    enum: ['TAX', 'REGULATORY', 'STATUTORY', 'AUDIT', 'OTHER'],
    index: true
  },

  // Metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
ComplianceCalendarSchema.index({ entityId: 1, dueDate: 1 });
ComplianceCalendarSchema.index({ complianceType: 1, status: 1 });
ComplianceCalendarSchema.index({ isRecurring: 1, 'recurringPattern.nextOccurrence': 1 });
ComplianceCalendarSchema.index({ priority: 1, dueDate: 1 });
```

## Existing Model Extensions

### 1. Entity Model Extensions

```javascript
// Add to existing Entity schema
const entityExtensions = {
  complianceProfile: {
    // Government registration numbers
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    tanNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    cinNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    llpinNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    
    // Compliance officer assignment
    complianceOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    backupComplianceOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    // Compliance settings
    complianceSettings: {
      autoFileEnabled: {
        type: Boolean,
        default: false
      },
      reminderPreferences: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        },
        push: {
          type: Boolean,
          default: true
        },
        daysBefore: {
          type: Number,
          default: 7
        }
      },
      penaltyAlerts: {
        type: Boolean,
        default: true
      }
    },
    
    // Compliance history summary
    complianceStats: {
      totalCompliances: {
        type: Number,
        default: 0
      },
      completedOnTime: {
        type: Number,
        default: 0
      },
      overdue: {
        type: Number,
        default: 0
      },
      totalPenalties: {
        type: Number,
        default: 0
      },
      lastComplianceDate: Date
    }
  }
};
```

### 2. CustomerService Model Extensions

```javascript
// Add to existing CustomerService schema
const customerServiceExtensions = {
  // Compliance service flag
  isComplianceService: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Reference to compliance service
  complianceServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceService'
  },
  
  // Compliance-specific metadata
  complianceMetadata: {
    regulatoryAuthority: String,
    complianceType: String,
    dueDate: Date,
    penaltyApplicable: Boolean,
    autoFilingEnabled: Boolean,
    governmentPortalRequired: Boolean
  }
};
```

### 3. Document Model Extensions

```javascript
// Add to existing Document schema
const documentExtensions = {
  // Compliance document flag
  isComplianceDocument: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Compliance-specific fields
  complianceType: {
    type: String,
    enum: [
      'GST_RETURN',
      'INCOME_TAX_RETURN',
      'ROC_FILING',
      'AUDIT_REPORT',
      'COMPLIANCE_CERTIFICATE',
      'PENALTY_PAYMENT',
      'OTHER'
    ]
  },
  
  // Government filing reference
  filingReference: {
    type: String,
    trim: true
  },
  
  // Government portal document ID
  governmentPortalId: {
    type: String,
    trim: true
  },
  
  // Compliance metadata
  complianceMetadata: {
    filingDate: Date,
    acknowledgmentNumber: String,
    acknowledgmentDate: Date,
    portalType: String,
    validityPeriod: {
      startDate: Date,
      endDate: Date
    }
  }
};
```

## Database Migration Scripts

### 1. Create New Collections

```javascript
// Migration script to create new compliance collections
const createComplianceCollections = async () => {
  const collections = [
    'complianceservices',
    'compliancestatuses',
    'compliancestages',
    'governmentportalintegrations',
    'compliancecalendars'
  ];
  
  for (const collection of collections) {
    await db.createCollection(collection);
    console.log(`Created collection: ${collection}`);
  }
};
```

### 2. Add Indexes

```javascript
// Migration script to add compliance-specific indexes
const addComplianceIndexes = async () => {
  // ComplianceService indexes
  await db.complianceservices.createIndex({ entityId: 1, complianceType: 1 });
  await db.complianceservices.createIndex({ dueDate: 1, status: 1 });
  await db.complianceservices.createIndex({ isRecurring: 1, 'recurringPattern.nextDueDate': 1 });
  
  // ComplianceCalendar indexes
  await db.compliancecalendars.createIndex({ entityId: 1, dueDate: 1 });
  await db.compliancecalendars.createIndex({ priority: 1, dueDate: 1 });
  
  // GovernmentPortalIntegration indexes
  await db.governmentportalintegrations.createIndex({ entityId: 1, portalType: 1 }, { unique: true });
  
  console.log('Compliance indexes created successfully');
};
```

### 3. Update Existing Collections

```javascript
// Migration script to add compliance fields to existing collections
const updateExistingCollections = async () => {
  // Update Entity collection
  await db.entities.updateMany(
    {},
    {
      $set: {
        'complianceProfile.complianceSettings.autoFileEnabled': false,
        'complianceProfile.complianceSettings.reminderPreferences.email': true,
        'complianceProfile.complianceSettings.reminderPreferences.daysBefore': 7,
        'complianceProfile.complianceStats.totalCompliances': 0,
        'complianceProfile.complianceStats.completedOnTime': 0,
        'complianceProfile.complianceStats.overdue': 0,
        'complianceProfile.complianceStats.totalPenalties': 0
      }
    }
  );
  
  // Update CustomerService collection
  await db.customerservices.updateMany(
    {},
    {
      $set: {
        'isComplianceService': false
      }
    }
  );
  
  // Update Document collection
  await db.documents.updateMany(
    {},
    {
      $set: {
        'isComplianceDocument': false
      }
    }
  );
  
  console.log('Existing collections updated with compliance fields');
};
```

## Data Validation Rules

### 1. Compliance Service Validation

```javascript
// Custom validation for compliance services
const validateComplianceService = {
  // Due date must be in the future for new services
  dueDate: {
    validator: function(value) {
      if (this.isNew) {
        return value > new Date();
      }
      return true;
    },
    message: 'Due date must be in the future for new compliance services'
  },
  
  // Recurring pattern validation
  recurringPattern: {
    validator: function(value) {
      if (this.isRecurring && !value.frequency) {
        return false;
      }
      return true;
    },
    message: 'Recurring pattern frequency is required for recurring compliance'
  }
};
```

### 2. Government Portal Integration Validation

```javascript
// Custom validation for portal integrations
const validatePortalIntegration = {
  // Unique portal per entity
  entityPortalUnique: {
    validator: async function(value) {
      const existing = await this.constructor.findOne({
        entityId: this.entityId,
        portalType: this.portalType,
        _id: { $ne: this._id }
      });
      return !existing;
    },
    message: 'Entity already has integration with this portal type'
  }
};
```

## Performance Considerations

### 1. Query Optimization

```javascript
// Optimized queries for compliance operations
const complianceQueries = {
  // Get upcoming due dates
  getUpcomingDueDates: (entityId, days = 30) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return ComplianceService.find({
      entityId,
      dueDate: { $lte: futureDate },
      status: { $nin: ['COMPLETED', 'CANCELLED'] }
    }).sort({ dueDate: 1 });
  },
  
  // Get overdue compliances
  getOverdueCompliances: (entityId) => {
    return ComplianceService.find({
      entityId,
      dueDate: { $lt: new Date() },
      status: { $nin: ['COMPLETED', 'CANCELLED'] }
    }).sort({ dueDate: 1 });
  }
};
```

### 2. Aggregation Pipelines

```javascript
// Compliance analytics aggregation
const complianceAnalytics = {
  getComplianceStats