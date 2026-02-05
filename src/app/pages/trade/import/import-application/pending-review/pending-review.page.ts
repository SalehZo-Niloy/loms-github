import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

type ReviewStatus = 'Pending Review' | 'Approved' | 'Rejected';

interface PendingRequestRow {
  reference: string;
  submittedOn: string;
  customer: string;
  lcType: string;
  amount: string;
  currency: string;
  beneficiary: string;
  roName: string;
  status: ReviewStatus;
}

@Component({
  selector: 'app-import-pending-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './pending-review.page.html',
})
export class ImportPendingReviewPageComponent {
  user = {
    name: 'John Matthews',
    role: 'Trade In-Charge',
    initials: 'JM',
  };

  filters = {
    reference: '',
    customer: '',
    status: 'All',
    lcType: 'All',
    currency: 'All',
    roName: 'All',
    minAmount: '',
    maxAmount: '',
    fromDate: '',
    toDate: '',
  };

  advancedFiltersOpen = true;

  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  requests: PendingRequestRow[] = [
    {
      reference: 'LC-2024-001',
      submittedOn: '2024-01-13',
      customer: 'Acme Corp Ltd.',
      lcType: 'Sight LC',
      amount: '125,000',
      currency: 'USD',
      beneficiary: 'Global Exports Inc.',
      roName: 'Sarah Johnson',
      status: 'Pending Review',
    },
    {
      reference: 'LC-2024-002',
      submittedOn: '2024-01-13',
      customer: 'TechFlow Solutions',
      lcType: 'Usance LC',
      amount: '89,500',
      currency: 'EUR',
      beneficiary: 'Euro Manufacturing',
      roName: 'Michael Chen',
      status: 'Pending Review',
    },
    {
      reference: 'LC-2024-003',
      submittedOn: '2024-01-12',
      customer: 'Industrial Partners',
      lcType: 'Sight LC',
      amount: '245,000',
      currency: 'USD',
      beneficiary: 'Asian Suppliers Ltd.',
      roName: 'Emily Davis',
      status: 'Approved',
    },
    {
      reference: 'LC-2024-004',
      submittedOn: '2024-01-12',
      customer: 'MegaTrade Corp',
      lcType: 'Usance LC',
      amount: '156,750',
      currency: 'GBP',
      beneficiary: 'UK Distributors',
      roName: 'Sarah Johnson',
      status: 'Rejected',
    },
  ];

  stats = [
    { label: 'Total Pending', value: 23, icon: 'clock', accent: 'text-amber-600' },
    { label: 'Approved Today', value: 8, icon: 'check', accent: 'text-emerald-600' },
    { label: 'Rejected Today', value: 2, icon: 'x', accent: 'text-rose-600' },
    { label: 'Total Value', value: '$2.4M', icon: 'cash', accent: 'text-blue-600' },
  ];

  constructor(private router: Router) {}

  get filteredRequests(): PendingRequestRow[] {
    const reference = this.filters.reference.trim().toLowerCase();
    const customer = this.filters.customer.trim().toLowerCase();
    const status = this.filters.status;
    const lcType = this.filters.lcType;
    const currency = this.filters.currency;
    const roName = this.filters.roName;
    const fromDate = this.filters.fromDate;
    const toDate = this.filters.toDate;
    const minAmount = this.filters.minAmount ? Number(this.filters.minAmount) : null;
    const maxAmount = this.filters.maxAmount ? Number(this.filters.maxAmount) : null;

    return this.requests.filter((request) => {
      const matchesReference = !reference || request.reference.toLowerCase().includes(reference);
      const matchesCustomer = !customer || request.customer.toLowerCase().includes(customer);
      const matchesStatus = status === 'All' || request.status === status;
      const matchesType = lcType === 'All' || request.lcType === lcType;
      const matchesCurrency = currency === 'All' || request.currency === currency;
      const matchesRo = roName === 'All' || request.roName === roName;
      const matchesDate =
        (!fromDate || request.submittedOn >= fromDate) &&
        (!toDate || request.submittedOn <= toDate);

      const amountValue = Number(request.amount.replace(/,/g, ''));
      const matchesAmount =
        (minAmount === null || amountValue >= minAmount) &&
        (maxAmount === null || amountValue <= maxAmount);

      return (
        matchesReference &&
        matchesCustomer &&
        matchesStatus &&
        matchesType &&
        matchesCurrency &&
        matchesRo &&
        matchesDate &&
        matchesAmount
      );
    });
  }

  get totalResults(): number {
    return this.filteredRequests.length;
  }

  get pagedRequests(): PendingRequestRow[] {
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
      lcType: 'All',
      currency: 'All',
      roName: 'All',
      minAmount: '',
      maxAmount: '',
      fromDate: '',
      toDate: '',
    };
    this.currentPage = 1;
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  statusClasses(status: ReviewStatus): string[] {
    switch (status) {
      case 'Approved':
        return ['bg-emerald-100', 'text-emerald-700'];
      case 'Rejected':
        return ['bg-rose-100', 'text-rose-700'];
      default:
        return ['bg-amber-100', 'text-amber-700'];
    }
  }

  async viewSummary(reference: string): Promise<void> {
    try {
      const success = await this.router.navigate(['/trade/import/pending-review/view', reference]);
      if (!success) {
        console.error('Navigation to pending review view failed for reference', reference);
      }
    } catch (error) {
      console.error('Error during navigation to pending review view', reference, error);
    }
  }

  trackByReference(_: number, request: PendingRequestRow): string {
    return request.reference;
  }
}
