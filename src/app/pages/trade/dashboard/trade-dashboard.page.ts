import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../styles/layout/trade-layout.component';
import { TradeRequestService } from '../../../services/trade-request.service';
import { ExportBillService } from '../../../services/export-bill.service';
import { ExportProceedService } from '../../../services/export-proceed.service';
import { TradeStatus } from '../../../services/workflow.service';
import { combineLatest, map } from 'rxjs';

interface HistoryEvent {
  status: string;
  date: string;
  time: string;
  actor: string;
  comment?: string;
}

interface TransactionSummary {
  id: string;
  type: 'REQUEST' | 'EXPORT_BILL' | 'EXPORT_PROCEED';
  customer: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  link: string;
  history: HistoryEvent[];
}

type ModuleType = 'Guarantee' | 'Import' | 'Export';

interface UnifiedTransactionRow {
  id: string;
  module: ModuleType;
  transactionType: string;
  statusKey: TradeStatus;
  statusDisplay: string;
  lastBankAction: string;
  nextStep: string;
  lastUpdated: string;
  link: string;
  history: HistoryEvent[];
}

@Component({
  selector: 'app-trade-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, RouterLink],
  templateUrl: './trade-dashboard.page.html'
})
export class TradeDashboardPageComponent implements OnInit {
  stats = {
    totalTransactions: 0,
    pendingAction: 0,
    completed: 0,
    rejected: 0
  };

  recentTransactions: TransactionSummary[] = [];
  expandedTransactionId: string | null = null;

  unifiedRows: UnifiedTransactionRow[] = [
    {
      id: 'GTR-2024-001234',
      module: 'Guarantee',
      transactionType: 'Performance Guarantee',
      statusKey: TradeStatus.SUBMITTED,
      statusDisplay: 'Submitted',
      lastBankAction: 'Application submitted',
      nextStep: 'Monitor SLA – On Time',
      lastUpdated: '2024-01-11',
      link: '/trade/guarantee-application-review',
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '2024-01-11',
          time: '09:30',
          actor: 'Customer',
          comment: 'Guarantee application submitted'
        },
        {
          status: TradeStatus.RO_VALIDATION,
          date: '2024-01-11',
          time: '10:15',
          actor: 'Relationship Officer',
          comment: 'Validation in progress'
        }
      ]
    },
    {
      id: 'GTR-2024-001235',
      module: 'Guarantee',
      transactionType: 'Bid Bond',
      statusKey: TradeStatus.RETURNED,
      statusDisplay: 'Return',
      lastBankAction: 'Returned for correction',
      nextStep: 'Customer to update documents',
      lastUpdated: '2024-01-10',
      link: '/trade/guarantee-application-review',
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '2024-01-10',
          time: '11:05',
          actor: 'Customer'
        },
        {
          status: TradeStatus.RETURNED,
          date: '2024-01-10',
          time: '15:20',
          actor: 'Relationship Officer',
          comment: 'Missing contract copy'
        }
      ]
    },
    {
      id: 'LC-2024-001',
      module: 'Import',
      transactionType: 'LC Issuance – Sight',
      statusKey: TradeStatus.PENDING_APPROVAL,
      statusDisplay: 'Pending Validation',
      lastBankAction: 'Application received from ABC Trading Ltd',
      nextStep: 'Validate documents',
      lastUpdated: '2024-01-12',
      link: '/trade/import/pending-review',
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '2024-01-12',
          time: '10:00',
          actor: 'ABC Trading Ltd'
        },
        {
          status: TradeStatus.PENDING_APPROVAL,
          date: '2024-01-12',
          time: '10:45',
          actor: 'Trade Officer',
          comment: 'Under review'
        }
      ]
    },
    {
      id: 'LC-2024-002',
      module: 'Import',
      transactionType: 'LC Amendment Request',
      statusKey: TradeStatus.PENDING_APPROVAL,
      statusDisplay: 'Pending Validation',
      lastBankAction: 'Amendment request from XYZ Exports Inc',
      nextStep: 'Review amendment terms',
      lastUpdated: '2024-01-13',
      link: '/trade/import/lc-amendment-request',
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '2024-01-13',
          time: '09:10',
          actor: 'XYZ Exports Inc'
        },
        {
          status: TradeStatus.PENDING_APPROVAL,
          date: '2024-01-13',
          time: '09:40',
          actor: 'Trade Officer'
        }
      ]
    },
    {
      id: 'DC-2025-100001',
      module: 'Export',
      transactionType: 'Export LC Advising',
      statusKey: TradeStatus.TO_TRADE_OFFICER,
      statusDisplay: 'To Trade Officer',
      lastBankAction: 'LC-DXB-9921 created',
      nextStep: 'Trade officer review',
      lastUpdated: '2026-01-19',
      link: '/trade/dc-advising/to/dashboard',
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '2026-01-19',
          time: '11:25',
          actor: 'Global Textiles Ltd'
        },
        {
          status: TradeStatus.TO_TRADE_OFFICER,
          date: '2026-01-19',
          time: '11:45',
          actor: 'System',
          comment: 'Routed to Trade Officer queue'
        }
      ]
    },
    {
      id: 'DC-2025-100002',
      module: 'Export',
      transactionType: 'Export Bill Submission',
      statusKey: TradeStatus.SUBMITTED,
      statusDisplay: 'Submitted',
      lastBankAction: 'Export bill submitted',
      nextStep: 'Verify documents',
      lastUpdated: '2026-01-20',
      link: '/trade/export-bill/to/dashboard',
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '2026-01-20',
          time: '14:10',
          actor: 'Global Textiles Ltd'
        }
      ]
    }
  ];

  filteredUnifiedRows: UnifiedTransactionRow[] = [...this.unifiedRows];

  moduleFilter: 'All' | ModuleType = 'All';
  statusFilter: 'All' | string = 'All';
  searchTerm = '';

  showModuleDropdown = false;
  showStatusDropdown = false;

  moduleOptions: Array<'All' | ModuleType> = ['All', 'Guarantee', 'Import', 'Export'];
  statusOptions: string[] = ['All', 'Submitted', 'Return', 'Pending Validation', 'To Trade Officer'];

  constructor(
    private requestService: TradeRequestService,
    private billService: ExportBillService,
    private proceedService: ExportProceedService
  ) {}

  toggleHistory(id: string) {
    if (this.expandedTransactionId === id) {
      this.expandedTransactionId = null;
    } else {
      this.expandedTransactionId = id;
    }
  }

  ngOnInit() {
    combineLatest([
      this.requestService.requests$,
      this.billService.bills$,
      this.proceedService.proceeds$
    ]).pipe(
      map(([requests, bills, proceeds]) => {
        const allTransactions: TransactionSummary[] = [];

        // Map Requests
        requests.forEach(r => {
          allTransactions.push({
            id: r.id,
            type: 'REQUEST',
            customer: r.applicant.name,
            reference: r.exportLC.lcNo,
            amount: parseFloat(r.exportLC.amount || '0'),
            currency: r.exportLC.currency || 'USD',
            status: r.status,
            date: r.submissionDate || new Date().toISOString(),
            link: `/trade/dc-advising/to/request/${r.id}`,
            history: r.history || []
          });
        });

        // Map Bills
        bills.forEach(b => {
          allTransactions.push({
            id: b.id,
            type: 'EXPORT_BILL',
            customer: b.customerName,
            reference: b.lcNumber,
            amount: b.amount,
            currency: b.currency,
            status: b.status,
            date: b.updatedAt,
            link: `/trade/export-bill/to/request/${b.id}`,
            history: b.history || []
          });
        });

        // Map Proceeds
        proceeds.forEach(p => {
          allTransactions.push({
            id: p.id,
            type: 'EXPORT_PROCEED',
            customer: p.customer,
            reference: p.refBill,
            amount: p.amount,
            currency: p.currency,
            status: p.status,
            date: p.date,
            link: `/trade/export-proceed/to/details/${p.id}`,
            history: p.history || []
          });
        });

        // Sort by date descending
        return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    ).subscribe(transactions => {
      this.recentTransactions = transactions;
      this.calculateStats(transactions);
    });
  }

  calculateStats(transactions: TransactionSummary[]) {
    this.stats.totalTransactions = transactions.length;
    
    this.stats.pendingAction = transactions.filter(t => 
      [
        TradeStatus.SUBMITTED, 
        TradeStatus.RO_VALIDATION, 
        TradeStatus.TO_TRADE_OFFICER, 
        TradeStatus.PENDING_APPROVAL, 
        TradeStatus.DISCREPANCY_RAISED,
        TradeStatus.SWIFT_VALIDATED,
        TradeStatus.VERIFIED
      ].includes(t.status as TradeStatus)
    ).length;

    this.stats.completed = transactions.filter(t => 
      [
        TradeStatus.APPROVED, 
        TradeStatus.REALIZED, 
        TradeStatus.DC_ADVICE_ISSUED, 
        TradeStatus.SENT_TO_IMPORTER
      ].includes(t.status as TradeStatus)
    ).length;

    this.stats.rejected = transactions.filter(t => 
      [
        TradeStatus.REJECTED, 
        TradeStatus.RETURNED,
        TradeStatus.RETURNED_TO_CUSTOMER
      ].includes(t.status as TradeStatus)
    ).length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case TradeStatus.APPROVED:
      case TradeStatus.REALIZED:
      case TradeStatus.DC_ADVICE_ISSUED:
      case TradeStatus.SENT_TO_IMPORTER:
        return 'bg-blue-100 text-blue-800';
      case TradeStatus.SUBMITTED:
      case TradeStatus.RO_VALIDATION:
      case TradeStatus.TO_TRADE_OFFICER:
      case TradeStatus.PENDING_APPROVAL:
      case TradeStatus.SWIFT_VALIDATED:
      case TradeStatus.VERIFIED:
        return 'bg-blue-50 text-blue-800';
      case TradeStatus.RETURNED:
      case TradeStatus.DISCREPANCY_RAISED:
      case TradeStatus.RETURNED_TO_CUSTOMER:
      case TradeStatus.REJECTED:
        return 'bg-blue-200 text-blue-900';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  }

  formatType(type: string): string {
    return type.replace('_', ' ');
  }

  applyFilters(): void {
    let rows = [...this.unifiedRows];

    if (this.moduleFilter !== 'All') {
      rows = rows.filter((r) => r.module === this.moduleFilter);
    }

    if (this.statusFilter !== 'All') {
      rows = rows.filter((r) => r.statusDisplay === this.statusFilter);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      rows = rows.filter((r) => r.id.toLowerCase().includes(term));
    }

    this.filteredUnifiedRows = rows;
  }

  toggleModuleFilter(): void {
    this.showModuleDropdown = !this.showModuleDropdown;
    if (this.showModuleDropdown) {
      this.showStatusDropdown = false;
    }
  }

  toggleStatusFilter(): void {
    this.showStatusDropdown = !this.showStatusDropdown;
    if (this.showStatusDropdown) {
      this.showModuleDropdown = false;
    }
  }

  selectModule(option: 'All' | ModuleType): void {
    this.moduleFilter = option;
    this.showModuleDropdown = false;
    this.applyFilters();
  }

  selectStatus(status: string): void {
    this.statusFilter = status;
    this.showStatusDropdown = false;
    this.applyFilters();
  }
}
