import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../../components/ui/ui-table.component';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { TradeRequestService, TradeRequest } from '../../../../../services/trade-request.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent, UiTableComponent, UiButtonComponent, UiInputComponent, FormsModule],
  templateUrl: './customer-dashboard.page.html',
})
export class CustomerDashboardPageComponent implements OnInit {
  stats = {
    total: 0,
    pending: 0,
    actionRequired: 0,
    issued: 0
  };

  requests: TradeRequest[] = [];
  searchTerm = '';

  constructor(
    private tradeService: TradeRequestService
  ) {}

  ngOnInit() {
    this.tradeService.requests$.subscribe(requests => {
      this.requests = requests;
      this.calculateStats();
    });
  }

  get filteredRequests() {
    return this.requests.filter(r => 
      r.id.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      r.applicant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.exportLC.lcNo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  calculateStats() {
    this.stats.total = this.requests.length;
    this.stats.pending = this.requests.filter(r => ['SUBMITTED', 'RO_VALIDATION', 'TO_TRADE_OFFICER', 'PENDING_APPROVAL'].includes(r.status)).length;
    this.stats.actionRequired = this.requests.filter(r => r.status === 'RETURNED' || r.status === 'RETURNED_TO_CUSTOMER').length;
    this.stats.issued = this.requests.filter(r => r.status === 'DC_ADVICE_ISSUED').length;
  }
  
  getStatusClass(status: string): string {
    const styles: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-800',
        SUBMITTED: 'bg-blue-100 text-blue-800',
        RO_VALIDATION: 'bg-indigo-100 text-indigo-800',
        RETURNED: 'bg-red-100 text-red-800',
        RETURNED_TO_CUSTOMER: 'bg-red-100 text-red-800',
        TO_TRADE_OFFICER: 'bg-purple-100 text-purple-800',
        PENDING_APPROVAL: 'bg-orange-100 text-orange-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-200 text-red-900',
        DC_ADVICE_ISSUED: 'bg-teal-100 text-teal-800',
        CLOSED: 'bg-gray-300 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
