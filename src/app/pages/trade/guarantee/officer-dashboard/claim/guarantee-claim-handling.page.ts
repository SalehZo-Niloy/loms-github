import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-guarantee-claim-handling-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './guarantee-claim-handling.page.html'
})
export class GuaranteeClaimHandlingPageComponent {
  constructor(private router: Router) {}

  goToSettlement(): void {
    this.router.navigate(['/trade', 'guarantee-claim-settlement']);
  }
}

