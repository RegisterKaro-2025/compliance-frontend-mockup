# Compliance Integration Deployment & Migration Guide

## Overview

This document provides step-by-step instructions for deploying the compliance integration to the existing customer portal backend. It includes database migrations, environment setup, deployment procedures, and rollback strategies.

## Pre-Deployment Checklist

### 1. Environment Requirements

```bash
# Node.js version
node --version  # Should be >= 18.0.0

# MongoDB version
mongod --version  # Should be >= 5.0.0

# Redis version (for caching and sessions)
redis-server --version  # Should be >= 6.0.0

# Required environment variables
PORTAL_ENCRYPTION_KEY=your_encryption_key_here
GST_PORTAL_APP_KEY=your_gst_app_key
MCA_PORTAL_CERTIFICATE_PATH=/path/to/dsc/certificate
INCOME_TAX_PORTAL_API_KEY=your_income_tax_api_key
```

### 2. Dependencies Check

```bash
# Install new dependencies
npm install crypto-js
npm install node-cron
npm install puppeteer
npm install redis
npm install @aws-sdk/client-s3  # For document storage

# Development dependencies
npm install --save-dev supertest
npm install --save-dev puppeteer
npm install --save-dev jest-extended
```

### 3. Database Backup

```bash
# Create backup before migration
mongodump --host localhost:27017 --db customer_portal --out ./backup/pre-compliance-$(date +%Y%m%d_%H%M%S)

# Verify backup
ls -la ./backup/
```

## Database Migration

### Phase 1: Schema Extensions

#### Step 1: Create New Collections

```javascript
// migrations/001_create_compliance_collections.js
const { MongoClient } = require('mongodb');

async function up(db) {
  console.log('Creating compliance collections...');
  
  // Create collections with validation
  await db.createCollection('complianceservices', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['entityId', 'complianceType', 'dueDate'],
        properties: {
          entityId: { bsonType: 'objectId' },
          complianceType: { 
            enum: [
              'GST_FILING', 'INCOME_TAX_FILING', 'ROC_COMPLIANCE',
              'LABOR_COMPLIANCE', 'ENVIRONMENTAL_COMPLIANCE'
            ]
          },
          dueDate: { bsonType: 'date' },
          status: {
            enum: [
              'SCHEDULED', 'IN_PREPARATION', 'UNDER_REVIEW',
              'READY_TO_FILE', 'FILED', 'ACKNOWLEDGED', 'COMPLETED'
            ]
          }
        }
      }
    }
  });

  await db.createCollection('compliancestatuses');
  await db.createCollection('compliancestages');
  await db.createCollection('governmentportalintegrations');
  await db.createCollection('compliancecalendars');

  console.log('Compliance collections created successfully');
}

async function down(db) {
  console.log('Dropping compliance collections...');
  
  const collections = [
    'complianceservices',
    'compliancestatuses', 
    'compliancestages',
    'governmentportalintegrations',
    'compliancecalendars'
  ];

  for (const collection of collections) {
    await db.collection(collection).drop();
  }

  console.log('Compliance collections dropped');
}

module.exports = { up, down };
```

#### Step 2: Add Indexes

```javascript
// migrations/002_add_compliance_indexes.js
async function up(db) {
  console.log('Adding compliance indexes...');

  // ComplianceService indexes
  await db.collection('complianceservices').createIndex({ entityId: 1, complianceType: 1 });
  await db.collection('complianceservices').createIndex({ dueDate: 1, status: 1 });
  await db.collection('complianceservices').createIndex({ isRecurring: 1, 'recurringPattern.nextDueDate': 1 });
  await db.collection('complianceservices').createIndex({ regulatoryAuthority: 1, status: 1 });
  await db.collection('complianceservices').createIndex({ complianceServiceNumber: 1 }, { unique: true });

  // ComplianceCalendar indexes
  await db.collection('compliancecalendars').createIndex({ entityId: 1, dueDate: 1 });
  await db.collection('compliancecalendars').createIndex({ complianceType: 1, status: 1 });
  await db.collection('compliancecalendars').createIndex({ priority: 1, dueDate: 1 });

  // GovernmentPortalIntegration indexes
  await db.collection('governmentportalintegrations').createIndex(
    { entityId: 1, portalType: 1 }, 
    { unique: true }
  );
  await db.collection('governmentportalintegrations').createIndex({ integrationStatus: 1 });
  await db.collection('governmentportalintegrations').createIndex({ lastSyncDate: 1 });

  // ComplianceStage indexes
  await db.collection('compliancestages').createIndex({ code: 1 }, { unique: true });
  await db.collection('compliancestages').createIndex({ complianceServiceId: 1, sequence: 1 });

  console.log('Compliance indexes created successfully');
}

async function down(db) {
  console.log('Dropping compliance indexes...');
  
  const collections = ['complianceservices', 'compliancecalendars', 'governmentportalintegrations', 'compliancestages'];
  
  for (const collection of collections) {
    await db.collection(collection).dropIndexes();
  }

  console.log('Compliance indexes dropped');
}

module.exports = { up, down };
```

#### Step 3: Extend Existing Collections

```javascript
// migrations/003_extend_existing_collections.js
async function up(db) {
  console.log('Extending existing collections...');

  // Extend Entity collection
  await db.collection('entities').updateMany(
    {},
    {
      $set: {
        'complianceProfile.complianceSettings.autoFileEnabled': false,
        'complianceProfile.complianceSettings.reminderPreferences.email': true,
        'complianceProfile.complianceSettings.reminderPreferences.sms': false,
        'complianceProfile.complianceSettings.reminderPreferences.push': true,
        'complianceProfile.complianceSettings.reminderPreferences.daysBefore': 7,
        'complianceProfile.complianceSettings.penaltyAlerts': true,
        'complianceProfile.complianceStats.totalCompliances': 0,
        'complianceProfile.complianceStats.completedOnTime': 0,
        'complianceProfile.complianceStats.overdue': 0,
        'complianceProfile.complianceStats.totalPenalties': 0
      }
    }
  );

  // Extend CustomerService collection
  await db.collection('customerservices').updateMany(
    {},
    {
      $set: {
        'isComplianceService': false
      }
    }
  );

  // Extend Document collection
  await db.collection('documents').updateMany(
    {},
    {
      $set: {
        'isComplianceDocument': false
      }
    }
  );

  console.log('Existing collections extended successfully');
}

async function down(db) {
  console.log('Removing compliance fields from existing collections...');

  // Remove from Entity collection
  await db.collection('entities').updateMany(
    {},
    {
      $unset: {
        'complianceProfile': 1
      }
    }
  );

  // Remove from CustomerService collection
  await db.collection('customerservices').updateMany(
    {},
    {
      $unset: {
        'isComplianceService': 1,
        'complianceServiceId': 1,
        'complianceMetadata': 1
      }
    }
  );

  // Remove from Document collection
  await db.collection('documents').updateMany(
    {},
    {
      $unset: {
        'isComplianceDocument': 1,
        'complianceType': 1,
        'filingReference': 1,
        'governmentPortalId': 1,
        'complianceMetadata': 1
      }
    }
  );

  console.log('Compliance fields removed from existing collections');
}

module.exports = { up, down };
```

### Phase 2: Seed Data

#### Step 1: Compliance Statuses

```javascript
// migrations/004_seed_compliance_statuses.js
async function up(db) {
  console.log('Seeding compliance statuses...');

  const statuses = [
    {
      code: 'SCHEDULED',
      name: 'Scheduled',
      description: 'Compliance is scheduled for future date',
      complianceType: 'PENDING',
      isTerminal: false,
      requiresAction: false,
      penaltyApplicable: false,
      color: '#3498db',
      displayOrder: 1,
      status: 'ACTIVE'
    },
    {
      code: 'IN_PREPARATION',
      name: 'In Preparation',
      description: 'Documents and data being prepared',
      complianceType: 'IN_PROGRESS',
      isTerminal: false,
      requiresAction: true,
      penaltyApplicable: false,
      color: '#f39c12',
      displayOrder: 2,
      status: 'ACTIVE'
    },
    {
      code: 'UNDER_REVIEW',
      name: 'Under Review',
      description: 'Compliance under internal review',
      complianceType: 'IN_PROGRESS',
      isTerminal: false,
      requiresAction: true,
      penaltyApplicable: false,
      color: '#e67e22',
      displayOrder: 3,
      status: 'ACTIVE'
    },
    {
      code: 'READY_TO_FILE',
      name: 'Ready to File',
      description: 'Ready for government portal filing',
      complianceType: 'IN_PROGRESS',
      isTerminal: false,
      requiresAction: true,
      penaltyApplicable: false,
      color: '#9b59b6',
      displayOrder: 4,
      status: 'ACTIVE'
    },
    {
      code: 'FILED',
      name: 'Filed',
      description: 'Filed with government portal',
      complianceType: 'FILED',
      isTerminal: false,
      requiresAction: false,
      penaltyApplicable: false,
      color: '#2ecc71',
      displayOrder: 5,
      status: 'ACTIVE'
    },
    {
      code: 'ACKNOWLEDGED',
      name: 'Acknowledged',
      description: 'Acknowledged by government portal',
      complianceType: 'APPROVED',
      isTerminal: false,
      requiresAction: false,
      penaltyApplicable: false,
      color: '#27ae60',
      displayOrder: 6,
      status: 'ACTIVE'
    },
    {
      code: 'COMPLETED',
      name: 'Completed',
      description: 'Compliance completed successfully',
      complianceType: 'COMPLETED',
      isTerminal: true,
      requiresAction: false,
      penaltyApplicable: false,
      color: '#16a085',
      displayOrder: 7,
      status: 'ACTIVE'
    },
    {
      code: 'OVERDUE',
      name: 'Overdue',
      description: 'Compliance is overdue',
      complianceType: 'OVERDUE',
      isTerminal: false,
      requiresAction: true,
      penaltyApplicable: true,
      color: '#e74c3c',
      displayOrder: 8,
      status: 'ACTIVE'
    },
    {
      code: 'REJECTED',
      name: 'Rejected',
      description: 'Filing rejected by government portal',
      complianceType: 'REJECTED',
      isTerminal: false,
      requiresAction: true,
      penaltyApplicable: false,
      color: '#c0392b',
      displayOrder: 9,
      status: 'ACTIVE'
    },
    {
      code: 'CANCELLED',
      name: 'Cancelled',
      description: 'Compliance cancelled',
      complianceType: 'CANCELLED',
      isTerminal: true,
      requiresAction: false,
      penaltyApplicable: false,
      color: '#95a5a6',
      displayOrder: 10,
      status: 'ACTIVE'
    }
  ];

  await db.collection('compliancestatuses').insertMany(statuses);
  console.log(`Inserted ${statuses.length} compliance statuses`);
}

async function down(db) {
  await db.collection('compliancestatuses').deleteMany({});
  console.log('Compliance statuses removed');
}

module.exports = { up, down };
```

#### Step 2: Default Compliance Stages

```javascript
// migrations/005_seed_compliance_stages.js
async function up(db) {
  console.log('Seeding default compliance stages...');

  const stages = [
    {
      code: 'DOC_PREPARATION',
      name: 'Document Preparation',
      description: 'Prepare all required documents and data',
      sequence: 0,
      stageType: 'PREPARATION',
      estimatedDuration: { value: 3, unit: 'DAYS' },
      governmentPortalRequired: false,
      automationCapable: false,
      status: 'ACTIVE'
    },
    {
      code: 'INTERNAL_REVIEW',
      name: 'Internal Review',
      description: 'Internal review and verification',
      sequence: 1,
      stageType: 'REVIEW',
      estimatedDuration: { value: 1, unit: 'DAYS' },
      governmentPortalRequired: false,
      automationCapable: false,
      verificationRequirements: {
        internalVerification: {
          required: true,
          verifierRole: 'COMPLIANCE_OFFICER',
          verificationCriteria: ['Document completeness', 'Data accuracy', 'Regulatory compliance']
        }
      },
      status: 'ACTIVE'
    },
    {
      code: 'APPROVAL',
      name: 'Approval',
      description: 'Final approval before filing',
      sequence: 2,
      stageType: 'APPROVAL',
      estimatedDuration: { value: 4, unit: 'HOURS' },
      governmentPortalRequired: false,
      automationCapable: false,
      status: 'ACTIVE'
    },
    {
      code: 'PORTAL_FILING',
      name: 'Portal Filing',
      description: 'File with government portal',
      sequence: 3,
      stageType: 'FILING',
      estimatedDuration: { value: 2, unit: 'HOURS' },
      governmentPortalRequired: true,
      automationCapable: true,
      automationConfig: {
        enabled: true,
        automationType: 'ASSISTED',
        requiredApprovals: [
          { approverRole: 'COMPLIANCE_OFFICER', required: true }
        ]
      },
      status: 'ACTIVE'
    },
    {
      code: 'VERIFICATION',
      name: 'Verification',
      description: 'Verify filing status and acknowledgment',
      sequence: 4,
      stageType: 'VERIFICATION',
      estimatedDuration: { value: 1, unit: 'DAYS' },
      governmentPortalRequired: true,
      automationCapable: true,
      status: 'ACTIVE'
    },
    {
      code: 'COMPLETION',
      name: 'Completion',
      description: 'Mark compliance as completed',
      sequence: 5,
      stageType: 'COMPLETION',
      estimatedDuration: { value: 1, unit: 'HOURS' },
      governmentPortalRequired: false,
      automationCapable: true,
      status: 'ACTIVE'
    }
  ];

  await db.collection('compliancestages').insertMany(stages);
  console.log(`Inserted ${stages.length} compliance stages`);
}

async function down(db) {
  await db.collection('compliancestages').deleteMany({});
  console.log('Compliance stages removed');
}

module.exports = { up, down };
```

## Application Deployment

### Phase 1: Backend Deployment

#### Step 1: Environment Configuration

```bash
# Create compliance-specific environment variables
cat >> .env << EOF

# Compliance Integration Settings
COMPLIANCE_MODULE_ENABLED=true
COMPLIANCE_AUTO_FILING_ENABLED=false
COMPLIANCE_NOTIFICATION_ENABLED=true

# Government Portal Credentials (encrypted)
PORTAL_ENCRYPTION_KEY=${PORTAL_ENCRYPTION_KEY}
GST_PORTAL_APP_KEY=${GST_PORTAL_APP_KEY}
MCA_PORTAL_CERTIFICATE_PATH=${MCA_PORTAL_CERTIFICATE_PATH}
INCOME_TAX_PORTAL_API_KEY=${INCOME_TAX_PORTAL_API_KEY}

# Compliance Caching
COMPLIANCE_CACHE_TTL=3600
COMPLIANCE_SYNC_INTERVAL=86400

# Compliance File Storage
COMPLIANCE_STORAGE_BUCKET=compliance-documents
COMPLIANCE_STORAGE_REGION=ap-south-1

EOF
```

#### Step 2: Deploy New Models

```bash
# Copy compliance models to existing models directory
cp compliance-mockup-documentation/backend-extensions/models/* customer-portal-backend/models/

# Verify models are properly integrated
node -e "
const ComplianceService = require('./customer-portal-backend/models/ComplianceService');
console.log('ComplianceService model loaded successfully');
"
```

#### Step 3: Deploy Services and Controllers

```bash
# Create compliance service directory
mkdir -p customer-portal-backend/services/compliance
mkdir -p customer-portal-backend/controllers/compliance

# Deploy service files
cp compliance-services/* customer-portal-backend/services/compliance/
cp compliance-controllers/* customer-portal-backend/controllers/compliance/

# Update main app.js to include compliance routes
cat >> customer-portal-backend/app.js << EOF

// Compliance routes
if (process.env.COMPLIANCE_MODULE_ENABLED === 'true') {
  const complianceRoutes = require('./routes/compliance');
  app.use('/api/v1/compliance', complianceRoutes);
}
EOF
```

#### Step 4: Deploy Routes

```bash
# Create compliance routes
mkdir -p customer-portal-backend/routes/compliance

# Deploy route files
cp compliance-routes/* customer-portal-backend/routes/compliance/

# Create main compliance routes file
cat > customer-portal-backend/routes/compliance/index.js << EOF
const express = require('express');
const router = express.Router();

// Import compliance route modules
const serviceRoutes = require('./services');
const calendarRoutes = require('./calendar');
const portalRoutes = require('./portals');
const analyticsRoutes = require('./analytics');
const notificationRoutes = require('./notifications');

// Mount routes
router.use('/services', serviceRoutes);
router.use('/calendar', calendarRoutes);
router.use('/portals', portalRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
EOF
```

### Phase 2: Database Migration Execution

```bash
# Run database migrations
cd customer-portal-backend

# Execute migrations in order
node migrations/001_create_compliance_collections.js
node migrations/002_add_compliance_indexes.js
node migrations/003_extend_existing_collections.js
node migrations/004_seed_compliance_statuses.js
node migrations/005_seed_compliance_stages.js

# Verify migration success
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.db.listCollections().toArray((err, collections) => {
  const complianceCollections = collections.filter(c => c.name.includes('compliance'));
  console.log('Compliance collections:', complianceCollections.map(c => c.name));
  process.exit(0);
});
"
```

### Phase 3: Service Startup

```bash
# Install dependencies
npm install

# Run tests to verify integration
npm run test:compliance

# Start application with compliance module
COMPLIANCE_MODULE_ENABLED=true npm start
```

## Frontend Integration

### Phase 1: Next.js Frontend Deployment

#### Step 1: Install Dependencies

```bash
cd customer-portal-customer-portal-frontend

# Install compliance-specific dependencies
npm install @radix-ui/react-calendar
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install recharts
npm install date-fns
```

#### Step 2: Deploy Compliance Components

```bash
# Create compliance module structure
mkdir -p src/app/compliance
mkdir -p src/components/compliance
mkdir -p src/hooks/compliance
mkdir -p src/api-services/compliance

# Deploy compliance pages
cp -r compliance-frontend-pages/* src/app/compliance/

# Deploy compliance components
cp -r compliance-frontend-components/* src/components/compliance/

# Deploy API services
cp -r compliance-api-services/* src/api-services/compliance/
```

#### Step 3: Update Navigation

```javascript
// src/components/shared/Navigation.tsx
const navigationItems = [
  // ... existing items
  {
    name: 'Compliance',
    href: '/compliance',
    icon: ClipboardDocumentCheckIcon,
    children: [
      { name: 'Dashboard', href: '/compliance/dashboard' },
      { name: 'Calendar', href: '/compliance/calendar' },
      { name: 'Services', href: '/compliance/services' },
      { name: 'Reports', href: '/compliance/reports' }
    ]
  }
];
```

### Phase 2: Employee Portal Deployment

```bash
cd customer-portal-employee-portal-frontend

# Deploy employee compliance components
mkdir -p src/app/(admin)/compliance
cp -r compliance-employee-pages/* src/app/(admin)/compliance/

# Update admin navigation
# Add compliance management to admin menu
```

## Testing Deployment

### Phase 1: Smoke Tests

```bash
# Test basic API endpoints
curl -X GET http://localhost:3000/api/v1/compliance/services \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json"

# Test compliance service creation
curl -X POST http://localhost:3000/api/v1/compliance/services \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entityId": "test_entity_id",
    "complianceType": "GST_FILING",
    "complianceName": "Test GST Filing",
    "dueDate": "2024-04-20T00:00:00.000Z"
  }'
```

### Phase 2: Integration Tests

```bash
# Run compliance integration tests
npm run test:integration:compliance

# Run end-to-end tests
npm run test:e2e:compliance
```

### Phase 3: Performance Tests

```bash
# Load test compliance endpoints
npx artillery run compliance-load-test.yml

# Monitor database performance
mongostat --host localhost:27017
```

## Monitoring Setup

### Phase 1: Application Monitoring

```javascript
// Add compliance-specific metrics
const complianceMetrics = {
  compliance_services_created: new prometheus.Counter({
    name: 'compliance_services_created_total',
    help: 'Total number of compliance services created'
  }),
  compliance_filings_completed: new prometheus.Counter({
    name: 'compliance_filings_completed_total',
    help: 'Total number of successful compliance filings'
  }),
  portal_sync_duration: new prometheus.Histogram({
    name: 'portal_sync_duration_seconds',
    help: 'Duration of portal synchronization operations'
  })
};
```

### Phase 2: Database Monitoring

```bash
# Set up MongoDB monitoring
mongotop --host localhost:27017

# Monitor compliance collection performance
db.complianceservices.getIndexes()
db.complianceservices.stats()
```

### Phase 3: Log Aggregation

```bash
# Configure log aggregation for compliance operations
# Add to existing logging configuration

{
  "compliance": {
    "level": "info",
    "format": "json",
    "transports": [
      {
        "type": "file",
        "filename": "logs/compliance.log",
        "maxsize": "10MB",
        "maxFiles": 5
      },
      {
        "type": "elasticsearch",
        "index": "compliance-logs"
      }
    ]
  }
}
```

## Rollback Strategy

### Phase 1: Application Rollback

```bash
# Stop application
pm2 stop customer-portal-backend

# Revert to previous version
git checkout previous-stable-tag

# Disable compliance module
export COMPLIANCE_MODULE_ENABLED=false

# Restart application
pm2 start customer-portal-backend
```

### Phase 2: Database Rollback

```bash
# Run rollback migrations in reverse order
node migrations/005_seed_compliance_stages.js down
node migrations/004_seed_compliance_statuses.js down
node migrations/003_extend_existing_collections.js down
node migrations/002_add_compliance_indexes.js down
node migrations/001_create_compliance_collections.js down

# Restore from backup if needed
mongorestore --host localhost:27017 --db customer_portal ./backup/pre-compliance-YYYYMMDD_HHMMSS/customer_portal/
```

### Phase 3: Verification

```bash
# Verify rollback success
curl -X GET http://localhost:3000/api/v1/health
curl -X GET http://localhost:3000/api/v1/services  # Existing functionality

# Check database state
mongo customer_portal --eval "db.getCollectionNames()"
```

## Post-Deployment Tasks

### Phase 1: Data Migration

```bash
# Migrate existing customer services to compliance services (if applicable)
node scripts/migrate-existing-services-to-compliance.js

# Set up recurring compliance schedules
node scripts/setup-recurring-compliances.js
```

### Phase 2: User Training

```bash
# Generate compliance documentation
npm run docs:generate:compliance

# Create user training materials
# Set up compliance officer permissions
# Configure notification preferences
```

### Phase 3: Monitoring and Optimization

```bash
# Monitor performance for first 24 hours
# Optimize database queries if needed
# Adjust caching strategies
# Fine-tune government portal sync intervals
```

## Troubleshooting Guide

### Common Issues

#### 1. Database Connection Issues

```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Verify compliance collections exist
mongo customer_portal --eval "db.getCollectionNames().filter(name => name.includes('compliance'))"
```

#### 2. Government Portal Authentication

```bash
# Test portal credentials
node scripts/test-portal-connection.js --portal=GST
node scripts/test-portal-connection.js --portal=MCA
```

#### 3. Performance Issues

```bash
# Check database indexes
mongo customer_portal --eval "db.complianceservices.getIndexes()"

# Monitor query performance
mongo customer_portal --eval "db.setProfilingLevel(2)"
```

#### 4. Memory Issues

```bash
# Monitor memory usage
node --max-old-space-size=4096 app.js

# Check for memory leaks
npm install -g clinic
clinic doctor -- node app.js
```

### Recovery Procedures

#### 1. Service Recovery

```bash
# Restart compliance services
pm2 restart compliance-worker
pm2 restart portal-sync-worker

# Clear cache if needed
redis-cli FLUSHDB
```

#### 2. Data Recovery

```bash
# Restore from backup
mongorestore --drop --host localhost:27017 --db customer_portal ./backup/latest/

# Rebuild indexes
mongo customer_portal --eval "db.complianceservices.reIndex()"
```

## Security Considerations

### 1. Credential Management

```bash
# Encrypt portal credentials
node scripts/encrypt-portal-credentials.js

# Rotate encryption keys
node scripts/rotate-encryption-keys.js
```

### 2. Access Control

```bash
# Verify compliance permissions
node scripts/verify-compliance-permissions.js

# Audit compliance access logs
grep "compliance" logs/access.log | tail -100
```

### 3. Data Protection

```bash
# Enable encryption at rest
# Configure SSL/TLS for portal communications
# Set up audit logging for compliance operations
```

This comprehensive deployment and migration guide ensures a smooth transition to the compliance-integrated system while maintaining the reliability and security of the existing customer portal.