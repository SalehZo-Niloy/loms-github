import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

type LcStatus = 'Pending Validation' | 'Forwarded to Trade' | 'Initiated';

interface LcRequestRow {
  reference: string;
  date: string;
  customer: string;
  type: string;
  amount: string;
  beneficiary: string;
  status: LcStatus;
  assignedTo: string;
}

@Component({
  selector: 'app-import-document-handover-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './document-handover.page.html',
})
export class ImportDocumentHandoverPageComponent {
  user = {
    name: 'John Smith (RO)',
    initials: 'JS',
  };

  filters = {
    reference: '',
    customer: '',
    status: 'All',
    dateFrom: '',
    dateTo: '',
  };

  advancedFiltersOpen = false;

  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  requests: LcRequestRow[] = [
    {
      reference: 'LC-2024-001',
      date: '2024-01-12',
      customer: 'ABC Trading Ltd',
      type: 'Sight',
      amount: '$150,000',
      beneficiary: 'XYZ Exports Inc',
      status: 'Pending Validation',
      assignedTo: 'John Smith',
    },
    {
      reference: 'LC-2024-002',
      date: '2024-01-11',
      customer: 'Global Industries',
      type: 'Usance',
      amount: '€85,000',
      beneficiary: 'European Suppliers',
      status: 'Forwarded to Trade',
      assignedTo: 'Sarah Johnson',
    },
    {
      reference: 'LC-2024-003',
      date: '2024-01-10',
      customer: 'Tech Solutions Corp',
      type: 'Sight',
      amount: '$75,500',
      beneficiary: 'Asia Manufacturing',
      status: 'Initiated',
      assignedTo: 'Mike Chen',
    },
    {
      reference: 'LC-2024-004',
      date: '2024-01-09',
      customer: 'Retail Chain Ltd',
      type: 'Usance',
      amount: '£120,000',
      beneficiary: 'UK Distributors',
      status: 'Pending Validation',
      assignedTo: 'Emma Davis',
    },
  ];

  constructor(private router: Router) {}

  get stats() {
    return [
      {
        label: 'Total Requests',
        value: this.requests.length,
        valueClass: 'text-slate-900',
      },
      {
        label: 'Pending Action',
        value: this.countByStatus('Pending Validation'),
        valueClass: 'text-amber-600',
      },
      {
        label: 'Forwarded',
        value: this.countByStatus('Forwarded to Trade'),
        valueClass: 'text-emerald-600',
      },
      {
        label: 'Recently Initiated',
        value: this.countByStatus('Initiated'),
        valueClass: 'text-blue-600',
      },
    ];
  }

  get filteredRequests(): LcRequestRow[] {
    const reference = this.filters.reference.trim().toLowerCase();
    const customer = this.filters.customer.trim().toLowerCase();
    const status = this.filters.status;
    const dateFrom = this.filters.dateFrom;
    const dateTo = this.filters.dateTo;

    return this.requests.filter((request) => {
      const matchesReference = !reference || request.reference.toLowerCase().includes(reference);
      const matchesCustomer = !customer || request.customer.toLowerCase().includes(customer);
      const matchesStatus = status === 'All' || request.status === status;
      const matchesDate =
        (!dateFrom || request.date >= dateFrom) && (!dateTo || request.date <= dateTo);

      return matchesReference && matchesCustomer && matchesStatus && matchesDate;
    });
  }

  get totalResults(): number {
    return this.filteredRequests.length;
  }

  get pagedRequests(): LcRequestRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRequests.slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    if (!this.totalResults) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pagedRequests.length - 1, this.totalResults);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  toggleAdvancedFilters() {
    this.advancedFiltersOpen = !this.advancedFiltersOpen;
  }

  applyFilters() {
    this.currentPage = 1;
  }

  clearFilters() {
    this.filters = {
      reference: '',
      customer: '',
      status: 'All',
      dateFrom: '',
      dateTo: '',
    };
    this.currentPage = 1;
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  countByStatus(status: LcStatus): number {
    return this.requests.filter((request) => request.status === status).length;
  }

  statusClasses(status: LcStatus): string[] {
    switch (status) {
      case 'Pending Validation':
        return ['bg-amber-100', 'text-amber-700'];
      case 'Forwarded to Trade':
        return ['bg-emerald-100', 'text-emerald-700'];
      default:
        return ['bg-blue-100', 'text-blue-700'];
    }
  }

  async viewRequest(reference: string): Promise<void> {
    try {
      const success = await this.router.navigate(['/trade/import/document-handover/view', reference]);
      if (!success) {
        console.error('Navigation to document handover view failed for reference', reference);
      }
    } catch (error) {
      console.error('Error during navigation to document handover view', reference, error);
    }
  }

  trackByReference(_: number, request: LcRequestRow): string {
    return request.reference;
  }
}
