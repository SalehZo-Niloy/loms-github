import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../../components/ui/ui-table.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';

@Component({
  selector: 'app-export-bill-ro-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent, FormsModule, NgFor, UiTableComponent, UiInputComponent],
  templateUrl: './export-bill-ro-dashboard.page.html'
})
export class ExportBillRoDashboardPageComponent implements OnInit {
  stats = {
    total: 0,
    pending: 0,
    actionRequired: 0,
    completed: 0
  };

  bills: ExportBill[] = [];
  searchTerm = '';

  constructor(private billService: ExportBillService) {}

  ngOnInit() {
    this.billService.bills$.subscribe(bills => {
      this.bills = bills;
      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats.total = this.bills.length;
    // Pending: Submitted by customer, waiting for RO or others
    this.stats.pending = this.bills.filter(b => ['SUBMITTED', 'VERIFIED'].includes(b.status)).length;
    // Action Required: Specifically for RO (e.g. SUBMITTED state)
    this.stats.actionRequired = this.bills.filter(b => b.status === 'SUBMITTED').length;
    this.stats.completed = this.bills.filter(b => b.status === 'SENT_TO_IMPORTER').length;
  }

  get filteredBills() {
    return this.bills.filter(b => 
      b.id.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      b.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      b.lcNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'VERIFIED': return 'bg-indigo-100 text-indigo-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'SENT_TO_IMPORTER': return 'bg-purple-100 text-purple-800';
      case 'RETURNED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}

