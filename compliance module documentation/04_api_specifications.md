# API Specifications

This document specifies the RESTful API endpoints for the RegisterKaro Compliance Module. These APIs follow the same patterns and conventions as the existing RegisterKaro API system.

## Base URL

All compliance module APIs will be accessible under the base URL:
```
/api/compliance
```

## Authentication and Authorization

All compliance API endpoints require authentication. Users must provide a valid JWT token in the request header:

```
Authorization: Bearer <token>
```

Endpoints are secured based on user roles with the following permission hierarchy:
- Admin: Full access to all endpoints
- Compliance Officer: Access to manage compliance for assigned entities
- Client Admin: Access to compliance for their entities
- Regular User: Limited access to view compliance they're involved with

## API Endpoints

### Compliance Type Management

#### 1. List Compliance Types

```
GET /api/compliance/types
```

Query Parameters:
- `category` - Filter by category
- `active` - Filter by active status
- `entityType` - Filter by applicable entity type
- `search` - Search by name or code
- `limit` - Limit results (default: 20)
- `page` - Page number (default: 1)
- `sort` - Field to sort by (default: name)
- `order` - Sort order (asc/desc, default: asc)

Response:
```json
{
  "success": true,
  "data": {
    "types": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "code": "ANNUAL_ROC_FILING",
        "name": "Annual ROC Filing",
        "category": "STATUTORY",
        "isStatutory": true,
        "regulatoryAuthority": "MCA",
        "active": true,
        "periodicityRules": {
          "isRecurring": true,
          "frequency": "YEARLY"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

#### 2. Get Compliance Type Details

```
GET /api/compliance/types/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "code": "ANNUAL_ROC_FILING",
    "name": "Annual ROC Filing",
    "description": "Annual filing of financial statements and annual returns with ROC",
    "category": "STATUTORY",
    "isStatutory": true,
    "regulatoryAuthority": "MCA",
    "applicableEntityTypes": ["PRIVATE_LIMITED", "PUBLIC_LIMITED"],
    "basePrice": 5000,
    "active": true,
    "seoMetadata": {
      "pageTitle": "Annual ROC Filing Service",
      "metaDescription": "Professional assistance for Annual ROC Filing"
    },
    "requiredDocuments": [
      "FINANCIAL_STATEMENTS",
      "BOARD_RESOLUTION",
      "ANNUAL_RETURN"
    ],
    "deliverables": [
      "Filing Acknowledgment",
      "Compliance Certificate"
    ],
    "periodicityRules": {
      "isRecurring": true,
      "frequency": "YEARLY",
      "dueDateCalculation": "30 days after financial year end"
    },
    "prerequisites": []
  }
}
```

#### 3. Create Compliance Type

```
POST /api/compliance/types
```

Request Body:
```json
{
  "code": "GST_MONTHLY_RETURN",
  "name": "Monthly GST Return",
  "description": "Monthly filing of GST returns",
  "category": "TAX",
  "isStatutory": true,
  "regulatoryAuthority": "GST Council",
  "applicableEntityTypes": ["PRIVATE_LIMITED", "PUBLIC_LIMITED", "LLP"],
  "basePrice": 2000,
  "active": true,
  "requiredDocuments": [
    "SALES_REGISTER",
    "PURCHASE_REGISTER"
  ],
  "deliverables": [
    "GSTR Filing Acknowledgment"
  ],
  "periodicityRules": {
    "isRecurring": true,
    "frequency": "MONTHLY",
    "dueDateCalculation": "20th day of subsequent month"
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Compliance type created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "code": "GST_MONTHLY_RETURN",
    "name": "Monthly GST Return",
    "category": "TAX",
    "...": "..."
  }
}
```

#### 4. Update Compliance Type

```
PUT /api/compliance/types/:id
```

Request Body: Same as create endpoint with fields to update

Response:
```json
{
  "success": true,
  "message": "Compliance type updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "code": "GST_MONTHLY_RETURN",
    "...": "..."
  }
}
```

#### 5. Delete Compliance Type

```
DELETE /api/compliance/types/:id
```

Response:
```json
{
  "success": true,
  "message": "Compliance type deleted successfully"
}
```

#### 6. List Compliance Types by Category

```
GET /api/compliance/types/by-category/:category
```

Response: Same as list endpoint filtered by category

#### 7. List Compliance Types by Entity Type

```
GET /api/compliance/types/by-entity-type/:entityType
```

Response: Same as list endpoint filtered by entity type

### Compliance Requirement APIs

#### 1. List Compliance Requirements

```
GET /api/compliance/requirements
```

Query Parameters:
- `complianceTypeId` - Filter by compliance type
- `active` - Filter by active status
- `entityType` - Filter by applicable entity type
- `search` - Search by name or code
- `limit` - Limit results (default: 20)
- `page` - Page number (default: 1)

Response:
```json
{
  "success": true,
  "data": {
    "requirements": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "complianceTypeId": "60d21b4667d0d8992e610c85",
        "code": "AOC4_FILING",
        "name": "AOC-4 Filing",
        "frequency": "YEARLY",
        "active": true
      }
    ],
    "pagination": {
      "total": 30,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  }
}
```

#### 2. Get Compliance Requirement Details

```
GET /api/compliance/requirements/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "complianceTypeId": "60d21b4667d0d8992e610c85",
    "code": "AOC4_FILING",
    "name": "AOC-4 Filing",
    "description": "Filing of financial statements in Form AOC-4",
    "applicableToEntityTypes": ["PRIVATE_LIMITED", "PUBLIC_LIMITED"],
    "frequency": "YEARLY",
    "dueDateCalculation": {
      "baseDate": "FINANCIAL_YEAR_END",
      "offsetDays": 30,
      "fixedDay": null,
      "fixedMonth": null
    },
    "filingWindows": [
      {
        "name": "Normal Filing",
        "startOffsetDays": 0,
        "endOffsetDays": 30,
        "hasAdditionalFees": false
      },
      {
        "name": "Late Filing",
        "startOffsetDays": 31,
        "endOffsetDays": 90,
        "hasAdditionalFees": true,
        "additionalFeesDetails": "Additional fees of Rs. 100 per day"
      }
    ],
    "penalties": [
      {
        "description": "Late filing penalty",
        "amount": "Rs. 100 per day up to 100 days",
        "calculationMethod": "Fixed daily penalty"
      }
    ],
    "requiredDocuments": [
      {
        "documentTypeCode": "FINANCIAL_STATEMENTS",
        "name": "Financial Statements",
        "description": "Audited financial statements",
        "isOptional": false
      },
      {
        "documentTypeCode": "BOARD_RESOLUTION",
        "name": "Board Resolution",
        "description": "Board resolution approving financial statements",
        "isOptional": false
      }
    ],
    "requiredForms": [
      {
        "formCode": "AOC4",
        "name": "Form AOC-4",
        "description": "Form for filing financial statements with ROC",
        "templateUrl": "/templates/aoc4.pdf"
      }
    ],
    "deliverables": [
      {
        "name": "Filing Acknowledgment",
        "description": "Acknowledgment from MCA portal",
        "format": "PDF"
      }
    ],
    "active": true
  }
}
```

#### 3. Create Compliance Requirement

```
POST /api/compliance/requirements
```

Request Body: JSON object with compliance requirement fields

Response:
```json
{
  "success": true,
  "message": "Compliance requirement created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "code": "AOC4_FILING",
    "...": "..."
  }
}
```

#### 4. Update Compliance Requirement

```
PUT /api/compliance/requirements/:id
```

Request Body: Same as create endpoint with fields to update

Response:
```json
{
  "success": true,
  "message": "Compliance requirement updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "...": "..."
  }
}
```

#### 5. Delete Compliance Requirement

```
DELETE /api/compliance/requirements/:id
```

Response:
```json
{
  "success": true,
  "message": "Compliance requirement deleted successfully"
}
```

#### 6. List Requirements by Compliance Type

```
GET /api/compliance/requirements/by-type/:typeId
```

Response: Same as list endpoint filtered by compliance type ID

#### 7. List Requirements by Entity Type

```
GET /api/compliance/requirements/by-entity-type/:entityType
```

Response: Same as list endpoint filtered by entity type

### Customer Compliance APIs

#### 1. List Customer Compliances

```
GET /api/customer-compliance
```

Query Parameters:
- `entityId` - Filter by entity
- `status` - Filter by status
- `complianceTypeId` - Filter by compliance type
- `dueStartDate` - Filter by due date range start
- `dueEndDate` - Filter by due date range end
- `isRecurring` - Filter by recurring status
- `limit` - Limit results (default: 20)
- `page` - Page number (default: 1)

Response:
```json
{
  "success": true,
  "data": {
    "compliances": [
      {
        "_id": "60d21b4667d0d8992e610c88",
        "entityId": "60d21b4667d0d8992e610c89",
        "complianceTypeId": "60d21b4667d0d8992e610c85",
        "complianceRequirementId": "60d21b4667d0d8992e610c87",
        "applicationStatusCode": "COMPLIANCE_DUE",
        "dueDate": "2023-04-30T00:00:00.000Z",
        "isRecurring": true
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

#### 2. Get Customer Compliance Details

```
GET /api/customer-compliance/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "entityId": "60d21b4667d0d8992e610c89",
    "entityName": "XYZ Pvt Ltd",
    "userId": "60d21b4667d0d8992e610c90",
    "complianceTypeId": "60d21b4667d0d8992e610c85",
    "complianceTypeName": "Annual ROC Filing",
    "complianceRequirementId": "60d21b4667d0d8992e610c87",
    "complianceRequirementName": "AOC-4 Filing",
    "applicationStatusCode": "COMPLIANCE_DUE",
    "statusHistory": [
      {
        "statusCode": "COMPLIANCE_DUE",
        "updatedAt": "2023-03-01T00:00:00.000Z",
        "updatedBy": "60d21b4667d0d8992e610c91",
        "updatedByName": "John Doe",
        "notes": "Initial status"
      }
    ],
    "startDate": "2023-03-01T00:00:00.000Z",
    "dueDate": "2023-04-30T00:00:00.000Z",
    "completionDate": null,
    "assignedToUserId": "60d21b4667d0d8992e610c91",
    "assignedToName": "John Doe",
    "currentStageId": "60d21b4667d0d8992e610c92",
    "currentStageName": "Document Collection",
    "stageHistory": [
      {
        "stageId": "60d21b4667d0d8992e610c92",
        "stageName": "Document Collection",
        "startedAt": "2023-03-01T00:00:00.000Z",
        "completedAt": null,
        "assignedTo": "60d21b4667d0d8992e610c91",
        "assignedToName": "John Doe"
      }
    ],
    "isRecurring": true,
    "frequency": "YEARLY",
    "nextOccurrence": {
      "dueDate": "2024-04-30T00:00:00.000Z",
      "generationDate": null,
      "status": "PENDING"
    },
    "compliancePeriods": [
      {
        "periodName": "FY 2022-23",
        "startDate": "2022-04-01T00:00:00.000Z",
        "endDate": "2023-03-31T00:00:00.000Z",
        "dueDate": "2023-04-30T00:00:00.000Z",
        "filingDate": null,
        "status": "PENDING",
        "documents": []
      }
    ],
    "notes": [
      {
        "text": "Reached out to client for financial statements",
        "createdBy": "60d21b4667d0d8992e610c91",
        "createdByName": "John Doe",
        "createdAt": "2023-03-15T00:00:00.000Z",
        "isInternal": true
      }
    ],
    "tags": ["high-priority", "2022-23"]
  }
}
```

#### 3. Create Customer Compliance

```
POST /api/customer-compliance
```

Request Body:
```json
{
  "entityId": "60d21b4667d0d8992e610c89",
  "complianceTypeId": "60d21b4667d0d8992e610c85",
  "complianceRequirementId": "60d21b4667d0d8992e610c87",
  "dueDate": "2023-04-30T00:00:00.000Z",
  "assignedToUserId": "60d21b4667d0d8992e610c91",
  "isRecurring": true,
  "frequency": "YEARLY",
  "compliancePeriods": [
    {
      "periodName": "FY 2022-23",
      "startDate": "2022-04-01T00:00:00.000Z",
      "endDate": "2023-03-31T00:00:00.000Z",
      "dueDate": "2023-04-30T00:00:00.000Z",
      "status": "PENDING"
    }
  ],
  "tags": ["high-priority", "2022-23"]
}
```

Response:
```json
{
  "success": true,
  "message": "Customer compliance created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "...": "..."
  }
}
```

#### 4. Update Customer Compliance

```
PUT /api/customer-compliance/:id
```

Request Body: Same as create endpoint with fields to update

Response:
```json
{
  "success": true,
  "message": "Customer compliance updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "...": "..."
  }
}
```

#### 5. Delete Customer Compliance

```
DELETE /api/customer-compliance/:id
```

Response:
```json
{
  "success": true,
  "message": "Customer compliance deleted successfully"
}
```

#### 6. List Compliances by Entity

```
GET /api/customer-compliance/by-entity/:entityId
```

Response: Same as list endpoint filtered by entity ID

#### 7. List Compliances by Status

```
GET /api/customer-compliance/by-status/:status
```

Response: Same as list endpoint filtered by status

#### 8. Update Compliance Status

```
PUT /api/customer-compliance/:id/status
```

Request Body:
```json
{
  "statusCode": "DOCS_PENDING",
  "notes": "Waiting for client to provide financial statements"
}
```

Response:
```json
{
  "success": true,
  "message": "Compliance status updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c88",
    "applicationStatusCode": "DOCS_PENDING",
    "statusHistory": [
      {
        "statusCode": "COMPLIANCE_DUE",
        "updatedAt": "2023-03-01T00:00:00.000Z",
        "updatedBy": "60d21b4667d0d8992e610c91",
        "notes": "Initial status"
      },
      {
        "statusCode": "DOCS_PENDING",
        "updatedAt": "2023-03-15T00:00:00.000Z",
        "updatedBy": "60d21b4667d0d8992e610c91",
        "notes": "Waiting for client to provide financial statements"
      }
    ]
  }
}
```

#### 9. Get Compliance Status History

```
GET /api/customer-compliance/:id/history
```

Response:
```json
{
  "success": true,
  "data": {
    "statusHistory": [
      {
        "statusCode": "COMPLIANCE_DUE",
        "statusName": "Compliance Due",
        "updatedAt": "2023-03-01T00:00:00.000Z",
        "updatedBy": "60d21b4667d0d8992e610c91",
        "updatedByName": "John Doe",
        "notes": "Initial status"
      },
      {
        "statusCode": "DOCS_PENDING",
        "statusName": "Documents Pending",
        "updatedAt": "2023-03-15T00:00:00.000Z",
        "updatedBy": "60d21b4667d0d8992e610c91",
        "updatedByName": "John Doe",
        "notes": "Waiting for client to provide financial statements"
      }
    ]
  }
}
```

#### 10. Get Associated Documents

```
GET /api/customer-compliance/:id/documents
```

Response:
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "_id": "60d21b4667d0d8992e610c93",
        "complianceId": "60d21b4667d0d8992e610c88",
        "documentType": "FINANCIAL_STATEMENTS",
        "name": "Financial Statements 2022-23",
        "status": "UPLOADED",
        "uploadedAt": "2023-03-20T00:00:00.000Z",
        "uploadedBy": "60d21b4667d0d8992e610c90",
        "uploadedByName": "Client User",
        "verificationStatus": "PENDING"
      }
    ]
  }
}
```

#### 11. Add Compliance Note

```
POST /api/customer-compliance/:id/notes
```

Request Body:
```json
{
  "text": "Client has promised to send documents by next week",
  "isInternal": true
}
```

Response:
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    "notes": [
      {
        "text": "Reached out to client for financial statements",
        "createdBy": "60d21b4667d0d8992e610c91",
        "createdByName": "John Doe",
        "createdAt": "2023-03-15T00:00:00.000Z",
        "isInternal": true
      },
      {
        "text": "Client has promised to send documents by next week",
        "createdBy": "60d21b4667d0d8992e610c91",
        "createdByName": "John Doe",
        "createdAt": "2023-03-22T00:00:00.000Z",
        "isInternal": true
      }
    ]
  }
}
```

### Compliance Calendar APIs

#### 1. Get Entity Compliance Calendar

```
GET /api/compliance-calendar/entity/:entityId
```

Query Parameters:
- `year` - Calendar year (default: current year)
- `month` - Calendar month (optional, if provided shows only that month)

Response:
```json
{
  "success": true,
  "data": {
    "entityId": "60d21b4667d0d8992e610c89",
    "entityName": "XYZ Pvt Ltd",
    "year": 2023,
    "month": null,
    "entries": [
      {
        "complianceId": "60d21b4667d0d8992e610c88",
        "complianceTypeId": "60d21b4667d0d8992e610c85",
        "name": "AOC-4 Filing",
        "description": "Annual filing of financial statements",
        "dueDate": "2023-04-30T00:00:00.000Z",
        "status": "UPCOMING",
        "priority": "HIGH"
      },
      {
        "complianceId": "60d21b4667d0d8992e610c94",
        "complianceTypeId": "60d21b4667d0d8992e610c95",
        "name": "GST Annual Return",
        "description": "Filing of annual GST return",
        "dueDate": "2023-12-31T00:00:00.000Z",
        "status": "UPCOMING",
        "priority": "MEDIUM"
      }
    ],
    "lastUpdated": "2023-03-01T00:00:00.000Z"
  }
}
```

#### 2. Get Monthly Calendar View

```
GET /api/compliance-calendar/entity/:entityId/year/:year/month/:month
```

Response: Same as the entity calendar endpoint but filtered for the specific month

#### 3. Calculate/Recalculate Calendar

```
POST /api/compliance-calendar/entity/:entityId/calculate
```

Request Body:
```json
{
  "year": 2023,
  "forceRefresh": true
}
```

Response:
```json
{
  "success": true,
  "message": "Compliance calendar calculated successfully",
  "data": {
    "entityId": "60d21b4667d0d8992e610c89",
    "year": 2023,
    "entriesCount": 12,
    "lastCalculated": "2023-03-22T00:00:00.000Z"
  }
}
```

#### 4. Get Upcoming Compliance Deadlines

```
GET /api/compliance-calendar/upcoming
```

Query Parameters:
- `entityId` - Filter by entity (optional)
- `days` - Number of days ahead to look (default: 30)
- `limit` - Limit results (default: 20)

Response:
```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "complianceId": "60d21b4667d0d8992e610c88",
        "entityId": "60d21b4667d0d8992e610c89",
        "entityName": "XYZ Pvt Ltd",
        "name": "AOC-4 Filing",
        "dueDate": "2023-04-30T00:00:00.000Z",
        "daysRemaining": 28,
        "status": "UPCOMING",
        "priority": "HIGH"
      }
    ]
  }
}
```

#### 5. Get Overdue Compliances

```
GET /api/compliance-calendar/overdue
```

Query Parameters:
- `entityId` - Filter by entity (optional)
- `limit` - Limit results (default: 20)

Response:
```json
{
  "success": true,
  "data": {
    "overdue": [
      {
        "complianceId": "60d21b4667d0d8992e610c96",
        "entityId": "60d21b4667d0d8992e610c97",
        "entityName": "ABC Pvt Ltd",
        "name": "Income Tax Return",
        "dueDate": "2023-03-15T00:00:00.000Z",
        "daysOverdue": 7,
        "status": "OVERDUE",
        "priority": "HIGH"
      }
    ]
  }
}
```

### Compliance Document APIs

#### 1. List Documents for Compliance

```
GET /api/compliance-documents/compliance/:complianceId
```

Response:
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "_id": "60d21b4667d0d8992e610c93",
        "complianceId": "60d21b4667d0d8992e610c88",
        "documentType": "FINANCIAL_STATEMENTS",
        "name": "Financial Statements 2022-23",
        "description": "Audited financial statements",
        "status": "UPLOADED",
        "verificationStatus": "PENDING",
        "uploadedAt": "2023-03-20T00:00:00.000Z",
        "uploadedBy": "60d21b4667d0d8992e610c90",
        "fileUrl": "/documents/60d21b4667d0d8992e610c93.pdf",
        "fileType": "application/pdf",
        "fileSize": 2048576
      }
    ]
  }
}
```

#### 2. Upload Compliance Document

```
POST /api/compliance-documents
```

Request Body:
```json
{
  "entityId": "60d21b4667d0d8992e610c89",
  "complianceId": "60d21b4667d0d8992e610c88",
  "documentType": "BOARD_RESOLUTION",
  "name": "Board Resolution for Financial Statements",
  "description": "Board resolution approving financial statements",
  "file": [Multipart file upload]
}
```

Response:
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c98",
    "complianceId": "60d21b4667d0d8992e610c88",
    "documentType": "BOARD_RESOLUTION",
    "name": "Board Resolution for Financial Statements",
    "status": "UPLOADED",
    "verificationStatus": "PENDING",
    "fileUrl": "/documents/60d21b4667d0d8992e610c98.pdf"
  }
}
```

#### 3. Get Document Details

```
GET /api/compliance-documents/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c98",
    "entityId": "60d21b4667d0d8992e610c89",
    "complianceId": "60d21b4667d0d8992e610c88",
    "documentType": "BOARD_RESOLUTION",
    "name": "Board Resolution for Financial Statements",
    "description": "Board resolution approving financial statements",
    "status": "UPLOADED",
    "uploadedAt": "2023-03-22T00:00:00.000Z",
    "uploadedBy": "60d21b4667d0d8992e610c90",
    "uploadedByName": "Client User",
    "verificationStatus": "PENDING",
    "verifiedAt": null,
    "verifiedBy": null,
    "verificationNotes": null,
    "fileUrl": "/documents/60d21b4667d0d8992e610c98.pdf",
    "filePath": "/storage/documents/60d21b4667d0d8992e610c98.pdf",
    "fileType": "application/pdf",
    "fileSize": 1048576,
    "tags": []
  }
}
```

#### 4. Update Document Metadata

```
PUT /api/compliance-documents/:id
```

Request Body:
```json
{
  "name": "Updated Board Resolution Name",
  "description": "Updated description",
  "tags": ["important", "board-approval"]
}
```

Response:
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c98",
    "name": "Updated Board Resolution Name",
    "description": "Updated description",
    "tags": ["important", "board-approval"]
  }
}
```

#### 5. Delete Document

```
DELETE /api/compliance-documents/:id
```

Response:
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

#### 6. Verify Document

```
PUT /api/compliance-documents/:id/verify
```

Request Body:
```json
{
  "verificationStatus": "VERIFIED",
  "verificationNotes": "Document verified and found to be in order"
}
```

Response:
```json
{
  "success": true,
  "message": "Document verification updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c98",
    "verificationStatus": "VERIFIED",
    "verifiedAt": "2023-03-23T00:00:00.000Z",
    "verifiedBy": "60d21b4667d0d8992e610c91",
    "verificationNotes": "Document verified and found to be in order"
  }
}
```

#### 7. Get Document Templates

```
GET /api/compliance-documents/templates
```

Query Parameters:
- `complianceTypeId` - Filter by compliance type
- `documentType` - Filter by document type

Response:
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "_id": "60d21b4667d0d8992e610c99",
        "documentType": "BOARD_RESOLUTION",
        "name": "Board Resolution Template for Financial Statements",
        "description": "Standard template for board resolution approving financial statements",
        "isTemplate": true,
        "fileUrl": "/templates/board_resolution_financial_statements.docx",
        "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }
    ]
  }
}
```

## Error Handling

All API endpoints follow a standard error response format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "The request contains invalid input parameters",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```

Common error codes:
- `INVALID_INPUT` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_ERROR` - Server error

## API Versioning

The API will be versioned to ensure backward compatibility. The initial version will be v1:

```
/api/v1/compliance/...
```

Future versions will use a different prefix:

```
/api/v2/compliance/...
```

## Rate Limiting

API endpoints are subject to rate limiting:
- 60 requests per minute for regular users
- 300 requests per minute for compliance officers and admins

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1679486400