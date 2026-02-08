import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

interface SubmissionRecipient {
  id: string;
  label: string;
}

interface SubmissionMessage {
  id: string;
  senderLabel: string;
  role: 'QUESTION' | 'RESPONSE';
  text: string;
  createdAt: Date;
  attachments?: string[];
}

interface SubmissionActivityLogItem {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  note?: string;
}

@Component({
  selector: 'app-loms-submission-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './submission.page.html',
})
export class LomsSubmissionPageComponent {
  appNo = 'LN-2023-001';
  customerName = 'Md. Rahim Uddin';
  productName = 'Home Loan';
  dueAt = new Date('2026-01-31T13:05:41');

  recipients: SubmissionRecipient[] = [
    { id: 'bob-branch', label: 'Rahim Branch Manager (Req)' },
    { id: 'alice-cro', label: 'Farhana CRO' },
    { id: 'ops-team', label: 'Dhaka Ops Team' },
  ];

  selectedRecipientId = 'bob-branch';

  messages: SubmissionMessage[] = [
    {
      id: 'm1',
      senderLabel: 'Farhana CRO (QUESTION)',
      role: 'QUESTION',
      text: 'Customer ID proof is blurry.',
      createdAt: new Date('2026-01-29T13:05:41'),
    },
    {
      id: 'm2',
      senderLabel: 'Rahim Branch Manager (RESPONSE)',
      role: 'RESPONSE',
      text: 'Attached clear copy.',
      createdAt: new Date('2026-01-30T13:05:41'),
      attachments: ['id_proof.jpg'],
    },
  ];

  activityLog: SubmissionActivityLogItem[] = [
    {
      id: 'a1',
      timestamp: new Date('2026-01-29T13:05:41'),
      actor: 'Farhana CRO',
      action: 'CREATED',
      note: 'Query created',
    },
    {
      id: 'a2',
      timestamp: new Date('2026-01-30T13:05:41'),
      actor: 'Rahim Branch Manager',
      action: 'STATUS_CHANGED',
      note: 'Status changed to RESPONDED',
    },
    {
      id: 'a3',
      timestamp: new Date('2026-01-30T13:05:41'),
      actor: 'Rahim Branch Manager',
      action: 'RESPONDED',
      note: 'Response added',
    },
  ];

  responseText = '';

  get selectedRecipient(): SubmissionRecipient | undefined {
    return this.recipients.find(r => r.id === this.selectedRecipientId);
  }

  submitResponse(): void {
    const text = this.responseText.trim();
    if (!text) {
      return;
    }

    const now = new Date();
    const message: SubmissionMessage = {
      id: `m-${now.getTime()}`,
      senderLabel: 'Rahim Branch Manager (RESPONSE)',
      role: 'RESPONSE',
      text,
      createdAt: now,
    };
    this.messages = [...this.messages, message];

    const logItem: SubmissionActivityLogItem = {
      id: `a-${now.getTime()}`,
      timestamp: now,
      actor: 'Rahim Branch Manager',
      action: 'RESPONDED',
      note: 'Response added',
    };
    this.activityLog = [...this.activityLog, logItem];

    this.responseText = '';
  }
}

