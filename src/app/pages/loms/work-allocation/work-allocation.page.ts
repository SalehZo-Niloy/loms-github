import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type UserRole = 'Maker' | 'Checker';
type ViewKey = 'all' | 'new' | 'pending' | 'highRisk';
type TabKey = 'reassign' | 'override' | 'inbox' | 'history';

interface ViewOption {
  key: ViewKey;
  label: string;
}

interface FilterChip {
  key: 'view' | 'search';
  label: string;
}

interface UserOption {
  id: string;
  label: string;
  role: UserRole;
  workload: number;
}

interface WorkRow {
  id: string;
  customer: string;
  product: string;
  amount: number;
  currency: string;
  statusKey: 'NEW' | 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'HIGH_RISK';
  statusLabel: string;
  branch: string;
  assigneeName: string;
  assigneeRole: string;
  slaHours: number;
  flags: string[];
  source: string;
  stage: string;
}

interface OverrideRequest {
  id: string;
  appId: string;
  customer: string;
  overrideType: string;
  requestedBy: string;
  assignedTo: string;
  reasonCode: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

interface HistoryEntry {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  status: 'Approved' | 'Rejected' | 'Submitted' | 'Assigned';
}

interface SeedData {
  workItems: WorkRow[];
  overrideRequests: OverrideRequest[];
  history: HistoryEntry[];
}

const VIEW_OPTIONS: ViewOption[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'pending', label: 'Pending' },
  { key: 'highRisk', label: 'High Risk' },
];

const USERS: UserOption[] = [
  { id: 'eve', label: 'Md. Farhan Rahman (Underwriter)', role: 'Maker', workload: 6 },
  { id: 'bob', label: 'Farzana Islam (Branch Manager)', role: 'Maker', workload: 4 },
  { id: 'sam', label: 'Sajid Ahmed (Checker)', role: 'Checker', workload: 2 },
  { id: 'ravi', label: 'Nusrat Jahan (Checker)', role: 'Checker', workload: 3 },
];

const REASON_CODES = [
  'Workload Balancing',
  'Skill Match',
  'Policy Override',
  'VIP Handling',
  'Escalation Required',
];

const OVERRIDE_TYPES = [
  'Manual Re-Assignment',
  'Limit Override',
  'SLA Escalation',
  'Priority Escalation',
];

const SEED: SeedData = {
  workItems: [
    {
      id: 'APP-001',
      customer: 'Md. Arafat Hossain',
      product: 'Personal Loan',
      amount: 550000,
      currency: 'BDT',
      statusKey: 'NEW',
      statusLabel: 'NEW',
      branch: 'Downtown',
      assigneeName: 'N/A',
      assigneeRole: 'Unassigned',
      slaHours: 72,
      flags: ['New'],
      source: 'Branch',
      stage: 'Verification',
    },
    {
      id: 'APP-002',
      customer: 'Nusrat Jahan',
      product: 'Mortgage',
      amount: 3200000,
      currency: 'BDT',
      statusKey: 'PENDING',
      statusLabel: 'PENDING',
      branch: 'Uptown',
      assigneeName: 'Eve Employee',
      assigneeRole: 'Underwriter',
      slaHours: 58,
      flags: [],
      source: 'Online',
      stage: 'Assessment',
    },
    {
      id: 'APP-003',
      customer: 'Meghna Group',
      product: 'Business Loan',
      amount: 8500000,
      currency: 'BDT',
      statusKey: 'IN_PROGRESS',
      statusLabel: 'IN PROGRESS',
      branch: 'Downtown',
      assigneeName: 'Bob Banker',
      assigneeRole: 'Branch Manager',
      slaHours: 48,
      flags: ['VIP'],
      source: 'Branch',
      stage: 'Verification',
    },
    {
      id: 'APP-004',
      customer: 'Shamim Ahmed',
      product: 'Auto Loan',
      amount: 1200000,
      currency: 'BDT',
      statusKey: 'NEW',
      statusLabel: 'NEW',
      branch: 'City Center',
      assigneeName: 'N/A',
      assigneeRole: 'Unassigned',
      slaHours: 96,
      flags: [],
      source: 'Digital',
      stage: 'Intake',
    },
    {
      id: 'APP-005',
      customer: 'Farhana Akter',
      product: 'Personal Loan',
      amount: 950000,
      currency: 'BDT',
      statusKey: 'REVIEW',
      statusLabel: 'REVIEW',
      branch: 'Midtown',
      assigneeName: 'Eve Employee',
      assigneeRole: 'Underwriter',
      slaHours: 36,
      flags: ['High Risk'],
      source: 'Branch',
      stage: 'Review',
    },
  ],
  overrideRequests: [
    {
      id: 'OR-1001',
      appId: 'APP-003',
      customer: 'Meghna Group',
      overrideType: 'Manual Re-Assignment',
      requestedBy: 'Eve Employee',
      assignedTo: 'Sam Supervisor',
      reasonCode: 'VIP Handling',
      status: 'Pending',
      submittedAt: '20 minutes ago',
    },
    {
      id: 'OR-1002',
      appId: 'APP-005',
      customer: 'Farhana Akter',
      overrideType: 'SLA Escalation',
      requestedBy: 'Bob Banker',
      assignedTo: 'Ravi Manager',
      reasonCode: 'Escalation Required',
      status: 'Approved',
      submittedAt: '2 hours ago',
    },
  ],
  history: [
    {
      id: 'H-001',
      title: 'Reassigned APP-002',
      detail: 'Moved from Eve Employee to Bob Banker',
      timeAgo: '15 minutes ago',
      status: 'Assigned',
    },
    {
      id: 'H-002',
      title: 'Override approved for APP-005',
      detail: 'SLA escalation approved by Ravi Manager',
      timeAgo: '2 hours ago',
      status: 'Approved',
    },
    {
      id: 'H-003',
      title: 'Override submitted for APP-003',
      detail: 'Manual re-assignment requested by Eve Employee',
      timeAgo: '3 hours ago',
      status: 'Submitted',
    },
  ],
};

@Component({
  selector: 'app-work-allocation-page',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, LomsLayoutComponent],
  templateUrl: './work-allocation.page.html',
})
export class WorkAllocationPageComponent {
  views = VIEW_OPTIONS;
  selectedView: ViewKey = 'all';
  searchTerm = '';
  activeTab: TabKey = 'reassign';
  currentUserId = 'eve';

  users = USERS;
  reasonCodes = REASON_CODES;
  overrideTypes = OVERRIDE_TYPES;

  workItems: WorkRow[] = cloneData(SEED.workItems);
  overrideRequests: OverrideRequest[] = cloneData(SEED.overrideRequests);
  history: HistoryEntry[] = cloneData(SEED.history);

  activeChips: FilterChip[] = [];
  selectedRow: WorkRow | null = this.workItems[2] || null;
  selectedIds: string[] = ['APP-003'];

  reassignUserId = '';
  reassignReason = '';
  reassignRemarks = '';
  effectiveImmediately = true;
  reassignMessage = '';

  overrideType = 'Manual Re-Assignment';
  overrideAssignTo = 'sam';
  overrideReason = 'VIP Handling';
  overrideJustification = '';
  overrideMessage = '';

  checkerDecision = '';

  get filteredRows(): WorkRow[] {
    return this.workItems.filter(row => {
      if (this.selectedView === 'new' && row.statusKey !== 'NEW') {
        return false;
      }
      if (this.selectedView === 'pending' && row.statusKey !== 'PENDING') {
        return false;
      }
      if (this.selectedView === 'highRisk' && !row.flags.includes('High Risk')) {
        return false;
      }
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.trim().toLowerCase();
        return (
          row.id.toLowerCase().includes(term) ||
          row.customer.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }

  get selectedRows(): WorkRow[] {
    return this.workItems.filter(row => this.selectedIds.includes(row.id));
  }

  get currentUser(): UserOption | undefined {
    return this.users.find(user => user.id === this.currentUserId);
  }

  get role(): UserRole {
    return this.currentUser?.role ?? 'Maker';
  }

  get activeOverrideRequest(): OverrideRequest | null {
    if (!this.selectedRow) {
      return null;
    }
    const pending = this.overrideRequests.find(
      request =>
        request.appId === this.selectedRow?.id && request.status === 'Pending'
    );
    if (pending) {
      return pending;
    }
    return (
      this.overrideRequests.find(
        request => request.appId === this.selectedRow?.id
      ) || null
    );
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  onSearchChange(): void {
    this.updateChips();
  }

  onViewChange(view: ViewKey): void {
    this.selectedView = view;
    this.updateChips();
  }

  removeChip(chip: FilterChip): void {
    if (chip.key === 'view') {
      this.selectedView = 'all';
    }
    if (chip.key === 'search') {
      this.searchTerm = '';
    }
    this.updateChips();
  }

  clearAllFilters(): void {
    this.selectedView = 'all';
    this.searchTerm = '';
    this.updateChips();
  }

  toggleSelection(row: WorkRow, checked: boolean): void {
    if (checked) {
      if (!this.selectedIds.includes(row.id)) {
        this.selectedIds = [...this.selectedIds, row.id];
      }
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== row.id);
      if (this.selectedRow && this.selectedRow.id === row.id) {
        this.selectedRow = this.selectedRows[0] || null;
      }
    }
  }

  openDetails(row: WorkRow): void {
    this.selectedRow = row;
  }

  suggestBestUser(): void {
    const makers = this.users.filter(user => user.role === 'Maker');
    const best = makers.sort((a, b) => a.workload - b.workload)[0];
    if (best) {
      this.reassignUserId = best.id;
    }
  }

  submitReassign(): void {
    if (!this.selectedRows.length || !this.reassignUserId) {
      this.reassignMessage = 'Select applications and a target user to continue.';
      return;
    }
    const target = this.users.find(user => user.id === this.reassignUserId);
    const targetName = target ? target.label : 'Selected user';
    this.reassignMessage = `Submitted for approval to reassign ${this.selectedRows.length} application(s) to ${targetName}.`;
    this.history = [
      {
        id: `H-${Date.now()}`,
        title: `Reassignment submitted`,
        detail: `Submitted ${this.selectedRows.length} application(s) to ${targetName}`,
        timeAgo: 'Just now',
        status: 'Submitted',
      },
      ...this.history,
    ];
  }

  submitOverride(): void {
    if (!this.selectedRow) {
      this.overrideMessage = 'Select an application to submit an override.';
      return;
    }
    const checker = this.users.find(user => user.id === this.overrideAssignTo);
    const request: OverrideRequest = {
      id: `OR-${Math.floor(Math.random() * 9000 + 1000)}`,
      appId: this.selectedRow.id,
      customer: this.selectedRow.customer,
      overrideType: this.overrideType,
      requestedBy: this.currentUser?.label || 'Maker',
      assignedTo: checker ? checker.label : 'Checker',
      reasonCode: this.overrideReason,
      status: 'Pending',
      submittedAt: 'Just now',
    };
    this.overrideRequests = [request, ...this.overrideRequests];
    this.overrideMessage = 'Override submitted to checker for approval.';
    this.history = [
      {
        id: `H-${Date.now()}`,
        title: `Override submitted for ${this.selectedRow.id}`,
        detail: `${this.overrideType} sent to ${request.assignedTo}`,
        timeAgo: 'Just now',
        status: 'Submitted',
      },
      ...this.history,
    ];
  }

  approveRequest(request: OverrideRequest): void {
    request.status = 'Approved';
    this.history = [
      {
        id: `H-${Date.now()}`,
        title: `Override approved for ${request.appId}`,
        detail: `${request.overrideType} approved by checker`,
        timeAgo: 'Just now',
        status: 'Approved',
      },
      ...this.history,
    ];
  }

  rejectRequest(request: OverrideRequest): void {
    request.status = 'Rejected';
    this.history = [
      {
        id: `H-${Date.now()}`,
        title: `Override rejected for ${request.appId}`,
        detail: `${request.overrideType} rejected by checker`,
        timeAgo: 'Just now',
        status: 'Rejected',
      },
      ...this.history,
    ];
  }

  resetDemo(): void {
    this.workItems = cloneData(SEED.workItems);
    this.overrideRequests = cloneData(SEED.overrideRequests);
    this.history = cloneData(SEED.history);
    this.selectedIds = ['APP-003'];
    this.selectedRow = this.workItems.find(row => row.id === 'APP-003') || null;
    this.reassignUserId = '';
    this.reassignReason = '';
    this.reassignRemarks = '';
    this.overrideType = 'Manual Re-Assignment';
    this.overrideAssignTo = 'sam';
    this.overrideReason = 'VIP Handling';
    this.overrideJustification = '';
    this.overrideMessage = '';
    this.reassignMessage = '';
    this.checkerDecision = '';
  }

  updateChips(): void {
    const chips: FilterChip[] = [];
    if (this.selectedView !== 'all') {
      const view = this.views.find(v => v.key === this.selectedView);
      if (view) {
        chips.push({ key: 'view', label: view.label });
      }
    }
    if (this.searchTerm.trim()) {
      chips.push({ key: 'search', label: `Search: ${this.searchTerm.trim()}` });
    }
    this.activeChips = chips;
  }

  getStatusClass(statusKey: WorkRow['statusKey']): string {
    if (statusKey === 'NEW') {
      return 'bg-blue-50 text-blue-700';
    }
    if (statusKey === 'PENDING') {
      return 'bg-amber-50 text-amber-700';
    }
    if (statusKey === 'IN_PROGRESS') {
      return 'bg-indigo-50 text-indigo-700';
    }
    if (statusKey === 'REVIEW') {
      return 'bg-purple-50 text-purple-700';
    }
    return 'bg-red-50 text-red-700';
  }

  getRequestStatusClass(status: OverrideRequest['status']): string {
    if (status === 'Approved') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (status === 'Rejected') {
      return 'bg-red-50 text-red-700';
    }
    return 'bg-amber-50 text-amber-700';
  }

  getHistoryStatusClass(status: HistoryEntry['status']): string {
    if (status === 'Approved') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (status === 'Rejected') {
      return 'bg-red-50 text-red-700';
    }
    if (status === 'Assigned') {
      return 'bg-blue-50 text-blue-700';
    }
    return 'bg-amber-50 text-amber-700';
  }
}

function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
