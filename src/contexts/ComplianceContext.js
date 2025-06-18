import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
const ComplianceContext = createContext();

// Mock entity data
const mockEntities = [
  {
    id: 'ent-001',
    name: 'XYZ Private Limited',
    cin: 'U12345MH2020PTC123456',
    incorporationDate: '2020-06-15',
    registeredAddress: '123 Business Park, Mumbai, Maharashtra 400001',
    businessActivity: 'IT Services',
    entityType: 'PRIVATE_LIMITED',
    gstRegistration: '27AADCB2230M1ZR',
    directors: [
      { id: 'dir-001', name: 'John Doe', din: '12345678', designation: 'Managing Director' },
      { id: 'dir-002', name: 'Jane Smith', din: '87654321', designation: 'Director' }
    ],
    complianceStats: {
      total: 24,
      completed: 18,
      inProgress: 4,
      pending: 2,
      overdue: 0
    }
  },
  {
    id: 'ent-002',
    name: 'ABC Enterprises LLP',
    cin: 'AAA-1234',
    incorporationDate: '2018-03-22',
    registeredAddress: '456 Tech Hub, Bangalore, Karnataka 560001',
    businessActivity: 'Consulting',
    entityType: 'LLP',
    gstRegistration: '29AABFR7428L1Z6',
    partners: [
      { id: 'par-001', name: 'Robert Johnson', designation: 'Designated Partner' },
      { id: 'par-002', name: 'Susan Williams', designation: 'Partner' }
    ],
    complianceStats: {
      total: 18,
      completed: 12,
      inProgress: 3,
      pending: 2,
      overdue: 1
    }
  }
];

// Mock compliance types
const complianceTypes = [
  {
    id: 'comp-type-001',
    code: 'MCA_ANNUAL_RETURN',
    name: 'Annual Return (MGT-7)',
    category: 'MCA/ROC',
    description: 'Annual return providing details of the company\'s shareholders, directors, and other key information for the financial year',
    frequency: 'YEARLY',
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
    deadlineRule: 'WITHIN_60_DAYS_OF_AGM',
    requiredDocuments: ['BOARD_RESOLUTION', 'SHAREHOLDER_LIST', 'AGM_MINUTES'],
    formType: 'MGT-7'
  },
  {
    id: 'comp-type-002',
    code: 'MCA_FINANCIAL_STATEMENTS',
    name: 'Financial Statements Filing (AOC-4)',
    category: 'MCA/ROC',
    description: 'Annual filing of financial statements including balance sheet, profit and loss account, and related documents',
    frequency: 'YEARLY',
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
    deadlineRule: 'WITHIN_30_DAYS_OF_AGM',
    requiredDocuments: ['BALANCE_SHEET', 'PROFIT_LOSS_STATEMENT', 'AUDITOR_REPORT', 'DIRECTORS_REPORT'],
    formType: 'AOC-4'
  },
  {
    id: 'comp-type-003',
    code: 'DIRECTOR_KYC',
    name: 'Director\'s KYC (DIR-3 KYC)',
    category: 'MCA/ROC',
    description: 'Annual KYC filing required for all directors to verify their identity and contact details',
    frequency: 'YEARLY',
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP'],
    deadlineRule: 'FIXED_DATE_SEPTEMBER_30',
    requiredDocuments: ['IDENTITY_PROOF', 'ADDRESS_PROOF', 'PHOTOGRAPH'],
    formType: 'DIR-3_KYC'
  },
  {
    id: 'comp-type-004',
    code: 'GST_MONTHLY_RETURN',
    name: 'Monthly GSTR-3B',
    category: 'GST',
    description: 'Monthly summary return showing the summary of outward supplies, inward supplies, ITC claimed, and tax payment',
    frequency: 'MONTHLY',
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PROPRIETORSHIP'],
    deadlineRule: 'NEXT_MONTH_20TH',
    requiredDocuments: ['SALES_REGISTER', 'PURCHASE_REGISTER'],
    formType: 'GSTR-3B'
  },
  {
    id: 'comp-type-005',
    code: 'GST_ANNUAL_RETURN',
    name: 'Annual GSTR-9',
    category: 'GST',
    description: 'Annual return summarizing all the supplies made/received and taxes paid/claimed in the financial year',
    frequency: 'YEARLY',
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PROPRIETORSHIP'],
    deadlineRule: 'FIXED_DATE_DECEMBER_31',
    requiredDocuments: ['ANNUAL_FINANCIAL_STATEMENTS', 'GSTR3B_SUMMARY', 'GSTR1_SUMMARY', 'RECONCILIATION_STATEMENT'],
    formType: 'GSTR-9'
  },
  {
    id: 'comp-type-006',
    code: 'INCOME_TAX_RETURN',
    name: 'Corporate Income Tax Return (ITR-6)',
    category: 'INCOME_TAX',
    description: 'Annual income tax return for companies reporting income, deductions, tax calculations, and tax payments',
    frequency: 'YEARLY',
    applicableEntityTypes: ['PRIVATE_LIMITED', 'PUBLIC_LIMITED'],
    deadlineRule: 'NEXT_YEAR_OCTOBER_31',
    requiredDocuments: ['FINANCIAL_STATEMENTS', 'TAX_AUDIT_REPORT', 'TDS_CERTIFICATES', 'ADVANCE_TAX_CHALLANS'],
    formType: 'ITR-6'
  }
];

// Mock compliance data
const mockCompliances = [
  {
    id: 'comp-001',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-001',
    financialYear: '2022-23',
    dueDate: '2023-11-29T23:59:59Z',
    agmDate: '2023-09-30T11:00:00Z',
    status: 'COMPLETED',
    assignedTo: 'user-001',
    workflowState: 'ACKNOWLEDGED',
    metadata: {
      shareCapitalChanges: false,
      directorChanges: true,
      foreignShareholders: false,
      csrApplicable: true
    },
    documents: [
      { id: 'doc-001', documentType: 'BOARD_RESOLUTION', status: 'VERIFIED' },
      { id: 'doc-002', documentType: 'SHAREHOLDER_LIST', status: 'VERIFIED' },
      { id: 'doc-003', documentType: 'AGM_MINUTES', status: 'VERIFIED' }
    ],
    filingDetails: {
      srn: 'T12345678',
      submissionDate: '2023-10-15T14:30:00Z',
      acknowledgmentNumber: 'ACK12345678',
      paymentReference: 'PAY9876543'
    },
    history: [
      { state: 'DATA_COLLECTION', timestamp: '2023-08-15T10:00:00Z', user: 'user-001' },
      { state: 'FORM_PREPARATION', timestamp: '2023-09-10T11:30:00Z', user: 'user-001' },
      { state: 'CLIENT_REVIEW', timestamp: '2023-09-20T14:45:00Z', user: 'user-002' },
      { state: 'DIGITAL_SIGNING', timestamp: '2023-10-05T09:15:00Z', user: 'user-003' },
      { state: 'FILED', timestamp: '2023-10-15T14:30:00Z', user: 'user-001' },
      { state: 'ACKNOWLEDGED', timestamp: '2023-10-17T16:20:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-002',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-002',
    financialYear: '2022-23',
    dueDate: '2023-10-30T23:59:59Z',
    agmDate: '2023-09-30T11:00:00Z',
    status: 'COMPLETED',
    assignedTo: 'user-001',
    workflowState: 'ACKNOWLEDGED',
    metadata: {
      turnover: 25000000,
      paidUpCapital: 10000000,
      netProfit: 3000000,
      auditRequired: true
    },
    documents: [
      { id: 'doc-004', documentType: 'BALANCE_SHEET', status: 'VERIFIED' },
      { id: 'doc-005', documentType: 'PROFIT_LOSS_STATEMENT', status: 'VERIFIED' },
      { id: 'doc-006', documentType: 'AUDITOR_REPORT', status: 'VERIFIED' },
      { id: 'doc-007', documentType: 'DIRECTORS_REPORT', status: 'VERIFIED' }
    ],
    filingDetails: {
      srn: 'T87654321',
      submissionDate: '2023-10-10T10:45:00Z',
      acknowledgmentNumber: 'ACK87654321',
      paymentReference: 'PAY1234567'
    },
    history: [
      { state: 'FINANCIAL_DATA_COLLECTION', timestamp: '2023-08-01T09:30:00Z', user: 'user-001' },
      { state: 'AUDITOR_REVIEW', timestamp: '2023-08-25T15:20:00Z', user: 'user-004' },
      { state: 'FORM_PREPARATION', timestamp: '2023-09-05T11:10:00Z', user: 'user-001' },
      { state: 'CLIENT_REVIEW', timestamp: '2023-09-15T14:00:00Z', user: 'user-002' },
      { state: 'DIGITAL_SIGNING', timestamp: '2023-09-30T10:30:00Z', user: 'user-003' },
      { state: 'FILED', timestamp: '2023-10-10T10:45:00Z', user: 'user-001' },
      { state: 'ACKNOWLEDGED', timestamp: '2023-10-12T16:15:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-003',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-004',
    returnPeriod: '052023', // May 2023
    dueDate: '2023-06-20T23:59:59Z',
    status: 'COMPLETED',
    assignedTo: 'user-001',
    workflowState: 'ACKNOWLEDGED',
    metadata: {
      turnoverCategory: 'LARGE',
      monthlyTurnover: 2500000,
      regularTaxpayer: true,
      compositionScheme: false
    },
    taxLiability: {
      outwardSupplies: {
        taxableValue: 2000000,
        igstAmount: 0,
        cgstAmount: 180000,
        sgstAmount: 180000,
        cessAmount: 0
      },
      inwardSupplies: {
        reverseChargeValue: 0,
        igstAmount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        cessAmount: 0
      }
    },
    inputTaxCredit: {
      eligible: {
        igstAmount: 50000,
        cgstAmount: 100000,
        sgstAmount: 100000,
        cessAmount: 0
      },
      ineligible: {
        igstAmount: 5000,
        cgstAmount: 10000,
        sgstAmount: 10000,
        cessAmount: 0
      }
    },
    documents: [
      { id: 'doc-008', documentType: 'SALES_REGISTER', status: 'VERIFIED' },
      { id: 'doc-009', documentType: 'PURCHASE_REGISTER', status: 'VERIFIED' }
    ],
    filingDetails: {
      submissionDate: '2023-06-18T15:30:00Z',
      acknowledgmentNumber: 'GST1234567890',
      challanDetails: 'PMT-12345678'
    },
    history: [
      { state: 'TRANSACTION_DATA_COLLECTION', timestamp: '2023-06-05T09:00:00Z', user: 'user-001' },
      { state: 'RECONCILIATION', timestamp: '2023-06-10T14:20:00Z', user: 'user-001' },
      { state: 'FORM_PREPARATION', timestamp: '2023-06-15T11:45:00Z', user: 'user-001' },
      { state: 'TAX_PAYMENT', timestamp: '2023-06-18T14:30:00Z', user: 'user-002' },
      { state: 'FILED', timestamp: '2023-06-18T15:30:00Z', user: 'user-001' },
      { state: 'ACKNOWLEDGED', timestamp: '2023-06-18T15:35:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-004',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-006',
    financialYear: '2022-23',
    assessmentYear: '2023-24',
    dueDate: '2023-10-31T23:59:59Z',
    status: 'IN_PROGRESS',
    assignedTo: 'user-001',
    workflowState: 'FORM_PREPARATION',
    metadata: {
      turnover: 30000000,
      taxAuditRequired: true,
      transferPricingApplicable: false,
      presumptiveTaxation: false
    },
    incomeComputation: {
      businessIncome: 3500000,
      capitalGains: 500000,
      otherSources: 200000,
      totalIncome: 4200000,
      deductions: 200000,
      taxableIncome: 4000000
    },
    taxComputation: {
      taxOnRegularIncome: 1000000,
      surcharge: 70000,
      educationCess: 42800,
      totalTaxLiability: 1112800,
      tdsCredit: 800000,
      advanceTaxPaid: 300000,
      selfAssessmentTax: 12800,
      refundDue: 0
    },
    documents: [
      { id: 'doc-010', documentType: 'FINANCIAL_STATEMENTS', status: 'VERIFIED' },
      { id: 'doc-011', documentType: 'TAX_AUDIT_REPORT', status: 'PENDING' },
      { id: 'doc-012', documentType: 'TDS_CERTIFICATES', status: 'VERIFIED' },
      { id: 'doc-013', documentType: 'ADVANCE_TAX_CHALLANS', status: 'VERIFIED' }
    ],
    filingDetails: {
      submissionDate: null,
      acknowledgmentNumber: null,
      verificationMode: null
    },
    history: [
      { state: 'FINANCIAL_DATA_COLLECTION', timestamp: '2023-08-15T10:00:00Z', user: 'user-001' },
      { state: 'TAX_AUDIT', timestamp: '2023-09-05T14:30:00Z', user: 'user-004' },
      { state: 'FORM_PREPARATION', timestamp: '2023-09-20T11:15:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-005',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-003',
    financialYear: '2023-24',
    dueDate: '2023-09-30T23:59:59Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'DIRECTOR_DATA_COLLECTION',
    metadata: {
      directorId: 'dir-001',
      directorDIN: '12345678',
      firstTimeKYC: false,
      foreignDirector: false,
      addressChanged: true,
      contactDetailsChanged: false
    },
    documents: [
      { id: 'doc-014', documentType: 'IDENTITY_PROOF', status: 'PENDING' },
      { id: 'doc-015', documentType: 'ADDRESS_PROOF', status: 'PENDING' },
      { id: 'doc-016', documentType: 'PHOTOGRAPH', status: 'PENDING' }
    ],
    contactVerification: {
      emailVerified: false,
      mobileVerified: false
    },
    filingDetails: {
      submissionDate: null,
      acknowledgmentNumber: null
    },
    history: [
      { state: 'DIRECTOR_DATA_COLLECTION', timestamp: '2023-08-01T10:30:00Z', user: 'user-001' }
    ]
  },
  // Additional compliance items for better calendar visibility
  {
    id: 'comp-006',
    entityId: 'ent-002',
    complianceTypeId: 'comp-type-004',
    returnPeriod: '122024', // December 2024
    dueDate: '2025-01-20T23:59:59Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'TRANSACTION_DATA_COLLECTION',
    metadata: {
      turnoverCategory: 'MEDIUM',
      monthlyTurnover: 1500000,
      regularTaxpayer: true,
      compositionScheme: false
    },
    documents: [
      { id: 'doc-017', documentType: 'SALES_REGISTER', status: 'PENDING' },
      { id: 'doc-018', documentType: 'PURCHASE_REGISTER', status: 'PENDING' }
    ],
    history: [
      { state: 'TRANSACTION_DATA_COLLECTION', timestamp: '2024-12-01T09:00:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-007',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-005',
    financialYear: '2023-24',
    dueDate: '2024-12-31T23:59:59Z',
    status: 'IN_PROGRESS',
    assignedTo: 'user-001',
    workflowState: 'FORM_PREPARATION',
    metadata: {
      turnover: 28000000,
      gstAuditRequired: true,
      reconciliationCompleted: false
    },
    documents: [
      { id: 'doc-019', documentType: 'ANNUAL_FINANCIAL_STATEMENTS', status: 'VERIFIED' },
      { id: 'doc-020', documentType: 'GSTR3B_SUMMARY', status: 'VERIFIED' },
      { id: 'doc-021', documentType: 'RECONCILIATION_STATEMENT', status: 'PENDING' }
    ],
    history: [
      { state: 'ANNUAL_DATA_COMPILATION', timestamp: '2024-10-01T09:00:00Z', user: 'user-001' },
      { state: 'FORM_PREPARATION', timestamp: '2024-11-15T14:30:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-008',
    entityId: 'ent-002',
    complianceTypeId: 'comp-type-001',
    financialYear: '2023-24',
    dueDate: '2024-11-30T23:59:59Z',
    agmDate: '2024-09-30T11:00:00Z',
    status: 'IN_PROGRESS',
    assignedTo: 'user-001',
    workflowState: 'CLIENT_REVIEW',
    metadata: {
      shareCapitalChanges: false,
      directorChanges: false,
      foreignShareholders: false,
      csrApplicable: false
    },
    documents: [
      { id: 'doc-022', documentType: 'BOARD_RESOLUTION', status: 'VERIFIED' },
      { id: 'doc-023', documentType: 'SHAREHOLDER_LIST', status: 'VERIFIED' },
      { id: 'doc-024', documentType: 'AGM_MINUTES', status: 'PENDING' }
    ],
    history: [
      { state: 'DATA_COLLECTION', timestamp: '2024-09-01T10:00:00Z', user: 'user-001' },
      { state: 'FORM_PREPARATION', timestamp: '2024-10-10T11:30:00Z', user: 'user-001' },
      { state: 'CLIENT_REVIEW', timestamp: '2024-11-05T14:45:00Z', user: 'user-002' }
    ]
  },
  {
    id: 'comp-009',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-004',
    returnPeriod: '012025', // January 2025
    dueDate: '2025-02-20T23:59:59Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'TRANSACTION_DATA_COLLECTION',
    metadata: {
      turnoverCategory: 'LARGE',
      monthlyTurnover: 2800000,
      regularTaxpayer: true,
      compositionScheme: false
    },
    documents: [
      { id: 'doc-025', documentType: 'SALES_REGISTER', status: 'PENDING' },
      { id: 'doc-026', documentType: 'PURCHASE_REGISTER', status: 'PENDING' }
    ],
    history: [
      { state: 'TRANSACTION_DATA_COLLECTION', timestamp: '2025-01-01T09:00:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-010',
    entityId: 'ent-002',
    complianceTypeId: 'comp-type-003',
    financialYear: '2024-25',
    dueDate: '2024-09-30T23:59:59Z',
    status: 'COMPLETED',
    assignedTo: 'user-001',
    workflowState: 'ACKNOWLEDGED',
    metadata: {
      directorId: 'par-001',
      directorDIN: '87654321',
      firstTimeKYC: false,
      foreignDirector: false,
      addressChanged: false,
      contactDetailsChanged: true
    },
    documents: [
      { id: 'doc-027', documentType: 'IDENTITY_PROOF', status: 'VERIFIED' },
      { id: 'doc-028', documentType: 'ADDRESS_PROOF', status: 'VERIFIED' },
      { id: 'doc-029', documentType: 'PHOTOGRAPH', status: 'VERIFIED' }
    ],
    filingDetails: {
      submissionDate: '2024-09-15T14:30:00Z',
      acknowledgmentNumber: 'DIR123456789'
    },
    history: [
      { state: 'DIRECTOR_DATA_COLLECTION', timestamp: '2024-08-01T10:30:00Z', user: 'user-001' },
      { state: 'DOCUMENT_COLLECTION', timestamp: '2024-08-15T11:00:00Z', user: 'user-001' },
      { state: 'VERIFICATION', timestamp: '2024-09-01T14:00:00Z', user: 'user-001' },
      { state: 'FILED', timestamp: '2024-09-15T14:30:00Z', user: 'user-001' },
      { state: 'ACKNOWLEDGED', timestamp: '2024-09-15T16:00:00Z', user: 'user-001' }
    ]
  },
  // Additional compliance items for current month visibility (December 2024)
  {
    id: 'comp-011',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-004',
    returnPeriod: '112024', // November 2024
    dueDate: '2024-12-20T23:59:59Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'TRANSACTION_DATA_COLLECTION',
    metadata: {
      turnoverCategory: 'LARGE',
      monthlyTurnover: 2600000,
      regularTaxpayer: true,
      compositionScheme: false
    },
    documents: [
      { id: 'doc-030', documentType: 'SALES_REGISTER', status: 'PENDING' },
      { id: 'doc-031', documentType: 'PURCHASE_REGISTER', status: 'PENDING' }
    ],
    history: [
      { state: 'TRANSACTION_DATA_COLLECTION', timestamp: '2024-12-01T09:00:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-012',
    entityId: 'ent-002',
    complianceTypeId: 'comp-type-005',
    financialYear: '2023-24',
    dueDate: '2024-12-31T23:59:59Z',
    status: 'IN_PROGRESS',
    assignedTo: 'user-001',
    workflowState: 'FORM_PREPARATION',
    metadata: {
      turnover: 18000000,
      gstAuditRequired: false,
      reconciliationCompleted: true
    },
    documents: [
      { id: 'doc-032', documentType: 'ANNUAL_FINANCIAL_STATEMENTS', status: 'VERIFIED' },
      { id: 'doc-033', documentType: 'GSTR3B_SUMMARY', status: 'VERIFIED' },
      { id: 'doc-034', documentType: 'RECONCILIATION_STATEMENT', status: 'VERIFIED' }
    ],
    history: [
      { state: 'ANNUAL_DATA_COMPILATION', timestamp: '2024-11-01T09:00:00Z', user: 'user-001' },
      { state: 'FORM_PREPARATION', timestamp: '2024-12-05T14:30:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-013',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-003',
    financialYear: '2024-25',
    dueDate: '2024-12-15T23:59:59Z',
    status: 'COMPLETED',
    assignedTo: 'user-001',
    workflowState: 'ACKNOWLEDGED',
    metadata: {
      directorId: 'dir-002',
      directorDIN: '87654321',
      firstTimeKYC: false,
      foreignDirector: false,
      addressChanged: false,
      contactDetailsChanged: false
    },
    documents: [
      { id: 'doc-035', documentType: 'IDENTITY_PROOF', status: 'VERIFIED' },
      { id: 'doc-036', documentType: 'ADDRESS_PROOF', status: 'VERIFIED' },
      { id: 'doc-037', documentType: 'PHOTOGRAPH', status: 'VERIFIED' }
    ],
    filingDetails: {
      submissionDate: '2024-12-10T14:30:00Z',
      acknowledgmentNumber: 'DIR987654321'
    },
    history: [
      { state: 'DIRECTOR_DATA_COLLECTION', timestamp: '2024-11-15T10:30:00Z', user: 'user-001' },
      { state: 'DOCUMENT_COLLECTION', timestamp: '2024-11-25T11:00:00Z', user: 'user-001' },
      { state: 'VERIFICATION', timestamp: '2024-12-05T14:00:00Z', user: 'user-001' },
      { state: 'FILED', timestamp: '2024-12-10T14:30:00Z', user: 'user-001' },
      { state: 'ACKNOWLEDGED', timestamp: '2024-12-10T16:00:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-014',
    entityId: 'ent-002',
    complianceTypeId: 'comp-type-004',
    returnPeriod: '102024', // October 2024
    dueDate: '2024-12-25T23:59:59Z',
    status: 'IN_PROGRESS',
    assignedTo: 'user-001',
    workflowState: 'FORM_PREPARATION',
    metadata: {
      turnoverCategory: 'MEDIUM',
      monthlyTurnover: 1800000,
      regularTaxpayer: true,
      compositionScheme: false
    },
    documents: [
      { id: 'doc-038', documentType: 'SALES_REGISTER', status: 'VERIFIED' },
      { id: 'doc-039', documentType: 'PURCHASE_REGISTER', status: 'VERIFIED' }
    ],
    history: [
      { state: 'TRANSACTION_DATA_COLLECTION', timestamp: '2024-11-01T09:00:00Z', user: 'user-001' },
      { state: 'RECONCILIATION', timestamp: '2024-11-15T14:20:00Z', user: 'user-001' },
      { state: 'FORM_PREPARATION', timestamp: '2024-12-01T11:45:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-015',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-002',
    financialYear: '2023-24',
    dueDate: '2024-12-30T23:59:59Z',
    agmDate: '2024-09-30T11:00:00Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'FINANCIAL_DATA_COLLECTION',
    metadata: {
      turnover: 32000000,
      paidUpCapital: 15000000,
      netProfit: 4200000,
      auditRequired: true
    },
    documents: [
      { id: 'doc-040', documentType: 'BALANCE_SHEET', status: 'PENDING' },
      { id: 'doc-041', documentType: 'PROFIT_LOSS_STATEMENT', status: 'PENDING' },
      { id: 'doc-042', documentType: 'AUDITOR_REPORT', status: 'PENDING' },
      { id: 'doc-043', documentType: 'DIRECTORS_REPORT', status: 'PENDING' }
    ],
    history: [
      { state: 'FINANCIAL_DATA_COLLECTION', timestamp: '2024-11-01T09:30:00Z', user: 'user-001' }
    ]
  },
  // Add some items for January 2025 to test navigation
  {
    id: 'comp-016',
    entityId: 'ent-001',
    complianceTypeId: 'comp-type-004',
    returnPeriod: '122024', // December 2024
    dueDate: '2025-01-20T23:59:59Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'TRANSACTION_DATA_COLLECTION',
    metadata: {
      turnoverCategory: 'LARGE',
      monthlyTurnover: 2900000,
      regularTaxpayer: true,
      compositionScheme: false
    },
    documents: [
      { id: 'doc-044', documentType: 'SALES_REGISTER', status: 'PENDING' },
      { id: 'doc-045', documentType: 'PURCHASE_REGISTER', status: 'PENDING' }
    ],
    history: [
      { state: 'TRANSACTION_DATA_COLLECTION', timestamp: '2025-01-01T09:00:00Z', user: 'user-001' }
    ]
  },
  {
    id: 'comp-017',
    entityId: 'ent-002',
    complianceTypeId: 'comp-type-006',
    financialYear: '2023-24',
    assessmentYear: '2024-25',
    dueDate: '2025-01-31T23:59:59Z',
    status: 'PENDING',
    assignedTo: 'user-001',
    workflowState: 'FINANCIAL_DATA_COLLECTION',
    metadata: {
      turnover: 22000000,
      taxAuditRequired: true,
      transferPricingApplicable: false,
      presumptiveTaxation: false
    },
    documents: [
      { id: 'doc-046', documentType: 'FINANCIAL_STATEMENTS', status: 'PENDING' },
      { id: 'doc-047', documentType: 'TAX_AUDIT_REPORT', status: 'PENDING' }
    ],
    history: [
      { state: 'FINANCIAL_DATA_COLLECTION', timestamp: '2024-12-15T10:00:00Z', user: 'user-001' }
    ]
  }
];

// Mock document data
const mockDocuments = [
  {
    id: 'doc-001',
    entityId: 'ent-001',
    complianceId: 'comp-001',
    documentType: 'BOARD_RESOLUTION',
    fileName: 'board_resolution_2023.pdf',
    fileType: 'application/pdf',
    fileSize: 1024000,
    uploadedBy: 'user-002',
    uploadedAt: '2023-09-10T14:30:00Z',
    status: 'VERIFIED',
    verifiedBy: 'user-001',
    verifiedAt: '2023-09-12T11:15:00Z',
    comments: 'Verified and confirmed with board minutes',
    fileUrl: '/documents/board_resolution_2023.pdf'
  },
  {
    id: 'doc-002',
    entityId: 'ent-001',
    complianceId: 'comp-001',
    documentType: 'SHAREHOLDER_LIST',
    fileName: 'shareholder_list_2023.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 512000,
    uploadedBy: 'user-002',
    uploadedAt: '2023-09-11T10:45:00Z',
    status: 'VERIFIED',
    verifiedBy: 'user-001',
    verifiedAt: '2023-09-13T09:30:00Z',
    comments: 'All shareholder details are correct',
    fileUrl: '/documents/shareholder_list_2023.xlsx'
  },
  {
    id: 'doc-004',
    entityId: 'ent-001',
    complianceId: 'comp-002',
    documentType: 'BALANCE_SHEET',
    fileName: 'balance_sheet_fy_2022_23.pdf',
    fileType: 'application/pdf',
    fileSize: 1536000,
    uploadedBy: 'user-002',
    uploadedAt: '2023-08-15T15:20:00Z',
    status: 'VERIFIED',
    verifiedBy: 'user-004',
    verifiedAt: '2023-08-18T11:45:00Z',
    comments: 'Verified with audited financial statements',
    fileUrl: '/documents/balance_sheet_fy_2022_23.pdf'
  }
];

// Mock submission data
const mockSubmissions = [
  {
    id: 'sub-001',
    entityId: 'ent-001',
    complianceId: 'comp-001',
    portalType: 'MCA_PORTAL',
    formType: 'MGT-7',
    financialYear: '2022-23',
    submissionStatus: 'ACKNOWLEDGED',
    submissionTimeline: {
      prepared: '2023-10-01T10:00:00Z',
      validated: '2023-10-01T10:15:00Z',
      submitted: '2023-10-15T14:30:00Z',
      processed: '2023-10-17T14:00:00Z',
      acknowledged: '2023-10-17T16:20:00Z'
    },
    portalReferenceIds: {
      srn: 'T12345678',
      challanId: 'CH12345678',
      acknowledgmentId: 'ACK12345678'
    },
    submittedBy: 'user-001',
    submissionData: {
      dataHash: '6d8f1c2e3b7a9d0e4f5c2b1a8d7e6f5c',
      dataSnapshotId: 'SNAP12345678'
    },
    responses: [
      {
        timestamp: '2023-10-15T14:30:15Z',
        status: 'RECEIVED',
        message: 'Filing received for processing',
        referenceId: 'T12345678'
      },
      {
        timestamp: '2023-10-17T14:00:00Z',
        status: 'PROCESSED',
        message: 'Filing processed successfully',
        referenceId: 'CH12345678'
      }
    ],
    acknowledgment: {
      receivedAt: '2023-10-17T16:20:00Z',
      acknowledgmentNumber: 'ACK12345678',
      documentId: 'doc-ack-001'
    },
    errors: [],
    retryHistory: []
  },
  {
    id: 'sub-002',
    entityId: 'ent-001',
    complianceId: 'comp-002',
    portalType: 'MCA_PORTAL',
    formType: 'AOC-4',
    financialYear: '2022-23',
    submissionStatus: 'ACKNOWLEDGED',
    submissionTimeline: {
      prepared: '2023-10-05T09:00:00Z',
      validated: '2023-10-05T09:20:00Z',
      submitted: '2023-10-10T10:45:00Z',
      processed: '2023-10-12T14:30:00Z',
      acknowledged: '2023-10-12T16:15:00Z'
    },
    portalReferenceIds: {
      srn: 'T87654321',
      challanId: 'CH87654321',
      acknowledgmentId: 'ACK87654321'
    },
    submittedBy: 'user-001',
    submissionData: {
      dataHash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
      dataSnapshotId: 'SNAP87654321'
    },
    responses: [
      {
        timestamp: '2023-10-10T10:45:15Z',
        status: 'RECEIVED',
        message: 'Filing received for processing',
        referenceId: 'T87654321'
      },
      {
        timestamp: '2023-10-12T14:30:00Z',
        status: 'PROCESSED',
        message: 'Filing processed successfully',
        referenceId: 'CH87654321'
      }
    ],
    acknowledgment: {
      receivedAt: '2023-10-12T16:15:00Z',
      acknowledgmentNumber: 'ACK87654321',
      documentId: 'doc-ack-002'
    },
    errors: [],
    retryHistory: []
  }
];

export const ComplianceProvider = ({ children }) => {
  const [entities, setEntities] = useState(mockEntities);
  const [compliances, setCompliances] = useState(mockCompliances);
  const [documents, setDocuments] = useState(mockDocuments);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get entity by ID
  const getEntityById = (entityId) => {
    return entities.find(entity => entity.id === entityId);
  };

  // Get compliance by ID
  const getComplianceById = (complianceId) => {
    return compliances.find(compliance => compliance.id === complianceId);
  };

  // Get compliance type by ID
  const getComplianceTypeById = (typeId) => {
    return complianceTypes.find(type => type.id === typeId);
  };

  // Get compliances by entity ID
  const getCompliancesByEntity = (entityId) => {
    return compliances.filter(compliance => compliance.entityId === entityId);
  };

  // Get documents by compliance ID
  const getDocumentsByCompliance = (complianceId) => {
    return documents.filter(document => document.complianceId === complianceId);
  };

  // Get submissions by compliance ID
  const getSubmissionsByCompliance = (complianceId) => {
    return submissions.filter(submission => submission.complianceId === complianceId);
  };

  // Create new compliance
  const createCompliance = (complianceData) => {
    setLoading(true);
    setError('');

    try {
      const newCompliance = {
        id: `comp-${uuidv4().substring(0, 8)}`,
        ...complianceData,
        status: 'PENDING',
        history: [
          {
            state: complianceData.workflowState || 'DATA_COLLECTION',
            timestamp: new Date().toISOString(),
            user: complianceData.assignedTo
          }
        ]
      };

      setCompliances(prevCompliances => [...prevCompliances, newCompliance]);
      setLoading(false);
      return newCompliance;
    } catch (err) {
      setError('Failed to create compliance');
      setLoading(false);
      throw err;
    }
  };

  // Update compliance
  const updateCompliance = (complianceId, updates) => {
    setLoading(true);
    setError('');

    try {
      setCompliances(prevCompliances => 
        prevCompliances.map(compliance => 
          compliance.id === complianceId
            ? { ...compliance, ...updates }
            : compliance
        )
      );
      
      setLoading(false);
      return getComplianceById(complianceId);
    } catch (err) {
      setError('Failed to update compliance');
      setLoading(false);
      throw err;
    }
  };

  // Update compliance status
  const updateComplianceStatus = (complianceId, status, userId) => {
    setLoading(true);
    setError('');

    try {
      const compliance = getComplianceById(complianceId);
      if (!compliance) {
        throw new Error('Compliance not found');
      }

      const updatedCompliance = {
        ...compliance,
        status,
        history: [
          ...compliance.history,
          {
            state: status,
            timestamp: new Date().toISOString(),
            user: userId
          }
        ]
      };

      setCompliances(prevCompliances => 
        prevCompliances.map(comp => 
          comp.id === complianceId ? updatedCompliance : comp
        )
      );
      
      setLoading(false);
      return updatedCompliance;
    } catch (err) {
      setError('Failed to update compliance status');
      setLoading(false);
      throw err;
    }
  };

  // Update workflow state
  const updateWorkflowState = (complianceId, workflowState, userId) => {
    setLoading(true);
    setError('');

    try {
      const compliance = getComplianceById(complianceId);
      if (!compliance) {
        throw new Error('Compliance not found');
      }

      const updatedCompliance = {
        ...compliance,
        workflowState,
        history: [
          ...compliance.history,
          {
            state: workflowState,
            timestamp: new Date().toISOString(),
            user: userId
          }
        ]
      };

      setCompliances(prevCompliances => 
        prevCompliances.map(comp => 
          comp.id === complianceId ? updatedCompliance : comp
        )
      );
      
      setLoading(false);
      return updatedCompliance;
    } catch (err) {
      setError('Failed to update workflow state');
      setLoading(false);
      throw err;
    }
  };

  // Add document
  const addDocument = (documentData) => {
    setLoading(true);
    setError('');

    try {
      const newDocument = {
        id: `doc-${uuidv4().substring(0, 8)}`,
        uploadedAt: new Date().toISOString(),
        status: 'PENDING',
        ...documentData
      };

      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      setLoading(false);
      return newDocument;
    } catch (err) {
      setError('Failed to add document');
      setLoading(false);
      throw err;
    }
  };

  // Update document status
  const updateDocumentStatus = (documentId, status, userId, comments = '') => {
    setLoading(true);
    setError('');

    try {
      setDocuments(prevDocuments => 
        prevDocuments.map(document => 
          document.id === documentId
            ? { 
                ...document, 
                status, 
                comments,
                ...(status === 'VERIFIED' ? { 
                  verifiedBy: userId, 
                  verifiedAt: new Date().toISOString() 
                } : {})
              }
            : document
        )
      );
      
      setLoading(false);
      return documents.find(doc => doc.id === documentId);
    } catch (err) {
      setError('Failed to update document status');
      setLoading(false);
      throw err;
    }
  };

  // Create submission
  const createSubmission = (submissionData) => {
    setLoading(true);
    setError('');

    try {
      const newSubmission = {
        id: `sub-${uuidv4().substring(0, 8)}`,
        submissionStatus: 'PREPARED',
        submissionTimeline: {
          prepared: new Date().toISOString()
        },
        responses: [],
        errors: [],
        retryHistory: [],
        ...submissionData
      };

      setSubmissions(prevSubmissions => [...prevSubmissions, newSubmission]);
      setLoading(false);
      return newSubmission;
    } catch (err) {
      setError('Failed to create submission');
      setLoading(false);
      throw err;
    }
  };

  // Update submission
  const updateSubmission = (submissionId, updates) => {
    setLoading(true);
    setError('');

    try {
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(submission => 
          submission.id === submissionId
            ? { ...submission, ...updates }
            : submission
        )
      );
      
      setLoading(false);
      return submissions.find(sub => sub.id === submissionId);
    } catch (err) {
      setError('Failed to update submission');
      setLoading(false);
      throw err;
    }
  };

  // Get upcoming compliances (due in the next 30 days)
  const getUpcomingCompliances = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    return compliances.filter(compliance => {
      if (compliance.status === 'COMPLETED') return false;
      
      const dueDate = new Date(compliance.dueDate);
      return dueDate >= now && dueDate <= thirtyDaysFromNow;
    });
  };

  // Get overdue compliances
  const getOverdueCompliances = () => {
    const now = new Date();
    
    return compliances.filter(compliance => {
      if (compliance.status === 'COMPLETED') return false;
      
      const dueDate = new Date(compliance.dueDate);
      return dueDate < now;
    });
  };

  // Calculate compliance statistics
  const getComplianceStats = (entityId = null) => {
    let filteredCompliances = compliances;
    if (entityId) {
      filteredCompliances = compliances.filter(comp => comp.entityId === entityId);
    }

    const total = filteredCompliances.length;
    const completed = filteredCompliances.filter(comp => comp.status === 'COMPLETED').length;
    const inProgress = filteredCompliances.filter(comp => comp.status === 'IN_PROGRESS').length;
    const pending = filteredCompliances.filter(comp => comp.status === 'PENDING').length;
    const overdue = getOverdueCompliances().filter(comp => entityId ? comp.entityId === entityId : true).length;

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  };

  const value = {
    entities,
    compliances,
    complianceTypes,
    documents,
    submissions,
    loading,
    error,
    getEntityById,
    getComplianceById,
    getComplianceTypeById,
    getCompliancesByEntity,
    getDocumentsByCompliance,
    getSubmissionsByCompliance,
    createCompliance,
    updateCompliance,
    updateComplianceStatus,
    updateWorkflowState,
    addDocument,
    updateDocumentStatus,
    createSubmission,
    updateSubmission,
    getUpcomingCompliances,
    getOverdueCompliances,
    getComplianceStats
  };

  return <ComplianceContext.Provider value={value}>{children}</ComplianceContext.Provider>;
};

// Custom hook to use the compliance context
export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};