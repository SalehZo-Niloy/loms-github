import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';
import { UiInputComponent } from '../../../../components/ui/ui-input.component';

@Component({
  selector: 'app-guarantee-application-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiInputComponent],
  templateUrl: './guarantee-application.page.html'
})
export class GuaranteeApplicationPageComponent {
  steps = [
    { id: 1, title: 'Basic Details & Parties', status: 'In progress' },
    { id: 2, title: 'Amount & Contract Details', status: 'Pending' },
    { id: 3, title: 'Documents & Review', status: 'Pending' }
  ];

  activeStep = 1;

  setActiveStep(stepId: number): void {
    this.activeStep = stepId;
  }

  get progressPercentage(): number {
    return (this.activeStep / this.steps.length) * 100;
  }
}
