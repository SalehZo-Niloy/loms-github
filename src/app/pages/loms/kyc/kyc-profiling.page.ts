import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  KycWorklistItem,
  KycProfile,
  ensureProfile,
  getWorklistItem,
  updateKycStatus,
  updateRiskScore,
} from './kyc-data';

@Component({
  selector: 'app-loms-kyc-profiling-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './kyc-profiling.page.html',
})
export class LomsKycProfilingPageComponent {
  item: KycWorklistItem | undefined;
  profile: KycProfile | null = null;

  applicantAge = '';
  isPep = 'No';
  sanctionsResult = 'Clear';
  monthlyIncome = '';

  riskScore = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    const appId = this.route.snapshot.paramMap.get('appId');
    if (appId) {
      this.item = getWorklistItem(appId);
      this.profile = ensureProfile(appId);
      this.riskScore = this.profile ? this.profile.riskScore : 0;
    }
  }

  recalculateRisk(): void {
    let score = 0;

    const age = parseInt(this.applicantAge || '0', 10);
    if (age && age < 21) {
      score += 10;
    }

    if (this.isPep === 'Yes') {
      score += 50;
    }

    if (this.sanctionsResult === 'Hit') {
      score += 40;
    }

    const income = parseInt(this.monthlyIncome || '0', 10);
    if (income && income > 100000) {
      score += 10;
    }

    if (score > 100) {
      score = 100;
    }

    this.riskScore = score;
    if (this.profile) {
      updateRiskScore(this.profile.appId, score);
    }
  }

  saveDraft(): void {
    if (this.item) {
      updateKycStatus(this.item.appId, 'In Progress');
    }
    this.router.navigate(['/loms', 'kyc']);
  }

  submitForApproval(): void {
    if (this.item) {
      updateKycStatus(this.item.appId, 'Submitted');
    }
    this.router.navigate(['/loms', 'kyc']);
  }
}

