import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { tradeTheme } from '../../../../../styles/theme';
import Swal from 'sweetalert2';

interface ChecklistItem {
  label: string;
}

interface SwiftValidationItem {
  label: string;
}

@Component({
  selector: 'app-guarantee-checker-application-review-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiInputComponent],
  templateUrl: './application-review.page.html'
})
export class GuaranteeCheckerApplicationReviewPageComponent {
  theme = tradeTheme;

  checklistItems: ChecklistItem[] = [
    { label: 'All mandatory fields provided' },
    { label: 'Required documents uploaded' },
    { label: 'Amount within approved limit' },
    { label: 'Margin & pricing acceptable' },
    { label: 'Beneficiary & country risk acceptable' },
    { label: 'Guarantee text compliant' }
  ];

  swiftValidationItems: SwiftValidationItem[] = [
    { label: 'All mandatory fields present' },
    { label: 'Amount & currency well defined' },
    { label: 'Beneficiary details verified' },
    { label: 'Governing rules aligned' },
    { label: 'Ready for transmission upon approval' }
  ];

  constructor(private router: Router) {}

  goBackToDashboard(): void {
    this.router.navigate(['/trade', 'guarantee-officer-checker-dashboard']);
  }

  submitDecision(): void {
    Swal.fire({
      title: 'Submit checker decision?',
      text: 'This will complete the checker review and update the guarantee status.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Decision submitted',
          text: 'Checker decision has been recorded successfully.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/trade', 'guarantee-officer-checker-dashboard']);
        });
      }
    });
  }
}
