import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { TradeRequestService, TradeRequest, Document } from '../../../../../services/trade-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ro-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, NgIf, NgFor],
  templateUrl: './ro-request-details.page.html',
})
export class RORequestDetailsPageComponent implements OnInit {
  request: TradeRequest | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tradeService: TradeRequestService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.request = this.tradeService.getRequestById(id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/trade/dc-advising/ro/dashboard']);
  }

  toggleDocumentStatus(doc: Document) {
    if (!this.request) return;
    
    const newStatus = doc.status === 'VALID' ? 'INVALID' : 'VALID';
    this.tradeService.updateDocumentStatus(this.request.id, doc.name, newStatus);
    
    // Refresh local data
    this.request = this.tradeService.getRequestById(this.request.id);
    
    // Show toast
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: 'success',
      title: `Document marked as ${newStatus}`
    });
  }

  passValidation() {
    if (!this.request) return;

    Swal.fire({
      title: 'Pass Validation?',
      text: "This will forward the request to the Trade Officer.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4338ca', // Indigo-600
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Pass Validation'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tradeService.updateRequestStatus(
          this.request!.id, 
          'TO_TRADE_OFFICER', 
          'RO', 
          'Validation passed, forwarded to Trade Officer.'
        );
        
        Swal.fire({
          title: 'Validation Passed Successfully!',
          text: 'Request has been forwarded to Trade Officer.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/ro/dashboard']);
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
        this.tradeService.updateRequestStatus(
          this.request!.id, 
          'RETURNED', 
          'RO', 
          `Returned to customer: ${result.value}`
        );
        
        Swal.fire({
          title: 'Returned Successfully!',
          text: 'Request has been returned to customer.',
          icon: 'success',
          confirmButtonColor: '#4338ca'
        }).then(() => {
          this.router.navigate(['/trade/dc-advising/ro/dashboard']);
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'RO_VALIDATION': return 'bg-indigo-100 text-indigo-700';
      case 'RETURNED': return 'bg-orange-100 text-orange-700';
      case 'VALID': return 'text-green-600 font-medium';
      case 'INVALID': return 'text-red-600 font-medium';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
