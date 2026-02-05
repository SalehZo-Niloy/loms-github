import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { MasterLCService, MasterLCRequest } from '../../../../../services/master-lc.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-lc-manager-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, FormsModule],
  templateUrl: './master-lc-manager-request-details.page.html'
})
export class MasterLCManagerRequestDetailsPageComponent implements OnInit {
  request: MasterLCRequest | undefined;
  isLoading = true;
  remarks: string = '';

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
  }

  goBack() {
    this.location.back();
  }

  approve() {
    if (!this.request) return;

    Swal.fire({
      title: 'Final Approve?',
      text: "You are about to give final approval for this Master LC request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.masterLCService.updateStatus(
          this.request!.id,
          'Manager Approved',
          'Manager',
          this.remarks || 'Approved by Manager'
        );
        Swal.fire(
          'Approved!',
          'The request has been approved.',
          'success'
        ).then(() => {
          this.router.navigate(['/trade/master-lc/manager/dashboard']);
        });
      }
    });
  }

  reject() {
    if (!this.request) return;

    Swal.fire({
      title: 'Reject Request?',
      text: "Are you sure you want to reject this request? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.masterLCService.updateStatus(
          this.request!.id,
          'Rejected',
          'Manager',
          this.remarks || 'Rejected by Manager'
        );
        Swal.fire(
          'Rejected!',
          'The request has been rejected.',
          'success'
        ).then(() => {
          this.router.navigate(['/trade/master-lc/manager/dashboard']);
        });
      }
    });
  }

  returnToTO() {
    if (!this.request) return;

    Swal.fire({
      title: 'Return to Trade Officer?',
      text: "The request will be sent back to the Trade Officer for corrections.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Return',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.masterLCService.updateStatus(
          this.request!.id,
          'Returned',
          'Manager',
          this.remarks || 'Returned to Trade Officer'
        );
        Swal.fire(
          'Returned!',
          'The request has been returned to the Trade Officer.',
          'success'
        ).then(() => {
          this.router.navigate(['/trade/master-lc/manager/dashboard']);
        });
      }
    });
  }
}
