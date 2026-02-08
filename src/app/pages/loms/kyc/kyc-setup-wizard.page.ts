import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { KycProductType } from './kyc-data';

type KycFieldType = 'text' | 'select' | 'number' | 'toggle' | 'textarea';

interface KycFieldDefinition {
  label: string;
  type: KycFieldType;
}

interface KycSectionDefinition {
  id: number;
  title: string;
  code: string;
  fields: KycFieldDefinition[];
}

@Component({
  selector: 'app-loms-kyc-setup-wizard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './kyc-setup-wizard.page.html',
})
export class LomsKycSetupWizardPageComponent {
  currentStep = 1;

  steps = [
    { number: 1, name: 'Basics' },
    { number: 2, name: 'Fields' },
    { number: 3, name: 'Documents' },
    { number: 4, name: 'Risk Weights' },
    { number: 5, name: 'Review' },
  ];

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

  sections: KycSectionDefinition[] = [
    {
      id: 1,
      title: 'Eligibility & Screening',
      code: 'ELIGIBILITY',
      fields: [
        { label: 'Target Segment', type: 'select' },
        { label: 'Is Applicant 18–65 years old', type: 'toggle' },
        { label: 'Is Existing Customer?', type: 'toggle' },
        { label: 'Credit Bureau Status', type: 'select' },
      ],
    },
    {
      id: 2,
      title: 'Demographic Information',
      code: 'DEMOGRAPHIC',
      fields: [
        { label: 'Full Legal Name', type: 'text' },
        { label: 'Date of Birth', type: 'date' as KycFieldType },
        { label: 'Gender', type: 'select' },
        { label: 'Nationality', type: 'text' },
        { label: 'Education Level', type: 'select' },
        { label: 'Occupation / Profession', type: 'text' },
      ],
    },
    {
      id: 3,
      title: 'Address & Residency',
      code: 'RESIDENCY',
      fields: [
        { label: 'Residence Type', type: 'select' },
        { label: 'Years at Current Address', type: 'number' },
        { label: 'Present Address', type: 'textarea' },
        { label: 'Permanent Address', type: 'textarea' },
        { label: 'Preferred Mailing Address', type: 'select' },
      ],
    },
    {
      id: 4,
      title: 'Financial Profile',
      code: 'FINANCIAL',
      fields: [
        { label: 'Primary Source of Funds', type: 'select' },
        { label: 'Gross Monthly Income', type: 'number' },
        { label: 'Total Monthly Expenses', type: 'number' },
        { label: 'Tax Identification No (TIN)', type: 'text' },
        { label: 'Main Bank Name', type: 'text' },
      ],
    },
    {
      id: 5,
      title: 'Family & Relationships',
      code: 'FAMILY',
      fields: [
        { label: 'Marital Status', type: 'select' },
        { label: 'Spouse Name', type: 'text' },
        { label: 'No. of Dependents', type: 'number' },
        { label: 'Next of Kin Name', type: 'text' },
        { label: 'Relation with Next of Kin', type: 'text' },
      ],
    },
    {
      id: 6,
      title: 'Political & Regulatory Screening',
      code: 'POLITICAL',
      fields: [
        { label: 'PEP Status', type: 'select' },
        { label: 'Sanctions Screening Result', type: 'select' },
        { label: 'FATCA / US Person', type: 'toggle' },
        { label: 'Country of Tax Residency', type: 'text' },
      ],
    },
  ];

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

