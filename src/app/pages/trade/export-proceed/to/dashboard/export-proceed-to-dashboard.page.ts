import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ExportProceedService, ExportProceed } from '../../../../../services/export-proceed.service';
import { TradeStatus } from '../../../../../services/workflow.service';

@Component({
  selector: 'app-export-proceed-to-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TradeLayoutComponent],
  templateUrl: './export-proceed-to-dashboard.page.html'
})
export class ExportProceedToDashboardPageComponent implements OnInit {
  proceeds: ExportProceed[] = [];

  searchTerm: string = '';
  
  stats = {
    total: 0,
    realized: 0,
    pendingAction: 0,
    discrepancies: 0
  };

  constructor(private proceedService: ExportProceedService) {}

  ngOnInit() {
    this.proceedService.proceeds$.subscribe((data) => {
      this.proceeds = data;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats.total = this.proceeds.length;
    this.stats.realized = this.proceeds.filter(p => p.status === TradeStatus.REALIZED).length;
    this.stats.pendingAction = this.proceeds.filter(p =>
      [TradeStatus.SUBMITTED, TradeStatus.SWIFT_VALIDATED, TradeStatus.PENDING_APPROVAL].includes(p.status as TradeStatus)
    ).length;
    this.stats.discrepancies = this.proceeds.filter(p => p.status === TradeStatus.DISCREPANCY_RAISED).length;
  }

  get filteredProceeds() {
    return this.proceeds.filter(p => 
      p.id.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      p.customer.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  receiveProceed() {
    const newId = `PR-2026-${Math.floor(Math.random() * 1000000)}`;
    this.proceedService.addProceed({
      id: newId,
      customer: 'New Customer Ltd',
      refBill: 'BC-25-NEW',
      refLC: 'LC-25-NEW',
      amount: 10000.00,
      currency: 'USD',
      status: TradeStatus.SUBMITTED,
      date: new Date().toISOString().split('T')[0]
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case TradeStatus.SUBMITTED: return 'bg-blue-100 text-blue-800';
      case TradeStatus.SWIFT_VALIDATED: return 'bg-indigo-100 text-indigo-800';
      case TradeStatus.PENDING_APPROVAL: return 'bg-purple-100 text-purple-800';
      case TradeStatus.DISCREPANCY_RAISED: return 'bg-red-100 text-red-800';
      case TradeStatus.REALIZED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    if (status === TradeStatus.SUBMITTED) {
      return 'Received';
    }
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
