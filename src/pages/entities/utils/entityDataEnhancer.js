// Utility function to enhance entity data with additional mock information
export const enhanceEntityData = (entity, stats) => {
  return {
    ...entity,
    // Contact Information
    contactDetails: {
      primaryContact: {
        name: 'Rajesh Kumar',
        designation: 'Company Secretary',
        email: 'rajesh.kumar@xyzpvtltd.com',
        phone: '+91 98765 43210',
        mobile: '+91 98765 43210'
      },
      authorizedSignatory: {
        name: 'Priya Sharma',
        designation: 'Managing Director',
        email: 'priya.sharma@xyzpvtltd.com',
        phone: '+91 98765 43211'
      },
      complianceOfficer: {
        name: 'Amit Patel',
        designation: 'Compliance Officer',
        email: 'amit.patel@registerkaro.in',
        phone: '+91 98765 43212',
        spocId: 'spoc-001'
      }
    },
    
    // Financial Information
    financialDetails: {
      authorizedCapital: 10000000,
      paidUpCapital: 5000000,
      lastAuditedTurnover: 25000000,
      currentFY: '2024-25',
      lastFiledFY: '2023-24',
      bankDetails: {
        primaryBank: 'HDFC Bank',
        accountNumber: '****1234',
        ifscCode: 'HDFC0001234',
        branch: 'Mumbai Main Branch'
      }
    },
    
    // Regulatory Information
    regulatoryInfo: {
      mcaStatus: 'Active',
      gstStatus: 'Active',
      pfRegistration: 'MHBNG12345678901234567890',
      esiRegistration: '12345678901234567890',
      tanNumber: 'MUMB12345A',
      udyamRegistration: 'UDYAM-MH-12-1234567',
      fssaiLicense: null,
      importExportCode: null
    },
    
    // Compliance Health Metrics
    complianceHealth: {
      overall: 85,
      statutory: 90,
      internal: 80,
      governance: 85,
      riskScore: 'Low',
      lastAssessment: '2024-12-01',
      nextAssessment: '2025-03-01'
    },
    
    // Key Metrics
    keyMetrics: {
      totalCompliances: stats.total,
      completedCompliances: stats.completed,
      pendingCompliances: stats.pending,
      overdueCompliances: stats.overdue,
      complianceRate: stats.completionRate,
      avgCompletionTime: 12, // days
      costSavings: 150000, // INR
      riskMitigation: 95 // percentage
    },
    
    // Recent Activities
    recentActivities: [
      {
        id: 1,
        type: 'compliance_completed',
        title: 'GST Return GSTR-3B Filed',
        description: 'Monthly GST return for November 2024 filed successfully',
        timestamp: '2024-12-20T14:30:00Z',
        user: 'Amit Patel',
        status: 'success',
        category: 'GST'
      },
      {
        id: 2,
        type: 'document_uploaded',
        title: 'Financial Statements Uploaded',
        description: 'Audited financial statements for FY 2023-24 uploaded for AOC-4 filing',
        timestamp: '2024-12-19T11:15:00Z',
        user: 'Rajesh Kumar',
        status: 'pending',
        category: 'MCA'
      },
      {
        id: 3,
        type: 'meeting_scheduled',
        title: 'Compliance Review Meeting',
        description: 'Quarterly compliance review meeting scheduled with SPOC',
        timestamp: '2024-12-18T16:45:00Z',
        user: 'Priya Sharma',
        status: 'scheduled',
        category: 'Meeting'
      },
      {
        id: 4,
        type: 'alert_resolved',
        title: 'Director KYC Alert Resolved',
        description: 'Director KYC filing completed for all directors',
        timestamp: '2024-12-17T09:30:00Z',
        user: 'Amit Patel',
        status: 'resolved',
        category: 'MCA'
      }
    ],
    
    // Credentials and Certificates
    credentials: [
      {
        id: 1,
        type: 'Certificate of Incorporation',
        number: entity.cin,
        issueDate: entity.incorporationDate,
        validUpto: null,
        status: 'Active',
        authority: 'Ministry of Corporate Affairs',
        document: 'certificate_of_incorporation.pdf'
      },
      {
        id: 2,
        type: 'GST Registration Certificate',
        number: entity.gstRegistration,
        issueDate: '2020-07-01',
        validUpto: null,
        status: 'Active',
        authority: 'GST Department',
        document: 'gst_certificate.pdf'
      },
      {
        id: 3,
        type: 'PAN Card',
        number: 'AADCB2230M',
        issueDate: '2020-06-20',
        validUpto: null,
        status: 'Active',
        authority: 'Income Tax Department',
        document: 'pan_card.pdf'
      },
      {
        id: 4,
        type: 'PF Registration',
        number: 'MHBNG12345678901234567890',
        issueDate: '2020-08-15',
        validUpto: null,
        status: 'Active',
        authority: 'EPFO',
        document: 'pf_registration.pdf'
      }
    ],
    
    // Risk Assessment
    riskAssessment: {
      overallRisk: 'Low',
      complianceRisk: 'Low',
      financialRisk: 'Medium',
      operationalRisk: 'Low',
      riskFactors: [
        {
          factor: 'Compliance History',
          score: 9,
          status: 'Good',
          description: 'Consistent compliance track record'
        },
        {
          factor: 'Financial Health',
          score: 7,
          status: 'Moderate',
          description: 'Stable financials with growth potential'
        },
        {
          factor: 'Regulatory Changes',
          score: 8,
          status: 'Good',
          description: 'Well-adapted to regulatory changes'
        }
      ]
    }
  };
};

// Utility functions for status and risk colors
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': case 'active': case 'success': case 'resolved': return 'success';
    case 'in_progress': case 'pending': case 'scheduled': return 'warning';
    case 'overdue': case 'failed': case 'expired': return 'error';
    default: return 'default';
  }
};

export const getRiskColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'error';
    default: return 'default';
  }
};

export const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};