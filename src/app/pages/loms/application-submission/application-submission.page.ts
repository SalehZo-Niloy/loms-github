import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';

type SubmissionStatusId = 'ESCALATE_FORWARD' | 'HOLD' | 'SEND_BACK';

interface SubmissionRecipientOption {
  id: string;
  label: string;
  title: string;
}

interface SubmissionStatusOption {
  id: SubmissionStatusId;
  label: string;
  badgeText: string;
}

interface SubmissionComment {
  id: string;
  authorName: string;
  title: string;
  avatarInitials: string;
  statusId: SubmissionStatusId;
  statusLabel: string;
  toLabel: string;
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-loms-application-submission-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, UiButtonComponent],
  templateUrl: './application-submission.page.html'
})
export class LomsApplicationSubmissionPageComponent {
  @Input() mode: 'page' | 'drawer' = 'page';
  @Output() close = new EventEmitter<void>();

  recipients: SubmissionRecipientOption[] = [
    {
      id: 'vp-operations',
      label: 'Rasheda Akter – VP Operations',
      title: 'VP Operations'
    },
    {
      id: 'team-lead',
      label: 'Mohammad Arif – Team Lead',
      title: 'Team Lead'
    },
    {
      id: 'senior-manager',
      label: 'Nazmul Hossain – Senior Manager',
      title: 'Senior Manager'
    }
  ];

  statusOptions: SubmissionStatusOption[] = [
    {
      id: 'ESCALATE_FORWARD',
      label: 'Escalate Forward',
      badgeText: 'Escalate Forward'
    },
    {
      id: 'HOLD',
      label: 'Hold',
      badgeText: 'Hold'
    },
    {
      id: 'SEND_BACK',
      label: 'Send Back',
      badgeText: 'Send Back'
    }
  ];

  selectedRecipientId = '';
  selectedStatusId: SubmissionStatusId | '' = '';
  remarks = '';
  formError = '';

  comments: SubmissionComment[] = [
    {
      id: 'c1',
      authorName: 'Rasheda Akter',
      title: 'VP Operations',
      avatarInitials: 'RA',
      statusId: 'ESCALATE_FORWARD',
      statusLabel: 'Escalate Forward',
      toLabel: 'Mohammad Karim – Director',
      text: 'This issue requires immediate attention. Escalating to the senior management team for review and approval. Please prioritize this matter.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'c2',
      authorName: 'Mohammad Arif',
      title: 'Team Lead',
      avatarInitials: 'MA',
      statusId: 'HOLD',
      statusLabel: 'Hold',
      toLabel: 'Nazmul Hossain – Senior Manager',
      text: 'Putting this on hold temporarily until we receive additional documentation from the client. Expected turnaround time is 24–48 hours.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 'c3',
      authorName: 'Nazmul Hossain',
      title: 'Senior Manager',
      avatarInitials: 'NH',
      statusId: 'SEND_BACK',
      statusLabel: 'Send Back',
      toLabel: 'Saiful Islam – Project Manager',
      text: 'Sending this back to the originating department for further clarification on the technical specifications mentioned in section 3.2.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  constructor(private router: Router) {}

  onClose(): void {
    this.close.emit();
  }

  onBackToPreview(): void {
    this.router.navigate(['/loms', 'application-preview']);
  }

  get canSubmit(): boolean {
    return (
      !!this.selectedRecipientId &&
      !!this.selectedStatusId &&
      this.remarks.trim().length > 0
    );
  }

  onSubmit(): void {
    if (!this.canSubmit) {
      this.formError = 'Please select recipient, status, and add remarks before submitting.';
      return;
    }

    this.formError = '';

    const recipient = this.recipients.find(r => r.id === this.selectedRecipientId);
    const status = this.statusOptions.find(s => s.id === this.selectedStatusId);

    if (!recipient || !status) {
      return;
    }

    const now = new Date();

    const newComment: SubmissionComment = {
      id: `c-${now.getTime()}`,
      authorName: 'Kamal Uddin',
      title: 'Relationship Manager',
      avatarInitials: 'KU',
      statusId: status.id,
      statusLabel: status.badgeText,
      toLabel: recipient.label,
      text: this.remarks.trim(),
      createdAt: now
    };

    this.comments = [newComment, ...this.comments];
    this.remarks = '';
    this.selectedStatusId = '';
    this.selectedRecipientId = '';
  }

  getStatusBadgeClasses(statusId: SubmissionStatusId): string[] {
    if (statusId === 'ESCALATE_FORWARD') {
      return [
        'border',
        'border-amber-200',
        'bg-amber-50',
        'text-amber-800'
      ];
    }

    if (statusId === 'HOLD') {
      return [
        'border',
        'border-slate-300',
        'bg-slate-50',
        'text-slate-800'
      ];
    }

    return [
      'border',
      'border-blue-200',
      'bg-blue-50',
      'text-blue-800'
    ];
  }

  getTimeAgo(date: Date): string {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
      return 'Just now';
    }

    if (diffMinutes < 60) {
      const value = diffMinutes;
      return `${value} minute${value === 1 ? '' : 's'} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      const value = diffHours;
      return `${value} hour${value === 1 ? '' : 's'} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    const value = diffDays;
    return `${value} day${value === 1 ? '' : 's'} ago`;
  }
}
