import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { useCompliance } from './ComplianceContext';

// Create context
const NotificationContext = createContext();

// Mock notification data
const mockNotifications = [
  {
    id: 'notif-001',
    userId: '2', // Compliance Officer
    entityId: 'ent-001',
    type: 'DEADLINE_APPROACHING',
    title: 'Compliance Deadline Approaching',
    message: 'Director\'s KYC (DIR-3 KYC) is due in 15 days for XYZ Private Limited',
    relatedItemId: 'comp-005',
    relatedItemType: 'COMPLIANCE',
    priority: 'HIGH',
    createdAt: '2023-09-15T10:00:00Z',
    isRead: false,
    actions: [
      {
        label: 'View Compliance',
        url: '/compliance/comp-005'
      }
    ]
  },
  {
    id: 'notif-002',
    userId: '2',
    entityId: 'ent-001',
    type: 'DOCUMENT_UPLOADED',
    title: 'Document Uploaded',
    message: 'Financial Statements have been uploaded for Annual Return filing',
    relatedItemId: 'doc-010',
    relatedItemType: 'DOCUMENT',
    priority: 'MEDIUM',
    createdAt: '2023-08-15T15:30:00Z',
    isRead: true,
    actions: [
      {
        label: 'View Document',
        url: '/documents/doc-010'
      }
    ]
  },
  {
    id: 'notif-003',
    userId: '3', // Entity Manager
    entityId: 'ent-001',
    type: 'STATUS_CHANGE',
    title: 'Compliance Status Changed',
    message: 'Income Tax Return (ITR-6) status changed to In Progress',
    relatedItemId: 'comp-004',
    relatedItemType: 'COMPLIANCE',
    priority: 'MEDIUM',
    createdAt: '2023-09-20T11:20:00Z',
    isRead: false,
    actions: [
      {
        label: 'View Compliance',
        url: '/compliance/comp-004'
      }
    ]
  },
  {
    id: 'notif-004',
    userId: '3',
    entityId: 'ent-001',
    type: 'DOCUMENT_VERIFICATION',
    title: 'Document Verification Required',
    message: 'Please upload the required documents for Director\'s KYC',
    relatedItemId: 'comp-005',
    relatedItemType: 'COMPLIANCE',
    priority: 'HIGH',
    createdAt: '2023-09-10T09:15:00Z',
    isRead: false,
    actions: [
      {
        label: 'Upload Documents',
        url: '/documents/upload?complianceId=comp-005'
      }
    ]
  },
  {
    id: 'notif-005',
    userId: '2',
    entityId: 'ent-001',
    type: 'FILING_SUCCESS',
    title: 'Filing Successful',
    message: 'Annual Return (MGT-7) has been successfully filed',
    relatedItemId: 'comp-001',
    relatedItemType: 'COMPLIANCE',
    priority: 'MEDIUM',
    createdAt: '2023-10-17T16:25:00Z',
    isRead: true,
    actions: [
      {
        label: 'View Acknowledgment',
        url: '/compliance/comp-001'
      }
    ]
  },
  {
    id: 'notif-006',
    userId: '1', // Admin
    entityId: null,
    type: 'SYSTEM',
    title: 'System Update',
    message: 'The system will be undergoing maintenance on Saturday, October 28, 2023',
    relatedItemId: null,
    relatedItemType: null,
    priority: 'LOW',
    createdAt: '2023-10-20T08:00:00Z',
    isRead: false,
    actions: []
  }
];

// Mock notification preferences
const mockNotificationPreferences = [
  {
    userId: '1',
    preferences: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      notificationTypes: {
        DEADLINE_APPROACHING: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_UPLOADED: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        STATUS_CHANGE: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_VERIFICATION: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        FILING_SUCCESS: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'LOW'
        },
        SYSTEM: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'LOW'
        }
      }
    }
  },
  {
    userId: '2',
    preferences: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: true,
      notificationTypes: {
        DEADLINE_APPROACHING: {
          email: true,
          push: true,
          sms: true,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_UPLOADED: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'HIGH'
        },
        STATUS_CHANGE: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_VERIFICATION: {
          email: true,
          push: true,
          sms: true,
          minPriority: 'MEDIUM'
        },
        FILING_SUCCESS: {
          email: true,
          push: true,
          sms: true,
          minPriority: 'LOW'
        },
        SYSTEM: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'LOW'
        }
      }
    }
  },
  {
    userId: '3',
    preferences: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: true,
      notificationTypes: {
        DEADLINE_APPROACHING: {
          email: true,
          push: true,
          sms: true,
          minPriority: 'LOW'
        },
        DOCUMENT_UPLOADED: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        STATUS_CHANGE: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_VERIFICATION: {
          email: true,
          push: true,
          sms: true,
          minPriority: 'LOW'
        },
        FILING_SUCCESS: {
          email: true,
          push: true,
          sms: true,
          minPriority: 'LOW'
        },
        SYSTEM: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'LOW'
        }
      }
    }
  }
];

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { getUpcomingCompliances, getEntityById, getComplianceById, getComplianceTypeById } = useCompliance();
  const [notifications, setNotifications] = useState([]);
  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      loadNotificationPreferences();
    } else {
      setNotifications([]);
      setNotificationPreferences(null);
    }
  }, [currentUser]);

  // Load notifications from mock data
  const loadNotifications = () => {
    setLoading(true);
    try {
      // Filter notifications for current user
      const userNotifications = mockNotifications.filter(
        notif => notif.userId === currentUser.id
      );
      setNotifications(userNotifications);
      setLoading(false);
    } catch (err) {
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  // Load notification preferences from mock data
  const loadNotificationPreferences = () => {
    setLoading(true);
    try {
      // Find preferences for current user
      const userPreferences = mockNotificationPreferences.find(
        pref => pref.userId === currentUser.id
      );
      setNotificationPreferences(userPreferences?.preferences || getDefaultPreferences());
      setLoading(false);
    } catch (err) {
      setError('Failed to load notification preferences');
      setLoading(false);
    }
  };

  // Get default notification preferences
  const getDefaultPreferences = () => {
    return {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      notificationTypes: {
        DEADLINE_APPROACHING: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_UPLOADED: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        STATUS_CHANGE: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        DOCUMENT_VERIFICATION: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'MEDIUM'
        },
        FILING_SUCCESS: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'LOW'
        },
        SYSTEM: {
          email: true,
          push: true,
          sms: false,
          minPriority: 'LOW'
        }
      }
    };
  };

  // Get unread notification count
  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.isRead).length;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notif => notif.type === type);
  };

  // Create a new notification
  const createNotification = (notificationData) => {
    const newNotification = {
      id: `notif-${uuidv4().substring(0, 8)}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notificationData
    };

    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    return newNotification;
  };

  // Update notification preferences
  const updateNotificationPreferences = (preferences) => {
    setNotificationPreferences(preferences);
    // In a real application, this would be saved to the server
  };

  // Generate compliance deadline notifications for testing
  const generateDeadlineNotifications = () => {
    const upcomingCompliances = getUpcomingCompliances();
    const newNotifications = [];

    upcomingCompliances.forEach(compliance => {
      const entity = getEntityById(compliance.entityId);
      const complianceType = getComplianceTypeById(compliance.complianceTypeId);
      
      if (entity && complianceType) {
        const dueDate = new Date(compliance.dueDate);
        const now = new Date();
        const daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
        
        let priority = 'LOW';
        if (daysUntilDue <= 7) {
          priority = 'HIGH';
        } else if (daysUntilDue <= 15) {
          priority = 'MEDIUM';
        }

        const notification = {
          userId: currentUser.id,
          entityId: entity.id,
          type: 'DEADLINE_APPROACHING',
          title: 'Compliance Deadline Approaching',
          message: `${complianceType.name} is due in ${daysUntilDue} days for ${entity.name}`,
          relatedItemId: compliance.id,
          relatedItemType: 'COMPLIANCE',
          priority,
          actions: [
            {
              label: 'View Compliance',
              url: `/compliance/${compliance.id}`
            }
          ]
        };

        newNotifications.push(notification);
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prevNotifications => [
        ...newNotifications.map(notif => ({
          id: `notif-${uuidv4().substring(0, 8)}`,
          createdAt: new Date().toISOString(),
          isRead: false,
          ...notif
        })),
        ...prevNotifications
      ]);
    }
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== notificationId)
    );
  };

  const value = {
    notifications,
    notificationPreferences,
    loading,
    error,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    createNotification,
    updateNotificationPreferences,
    generateDeadlineNotifications,
    deleteNotification
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};