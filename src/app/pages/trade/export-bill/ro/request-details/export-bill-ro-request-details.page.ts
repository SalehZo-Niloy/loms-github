import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-export-bill-ro-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, NgIf],
  templateUrl: './export-bill-ro-request-details.page.html'
})
export class ExportBillRORequestDetailsPageComponent implements OnInit {
  bill: ExportBill | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: ExportBillService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.billService.getBill(id).subscribe(bill => {
          this.bill = bill;
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/trade/export-bill/ro/dashboard']);
  }

  passValidation() {
    if (!this.bill) return;

    Swal.fire({
      title: 'Pass Validation?',
      text: "This will forward the request to the Trade Officer.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // blue-600
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Pass Validation'
    }).then((result) => {
      if (result.isConfirmed) {
        // Update Status
        this.bill!.status = 'VERIFIED';
        // In a real app, we would call an update method in the service
        
        Swal.fire({
          title: 'Validation Passed Successfully!',
          text: 'Request has been forwarded to Trade Officer.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/export-bill/ro/dashboard']);
        });
      }
    });
  }

  returnToCustomer() {
    if (!this.bill) return;

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
        // Update Status
        this.bill!.status = 'SUBMITTED'; // Or RETURNED status if available
        // Mock logic
        
        Swal.fire({
          title: 'Returned Successfully!',
          text: 'Request has been returned to customer.',
          icon: 'success',
          confirmButtonColor: '#4338ca'
        }).then(() => {
          this.router.navigate(['/trade/export-bill/ro/dashboard']);
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'VERIFIED': return 'bg-indigo-100 text-indigo-700';
      case 'RETURNED': return 'bg-orange-100 text-orange-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
