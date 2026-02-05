import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { MasterLCService, MasterLCRequest } from '../../../../../services/master-lc.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-lc-to-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, FormsModule],
  templateUrl: './master-lc-to-request-details.page.html'
})
export class MasterLCToRequestDetailsPageComponent implements OnInit {
  request: MasterLCRequest | undefined;
  isLoading = true;
  remarks: string = '';

  // Financials
  limitApproved = 1000000.00;
  limitUtilized = 450000.00;
  limitAvailable = 550000.00;
  
  marginPercent: number = 10;
  marginAmount: number = 0;
  commissionPercent: number = 0.25;
  totalCharges: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private masterLCService: MasterLCService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRequest(id);
      }
    });
  }

  loadRequest(id: string) {
    this.request = this.masterLCService.getRequestById(id);
    this.isLoading = false;
    
    if (this.request) {
      // Initialize financials from request if they exist, otherwise use defaults
      if (this.request.marginPercent !== undefined) this.marginPercent = this.request.marginPercent;
      if (this.request.commissionPercent !== undefined) this.commissionPercent = this.request.commissionPercent;
      
      // Mock Limit Logic (randomize slightly for demo if new)
      if (this.request.limitApproved) {
         this.limitApproved = this.request.limitApproved;
         this.limitUtilized = this.request.limitUtilized || 0;
         this.limitAvailable = this.request.limitAvailable || 0;
      } else {
         // First time viewing, set defaults/mock
         this.limitApproved = 1000000.00;
         this.limitUtilized = 450000.00;
         this.limitAvailable = this.limitApproved - this.limitUtilized;
      }

      this.calculateFinancials();
    }
  }

  calculateFinancials() {
    if (!this.request) return;

    const amount = this.request.requestedAmount || 0;
    
    // Margin Amount
    this.marginAmount = amount * (this.marginPercent / 100);

    // Total Charges (Est) = Commission
    this.totalCharges = amount * (this.commissionPercent / 100);
  }

  goBack() {
    this.location.back();
  }

  approve() {
    if (!this.request) return;

    Swal.fire({
      title: 'Approve Request?',
      text: "You are about to verify this request and forward it to the Manager.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Verify & Forward',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processApproval();
      }
    });
  }

  private processApproval() {
    if (this.request) {
      // 1. Save Financials
      const updatedReq = { ...this.request };
      updatedReq.limitApproved = this.limitApproved;
      updatedReq.limitUtilized = this.limitUtilized;
      updatedReq.limitAvailable = this.limitAvailable;
      updatedReq.marginPercent = this.marginPercent;
      updatedReq.marginAmount = this.marginAmount;
      updatedReq.commissionPercent = this.commissionPercent;
      updatedReq.totalCharges = this.totalCharges;
      
      this.masterLCService.updateRequest(updatedReq);

      // 2. Move to Manager
      this.masterLCService.updateStatus(
        this.request.id, 
        'Pending Manager Approval', 
        'Trade Officer', 
        this.remarks || 'Verified and forwarded to Manager'
      );
      
      Swal.fire({
        title: 'Verified!',
        text: 'Request has been forwarded to the Manager.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      }).then(() => {
        this.router.navigate(['/trade/master-lc/to/dashboard']);
      });
    }
  }

  reject() {
    if (!this.request) return;

    Swal.fire({
      title: 'Reject Request?',
      text: "You are about to reject this request. Please provide a reason.",
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Enter rejection remarks...',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      preConfirm: (inputValue) => {
        if (!inputValue && !this.remarks) {
          Swal.showValidationMessage('Please enter rejection remarks');
        }
        return inputValue;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const finalRemarks = result.value || this.remarks;
        
        this.masterLCService.updateStatus(
          this.request!.id, 
          'Rejected', 
          'Trade Officer', 
          finalRemarks
        );
        
        Swal.fire({
          title: 'Rejected!',
          text: 'The request has been rejected.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/master-lc/to/dashboard']);
        });
      }
    });
  }

  returnToCustomer() {
    if (!this.request) return;

    Swal.fire({
      title: 'Return to Customer?',
      text: "This will return the request to the customer for corrections.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Return',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.masterLCService.updateStatus(
            this.request!.id,
            'Returned',
            'Trade Officer',
            this.remarks || 'Returned for correction'
        );
        
        Swal.fire({
          title: 'Returned!',
          text: 'The request has been returned to the customer.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/master-lc/to/dashboard']);
        });
      }
    });
  }
}
