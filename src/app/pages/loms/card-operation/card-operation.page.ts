import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type CardPriority = 'Normal' | 'Urgent';
type ReviewStatus = 'Pending' | 'Reviewed';
type EscalationStatus = 'Not Sent' | 'Sent to Maker';

interface CardApplication {
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
  assignedMaker: string;
  slaAgingHours: number;
  reviewedToday: boolean;
}

@Component({
  selector: 'app-loms-card-operation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './card-operation.page.html'
})
export class LomsCardOperationPageComponent {
  applications: CardApplication[] = [
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
      escalationStatus: 'Not Sent',
      assignedMaker: 'Unassigned',
      slaAgingHours: 2.5,
      reviewedToday: false
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
      escalationStatus: 'Not Sent',
      assignedMaker: 'Unassigned',
      slaAgingHours: 4.1,
      reviewedToday: false
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
      escalationStatus: 'Sent to Maker',
      assignedMaker: 'Kamal Rahman',
      slaAgingHours: 1.2,
      reviewedToday: true
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
      escalationStatus: 'Not Sent',
      assignedMaker: 'Unassigned',
      slaAgingHours: 5.8,
      reviewedToday: false
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
      escalationStatus: 'Not Sent',
      assignedMaker: 'Unassigned',
      slaAgingHours: 7.3,
      reviewedToday: false
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
      escalationStatus: 'Sent to Maker',
      assignedMaker: 'Fatima Khan',
      slaAgingHours: 2.1,
      reviewedToday: true
    }
  ];

  filteredApplications: CardApplication[] = [...this.applications];

  pageSize = 10;
  currentPage = 1;

  dateFrom = '';
  dateTo = '';
  cardTypeFilter = 'All';
  cardProductFilter = 'All';
  branchFilter = 'All';
  priorityFilter = 'All';
  reviewStatusFilter = 'All';
  escalationStatusFilter = 'All';

  applicationIdSearch = '';
  customerNameSearch = '';
  cifSearch = '';

  bulkAction = '';
  selectedMaker = '';

  makers = ['Kamal Rahman', 'Fatima Khan', 'Sakib Khan', 'Nusrat Jahan'];

  selectedIds = new Set<string>();

  showActionTooltip = false;
  actionTooltipMessage = '';
  actionTooltipStyle: 'hold' | 'escalateForward' | 'info' = 'info';

  constructor(private router: Router) {
    this.applyFilters();
  }

  get pendingReviewCount(): number {
    return this.applications.filter(a => a.reviewStatus === 'Pending').length;
  }

  get reviewedTodayCount(): number {
    return this.applications.filter(a => a.reviewedToday).length;
  }

  get escalatedToMakerCount(): number {
    return this.applications.filter(a => a.escalationStatus === 'Sent to Maker').length;
  }

  get urgentPriorityCount(): number {
    return this.applications.filter(a => a.priority === 'Urgent').length;
  }

  get averageTatHours(): number {
    if (!this.applications.length) {
      return 0;
    }
    const total = this.applications.reduce((sum, a) => sum + a.slaAgingHours, 0);
    return Math.round((total / this.applications.length) * 10) / 10;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredApplications.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedApplications(): CardApplication[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredApplications.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    if (!this.filteredApplications.length) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    if (!this.filteredApplications.length) {
      return 0;
    }
    return Math.min(this.filteredApplications.length, this.currentPage * this.pageSize);
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get isAllSelectedOnPage(): boolean {
    return this.pagedApplications.length > 0 && this.pagedApplications.every(a => this.selectedIds.has(a.id));
  }

  applyFilters(): void {
    const from = this.dateFrom ? new Date(this.dateFrom) : null;
    const to = this.dateTo ? new Date(this.dateTo) : null;
    this.filteredApplications = this.applications.filter(a => {
      if (from || to) {
        const date = new Date(a.applicationDate);
        if (from && date < from) {
          return false;
        }
        if (to && date > to) {
          return false;
        }
      }
      if (this.cardTypeFilter !== 'All' && a.cardType !== this.cardTypeFilter) {
        return false;
      }
      if (this.cardProductFilter !== 'All' && a.cardProduct !== this.cardProductFilter) {
        return false;
      }
      if (this.branchFilter !== 'All' && a.branch !== this.branchFilter) {
        return false;
      }
      if (this.priorityFilter !== 'All' && a.priority !== this.priorityFilter) {
        return false;
      }
      if (this.reviewStatusFilter !== 'All' && a.reviewStatus !== this.reviewStatusFilter) {
        return false;
      }
      if (this.escalationStatusFilter !== 'All' && a.escalationStatus !== this.escalationStatusFilter) {
        return false;
      }
      const idTerm = this.applicationIdSearch.trim().toLowerCase();
      if (idTerm && !a.id.toLowerCase().includes(idTerm)) {
        return false;
      }
      const customerTerm = this.customerNameSearch.trim().toLowerCase();
      if (customerTerm && !a.customerName.toLowerCase().includes(customerTerm)) {
        return false;
      }
      const cifTerm = this.cifSearch.trim().toLowerCase();
      if (cifTerm && !a.cif.toLowerCase().includes(cifTerm)) {
        return false;
      }
      return true;
    });
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.cardTypeFilter = 'All';
    this.cardProductFilter = 'All';
    this.branchFilter = 'All';
    this.priorityFilter = 'All';
    this.reviewStatusFilter = 'All';
    this.escalationStatusFilter = 'All';
    this.applicationIdSearch = '';
    this.customerNameSearch = '';
    this.cifSearch = '';
    this.applyFilters();
    this.selectedIds.clear();
  }

  toggleSelectAllOnPage(checked: boolean): void {
    if (!checked) {
      this.pagedApplications.forEach(a => this.selectedIds.delete(a.id));
      return;
    }
    this.pagedApplications.forEach(a => this.selectedIds.add(a.id));
  }

  toggleSelectOne(applicationId: string, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(applicationId);
    } else {
      this.selectedIds.delete(applicationId);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPriorityBadgeClasses(priority: CardPriority): string {
    if (priority === 'Urgent') {
      return 'bg-red-50 text-red-700';
    }
    return 'bg-emerald-50 text-emerald-700';
  }

  canExecuteAction(): boolean {
    if (!this.selectedCount || !this.bulkAction) {
      return false;
    }
    if (this.bulkAction === 'escalateForward' && !this.selectedMaker) {
      return false;
    }
    return true;
  }

  executeAction(): void {
    if (!this.canExecuteAction()) {
      return;
    }
    const ids = Array.from(this.selectedIds);
    const affectedCount = ids.length;
    this.applications = this.applications.map(a => {
      if (!ids.includes(a.id)) {
        return a;
      }
      if (this.bulkAction === 'hold') {
        return {
          ...a,
          reviewStatus: 'Reviewed',
          reviewedToday: true
        };
      }
      if (this.bulkAction === 'escalateForward') {
        return {
          ...a,
          escalationStatus: 'Sent to Maker',
          assignedMaker: this.selectedMaker || a.assignedMaker
        };
      }
      return a;
    });
    this.applyFilters();
    this.selectedIds.clear();
    if (this.bulkAction === 'hold') {
      this.actionTooltipMessage = `Bulk action successful. ${affectedCount} application(s) placed on hold.`;
      this.actionTooltipStyle = 'hold';
    } else if (this.bulkAction === 'escalateForward') {
      this.actionTooltipMessage = `Bulk action successful. ${affectedCount} application(s) escalated forward to ${this.selectedMaker}.`;
      this.actionTooltipStyle = 'escalateForward';
    } else {
      this.actionTooltipMessage = `Bulk action applied to ${affectedCount} application(s).`;
      this.actionTooltipStyle = 'info';
    }
    this.showActionTooltip = true;
    setTimeout(() => {
      this.showActionTooltip = false;
    }, 2500);
  }

  openDetails(application: CardApplication): void {
    this.router.navigate(
      ['/loms', 'card-operation', 'application', application.id],
      { state: { application } }
    );
  }
}
