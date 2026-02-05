import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { KycProductType } from './kyc-data';

@Component({
  selector: 'app-loms-kyc-setup-wizard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './kyc-setup-wizard.page.html',
})
export class LomsKycSetupWizardPageComponent {
  currentStep = 1;

  setupName = '';
  productType: KycProductType | '' = '';
  effectiveFrom = '';

  includeIncomeDetails = true;
  includeEmploymentDetails = true;
  includeAddressDetails = true;

  requireIdDoc = true;
  requireAddressDoc = true;
  requireIncomeDoc = true;

  riskWeightCustomerProfile = 30;
  riskWeightProduct = 30;
  riskWeightGeography = 40;

  constructor(private router: Router) {}

  goToStep(step: number): void {
    if (step < 1 || step > 5) {
      return;
    }
    this.currentStep = step;
  }

  next(): void {
    if (this.currentStep < 5) {
      this.currentStep += 1;
    }
  }

  back(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  cancel(): void {
    this.router.navigate(['/loms', 'kyc']);
  }

  loadStandardTemplate(): void {
    this.includeIncomeDetails = true;
    this.includeEmploymentDetails = true;
    this.includeAddressDetails = true;
    this.requireIdDoc = true;
    this.requireAddressDoc = true;
    this.requireIncomeDoc = true;
    this.riskWeightCustomerProfile = 30;
    this.riskWeightProduct = 30;
    this.riskWeightGeography = 40;
  }

  saveSetup(): void {
    this.router.navigate(['/loms', 'kyc']);
  }
}

