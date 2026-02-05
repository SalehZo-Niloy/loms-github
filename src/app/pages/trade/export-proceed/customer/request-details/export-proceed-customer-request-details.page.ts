import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ExportProceedService } from '../../../../../services/export-proceed.service';

@Component({
  selector: 'app-export-proceed-customer-request-details',
  standalone: true,
  imports: [CommonModule, RouterLink, TradeLayoutComponent],
  templateUrl: './export-proceed-customer-request-details.page.html'
})
export class ExportProceedCustomerRequestDetailsPageComponent implements OnInit {
  id: string = '';
  
  proceedDetails: any = {
    id: '',
    status: '',
    customer: '',
    cif: '',
    accountNo: '',
    billNo: '',
    lcNo: '',
    swiftRef: '',
    valueDate: '',
    currency: '',
    amount: 0
  };

  distributionSummary = {
    creditToCustomer: 0.00,
    loanAdjustment: 0.00,
    investmentAdjustment: 0.00,
    totalCharges: 143.00
  };

  discrepancy = {
    isRaised: false,
    reason: ''
  };

  historyEvents = [
    {
       title: 'Distribution prepared.',
       subtitle: 'Submitted for approval.',
       date: '19 Jan 2026, 19:38',
       user: 'Trade Officer'
    },
    {
       title: 'SWIFT details validated',
       subtitle: 'successfully.',
       date: '19 Jan 2026, 19:23',
       user: 'Trade Officer'
    },
    {
       title: 'Proceed Received',
       subtitle: 'manually via Dashboard',
       date: '19 Jan 2026, 19:19',
       user: 'System'
    }
  ];

  constructor(private route: ActivatedRoute, private proceedService: ExportProceedService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
       this.proceedService.getProceed(this.id).subscribe(data => {
         if (data) {
           this.proceedDetails = {
             ...data,
             billNo: data.refBill,
             lcNo: data.refLC
           };
           
           if (data.status === 'DISCREPANCY_RAISED') {
             this.discrepancy = {
               isRaised: true,
               reason: data.discrepancyReason || ''
             };
           }
         }
       });
    }
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}

