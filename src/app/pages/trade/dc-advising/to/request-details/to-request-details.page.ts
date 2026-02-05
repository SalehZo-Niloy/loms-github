import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeRequestService, TradeRequest } from '../../../../../services/trade-request.service';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-to-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, NgIf, NgFor],
  templateUrl: './to-request-details.page.html',
  styleUrls: ['./to-request-details.page.scss']
})
export class TradeOfficerRequestDetailsPageComponent implements OnInit {
  request: TradeRequest | undefined;
  
  showChargesModal = false;
  chargeTypes = ['Advice Charge', 'SWIFT Charge', 'Courier Charge', 'Handling Fee', 'VAT', 'Other'];
  chargesList: { type: string, amount: number }[] = [];

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
        if (this.request?.charges?.length) {
          this.populateFormFromCharges();
        } else {
            // Default charges if none exist
            this.chargesList = [
                { type: 'Advice Charge', amount: 0 },
                { type: 'SWIFT Charge', amount: 0 }
            ];
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/trade/dc-advising/to/dashboard']);
  }

  populateFormFromCharges() {
    if (!this.request?.charges) return;
    this.chargesList = this.request.charges.map(c => ({
        type: c.description, // Assuming description matches types or is custom
        amount: c.amount
    }));
  }

  openChargesModal() {
    this.showChargesModal = true;
    if (!this.chargesList || this.chargesList.length === 0) {
         this.chargesList = [
            { type: 'Advice Charge', amount: 0 },
            { type: 'SWIFT Charge', amount: 0 }
        ];
    }
  }

  closeChargesModal() {
    this.showChargesModal = false;
  }

  addCharge() {
      this.chargesList.push({ type: 'Other', amount: 0 });
  }

  removeCharge(index: number) {
      this.chargesList.splice(index, 1);
  }

  saveCharges() {
    if (!this.request) return;

    const currency = this.request.exportLC.currency || 'USD';
    
    const charges = this.chargesList.map(c => ({
        amount: c.amount,
        currency: currency,
        description: c.type,
        status: 'PENDING' as const
    }));

    this.tradeRequestService.updateRequestCharges(this.request.id, charges);
    this.request = this.tradeRequestService.getRequestById(this.request.id); // Refresh local state
    this.closeChargesModal();
  }

  getTotalCharges(): number {
    if (!this.request?.charges) return 0;
    return this.request.charges.reduce((sum, c) => sum + c.amount, 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO_TRADE_OFFICER': return 'bg-blue-100 text-blue-700'; // Blue
      case 'PENDING_APPROVAL': return 'bg-orange-100 text-orange-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'DC_ADVICE_ISSUED': return 'bg-teal-100 text-teal-700';
      case 'RETURNED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    return status?.replace(/_/g, ' ');
  }

  submitForApproval() {
    if (!this.request) return;

    Swal.fire({
      title: 'Submit for Approval?',
      text: "This will send the request to the approver.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd', // Blue
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tradeRequestService.updateRequestStatus(
          this.request!.id, 
          'PENDING_APPROVAL', 
          'TO', 
          'Submitted for approval.'
        );
        
        Swal.fire({
          title: 'Submitted Successfully!',
          text: 'Request has been sent for approval.',
          icon: 'success',
          confirmButtonColor: '#0d6efd' // Blue
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/to/dashboard']);
        });
      }
    });
  }

  returnToCustomer() {
    if (!this.request) return;

    Swal.fire({
      title: 'Return to Customer?',
      text: "Please provide a reason for returning:",
      input: 'text',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Return Request',
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
          'RETURNED', 
          'TO', 
          `Returned to customer: ${result.value}`
        );
        
        Swal.fire({
          title: 'Returned Successfully!',
          text: 'Request has been returned to customer.',
          icon: 'success',
          confirmButtonColor: '#0d6efd' // Blue
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/to/dashboard']);
        });
      }
    });
  }
}
