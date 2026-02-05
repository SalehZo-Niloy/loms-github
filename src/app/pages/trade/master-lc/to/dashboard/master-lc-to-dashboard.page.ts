import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { MasterLCService, MasterLCRequest } from '../../../../../services/master-lc.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-master-lc-to-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent],
  templateUrl: './master-lc-to-dashboard.page.html'
})
export class MasterLCToDashboardPageComponent implements OnInit {
  requests$: Observable<MasterLCRequest[]>;
  pendingReviewCount: number = 0;
  totalRequestsCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;

  constructor(private masterLCService: MasterLCService) {
    this.requests$ = this.masterLCService.requests$;
  }

  ngOnInit() {
    this.masterLCService.requests$.subscribe((reqs: MasterLCRequest[]) => {
      this.totalRequestsCount = reqs.length;
      this.pendingReviewCount = reqs.filter(r => r.status === 'Submitted' || r.status === 'Pending Approval').length;
      this.approvedCount = reqs.filter(r => r.status === 'Manager Approved' || r.status === 'Issued').length;
      this.rejectedCount = reqs.filter(r => r.status === 'Rejected').length;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Manager Approved':
      case 'Issued':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Pending Approval':
      case 'Submitted':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  }
}
