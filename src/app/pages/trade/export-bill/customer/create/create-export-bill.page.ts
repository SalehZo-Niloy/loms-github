import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-export-bill',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, FormsModule],
  templateUrl: './create-export-bill.page.html',
})
export class CreateExportBillPageComponent {
  currentStep = 1;
  steps = [
    { number: 1, name: 'Details' },
    { number: 2, name: 'Buyer & Bill' },
    { number: 3, name: 'Documents' },
    { number: 4, name: 'Review' }
  ];

  // Form Data
  formData = {
    // Step 1
    applicantName: 'Alpha Exports Ltd',
    lcNumber: '',
    issuingBank: '',
    lcIssueDate: '',

    // Step 2
    buyerName: '',
    country: '',
    billAmount: null,
    currency: 'USD',
    collectionType: '',
    tenor: 0,

    // Step 3 (Documents)
    documents: [] as any[]
  };

  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
  collectionTypes = ['D/P', 'D/A', 'Clean Collection'];

  constructor(
    private router: Router,
    private billService: ExportBillService
  ) {}

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  handleDocumentUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formData.documents.push({ name: file.name, size: file.size, file: file });
    }
  }

  removeDocument(doc: any) {
    this.formData.documents = this.formData.documents.filter(d => d !== doc);
  }

  previewDocument(doc: any) {
    if (doc.file) {
      const fileURL = URL.createObjectURL(doc.file);
      window.open(fileURL, '_blank');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Preview',
        text: `Previewing document: ${doc.name}`,
        confirmButtonText: 'Close'
      });
    }
  }

  submit() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to submit this Export Bill Collection?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Logic to save the bill
        const billData: Partial<ExportBill> = {
          applicantName: this.formData.applicantName,
          lcNumber: this.formData.lcNumber,
          issuingBank: this.formData.issuingBank,
          lcIssueDate: this.formData.lcIssueDate,
          buyerName: this.formData.buyerName,
          country: this.formData.country,
          amount: this.formData.billAmount || 0,
          currency: this.formData.currency,
          collectionType: this.formData.collectionType,
          tenor: this.formData.tenor,
          documents: this.formData.documents
        };

        this.billService.addBill(billData);

        Swal.fire({
          title: 'Submitted!',
          text: 'Your export bill collection has been submitted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/trade/export-bill/customer/dashboard']);
        });
      }
    });
  }
}
