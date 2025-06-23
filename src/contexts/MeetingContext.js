import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const MeetingContext = createContext();

// Mock SPOC (Single Point of Contact) data
const mockSPOCs = [
  {
    id: 'spoc-001',
    name: 'Rajesh Kumar',
    designation: 'Senior Compliance Officer',
    email: 'rajesh.kumar@registerkaro.com',
    phone: '+91-9876543210',
    specializations: ['MCA/ROC', 'GST', 'INCOME_TAX'],
    availability: {
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '09:00',
        end: '18:00'
      },
      workingDays: [1, 2, 3, 4, 5], // Monday to Friday
      unavailableDates: ['2024-12-25', '2024-12-26', '2025-01-01']
    },
    avatar: '/avatars/rajesh-kumar.jpg',
    rating: 4.8,
    totalMeetings: 156,
    languages: ['English', 'Hindi', 'Marathi']
  },
  {
    id: 'spoc-002',
    name: 'Priya Sharma',
    designation: 'Tax Consultant',
    email: 'priya.sharma@registerkaro.com',
    phone: '+91-9876543211',
    specializations: ['GST', 'INCOME_TAX', 'TDS'],
    availability: {
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '10:00',
        end: '19:00'
      },
      workingDays: [1, 2, 3, 4, 5],
      unavailableDates: ['2024-12-24', '2024-12-25', '2025-01-01']
    },
    avatar: '/avatars/priya-sharma.jpg',
    rating: 4.9,
    totalMeetings: 203,
    languages: ['English', 'Hindi', 'Tamil']
  },
  {
    id: 'spoc-003',
    name: 'Amit Patel',
    designation: 'Corporate Affairs Specialist',
    email: 'amit.patel@registerkaro.com',
    phone: '+91-9876543212',
    specializations: ['MCA/ROC', 'CORPORATE_LAW'],
    availability: {
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '09:30',
        end: '17:30'
      },
      workingDays: [1, 2, 3, 4, 5],
      unavailableDates: ['2024-12-25', '2025-01-01', '2025-01-26']
    },
    avatar: '/avatars/amit-patel.jpg',
    rating: 4.7,
    totalMeetings: 134,
    languages: ['English', 'Hindi', 'Gujarati']
  }
];

// Mock meeting data
const mockMeetings = [
  {
    id: 'meet-001',
    title: 'Annual Return Filing Discussion',
    description: 'Discussion about MGT-7 filing requirements and timeline',
    clientId: 'user-002', // Entity manager
    spocId: 'spoc-001',
    entityId: 'ent-001',
    complianceId: 'comp-001',
    scheduledDateTime: '2024-12-28T14:00:00Z',
    duration: 60, // minutes
    status: 'SCHEDULED',
    meetingType: 'CONSULTATION',
    priority: 'MEDIUM',
    agenda: [
      'Review current compliance status',
      'Discuss required documents',
      'Timeline for submission',
      'Q&A session'
    ],
    googleMeet: {
      meetingId: 'abc-defg-hij',
      joinUrl: 'https://meet.google.com/abc-defg-hij',
      dialIn: '+1-555-123-4567',
      pin: '123456789'
    },
    attendees: [
      {
        id: 'user-002',
        name: 'Entity Manager',
        email: 'entity@registerkaro.com',
        role: 'CLIENT',
        status: 'ACCEPTED'
      },
      {
        id: 'spoc-001',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@registerkaro.com',
        role: 'SPOC',
        status: 'ACCEPTED'
      }
    ],
    reminders: [
      {
        type: 'EMAIL',
        timing: '24_HOURS_BEFORE',
        sent: false
      },
      {
        type: 'SMS',
        timing: '1_HOUR_BEFORE',
        sent: false
      }
    ],
    createdAt: '2024-12-20T10:30:00Z',
    createdBy: 'user-002',
    updatedAt: '2024-12-20T10:30:00Z',
    notes: '',
    recordings: [],
    followUpActions: []
  },
  {
    id: 'meet-002',
    title: 'GST Return Query Resolution',
    description: 'Clarification on GSTR-3B filing discrepancies',
    clientId: 'user-002',
    spocId: 'spoc-002',
    entityId: 'ent-001',
    complianceId: 'comp-003',
    scheduledDateTime: '2024-12-30T11:00:00Z',
    duration: 45,
    status: 'SCHEDULED',
    meetingType: 'SUPPORT',
    priority: 'HIGH',
    agenda: [
      'Review GSTR-3B discrepancies',
      'Discuss rectification process',
      'Timeline for corrections'
    ],
    googleMeet: {
      meetingId: 'xyz-uvwx-yzab',
      joinUrl: 'https://meet.google.com/xyz-uvwx-yzab',
      dialIn: '+1-555-123-4568',
      pin: '987654321'
    },
    attendees: [
      {
        id: 'user-002',
        name: 'Entity Manager',
        email: 'entity@registerkaro.com',
        role: 'CLIENT',
        status: 'ACCEPTED'
      },
      {
        id: 'spoc-002',
        name: 'Priya Sharma',
        email: 'priya.sharma@registerkaro.com',
        role: 'SPOC',
        status: 'ACCEPTED'
      }
    ],
    reminders: [
      {
        type: 'EMAIL',
        timing: '24_HOURS_BEFORE',
        sent: false
      },
      {
        type: 'SMS',
        timing: '30_MINUTES_BEFORE',
        sent: false
      }
    ],
    createdAt: '2024-12-22T15:45:00Z',
    createdBy: 'user-002',
    updatedAt: '2024-12-22T15:45:00Z',
    notes: '',
    recordings: [],
    followUpActions: []
  },
  {
    id: 'meet-003',
    title: 'Quarterly Compliance Review',
    description: 'Comprehensive review of Q3 compliance status',
    clientId: 'user-002',
    spocId: 'spoc-001',
    entityId: 'ent-001',
    complianceId: null,
    scheduledDateTime: '2024-12-24T16:00:00Z',
    duration: 90,
    status: 'COMPLETED',
    meetingType: 'REVIEW',
    priority: 'MEDIUM',
    agenda: [
      'Q3 compliance summary',
      'Upcoming Q4 requirements',
      'Risk assessment',
      'Action plan for next quarter'
    ],
    googleMeet: {
      meetingId: 'qrs-tuv-wxyz',
      joinUrl: 'https://meet.google.com/qrs-tuv-wxyz',
      dialIn: '+1-555-123-4569',
      pin: '456789123'
    },
    attendees: [
      {
        id: 'user-002',
        name: 'Entity Manager',
        email: 'entity@registerkaro.com',
        role: 'CLIENT',
        status: 'ATTENDED'
      },
      {
        id: 'spoc-001',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@registerkaro.com',
        role: 'SPOC',
        status: 'ATTENDED'
      }
    ],
    reminders: [
      {
        type: 'EMAIL',
        timing: '24_HOURS_BEFORE',
        sent: true
      },
      {
        type: 'SMS',
        timing: '1_HOUR_BEFORE',
        sent: true
      }
    ],
    createdAt: '2024-12-18T09:15:00Z',
    createdBy: 'user-002',
    updatedAt: '2024-12-24T17:30:00Z',
    notes: 'Discussed upcoming compliance deadlines. Client satisfied with current progress.',
    recordings: [
      {
        id: 'rec-001',
        url: 'https://drive.google.com/file/d/recording-001',
        duration: 87,
        createdAt: '2024-12-24T17:30:00Z'
      }
    ],
    followUpActions: [
      {
        id: 'action-001',
        description: 'Send Q4 compliance calendar',
        assignedTo: 'spoc-001',
        dueDate: '2024-12-26T18:00:00Z',
        status: 'PENDING'
      },
      {
        id: 'action-002',
        description: 'Schedule next review meeting',
        assignedTo: 'user-002',
        dueDate: '2024-12-27T18:00:00Z',
        status: 'COMPLETED'
      }
    ]
  }
];

export const MeetingProvider = ({ children }) => {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [spocs, setSpocs] = useState(mockSPOCs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get SPOC by ID
  const getSpocById = (spocId) => {
    return spocs.find(spoc => spoc.id === spocId);
  };

  // Get meeting by ID
  const getMeetingById = (meetingId) => {
    return meetings.find(meeting => meeting.id === meetingId);
  };

  // Get meetings by client ID
  const getMeetingsByClient = (clientId) => {
    return meetings.filter(meeting => meeting.clientId === clientId);
  };

  // Get meetings by entity ID
  const getMeetingsByEntity = (entityId) => {
    return meetings.filter(meeting => meeting.entityId === entityId);
  };

  // Get meetings by SPOC ID
  const getMeetingsBySpoc = (spocId) => {
    return meetings.filter(meeting => meeting.spocId === spocId);
  };

  // Get upcoming meetings
  const getUpcomingMeetings = (clientId = null) => {
    const now = new Date();
    let filteredMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.scheduledDateTime);
      return meetingDate > now && meeting.status === 'SCHEDULED';
    });

    if (clientId) {
      filteredMeetings = filteredMeetings.filter(meeting => meeting.clientId === clientId);
    }

    return filteredMeetings.sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime));
  };

  // Get available time slots for a SPOC
  const getAvailableTimeSlots = (spocId, date) => {
    const spoc = getSpocById(spocId);
    if (!spoc) return [];

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Check if the day is a working day
    if (!spoc.availability.workingDays.includes(dayOfWeek)) {
      return [];
    }

    // Check if the date is in unavailable dates
    const dateString = selectedDate.toISOString().split('T')[0];
    if (spoc.availability.unavailableDates.includes(dateString)) {
      return [];
    }

    // Generate time slots
    const workingStart = spoc.availability.workingHours.start;
    const workingEnd = spoc.availability.workingHours.end;
    
    const slots = [];
    const startHour = parseInt(workingStart.split(':')[0]);
    const startMinute = parseInt(workingStart.split(':')[1]);
    const endHour = parseInt(workingEnd.split(':')[0]);
    
    // Generate 30-minute slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = (hour === startHour ? startMinute : 0); minute < 60; minute += 30) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hour, minute, 0, 0);
        
        // Check if slot is not already booked
        const isBooked = meetings.some(meeting => {
          if (meeting.spocId !== spocId || meeting.status === 'CANCELLED') return false;
          
          const meetingStart = new Date(meeting.scheduledDateTime);
          const meetingEnd = new Date(meetingStart.getTime() + meeting.duration * 60000);
          
          return slotDateTime >= meetingStart && slotDateTime < meetingEnd;
        });

        if (!isBooked && slotDateTime > new Date()) {
          slots.push({
            time: slotTime,
            datetime: slotDateTime.toISOString(),
            available: true
          });
        }
      }
    }

    return slots;
  };

  // Create a new meeting
  const createMeeting = async (meetingData) => {
    setLoading(true);
    setError('');

    try {
      // Simulate Google Meet integration
      const googleMeetData = await createGoogleMeetLink(meetingData);
      
      const newMeeting = {
        id: `meet-${uuidv4().substring(0, 8)}`,
        ...meetingData,
        status: 'SCHEDULED',
        googleMeet: googleMeetData,
        attendees: [
          {
            id: meetingData.clientId,
            name: 'Client User', // This would come from user context
            email: meetingData.clientEmail || 'client@example.com',
            role: 'CLIENT',
            status: 'ACCEPTED'
          },
          {
            id: meetingData.spocId,
            name: getSpocById(meetingData.spocId)?.name || 'SPOC',
            email: getSpocById(meetingData.spocId)?.email || 'spoc@registerkaro.com',
            role: 'SPOC',
            status: 'ACCEPTED'
          }
        ],
        reminders: [
          {
            type: 'EMAIL',
            timing: '24_HOURS_BEFORE',
            sent: false
          },
          {
            type: 'SMS',
            timing: '1_HOUR_BEFORE',
            sent: false
          }
        ],
        createdAt: new Date().toISOString(),
        createdBy: meetingData.clientId,
        updatedAt: new Date().toISOString(),
        notes: '',
        recordings: [],
        followUpActions: []
      };

      setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
      setLoading(false);
      
      // Send calendar invites (simulated)
      await sendCalendarInvites(newMeeting);
      
      return newMeeting;
    } catch (err) {
      setError('Failed to create meeting');
      setLoading(false);
      throw err;
    }
  };

  // Update meeting
  const updateMeeting = async (meetingId, updates) => {
    setLoading(true);
    setError('');

    try {
      const meeting = getMeetingById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      const updatedMeeting = {
        ...meeting,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      setMeetings(prevMeetings => 
        prevMeetings.map(m => m.id === meetingId ? updatedMeeting : m)
      );

      setLoading(false);
      return updatedMeeting;
    } catch (err) {
      setError('Failed to update meeting');
      setLoading(false);
      throw err;
    }
  };

  // Cancel meeting
  const cancelMeeting = async (meetingId, reason = '') => {
    setLoading(true);
    setError('');

    try {
      const meeting = getMeetingById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      const updatedMeeting = {
        ...meeting,
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMeetings(prevMeetings => 
        prevMeetings.map(m => m.id === meetingId ? updatedMeeting : m)
      );

      // Send cancellation notifications (simulated)
      await sendCancellationNotifications(updatedMeeting);

      setLoading(false);
      return updatedMeeting;
    } catch (err) {
      setError('Failed to cancel meeting');
      setLoading(false);
      throw err;
    }
  };

  // Reschedule meeting
  const rescheduleMeeting = async (meetingId, newDateTime, reason = '') => {
    setLoading(true);
    setError('');

    try {
      const meeting = getMeetingById(meetingId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Create new Google Meet link for rescheduled meeting
      const newGoogleMeetData = await createGoogleMeetLink({
        title: meeting.title,
        scheduledDateTime: newDateTime,
        duration: meeting.duration
      });

      const updatedMeeting = {
        ...meeting,
        scheduledDateTime: newDateTime,
        googleMeet: newGoogleMeetData,
        rescheduleHistory: [
          ...(meeting.rescheduleHistory || []),
          {
            previousDateTime: meeting.scheduledDateTime,
            newDateTime: newDateTime,
            reason: reason,
            rescheduledAt: new Date().toISOString(),
            rescheduledBy: meeting.clientId
          }
        ],
        updatedAt: new Date().toISOString()
      };

      setMeetings(prevMeetings => 
        prevMeetings.map(m => m.id === meetingId ? updatedMeeting : m)
      );

      // Send reschedule notifications (simulated)
      await sendRescheduleNotifications(updatedMeeting);

      setLoading(false);
      return updatedMeeting;
    } catch (err) {
      setError('Failed to reschedule meeting');
      setLoading(false);
      throw err;
    }
  };

  // Add meeting notes
  const addMeetingNotes = async (meetingId, notes) => {
    return updateMeeting(meetingId, { notes });
  };

  // Add follow-up action
  const addFollowUpAction = async (meetingId, action) => {
    const meeting = getMeetingById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    const newAction = {
      id: `action-${uuidv4().substring(0, 8)}`,
      ...action,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

    const updatedFollowUpActions = [...(meeting.followUpActions || []), newAction];
    
    return updateMeeting(meetingId, { followUpActions: updatedFollowUpActions });
  };

  // Get meeting statistics
  const getMeetingStats = (clientId = null) => {
    let filteredMeetings = meetings;
    if (clientId) {
      filteredMeetings = meetings.filter(meeting => meeting.clientId === clientId);
    }

    const total = filteredMeetings.length;
    const scheduled = filteredMeetings.filter(m => m.status === 'SCHEDULED').length;
    const completed = filteredMeetings.filter(m => m.status === 'COMPLETED').length;
    const cancelled = filteredMeetings.filter(m => m.status === 'CANCELLED').length;
    const upcoming = getUpcomingMeetings(clientId).length;

    return {
      total,
      scheduled,
      completed,
      cancelled,
      upcoming,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  };

  const value = {
    meetings,
    spocs,
    loading,
    error,
    getSpocById,
    getMeetingById,
    getMeetingsByClient,
    getMeetingsByEntity,
    getMeetingsBySpoc,
    getUpcomingMeetings,
    getAvailableTimeSlots,
    createMeeting,
    updateMeeting,
    cancelMeeting,
    rescheduleMeeting,
    addMeetingNotes,
    addFollowUpAction,
    getMeetingStats
  };

  return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>;
};

// Simulated Google Meet integration functions
const createGoogleMeetLink = async (meetingData) => {
  // Simulate API call to Google Meet
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const meetingId = Math.random().toString(36).substring(2, 15);
  
  return {
    meetingId: meetingId,
    joinUrl: `https://meet.google.com/${meetingId}`,
    dialIn: '+1-555-123-4567',
    pin: Math.floor(Math.random() * 1000000000).toString()
  };
};

const sendCalendarInvites = async (meeting) => {
  // Simulate sending calendar invites
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Calendar invites sent for meeting:', meeting.id);
};

const sendCancellationNotifications = async (meeting) => {
  // Simulate sending cancellation notifications
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Cancellation notifications sent for meeting:', meeting.id);
};

const sendRescheduleNotifications = async (meeting) => {
  // Simulate sending reschedule notifications
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Reschedule notifications sent for meeting:', meeting.id);
};

// Custom hook to use the meeting context
export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};