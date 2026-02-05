import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../components/ui/ui-table.component';
import { tradeTheme } from '../../../../styles/theme';

interface SummaryCard {
  id: string;
  label: string;
  description: string;
  count: number;
  icon: string;
}

interface PendingApprovalRow {
  applicationId: string;
  customerName: string;
  cif: string;
  guaranteeType: string;
  amount: string;
  amountCurrency: string;
  expiryDate: string;
  escalatedBy: string;
  escalatedRole: string;
  escalationDate: string;
  escalationTime: string;
  status: string;
}

interface ApprovalActivityItem {
  id: string;
  title: string;
  guaranteeType: string;
  amount: string;
  status: 'approved' | 'rejected';
  officer: string;
  reason?: string;
  dateTime: string;
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
  summaryCards: SummaryCard[];
  pendingApprovalRows: PendingApprovalRow[];
  approvalActivity: ApprovalActivityItem[];
}

@Component({
  selector: 'app-guarantee-officer-checker-dashboard-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiTableComponent],
  templateUrl: './guarantee-officer-checker-dashboard.page.html'
})
export class GuaranteeOfficerCheckerDashboardPageComponent {
  theme = tradeTheme;

  branchOptions: BranchOption[] = [
    { id: 'dhaka-main', label: 'Dhaka Main Branch' },
    { id: 'gazipur-branch', label: 'Gazipur Branch (Outer Dhaka)' },
    { id: 'chattogram-branch', label: 'Chattogram Branch' },
    { id: 'sylhet-branch', label: 'Sylhet Branch' },
    { id: 'khulna-branch', label: 'Khulna Branch' }
  ];

  selectedBranchId: BranchId = 'dhaka-main';

  private dhakaMainSnapshot: BranchData | null = null;

  private gazipurBranchData: BranchData = {
    summaryCards: [
      {
        id: 'pending',
        label: 'Pending Approval',
        description: 'Requires immediate action',
        count: 4,
        icon: '⏱'
      },
      {
        id: 'approved',
        label: 'Approved Today',
        description: 'Successfully authorized',
        count: 6,
        icon: '✔'
      },
      {
        id: 'rejected',
        label: 'Rejected Today',
        description: 'Returned with remarks',
        count: 1,
        icon: '✖'
      },
      {
        id: 'returned',
        label: 'Returned to Officer',
        description: 'Awaiting correction',
        count: 2,
        icon: '↩️'
      }
    ],
    pendingApprovalRows: [
      {
        applicationId: 'GTR-2024-010101',
        customerName: 'Gazipur Textiles Ltd',
        cif: '900100200',
        guaranteeType: 'Performance Guarantee',
        amount: '300,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Dec 15, 2024',
        escalatedBy: 'Rashid Karim',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '10:10',
        status: 'Pending Approval'
      },
      {
        applicationId: 'GTR-2024-010102',
        customerName: 'Narayanganj Steel Works',
        cif: '900100201',
        guaranteeType: 'Bid Bond',
        amount: '220,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Nov 20, 2024',
        escalatedBy: 'Rashid Karim',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '09:40',
        status: 'Pending Approval'
      }
    ],
    approvalActivity: [
      {
        id: 'GTR-2024-010090',
        title: 'GTR-2024-010090 Approved',
        guaranteeType: 'Performance Guarantee',
        amount: 'USD 250,000.00',
        status: 'approved',
        officer: 'Rashid Karim',
        dateTime: 'Jan 11, 2024 09:05'
      },
      {
        id: 'GTR-2024-010085',
        title: 'GTR-2024-010085 Approved',
        guaranteeType: 'Bid Bond',
        amount: 'USD 180,000.00',
        status: 'approved',
        officer: 'Nusrat Jahan',
        dateTime: 'Jan 10, 2024 16:40'
      }
    ]
  };

  private chattogramBranchData: BranchData = {
    summaryCards: [
      {
        id: 'pending',
        label: 'Pending Approval',
        description: 'Requires immediate action',
        count: 5,
        icon: '⏱'
      },
      {
        id: 'approved',
        label: 'Approved Today',
        description: 'Successfully authorized',
        count: 9,
        icon: '✔'
      },
      {
        id: 'rejected',
        label: 'Rejected Today',
        description: 'Returned with remarks',
        count: 1,
        icon: '✖'
      },
      {
        id: 'returned',
        label: 'Returned to Officer',
        description: 'Awaiting correction',
        count: 2,
        icon: '↩️'
      }
    ],
    pendingApprovalRows: [
      {
        applicationId: 'GTR-2024-020101',
        customerName: 'Chattogram Port Services Ltd',
        cif: '800200300',
        guaranteeType: 'Performance Guarantee',
        amount: '420,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Dec 10, 2024',
        escalatedBy: 'Mahmud Rahman',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '11:20',
        status: 'Pending Approval'
      },
      {
        applicationId: 'GTR-2024-020102',
        customerName: 'Agrabad Trading House',
        cif: '800200301',
        guaranteeType: 'Financial Guarantee',
        amount: '360,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Oct 05, 2024',
        escalatedBy: 'Mahmud Rahman',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '10:05',
        status: 'Pending Approval'
      }
    ],
    approvalActivity: [
      {
        id: 'GTR-2024-020090',
        title: 'GTR-2024-020090 Approved',
        guaranteeType: 'Advance Payment Guarantee',
        amount: 'USD 300,000.00',
        status: 'approved',
        officer: 'Mahmud Rahman',
        dateTime: 'Jan 11, 2024 09:35'
      },
      {
        id: 'GTR-2024-020085',
        title: 'GTR-2024-020085 Rejected',
        guaranteeType: 'Financial Guarantee',
        amount: 'USD 950,000.00',
        status: 'rejected',
        officer: 'Mahmud Rahman',
        reason: 'Insufficient collateral',
        dateTime: 'Jan 10, 2024 17:05'
      }
    ]
  };

  private sylhetBranchData: BranchData = {
    summaryCards: [
      {
        id: 'pending',
        label: 'Pending Approval',
        description: 'Requires immediate action',
        count: 3,
        icon: '⏱'
      },
      {
        id: 'approved',
        label: 'Approved Today',
        description: 'Successfully authorized',
        count: 4,
        icon: '✔'
      },
      {
        id: 'rejected',
        label: 'Rejected Today',
        description: 'Returned with remarks',
        count: 1,
        icon: '✖'
      },
      {
        id: 'returned',
        label: 'Returned to Officer',
        description: 'Awaiting correction',
        count: 1,
        icon: '↩️'
      }
    ],
    pendingApprovalRows: [
      {
        applicationId: 'GTR-2024-030101',
        customerName: 'Sylhet Tea Exports',
        cif: '700300400',
        guaranteeType: 'Performance Guarantee',
        amount: '260,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Nov 25, 2024',
        escalatedBy: 'Farzana Ali',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '10:50',
        status: 'Pending Approval'
      }
    ],
    approvalActivity: [
      {
        id: 'GTR-2024-030090',
        title: 'GTR-2024-030090 Approved',
        guaranteeType: 'Financial Guarantee',
        amount: 'USD 210,000.00',
        status: 'approved',
        officer: 'Farzana Ali',
        dateTime: 'Jan 11, 2024 09:10'
      }
    ]
  };

  private khulnaBranchData: BranchData = {
    summaryCards: [
      {
        id: 'pending',
        label: 'Pending Approval',
        description: 'Requires immediate action',
        count: 4,
        icon: '⏱'
      },
      {
        id: 'approved',
        label: 'Approved Today',
        description: 'Successfully authorized',
        count: 5,
        icon: '✔'
      },
      {
        id: 'rejected',
        label: 'Rejected Today',
        description: 'Returned with remarks',
        count: 1,
        icon: '✖'
      },
      {
        id: 'returned',
        label: 'Returned to Officer',
        description: 'Awaiting correction',
        count: 2,
        icon: '↩️'
      }
    ],
    pendingApprovalRows: [
      {
        applicationId: 'GTR-2024-040101',
        customerName: 'Khulna Jute Mills',
        cif: '600400500',
        guaranteeType: 'Performance Guarantee',
        amount: '310,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Dec 05, 2024',
        escalatedBy: 'Imran Hossain',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '11:05',
        status: 'Pending Approval'
      },
      {
        applicationId: 'GTR-2024-040102',
        customerName: 'Mongla Port Traders',
        cif: '600400501',
        guaranteeType: 'Bid Bond',
        amount: '190,000.00',
        amountCurrency: 'USD',
        expiryDate: 'Oct 22, 2024',
        escalatedBy: 'Imran Hossain',
        escalatedRole: 'Guarantee Officer',
        escalationDate: 'Jan 11, 2024',
        escalationTime: '10:30',
        status: 'Pending Approval'
      }
    ],
    approvalActivity: [
      {
        id: 'GTR-2024-040090',
        title: 'GTR-2024-040090 Approved',
        guaranteeType: 'Performance Guarantee',
        amount: 'USD 330,000.00',
        status: 'approved',
        officer: 'Imran Hossain',
        dateTime: 'Jan 11, 2024 09:25'
      }
    ]
  };

  summaryCards: SummaryCard[] = [
    {
      id: 'pending',
      label: 'Pending Approval',
      description: 'Requires immediate action',
      count: 8,
      icon: '⏱'
    },
    {
      id: 'approved',
      label: 'Approved Today',
      description: 'Successfully authorized',
      count: 12,
      icon: '✔'
    },
    {
      id: 'rejected',
      label: 'Rejected Today',
      description: 'Returned with remarks',
      count: 2,
      icon: '✖'
    },
    {
      id: 'returned',
      label: 'Returned to Officer',
      description: 'Awaiting correction',
      count: 3,
      icon: '↩️'
    }
  ];

  pendingApprovalRows: PendingApprovalRow[] = [
    {
      applicationId: 'GTR-2024-001234',
      customerName: 'John Mitchell Trading LLC',
      cif: '1234567890',
      guaranteeType: 'Performance Guarantee',
      amount: '500,000.00',
      amountCurrency: 'USD',
      expiryDate: 'Dec 31, 2024',
      escalatedBy: 'Sarah Ahmed',
      escalatedRole: 'Guarantee Officer',
      escalationDate: 'Jan 11, 2024',
      escalationTime: '14:30',
      status: 'Pending Approval'
    },
    {
      applicationId: 'GTR-2024-001235',
      customerName: 'Al Noor Industries',
      cif: '9876543210',
      guaranteeType: 'Bid Bond',
      amount: '250,000.00',
      amountCurrency: 'USD',
      expiryDate: 'Nov 30, 2024',
      escalatedBy: 'Ahmed Hassan',
      escalatedRole: 'Guarantee Officer',
      escalationDate: 'Jan 11, 2024',
      escalationTime: '13:15',
      status: 'Pending Approval'
    },
    {
      applicationId: 'GTR-2024-001236',
      customerName: 'Emirates Construction Co.',
      cif: '551234567',
      guaranteeType: 'Advance Payment Guarantee',
      amount: '750,000.00',
      amountCurrency: 'USD',
      expiryDate: 'Oct 15, 2024',
      escalatedBy: 'Sarah Ahmed',
      escalatedRole: 'Guarantee Officer',
      escalationDate: 'Jan 11, 2024',
      escalationTime: '11:45',
      status: 'Pending Approval'
    },
    {
      applicationId: 'GTR-2024-001237',
      customerName: 'Global Tech Solutions',
      cif: '777889990',
      guaranteeType: 'Financial Guarantee',
      amount: '1,000,000.00',
      amountCurrency: 'USD',
      expiryDate: 'Sep 30, 2024',
      escalatedBy: 'Ahmed Hassan',
      escalatedRole: 'Guarantee Officer',
      escalationDate: 'Jan 11, 2024',
      escalationTime: '10:20',
      status: 'Pending Approval'
    }
  ];

  approvalActivity: ApprovalActivityItem[] = [
    {
      id: 'GTR-2024-001230',
      title: 'GTR-2024-001230 Approved',
      guaranteeType: 'Performance Guarantee',
      amount: 'USD 300,000.00',
      status: 'approved',
      officer: 'Sarah Ahmed',
      dateTime: 'Jan 11, 2024 09:45'
    },
    {
      id: 'GTR-2024-001228',
      title: 'GTR-2024-001228 Approved',
      guaranteeType: 'Bid Bond',
      amount: 'USD 150,000.00',
      status: 'approved',
      officer: 'Ahmed Hassan',
      dateTime: 'Jan 11, 2024 08:30'
    },
    {
      id: 'GTR-2024-001225',
      title: 'GTR-2024-001225 Rejected',
      guaranteeType: 'Financial Guarantee',
      amount: 'USD 2,000,000.00',
      status: 'rejected',
      officer: 'Sarah Ahmed',
      reason: 'Credit limit concern',
      dateTime: 'Jan 10, 2024 16:15'
    },
    {
      id: 'GTR-2024-001220',
      title: 'GTR-2024-001220 Approved',
      guaranteeType: 'Advance Payment Guarantee',
      amount: 'USD 450,000.00',
      status: 'approved',
      officer: 'Ahmed Hassan',
      dateTime: 'Jan 10, 2024 14:20'
    }
  ];

  constructor(private router: Router) {}

  private createSnapshot(): BranchData {
    return {
      summaryCards: JSON.parse(JSON.stringify(this.summaryCards)),
      pendingApprovalRows: JSON.parse(JSON.stringify(this.pendingApprovalRows)),
      approvalActivity: JSON.parse(JSON.stringify(this.approvalActivity))
    };
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
    this.summaryCards = data.summaryCards;
    this.pendingApprovalRows = data.pendingApprovalRows;
    this.approvalActivity = data.approvalActivity;
  }

  reviewApplication(row: PendingApprovalRow): void {
    this.router.navigate(['/trade', 'guarantee-officer-checker-dashboard', 'application-review']);
  }
}
