import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-export-bill-approver-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, NgIf, DecimalPipe],
  templateUrl: './export-bill-approver-request-details.page.html'
})
export class ExportBillApproverRequestDetailsPageComponent implements OnInit {
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
    this.router.navigate(['/trade/export-bill/approver/dashboard']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'VERIFIED': return 'bg-indigo-100 text-indigo-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'SENT_TO_IMPORTER': return 'bg-purple-100 text-purple-800';
      case 'RETURNED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  approveRequest() {
    if (!this.bill) return;

    Swal.fire({
      title: 'Approve Request?',
      text: "This will finalize the export bill and send it to the importer.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // blue-600
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve Request'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bill!.status = 'SENT_TO_IMPORTER';
        
        Swal.fire({
          title: 'Request Approved!',
          text: 'Export Collection has been sent to the importer bank.',
          icon: 'success',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/trade/export-bill/approver/dashboard']);
        });
      }
    });
  }

  rejectRequest() {
    if (!this.bill) return;

    Swal.fire({
      title: 'Reject Request?',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Type your reason here...',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // Red-600
      confirmButtonText: 'Reject Request'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.bill!.status = 'RETURNED';
        Swal.fire(
          'Rejected!',
          'Request has been rejected and returned.',
          'success'
        ).then(() => {
          this.router.navigate(['/trade/export-bill/approver/dashboard']);
        });
      }
    });
  }
}
