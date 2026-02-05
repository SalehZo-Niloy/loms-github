import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../components/ui/ui-table.component';
import { tradeTheme } from '../../../../styles/theme';

interface PriorityItem {
  id: string;
  label: string;
  description: string;
  count: number;
  badgeClass: string;
  icon: string;
}

interface InboxTab {
  id: string;
  label: string;
  count: number;
}

interface ApplicationRow {
  id: string;
  customer: string;
  type: string;
  amount: string;
  submitted: string;
  status: string;
  statusVariant: 'primary' | 'warning';
  sla: string;
}

interface IssuanceRow {
  id: string;
  type: string;
  amount: string;
  approvalDate: string;
  issuanceStatus: string;
  accountingStatus: string;
}

interface AmendmentRow {
  id: string;
  originalRef: string;
  amendmentType: string;
  financialImpact: string;
  submitted: string;
  status: string;
}

interface ClaimRow {
  id: string;
  guaranteeRef: string;
  claimAmount: string;
  submitted: string;
  status: string;
}

interface MetricItem {
  label: string;
  value: number | string;
}

type BranchId =
  | 'dhaka-main'
  | 'gazipur-branch'
  | 'chattogram-branch'
  | 'sylhet-branch'
  | 'khulna-branch';

interface BranchOption {
  id: BranchId;
  label: string;
}

interface BranchData {
  priorityItems: PriorityItem[];
  inboxTabs: InboxTab[];
  applications: ApplicationRow[];
  issuanceRows: IssuanceRow[];
  amendmentRows: AmendmentRow[];
  claimRows: ClaimRow[];
  performanceMetrics: MetricItem[];
  stockMetrics: MetricItem[];
  correctionQueue: QueueItem[];
  recentActivity: ActivityItem[];
  notifications: NotificationItem[];
}

interface QueueItem {
  id: string;
  title: string;
  description: string;
  age: string;
}

interface ActivityItem {
  label: string;
  reference: string;
  timeAgo: string;
  dotClass: string;
}

interface NotificationItem {
  title: string;
  description: string;
  timeAgo: string;
  borderClass: string;
}

@Component({
  selector: 'app-guarantee-officer-dashboard-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiTableComponent],
  templateUrl: './officer-dashboard.page.html'
})
export class GuaranteeOfficerDashboardPageComponent {
  theme = tradeTheme;

  branchOptions: BranchOption[] = [
    { id: 'dhaka-main', label: 'All Branches' },
    { id: 'gazipur-branch', label: 'Gazipur Branch (Outer Dhaka)' },
    { id: 'chattogram-branch', label: 'Chattogram Branch' },
    { id: 'sylhet-branch', label: 'Sylhet Branch' },
    { id: 'khulna-branch', label: 'Khulna Branch' }
  ];

  selectedBranchId: BranchId = 'dhaka-main';

  private dhakaMainSnapshot: BranchData | null = null;

  private gazipurBranchData: BranchData = {
    priorityItems: [
      {
        id: 'new',
        label: 'New Applications',
        description: 'Awaiting review & escalation',
        count: 6,
        badgeClass: 'bg-indigo-50 text-indigo-700',
        icon: '📄'
      },
      {
        id: 'returned',
        label: 'Returned for Correction',
        description: 'Customer action required',
        count: 2,
        badgeClass: 'bg-amber-50 text-amber-700',
        icon: '↩️'
      },
      {
        id: 'amendments',
        label: 'Pending Amendments',
        description: 'Amendment requests awaiting review',
        count: 3,
        badgeClass: 'bg-violet-50 text-violet-700',
        icon: '✏️'
      },
      {
        id: 'claims',
        label: 'Pending Claims',
        description: 'Claims awaiting validation',
        count: 1,
        badgeClass: tradeTheme.status.danger,
        icon: '⚖️'
      },
      {
        id: 'issuance',
        label: 'Issuance Pending',
        description: 'Awaiting issuance & posting',
        count: 4,
        badgeClass: tradeTheme.status.success,
        icon: '✅'
      }
    ],
    inboxTabs: [
      { id: 'applications', label: 'Guarantee Applications', count: 6 },
      { id: 'issuance', label: 'Issuance & Accounting', count: 3 },
      { id: 'amendments', label: 'Amendment Requests', count: 2 },
      { id: 'claims', label: 'Claim Requests', count: 1 }
    ],
    applications: [
      {
        id: 'GTR-2024-002001',
        customer: 'Gazipur Textiles Ltd',
        type: 'Performance',
        amount: 'USD 300,000',
        submitted: 'Jan 11, 2024',
        status: 'Submitted',
        statusVariant: 'primary',
        sla: 'On Time'
      },
      {
        id: 'GTR-2024-002002',
        customer: 'Narayanganj Steel Works',
        type: 'Bid Bond',
        amount: 'USD 180,000',
        submitted: 'Jan 10, 2024',
        status: 'Return',
        statusVariant: 'warning',
        sla: '02:10'
      },
      {
        id: 'GTR-2024-002003',
        customer: 'Savar Industrial Group',
        type: 'Financial',
        amount: 'USD 90,000',
        submitted: 'Jan 9, 2024',
        status: 'Submit',
        statusVariant: 'primary',
        sla: '03:20'
      }
    ],
    issuanceRows: [
      {
        id: 'GTR-2024-002010',
        type: 'Performance',
        amount: 'USD 420,000',
        approvalDate: 'Jan 10, 2024',
        issuanceStatus: 'Pending',
        accountingStatus: 'Posted'
      },
      {
        id: 'GTR-2024-002011',
        type: 'Bid Bond',
        amount: 'USD 150,000',
        approvalDate: 'Jan 7, 2024',
        issuanceStatus: 'Issued',
        accountingStatus: 'Posted'
      }
    ],
    amendmentRows: [
      {
        id: 'AMD-2024-010',
        originalRef: 'GTR-2024-002000',
        amendmentType: 'Amount Increase',
        financialImpact: '+USD 75,000',
        submitted: 'Jan 10, 2024',
        status: 'Submitted'
      },
      {
        id: 'AMD-2024-011',
        originalRef: 'GTR-2024-002005',
        amendmentType: 'Expiry extension',
        financialImpact: 'No change',
        submitted: 'Jan 8, 2024',
        status: 'Pending approval'
      }
    ],
    claimRows: [
      {
        id: 'CLM-2024-010',
        guaranteeRef: 'GTR-2024-002020',
        claimAmount: 'USD 40,000',
        submitted: 'Jan 9, 2024',
        status: 'New'
      }
    ],
    performanceMetrics: [
      { label: 'Guarantees Issued', value: 2 },
      { label: 'Amendments Processed', value: 3 },
      { label: 'Claims Settled', value: 0 }
    ],
    stockMetrics: [
      { label: 'Outstanding Guarantees', value: 72 },
      { label: 'Claims in Progress', value: 3 }
    ],
    correctionQueue: [
      {
        id: 'GTR-2024-002002',
        title: 'Updated financial statements',
        description: 'Customer notified',
        age: '1 day ago'
      },
      {
        id: 'AMD-2024-010',
        title: 'Amount increase justification',
        description: 'Awaiting RM confirmation',
        age: '4 hours ago'
      }
    ],
    recentActivity: [
      {
        label: 'Guarantee Issued',
        reference: 'GTR-2024-002015',
        timeAgo: '35 minutes ago',
        dotClass: 'bg-emerald-500'
      },
      {
        label: 'Application Escalated',
        reference: 'GTR-2024-002001',
        timeAgo: '1 hour ago',
        dotClass: 'bg-blue-500'
      },
      {
        label: 'Sent Back for Correction',
        reference: 'GTR-2024-002002',
        timeAgo: '2 hours ago',
        dotClass: 'bg-amber-500'
      }
    ],
    notifications: [
      {
        title: 'New Submission',
        description: 'GTR-2024-002016 received',
        timeAgo: '12 minutes ago',
        borderClass: 'border-blue-200'
      },
      {
        title: 'Checker Approved',
        description: 'GTR-2024-002010 approved',
        timeAgo: '40 minutes ago',
        borderClass: 'border-emerald-200'
      }
    ]
  };

  private chattogramBranchData: BranchData = {
    priorityItems: [
      {
        id: 'new',
        label: 'New Applications',
        description: 'Awaiting review & escalation',
        count: 9,
        badgeClass: 'bg-indigo-50 text-indigo-700',
        icon: '📄'
      },
      {
        id: 'returned',
        label: 'Returned for Correction',
        description: 'Customer action required',
        count: 3,
        badgeClass: 'bg-amber-50 text-amber-700',
        icon: '↩️'
      },
      {
        id: 'amendments',
        label: 'Pending Amendments',
        description: 'Amendment requests awaiting review',
        count: 4,
        badgeClass: 'bg-violet-50 text-violet-700',
        icon: '✏️'
      },
      {
        id: 'claims',
        label: 'Pending Claims',
        description: 'Claims awaiting validation',
        count: 2,
        badgeClass: tradeTheme.status.danger,
        icon: '⚖️'
      },
      {
        id: 'issuance',
        label: 'Issuance Pending',
        description: 'Awaiting issuance & posting',
        count: 5,
        badgeClass: tradeTheme.status.success,
        icon: '✅'
      }
    ],
    inboxTabs: [
      { id: 'applications', label: 'Guarantee Applications', count: 9 },
      { id: 'issuance', label: 'Issuance & Accounting', count: 4 },
      { id: 'amendments', label: 'Amendment Requests', count: 3 },
      { id: 'claims', label: 'Claim Requests', count: 2 }
    ],
    applications: [
      {
        id: 'GTR-2024-003001',
        customer: 'Chattogram Port Services Ltd',
        type: 'Performance',
        amount: 'USD 420,000',
        submitted: 'Jan 11, 2024',
        status: 'Submitted',
        statusVariant: 'primary',
        sla: 'On Time'
      },
      {
        id: 'GTR-2024-003002',
        customer: 'Karnaphuli Shipyards',
        type: 'Bid Bond',
        amount: 'USD 220,000',
        submitted: 'Jan 10, 2024',
        status: 'Return',
        statusVariant: 'warning',
        sla: '01:45'
      },
      {
        id: 'GTR-2024-003003',
        customer: 'Agrabad Trading House',
        type: 'Financial',
        amount: 'USD 160,000',
        submitted: 'Jan 9, 2024',
        status: 'Submit',
        statusVariant: 'primary',
        sla: '02:30'
      }
    ],
    issuanceRows: [
      {
        id: 'GTR-2024-003010',
        type: 'Performance',
        amount: 'USD 500,000',
        approvalDate: 'Jan 10, 2024',
        issuanceStatus: 'Pending',
        accountingStatus: 'Posted'
      },
      {
        id: 'GTR-2024-003011',
        type: 'Bid Bond',
        amount: 'USD 210,000',
        approvalDate: 'Jan 7, 2024',
        issuanceStatus: 'Issued',
        accountingStatus: 'Posted'
      }
    ],
    amendmentRows: [
      {
        id: 'AMD-2024-020',
        originalRef: 'GTR-2024-003000',
        amendmentType: 'Amount Increase',
        financialImpact: '+USD 120,000',
        submitted: 'Jan 10, 2024',
        status: 'Submitted'
      },
      {
        id: 'AMD-2024-021',
        originalRef: 'GTR-2024-003005',
        amendmentType: 'Expiry extension',
        financialImpact: 'No change',
        submitted: 'Jan 8, 2024',
        status: 'Pending approval'
      }
    ],
    claimRows: [
      {
        id: 'CLM-2024-020',
        guaranteeRef: 'GTR-2024-003020',
        claimAmount: 'USD 65,000',
        submitted: 'Jan 9, 2024',
        status: 'New'
      },
      {
        id: 'CLM-2024-021',
        guaranteeRef: 'GTR-2024-003015',
        claimAmount: 'USD 90,000',
        submitted: 'Jan 8, 2024',
        status: 'Pending documents'
      }
    ],
    performanceMetrics: [
      { label: 'Guarantees Issued', value: 3 },
      { label: 'Amendments Processed', value: 4 },
      { label: 'Claims Settled', value: 1 }
    ],
    stockMetrics: [
      { label: 'Outstanding Guarantees', value: 98 },
      { label: 'Claims in Progress', value: 5 }
    ],
    correctionQueue: [
      {
        id: 'GTR-2024-003002',
        title: 'Updated trade license',
        description: 'Customer notified',
        age: '2 days ago'
      },
      {
        id: 'AMD-2024-020',
        title: 'Additional collateral review',
        description: 'Awaiting RM confirmation',
        age: '6 hours ago'
      }
    ],
    recentActivity: [
      {
        label: 'Guarantee Issued',
        reference: 'GTR-2024-003012',
        timeAgo: '20 minutes ago',
        dotClass: 'bg-emerald-500'
      },
      {
        label: 'Application Escalated',
        reference: 'GTR-2024-003001',
        timeAgo: '50 minutes ago',
        dotClass: 'bg-blue-500'
      }
    ],
    notifications: [
      {
        title: 'New Submission',
        description: 'GTR-2024-003016 received',
        timeAgo: '18 minutes ago',
        borderClass: 'border-blue-200'
      },
      {
        title: 'Checker Approved',
        description: 'GTR-2024-003010 approved',
        timeAgo: '1 hour ago',
        borderClass: 'border-emerald-200'
      }
    ]
  };

  private sylhetBranchData: BranchData = {
    priorityItems: [
      {
        id: 'new',
        label: 'New Applications',
        description: 'Awaiting review & escalation',
        count: 4,
        badgeClass: 'bg-indigo-50 text-indigo-700',
        icon: '📄'
      },
      {
        id: 'returned',
        label: 'Returned for Correction',
        description: 'Customer action required',
        count: 1,
        badgeClass: 'bg-amber-50 text-amber-700',
        icon: '↩️'
      },
      {
        id: 'amendments',
        label: 'Pending Amendments',
        description: 'Amendment requests awaiting review',
        count: 2,
        badgeClass: 'bg-violet-50 text-violet-700',
        icon: '✏️'
      },
      {
        id: 'claims',
        label: 'Pending Claims',
        description: 'Claims awaiting validation',
        count: 1,
        badgeClass: tradeTheme.status.danger,
        icon: '⚖️'
      },
      {
        id: 'issuance',
        label: 'Issuance Pending',
        description: 'Awaiting issuance & posting',
        count: 2,
        badgeClass: tradeTheme.status.success,
        icon: '✅'
      }
    ],
    inboxTabs: [
      { id: 'applications', label: 'Guarantee Applications', count: 4 },
      { id: 'issuance', label: 'Issuance & Accounting', count: 2 },
      { id: 'amendments', label: 'Amendment Requests', count: 2 },
      { id: 'claims', label: 'Claim Requests', count: 1 }
    ],
    applications: [
      {
        id: 'GTR-2024-004001',
        customer: 'Sylhet Tea Exports',
        type: 'Performance',
        amount: 'USD 260,000',
        submitted: 'Jan 11, 2024',
        status: 'Submitted',
        statusVariant: 'primary',
        sla: 'On Time'
      },
      {
        id: 'GTR-2024-004002',
        customer: 'Hazrat Shahjalal Traders',
        type: 'Financial',
        amount: 'USD 140,000',
        submitted: 'Jan 10, 2024',
        status: 'Submit',
        statusVariant: 'primary',
        sla: '03:10'
      }
    ],
    issuanceRows: [
      {
        id: 'GTR-2024-004010',
        type: 'Performance',
        amount: 'USD 280,000',
        approvalDate: 'Jan 9, 2024',
        issuanceStatus: 'Pending',
        accountingStatus: 'Posted'
      }
    ],
    amendmentRows: [
      {
        id: 'AMD-2024-030',
        originalRef: 'GTR-2024-004000',
        amendmentType: 'Amount Increase',
        financialImpact: '+USD 60,000',
        submitted: 'Jan 9, 2024',
        status: 'Submitted'
      },
      {
        id: 'AMD-2024-031',
        originalRef: 'GTR-2024-004005',
        amendmentType: 'Expiry extension',
        financialImpact: 'No change',
        submitted: 'Jan 8, 2024',
        status: 'Pending approval'
      }
    ],
    claimRows: [
      {
        id: 'CLM-2024-030',
        guaranteeRef: 'GTR-2024-004020',
        claimAmount: 'USD 35,000',
        submitted: 'Jan 9, 2024',
        status: 'New'
      }
    ],
    performanceMetrics: [
      { label: 'Guarantees Issued', value: 1 },
      { label: 'Amendments Processed', value: 2 },
      { label: 'Claims Settled', value: 0 }
    ],
    stockMetrics: [
      { label: 'Outstanding Guarantees', value: 40 },
      { label: 'Claims in Progress', value: 2 }
    ],
    correctionQueue: [
      {
        id: 'AMD-2024-031',
        title: 'Expiry change confirmation',
        description: 'Awaiting RM confirmation',
        age: '5 hours ago'
      }
    ],
    recentActivity: [
      {
        label: 'Guarantee Issued',
        reference: 'GTR-2024-004010',
        timeAgo: '1 hour ago',
        dotClass: 'bg-emerald-500'
      }
    ],
    notifications: [
      {
        title: 'New Submission',
        description: 'GTR-2024-004006 received',
        timeAgo: '45 minutes ago',
        borderClass: 'border-blue-200'
      }
    ]
  };

  private khulnaBranchData: BranchData = {
    priorityItems: [
      {
        id: 'new',
        label: 'New Applications',
        description: 'Awaiting review & escalation',
        count: 5,
        badgeClass: 'bg-indigo-50 text-indigo-700',
        icon: '📄'
      },
      {
        id: 'returned',
        label: 'Returned for Correction',
        description: 'Customer action required',
        count: 1,
        badgeClass: 'bg-amber-50 text-amber-700',
        icon: '↩️'
      },
      {
        id: 'amendments',
        label: 'Pending Amendments',
        description: 'Amendment requests awaiting review',
        count: 2,
        badgeClass: 'bg-violet-50 text-violet-700',
        icon: '✏️'
      },
      {
        id: 'claims',
        label: 'Pending Claims',
        description: 'Claims awaiting validation',
        count: 1,
        badgeClass: tradeTheme.status.danger,
        icon: '⚖️'
      },
      {
        id: 'issuance',
        label: 'Issuance Pending',
        description: 'Awaiting issuance & posting',
        count: 3,
        badgeClass: tradeTheme.status.success,
        icon: '✅'
      }
    ],
    inboxTabs: [
      { id: 'applications', label: 'Guarantee Applications', count: 5 },
      { id: 'issuance', label: 'Issuance & Accounting', count: 3 },
      { id: 'amendments', label: 'Amendment Requests', count: 2 },
      { id: 'claims', label: 'Claim Requests', count: 1 }
    ],
    applications: [
      {
        id: 'GTR-2024-005001',
        customer: 'Khulna Jute Mills',
        type: 'Performance',
        amount: 'USD 310,000',
        submitted: 'Jan 11, 2024',
        status: 'Submitted',
        statusVariant: 'primary',
        sla: 'On Time'
      },
      {
        id: 'GTR-2024-005002',
        customer: 'Mongla Port Traders',
        type: 'Bid Bond',
        amount: 'USD 190,000',
        submitted: 'Jan 10, 2024',
        status: 'Return',
        statusVariant: 'warning',
        sla: '02:00'
      }
    ],
    issuanceRows: [
      {
        id: 'GTR-2024-005010',
        type: 'Performance',
        amount: 'USD 330,000',
        approvalDate: 'Jan 9, 2024',
        issuanceStatus: 'Pending',
        accountingStatus: 'Posted'
      },
      {
        id: 'GTR-2024-005011',
        type: 'Financial',
        amount: 'USD 210,000',
        approvalDate: 'Jan 7, 2024',
        issuanceStatus: 'Issued',
        accountingStatus: 'Posted'
      }
    ],
    amendmentRows: [
      {
        id: 'AMD-2024-040',
        originalRef: 'GTR-2024-005000',
        amendmentType: 'Amount Increase',
        financialImpact: '+USD 90,000',
        submitted: 'Jan 9, 2024',
        status: 'Submitted'
      },
      {
        id: 'AMD-2024-041',
        originalRef: 'GTR-2024-005005',
        amendmentType: 'Expiry extension',
        financialImpact: 'No change',
        submitted: 'Jan 8, 2024',
        status: 'Pending approval'
      }
    ],
    claimRows: [
      {
        id: 'CLM-2024-040',
        guaranteeRef: 'GTR-2024-005020',
        claimAmount: 'USD 55,000',
        submitted: 'Jan 9, 2024',
        status: 'New'
      }
    ],
    performanceMetrics: [
      { label: 'Guarantees Issued', value: 2 },
      { label: 'Amendments Processed', value: 2 },
      { label: 'Claims Settled', value: 0 }
    ],
    stockMetrics: [
      { label: 'Outstanding Guarantees', value: 64 },
      { label: 'Claims in Progress', value: 3 }
    ],
    correctionQueue: [
      {
        id: 'GTR-2024-005002',
        title: 'Updated contract draft',
        description: 'Customer notified',
        age: '1 day ago'
      }
    ],
    recentActivity: [
      {
        label: 'Guarantee Issued',
        reference: 'GTR-2024-005010',
        timeAgo: '1 hour ago',
        dotClass: 'bg-emerald-500'
      }
    ],
    notifications: [
      {
        title: 'New Submission',
        description: 'GTR-2024-005006 received',
        timeAgo: '55 minutes ago',
        borderClass: 'border-blue-200'
      }
    ]
  };

  constructor(private router: Router) {}

  priorityItems: PriorityItem[] = [
    {
      id: 'new',
      label: 'New Applications',
      description: 'Awaiting review & escalation',
      count: 12,
      badgeClass: 'bg-indigo-50 text-indigo-700',
      icon: '📄'
    },
    {
      id: 'returned',
      label: 'Returned for Correction',
      description: 'Customer action required',
      count: 5,
      badgeClass: 'bg-amber-50 text-amber-700',
      icon: '↩️'
    },
    {
      id: 'amendments',
      label: 'Pending Amendments',
      description: 'Amendment requests awaiting review',
      count: 7,
      badgeClass: 'bg-violet-50 text-violet-700',
      icon: '✏️'
    },
    {
      id: 'claims',
      label: 'Pending Claims',
      description: 'Claims awaiting validation',
      count: 3,
      badgeClass: tradeTheme.status.danger,
      icon: '⚖️'
    },
    {
      id: 'issuance',
      label: 'Issuance Pending',
      description: 'Awaiting issuance & posting',
      count: 8,
      badgeClass: tradeTheme.status.success,
      icon: '✅'
    }
  ];

  inboxTabs: InboxTab[] = [
    { id: 'applications', label: 'Guarantee Applications', count: 12 },
    { id: 'issuance', label: 'Issuance & Accounting', count: 6 },
    { id: 'amendments', label: 'Amendment Requests', count: 4 },
    { id: 'claims', label: 'Claim Requests', count: 3 }
  ];

  applications: ApplicationRow[] = [
    {
      id: 'GTR-2024-001234',
      customer: 'John Mitchell Trading LLC',
      type: 'Performance',
      amount: 'USD 500,000',
      submitted: 'Jan 11, 2024',
      status: 'Submitted',
      statusVariant: 'primary',
      sla: 'On Time'
    },
    {
      id: 'GTR-2024-001235',
      customer: 'ABC Construction Co.',
      type: 'Bid Bond',
      amount: 'USD 250,000',
      submitted: 'Jan 10, 2024',
      status: 'Return',
      statusVariant: 'warning',
      sla: '01:15'
    },
    {
      id: 'GTR-2024-001236',
      customer: 'Global Trading LLC',
      type: 'Financial',
      amount: 'USD 100,000',
      submitted: 'Jan 9, 2024',
      status: 'Submit',
      statusVariant: 'primary',
      sla: '02:05'
    }
  ];

  issuanceRows: IssuanceRow[] = [
    {
      id: 'GTR-2024-001230',
      type: 'Performance',
      amount: 'USD 750,000',
      approvalDate: 'Jan 10, 2024',
      issuanceStatus: 'Pending',
      accountingStatus: 'Posted'
    },
    {
      id: 'GTR-2024-001231',
      type: 'Bid Bond',
      amount: 'USD 300,000',
      approvalDate: 'Jan 7, 2024',
      issuanceStatus: 'Issued',
      accountingStatus: 'Posted'
    },
    {
      id: 'GTR-2024-001232',
      type: 'Financial',
      amount: 'USD 200,000',
      approvalDate: 'Jan 6, 2024',
      issuanceStatus: 'Pending issuance',
      accountingStatus: 'Not posted'
    }
  ];

  amendmentRows: AmendmentRow[] = [
    {
      id: 'AMD-2024-001',
      originalRef: 'GTR-2024-001200',
      amendmentType: 'Amount Increase',
      financialImpact: '+USD 100,000',
      submitted: 'Jan 11, 2024',
      status: 'Submitted'
    },
    {
      id: 'AMD-2024-002',
      originalRef: 'GTR-2024-001215',
      amendmentType: 'Amount increase',
      financialImpact: '+ USD 150,000',
      submitted: 'Jan 9, 2024',
      status: 'Pending approval'
    },
    {
      id: 'AMD-2024-003',
      originalRef: 'GTR-2024-001210',
      amendmentType: 'Beneficiary change',
      financialImpact: 'No change',
      submitted: 'Jan 8, 2024',
      status: 'Returned'
    }
  ];

  claimRows: ClaimRow[] = [
    {
      id: 'CLM-2024-001',
      guaranteeRef: 'GTR-2024-001180',
      claimAmount: 'USD 50,000',
      submitted: 'Jan 10, 2024',
      status: 'New'
    },
    {
      id: 'CLM-2024-002',
      guaranteeRef: 'GTR-2024-001140',
      claimAmount: 'USD 250,000',
      submitted: 'Jan 8, 2024',
      status: 'Pending documents'
    },
    {
      id: 'CLM-2024-003',
      guaranteeRef: 'GTR-2024-001130',
      claimAmount: 'USD 150,000',
      submitted: 'Jan 7, 2024',
      status: 'Settled'
    }
  ];

  performanceMetrics: MetricItem[] = [
    { label: 'Guarantees Issued', value: 4 },
    { label: 'Amendments Processed', value: 5 },
    { label: 'Claims Settled', value: 1 }
  ];

  stockMetrics: MetricItem[] = [
    { label: 'Outstanding Guarantees', value: 156 },
    { label: 'Claims in Progress', value: 8 }
  ];

  correctionQueue: QueueItem[] = [
    {
      id: 'GTR-2024-001235',
      title: 'Missing board resolution',
      description: 'Customer notified',
      age: '2 days ago'
    },
    {
      id: 'AMD-2024-002',
      title: 'Expiry reduction approval',
      description: 'Awaiting RM confirmation',
      age: '1 day ago'
    },
    {
      id: 'CLM-2024-003',
      title: 'Incomplete claim documents',
      description: 'Customer notified',
      age: '3 hours ago'
    }
  ];

  recentActivity: ActivityItem[] = [
    {
      label: 'Guarantee Issued',
      reference: 'GTR-2024-001239',
      timeAgo: '10 minutes ago',
      dotClass: 'bg-emerald-500'
    },
    {
      label: 'Application Escalated',
      reference: 'GTR-2024-001230',
      timeAgo: '25 minutes ago',
      dotClass: 'bg-blue-500'
    },
    {
      label: 'Sent Back for Correction',
      reference: 'GTR-2024-001235',
      timeAgo: '1 hour ago',
      dotClass: 'bg-amber-500'
    },
    {
      label: 'Amendment Processed',
      reference: 'AMD-2024-001',
      timeAgo: '2 hours ago',
      dotClass: 'bg-violet-500'
    },
    {
      label: 'Claim Settled',
      reference: 'CLM-2024-001',
      timeAgo: '3 hours ago',
      dotClass: 'bg-rose-500'
    }
  ];

  notifications: NotificationItem[] = [
    {
      title: 'New Submission',
      description: 'GTR-2024-001237 received',
      timeAgo: '5 minutes ago',
      borderClass: 'border-blue-200'
    },
    {
      title: 'Checker Approved',
      description: 'GTR-2024-001230 approved',
      timeAgo: '15 minutes ago',
      borderClass: 'border-emerald-200'
    },
    {
      title: 'Resubmission',
      description: 'GTR-2024-001235 corrected',
      timeAgo: '30 minutes ago',
      borderClass: 'border-amber-200'
    }
  ];

  activeInboxTab = 'applications';

  private createSnapshot(): BranchData {
    return {
      priorityItems: JSON.parse(JSON.stringify(this.priorityItems)),
      inboxTabs: JSON.parse(JSON.stringify(this.inboxTabs)),
      applications: JSON.parse(JSON.stringify(this.applications)),
      issuanceRows: JSON.parse(JSON.stringify(this.issuanceRows)),
      amendmentRows: JSON.parse(JSON.stringify(this.amendmentRows)),
      claimRows: JSON.parse(JSON.stringify(this.claimRows)),
      performanceMetrics: JSON.parse(JSON.stringify(this.performanceMetrics)),
      stockMetrics: JSON.parse(JSON.stringify(this.stockMetrics)),
      correctionQueue: JSON.parse(JSON.stringify(this.correctionQueue)),
      recentActivity: JSON.parse(JSON.stringify(this.recentActivity)),
      notifications: JSON.parse(JSON.stringify(this.notifications))
    };
  }

  setActiveInboxTab(tabId: string): void {
    this.activeInboxTab = tabId;
  }

  reviewApplication(row: ApplicationRow): void {
    this.router.navigate(['/trade', 'guarantee-application-review']);
  }

  openGuaranteeIssuance(row: IssuanceRow): void {
    this.router.navigate(['/trade', 'guarantee-issuance']);
  }

  openAmendmentProcessing(row: AmendmentRow): void {
    this.router.navigate(['/trade', 'guarantee-amendment-processing']);
  }

  openClaimHandling(row: ClaimRow): void {
    this.router.navigate(['/trade', 'guarantee-claim-handling']);
  }

  filterTableByPriority(priorityId: string): void {
    if (priorityId === 'amendments') {
      this.activeInboxTab = 'amendments';
      return;
    }
    if (priorityId === 'claims') {
      this.activeInboxTab = 'claims';
      return;
    }
    if (priorityId === 'issuance') {
      this.activeInboxTab = 'issuance';
      return;
    }
    this.activeInboxTab = 'applications';
  }

  onBranchChange(branchId: string): void {
    if (!branchId || branchId === this.selectedBranchId) {
      return;
    }
    if (!this.dhakaMainSnapshot) {
      this.dhakaMainSnapshot = this.createSnapshot();
    }
    this.selectedBranchId = branchId as BranchId;
    if (this.selectedBranchId === 'dhaka-main') {
      if (this.dhakaMainSnapshot) {
        this.applyBranchData(this.dhakaMainSnapshot);
      }
      return;
    }
    if (this.selectedBranchId === 'gazipur-branch') {
      this.applyBranchData(this.gazipurBranchData);
      return;
    }
    if (this.selectedBranchId === 'chattogram-branch') {
      this.applyBranchData(this.chattogramBranchData);
      return;
    }
    if (this.selectedBranchId === 'sylhet-branch') {
      this.applyBranchData(this.sylhetBranchData);
      return;
    }
    if (this.selectedBranchId === 'khulna-branch') {
      this.applyBranchData(this.khulnaBranchData);
      return;
    }
  }

  private applyBranchData(data: BranchData): void {
    this.priorityItems = data.priorityItems;
    this.inboxTabs = data.inboxTabs;
    this.applications = data.applications;
    this.issuanceRows = data.issuanceRows;
    this.amendmentRows = data.amendmentRows;
    this.claimRows = data.claimRows;
    this.performanceMetrics = data.performanceMetrics;
    this.stockMetrics = data.stockMetrics;
    this.correctionQueue = data.correctionQueue;
    this.recentActivity = data.recentActivity;
    this.notifications = data.notifications;
  }
}
