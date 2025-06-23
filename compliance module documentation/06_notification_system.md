# Notification System Integration

The compliance module will integrate with the existing notification system to provide timely alerts and communication for compliance-related events. This document details the notification system design for the compliance module.

## Compliance-Specific Notification Types

The notification system will be extended with compliance-specific notification types:

```javascript
// Add compliance-specific notification types
const complianceNotificationTypes = [
  'COMPLIANCE_DUE',
  'COMPLIANCE_OVERDUE',
  'DOCUMENT_REQUIRED_FOR_COMPLIANCE',
  'COMPLIANCE_FILED',
  'COMPLIANCE_COMPLETED',
  'COMPLIANCE_ISSUE',
  'COMPLIANCE_STATUS_CHANGE',
  'COMPLIANCE_APPROACHING_DEADLINE',
  'COMPLIANCE_DOCUMENT_VERIFIED',
  'COMPLIANCE_DOCUMENT_REJECTED'
];
```

## Notification Templates

### 1. Compliance Due Reminders

Templates for upcoming compliance deadlines with various advance notice periods:

#### 30-Day Reminder Template

```
Subject: [Company Name] - [Compliance Type] Due in 30 Days
Body: 
Dear [User Name],

This is a reminder that [Compliance Type] for [Company Name] is due on [Due Date].

Compliance Details:
- Type: [Compliance Type]
- Period: [Compliance Period]
- Due Date: [Due Date]

Required Documents:
[Document List]

Please ensure all required documents are submitted as soon as possible to allow sufficient time for processing.

You can track the status of this compliance requirement and upload documents through your RegisterKaro dashboard.

Thank you,
RegisterKaro Compliance Team
```

Similar templates will be created for 15-day, 7-day, 3-day, and 1-day reminders with increasing urgency.

### 2. Document Request Notifications

Template for requesting specific documents needed for compliance:

```
Subject: Document Required: [Document Type] for [Compliance Type]
Body:
Dear [User Name],

We require the following document to proceed with [Compliance Type] for [Company Name]:

Document: [Document Type]
Description: [Document Description]
Deadline: [Submission Deadline]

Please upload this document through your RegisterKaro dashboard as soon as possible to avoid any delays in compliance processing.

Instructions for uploading:
1. Log in to your RegisterKaro dashboard
2. Go to [Company Name] > Compliance > [Compliance Type]
3. Click on "Upload Documents" and select "[Document Type]"

If you have any questions, please reply to this email or contact your compliance officer.

Thank you,
RegisterKaro Compliance Team
```

### 3. Verification Completion Notifications

Template for document verification outcomes:

```
Subject: Document [Verified/Rejected]: [Document Type] for [Compliance Type]
Body:
Dear [User Name],

We have [verified/rejected] the following document for [Compliance Type]:

Document: [Document Type]
Status: [Verification Status]
[If Rejected] Reason: [Rejection Reason]
[If Rejected] Action Required: [Required Action]

[If Verified] 
Your document has been verified successfully. No further action is required for this document.

[If Rejected]
Please upload a revised document addressing the issues mentioned above through your RegisterKaro dashboard.

Thank you,
RegisterKaro Compliance Team
```

### 4. Filing Completion Notifications

Template for successful filing notifications:

```
Subject: [Compliance Type] Filed Successfully for [Company Name]
Body:
Dear [User Name],

We're pleased to inform you that [Compliance Type] for [Company Name] has been successfully filed with [Regulatory Authority].

Filing Details:
- Compliance Type: [Compliance Type]
- Period: [Compliance Period]
- Filing Date: [Filing Date]
- Acknowledgment/Reference Number: [Reference Number]

The acknowledgment receipt and other relevant documents are available in your RegisterKaro dashboard. You can access them at:
[Dashboard Link]

Thank you for choosing RegisterKaro for your compliance needs.

Regards,
RegisterKaro Compliance Team
```

### 5. Compliance Status Updates

Template for general status updates:

```
Subject: Status Update: [Compliance Type] for [Company Name]
Body:
Dear [User Name],

The status of [Compliance Type] for [Company Name] has been updated to [New Status].

Current Details:
- Compliance Type: [Compliance Type]
- Period: [Compliance Period]
- Current Status: [New Status]
- Updated On: [Update Date]
[If applicable] Next Action: [Next Action Description] by [Next Action Date]

You can view the full details and track progress through your RegisterKaro dashboard.

Thank you,
RegisterKaro Compliance Team
```

## Notification Scheduling Service

The notification scheduling service will be enhanced to support compliance-specific scheduling needs:

### 1. Deadline-Based Notification Scheduling

```javascript
/**
 * Schedule deadline-based compliance notifications
 * @param {Object} complianceRecord - The compliance record
 * @returns {Promise<Array>} - Array of scheduled notifications
 */
const scheduleDeadlineNotifications = async (complianceRecord) => {
  const { entityId, dueDate, complianceTypeId, _id } = complianceRecord;
  
  // Get entity and compliance type details
  const entity = await Entity.findById(entityId);
  const complianceType = await ComplianceType.findById(complianceTypeId);
  
  if (!entity || !complianceType) {
    throw new Error('Entity or compliance type not found');
  }
  
  const schedules = [];
  
  // Define reminder points (days before deadline)
  const reminderDays = [30, 15, 7, 3, 1];
  
  // Schedule notifications for each reminder point
  for (const days of reminderDays) {
    const scheduledDate = new Date(dueDate);
    scheduledDate.setDate(scheduledDate.getDate() - days);
    
    // Skip if the date is in the past
    if (scheduledDate < new Date()) {
      continue;
    }
    
    const schedule = await NotificationSchedule.create({
      entityId,
      userId: complianceRecord.userId,
      complianceId: _id,
      type: 'COMPLIANCE_APPROACHING_DEADLINE',
      scheduledDate,
      templateData: {
        complianceTypeName: complianceType.name,
        complianceTypeCode: complianceType.code,
        entityName: entity.name,
        dueDate: dueDate.toDateString(),
        daysRemaining: days,
        compliancePeriod: complianceRecord.compliancePeriods[0]?.periodName || 'Current'
      },
      channels: ['EMAIL', 'IN_APP', 'SMS'],
      priority: days <= 3 ? 'HIGH' : 'MEDIUM',
      status: 'PENDING'
    });
    
    schedules.push(schedule);
  }
  
  return schedules;
};
```

### 2. Recurring Compliance Notifications

For recurring compliances, the system will automatically set up notifications for each new period:

```javascript
/**
 * Set up notifications for new compliance period
 * @param {Object} complianceRecord - The compliance record
 * @param {Object} newPeriod - The new compliance period
 * @returns {Promise<Array>} - Array of scheduled notifications
 */
const setupNewPeriodNotifications = async (complianceRecord, newPeriod) => {
  // First, clear any existing pending notifications for this compliance
  await NotificationSchedule.deleteMany({
    complianceId: complianceRecord._id,
    status: 'PENDING'
  });
  
  // Create notification for new period creation
  const entity = await Entity.findById(complianceRecord.entityId);
  const complianceType = await ComplianceType.findById(complianceRecord.complianceTypeId);
  
  // Create immediate notification about new period
  await notificationService.sendNotification({
    userId: complianceRecord.userId,
    entityId: complianceRecord.entityId,
    type: 'COMPLIANCE_DUE',
    title: `New ${complianceType.name} Period Added`,
    message: `A new compliance period (${newPeriod.periodName}) has been added for ${entity.name}. Due date: ${new Date(newPeriod.dueDate).toDateString()}.`,
    actionLink: `/dashboard/compliance/${complianceRecord._id}`,
    channels: ['EMAIL', 'IN_APP']
  });
  
  // Schedule deadline notifications for the new period
  return scheduleDeadlineNotifications(complianceRecord);
};
```

### 3. Escalation Notifications

For approaching or missed deadlines, escalation notifications will be sent:

```javascript
/**
 * Schedule escalation notifications for overdue compliances
 * @param {Object} complianceRecord - The compliance record
 * @returns {Promise<Array>} - Array of scheduled notifications
 */
const scheduleEscalationNotifications = async (complianceRecord) => {
  const { entityId, dueDate, complianceTypeId, _id, assignedToUserId } = complianceRecord;
  
  // Get entity and compliance type details
  const entity = await Entity.findById(entityId);
  const complianceType = await ComplianceType.findById(complianceTypeId);
  
  if (!entity || !complianceType) {
    throw new Error('Entity or compliance type not found');
  }
  
  const schedules = [];
  
  // Create notification for assigned compliance officer
  if (assignedToUserId) {
    const schedule = await NotificationSchedule.create({
      entityId,
      userId: assignedToUserId,
      complianceId: _id,
      type: 'COMPLIANCE_OVERDUE',
      scheduledDate: new Date(), // Send immediately
      templateData: {
        complianceTypeName: complianceType.name,
        complianceTypeCode: complianceType.code,
        entityName: entity.name,
        dueDate: dueDate.toDateString(),
        daysOverdue: Math.ceil((new Date() - dueDate) / (1000 * 60 * 60 * 24))
      },
      channels: ['EMAIL', 'IN_APP', 'SMS'],
      priority: 'HIGH',
      status: 'PENDING'
    });
    
    schedules.push(schedule);
  }
  
  // Get manager for escalation
  const assignedUser = await User.findById(assignedToUserId);
  let managerUserId = null;
  
  if (assignedUser && assignedUser.managerId) {
    managerUserId = assignedUser.managerId;
    
    // Create escalation to manager
    const schedule = await NotificationSchedule.create({
      entityId,
      userId: managerUserId,
      complianceId: _id,
      type: 'COMPLIANCE_OVERDUE',
      scheduledDate: new Date(), // Send immediately
      templateData: {
        complianceTypeName: complianceType.name,
        complianceTypeCode: complianceType.code,
        entityName: entity.name,
        dueDate: dueDate.toDateString(),
        daysOverdue: Math.ceil((new Date() - dueDate) / (1000 * 60 * 60 * 24)),
        assignedTo: assignedUser.name,
        isEscalation: true
      },
      channels: ['EMAIL', 'IN_APP'],
      priority: 'HIGH',
      status: 'PENDING'
    });
    
    schedules.push(schedule);
  }
  
  return schedules;
};
```

## Multi-Channel Notification Delivery

Compliance notifications will be delivered through multiple channels:

### 1. Email Notifications

Email notifications will be sent using the existing email service with compliance-specific templates.

### 2. SMS Notifications

SMS notifications will be sent for high-priority compliance alerts, such as:
- Approaching deadlines (3 days or less)
- Overdue compliances
- Critical document requirements

### 3. In-App Notifications

All compliance notifications will be delivered in-app, with appropriate styling based on priority:
- Critical: Red highlight with alert icon
- High: Orange highlight
- Medium: Blue highlight
- Low: Standard notification

### 4. WhatsApp Notifications (Optional)

For clients who opt-in, WhatsApp notifications can be sent for:
- Document requests
- Deadline reminders
- Filing confirmations

## Notification Preferences

Users will be able to configure their compliance notification preferences:

```javascript
// Sample notification preference schema
const complianceNotificationPreference = {
  userId: 'user123',
  entityId: 'entity456',
  preferences: {
    COMPLIANCE_DUE: {
      email: true,
      sms: true,
      inApp: true,
      whatsapp: false,
      reminderDays: [30, 15, 7, 3, 1] // Customize reminder days
    },
    COMPLIANCE_OVERDUE: {
      email: true,
      sms: true,
      inApp: true,
      whatsapp: true,
      escalateAfterDays: 2 // Escalate to manager after 2 days overdue
    },
    DOCUMENT_REQUIRED_FOR_COMPLIANCE: {
      email: true,
      sms: false,
      inApp: true,
      whatsapp: false
    },
    // Other types...
  },
  doNotDisturb: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    excludeHighPriority: true
  }
};
```

## Integration Points with Existing Notification System

The compliance notification system will integrate with the existing notification system at these key points:

### 1. Template Management

Compliance notification templates will be added to the existing template management system.

### 2. Delivery Engine

Compliance notifications will use the shared delivery engine for consistent delivery across channels.

### 3. Notification Center

Compliance notifications will appear in the unified notification center with appropriate categorization.

### 4. Preference Management

Compliance notification preferences will be part of the centralized preference management system.

## Notification Triggers

Notifications will be triggered by various events in the compliance workflow:

### 1. System Events

- Scheduled reminders for approaching deadlines
- Status changes
- Recurring compliance generation
- Document verification results

### 2. User Actions

- Document uploads
- Form submissions
- Comments and notes
- Deadline adjustments

### 3. External Events

- Government portal updates
- Regulatory changes
- Extension announcements

## Performance and Scalability Considerations

To ensure the notification system handles the additional compliance notifications efficiently:

1. **Batch Processing**: Notifications will be processed in batches, especially for recurring compliance generation.

2. **Priority Queuing**: High-priority compliance notifications will be processed with higher priority.

3. **Rate Limiting**: Channel-specific rate limits will be enforced to prevent flooding any specific channel.

4. **Notification Coalescing**: Multiple related notifications will be coalesced into a single notification when appropriate.

## Monitoring and Analytics

The system will provide monitoring and analytics for compliance notifications:

1. **Delivery Metrics**:
   - Delivery success rates by channel
   - Open/click-through rates
   - Response times for document requests

2. **Compliance Effectiveness**:
   - Correlation between notification timing and compliance completion
   - Notification strategies with highest compliance rates
   - Channel effectiveness for different notification types

3. **User Engagement**:
   - User preferences and interaction patterns
   - Optimal notification timing
   - Channel preference patterns