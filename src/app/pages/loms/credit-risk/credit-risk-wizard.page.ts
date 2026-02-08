import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  CreditRiskConfig,
  CreditRiskGradeBand,
  CreditRiskProductType,
  approveCreditRiskConfig,
  getCreditRiskConfigById,
  rejectCreditRiskConfig,
  saveCreditRiskConfig,
} from './credit-risk-data';

type WizardMode = 'create' | 'edit' | 'clone' | 'view';

type WizardRole = 'Maker' | 'Checker';

interface MandatoryField {
  key: string;
  label: string;
  captureMode: 'Mandatory' | 'Optional' | 'Not Captured';
}

interface DimensionRow {
  key: string;
  displayName: string;
  maxPoints: number;
  weight: number;
  enabled: boolean;
}

interface RuleRow {
  bucketName: string;
  condition: string;
  points: number;
}

interface PolicyFlagRow {
  name: string;
  condition: string;
  action: 'Reject' | 'Refer';
  message: string;
  enabled: boolean;
}

@Component({
  standalone: true,
  selector: 'app-credit-risk-wizard',
  imports: [CommonModule, NgIf, NgFor, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './credit-risk-wizard.page.html',
})
export class CreditRiskWizardPage {
  steps = [
    { id: 1, label: 'Basics' },
    { id: 2, label: 'Dimensions' },
    { id: 3, label: 'Rules' },
    { id: 4, label: 'Hard-Stops' },
    { id: 5, label: 'Grades' },
    { id: 6, label: 'Review' },
  ];

  activeStep = 1;

  mode: WizardMode = 'create';
  baseId: string | null = null;
  role: WizardRole = 'Maker';

  configurationName = '';
  productType: CreditRiskProductType = 'Retail';
  effectiveFrom = '';
  version = 1;

  private readonly retailMandatoryTemplate: MandatoryField[] = [
    { key: 'monthlyGrossIncome', label: 'Monthly Gross Income', captureMode: 'Mandatory' },
    { key: 'monthlyNetIncome', label: 'Monthly Net Income', captureMode: 'Mandatory' },
    { key: 'existingEmiTotal', label: 'Existing EMI Total', captureMode: 'Mandatory' },
    { key: 'proposedEmi', label: 'Proposed EMI', captureMode: 'Mandatory' },
    { key: 'employmentType', label: 'Employment Type', captureMode: 'Mandatory' },
    { key: 'employerCategory', label: 'Employer Category', captureMode: 'Mandatory' },
    { key: 'jobTenureMonths', label: 'Job Tenure Months', captureMode: 'Mandatory' },
    { key: 'residenceTenureMonths', label: 'Residence Tenure Months', captureMode: 'Mandatory' },
    { key: 'relationshipType', label: 'Relationship Type (NTB/Existing)', captureMode: 'Mandatory' },
    { key: 'internalRepaymentHistory', label: 'Internal Repayment History', captureMode: 'Mandatory' },
    { key: 'collateralizedToggle', label: 'Collateralized Toggle', captureMode: 'Mandatory' },
    { key: 'collateralType', label: 'Collateral Type', captureMode: 'Mandatory' },
    { key: 'ltv', label: 'LTV %', captureMode: 'Mandatory' },
  ];

  private readonly cardMandatoryTemplate: MandatoryField[] = [
    { key: 'declaredMonthlyIncome', label: 'Declared Monthly Income', captureMode: 'Mandatory' },
    { key: 'verifiedIncome', label: 'Verified Income', captureMode: 'Mandatory' },
    { key: 'employmentType', label: 'Employment Type', captureMode: 'Mandatory' },
    { key: 'employerCategory', label: 'Employer Category', captureMode: 'Mandatory' },
    { key: 'jobTenureMonths', label: 'Job Tenure Months', captureMode: 'Mandatory' },
    { key: 'residenceTenureMonths', label: 'Residence Tenure Months', captureMode: 'Mandatory' },
    { key: 'existingCardLimitsTotal', label: 'Existing Card Limits Total', captureMode: 'Mandatory' },
    { key: 'utilizationRatioPct', label: 'Utilization Ratio %', captureMode: 'Mandatory' },
    { key: 'delinquencyLast12m', label: 'Delinquency Last 12m', captureMode: 'Mandatory' },
    { key: 'inquiries6m', label: 'Inquiries 6m', captureMode: 'Mandatory' },
    { key: 'channel', label: 'Channel (Branch/Digital)', captureMode: 'Mandatory' },
    { key: 'addressVerified', label: 'Address Verified', captureMode: 'Mandatory' },
  ];

  mandatoryFields: MandatoryField[] = this.retailMandatoryTemplate.map(f => ({ ...f }));

  dimensions: DimensionRow[] = [
    {
      key: 'credit_history',
      displayName: 'Credit History',
      maxPoints: 35,
      weight: 35,
      enabled: true,
    },
    {
      key: 'capacity',
      displayName: 'Capacity / Income',
      maxPoints: 30,
      weight: 30,
      enabled: true,
    },
    {
      key: 'stability',
      displayName: 'Stability',
      maxPoints: 20,
      weight: 20,
      enabled: true,
    },
    {
      key: 'behavioral',
      displayName: 'Behavioral / Utilization',
      maxPoints: 15,
      weight: 15,
      enabled: true,
    },
  ];

  rules: RuleRow[] = [
    {
      bucketName: 'New Bucket',
      condition: 'Value > 0',
      points: 10,
    },
  ];

  policyFlags: PolicyFlagRow[] = [
    {
      name: 'New Policy',
      condition: '',
      action: 'Reject',
      message: '',
      enabled: true,
    },
  ];

  gradeBands: CreditRiskGradeBand[] = [
    { grade: 'AAA', minScore: 85, maxScore: 100, recommendation: 'Auto Approve', enabled: true },
    { grade: 'AA', minScore: 75, maxScore: 84, recommendation: 'Auto Approve / Conditions', enabled: true },
    { grade: 'A', minScore: 65, maxScore: 74, recommendation: 'Approve with Conditions', enabled: true },
    { grade: 'BBB', minScore: 55, maxScore: 64, recommendation: 'Refer', enabled: true },
    { grade: 'BB', minScore: 45, maxScore: 54, recommendation: 'Refer', enabled: true },
    { grade: 'B', minScore: 35, maxScore: 44, recommendation: 'Reject/Refer', enabled: true },
    { grade: 'C', minScore: 0, maxScore: 34, recommendation: 'Reject', enabled: true },
  ];

  remarks = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const roleParam = this.route.snapshot.queryParamMap.get('role');
    if (modeParam === 'edit' || modeParam === 'clone' || modeParam === 'view') {
      this.mode = modeParam;
    }
    if (idParam) {
      this.baseId = idParam;
    }
    if (roleParam === 'Checker') {
      this.role = 'Checker';
    }

    if (this.baseId) {
      const existing = getCreditRiskConfigById(this.baseId);
      if (existing) {
        this.configurationName =
          this.mode === 'clone'
            ? `${existing.name} (Clone)`
            : existing.name;
        this.productType = existing.productType;
        this.effectiveFrom = existing.effectiveFrom;
        this.version = existing.version;
        if (existing.grades && existing.grades.length) {
          this.gradeBands = existing.grades.map(g => ({ ...g }));
        }
      }
    }

    this.applyMandatoryTemplate();
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isCheckerMode(): boolean {
    return this.role === 'Checker';
  }

  get totalMaxPoints(): number {
    return this.dimensions.reduce(
      (sum, d) => sum + (d.enabled ? d.maxPoints : 0),
      0
    );
  }

  get totalWeight(): number {
    return this.dimensions.reduce(
      (sum, d) => sum + (d.enabled ? d.weight : 0),
      0
    );
  }

  onProductTypeChange(type: CreditRiskProductType): void {
    this.productType = type;
    this.applyMandatoryTemplate();
  }

  private applyMandatoryTemplate(): void {
    const template =
      this.productType === 'Credit Card'
        ? this.cardMandatoryTemplate
        : this.retailMandatoryTemplate;
    this.mandatoryFields = template.map(f => ({ ...f }));
  }

  setActiveStep(stepId: number): void {
    if (stepId < 1 || stepId > this.steps.length) {
      return;
    }
    this.activeStep = stepId;
  }

  next(): void {
    if (this.activeStep < this.steps.length) {
      this.activeStep += 1;
    }
  }

  previous(): void {
    if (this.activeStep > 1) {
      this.activeStep -= 1;
    }
  }

  addDimension(): void {
    this.dimensions = [
      ...this.dimensions,
      {
        key: 'custom_dim',
        displayName: 'New Dimension',
        maxPoints: 0,
        weight: 0,
        enabled: true,
      },
    ];
  }

  removeDimension(index: number): void {
    this.dimensions = this.dimensions.filter((_, i) => i !== index);
  }

  addRule(): void {
    this.rules = [
      ...this.rules,
      {
        bucketName: 'New Bucket',
        condition: 'Value > 0',
        points: 10,
      },
    ];
  }

  removeRule(index: number): void {
    this.rules = this.rules.filter((_, i) => i !== index);
  }

  addPolicyFlag(): void {
    this.policyFlags = [
      ...this.policyFlags,
      {
        name: 'New Policy',
        condition: '',
        action: 'Reject',
        message: '',
        enabled: true,
      },
    ];
  }

  removePolicyFlag(index: number): void {
    this.policyFlags = this.policyFlags.filter((_, i) => i !== index);
  }

  submit(): void {
    const baseConfig: Omit<
      CreditRiskConfig,
      'id' | 'version' | 'status' | 'updatedOn'
    > = {
      name: this.configurationName,
      productType: this.productType,
      effectiveFrom: this.effectiveFrom,
      grades: this.gradeBands.map(g => ({ ...g })),
    };

    saveCreditRiskConfig(baseConfig, {
      mode: this.mode === 'edit' ? 'edit' : 'create',
      baseId: this.baseId || undefined,
    });

    this.router.navigate(['/loms/credit-risk']);
  }

  approve(): void {
    if (!this.baseId) {
      return;
    }
    approveCreditRiskConfig(this.baseId);
    this.router.navigate(['/loms/credit-risk']);
  }

  reject(): void {
    if (!this.baseId) {
      return;
    }
    rejectCreditRiskConfig(this.baseId);
    this.router.navigate(['/loms/credit-risk']);
  }
}
