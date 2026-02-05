import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';
import { ExportProceedService, ExportProceed } from '../../../../../services/export-proceed.service';
import { TradeStatus } from '../../../../../services/workflow.service';

@Component({
  selector: 'app-export-proceed-approver-request-details',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent],
  templateUrl: './export-proceed-approver-request-details.page.html'
})
export class ExportProceedApproverRequestDetailsPageComponent implements OnInit {
  id: string = '';
  
  proceedDetails: ExportProceed = {
    id: 'PR-2026-232914',
    status: TradeStatus.PENDING_APPROVAL,
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

  distributionSummary = {
    creditToCustomer: 0.00,
    loanAdjustment: 0.00,
    investmentAdjustment: 0.00,
    totalCharges: 143.00
  };

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
      }
    });
    this.updateDistributionSummary();
  }

  approve() {
    Swal.fire({
      title: 'Approve Proceed?',
      text: "Are you sure you want to approve this proceed?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Approved');
        this.proceedDetails.status = TradeStatus.REALIZED;
        this.proceedService.updateStatus(this.proceedDetails.id, TradeStatus.REALIZED, undefined, 'APPROVER');
        Swal.fire({
          title: 'Approved!',
          text: 'The proceed has been approved.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/export-proceed/approver/dashboard']);
        });
      }
    });
  }

  reject() {
    Swal.fire({
      title: 'Reject Proceed?',
      text: "Are you sure you want to reject this proceed?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Rejected');
        this.proceedDetails.status = TradeStatus.DISCREPANCY_RAISED;
        this.proceedService.updateStatus(this.proceedDetails.id, TradeStatus.DISCREPANCY_RAISED, undefined, 'APPROVER');
        Swal.fire({
          title: 'Rejected!',
          text: 'The proceed has been rejected.',
          icon: 'error',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/export-proceed/approver/dashboard']);
        });
      }
    });
  }

  private updateDistributionSummary() {
    const totalAdjustments =
      this.distributionSummary.loanAdjustment +
      this.distributionSummary.investmentAdjustment +
      this.distributionSummary.totalCharges;

    const netAmount = this.proceedDetails.amount - totalAdjustments;
    this.distributionSummary.creditToCustomer = Number(
      Math.max(0, netAmount).toFixed(2),
    );
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
