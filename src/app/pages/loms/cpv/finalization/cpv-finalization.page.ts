import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LomsLayoutComponent } from '../../../../styles/layout/loms-layout.component';

type CpvFinalizationStatusCategory = 'CONTACT' | 'ADDRESS';

interface CpvFinalizationRow {
  id: string;
  applicationId: string;
  cpvType: string;
  persona: string;
  statusCategory: CpvFinalizationStatusCategory;
  status: string;
  remarks: string;
  fileName: string;
  previewUrl: string | null;
}

@Component({
  selector: 'app-cpv-finalization-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cpv-finalization.page.html'
})
export class CpvFinalizationPageComponent {
  applicationId = 'LN-2024-001234';
  requestedLoanAmount = 'BDT 5,00,000';
  productType = 'Personal Loan';

  rows: CpvFinalizationRow[] = [
    {
      id: 'contact-applicant',
      applicationId: 'LN-2024-001234',
      cpvType: 'Contact Number Verification (Applicant)',
      persona: 'Mohammad Rahman',
      statusCategory: 'CONTACT',
      status: '',
      remarks: '',
      fileName: '',
      previewUrl: null
    },
    {
      id: 'contact-guarantor',
      applicationId: 'LN-2024-001234',
      cpvType: 'Contact Number Verification (Guarantor)',
      persona: 'Karim Hossain',
      statusCategory: 'CONTACT',
      status: '',
      remarks: '',
      fileName: '',
      previewUrl: null
    },
    {
      id: 'address-verification',
      applicationId: 'LN-2024-001235',
      cpvType: 'Address Verification',
      persona: 'Fatima Begum',
      statusCategory: 'ADDRESS',
      status: '',
      remarks: '',
      fileName: '',
      previewUrl: null
    }
  ];

  readonly contactStatusOptions: string[] = [
    'Wrong Number',
    'Switched Off',
    'Someone Else Picked'
  ];

  readonly addressStatusOptions: string[] = [
    'Wrong Address',
    'Address Not Found',
    'Customer Not Available at Address',
    'Address Partially Matched',
    'Address Verified'
  ];

  constructor(private router: Router) {}

  getStatusOptions(row: CpvFinalizationRow): string[] {
    return row.statusCategory === 'CONTACT'
      ? this.contactStatusOptions
      : this.addressStatusOptions;
  }

  onStatusChange(row: CpvFinalizationRow, value: string): void {
    row.status = value;
  }

  onRemarksChange(row: CpvFinalizationRow, value: string): void {
    row.remarks = value;
  }

  onUploadDocument(row: CpvFinalizationRow, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      return;
    }

    if (row.previewUrl) {
      URL.revokeObjectURL(row.previewUrl);
    }

    row.fileName = file.name;
    row.previewUrl = URL.createObjectURL(file);
  }

  canPreview(row: CpvFinalizationRow): boolean {
    return !!row.previewUrl;
  }

  previewDocument(row: CpvFinalizationRow): void {
    if (!row.previewUrl) {
      return;
    }

    if (typeof window !== 'undefined') {
      window.open(row.previewUrl, '_blank', 'noopener,noreferrer');
    }
  }

  saveDraft(): void {}

  submitFinalization(): void {
    Swal.fire({
      title: 'Submit CPV finalization?',
      text: 'This will submit the CPV results for this application.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'CPV finalized',
          text: 'CPV finalization has been submitted successfully.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/loms', 'cpv', 'finalization']);
        });
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/loms', 'cpv', 'dashboard']);
  }
}
