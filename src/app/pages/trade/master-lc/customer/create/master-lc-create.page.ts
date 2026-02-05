import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { MasterLCService, MasterLCRequest } from '../../../../../services/master-lc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-lc-create',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent],
  templateUrl: './master-lc-create.page.html'
})
export class MasterLCCreatePageComponent implements OnInit {
  currentStep = 1;
  steps = [
    { number: 1, name: 'Link LC' },
    { number: 2, name: 'Parties' },
    { number: 3, name: 'PI & Goods' },
    { number: 4, name: 'Limits & Charges' },
    { number: 5, name: 'Documents' },
    { number: 6, name: 'Review' }
  ];

  data: Partial<MasterLCRequest> = {
    currency: '',
    documents: []
  };

  // Mock data for Step 1
  selectedLC: any = null;

  // Documents List
  documentList = [
    { name: 'Export LC Copy', required: true },
    { name: 'Proforma Invoice', required: true },
    { name: 'IRC/ERC', required: true },
    { name: 'Trade License', required: true },
    { name: 'TIN/VAT Certificate', required: true },
    { name: 'Utilization Declaration', required: true }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private masterLCService: MasterLCService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['lc']) {
        this.data.exportLCNo = params['lc'];
        // Simulate auto-population
        this.selectedLC = {
          no: params['lc'],
          amount: 75000.00,
          currency: 'EUR',
          expiryDate: '21 Mar 2026',
          latestShipmentDate: '6 Mar 2026',
          beneficiary: 'Best Garments Ltd (BD)'
        };
        // Auto-populate applicant
        this.data.applicantName = 'Best Garments Ltd (BD)';
      }
    });
  }

  nextStep() {
    if (this.currentStep < 6) {
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

  mockUpload(docName: string) {
    const docIndex = this.data.documents?.findIndex((d: any) => d.name === docName);
    if (docIndex !== undefined && docIndex >= 0) {
        // Already uploaded
    } else {
        if (!this.data.documents) this.data.documents = [];
        this.data.documents.push({
            name: docName,
            type: 'pdf',
            uploaded: true
        });
    }
  }

  isUploaded(docName: string): boolean {
    return this.data.documents?.some((d: any) => d.name === docName) || false;
  }

  submit() {
    Swal.fire({
      title: 'Submit Application?',
      text: "Are you sure you want to submit this Master LC application?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit'
    }).then((result) => {
      if (result.isConfirmed) {
        this.masterLCService.addRequest(this.data);
        
        Swal.fire({
          title: 'Submitted!',
          text: 'Your application has been submitted successfully.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/master-lc/customer/dashboard']);
        });
      }
    });
  }
}
