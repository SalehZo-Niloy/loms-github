import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-guarantee-amendment-swift-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './guarantee-amendment-swift.page.html'
})
export class GuaranteeAmendmentSwiftPageComponent {
  constructor(private router: Router) {}

  goBackToReview(): void {
    this.router.navigate(['/trade', 'guarantee-amendment-processing']);
  }

  navigateToFinalReview(): void {
    this.router.navigate(['/trade', 'guarantee-amendment-processing', 'final-review']);
  }
}
