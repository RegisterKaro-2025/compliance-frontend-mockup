# Data Models

## Core Compliance Models

This section defines the data models required for the compliance module. The models follow MongoDB schema patterns consistent with the existing system architecture.

### ComplianceType

The ComplianceType model defines the types of compliance requirements available in the system.

```javascript
const ComplianceTypeSchema = new mongoose.Schema({
  // Core identification
  code: {
    type: String,
    required: [true, 'Compliance code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Compliance name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Classification
  category: {
    type: String,
    enum: ['STATUTORY', 'REGULATORY', 'INTERNAL', 'GOVERNANCE', 'TAX', 'OTHER'],
    required: [true, 'Category is required']
  },
  isStatutory: {
    type: Boolean,
    default: true
  },
  regulatoryAuthority: {
    type: String,
    trim: true
  },
  
  // Applicability
  applicableEntityTypes: [{
    type: String,
    enum: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PARTNERSHIP', 'PROPRIETORSHIP', 'OTHER']
  }],
  
  // Pricing and display
  basePrice: {
    type: Number,
    min: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  seoMetadata: {
    pageTitle: String,
    metaDescription: String,
    keywords: String,
    ogImage: String
  },
  
  // Compliance details
  requiredDocuments: [{
    type: String,
    trim: true
  }],
  deliverables: [{
    type: String,
    trim: true
  }],
  
  // Periodicity (for recurring compliances)
  periodicityRules: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'CUSTOM'],
      default: 'YEARLY'
    },
    customPattern: String, // For complex recurring patterns
    dueDateCalculation: String // Formula or rule to calculate due dates
  },
  
  // Dependencies
  prerequisites: [{
    complianceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComplianceType'
    },
    description: String
  }]
}, {
  timestamps: true
});
```

### ComplianceRequirement

The ComplianceRequirement model defines specific compliance requirements within a compliance type.

```javascript
const ComplianceRequirementSchema = new mongoose.Schema({
  complianceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceType',
    required: [true, 'Compliance type ID is required']
  },
  code: {
    type: String,
    required: [true, 'Requirement code is required'],
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Requirement name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Applicability
  applicableToEntityTypes: [{
    type: String,
    enum: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PARTNERSHIP', 'PROPRIETORSHIP', 'OTHER']
  }],
  
  // Timing and deadlines
  frequency: {
    type: String,
    enum: ['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'CUSTOM'],
    default: 'YEARLY'
  },
  dueDateCalculation: {
    baseDate: {
      type: String,
      enum: ['INCORPORATION_DATE', 'FINANCIAL_YEAR_END', 'ASSESSMENT_YEAR_END', 'FIXED_DATE', 'CUSTOM'],
      default: 'FINANCIAL_YEAR_END'
    },
    offsetDays: {
      type: Number,
      default: 0
    },
    fixedDay: Number,
    fixedMonth: Number,
    customFormula: String
  },
  
  // Filing windows
  filingWindows: [{
    name: {
      type: String,
      trim: true
    },
    startOffsetDays: Number,
    endOffsetDays: Number,
    hasAdditionalFees: Boolean,
    additionalFeesDetails: String
  }],
  
  // Consequences
  penalties: [{
    description: String,
    amount: String,
    calculationMethod: String
  }],
  
  // Exemptions
  exemptions: [{
    description: String,
    criteria: String
  }],
  
  // Required inputs
  requiredDocuments: [{
    documentTypeCode: String,
    name: String,
    description: String,
    isOptional: Boolean
  }],
  requiredForms: [{
    formCode: String,
    name: String,
    description: String,
    templateUrl: String
  }],
  
  // Outputs
  deliverables: [{
    name: String,
    description: String,
    format: String
  }],
  
  // Status
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### CustomerCompliance

The CustomerCompliance model represents a specific compliance requirement for a customer entity.

```javascript
const CustomerComplianceSchema = new mongoose.Schema({
  // Core references
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: [true, 'Entity ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  complianceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceType',
    required: [true, 'Compliance type ID is required']
  },
  complianceRequirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceRequirement',
    required: [true, 'Compliance requirement ID is required']
  },
  
  // Status tracking
  applicationStatusCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  statusHistory: [{
    statusCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  // Timing information
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  completionDate: {
    type: Date,
    default: null
  },
  
  // Assignment information
  assignedToUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Workflow information
  currentStageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceStage',
    default: null
  },
  stageHistory: [{
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComplianceStage'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Recurrence information
  isRecurring: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'CUSTOM'],
    default: null
  },
  nextOccurrence: {
    dueDate: Date,
    generationDate: Date,
    status: {
      type: String,
      enum: ['PENDING', 'GENERATED', 'SKIPPED'],
      default: 'PENDING'
    }
  },
  
  // For tracking historical periods
  compliancePeriods: [{
    periodName: String,
    startDate: Date,
    endDate: Date,
    dueDate: Date,
    filingDate: Date,
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'MISSED'],
      default: 'PENDING'
    },
    documents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComplianceDocument'
    }]
  }],
  
  // Additional data
  notes: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  
  // Tags for filtering
  tags: [String]
}, {
  timestamps: true
});
```

### ComplianceStage

The ComplianceStage model defines the stages in a compliance workflow.

```javascript
const ComplianceStageSchema = new mongoose.Schema({
  complianceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ComplianceType',
    required: [true, 'Compliance type ID is required']
  },
  code: {
    type: String,
    required: [true, 'Stage code is required'],
    trim: true
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
  sequence: {
    type: Number,
    required: [true, 'Sequence number is required'],
    min: 0
  },
  estimatedDuration: {
    type: Number,
    min: 0
  },
  clientVisible: {
    type: Boolean,
    default: true
  },
  requiredDocuments: [{
    type: String,
    trim: true
  }],
  
  // Rules for document verification
  verificationRules: {
    requiresManualVerification: {
      type: Boolean,
      default: true
    },
    autoVerificationCriteria: String,
    verifierRoles: [String]
  },
  
  // Rules for government submission
  submissionRules: {
    portalType: {
      type: String,
      enum: ['MCA', 'GST', 'INCOME_TAX', 'OTHER', 'NONE'],
      default: 'NONE'
    },
    requiresDigitalSignature: {
      type: Boolean,
      default: false
    },
    signatoryRoles: [String],
    submissionMethod: {
      type: String,
      enum: ['API', 'MANUAL', 'HYBRID'],
      default: 'MANUAL'
    }
  }
}, {
  timestamps: true
});
```

### ComplianceDocument

The ComplianceDocument model represents documents related to compliance requirements.

```javascript
const ComplianceDocumentSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: [true, 'Entity ID is required']
  },
  complianceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerCompliance',
    required: [true, 'Compliance ID is required']
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Document name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'UPLOADED', 'VERIFIED', 'REJECTED', 'EXPIRED'],
    default: 'PENDING'
  },
  uploadedAt: {
    type: Date,
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  verificationNotes: {
    type: String,
    trim: true
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  fileUrl: {
    type: String,
    trim: true
  },
  filePath: {
    type: String,
    trim: true
  },
  fileType: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number,
    min: 0
  },
  tags: [String]
}, {
  timestamps: true
});
```

### ComplianceCalendar

The ComplianceCalendar model represents a calendar of compliance deadlines for an entity.

```javascript
const ComplianceCalendarSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: [true, 'Entity ID is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    default: null // null means full year
  },
  entries: [{
    complianceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomerCompliance'
    },
    complianceTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ComplianceType'
    },
    name: String,
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ['UPCOMING', 'DUE_SOON', 'DUE_TODAY', 'OVERDUE', 'COMPLETED', 'IN_PROGRESS'],
      default: 'UPCOMING'
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM'
    },
    completionDate: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
```

## Extensions to Existing Models

### ServiceType Extensions

```javascript
// Add compliance-specific fields to ServiceType
{
  isComplianceService: {
    type: Boolean,
    default: false
  },
  complianceCategory: {
    type: String,
    enum: ['STATUTORY', 'REGULATORY', 'INTERNAL', 'GOVERNANCE', 'TAX', 'OTHER'],
    default: null
  },
  regulatoryAuthority: String,
  periodicityType: {
    type: String,
    enum: ['ONE_TIME', 'ANNUAL', 'BI_ANNUAL', 'QUARTERLY', 'MONTHLY', 'CUSTOM'],
    default: 'ONE_TIME'
  }
}
```

### ApplicationStatus Extensions

```javascript
// Add compliance-specific statuses
const complianceStatuses = [
  {
    code: 'COMPLIANCE_DUE',
    name: 'Compliance Due',
    type: 'PENDING',
    colorCode: '#FFA500',
    triggerNotification: true
  },
  {
    code: 'DOCS_PENDING',
    name: 'Documents Pending',
    type: 'IN_PROGRESS',
    colorCode: '#FF7F50',
    triggerNotification: true
  },
  {
    code: 'READY_FOR_FILING',
    name: 'Ready for Filing',
    type: 'IN_PROGRESS',
    colorCode: '#1E90FF',
    triggerNotification: true
  },
  {
    code: 'FILED',
    name: 'Filed',
    type: 'IN_PROGRESS',
    colorCode: '#32CD32',
    triggerNotification: true
  },
  {
    code: 'COMPLIANCE_COMPLETED',
    name: 'Compliance Completed',
    type: 'COMPLETED',
    colorCode: '#008000',
    triggerNotification: true
  }
]
```

### TaskType Extensions

```javascript
// Add compliance-specific task types
const complianceTaskTypes = [
  {
    code: 'DOCUMENT_COLLECTION',
    name: 'Document Collection',
    category: 'DOCUMENT',
    defaultPriority: 'high'
  },
  {
    code: 'DOCUMENT_VERIFICATION',
    name: 'Document Verification',
    category: 'VERIFICATION',
    defaultPriority: 'high'
  },
  {
    code: 'COMPLIANCE_FORM_PREPARATION',
    name: 'Compliance Form Preparation',
    category: 'DOCUMENT',
    defaultPriority: 'high'
  },
  {
    code: 'GOVERNMENT_PORTAL_FILING',
    name: 'Government Portal Filing',
    category: 'SUBMISSION',
    defaultPriority: 'urgent'
  },
  {
    code: 'COMPLIANCE_REVIEW',
    name: 'Compliance Review',
    category: 'REVIEW',
    defaultPriority: 'high'
  }
]
```

### Notification Extensions

```javascript
// Add compliance-specific notification types
{
  type: {
    type: String,
    enum: [
      // Existing types...
      'COMPLIANCE_DUE',
      'COMPLIANCE_OVERDUE',
      'DOCUMENT_REQUIRED_FOR_COMPLIANCE',
      'COMPLIANCE_FILED',
      'COMPLIANCE_COMPLETED',
      'COMPLIANCE_ISSUE'
    ]
  }
}
```

## Database Indexes

To optimize query performance, the following indexes will be created:

```javascript
// ComplianceType indexes
ComplianceTypeSchema.index({ code: 1 }, { unique: true });
ComplianceTypeSchema.index({ category: 1 });
ComplianceTypeSchema.index({ active: 1 });
ComplianceTypeSchema.index({ 'applicableEntityTypes': 1 });
ComplianceTypeSchema.index({ 'periodicityRules.isRecurring': 1 });

// ComplianceRequirement indexes
ComplianceRequirementSchema.index({ complianceTypeId: 1 });
ComplianceRequirementSchema.index({ code: 1 });
ComplianceRequirementSchema.index({ active: 1 });
ComplianceRequirementSchema.index({ 'applicableToEntityTypes': 1 });
ComplianceRequirementSchema.index({ frequency: 1 });

// CustomerCompliance indexes
CustomerComplianceSchema.index({ entityId: 1 });
CustomerComplianceSchema.index({ complianceTypeId: 1 });
CustomerComplianceSchema.index({ complianceRequirementId: 1 });
CustomerComplianceSchema.index({ applicationStatusCode: 1 });
CustomerComplianceSchema.index({ dueDate: 1 });
CustomerComplianceSchema.index({ isRecurring: 1 });
CustomerComplianceSchema.index({ 'compliancePeriods.status': 1 });

// ComplianceStage indexes
ComplianceStageSchema.index({ complianceTypeId: 1 });
ComplianceStageSchema.index({ code: 1 });
ComplianceStageSchema.index({ sequence: 1 });

// ComplianceDocument indexes
ComplianceDocumentSchema.index({ entityId: 1 });
ComplianceDocumentSchema.index({ complianceId: 1 });
ComplianceDocumentSchema.index({ status: 1 });
ComplianceDocumentSchema.index({ verificationStatus: 1 });
ComplianceDocumentSchema.index({ documentType: 1 });

// ComplianceCalendar indexes
ComplianceCalendarSchema.index({ entityId: 1 });
ComplianceCalendarSchema.index({ year: 1, month: 1 });
ComplianceCalendarSchema.index({ 'entries.dueDate': 1 });
ComplianceCalendarSchema.index({ 'entries.status': 1 });
```

## Data Relationships

```mermaid
erDiagram
    ComplianceType ||--o{ ComplianceRequirement : "defines"
    ComplianceType ||--o{ ComplianceStage : "has"
    ComplianceRequirement ||--o{ CustomerCompliance : "instantiated as"
    Entity ||--o{ CustomerCompliance : "has"
    CustomerCompliance ||--o{ ComplianceDocument : "requires"
    CustomerCompliance }|--|| ComplianceStage : "at current stage"
    Entity ||--o{ ComplianceCalendar : "has"
    ComplianceCalendar }o--o{ CustomerCompliance : "includes"
    User ||--o{ CustomerCompliance : "assigned to"
    ServiceType ||--o{ ComplianceType : "related to"