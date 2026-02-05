import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../../components/ui/ui-table.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';

@Component({
  selector: 'app-export-bill-approver-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent, FormsModule, NgFor, DecimalPipe, UiTableComponent, UiInputComponent],
  templateUrl: './export-bill-approver-dashboard.page.html'
})
export class ExportBillApproverDashboardPageComponent implements OnInit {
  stats = {
    total: 0,
    actionRequired: 0,
    inProgress: 0,
    completed: 0
  };

  bills: ExportBill[] = [];
  searchTerm = '';

  constructor(private billService: ExportBillService) {}

  ngOnInit() {
    this.billService.bills$.subscribe(bills => {
      // Approver sees all verified bills and beyond
      this.bills = bills.filter(b => ['VERIFIED', 'APPROVED', 'SENT_TO_IMPORTER'].includes(b.status));
      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats.total = this.bills.length;
    // Assuming VERIFIED and APPROVED need action
    this.stats.actionRequired = this.bills.filter(b => ['VERIFIED', 'APPROVED'].includes(b.status)).length;
    // Just mapping some statuses to "In Progress" for the visual
    this.stats.inProgress = this.bills.filter(b => ['VERIFIED', 'APPROVED'].includes(b.status)).length; 
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
      case 'VERIFIED': return 'bg-gray-100 text-gray-800'; // Grayish as in image
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'SENT_TO_IMPORTER': return 'bg-gray-200 text-gray-800'; // Looks like gray pill in image
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
