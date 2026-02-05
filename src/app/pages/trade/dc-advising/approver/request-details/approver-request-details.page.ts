import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeRequestService, TradeRequest } from '../../../../../services/trade-request.service';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approver-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, NgIf, NgFor],
  templateUrl: './approver-request-details.page.html',
  styleUrls: ['./approver-request-details.page.scss']
})
export class ApproverRequestDetailsPageComponent implements OnInit {
  request: TradeRequest | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tradeRequestService: TradeRequestService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.request = this.tradeRequestService.getRequestById(id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/trade/dc-advising/approver/dashboard']);
  }

  approveRequest() {
    if (!this.request) return;

    Swal.fire({
      title: 'Approve Request?',
      text: "This will finalize the approval process.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32', // Green
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tradeRequestService.updateRequestStatus(
          this.request!.id,
          'APPROVED',
          'APPROVER',
          'Request approved.'
        );
        
        Swal.fire({
          title: 'Approved Successfully!',
          text: 'Request has been approved.',
          icon: 'success',
          confirmButtonColor: '#2e7d32'
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/approver/dashboard']);
        });
      }
    });
  }

  rejectRequest() {
    if (!this.request) return;

    Swal.fire({
      title: 'Reject Request?',
      text: "Please provide a reason for rejection:",
      input: 'text',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Red
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Reject Request',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a reason!'
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.tradeRequestService.updateRequestStatus(
          this.request!.id,
          'REJECTED',
          'APPROVER',
          `Request rejected: ${result.value}`
        );
        
        Swal.fire({
          title: 'Rejected Successfully!',
          text: 'Request has been rejected.',
          icon: 'error',
          confirmButtonColor: '#d33'
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/approver/dashboard']);
        });
      }
    });
  }

  getTotalCharges(): number {
    if (!this.request?.charges) return 0;
    return this.request.charges.reduce((sum, c) => sum + c.amount, 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO_TRADE_OFFICER': return 'status-purple';
      case 'PENDING_APPROVAL': return 'status-orange';
      case 'APPROVED': return 'status-green';
      case 'REJECTED': return 'status-red';
      case 'DC_ADVICE_ISSUED': return 'status-teal';
      default: return 'status-gray';
    }
  }

  getStatusLabel(status: string): string {
    return status?.replace(/_/g, ' ');
  }
}
