import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';

@Component({
  selector: 'app-loms-application-communication-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, UiButtonComponent],
  templateUrl: './application-communication.page.html'
})
export class LomsApplicationCommunicationPageComponent {
  @Input() mode: 'page' | 'drawer' = 'page';
  @Output() close = new EventEmitter<void>();

  recentQueries = [
    { id: 'server-downtime', label: 'Server downtime issue' },
    { id: 'payment-gateway', label: 'Payment gateway integration' },
    { id: 'user-onboarding', label: 'User onboarding flow' },
    { id: 'api-rate-limits', label: 'API rate limiting' },
    { id: 'mobile-performance', label: 'Mobile app performance' }
  ];

  selectedQueryId = 'server-downtime';

  messagesByQuery: Record<
    string,
    {
      id: string;
      kind: 'text' | 'code' | 'conditions';
      author: 'assistant' | 'user';
      authorName: string;
      roleLabel: string;
      text: string;
      codeTitle?: string;
    }[]
  > = {
    'server-downtime': [
      {
        id: 'm1',
        kind: 'text',
        author: 'assistant',
        authorName: 'System Assistant',
        roleLabel: 'Monitoring',
        text: 'Hello. I noticed a flag on the server monitoring system. How can I assist you with the server downtime issue today?'
      },
      {
        id: 'm2',
        kind: 'text',
        author: 'user',
        authorName: 'Sohan',
        roleLabel: 'Relationship Manager',
        text: 'I need to check the logs for the last 2 hours. Can you pull up the error logs for the us-east-1 cluster?'
      },
      {
        id: 'm3',
        kind: 'text',
        author: 'assistant',
        authorName: 'System Assistant',
        roleLabel: 'Monitoring',
        text: 'I have retrieved the critical error logs. It seems there was a spike in latency followed by a connection timeout in the database pool.'
      },
      {
        id: 'm4',
        kind: 'code',
        author: 'assistant',
        authorName: 'System Assistant',
        roleLabel: 'Monitoring',
        text: '',
        codeTitle: 'server_logs.txt'
      },
      {
        id: 'm5',
        kind: 'conditions',
        author: 'assistant',
        authorName: 'System Assistant',
        roleLabel: 'Monitoring',
        text: ''
      }
    ]
  };

  messages =
    this.messagesByQuery[this.selectedQueryId]?.map(message => ({ ...message })) ?? [];

  activeConditions = [
    {
      id: 'latency-trigger',
      category: 'trigger' as const,
      title: 'If Latency > 2000ms',
      description: 'Alert the NextOps Team when average latency exceeds 2000ms.',
      active: true
    },
    {
      id: 'region-filter',
      category: 'filter' as const,
      title: 'If Region = US-EAST-1',
      description: 'Only include traffic originating from the US-EAST-1 region.',
      active: true
    }
  ];

  newMessageText = '';
  querySearch = '';

  serverLogsText = `[2023-10-27 14:23:01] ERROR: Connection pool exhausted
[2023-10-27 14:23:02] CRITICAL: DB_CONNECT_TIMEOUT (5000ms)
    at Database.connect (/app/src/db/connector.js:45:12)
    at async processQueue (/app/src/workers/queue.js:102:5)
[2023-10-27 14:23:05] INFO: Retrying connection (Attempt 1/3)...`;

  constructor(private router: Router) {}

  onBackToPreview(): void {
    this.router.navigate(['/loms', 'application-preview']);
  }

  onClose(): void {
    this.close.emit();
  }

  onSelectQuery(id: string): void {
    if (this.selectedQueryId === id) {
      return;
    }
    this.selectedQueryId = id;
    const source = this.messagesByQuery[id];
    if (source) {
      this.messages = source.map(message => ({ ...message }));
    } else {
      this.messages = [];
    }
  }

  onToggleCondition(id: string): void {
    this.activeConditions = this.activeConditions.map(condition =>
      condition.id === id ? { ...condition, active: !condition.active } : condition
    );
  }

  onAddCondition(): void {
    const nextIndex = this.activeConditions.length + 1;
    const newCondition = {
      id: `custom-${Date.now()}`,
      category: 'filter' as const,
      title: `New condition ${nextIndex}`,
      description: 'Define the logic for this condition.',
      active: true
    };
    this.activeConditions = [...this.activeConditions, newCondition];
  }

  onSendMessage(): void {
    const text = this.newMessageText.trim();
    if (!text) {
      return;
    }
    const newMessage = {
      id: `local-${Date.now()}`,
      kind: 'text' as const,
      author: 'user' as const,
      authorName: 'You',
      roleLabel: 'Credit Officer',
      text
    };
    this.messages = [...this.messages, newMessage];
    const existing = this.messagesByQuery[this.selectedQueryId] ?? [];
    this.messagesByQuery[this.selectedQueryId] = [...existing, newMessage];
    this.newMessageText = '';
  }

  onCopyLogs(): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(this.serverLogsText).catch(() => {});
  }

  onNewCommunication(): void {
    this.selectedQueryId = 'server-downtime';
    this.newMessageText = '';
    const source = this.messagesByQuery[this.selectedQueryId];
    if (source) {
      this.messages = source.map(message => ({ ...message }));
    } else {
      this.messages = [];
    }
  }

  get filteredRecentQueries() {
    const term = this.querySearch.trim().toLowerCase();
    if (!term) {
      return this.recentQueries;
    }
    return this.recentQueries.filter(query => query.label.toLowerCase().includes(term));
  }
}
