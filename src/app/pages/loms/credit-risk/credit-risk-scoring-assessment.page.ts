import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  CreditRiskApplication,
  CreditRiskDimensionScore,
  getCreditRiskApplication,
  updateCreditRiskApplicationStatus,
} from './credit-risk-data';

type UserRole = 'Maker' | 'Checker';

@Component({
  standalone: true,
  selector: 'app-credit-risk-scoring-assessment',
  imports: [CommonModule, NgIf, NgFor, FormsModule, LomsLayoutComponent],
  templateUrl: './credit-risk-scoring-assessment.page.html',
})
export class CreditRiskScoringAssessmentPage {
  role: UserRole = 'Maker';
  app: CreditRiskApplication | undefined;

  dimensionScores: CreditRiskDimensionScore[] = [];

  totalScore = 0;
  grade = '-';
  decisionLabel = '-';
  missingMandatoryCount = 0;

  monthlyGrossIncome = '';
  monthlyNetIncome = '';
  existingEmiTotal = '';
  proposedEmi = '';
  employmentType = '';
  employerCategory = '';
  jobTenureMonths = '';
  residenceStabilityMonths = '';
  isCollateralized = false;
  ltvPercent = '';
  relationshipType = '';
  internalRepaymentHistory = '';
  finalScoreOverride = '';
  overrideJustification = '';
  manualOverrideEnabled = false;

  private readonly mandatoryFieldKeys: (keyof CreditRiskScoringAssessmentPage)[] = [
    'monthlyGrossIncome',
    'monthlyNetIncome',
    'existingEmiTotal',
    'proposedEmi',
    'employmentType',
    'employerCategory',
    'jobTenureMonths',
    'residenceStabilityMonths',
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    const appId = this.route.snapshot.paramMap.get('appId');
    const mode = this.route.snapshot.queryParamMap.get('mode');
    this.role = mode === 'checker' ? 'Checker' : 'Maker';
    if (appId) {
      this.app = getCreditRiskApplication(appId);
      if (this.app) {
        this.dimensionScores = this.app.dimensions.map(d => ({ ...d }));
        this.recalculateScoreAndMissing();
      }
    }
  }

  isMaker(): boolean {
    return this.role === 'Maker';
  }

  isChecker(): boolean {
    return this.role === 'Checker';
  }

  onInputChange(): void {
    if (this.isChecker()) {
      return;
    }
    this.recalculateScoreAndMissing();
  }

  goBackToWorklist(): void {
    this.router.navigate(['/loms', 'credit-risk', 'scoring']);
  }

  saveDraft(): void {
    if (!this.app || !this.isMaker()) {
      return;
    }
    updateCreditRiskApplicationStatus(this.app.appId, 'Draft');
    this.goBackToWorklist();
  }

  submitForApproval(): void {
    if (!this.app || !this.isMaker()) {
      return;
    }
    updateCreditRiskApplicationStatus(this.app.appId, 'Pending Approval');
    this.goBackToWorklist();
  }

  approve(): void {
    if (!this.app || !this.isChecker()) {
      return;
    }
    updateCreditRiskApplicationStatus(this.app.appId, 'Approved');
    this.goBackToWorklist();
  }

  reject(): void {
    if (!this.app || !this.isChecker()) {
      return;
    }
    updateCreditRiskApplicationStatus(this.app.appId, 'Rejected');
    this.goBackToWorklist();
  }

  private recalculateScoreAndMissing(): void {
    if (!this.app) {
      this.totalScore = 0;
      this.grade = '-';
      this.decisionLabel = '-';
      this.missingMandatoryCount = 0;
      this.dimensionScores = [];
      return;
    }

    let missing = 0;
    for (const key of this.mandatoryFieldKeys) {
      const value = this[key];
      if (value === null || value === undefined || value === '') {
        missing += 1;
      }
    }
    this.missingMandatoryCount = missing;

    const maxByKey: Record<string, number> = {};
    for (const d of this.dimensionScores) {
      maxByKey[d.key] = d.max;
    }

    const cibScore = this.app.cib.score || 0;
    const creditHistoryMax = maxByKey['creditHistory'] || 0;
    const creditHistoryObtained = Math.round(
      creditHistoryMax * Math.min(Math.max(cibScore, 0), 900) / 900
    );

    const capacityMax = maxByKey['capacity'] || 0;
    const gross = parseFloat(this.monthlyGrossIncome || '0');
    const net = parseFloat(this.monthlyNetIncome || '0');
    const existingEmi = parseFloat(this.existingEmiTotal || '0');
    const proposedEmi = parseFloat(this.proposedEmi || '0');
    const totalEmi = existingEmi + proposedEmi;
    let dbrRatio = 0;
    if (net > 0) {
      dbrRatio = totalEmi / net;
    }
    let capacityFactor = 0;
    if (dbrRatio > 0 && dbrRatio <= 0.4) {
      capacityFactor = 1;
    } else if (dbrRatio > 0.4 && dbrRatio <= 0.6) {
      capacityFactor = 0.7;
    } else if (dbrRatio > 0.6 && dbrRatio <= 0.8) {
      capacityFactor = 0.4;
    } else if (dbrRatio > 0.8) {
      capacityFactor = 0.1;
    }
    const capacityObtained = Math.round(capacityMax * capacityFactor);

    const stabilityMax = maxByKey['stability'] || 0;
    const jobTenure = parseInt(this.jobTenureMonths || '0', 10);
    const residenceTenure = parseInt(this.residenceStabilityMonths || '0', 10);
    const stabilityPoints =
      Math.min(jobTenure, 60) / 60 * 0.5 + Math.min(residenceTenure, 60) / 60 * 0.5;
    const stabilityObtained = Math.round(stabilityMax * Math.min(stabilityPoints, 1));

    const collateralMax = maxByKey['collateral'] || 0;
    const ltv = parseFloat(this.ltvPercent || '0');
    let collateralFactor = 0;
    if (this.isCollateralized && ltv > 0) {
      if (ltv <= 50) {
        collateralFactor = 1;
      } else if (ltv <= 70) {
        collateralFactor = 0.7;
      } else if (ltv <= 85) {
        collateralFactor = 0.4;
      } else {
        collateralFactor = 0.2;
      }
    }
    const collateralObtained = Math.round(collateralMax * collateralFactor);

    const behavioralMax = maxByKey['behavioral'] || 0;
    let behavioralFactor = 0.5;
    if (this.relationshipType === 'Existing') {
      if (this.internalRepaymentHistory === 'Good') {
        behavioralFactor = 1;
      } else if (this.internalRepaymentHistory === 'Average') {
        behavioralFactor = 0.6;
      } else if (this.internalRepaymentHistory === 'Poor') {
        behavioralFactor = 0.2;
      }
    } else if (this.relationshipType === 'New-to-Bank') {
      if (this.internalRepaymentHistory === 'Good') {
        behavioralFactor = 0.7;
      } else if (this.internalRepaymentHistory === 'Average') {
        behavioralFactor = 0.4;
      } else if (this.internalRepaymentHistory === 'Poor') {
        behavioralFactor = 0.1;
      }
    }
    const behavioralObtained = Math.round(behavioralMax * behavioralFactor);

    this.dimensionScores = this.dimensionScores.map(d => {
      if (d.key === 'creditHistory') {
        return { ...d, obtained: creditHistoryObtained };
      }
      if (d.key === 'capacity') {
        return { ...d, obtained: capacityObtained };
      }
      if (d.key === 'stability') {
        return { ...d, obtained: stabilityObtained };
      }
      if (d.key === 'collateral') {
        return { ...d, obtained: collateralObtained };
      }
      if (d.key === 'behavioral') {
        return { ...d, obtained: behavioralObtained };
      }
      return d;
    });

    const baseScore = this.dimensionScores.reduce(
      (sum, d) => sum + (d.obtained || 0),
      0
    );

    let finalScore = baseScore;
    const overrideValue = parseFloat(this.finalScoreOverride || '');
    if (this.manualOverrideEnabled && !Number.isNaN(overrideValue)) {
      finalScore = overrideValue;
    }
    if (finalScore < 0) {
      finalScore = 0;
    }
    this.totalScore = finalScore;

    if (finalScore >= 65) {
      this.grade = 'A+';
      this.decisionLabel = 'Auto Approve';
    } else if (finalScore >= 50) {
      this.grade = 'A';
      this.decisionLabel = 'Approve';
    } else if (finalScore >= 40) {
      this.grade = 'B';
      this.decisionLabel = 'Reject/Refer';
    } else {
      this.grade = 'C';
      this.decisionLabel = 'Reject/Refer';
    }
  }
}
