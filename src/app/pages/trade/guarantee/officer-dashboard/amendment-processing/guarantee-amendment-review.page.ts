import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guarantee-amendment-review-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './guarantee-amendment-review.page.html'
})
export class GuaranteeAmendmentReviewPageComponent {
  constructor(private router: Router) {}

  goBackToDashboard(): void {
    this.router.navigate(['/trade', 'guarantee-officer-dashboard']);
  }

  goToSwiftAmendment(): void {
    Swal.fire({
      title: 'Create SWIFT Amendment?',
      text: 'This will take you to MT767 creation for the approved amendment.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Proceed to MT767'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/trade', 'guarantee-amendment-processing', 'create-swift']);
      }
    });
  }

  submitReview(): void {
    Swal.fire({
      title: 'Submit amendment review?',
      text: 'This will move the amendment to final review for decisioning.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit review'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Review submitted',
          text: 'Amendment review has been submitted for final decision.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/trade', 'guarantee-amendment-processing', 'final-review']);
        });
      }
    });
  }
}

