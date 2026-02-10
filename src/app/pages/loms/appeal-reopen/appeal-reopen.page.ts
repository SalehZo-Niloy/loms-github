import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type UserRole = 'Maker' | 'CRO' | 'Checker';
type AppealStatus =
  | 'Rejected'
  | 'Reopened'
  | 'Pending CRO Review'
  | 'Pending Checker Approval';
type AppealTab = 'create' | 'cro' | 'checker' | 'timeline';

interface UserOption {
  id: string;
  label: string;
  role: UserRole;
}

interface AppealApplication {
  id: string;
  customer: string;
  product: string;
  amount: number;
  currency: string;
  branch: string;
  rejectionReason: string;
  rejectedBy: string;
  rejectedOn: string;
  status: AppealStatus;
  flags: string[];
}

interface CorrectedField {
  field: string;
  oldValue: string;
  newValue: string;
}

interface AppealDraft {
  type: string;
  justification: string;
  correctedFields: CorrectedField[];
  exceptionRequested: boolean;
  priority: string;
}

interface AppealRequest {
  appId: string;
  makerName: string;
  type: string;
  justification: string;
  correctedFields: CorrectedField[];
  exceptionRequested: boolean;
  priority: string;
  status: AppealStatus;
  submittedAt: string;
  croDecision?: string;
  croNotes?: string;
  croName?: string;
  checkerNotes?: string;
}

interface TimelineEntry {
  id: string;
  appId: string;
  title: string;
  detail: string;
  timeAgo: string;
  status: AppealStatus | 'Submitted' | 'Reviewed';
}

const USERS: UserOption[] = [
  { id: 'maker-1', label: 'Afsana Islam (Branch Manager)', role: 'Maker' },
  { id: 'maker-2', label: 'Md. Rezaul Karim (Relationship Officer)', role: 'Maker' },
  { id: 'cro-1', label: 'Samira Chowdhury (CRO)', role: 'CRO' },
  { id: 'checker-1', label: 'Fahim Hasan (Approval Desk)', role: 'Checker' },
];

const SEED_APPLICATIONS: AppealApplication[] = [
  {
    id: 'APP-1001',
    customer: 'Beximco Ltd.',
    product: 'SME Loan',
    amount: 5500000,
    currency: 'BDT',
    branch: 'Dhaka Main',
    rejectionReason: 'Policy',
    rejectedBy: 'Rashed Alam (CRO)',
    rejectedOn: '02/02/2026',
    status: 'Reopened',
    flags: ['High Amount'],
  },
  {
    id: 'APP-1002',
    customer: 'Md. Rafiul Islam',
    product: 'Personal Loan',
    amount: 1500000,
    currency: 'BDT',
    branch: 'Dhanmondi',
    rejectionReason: 'Credit Score',
    rejectedBy: 'Rashed Alam (CRO)',
    rejectedOn: '02/03/2026',
    status: 'Rejected',
    flags: ['Missing Docs'],
  },
  {
    id: 'APP-1003',
    customer: 'Walton Hi-Tech Ltd.',
    product: 'Startup Capital',
    amount: 12000000,
    currency: 'BDT',
    branch: 'Gulshan',
    rejectionReason: 'Policy',
    rejectedBy: 'Rashed Alam (CRO)',
    rejectedOn: '02/01/2026',
    status: 'Pending CRO Review',
    flags: ['High Amount'],
  },
];

const SEED_REQUESTS: AppealRequest[] = [
  {
    appId: 'APP-1003',
    makerName: 'Afsana Islam',
    type: 'Reconsideration',
    justification: 'Updated financials submitted with stronger cash flow coverage.',
    correctedFields: [
      { field: 'Monthly Income', oldValue: 'BDT 450,000', newValue: 'BDT 620,000' },
      { field: 'Existing Liability', oldValue: 'BDT 1,500,000', newValue: 'BDT 900,000' },
    ],
    exceptionRequested: true,
    priority: 'High',
    status: 'Pending CRO Review',
    submittedAt: '20 minutes ago',
  },
];

const SEED_TIMELINE: TimelineEntry[] = [
  {
    id: 'T-1001',
    appId: 'APP-1001',
    title: 'Reopen approved',
    detail: 'Checker approved reopen and moved to CRO review.',
    timeAgo: '2 hours ago',
    status: 'Reopened',
  },
  {
    id: 'T-1002',
    appId: 'APP-1002',
    title: 'Rejected by CRO',
    detail: 'Credit score below policy threshold.',
    timeAgo: '1 day ago',
    status: 'Rejected',
  },
  {
    id: 'T-1003',
    appId: 'APP-1003',
    title: 'Appeal submitted',
    detail: 'Maker submitted appeal with updated financials.',
    timeAgo: '20 minutes ago',
    status: 'Submitted',
  },
];

function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

@Component({
  selector: 'app-appeal-reopen-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './appeal-reopen.page.html',
})
export class AppealReopenPageComponent {
  users = USERS;
  currentUserId = 'maker-1';
  activeTab: AppealTab = 'create';
  searchTerm = '';
  selectedAppId: string | null = null;
  checkerReviewAppId: string | null = null;

  applications: AppealApplication[] = cloneData(SEED_APPLICATIONS);
  appealRequests: AppealRequest[] = cloneData(SEED_REQUESTS);
  timeline: TimelineEntry[] = cloneData(SEED_TIMELINE);

  appealDrafts: Record<string, AppealDraft> = {};

  appealTypes = ['Reconsideration', 'Correction', 'Exception Request'];
  priorities = ['Normal', 'High'];
  croDecisions = ['Recommend Reopen', 'Reject Appeal', 'Request More Info'];

  get currentUser(): UserOption | undefined {
    return this.users.find(user => user.id === this.currentUserId);
  }

  get role(): UserRole {
    return this.currentUser?.role ?? 'Maker';
  }

  get filteredApplications(): AppealApplication[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.applications;
    }
    return this.applications.filter(app => {
      const amountText = app.amount.toString();
      return (
        app.customer.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.product.toLowerCase().includes(query) ||
        app.branch.toLowerCase().includes(query) ||
        amountText.includes(query)
      );
    });
  }

  get selectedApplication(): AppealApplication | undefined {
    return this.applications.find(app => app.id === this.selectedAppId);
  }

  get selectedRequest(): AppealRequest | undefined {
    const selected = this.selectedApplication;
    if (!selected) {
      return undefined;
    }
    return this.appealRequests.find(request => request.appId === selected.id);
  }

  get checkerRequests(): AppealRequest[] {
    return this.appealRequests.filter(request => request.status === 'Pending Checker Approval');
  }

  get checkerReviewRequest(): AppealRequest | undefined {
    if (!this.checkerReviewAppId) {
      return undefined;
    }
    return this.appealRequests.find(request => request.appId === this.checkerReviewAppId);
  }

  get selectedTimeline(): TimelineEntry[] {
    const selected = this.selectedApplication;
    if (!selected) {
      return [];
    }
    return this.timeline.filter(item => item.appId === selected.id);
  }

  get activeDraft(): AppealDraft | null {
    if (!this.selectedApplication) {
      return null;
    }
    return this.getDraft(this.selectedApplication.id);
  }

  onUserChange(): void {
    if (this.role === 'Maker') {
      this.activeTab = 'create';
    }
    if (this.role === 'CRO') {
      this.activeTab = 'cro';
    }
    if (this.role === 'Checker') {
      this.activeTab = 'checker';
    }
  }

  setActiveTab(tab: AppealTab): void {
    this.activeTab = tab;
    if (tab !== 'checker') {
      this.checkerReviewAppId = null;
    }
  }

  selectApplication(app: AppealApplication): void {
    this.selectedAppId = app.id;
    if (this.role === 'Maker') {
      this.activeTab = 'create';
    }
    if (this.role === 'CRO') {
      this.activeTab = 'cro';
    }
    if (this.role === 'Checker') {
      this.activeTab = 'checker';
    }
  }

  addCorrectedField(): void {
    if (!this.activeDraft) {
      return;
    }
    this.activeDraft.correctedFields.push({
      field: '',
      oldValue: '',
      newValue: '',
    });
  }

  removeCorrectedField(index: number): void {
    if (!this.activeDraft) {
      return;
    }
    this.activeDraft.correctedFields.splice(index, 1);
  }

  submitAppeal(): void {
    if (!this.selectedApplication || !this.activeDraft || this.role !== 'Maker') {
      return;
    }
    const makerName = this.currentUser?.label.split(' (')[0] ?? 'Maker';
    const existing = this.appealRequests.find(req => req.appId === this.selectedApplication?.id);
    if (existing) {
      existing.type = this.activeDraft.type;
      existing.justification = this.activeDraft.justification;
      existing.correctedFields = cloneData(this.activeDraft.correctedFields);
      existing.exceptionRequested = this.activeDraft.exceptionRequested;
      existing.priority = this.activeDraft.priority;
      existing.status = 'Pending CRO Review';
      existing.submittedAt = 'Just now';
      existing.makerName = makerName;
    } else {
      this.appealRequests.unshift({
        appId: this.selectedApplication.id,
        makerName,
        type: this.activeDraft.type,
        justification: this.activeDraft.justification,
        correctedFields: cloneData(this.activeDraft.correctedFields),
        exceptionRequested: this.activeDraft.exceptionRequested,
        priority: this.activeDraft.priority,
        status: 'Pending CRO Review',
        submittedAt: 'Just now',
      });
    }
    this.updateApplicationStatus(this.selectedApplication.id, 'Pending CRO Review');
    this.timeline.unshift({
      id: `T-${Date.now()}`,
      appId: this.selectedApplication.id,
      title: 'Appeal submitted',
      detail: `Appeal submitted by ${makerName}.`,
      timeAgo: 'Just now',
      status: 'Submitted',
    });
  }

  submitCroDecision(): void {
    if (!this.selectedRequest || this.role !== 'CRO') {
      return;
    }
    this.selectedRequest.croName = this.currentUser?.label.split(' (')[0] ?? 'CRO';
    if (this.selectedRequest.croDecision === 'Reject Appeal') {
      this.selectedRequest.status = 'Rejected';
      this.updateApplicationStatus(this.selectedRequest.appId, 'Rejected');
      this.timeline.unshift({
        id: `T-${Date.now()}`,
        appId: this.selectedRequest.appId,
        title: 'CRO rejected appeal',
        detail: 'CRO decided to reject the appeal.',
        timeAgo: 'Just now',
        status: 'Rejected',
      });
      return;
    }
    this.selectedRequest.status = 'Pending Checker Approval';
    this.updateApplicationStatus(this.selectedRequest.appId, 'Pending Checker Approval');
    this.timeline.unshift({
      id: `T-${Date.now()}`,
      appId: this.selectedRequest.appId,
      title: 'CRO submitted decision',
      detail: 'Appeal forwarded for checker approval.',
      timeAgo: 'Just now',
      status: 'Reviewed',
    });
  }

  openCheckerReview(request: AppealRequest): void {
    this.checkerReviewAppId = request.appId;
  }

  approveReopen(): void {
    const request = this.checkerReviewRequest;
    if (!request || this.role !== 'Checker') {
      return;
    }
    request.status = 'Reopened';
    this.updateApplicationStatus(request.appId, 'Reopened');
    this.timeline.unshift({
      id: `T-${Date.now()}`,
      appId: request.appId,
      title: 'Reopen approved',
      detail: 'Checker approved reopen submission.',
      timeAgo: 'Just now',
      status: 'Reopened',
    });
  }

  rejectReopen(): void {
    const request = this.checkerReviewRequest;
    if (!request || this.role !== 'Checker') {
      return;
    }
    request.status = 'Rejected';
    this.updateApplicationStatus(request.appId, 'Rejected');
    this.timeline.unshift({
      id: `T-${Date.now()}`,
      appId: request.appId,
      title: 'Reopen rejected',
      detail: 'Checker rejected reopen request.',
      timeAgo: 'Just now',
      status: 'Rejected',
    });
  }

  sendBackToCro(): void {
    const request = this.checkerReviewRequest;
    if (!request || this.role !== 'Checker') {
      return;
    }
    request.status = 'Pending CRO Review';
    this.updateApplicationStatus(request.appId, 'Pending CRO Review');
    this.timeline.unshift({
      id: `T-${Date.now()}`,
      appId: request.appId,
      title: 'Sent back to CRO',
      detail: 'Checker requested CRO clarification.',
      timeAgo: 'Just now',
      status: 'Reviewed',
    });
  }

  resetDemo(): void {
    this.applications = cloneData(SEED_APPLICATIONS);
    this.appealRequests = cloneData(SEED_REQUESTS);
    this.timeline = cloneData(SEED_TIMELINE);
    this.appealDrafts = {};
    this.selectedAppId = null;
    this.checkerReviewAppId = null;
  }

  private getDraft(appId: string): AppealDraft {
    if (!this.appealDrafts[appId]) {
      this.appealDrafts[appId] = {
        type: 'Reconsideration',
        justification: '',
        correctedFields: [],
        exceptionRequested: false,
        priority: 'Normal',
      };
    }
    return this.appealDrafts[appId];
  }

  private updateApplicationStatus(appId: string, status: AppealStatus): void {
    const app = this.applications.find(item => item.id === appId);
    if (app) {
      app.status = status;
    }
  }

  getStatusPill(status: AppealStatus): string {
    if (status === 'Reopened') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (status === 'Pending CRO Review') {
      return 'bg-amber-50 text-amber-700';
    }
    if (status === 'Pending Checker Approval') {
      return 'bg-blue-50 text-blue-700';
    }
    return 'bg-rose-50 text-rose-700';
  }
}
