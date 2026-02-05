import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { TradeRequestService } from '../../../../../services/trade-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiInputComponent, FormsModule],
  templateUrl: './create-request.page.html',
})
export class CreateRequestPageComponent {
  currentStep = 1;
  steps = [
    { number: 1, name: 'Applicant' },
    { number: 2, name: 'Export LC' },
    { number: 3, name: 'DC Advice' },
    { number: 4, name: 'Documents' },
    { number: 5, name: 'Review' }
  ];
  
  lcTypes = ['Irrevocable', 'Revocable', 'Confirmed', 'Unconfirmed'];
  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];

  data = {
    applicant: { name: 'My Company Ltd', cif: 'CIF12345', account: 'ACC123456', email: 'me@company.com' },
    exportLC: { 
      lcNo: '', 
      lcType: '',
      amount: '', 
      currency: '', 
      exchangeRate: '',
      amountLcy: '',
      expiryDate: '',
      issueDate: '',
      issuingBank: '',
      beneficiaryName: ''
    },
    dcAdvice: { dcNumber: 'Will be generated', shipmentDate: '', expiryDate: '' },
    documents: [] as any[]
  };

  constructor(
    private router: Router,
    private tradeService: TradeRequestService
  ) {}

  nextStep() {
    if (this.currentStep < 5) {
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

  submit() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to submit this DC Advising Request?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tradeService.addRequest(this.data);
        
        Swal.fire({
          title: 'Submitted!',
          text: 'Your request has been submitted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/customer/dashboard']);
        });
      }
    });
  }
  
  handleDocumentUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.data.documents.push({ name: file.name, size: file.size, file: file });
      console.log('Document uploaded:', file.name);
    }
  }

  removeDocument(doc: any) {
    this.data.documents = this.data.documents.filter(d => d !== doc);
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

  handleSwiftPdfUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('File uploaded:', file.name);

      // Simulate auto-fill logic with fixed LC and DC Advice data
      setTimeout(() => {
        this.data.exportLC = {
          ...this.data.exportLC,
          lcNo: '003LC029662',
          lcType: 'Irrevocable',
          amount: '5000',
          currency: 'USD',
          exchangeRate: '1.0',
          amountLcy: '', // Will be calculated
          issueDate: '2024-01-23',
          issuingBank: 'BANK ASIA LTD',
          beneficiaryName: 'ASCOM INTERNATIONAL'
        };

        this.data.dcAdvice = {
          ...this.data.dcAdvice,
          shipmentDate: '2024-12-12',
          expiryDate: '2024-12-16'
        };

        this.calculateLCY();
      }, 500);
    }
  }

  calculateLCY() {
    const amount = parseFloat(this.data.exportLC.amount);
    const rate = parseFloat(this.data.exportLC.exchangeRate);
    
    if (!isNaN(amount) && !isNaN(rate)) {
      this.data.exportLC.amountLcy = (amount * rate).toFixed(2);
    } else {
      this.data.exportLC.amountLcy = '';
    }
  }
}
