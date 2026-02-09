import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type CardPriority = 'Normal' | 'Urgent';
type ReviewStatus = 'Pending' | 'Reviewed';
type EscalationStatus = 'Not Sent' | 'Sent to Maker';

interface CardIssuanceApplication {
  id: string;
  applicationDate: string;
  customerName: string;
  cif: string;
  accountNumber: string;
  cardType: string;
  cardProduct: string;
  currency: string;
  branch: string;
  priority: CardPriority;
  reviewStatus: ReviewStatus;
  escalationStatus: EscalationStatus;
}

interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  mandatory: boolean;
}

interface TimelineItem {
  label: string;
  description: string;
  time: string;
  status: 'done' | 'active' | 'pending';
}

@Component({
  selector: 'app-loms-card-operation-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './card-operation-details.page.html'
})
export class LomsCardOperationDetailsPageComponent {
  application: CardIssuanceApplication | null = null;

  kycStatus = '';
  amlStatus = '';
  riskRating = '';
  riskScore = '';

  attachments: AttachmentItem[] = [];
  timelineItems: TimelineItem[] = [];

  reviewerRemarks = '';
  decision: 'approve' | 'sendBack' | 'reject' | 'escalate' | '' = '';
  markPriorityAsUrgent = false;
  markForEscalation = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    const stateApp = this.getApplicationFromState();
    const paramId = this.route.snapshot.paramMap.get('id');
    const seed = this.getSeedApplications()[0];
    const idFromState = stateApp && stateApp.id;
    const lookupId = idFromState || paramId || '';
    if (lookupId) {
      const base = this.findApplicationById(lookupId);
      this.application = base ? { ...base, ...(stateApp || {}) } : { ...seed, ...(stateApp || {}) };
    } else if (stateApp) {
      this.application = { ...seed, ...stateApp };
    } else {
      this.application = seed;
    }

    this.buildKycAndRisk();
    this.buildAttachments();
    this.buildTimeline();
  }

  get hasApplication(): boolean {
    return !!this.application;
  }

  get priorityBadgeClasses(): string {
    if (!this.application) {
      return 'bg-slate-100 text-slate-700';
    }
    return this.application.priority === 'Urgent'
      ? 'bg-rose-50 text-rose-700'
      : 'bg-emerald-50 text-emerald-700';
  }

  get reviewStatusBadgeClasses(): string {
    if (!this.application) {
      return 'bg-slate-100 text-slate-700';
    }
    return this.application.reviewStatus === 'Reviewed'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';
  }

  get escalationBadgeClasses(): string {
    if (!this.application) {
      return 'bg-slate-100 text-slate-700';
    }
    return this.application.escalationStatus === 'Sent to Maker'
      ? 'bg-blue-50 text-blue-700'
      : 'bg-slate-50 text-slate-600';
  }

  get decisionDisabled(): boolean {
    return !this.application || !this.decision;
  }

  onBackToDashboard(): void {
    this.router.navigate(['/loms', 'card-operation', 'application']);
  }

  onSubmitDecision(): void {
    if (!this.application || !this.decision) {
      return;
    }

    if (this.decision === 'approve') {
      this.application.reviewStatus = 'Reviewed';
      this.application.escalationStatus = this.markForEscalation ? 'Sent to Maker' : 'Not Sent';
    } else if (this.decision === 'sendBack') {
      this.application.reviewStatus = 'Pending';
      this.application.escalationStatus = 'Not Sent';
    } else if (this.decision === 'reject') {
      this.application.reviewStatus = 'Reviewed';
      this.application.escalationStatus = 'Not Sent';
    } else if (this.decision === 'escalate') {
      this.application.escalationStatus = 'Sent to Maker';
    }

    if (this.markPriorityAsUrgent) {
      this.application.priority = 'Urgent';
    }

    this.buildKycAndRisk();
    this.buildTimeline();
  }

  onDownloadAttachment(att: AttachmentItem): void {
    att.size = att.size;
  }

  onMarkAsViewed(att: AttachmentItem): void {
    att.uploadedAt = att.uploadedAt;
  }

  timelineBadgeClasses(item: TimelineItem): string {
    if (item.status === 'done') {
      return 'bg-emerald-500 text-white';
    }
    if (item.status === 'active') {
      return 'bg-blue-600 text-white';
    }
    return 'bg-slate-200 text-slate-500';
  }

  private getApplicationFromState(): Partial<CardIssuanceApplication> | null {
    try {
      const state = history && (history.state as any);
      if (state && state.application && typeof state.application === 'object') {
        return state.application as Partial<CardIssuanceApplication>;
      }
    } catch (e) {}
    return null;
  }

  private getSeedApplications(): CardIssuanceApplication[] {
    return [
      {
        id: 'CRD-2025-0012',
        applicationDate: '2025-02-08',
        customerName: 'Md. Rafiqul Islam',
        cif: 'CIF-789456',
        accountNumber: '1234567890123',
        cardType: 'Debit Card',
        cardProduct: 'Classic Debit',
        currency: 'BDT',
        branch: 'Head Office',
        priority: 'Normal',
        reviewStatus: 'Pending',
        escalationStatus: 'Not Sent'
      },
      {
        id: 'CRD-2025-0011',
        applicationDate: '2025-02-08',
        customerName: 'Ayesha Begum',
        cif: 'CIF-789455',
        accountNumber: '1234567890124',
        cardType: 'Credit Card',
        cardProduct: 'Gold Credit',
        currency: 'BDT',
        branch: 'Head Office',
        priority: 'Urgent',
        reviewStatus: 'Pending',
        escalationStatus: 'Not Sent'
      },
      {
        id: 'CRD-2025-0010',
        applicationDate: '2025-02-07',
        customerName: 'Kamal Hossain',
        cif: 'CIF-789454',
        accountNumber: '1234567890125',
        cardType: 'Prepaid Card',
        cardProduct: 'Student Prepaid',
        currency: 'BDT',
        branch: 'Gulshan',
        priority: 'Normal',
        reviewStatus: 'Reviewed',
        escalationStatus: 'Sent to Maker'
      },
      {
        id: 'CRD-2025-0009',
        applicationDate: '2025-02-07',
        customerName: 'Fatima Khatun',
        cif: 'CIF-789453',
        accountNumber: '1234567890126',
        cardType: 'Credit Card',
        cardProduct: 'Platinum Credit',
        currency: 'USD',
        branch: 'Head Office',
        priority: 'Normal',
        reviewStatus: 'Pending',
        escalationStatus: 'Not Sent'
      },
      {
        id: 'CRD-2025-0008',
        applicationDate: '2025-02-07',
        customerName: 'Rashed Ahmed',
        cif: 'CIF-789452',
        accountNumber: '1234567890127',
        cardType: 'Debit Card',
        cardProduct: 'Classic Debit',
        currency: 'BDT',
        branch: 'Banani',
        priority: 'Normal',
        reviewStatus: 'Pending',
        escalationStatus: 'Not Sent'
      },
      {
        id: 'CRD-2025-0007',
        applicationDate: '2025-02-06',
        customerName: 'Nadia Sultana',
        cif: 'CIF-789451',
        accountNumber: '1234567890128',
        cardType: 'Credit Card',
        cardProduct: 'Gold Credit',
        currency: 'BDT',
        branch: 'Head Office',
        priority: 'Normal',
        reviewStatus: 'Reviewed',
        escalationStatus: 'Sent to Maker'
      }
    ];
  }

  private findApplicationById(id: string): CardIssuanceApplication | null {
    if (!id) {
      return null;
    }
    const apps = this.getSeedApplications();
    return apps.find(a => a.id === id) || null;
  }

  private buildKycAndRisk(): void {
    if (!this.application) {
      this.kycStatus = '';
      this.amlStatus = '';
      this.riskRating = '';
      this.riskScore = '';
      return;
    }

    this.kycStatus = 'Completed';
    this.amlStatus = this.application.currency === 'USD' ? 'Additional Screening Required' : 'Cleared';

    if (this.application.cardType === 'Credit Card') {
      this.riskRating = this.application.priority === 'Urgent' ? 'Moderate' : 'Low';
      this.riskScore = this.application.priority === 'Urgent' ? '3.4 / 5' : '2.1 / 5';
    } else if (this.application.cardType === 'Prepaid Card') {
      this.riskRating = 'Low';
      this.riskScore = '1.8 / 5';
    } else {
      this.riskRating = 'Low';
      this.riskScore = '2.0 / 5';
    }
  }

  private buildAttachments(): void {
    if (!this.application) {
      this.attachments = [];
      return;
    }

    const base: AttachmentItem[] = [
      {
        id: 'ATT-01',
        name: 'Customer Photograph.pdf',
        type: 'Photograph',
        uploadedBy: 'Branch Maker',
        uploadedAt: '2025-02-08 10:15 AM',
        size: '240 KB',
        mandatory: true
      },
      {
        id: 'ATT-02',
        name: 'National ID Front & Back.pdf',
        type: 'NID',
        uploadedBy: 'Branch Maker',
        uploadedAt: '2025-02-08 10:17 AM',
        size: '560 KB',
        mandatory: true
      },
      {
        id: 'ATT-03',
        name: 'Signature Specimen.pdf',
        type: 'Signature',
        uploadedBy: 'Branch Maker',
        uploadedAt: '2025-02-08 10:20 AM',
        size: '320 KB',
        mandatory: true
      }
    ];

    if (this.application.cardType === 'Credit Card') {
      base.push({
        id: 'ATT-04',
        name: 'Salary Certificate.pdf',
        type: 'Income Proof',
        uploadedBy: 'Branch Maker',
        uploadedAt: '2025-02-08 10:25 AM',
        size: '410 KB',
        mandatory: false
      });
    }

    this.attachments = base;
  }

  private buildTimeline(): void {
    if (!this.application) {
      this.timelineItems = [];
      return;
    }

    const status = this.application.reviewStatus;
    const escalated = this.application.escalationStatus === 'Sent to Maker';

    const items: TimelineItem[] = [
      {
        label: 'Application Submitted',
        description: 'Card issuance request submitted from branch.',
        time: '08 Feb 2025, 09:30 AM',
        status: 'done'
      },
      {
        label: 'Sent to Issuance Review',
        description: 'Application assigned to issuance review queue.',
        time: '08 Feb 2025, 09:35 AM',
        status: 'done'
      },
      {
        label: 'Under Review by Issuance Team',
        description: 'Customer, account and KYC details under verification.',
        time: '08 Feb 2025, 10:05 AM',
        status: status === 'Pending' ? 'active' : 'done'
      },
      {
        label: 'Escalated to Maker',
        description: 'Clarification or exception approval requested from maker.',
        time: escalated ? '08 Feb 2025, 11:10 AM' : '—',
        status: escalated ? 'done' : 'pending'
      },
      {
        label: 'Card Issuance Decision',
        description: 'Final decision recorded for card issuance.',
        time: status === 'Reviewed' ? '08 Feb 2025, 12:00 PM' : '—',
        status: status === 'Reviewed' ? 'done' : 'pending'
      }
    ];

    this.timelineItems = items;
  }
}
