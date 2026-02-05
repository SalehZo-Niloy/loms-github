import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guarantee-amendment-final-review-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './guarantee-amendment-final-review.page.html'
})
export class GuaranteeAmendmentFinalReviewPageComponent {
  constructor(private router: Router) {}

  goBackToDashboard(): void {
    this.router.navigate(['/trade', 'guarantee-officer-dashboard']);
  }

  submitDecision(): void {
    Swal.fire({
      title: 'Submit final decision?',
      text: 'This will send the amendment decision to the checker workflow.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Decision submitted',
          text: 'Amendment decision has been submitted for checker action.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/trade', 'guarantee-officer-dashboard']);
        });
      }
    });
  }
}

