# API Endpoint Specifications for Compliance Integration

## Overview

This document details the specific API endpoints required for compliance functionality integration into the existing customer portal backend. All endpoints follow the established patterns and conventions from the current system.

## Base URL Structure

```
/api/v1/compliance/
```

## Authentication & Authorization

All compliance endpoints require:
- Valid JWT token in Authorization header
- User must have appropriate permissions for compliance operations
- Entity-level access control for multi-tenant operations

## Core Compliance Service Endpoints

### 1. Compliance Services Management

#### GET /api/v1/compliance/services
Get all compliance services for an entity

**Query Parameters:**
```javascript
{
  entityId: String (required),
  status: String (optional) - ['SCHEDULED', 'IN_PREPARATION', 'FILED', 'COMPLETED'],
  complianceType: String (optional),
  dueDate: {
    from: Date (optional),
    to: Date (optional)
  },
  page: Number (default: 1),
  limit: Number (default: 10),
  sortBy: String (default: 'dueDate'),
  sortOrder: String (default: 'asc')
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    services: [
      {
        _id: "compliance_service_id",
        entityId: "entity_id",
        customerServiceId: "customer_service_id",
        complianceServiceNumber: "COMP-2024-001",
        complianceType: "GST_FILING",
        complianceCategory: "PERIODIC_FILING",
        complianceName: "GST Return Filing - March 2024",
        description: "Monthly GST return filing",
        regulatoryAuthority: "GST_DEPARTMENT",
        dueDate: "2024-04-20T00:00:00.000Z",
        penaltyDate: "2024-04-25T00:00:00.000Z",
        status: "SCHEDULED",
        isRecurring: true,
        recurringPattern: {
          frequency: "MONTHLY",
          interval: 1,
          nextDueDate: "2024-05-20T00:00:00.000Z"
        },
        filingDetails: {
          filingMethod: "ONLINE",
          filingReference: null,
          filingDate: null
        },
        penaltyStructure: {
          basePenalty: 200,
          dailyPenalty: 25,
          maxPenalty: 5000,
          penaltyCalculationMethod: "DAILY"
        },
        createdAt: "2024-03-15T10:30:00.000Z",
        updatedAt: "2024-03-15T10:30:00.000Z"
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalItems: 47,
      itemsPerPage: 10
    },
    summary: {
      totalServices: 47,
      scheduled: 15,
      inProgress: 8,
      overdue: 3,
      completed: 21
    }
  }
}
```

#### POST /api/v1/compliance/services
Create a new compliance service

**Request Body:**
```javascript
{
  entityId: "entity_id",
  customerServiceId: "customer_service_id", // Optional, for linked services
  complianceType: "GST_FILING",
  complianceCategory: "PERIODIC_FILING",
  complianceName: "GST Return Filing - March 2024",
  description: "Monthly GST return filing",
  regulatoryAuthority: "GST_DEPARTMENT",
  dueDate: "2024-04-20T00:00:00.000Z",
  penaltyDate: "2024-04-25T00:00:00.000Z",
  isRecurring: true,
  recurringPattern: {
    frequency: "MONTHLY",
    interval: 1,
    endDate: "2025-03-31T00:00:00.000Z"
  },
  penaltyStructure: {
    basePenalty: 200,
    dailyPenalty: 25,
    maxPenalty: 5000,
    penaltyCalculationMethod: "DAILY"
  },
  metadata: {
    customField1: "value1",
    customField2: "value2"
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    service: {
      _id: "new_compliance_service_id",
      complianceServiceNumber: "COMP-2024-048",
      // ... full service object
    }
  },
  message: "Compliance service created successfully"
}
```

#### GET /api/v1/compliance/services/:serviceId
Get specific compliance service details

**Response:**
```javascript
{
  success: true,
  data: {
    service: {
      // Full compliance service object with populated references
      entity: {
        _id: "entity_id",
        name: "ABC Private Limited",
        complianceProfile: {
          gstNumber: "27AABCU9603R1ZX",
          panNumber: "AABCU9603R",
          complianceOfficer: {
            _id: "user_id",
            name: "John Doe",
            email: "john@example.com"
          }
        }
      },
      customerService: {
        _id: "customer_service_id",
        serviceNumber: "SRV-2024-001"
      },
      currentStage: {
        _id: "stage_id",
        name: "Document Preparation",
        stageType: "PREPARATION"
      },
      governmentPortalIntegration: {
        _id: "portal_id",
        portalType: "GST",
        integrationStatus: "ACTIVE"
      }
    },
    relatedDocuments: [
      {
        _id: "document_id",
        name: "GST Return Draft",
        documentType: "GST_RETURN",
        status: "DRAFT"
      }
    ],
    stageHistory: [
      {
        stageId: "stage_id",
        stageName: "Document Preparation",
        enteredAt: "2024-03-15T10:30:00.000Z",
        exitedAt: null,
        status: "IN_PROGRESS"
      }
    ]
  }
}
```

#### PUT /api/v1/compliance/services/:serviceId
Update compliance service

**Request Body:**
```javascript
{
  status: "IN_PREPARATION",
  currentStageId: "new_stage_id",
  filingDetails: {
    filingMethod: "ONLINE",
    filingReference: "GST-REF-2024-001",
    filingDate: "2024-04-18T14:30:00.000Z"
  },
  metadata: {
    updatedField: "newValue"
  }
}
```

#### DELETE /api/v1/compliance/services/:serviceId
Cancel/Delete compliance service

**Response:**
```javascript
{
  success: true,
  message: "Compliance service cancelled successfully"
}
```

### 2. Compliance Calendar Endpoints

#### GET /api/v1/compliance/calendar
Get compliance calendar for entity

**Query Parameters:**
```javascript
{
  entityId: String (required),
  startDate: Date (required),
  endDate: Date (required),
  complianceType: String (optional),
  priority: String (optional),
  status: String (optional)
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    calendarEntries: [
      {
        _id: "calendar_entry_id",
        title: "GST Return Filing",
        description: "Monthly GST return for March 2024",
        complianceType: "GST_FILING",
        dueDate: "2024-04-20T00:00:00.000Z",
        penaltyDate: "2024-04-25T00:00:00.000Z",
        status: "SCHEDULED",
        priority: "HIGH",
        isRecurring: true,
        complianceServiceId: "compliance_service_id",
        reminderDates: [
          {
            date: "2024-04-13T09:00:00.000Z",
            type: "REMINDER",
            sent: false
          }
        ]
      }
    ],
    summary: {
      totalEntries: 15,
      overdue: 2,
      dueThisWeek: 5,
      dueThisMonth: 12
    }
  }
}
```

#### POST /api/v1/compliance/calendar
Create calendar entry

**Request Body:**
```javascript
{
  entityId: "entity_id",
  complianceServiceId: "compliance_service_id", // Optional
  title: "Custom Compliance Task",
  description: "Custom compliance requirement",
  complianceType: "OTHER",
  dueDate: "2024-05-15T00:00:00.000Z",
  priority: "MEDIUM",
  isRecurring: false,
  notificationSchedule: [
    {
      daysBefore: 7,
      notificationType: "EMAIL",
      recipients: [
        {
          userId: "user_id",
          role: "COMPLIANCE_OFFICER"
        }
      ]
    }
  ]
}
```

### 3. Government Portal Integration Endpoints

#### GET /api/v1/compliance/portals
Get government portal integrations for entity

**Query Parameters:**
```javascript
{
  entityId: String (required),
  portalType: String (optional),
  integrationStatus: String (optional)
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    integrations: [
      {
        _id: "integration_id",
        entityId: "entity_id",
        portalType: "GST",
        portalName: "GST Portal",
        portalUrl: "https://www.gst.gov.in",
        integrationStatus: "ACTIVE",
        lastSyncDate: "2024-04-15T10:30:00.000Z",
        lastSuccessfulSync: "2024-04-15T10:30:00.000Z",
        syncFrequency: "DAILY",
        credentials: {
          username: "encrypted_username",
          // Password not returned for security
          additionalFields: {
            "gstin": "27AABCU9603R1ZX"
          }
        },
        apiConfig: {
          baseUrl: "https://api.gst.gov.in",
          apiVersion: "v1.0",
          authMethod: "OAUTH"
        }
      }
    ]
  }
}
```

#### POST /api/v1/compliance/portals
Create government portal integration

**Request Body:**
```javascript
{
  entityId: "entity_id",
  portalType: "GST",
  portalName: "GST Portal",
  portalUrl: "https://www.gst.gov.in",
  credentials: {
    username: "portal_username",
    password: "portal_password",
    additionalFields: {
      "gstin": "27AABCU9603R1ZX"
    }
  },
  syncFrequency: "DAILY",
  apiConfig: {
    baseUrl: "https://api.gst.gov.in",
    apiVersion: "v1.0",
    authMethod: "OAUTH"
  }
}
```

#### PUT /api/v1/compliance/portals/:integrationId/sync
Trigger manual sync with government portal

**Response:**
```javascript
{
  success: true,
  data: {
    syncId: "sync_job_id",
    status: "INITIATED",
    estimatedCompletion: "2024-04-15T11:00:00.000Z"
  },
  message: "Portal sync initiated successfully"
}
```

#### GET /api/v1/compliance/portals/:integrationId/status
Get portal integration status and sync history

**Response:**
```javascript
{
  success: true,
  data: {
    integration: {
      _id: "integration_id",
      integrationStatus: "ACTIVE",
      lastSyncDate: "2024-04-15T10:30:00.000Z",
      lastSuccessfulSync: "2024-04-15T10:30:00.000Z"
    },
    syncHistory: [
      {
        syncId: "sync_job_id",
        startTime: "2024-04-15T10:30:00.000Z",
        endTime: "2024-04-15T10:32:00.000Z",
        status: "COMPLETED",
        recordsProcessed: 15,
        errors: []
      }
    ],
    errorLog: [
      {
        timestamp: "2024-04-14T10:30:00.000Z",
        errorType: "AUTHENTICATION_ERROR",
        errorMessage: "Invalid credentials",
        resolved: true
      }
    ]
  }
}
```

### 4. Compliance Workflow Endpoints

#### GET /api/v1/compliance/stages
Get compliance stages for a service

**Query Parameters:**
```javascript
{
  complianceServiceId: String (required)
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    stages: [
      {
        _id: "stage_id",
        code: "DOC_PREP",
        name: "Document Preparation",
        description: "Prepare all required documents",
        sequence: 1,
        stageType: "PREPARATION",
        estimatedDuration: {
          value: 3,
          unit: "DAYS"
        },
        status: "ACTIVE",
        documentRequirements: [
          {
            documentTypeId: "doc_type_id",
            documentType: {
              name: "Financial Statements",
              code: "FIN_STMT"
            },
            isRequired: true,
            verificationRequired: true
          }
        ],
        formRequirements: [
          {
            formTemplateId: "form_template_id",
            formTemplate: {
              name: "GST Return Form",
              code: "GST_RETURN"
            },
            isRequired: true,
            order: 1,
            modelType: "Entity"
          }
        ]
      }
    ],
    currentStage: {
      _id: "current_stage_id",
      sequence: 1,
      enteredAt: "2024-04-15T10:30:00.000Z"
    }
  }
}
```

#### POST /api/v1/compliance/services/:serviceId/stages/transition
Transition compliance service to next stage

**Request Body:**
```javascript
{
  targetStageId: "target_stage_id",
  notes: "All documents verified and ready for filing",
  attachments: [
    {
      documentId: "document_id",
      documentType: "VERIFICATION_REPORT"
    }
  ]
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    service: {
      _id: "service_id",
      currentStageId: "target_stage_id",
      status: "IN_PREPARATION"
    },
    stageTransition: {
      fromStageId: "previous_stage_id",
      toStageId: "target_stage_id",
      transitionedAt: "2024-04-15T11:00:00.000Z",
      transitionedBy: "user_id",
      notes: "All documents verified and ready for filing"
    }
  },
  message: "Stage transition completed successfully"
}
```

### 5. Compliance Filing Endpoints

#### POST /api/v1/compliance/services/:serviceId/file
File compliance with government portal

**Request Body:**
```javascript
{
  filingMethod: "ONLINE",
  portalIntegrationId: "portal_integration_id",
  documents: [
    {
      documentId: "document_id",
      portalDocumentType: "MAIN_RETURN"
    }
  ],
  filingData: {
    returnPeriod: "03/2024",
    turnover: 1500000,
    taxLiability: 270000
  },
  autoSubmit: false // If true, automatically submit after validation
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    filingId: "filing_job_id",
    status: "INITIATED",
    filingReference: "TEMP-REF-001",
    estimatedCompletion: "2024-04-15T12:00:00.000Z",
    validationResults: {
      status: "PASSED",
      warnings: [
        "Turnover increased by 25% from previous period"
      ],
      errors: []
    }
  },
  message: "Filing initiated successfully"
}
```

#### GET /api/v1/compliance/services/:serviceId/filing-status
Get filing status for compliance service

**Response:**
```javascript
{
  success: true,
  data: {
    filingStatus: {
      status: "FILED",
      filingReference: "GST-2024-001-FILED",
      filingDate: "2024-04-18T14:30:00.000Z",
      acknowledgmentNumber: "ACK-GST-2024-001",
      acknowledgmentDate: "2024-04-18T14:35:00.000Z",
      portalResponse: {
        statusCode: "SUCCESS",
        message: "Return filed successfully",
        additionalInfo: {
          processingTime: "5 minutes",
          refundAmount: 0
        }
      }
    },
    filingHistory: [
      {
        attempt: 1,
        timestamp: "2024-04-18T14:30:00.000Z",
        status: "SUCCESS",
        reference: "GST-2024-001-FILED"
      }
    ]
  }
}
```

### 6. Compliance Analytics Endpoints

#### GET /api/v1/compliance/analytics/dashboard
Get compliance dashboard analytics

**Query Parameters:**
```javascript
{
  entityId: String (required),
  period: String (optional) - ['CURRENT_MONTH', 'CURRENT_QUARTER', 'CURRENT_YEAR'],
  complianceType: String (optional)
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    summary: {
      totalCompliances: 47,
      completedOnTime: 42,
      overdue: 3,
      upcoming: 15,
      totalPenalties: 5000,
      complianceScore: 89.4
    },
    complianceByType: [
      {
        type: "GST_FILING",
        total: 12,
        completed: 11,
        overdue: 1,
        upcoming: 3
      }
    ],
    complianceByAuthority: [
      {
        authority: "GST_DEPARTMENT",
        total: 12,
        completed: 11,
        overdue: 1
      }
    ],
    monthlyTrend: [
      {
        month: "2024-01",
        total: 8,
        completed: 8,
        overdue: 0,
        penalties: 0
      }
    ],
    upcomingDeadlines: [
      {
        complianceServiceId: "service_id",
        complianceName: "GST Return Filing",
        dueDate: "2024-04-20T00:00:00.000Z",
        daysRemaining: 5,
        priority: "HIGH"
      }
    ]
  }
}
```

#### GET /api/v1/compliance/analytics/reports
Generate compliance reports

**Query Parameters:**
```javascript
{
  entityId: String (required),
  reportType: String (required) - ['COMPLIANCE_SUMMARY', 'PENALTY_REPORT', 'FILING_HISTORY'],
  startDate: Date (required),
  endDate: Date (required),
  format: String (optional) - ['JSON', 'PDF', 'EXCEL']
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    reportId: "report_id",
    reportType: "COMPLIANCE_SUMMARY",
    generatedAt: "2024-04-15T11:00:00.000Z",
    downloadUrl: "/api/v1/compliance/reports/download/report_id",
    expiresAt: "2024-04-22T11:00:00.000Z",
    reportData: {
      // Report data structure based on reportType
      summary: {
        period: "Q1 2024",
        totalCompliances: 35,
        completedOnTime: 32,
        overdue: 3,
        totalPenalties: 5000
      },
      details: [
        // Detailed compliance records
      ]
    }
  }
}
```

### 7. Compliance Notifications Endpoints

#### GET /api/v1/compliance/notifications
Get compliance notifications

**Query Parameters:**
```javascript
{
  entityId: String (required),
  type: String (optional) - ['REMINDER', 'OVERDUE', 'FILED', 'ERROR'],
  status: String (optional) - ['UNREAD', 'READ'],
  page: Number (default: 1),
  limit: Number (default: 20)
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    notifications: [
      {
        _id: "notification_id",
        type: "REMINDER",
        title: "GST Filing Due in 3 Days",
        message: "GST Return for March 2024 is due on April 20, 2024",
        complianceServiceId: "service_id",
        priority: "HIGH",
        status: "UNREAD",
        scheduledFor: "2024-04-17T09:00:00.000Z",
        sentAt: "2024-04-17T09:00:00.000Z",
        channels: ["EMAIL", "IN_APP"],
        metadata: {
          dueDate: "2024-04-20T00:00:00.000Z",
          daysRemaining: 3
        }
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 25,
      itemsPerPage: 20
    },
    summary: {
      unread: 5,
      overdue: 2,
      reminders: 8
    }
  }
}
```

#### PUT /api/v1/compliance/notifications/:notificationId/read
Mark notification as read

**Response:**
```javascript
{
  success: true,
  message: "Notification marked as read"
}
```

#### POST /api/v1/compliance/notifications/settings
Update notification preferences

**Request Body:**
```javascript
{
  entityId: "entity_id",
  preferences: {
    email: {
      enabled: true,
      reminderDays: [7, 3, 1],
      overdueAlerts: true,
      filingConfirmations: true
    },
    sms: {
      enabled: false,
      reminderDays: [1],
      overdueAlerts: true
    },
    push: {
      enabled: true,
      reminderDays: [7, 3, 1],
      overdueAlerts: true,
      filingConfirmations: true
    },
    inApp: {
      enabled: true,
      reminderDays: [7, 3, 1],
      overdueAlerts: true,
      filingConfirmations: true
    }
  }
}
```

## Error Handling

### Standard Error Response Format

```javascript
{
  success: false,
  error: {
    code: "COMPLIANCE_SERVICE_NOT_FOUND",
    message: "Compliance service not found",
    details: {
      serviceId: "invalid_service_id",
      entityId: "entity_id"
    },
    timestamp: "2024-04-15T11:00:00.000Z",
    requestId: "req_12345"
  }
}
```

### Common Error Codes

```javascript
const COMPLIANCE_ERROR_CODES = {
  // Service errors
  COMPLIANCE_SERVICE_NOT_FOUND: 'Compliance service not found',
  COMPLIANCE_SERVICE_ALREADY_EXISTS: 'Compliance service already exists',
  INVALID_COMPLIANCE_TYPE: 'Invalid compliance type',
  INVALID_DUE_DATE: 'Due date must be in the future',
  
  // Portal integration errors
  PORTAL_INTEGRATION_NOT_FOUND: 'Government portal integration not found',
  PORTAL_AUTHENTICATION_FAILED: 'Portal authentication failed',
  PORTAL_SYNC_IN_PROGRESS: 'Portal sync already in progress',
  PORTAL_API_ERROR: 'Government portal API error',
  
  // Filing errors
  FILING_VALIDATION_FAILED: 'Filing validation failed',
  FILING_SUBMISSION_FAILED: 'Filing submission failed',
  FILING_ALREADY_SUBMITTED: 'Filing already submitted',
  REQUIRED_DOCUMENTS_MISSING: 'Required documents missing',
  
  // Permission errors
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for compliance operation',
  ENTITY_ACCESS_DENIED: 'Access denied for entity',
  
  // Workflow errors
  INVALID_STAGE_TRANSITION: 'Invalid stage transition',
  STAGE_REQUIREMENTS_NOT_MET: 'Stage requirements not met',
  WORKFLOW_LOCKED: 'Compliance workflow is locked'
};
```

## Rate Limiting

### API Rate Limits

```javascript
const RATE_LIMITS = {
  // Standard endpoints
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  },
  
  // Government portal sync endpoints
  portalSync: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // requests per window
  },
  
  // Filing endpoints
  filing: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20 // requests per window
  },
  
  // Report generation
  reports: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5 // requests per window
  }
};
```

## Webhook Endpoints

### Compliance Event Webhooks

#### POST /api/v1/compliance/webhooks/events
Receive compliance events from external systems

**Request Body:**
```javascript
{
  eventType: "FILING_ACKNOWLEDGED",
  source: "GST_PORTAL",
  timestamp: "2024-04-18T14:35:00.000Z",
  data: {
    filingReference: "GST-2024-001-FILED",
    acknowledgmentNumber: "ACK-GST-2024-001",
    entityGstin: "27AABCU9603R1ZX",
    returnPeriod: "03/2024",
    status: "ACKNOWLEDGED"
  },
  signature: "webhook_signature_for_verification"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Event processed successfully",
  eventId: "event_processing_id"
}
```

## Integration with Existing APIs

### Customer Service Integration

```javascript
// Extend existing CustomerService endpoints
GET /api/v1/services/:serviceId/compliance
POST /api/v1/services/:serviceId/compliance/link
DELETE /api/v1/services/:serviceId/compliance/unlink
```

### Document Integration

```javascript
// Extend existing Document endpoints
GET /api/v1/documents/compliance/:complianceServiceId
POST /api/v1/documents/compliance/upload
PUT /api/v1/documents/:documentId/compliance-metadata
```

### Entity Integration

```javascript
// Extend existing Entity endpoints
GET /api/v1/entities/:entityId/compliance-profile
PUT /api/v1/entities/:entityId/compliance-profile
GET /api/v1/entities/:entityId/compliance-summary
```

## API Versioning Strategy

### Version Headers

```javascript
// Request headers
{
  "Accept": "application/vnd.api+json;version=1.0",
  "Content-Type": "application/json",
  "Authorization": "Bearer jwt_token"
}
```

### Backward Compatibility

- All v1.0 endpoints maintain backward compatibility
- New fields added as optional
- Deprecated fields marked but not removed
- Migration guides provided for breaking changes

## Testing Strategy

### API Testing Requirements

1. **Unit Tests**: >90% coverage for all endpoint handlers
2. **Integration Tests**: End-to-end workflow testing
3. **Load Tests**: Performance testing for high-volume operations
4. **Security Tests**: Authentication, authorization, and data validation
5. **Government Portal Mock Tests**: Simulated portal interactions

### Test Data Requirements

```javascript
// Test entity with compliance profile
const testEntity = {
  _id: "test_entity_id",
  name: "Test Company Ltd",
  complianceProfile: {
    gstNumber: "27AABCU9603R1ZX",
    panNumber: "AABCU9603R",
    complianceOfficer: "test_user_id"
  }
};

// Test compliance service
const testComplianceService = {
  _id: "test_service_id",
  entityId: "test_entity_id",
  complianceType: "GST_FILING",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  status: "SCHEDULED"
};
```

This comprehensive API specification provides the foundation for implementing all compliance functionality while maintaining consistency with the existing customer portal backend architecture.