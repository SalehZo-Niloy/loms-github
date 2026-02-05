import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-guarantee-claim-settlement-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './guarantee-claim-settlement.page.html'
})
export class GuaranteeClaimSettlementPageComponent {
  constructor(private router: Router) {}

  goBackToHandling(): void {
    this.router.navigate(['/trade', 'guarantee-claim-handling']);
  }
}

