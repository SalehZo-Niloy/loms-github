import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LomsLayoutComponent } from '../../../../styles/layout/loms-layout.component';
import { UiModalComponent } from '../../../../components/ui/ui-modal.component';

interface CpvRequestRow {
  id: string;
  cpvType: string;
  persona: string;
  action: 'Forward' | 'Hold' | '';
  forwardTo: string;
  status: 'Pending' | 'Forwarded' | 'On Hold';
  selected: boolean;
}

@Component({
  selector: 'app-cpv-initiation-assign-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, UiModalComponent],
  templateUrl: './cpv-initiation-assign.page.html'
})
export class CpvInitiationAssignPageComponent implements OnInit {
  applicationId = 'LN-2024-001234';
  requestedLoanAmount = '৳ 5,00,000';
  productType = 'Personal Loan';

  bulkAction: 'Forward' | 'Hold' | 'None' = 'None';
  bulkForwardTo = '';

  cpvRows: CpvRequestRow[] = [
    {
      id: 'applicant-contact',
      cpvType: 'Contact Number Verification (Applicant)',
      persona: 'Applicant',
      action: '',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'guarantor-contact',
      cpvType: 'Contact Number Verification (Guarantor)',
      persona: 'Guarantor',
      action: '',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'nominee-contact',
      cpvType: 'Contact Number Verification (Nominee)',
      persona: 'Nominee',
      action: '',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'address-verification',
      cpvType: 'Address Verification',
      persona: 'Applicant',
      action: '',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'profession-verification',
      cpvType: 'Profession Verification',
      persona: 'Applicant',
      action: '',
      forwardTo: '',
      status: 'Pending',
      selected: false
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('applicationId');
      if (id) {
        this.applicationId = id;
      }
    });
  }

  get anyRowSelected(): boolean {
    return this.cpvRows.some((row) => row.selected);
  }

  get isBulkForwardDisabled(): boolean {
    if (!this.anyRowSelected) {
      return true;
    }
    return this.bulkAction !== 'Forward';
  }

  get isBulkApplyDisabled(): boolean {
    if (!this.anyRowSelected) {
      return true;
    }
    if (this.bulkAction === 'Forward') {
      return !this.bulkForwardTo;
    }
    if (this.bulkAction === 'Hold') {
      return false;
    }
    return true;
  }

  toggleAll(selected: boolean): void {
    this.cpvRows = this.cpvRows.map((row) => ({
      ...row,
      selected
    }));
  }

  applyBulk(): void {
    this.cpvRows = this.cpvRows.map((row) => {
      if (!row.selected) {
        return row;
      }

      const updated: CpvRequestRow = { ...row };

      if (this.bulkAction === 'Forward') {
        updated.action = 'Forward';
        updated.status = updated.forwardTo ? 'Forwarded' : 'Pending';
      } else if (this.bulkAction === 'Hold') {
        updated.action = 'Hold';
        updated.status = 'On Hold';
      }

      if (this.bulkForwardTo) {
        updated.forwardTo = this.bulkForwardTo;
        if (this.bulkAction === 'Forward') {
          updated.status = 'Forwarded';
        }
      }

      return updated;
    });
  }

  onRowActionChange(row: CpvRequestRow): void {
    if (row.action === 'Forward') {
      row.status = row.forwardTo ? 'Forwarded' : 'Pending';
    } else if (row.action === 'Hold') {
      row.status = 'On Hold';
      row.forwardTo = '';
    } else {
      row.status = 'Pending';
      row.forwardTo = '';
    }
  }

  onRowForwardToChange(row: CpvRequestRow): void {
    if (row.action === 'Forward') {
      row.status = row.forwardTo ? 'Forwarded' : 'Pending';
    }
  }

  isRowForwardDisabled(row: CpvRequestRow): boolean {
    return row.action !== 'Forward';
  }

  getStatusBadgeClasses(status: CpvRequestRow['status']): string {
    if (status === 'Forwarded') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (status === 'On Hold') {
      return 'bg-amber-50 text-amber-700';
    }
    return 'bg-slate-100 text-slate-700';
  }

  showApplicationDetails = false;

  get applicationDetails() {
    return {
      applicationId: this.applicationId,
      applicationDate: '15 Jan 2024',
      applicationStatus: 'Under Review',
      originatingBranch: 'Gulshan Corporate',
      relationshipManager: 'Rafiqul Islam',
      applicantName: 'Mohammad Rahman',
      nationalIdNumber: '1234567890123',
      mobileNumber: '+880 1712-345678',
      presentAddress: 'House 123, Road 15, Block B, Bashundhara R/A, Dhaka-1229',
      loanType: this.productType,
      productName: 'Instant Personal Loan',
      requestedLoanAmount: this.requestedLoanAmount,
      loanTenure: '36 months',
      guarantorName: 'Karim Hossain',
      guarantorRelation: 'Brother',
      guarantorNationalIdNumber: '9876543210987',
      guarantorMobileNumber: '+880 1711-223344',
      guarantorAddress: 'Flat 4B, House 45, Road 10, Dhanmondi, Dhaka',
      nomineeName: 'Fatema Rahman',
      nomineeRelation: 'Spouse',
      nomineeNationalIdNumber: '4567890123456',
      nomineeMobileNumber: '+880 1718-556677',
      nomineeAddress: 'House 123, Road 15, Block B, Bashundhara R/A, Dhaka-1229'
    };
  }

  openApplicationDetails(): void {
    this.showApplicationDetails = true;
  }

  closeApplicationDetails(): void {
    this.showApplicationDetails = false;
  }

  navigateBackToDashboard(): void {
    this.router.navigate(['/loms', 'cpv', 'dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/loms', 'cpv', 'dashboard']);
  }

  confirmCpvSetup(): void {
    Swal.fire({
      title: 'Confirm CPV setup?',
      text: 'This will finalize CPV task assignment for this application.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, confirm'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'CPV setup confirmed',
          text: 'CPV tasks have been configured successfully.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/loms', 'cpv', 'dashboard']);
        });
      }
    });
  }
}

