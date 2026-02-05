import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

type ImportLcStatus =
  | 'LC Initiated'
  | 'Bank Review'
  | 'Application Entry'
  | 'LC Draft Prepared'
  | 'LC Approved'
  | 'LC Issuance'
  | 'Issued'
  | 'Under Review'
  | 'Discrepancy'
  | 'Draft';

interface ImportLcListRow {
  reference: string;
  submissionDate: string;
  lcType: string;
  amount: string;
  currency: string;
  beneficiaryName: string;
  portOfDischarge: string;
  status: ImportLcStatus;
}

@Component({
  selector: 'app-import-submitting-view-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './submitting.page.view.html',
})
export class ImportSubmittingViewPageComponent implements OnInit {
  filters = {
    reference: '',
    beneficiaryName: '',
    status: 'All',
  };

  advancedFiltersOpen = false;

  requests: ImportLcListRow[] = [
    {
      reference: 'LC2024001',
      submissionDate: '15 Jan 2024',
      lcType: 'Sight',
      amount: '$250,000',
      currency: 'USD',
      beneficiaryName: 'Global Exports Ltd',
      portOfDischarge: 'Port of Hamburg',
      status: 'Issued',
    },
    {
      reference: 'LC2024002',
      submissionDate: '12 Jan 2024',
      lcType: 'Usance',
      amount: '€180,000',
      currency: 'EUR',
      beneficiaryName: 'European Trading Co',
      portOfDischarge: 'Port of Rotterdam',
      status: 'Bank Review',
    },
    {
      reference: 'LC2024003',
      submissionDate: '08 Jan 2024',
      lcType: 'Sight',
      amount: '$95,000',
      currency: 'USD',
      beneficiaryName: 'Asian Suppliers Inc',
      portOfDischarge: 'Port of Singapore',
      status: 'Discrepancy',
    },
    {
      reference: 'DRAFT0001',
      submissionDate: '05 Jan 2024',
      lcType: 'Usance',
      amount: '£75,000',
      currency: 'GBP',
      beneficiaryName: 'UK Manufacturing Ltd',
      portOfDischarge: 'Port of London',
      status: 'Draft',
    },
  ];

  pageSizeOptions = [4, 8, 12];
  pageSize = 4;
  currentPage = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = window.localStorage.getItem('importLcRequests');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.requests = parsed.map((item: any) => ({
            reference: item.reference,
            submissionDate: item.submissionDate,
            lcType: item.lcType,
            amount: item.amount,
            currency: item.currency,
            beneficiaryName: item.beneficiaryName,
            portOfDischarge: item.portOfDischarge,
            status: item.status,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load import LC requests', error);
    }
  }

  get filteredRequests(): ImportLcListRow[] {
    const reference = this.filters.reference.trim().toLowerCase();
    const beneficiaryName = this.filters.beneficiaryName.trim().toLowerCase();
    const status = this.filters.status;

    return this.requests.filter((request) => {
      const matchesReference =
        !reference || request.reference.toLowerCase().includes(reference);
      const matchesBeneficiary =
        !beneficiaryName ||
        request.beneficiaryName.toLowerCase().includes(beneficiaryName);
      const matchesStatus = status === 'All' || request.status === status;

      return matchesReference && matchesBeneficiary && matchesStatus;
    });
  }

  get totalResults(): number {
    return this.filteredRequests.length;
  }

  get pagedRequests(): ImportLcListRow[] {
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

  toggleAdvancedFilters(): void {
    this.advancedFiltersOpen = !this.advancedFiltersOpen;
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.filters = {
      reference: '',
      beneficiaryName: '',
      status: 'All',
    };
    this.currentPage = 1;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  statusClasses(status: ImportLcStatus): string[] {
    switch (status) {
      case 'LC Initiated':
        return ['bg-emerald-50', 'text-emerald-700'];
      case 'Bank Review':
      case 'Application Entry':
      case 'LC Draft Prepared':
      case 'LC Approved':
      case 'LC Issuance':
      case 'Issued':
        return ['bg-emerald-100', 'text-emerald-700'];
      case 'Under Review':
        return ['bg-amber-100', 'text-amber-700'];
      case 'Discrepancy':
        return ['bg-rose-100', 'text-rose-700'];
      case 'Draft':
      default:
        return ['bg-slate-100', 'text-slate-700'];
    }
  }

  onCreateNewRequest(): void {
    this.router.navigate(['/trade', 'import', 'submitting', 'create']);
  }

  async viewRequest(reference: string): Promise<void> {
    try {
      const success = await this.router.navigate(['/trade', 'import', 'customer-view'], {
        queryParams: { reference },
      });

      if (!success) {
        console.error('Navigation to import customer view failed for reference', reference);
      }
    } catch (error) {
      console.error('Error during navigation to import customer view', reference, error);
    }
  }
}
