import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { FormsModule } from '@angular/forms';
import { UiTableComponent } from '../../../../../components/ui/ui-table.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { TradeRequestService, TradeRequest } from '../../../../../services/trade-request.service';

@Component({
  selector: 'app-to-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent, FormsModule, NgFor, UiTableComponent, UiInputComponent],
  templateUrl: './to-dashboard.page.html',
  styleUrls: ['./to-dashboard.page.scss']
})
export class TradeOfficerDashboardPageComponent implements OnInit {
  requests: TradeRequest[] = [];
  filteredRequests: TradeRequest[] = [];
  searchTerm: string = '';

  stats = {
    total: 0,
    pending: 0,
    actionRequired: 0,
    issued: 0
  };

  constructor(private tradeRequestService: TradeRequestService) {}

  ngOnInit() {
    this.tradeRequestService.requests$.subscribe(requests => {
      this.requests = requests;
      this.calculateStats();
      this.filterRequests();
    });
  }

  calculateStats() {
    this.stats.total = this.requests.length;
    this.stats.pending = this.requests.filter(r => r.status === 'PENDING_APPROVAL' || r.status === 'RO_VALIDATION').length;
    this.stats.actionRequired = this.requests.filter(r => r.status === 'TO_TRADE_OFFICER').length;
    this.stats.issued = this.requests.filter(r => r.status === 'DC_ADVICE_ISSUED').length;
  }

  filterRequests() {
    if (!this.searchTerm) {
      this.filteredRequests = this.requests;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRequests = this.requests.filter(r => 
        r.id.toLowerCase().includes(term) || 
        r.applicant.name.toLowerCase().includes(term) ||
        r.exportLC.lcNo.toLowerCase().includes(term)
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TO_TRADE_OFFICER': return 'bg-purple-100 text-purple-800';
      case 'PENDING_APPROVAL': return 'bg-orange-100 text-orange-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'DC_ADVICE_ISSUED': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
