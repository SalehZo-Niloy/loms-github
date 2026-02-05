import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../../components/ui/ui-table.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';

@Component({
  selector: 'app-export-bill-to-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent, FormsModule, NgFor, UiTableComponent, UiInputComponent],
  templateUrl: './export-bill-to-dashboard.page.html'
})
export class ExportBillToDashboardPageComponent implements OnInit {
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    returned: 0
  };

  bills: ExportBill[] = [];
  searchTerm = '';

  constructor(private billService: ExportBillService) {}

  ngOnInit() {
    this.billService.bills$.subscribe(bills => {
      // TO sees bills that are at least VERIFIED by RO, or already processed by TO
      // Assuming TO actions on VERIFIED bills
      this.bills = bills.filter(b => ['VERIFIED', 'APPROVED', 'SENT_TO_IMPORTER', 'RETURNED'].includes(b.status));
      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats.total = this.bills.length;
    this.stats.pending = this.bills.filter(b => b.status === 'VERIFIED').length;
    this.stats.approved = this.bills.filter(b => ['APPROVED', 'SENT_TO_IMPORTER'].includes(b.status)).length;
    this.stats.returned = this.bills.filter(b => b.status === 'RETURNED').length;
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
