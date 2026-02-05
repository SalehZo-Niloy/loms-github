import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { tradeTheme } from '../../../../../styles/theme';

interface IssuanceStep {
  id: number;
  title: string;
}

@Component({
  selector: 'app-guarantee-issuance-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './guarantee-issuance.page.html'
})
export class GuaranteeIssuancePageComponent {
  steps: IssuanceStep[] = [
    { id: 1, title: 'Guarantee Issuance' },
    { id: 2, title: 'Charges & Margin Collection' }
  ];

  activeStep = 1;
  issueConfirmed = false;
  postingConfirmed = false;

  theme = tradeTheme;

  setActiveStep(stepId: number): void {
    this.activeStep = stepId;
  }

  toggleIssueConfirmed(checked: boolean): void {
    this.issueConfirmed = checked;
  }

  togglePostingConfirmed(checked: boolean): void {
    this.postingConfirmed = checked;
  }

  issueGuarantee(): void {
    if (!this.issueConfirmed) {
      return;
    }
    this.activeStep = 2;
  }

  postChargesAndBlockMargin(): void {
    if (!this.postingConfirmed) {
      return;
    }
    this.router.navigate(['/trade', 'guarantee-officer-dashboard']);
  }

  get progressPercentage(): number {
    return (this.activeStep / this.steps.length) * 100;
  }

  get currentStageLabel(): string {
    return this.activeStep === 1 ? 'Stage 1: Pending Issuance' : 'Stage 2: Ready to Process Charges';
  }

  constructor(private router: Router) {}
}
