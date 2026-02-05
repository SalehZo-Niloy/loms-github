import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiTableComponent } from '../../../../../components/ui/ui-table.component';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';

@Component({
  selector: 'app-export-bill-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent, UiTableComponent, UiButtonComponent, UiInputComponent, FormsModule],
  templateUrl: './export-bill-customer-dashboard.page.html',
})
export class ExportBillCustomerDashboardPageComponent implements OnInit {
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
      this.bills = bills;
      this.calculateStats();
    });
  }

  get filteredBills() {
    return this.bills.filter(b => 
      b.id.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      b.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      b.lcNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  calculateStats() {
    this.stats.total = this.bills.length;
    this.stats.actionRequired = this.bills.filter(b => b.status === 'SUBMITTED').length; // Mock logic
    this.stats.inProgress = this.bills.filter(b => ['VERIFIED', 'APPROVED'].includes(b.status)).length;
    this.stats.completed = this.bills.filter(b => b.status === 'SENT_TO_IMPORTER').length; // Mock logic
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'VERIFIED':
        return 'bg-blue-50 text-blue-700';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800';
      case 'SENT_TO_IMPORTER':
        return 'bg-blue-200 text-blue-900';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
