import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  QueryItem,
  QueryMessage,
  QueryUser,
  getUsers,
  getQueriesForUser,
  getMessagesForQuery,
  getLoanApps,
  LoanApp,
  addResponse,
  closeQuery,
} from './query-data';

interface QueryWithExtras extends QueryItem {
  loanApp: LoanApp | undefined;
}

@Component({
  selector: 'app-loms-query-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './query-dashboard.page.html',
})
export class LomsQueryDashboardPageComponent {
  users: QueryUser[] = getUsers();
  currentUserId = 'alice';

  searchTerm = '';

  inbox: QueryWithExtras[] = [];

  selectedQuery: QueryWithExtras | null = null;
  selectedMessages: QueryMessage[] = [];
  drawerOpen = false;
  responseText = '';
  uploadedFiles: string[] = [];

  constructor(private router: Router) {
    this.refreshInbox();
  }

  get currentUser(): QueryUser | undefined {
    return this.users.find(u => u.id === this.currentUserId);
  }

  onUserChange(): void {
    this.refreshInbox();
    this.closeDrawer();
  }

  refreshInbox(): void {
    const list = getQueriesForUser(this.currentUserId);
    const apps = getLoanApps();
    this.inbox = list.map(q => ({
      ...q,
      loanApp: apps.find(a => a.id === q.loanAppId),
    }));
  }

  get filteredInbox(): QueryWithExtras[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.inbox;
    }
    return this.inbox.filter(q => {
      const parts = [
        q.id,
        q.title,
        q.loanApp?.appNo,
        q.loanApp?.customerName,
        q.loanApp?.product,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return parts.includes(term);
    });
  }

  get myOpenCount(): number {
    return this.inbox.filter(
      q => q.createdById === this.currentUserId && q.status === 'Open'
    ).length;
  }

  get waitingMyResponseCount(): number {
    return this.inbox.filter(
      q =>
        q.status === 'Open' &&
        q.recipientIds.includes(this.currentUserId) &&
        q.createdById !== this.currentUserId
    ).length;
  }

  get slaBreachedCount(): number {
    const now = new Date();
    return this.inbox.filter(q => new Date(q.dueAt) < now).length;
  }

  getPriorityBadgeClasses(priority: string): string {
    if (priority === 'High') {
      return 'bg-red-50 text-red-700';
    }
    if (priority === 'Medium') {
      return 'bg-amber-50 text-amber-700';
    }
    return 'bg-emerald-50 text-emerald-700';
  }

  openCreateQuery(): void {
    this.router.navigate(['/loms', 'query', 'create']);
  }

  openQuery(query: QueryWithExtras): void {
    this.selectedQuery = query;
    this.selectedMessages = getMessagesForQuery(query.id);
    this.drawerOpen = true;
    this.responseText = '';
  }

  get selectedRecipients(): QueryUser[] {
    if (!this.selectedQuery) {
      return [];
    }
    return this.users.filter(u =>
      this.selectedQuery ? this.selectedQuery.recipientIds.includes(u.id) : false
    );
  }

  closeSelectedQuery(): void {
    if (!this.selectedQuery) {
      return;
    }
    if (!this.selectedQuery.recipientIds.includes(this.currentUserId)) {
      return;
    }
    const updated = closeQuery(this.selectedQuery.id);
    if (updated) {
      this.selectedQuery = { ...this.selectedQuery, status: updated.status };
      this.refreshInbox();
    }
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.selectedQuery = null;
    this.selectedMessages = [];
    this.responseText = '';
    this.uploadedFiles = [];
  }

  onUploadDocument(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const files = Array.from(input.files);
    const names = files.map(f => f.name);
    this.uploadedFiles = [...this.uploadedFiles, ...names];
    input.value = '';
  }

  sendResponse(): void {
    if (!this.selectedQuery) {
      return;
    }
    const text = this.responseText.trim();
    if (!text) {
      return;
    }
    const message = addResponse(this.selectedQuery.id, this.currentUserId, text);
    if (message) {
      this.selectedMessages = [...this.selectedMessages, message];
      this.responseText = '';
      this.refreshInbox();
    }
  }
}
