import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../../styles/layout/loms-layout.component';
import { UiTableComponent } from '../../../../components/ui/ui-table.component';
import { UiModalComponent } from '../../../../components/ui/ui-modal.component';

type CpvStatus = 'Not Initiated' | 'In Progress' | 'Completed';

type LoanType = 'Personal Loan' | 'Home Loan' | 'Business Loan' | 'Auto Loan';

interface CpvApplicationRow {
  applicationId: string;
  applicantName: string;
  loanType: LoanType;
  requestedLoanAmount: string;
  cpvStatus: CpvStatus;
  statusLabel: 'CPV Initiation' | 'In Progress' | 'Completed';
  applicationDate: string;
  applicationStatus: string;
  originatingBranch: string;
  relationshipManager: string;
  nationalIdNumber: string;
  mobileNumber: string;
  presentAddress: string;
  productName: string;
  loanTenure: string;
}

@Component({
  selector: 'app-cpv-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, UiTableComponent, UiModalComponent],
  templateUrl: './cpv-dashboard.page.html'
})
export class CpvDashboardPageComponent {
  constructor(private router: Router) {}
  searchApplicationId = '';

  cpvStatusFilter: 'All Status' | CpvStatus = 'All Status';

  loanTypeFilter: 'All Types' | LoanType = 'All Types';

  readonly cpvStatusOptions: Array<'All Status' | CpvStatus> = [
    'All Status',
    'Not Initiated',
    'In Progress',
    'Completed'
  ];

  readonly loanTypeOptions: Array<'All Types' | LoanType> = [
    'All Types',
    'Personal Loan',
    'Home Loan',
    'Business Loan',
    'Auto Loan'
  ];

  readonly totalApplications = 24;

  readonly pageSize = 8;

  readonly applications: CpvApplicationRow[] = [
    {
      applicationId: 'LN-2024-001234',
      applicantName: 'Mohammad Rahman',
      loanType: 'Personal Loan',
      requestedLoanAmount: '৳ 5,00,000',
      cpvStatus: 'Not Initiated',
      statusLabel: 'CPV Initiation',
      applicationDate: '15 Jan 2024',
      applicationStatus: 'Under Review',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '1234567890123',
      mobileNumber: '+880 1712-345678',
      presentAddress: 'House 123, Road 15, Block B, Bashundhara R/A, Dhaka-1229',
      productName: 'Instant Personal Loan',
      loanTenure: '36 months'
    },
    {
      applicationId: 'LN-2024-001235',
      applicantName: 'Fatima Khatun',
      loanType: 'Home Loan',
      requestedLoanAmount: '৳ 25,00,000',
      cpvStatus: 'In Progress',
      statusLabel: 'In Progress',
      applicationDate: '16 Jan 2024',
      applicationStatus: 'In Progress',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '9876543210987',
      mobileNumber: '+880 1712-111222',
      presentAddress: 'House 45, Road 7, Dhanmondi, Dhaka-1209',
      productName: 'Home Loan',
      loanTenure: '180 months'
    },
    {
      applicationId: 'LN-2024-001236',
      applicantName: 'Abdul Karim',
      loanType: 'Business Loan',
      requestedLoanAmount: '৳ 15,00,000',
      cpvStatus: 'Completed',
      statusLabel: 'Completed',
      applicationDate: '12 Jan 2024',
      applicationStatus: 'Completed',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '1234509876123',
      mobileNumber: '+880 1712-333444',
      presentAddress: 'Sector 10, Uttara, Dhaka-1230',
      productName: 'SME Business Loan',
      loanTenure: '60 months'
    },
    {
      applicationId: 'LN-2024-001237',
      applicantName: 'Nasir Ahmed',
      loanType: 'Auto Loan',
      requestedLoanAmount: '৳ 8,00,000',
      cpvStatus: 'Not Initiated',
      statusLabel: 'CPV Initiation',
      applicationDate: '14 Jan 2024',
      applicationStatus: 'Not Initiated',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '4567890123456',
      mobileNumber: '+880 1712-555666',
      presentAddress: 'Mirpur DOHS, Dhaka-1216',
      productName: 'Auto Loan',
      loanTenure: '48 months'
    },
    {
      applicationId: 'LN-2024-001238',
      applicantName: 'Rashida Begum',
      loanType: 'Personal Loan',
      requestedLoanAmount: '৳ 3,00,000',
      cpvStatus: 'In Progress',
      statusLabel: 'In Progress',
      applicationDate: '13 Jan 2024',
      applicationStatus: 'In Progress',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '5678901234567',
      mobileNumber: '+880 1712-777888',
      presentAddress: 'Mohakhali DOHS, Dhaka-1212',
      productName: 'Instant Personal Loan',
      loanTenure: '24 months'
    },
    {
      applicationId: 'LN-2024-001239',
      applicantName: 'Kamal Hossain',
      loanType: 'Home Loan',
      requestedLoanAmount: '৳ 20,00,000',
      cpvStatus: 'Not Initiated',
      statusLabel: 'CPV Initiation',
      applicationDate: '11 Jan 2024',
      applicationStatus: 'Not Initiated',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '6789012345678',
      mobileNumber: '+880 1712-999000',
      presentAddress: 'Banani, Dhaka-1213',
      productName: 'Home Loan',
      loanTenure: '180 months'
    },
    {
      applicationId: 'LN-2024-001240',
      applicantName: 'Salma Akter',
      loanType: 'Business Loan',
      requestedLoanAmount: '৳ 12,00,000',
      cpvStatus: 'Completed',
      statusLabel: 'Completed',
      applicationDate: '10 Jan 2024',
      applicationStatus: 'Completed',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '7890123456789',
      mobileNumber: '+880 1712-222333',
      presentAddress: 'Baridhara DOHS, Dhaka-1212',
      productName: 'SME Business Loan',
      loanTenure: '72 months'
    },
    {
      applicationId: 'LN-2024-001241',
      applicantName: 'Mizanur Rahman',
      loanType: 'Auto Loan',
      requestedLoanAmount: '৳ 6,50,000',
      cpvStatus: 'In Progress',
      statusLabel: 'In Progress',
      applicationDate: '09 Jan 2024',
      applicationStatus: 'In Progress',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      nationalIdNumber: '8901234567890',
      mobileNumber: '+880 1712-444555',
      presentAddress: 'Bashabo, Dhaka-1214',
      productName: 'Auto Loan',
      loanTenure: '36 months'
    }
  ];

  filteredApplications: CpvApplicationRow[] = [...this.applications];

  selectedApplication: CpvApplicationRow | null = null;

  showApplicationModal = false;

  applyFilters(): void {
    const term = this.searchApplicationId.trim().toLowerCase();

    this.filteredApplications = this.applications.filter((row) => {
      const matchesId = term
        ? row.applicationId.toLowerCase().includes(term)
        : true;

      const matchesStatus =
        this.cpvStatusFilter === 'All Status'
          ? true
          : row.cpvStatus === this.cpvStatusFilter;

      const matchesLoanType =
        this.loanTypeFilter === 'All Types'
          ? true
          : row.loanType === this.loanTypeFilter;

      return matchesId && matchesStatus && matchesLoanType;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  get displayedApplications(): CpvApplicationRow[] {
    return this.filteredApplications.slice(0, this.pageSize);
  }

  get showingFrom(): number {
    return this.filteredApplications.length === 0 ? 0 : 1;
  }

  get showingTo(): number {
    if (this.filteredApplications.length === 0) {
      return 0;
    }
    return Math.min(this.filteredApplications.length, this.pageSize);
  }

  cpvStatusClasses(status: CpvStatus): string[] {
    switch (status) {
      case 'Not Initiated':
        return ['bg-rose-50', 'text-rose-700'];
      case 'In Progress':
        return ['bg-amber-50', 'text-amber-700'];
      case 'Completed':
        return ['bg-emerald-50', 'text-emerald-700'];
      default:
        return ['bg-slate-100', 'text-slate-700'];
    }
  }

  getStatusButtonClasses(statusLabel: CpvApplicationRow['statusLabel']): string[] {
    switch (statusLabel) {
      case 'CPV Initiation':
        return [
          'bg-blue-600',
          'text-white',
          'border',
          'border-blue-600',
          'hover:bg-blue-700'
        ];
      case 'In Progress':
        return [
          'bg-slate-100',
          'text-slate-700',
          'border',
          'border-slate-200'
        ];
      case 'Completed':
        return [
          'bg-slate-200',
          'text-slate-800',
          'border',
          'border-slate-200'
        ];
      default:
        return [
          'bg-slate-100',
          'text-slate-700',
          'border',
          'border-slate-200'
        ];
    }
  }

  openApplicationDetails(row: CpvApplicationRow): void {
    this.selectedApplication = row;
    this.showApplicationModal = true;
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
    this.selectedApplication = null;
  }

  navigateToCpvInitiation(row: CpvApplicationRow): void {
    if (row.statusLabel !== 'CPV Initiation') {
      return;
    }

    this.router.navigate(['/loms', 'cpv', 'initiation-assign'], {
      queryParams: {
        applicationId: row.applicationId
      }
    });
  }
}
