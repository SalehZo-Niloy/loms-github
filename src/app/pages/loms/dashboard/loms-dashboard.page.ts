import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { TradeRequestService } from '../../../services/trade-request.service';
import { ExportBillService } from '../../../services/export-bill.service';
import { ExportProceedService } from '../../../services/export-proceed.service';
import { TradeStatus } from '../../../services/workflow.service';
import { combineLatest, map } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { UiSideModalComponent } from '../../../components/ui/ui-side-modal.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';

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

type FilterGroupKey = 'product' | 'productName' | 'status' | 'stage' | 'assignee' | 'sla';

type DashboardColumnKey =
  | 'appId'
  | 'product'
  | 'status'
  | 'customer'
  | 'date'
  | 'source'
  | 'role'
  | 'amount';

type DashboardViewKey =
  | 'all'
  | 'myQueue'
  | 'unassigned'
  | 'overdue'
  | 'newToday'
  | 'pendingApproval'
  | 'queriesOpen';

interface UnifiedTransactionRow {
  id: string;
  module: ModuleType;
  productCategory: string;
  productName: string;
  transactionType: string;
  statusKey: TradeStatus;
  statusDisplay: string;
  customerLabel: string;
  customerId: string;
  date: string;
  updatedDate: string;
  source: 'Agent' | 'Branch' | 'Campaign' | 'CallCenter' | 'API';
  assigneeRole: string;
  assigneeName: string;
  amount: number;
  currency: string;
  slaDate: string;
  slaBreached: boolean;
  stage: string;
  lastBankAction: string;
  nextStep: string;
  lastUpdated: string;
  link: string;
  history: HistoryEvent[];
  missingDocs: number;
  openQueries: number;
  riskGrade: string;
}

interface FilterOption {
  key: string;
  label: string;
  count: number;
  selected: boolean;
}

interface FilterGroup {
  key: FilterGroupKey;
  label: string;
  type: 'checkbox' | 'radio';
  options: FilterOption[];
}

interface DashboardView {
  key: DashboardViewKey;
  label: string;
}

interface FilterChip {
  type: 'view' | 'facet';
  key: string;
  label: string;
}

@Component({
  selector: 'app-trade-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent,
    RouterLink,
    BaseChartDirective,
    UiSideModalComponent,
    OverlayModule
  ],
  templateUrl: './loms-dashboard.page.html'
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
      id: 'APP_2026_000108',
      module: 'Import',
      productCategory: 'Retail',
      productName: 'Personal Loan',
      transactionType: 'Retail Personal Loan',
      statusKey: TradeStatus.DISCREPANCY_RAISED,
      statusDisplay: 'Query',
      customerLabel: 'Md. Rahim Uddin',
      customerId: 'CIF1008',
      date: '2026-02-02',
      updatedDate: '2026-02-06',
      source: 'Agent',
      assigneeRole: 'Risk Officer',
      assigneeName: 'Me',
      amount: 4895347,
      currency: 'BDT',
      slaDate: '2026-02-11',
      slaBreached: false,
      stage: 'KYC',
      lastBankAction: 'KYC check in progress',
      nextStep: 'Review customer response',
      lastUpdated: '2026-02-06',
      link: '/trade/import/application/APP_2026_000108',
      history: [
        { status: 'Created', date: '2026-02-02', time: '09:05', actor: 'Branch Maker', comment: 'Application started' },
        { status: 'Submitted', date: '2026-02-02', time: '09:30', actor: 'Branch Maker', comment: 'Submitted for review' },
        { status: 'Review Started', date: '2026-02-02', time: '10:10', actor: 'KYC Officer', comment: 'KYC check' },
        { status: 'Under Review', date: '2026-02-02', time: '11:00', actor: 'KYC Officer', comment: 'KYC check in progress' }
      ],
      missingDocs: 0,
      openQueries: 3,
      riskGrade: 'C'
    },
    {
      id: 'APP_2026_000124',
      module: 'Import',
      productCategory: 'Retail',
      productName: 'Home Loan',
      transactionType: 'Retail Home Loan',
      statusKey: TradeStatus.SUBMITTED,
      statusDisplay: 'Submitted',
      customerLabel: 'Ayesha Akter',
      customerId: 'CIF1024',
      date: '2026-01-31',
      updatedDate: '2026-02-04',
      source: 'Branch',
      assigneeRole: 'Risk Officer',
      assigneeName: 'Me',
      amount: 1740986,
      currency: 'BDT',
      slaDate: '2026-02-10',
      slaBreached: false,
      stage: 'Risk',
      lastBankAction: 'File allocated to risk',
      nextStep: 'Complete risk assessment',
      lastUpdated: '2026-02-04',
      link: '/trade/import/application/APP_2026_000124',
      history: [
        { status: 'Created', date: '2026-01-31', time: '10:15', actor: 'Branch Maker' },
        { status: 'Submitted', date: '2026-01-31', time: '10:45', actor: 'Branch Maker', comment: 'Submitted to risk queue' }
      ],
      missingDocs: 0,
      openQueries: 0,
      riskGrade: 'BBB'
    },
    {
      id: 'APP_2026_000109',
      module: 'Import',
      productCategory: 'Retail',
      productName: 'Personal Loan',
      transactionType: 'Retail Personal Loan',
      statusKey: TradeStatus.APPROVED,
      statusDisplay: 'Approved',
      customerLabel: 'Kazi Tanvir Hasan',
      customerId: 'CIF1025',
      date: '2026-01-21',
      updatedDate: '2026-01-26',
      source: 'API',
      assigneeRole: 'Ops',
      assigneeName: 'Me',
      amount: 1007108,
      currency: 'BDT',
      slaDate: '2026-01-30',
      slaBreached: false,
      stage: 'CPV',
      lastBankAction: 'Case approved',
      nextStep: 'Disbursement',
      lastUpdated: '2026-01-26',
      link: '/trade/import/application/APP_2026_000109',
      history: [
        { status: 'Created', date: '2026-01-21', time: '09:20', actor: 'API' },
        { status: 'Approved', date: '2026-01-26', time: '15:30', actor: 'Risk Officer' }
      ],
      missingDocs: 0,
      openQueries: 0,
      riskGrade: 'A'
    },
    {
      id: 'APP_2026_000110',
      module: 'Import',
      productCategory: 'Retail',
      productName: 'Home Loan',
      transactionType: 'Retail Home Loan',
      statusKey: TradeStatus.DISCREPANCY_RAISED,
      statusDisplay: 'Query',
      customerLabel: 'Nazmul Islam',
      customerId: 'CIF1010',
      date: '2026-01-14',
      updatedDate: '2026-01-18',
      source: 'Agent',
      assigneeRole: 'Ops',
      assigneeName: 'Me',
      amount: 1709117,
      currency: 'BDT',
      slaDate: '2026-01-17',
      slaBreached: true,
      stage: 'Risk',
      lastBankAction: 'Query pending with customer',
      nextStep: 'Follow up with customer',
      lastUpdated: '2026-01-18',
      link: '/trade/import/application/APP_2026_000110',
      history: [
        { status: 'Created', date: '2026-01-14', time: '11:10', actor: 'Branch Maker' },
        { status: 'Submitted', date: '2026-01-14', time: '11:40', actor: 'Branch Maker' },
        { status: 'Query Raised', date: '2026-01-17', time: '16:05', actor: 'Risk Officer' }
      ],
      missingDocs: 1,
      openQueries: 2,
      riskGrade: 'BB'
    },
    {
      id: 'APP_2026_000117',
      module: 'Import',
      productCategory: 'CreditCard',
      productName: 'Classic Card',
      transactionType: 'Credit Card Classic',
      statusKey: TradeStatus.REJECTED,
      statusDisplay: 'Rejected',
      customerLabel: 'Farhana Rahman',
      customerId: 'CIF1017',
      date: '2026-01-21',
      updatedDate: '2026-01-23',
      source: 'Campaign',
      assigneeRole: 'Credit Approver',
      assigneeName: 'Me',
      amount: 498391,
      currency: 'BDT',
      slaDate: '2026-01-28',
      slaBreached: true,
      stage: 'Risk',
      lastBankAction: 'Application rejected',
      nextStep: 'Inform customer',
      lastUpdated: '2026-01-23',
      link: '/trade/import/application/APP_2026_000117',
      history: [
        { status: 'Created', date: '2026-01-21', time: '10:00', actor: 'Campaign' },
        { status: 'Rejected', date: '2026-01-23', time: '12:30', actor: 'Credit Approver' }
      ],
      missingDocs: 0,
      openQueries: 0,
      riskGrade: 'C'
    },
    {
      id: 'APP_2026_000105',
      module: 'Import',
      productCategory: 'CreditCard',
      productName: 'Classic Card',
      transactionType: 'Credit Card Classic',
      statusKey: TradeStatus.PENDING_APPROVAL,
      statusDisplay: 'Pending Approval',
      customerLabel: 'Shahriar Hossain',
      customerId: 'CIF1005',
      date: '2026-01-15',
      updatedDate: '2026-01-18',
      source: 'CallCenter',
      assigneeRole: 'KYC Officer',
      assigneeName: 'Unassigned',
      amount: 436921,
      currency: 'BDT',
      slaDate: '2026-01-19',
      slaBreached: true,
      stage: 'KYC',
      lastBankAction: 'Awaiting allocation',
      nextStep: 'Assign to KYC Officer',
      lastUpdated: '2026-01-18',
      link: '/trade/import/application/APP_2026_000105',
      history: [
        { status: 'Created', date: '2026-01-15', time: '09:40', actor: 'CallCenter' },
        { status: 'Pending Approval', date: '2026-01-18', time: '13:20', actor: 'System', comment: 'Waiting for allocation' }
      ],
      missingDocs: 0,
      openQueries: 1,
      riskGrade: 'BB'
    }
  ];

  filteredUnifiedRows: UnifiedTransactionRow[] = [...this.unifiedRows];

  searchTerm = '';

  views: DashboardView[] = [
    { key: 'all', label: 'All' },
    { key: 'myQueue', label: 'My Queue' },
    { key: 'unassigned', label: 'Unassigned' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'newToday', label: 'New Today' },
    { key: 'pendingApproval', label: 'Pending Approval' },
    { key: 'queriesOpen', label: 'Queries Open' }
  ];

  selectedView: DashboardViewKey = 'overdue';

  filterGroups: FilterGroup[] = [];
  activeChips: FilterChip[] = [];

  selectedRow: UnifiedTransactionRow | null = null;
  activeDetailTab: 'summary' | 'timeline' | 'flags' = 'summary';

  slaBarChartType: 'bar' = 'bar';
  slaBarChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  slaBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  stageLineChartType: 'line' = 'line';
  stageLineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  stageLineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  // ✅ NEW: overlay positions used by cdkConnectedOverlay in HTML
  overlayPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }
  ];

  get selectedViewLabel(): string {
    const view = this.views.find(v => v.key === this.selectedView);
    return view ? view.label : '';
  }

  get slaFilterOptions(): FilterOption[] {
    const group = this.filterGroups.find(g => g.key === 'sla');
    return group ? group.options : [];
  }

  get productFilterOptions(): FilterOption[] {
    const group = this.filterGroups.find(g => g.key === 'product');
    return group ? group.options : [];
  }

  get productNameFilterOptions(): FilterOption[] {
    const group = this.filterGroups.find(g => g.key === 'productName');
    return group ? group.options : [];
  }

  get statusFilterOptions(): FilterOption[] {
    const group = this.filterGroups.find(g => g.key === 'status');
    return group ? group.options : [];
  }

  columnConfigs: { key: DashboardColumnKey; label: string }[] = [
    { key: 'appId', label: 'App ID' },
    { key: 'product', label: 'Product' },
    { key: 'status', label: 'Status' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'source', label: 'Source' },
    { key: 'role', label: 'Role' },
    { key: 'amount', label: 'Amount' }
  ];

  private columnTemplatePieces: Record<DashboardColumnKey, string> = {
    appId: 'minmax(0,1.3fr)',
    product: 'minmax(0,1.2fr)',
    status: 'minmax(0,1fr)',
    customer: 'minmax(0,1fr)',
    date: 'minmax(0,1.2fr)',
    source: 'minmax(0,1.1fr)',
    role: 'minmax(0,1fr)',
    amount: 'minmax(0,0.9fr)'
  };

  visibleColumns: Record<DashboardColumnKey, boolean> = {
    appId: true,
    product: true,
    status: true,
    customer: true,
    date: true,
    source: true,
    role: true,
    amount: true
  };

  sidebarFilterVisibility: Record<FilterGroupKey, boolean> = {
    product: true,
    productName: true,
    status: true,
    stage: true,
    assignee: true,
    sla: true
  };

  showOptionsPanel = false;
  openViewDropdown = false;
  openAssigneeDropdown = false;

  // ✅ CHANGED: keep as DashboardColumnKey|null (works with overlay)
  openHeaderDropdownKey: DashboardColumnKey | null = null;

  currentSortKey: DashboardColumnKey | null = null;
  currentSortDirection: 'asc' | 'desc' | null = null;

  get tableGridTemplate(): string {
    const order: DashboardColumnKey[] = [
      'appId',
      'product',
      'status',
      'customer',
      'date',
      'source',
      'role',
      'amount'
    ];
    const parts = order
      .filter(key => this.visibleColumns[key])
      .map(key => this.columnTemplatePieces[key]);

    return parts.join(' ');
  }

  get assigneeFilterOptions(): FilterOption[] {
    const group = this.filterGroups.find(g => g.key === 'assignee');
    return group ? group.options : [];
  }

  get assigneeSelectedLabel(): string {
    const key = this.assigneeSelectedKey;
    const group = this.filterGroups.find(g => g.key === 'assignee');
    const option = group?.options.find(o => o.key === key);
    return option ? option.label : 'All';
  }

  constructor(
    private requestService: TradeRequestService,
    private billService: ExportBillService,
    private proceedService: ExportProceedService
  ) {}

  ngOnInit() {
    combineLatest([
      this.requestService.requests$,
      this.billService.bills$,
      this.proceedService.proceeds$
    ])
      .pipe(
        map(([requests, bills, proceeds]) => {
          const allTransactions: TransactionSummary[] = [];

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

          return allTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        })
      )
      .subscribe(transactions => {
        this.recentTransactions = transactions;
        this.calculateStats(transactions);
      });

    this.initializeFilterGroups();
    this.applyFilters();
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

  onSearchChange(): void {
    this.applyFilters();
  }

  get assigneeSelectedKey(): string {
    const group = this.filterGroups.find(g => g.key === 'assignee');
    if (!group) return 'all';
    const selected = group.options.find(o => o.selected);
    return selected ? selected.key : 'all';
  }

  onAssigneeQuickFilterChange(key: string): void {
    this.toggleFilterOption('assignee', key);
  }

  toggleViewDropdown(): void {
    this.openViewDropdown = !this.openViewDropdown;
    if (this.openViewDropdown) {
      this.openAssigneeDropdown = false;
      this.showOptionsPanel = false;
      this.closeHeaderDropdown();
    }
  }

  toggleAssigneeDropdown(): void {
    this.openAssigneeDropdown = !this.openAssigneeDropdown;
    if (this.openAssigneeDropdown) {
      this.showOptionsPanel = false;
      this.closeHeaderDropdown();
    }
  }

  // ✅ UPDATED: don't auto-close overlays on ANY document click
  // Instead, CDK overlay backdrop handles outside click for header dropdowns.
  // We still close the top bar popovers safely.
  @HostListener('document:click')
  onDocumentClick(): void {
    this.showOptionsPanel = false;
    this.openAssigneeDropdown = false;
    this.openViewDropdown = false;
    // ❌ DON'T force-close header dropdown here (CDK handles it)
    // this.openHeaderDropdownKey = null;
  }

  // Optional: ESC closes header dropdown
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeHeaderDropdown();
    this.showOptionsPanel = false;
    this.openAssigneeDropdown = false;
    this.openViewDropdown = false;
  }

  isColumnVisible(key: DashboardColumnKey): boolean {
    return this.visibleColumns[key];
  }

  toggleColumnVisibility(key: DashboardColumnKey): void {
    this.visibleColumns[key] = !this.visibleColumns[key];
  }

  isSidebarFilterVisible(key: FilterGroupKey): boolean {
    return this.sidebarFilterVisibility[key];
  }

  toggleSidebarFilterVisibility(key: FilterGroupKey): void {
    this.sidebarFilterVisibility[key] = !this.sidebarFilterVisibility[key];
  }

  // ✅ Used by CDK overlay header menus
  toggleHeaderDropdown(key: DashboardColumnKey): void {
    this.openHeaderDropdownKey = this.openHeaderDropdownKey === key ? null : key;

    // close other popovers so they don't overlap
    if (this.openHeaderDropdownKey) {
      this.showOptionsPanel = false;
      this.openAssigneeDropdown = false;
      this.openViewDropdown = false;
    }
  }

  // ✅ Used by (backdropClick) and (detach)
  closeHeaderDropdown(): void {
    this.openHeaderDropdownKey = null;
  }

  onViewChange(viewKey: DashboardViewKey): void {
    this.selectedView = viewKey;
    this.openViewDropdown = false;
    this.applyFilters();
  }

  toggleFilterOption(groupKey: FilterGroupKey, optionKey: string): void {
    const group = this.filterGroups.find(g => g.key === groupKey);
    if (!group) return;

    if (group.type === 'checkbox') {
      const option = group.options.find(o => o.key === optionKey);
      if (!option) return;
      option.selected = !option.selected;
    } else {
      group.options.forEach(option => {
        option.selected = option.key === optionKey;
      });
    }

    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedView = 'all';
    this.searchTerm = '';

    this.filterGroups.forEach(group => {
      group.options.forEach(option => {
        if (group.type === 'radio') option.selected = option.key === 'all';
        else option.selected = false;
      });
    });

    this.currentSortKey = null;
    this.currentSortDirection = null;
    this.closeHeaderDropdown();
    this.openViewDropdown = false;
    this.openAssigneeDropdown = false;
    this.showOptionsPanel = false;

    this.applyFilters();
  }

  openDetails(row: UnifiedTransactionRow): void {
    this.selectedRow = row;
    this.activeDetailTab = 'summary';
  }

  closeDetails(): void {
    this.selectedRow = null;
  }

  setActiveDetailTab(tab: 'summary' | 'timeline' | 'flags'): void {
    this.activeDetailTab = tab;
  }

  applyFilters(): void {
    let rows = [...this.unifiedRows];

    const productGroup = this.filterGroups.find(g => g.key === 'product');
    const selectedProducts = productGroup?.options.filter(o => o.selected).map(o => o.label) ?? [];
    if (selectedProducts.length) rows = rows.filter(r => selectedProducts.includes(r.productCategory));

    const productNameGroup = this.filterGroups.find(g => g.key === 'productName');
    const selectedProductNames = productNameGroup?.options.filter(o => o.selected).map(o => o.label) ?? [];
    if (selectedProductNames.length) rows = rows.filter(r => selectedProductNames.includes(r.productName));

    const statusGroup = this.filterGroups.find(g => g.key === 'status');
    const selectedStatuses = statusGroup?.options.filter(o => o.selected).map(o => o.label) ?? [];
    if (selectedStatuses.length) rows = rows.filter(r => selectedStatuses.includes(r.statusDisplay));

    const stageGroup = this.filterGroups.find(g => g.key === 'stage');
    const selectedStages = stageGroup?.options.filter(o => o.selected).map(o => o.label) ?? [];
    if (selectedStages.length) rows = rows.filter(r => selectedStages.includes(r.stage));

    const assigneeGroup = this.filterGroups.find(g => g.key === 'assignee');
    const selectedAssignee = assigneeGroup?.options.find(o => o.selected);
    if (selectedAssignee && selectedAssignee.key !== 'all') {
      if (selectedAssignee.key === 'me') rows = rows.filter(r => r.assigneeName === 'Me');
      else if (selectedAssignee.key === 'unassigned') rows = rows.filter(r => r.assigneeName === 'Unassigned');
    }

    const slaGroup = this.filterGroups.find(g => g.key === 'sla');
    const selectedSla = slaGroup?.options.filter(o => o.selected).map(o => o.label) ?? [];
    if (selectedSla.length) {
      rows = rows.filter(r => {
        const bucket = r.slaBreached ? 'Overdue' : 'Due Today';
        return selectedSla.includes(bucket);
      });
    }

    rows = this.applyViewFilters(rows);

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      rows = rows.filter(row => {
        const combined =
          `${row.id} ${row.productCategory} ${row.productName} ${row.statusDisplay} ${row.customerLabel} ${row.customerId} ${row.source} ${row.assigneeRole} ${row.assigneeName}`
            .toLowerCase();
        return combined.includes(term);
      });
    }

    this.filteredUnifiedRows = this.applySort(rows);
    this.rebuildActiveChips();
  }

  onHeaderSortOptionClick(key: DashboardColumnKey, mode: 'asc' | 'desc' | 'default'): void {
    if (mode === 'default') {
      this.currentSortKey = null;
      this.currentSortDirection = null;
    } else {
      this.currentSortKey = key;
      this.currentSortDirection = mode;
    }

    // ✅ close dropdown after choosing
    this.closeHeaderDropdown();
    this.applyFilters();
  }

  getSortDirectionFor(key: DashboardColumnKey): 'asc' | 'desc' | null {
    if (this.currentSortKey !== key) return null;
    return this.currentSortDirection;
  }

  private applySort(rows: UnifiedTransactionRow[]): UnifiedTransactionRow[] {
    if (!this.currentSortKey || !this.currentSortDirection) return rows;

    const direction = this.currentSortDirection === 'asc' ? 1 : -1;
    const key = this.currentSortKey;

    return [...rows].sort((a, b) => {
      let aVal: string | number | null = null;
      let bVal: string | number | null = null;

      switch (key) {
        case 'appId':
          aVal = a.id;
          bVal = b.id;
          break;
        case 'product':
          aVal = `${a.productCategory} ${a.productName}`;
          bVal = `${b.productCategory} ${b.productName}`;
          break;
        case 'status':
          aVal = a.statusDisplay;
          bVal = b.statusDisplay;
          break;
        case 'customer':
          aVal = a.customerLabel;
          bVal = b.customerLabel;
          break;
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'source':
          aVal = a.source;
          bVal = b.source;
          break;
        case 'role':
          aVal = a.assigneeRole;
          bVal = b.assigneeRole;
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
      }

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return -1 * direction;
      if (bVal === null) return 1 * direction;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return -1 * direction;
      if (aStr > bStr) return 1 * direction;
      return 0;
    });
  }

  applyViewFilters(rows: UnifiedTransactionRow[]): UnifiedTransactionRow[] {
    switch (this.selectedView) {
      case 'myQueue':
        return rows.filter(r => r.assigneeName === 'Me');
      case 'unassigned':
        return rows.filter(r => r.assigneeName === 'Unassigned');
      case 'overdue':
        return rows.filter(r => r.slaBreached);
      case 'newToday':
        return rows.filter(r => this.isToday(r.updatedDate));
      case 'pendingApproval':
        return rows.filter(r => r.statusDisplay === 'Pending Approval');
      case 'queriesOpen':
        return rows.filter(r => r.openQueries > 0);
      default:
        return rows;
    }
  }

  isToday(dateString: string): boolean {
    const today = new Date();
    const d = new Date(dateString);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }

  initializeFilterGroups(): void {
    const productCounts = this.buildCountMap(this.unifiedRows.map(r => r.productCategory));
    const productNameCounts = this.buildCountMap(this.unifiedRows.map(r => r.productName));
    const statusCounts = this.buildCountMap(this.unifiedRows.map(r => r.statusDisplay));
    const stageCounts = this.buildCountMap(this.unifiedRows.map(r => r.stage));
    const slaCounts = this.buildCountMap(this.unifiedRows.map(r => (r.slaBreached ? 'Overdue' : 'Due Today')));

    const assigneeOptions: FilterOption[] = [
      { key: 'all', label: 'All', count: this.unifiedRows.length, selected: true },
      { key: 'me', label: 'Assigned to Me', count: this.unifiedRows.filter(r => r.assigneeName === 'Me').length, selected: false },
      { key: 'unassigned', label: 'Unassigned', count: this.unifiedRows.filter(r => r.assigneeName === 'Unassigned').length, selected: false }
    ];

    this.filterGroups = [
      { key: 'product', label: 'PRODUCT', type: 'checkbox', options: this.mapCountMapToOptions(productCounts) },
      { key: 'productName', label: 'PRODUCT NAME', type: 'checkbox', options: this.mapCountMapToOptions(productNameCounts) },
      { key: 'status', label: 'STATUS', type: 'checkbox', options: this.mapCountMapToOptions(statusCounts) },
      { key: 'stage', label: 'STAGE', type: 'checkbox', options: this.mapCountMapToOptions(stageCounts) },
      { key: 'assignee', label: 'ASSIGNEE', type: 'radio', options: assigneeOptions },
      { key: 'sla', label: 'SLA', type: 'checkbox', options: this.mapCountMapToOptions(slaCounts) }
    ];

    this.updateChartsFromCounts(stageCounts, slaCounts);
  }

  private updateChartsFromCounts(stageCounts: Record<string, number>, slaCounts: Record<string, number>): void {
    const slaLabels = Object.keys(slaCounts);
    const slaData = Object.values(slaCounts);

    this.slaBarChartData = {
      labels: slaLabels,
      datasets: [
        {
          data: slaData,
          backgroundColor: slaLabels.map(label => (label === 'Overdue' ? '#1d4ed8' : '#60a5fa')),
          hoverBackgroundColor: slaLabels.map(label => (label === 'Overdue' ? '#1e40af' : '#3b82f6')),
          borderRadius: 4,
          borderWidth: 0
        }
      ]
    };

    const stageLabels = Object.keys(stageCounts);
    const stageData = Object.values(stageCounts);

    this.stageLineChartData = {
      labels: stageLabels,
      datasets: [
        {
          data: stageData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.10)',
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#1d4ed8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5
        }
      ]
    };
  }

  buildCountMap(values: string[]): Record<string, number> {
    return values.reduce<Record<string, number>>((acc, value) => {
      if (!acc[value]) acc[value] = 0;
      acc[value] += 1;
      return acc;
    }, {});
  }

  mapCountMapToOptions(map: Record<string, number>): FilterOption[] {
    return Object.entries(map).map(([label, count]) => ({
      key: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      count,
      selected: false
    }));
  }

  rebuildActiveChips(): void {
    const chips: FilterChip[] = [];

    const view = this.views.find(v => v.key === this.selectedView);
    if (view && this.selectedView !== 'all') {
      chips.push({ type: 'view', key: this.selectedView, label: view.label });
    }

    this.filterGroups.forEach(group => {
      group.options.forEach(option => {
        const isAssigneeAll = group.key === 'assignee' && option.key === 'all';
        if (option.selected && !isAssigneeAll) {
          chips.push({ type: 'facet', key: `${group.key}:${option.key}`, label: option.label });
        }
      });
    });

    this.activeChips = chips;
  }

  removeChip(chip: FilterChip): void {
    if (chip.type === 'view') {
      this.selectedView = 'all';
    } else {
      const [groupKey, optionKey] = chip.key.split(':') as [FilterGroupKey, string];
      const group = this.filterGroups.find(g => g.key === groupKey);
      if (!group) return;
      const option = group.options.find(o => o.key === optionKey);
      if (!option) return;

      option.selected = false;

      if (group.key === 'assignee' && !group.options.some(o => o.selected)) {
        const allOption = group.options.find(o => o.key === 'all');
        if (allOption) allOption.selected = true;
      }
    }

    this.applyFilters();
  }
}
