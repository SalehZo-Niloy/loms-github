import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type FilterKey =
  | 'all'
  | 'applicationId'
  | 'customer'
  | 'product'
  | 'branch'
  | 'status';

type StatusKey =
  | 'assigned'
  | 'pending'
  | 'inProgress'
  | 'query'
  | 'overdue'
  | 'completed';

interface VettingCase {
  id: string;
  customer: string;
  product: string;
  branch: string;
  status: string;
  statusKey: StatusKey;
  assignedTo: string;
  valuationStage: string;
  receivedDate: string;
  dueDate: string;
  completedDate?: string;
  assignedToMe: boolean;
  overdue: boolean;
}

@Component({
  selector: 'app-loms-vetting-valuation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LomsLayoutComponent],
  templateUrl: './vetting-valuation.page.html'
})
export class LomsVettingValuationPageComponent {
  filterOptions = [
    { label: 'Select Filter Type', value: 'all' as FilterKey },
    { label: 'Application ID', value: 'applicationId' as FilterKey },
    { label: 'Customer Name', value: 'customer' as FilterKey },
    { label: 'Product', value: 'product' as FilterKey },
    { label: 'Branch', value: 'branch' as FilterKey },
    { label: 'Status', value: 'status' as FilterKey }
  ];

  selectedFilter: FilterKey = 'all';
  searchTerm = '';

  cases: VettingCase[] = [
    {
      id: 'LN-2026-02-2201',
      customer: 'Md. Karim Rahman',
      product: 'Home Loan',
      branch: 'Gulshan',
      status: 'Assigned',
      statusKey: 'assigned',
      assignedTo: 'Rafiq Ahmed',
      valuationStage: 'Vetting',
      receivedDate: '2026-02-01',
      dueDate: '2026-02-06',
      assignedToMe: true,
      overdue: false
    },
    {
      id: 'LN-2026-02-2202',
      customer: 'Fatima Begum',
      product: 'Personal Loan',
      branch: 'Banani',
      status: 'Pending',
      statusKey: 'pending',
      assignedTo: 'Team Queue',
      valuationStage: 'Vetting',
      receivedDate: '2026-02-02',
      dueDate: '2026-02-07',
      assignedToMe: false,
      overdue: false
    },
    {
      id: 'LN-2026-02-2203',
      customer: 'Nasir Uddin',
      product: 'Business Loan',
      branch: 'Dhanmondi',
      status: 'In Progress',
      statusKey: 'inProgress',
      assignedTo: 'Rafiq Ahmed',
      valuationStage: 'Valuation',
      receivedDate: '2026-01-31',
      dueDate: '2026-02-05',
      assignedToMe: true,
      overdue: false
    },
    {
      id: 'LN-2026-02-2204',
      customer: 'Shahana Akter',
      product: 'Home Loan',
      branch: 'Gulshan',
      status: 'Query Raised',
      statusKey: 'query',
      assignedTo: 'Team Queue',
      valuationStage: 'Vetting',
      receivedDate: '2026-01-29',
      dueDate: '2026-02-03',
      assignedToMe: false,
      overdue: true
    },
    {
      id: 'LN-2026-02-2205',
      customer: 'Abdul Jabbar',
      product: 'Auto Loan',
      branch: 'Motijheel',
      status: 'Pending',
      statusKey: 'pending',
      assignedTo: 'Team Queue',
      valuationStage: 'Valuation',
      receivedDate: '2026-02-03',
      dueDate: '2026-02-08',
      assignedToMe: false,
      overdue: false
    },
    {
      id: 'LN-2026-02-2206',
      customer: 'Rahima Khatun',
      product: 'Personal Loan',
      branch: 'Banani',
      status: 'Completed',
      statusKey: 'completed',
      assignedTo: 'Rafiq Ahmed',
      valuationStage: 'Valuation',
      receivedDate: '2026-01-27',
      dueDate: '2026-02-01',
      completedDate: '2026-02-08',
      assignedToMe: true,
      overdue: false
    },
    {
      id: 'LN-2026-02-2207',
      customer: 'Mizanur Rahman',
      product: 'Business Loan',
      branch: 'Dhanmondi',
      status: 'Assigned',
      statusKey: 'assigned',
      assignedTo: 'Rafiq Ahmed',
      valuationStage: 'Vetting',
      receivedDate: '2026-02-04',
      dueDate: '2026-02-09',
      assignedToMe: true,
      overdue: false
    },
    {
      id: 'LN-2026-02-2208',
      customer: 'Salma Begum',
      product: 'Home Loan',
      branch: 'Gulshan',
      status: 'Pending',
      statusKey: 'pending',
      assignedTo: 'Team Queue',
      valuationStage: 'Vetting',
      receivedDate: '2026-02-05',
      dueDate: '2026-02-10',
      assignedToMe: false,
      overdue: false
    },
    {
      id: 'LN-2026-02-2209',
      customer: 'Kazi Morshed',
      product: 'Home Loan',
      branch: 'Uttara',
      status: 'Overdue',
      statusKey: 'overdue',
      assignedTo: 'Team Queue',
      valuationStage: 'Valuation',
      receivedDate: '2026-01-28',
      dueDate: '2026-02-02',
      assignedToMe: false,
      overdue: true
    },
    {
      id: 'LN-2026-02-2210',
      customer: 'Rupali Jahan',
      product: 'Personal Loan',
      branch: 'Mirpur',
      status: 'Completed',
      statusKey: 'completed',
      assignedTo: 'Rafiq Ahmed',
      valuationStage: 'Vetting',
      receivedDate: '2026-01-26',
      dueDate: '2026-01-31',
      completedDate: '2026-02-08',
      assignedToMe: true,
      overdue: false
    }
  ];

  filteredCases: VettingCase[] = [...this.cases];
  selectedCaseIds = new Set<string>();
  activeCase: VettingCase | null = null;

  pageSize = 8;
  currentPage = 1;

  constructor(private router: Router) {}

  get totalPending(): number {
    return this.cases.length;
  }

  get vettingPending(): number {
    return this.cases.filter(c => c.valuationStage === 'Vetting').length;
  }

  get valuationPending(): number {
    return this.cases.filter(c => c.valuationStage === 'Valuation').length;
  }

  get assignedToMe(): number {
    return this.cases.filter(c => c.assignedToMe).length;
  }

  get overdueCount(): number {
    return this.cases.filter(c => c.overdue).length;
  }

  get completedToday(): number {
    return this.cases.filter(c => c.statusKey === 'completed' && this.isToday(c.completedDate)).length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCases.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedCases(): VettingCase[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCases.slice(start, start + this.pageSize);
  }

  get isAllSelectedOnPage(): boolean {
    return this.pagedCases.length > 0 && this.pagedCases.every(c => this.selectedCaseIds.has(c.id));
  }

  get selectedCount(): number {
    return this.selectedCaseIds.size;
  }

  get rangeStart(): number {
    if (!this.filteredCases.length) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredCases.length);
  }

  searchCases(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCases = this.cases.filter(c => this.matchCase(c, term));
    this.currentPage = 1;
    this.syncSelection();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.filteredCases = [...this.cases];
    this.currentPage = 1;
    this.syncSelection();
  }

  matchCase(c: VettingCase, term: string): boolean {
    if (!term) {
      return true;
    }

    const valueMap: Record<FilterKey, string> = {
      all: `${c.id} ${c.customer} ${c.product} ${c.branch} ${c.status}`,
      applicationId: c.id,
      customer: c.customer,
      product: c.product,
      branch: c.branch,
      status: c.status
    };

    const value = valueMap[this.selectedFilter] ?? valueMap.all;
    return value.toLowerCase().includes(term);
  }

  toggleSelectAll(): void {
    if (this.isAllSelectedOnPage) {
      this.pagedCases.forEach(c => this.selectedCaseIds.delete(c.id));
    } else {
      this.pagedCases.forEach(c => this.selectedCaseIds.add(c.id));
    }
  }

  toggleCaseSelection(id: string): void {
    if (this.selectedCaseIds.has(id)) {
      this.selectedCaseIds.delete(id);
    } else {
      this.selectedCaseIds.add(id);
    }
  }

  previewCase(c: VettingCase): void {
    this.activeCase = c;
  }

  openCase(c: VettingCase): void {
    this.router.navigate(['/loms', 'vetting-valuation', 'asset-details']);
  }

  clearPreview(): void {
    this.activeCase = null;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  statusClass(statusKey: StatusKey): string {
    switch (statusKey) {
      case 'assigned':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'inProgress':
        return 'bg-violet-50 text-violet-700';
      case 'query':
        return 'bg-rose-50 text-rose-700';
      case 'overdue':
        return 'bg-red-50 text-red-700';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  private syncSelection(): void {
    const validIds = new Set(this.filteredCases.map(c => c.id));
    Array.from(this.selectedCaseIds).forEach(id => {
      if (!validIds.has(id)) {
        this.selectedCaseIds.delete(id);
      }
    });
    if (this.activeCase && !validIds.has(this.activeCase.id)) {
      this.activeCase = null;
    }
  }

  private isToday(dateString?: string): boolean {
    if (!dateString) {
      return false;
    }
    const today = new Date();
    const d = new Date(dateString);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }
}
