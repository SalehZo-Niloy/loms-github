import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { TradeRequestService, TradeRequest } from '../../../../../services/trade-request.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, RouterLink],
  templateUrl: './request-details.page.html',
})
export class RequestDetailsPageComponent implements OnInit {
  request: TradeRequest | undefined;

  constructor(
    private route: ActivatedRoute,
    private tradeService: TradeRequestService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.request = this.tradeService.getRequestById(id);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'RETURNED': return 'bg-orange-100 text-orange-700';
      case 'VALID': return 'text-green-600 font-medium';
      case 'INVALID': return 'text-red-600 font-medium';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
