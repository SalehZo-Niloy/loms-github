import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ExportBillService, ExportBill } from '../../../../../services/export-bill.service';

@Component({
  selector: 'app-export-bill-customer-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, NgIf, NgFor, RouterLink, DecimalPipe],
  templateUrl: './export-bill-customer-request-details.page.html'
})
export class ExportBillCustomerRequestDetailsPageComponent implements OnInit {
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'VERIFIED': return 'bg-indigo-100 text-indigo-700';
      case 'RETURNED': return 'bg-orange-100 text-orange-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
