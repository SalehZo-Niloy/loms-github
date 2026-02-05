import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';
import { ExportProceedService, ExportProceed } from '../../../../../services/export-proceed.service';
import { TradeStatus } from '../../../../../services/workflow.service';

@Component({
  selector: 'app-export-proceed-to-request-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TradeLayoutComponent],
  templateUrl: './export-proceed-to-request-details.page.html'
})
export class ExportProceedToRequestDetailsPageComponent implements OnInit {
  id: string = '';
  step: number = 1;
  
  proceedDetails: ExportProceed = {
    id: 'PR-2026-232914',
    status: TradeStatus.SUBMITTED,
    customer: 'New Customer Ltd',
    refBill: 'BC-25-22',
    refLC: 'LC-25-7',
    currency: 'USD',
    amount: 3390.00,
    date: '2026-01-19',
    cif: 'CIF-9999',
    accountNo: '123-456-789',
    swiftRef: 'SW-62174',
    valueDate: '19 Jan 2026',
  };

  distributions: any[] = [
    { type: '', accountNo: '', amount: null }
  ];

  charges: any[] = [
    { name: '', amount: null }
  ];
  
  accountTypes = ['CASA', 'FC', 'Loan'];
  chargeTypes = ['Swift Charge', 'Commission Charge', 'Courier Charge', 'Handling Fee'];

  showDiscrepancyModal = false;
  discrepancyReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proceedService: ExportProceedService,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
       this.proceedDetails.id = this.id;
    }
    this.proceedService.getProceed(this.proceedDetails.id).subscribe((proceed) => {
      if (proceed) {
        this.proceedDetails = { ...this.proceedDetails, ...proceed };
        this.setStepFromStatus(proceed.status);
      }
    });
  }

  validateSwift() {
    this.step = 2;
    this.proceedDetails.status = TradeStatus.SWIFT_VALIDATED;
    this.proceedService.updateStatus(this.proceedDetails.id, TradeStatus.SWIFT_VALIDATED, undefined, 'TO');
  }

  addDistribution() {
    this.distributions.push({ type: '', accountNo: '', amount: null });
  }

  removeDistribution(index: number) {
    this.distributions.splice(index, 1);
  }

  get totalDistribution(): number {
    return this.distributions.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  addCharge() {
    this.charges.push({ name: '', amount: null });
  }

  removeCharge(index: number) {
    this.charges.splice(index, 1);
  }

  get totalCharges(): number {
    return this.charges.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  openDiscrepancyModal() {
    this.showDiscrepancyModal = true;
  }

  closeDiscrepancyModal() {
    this.showDiscrepancyModal = false;
  }

  submitDiscrepancy() {
    console.log('Discrepancy Raised:', this.discrepancyReason);
    this.proceedDetails.status = TradeStatus.DISCREPANCY_RAISED;
    this.proceedService.updateStatus(this.proceedDetails.id, TradeStatus.DISCREPANCY_RAISED, this.discrepancyReason, 'TO');
    this.showDiscrepancyModal = false;
    this.router.navigate(['/trade/export-proceed/to/dashboard']);
  }

  submitForApproval() {
    Swal.fire({
      title: 'Submit for Approval?',
      text: "Are you sure you want to submit this proceed for approval?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Submitted for Approval', {
          distributions: this.distributions,
          charges: this.charges
        });
        this.proceedDetails.status = TradeStatus.PENDING_APPROVAL;
        this.proceedService.updateStatus(this.proceedDetails.id, TradeStatus.PENDING_APPROVAL, undefined, 'TO');
        
        Swal.fire({
          title: 'Submitted!',
          text: 'The proceed has been submitted for approval.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/export-proceed/to/dashboard']);
        });
      }
    });
  }

  private setStepFromStatus(status: string) {
    if (
      status === TradeStatus.SWIFT_VALIDATED ||
      status === TradeStatus.PENDING_APPROVAL ||
      status === TradeStatus.DISCREPANCY_RAISED ||
      status === TradeStatus.REALIZED
    ) {
      this.step = 2;
      return;
    }
    this.step = 1;
  }

  formatStatus(status: string): string {
    if (status === TradeStatus.SUBMITTED) {
      return 'Received';
    }
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
