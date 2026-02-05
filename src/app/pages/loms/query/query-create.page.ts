import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  QueryCategory,
  QueryPriority,
  QueryUser,
  LoanApp,
  createQuery,
  getLoanApps,
  getUsers,
} from './query-data';

@Component({
  selector: 'app-loms-query-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './query-create.page.html',
})
export class LomsQueryCreatePageComponent {
  currentUserId = 'alice';

  loanApps: LoanApp[] = getLoanApps();
  users: QueryUser[] = getUsers();

  categories: QueryCategory[] = ['KYC', 'Income', 'Operational', 'Other'];
  priorities: QueryPriority[] = ['Low', 'Medium', 'High'];

  selectedLoanId = '';
  title = '';
  selectedCategory: QueryCategory = 'KYC';
  selectedPriority: QueryPriority = 'Low';
  selectedRecipientIds: string[] = [];
  initialMessage = '';
  slaHours = 48;

  constructor(private router: Router) {}

  get availableRecipients(): QueryUser[] {
    return this.users.filter(u => u.id !== this.currentUserId);
  }

  toggleRecipient(id: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedRecipientIds.includes(id)) {
        this.selectedRecipientIds = [...this.selectedRecipientIds, id];
      }
    } else {
      this.selectedRecipientIds = this.selectedRecipientIds.filter(r => r !== id);
    }
  }

  sendQuery(): void {
    if (!this.selectedLoanId || !this.title.trim() || !this.initialMessage.trim()) {
      return;
    }
    if (this.selectedRecipientIds.length === 0) {
      return;
    }
    createQuery({
      title: this.title.trim(),
      category: this.selectedCategory,
      priority: this.selectedPriority,
      loanAppId: this.selectedLoanId,
      createdById: this.currentUserId,
      recipientIds: this.selectedRecipientIds,
      initialMessage: this.initialMessage.trim(),
      slaHours: this.slaHours,
    });

    this.router.navigate(['/loms', 'query']);
  }

  cancel(): void {
    this.router.navigate(['/loms', 'query']);
  }
}

