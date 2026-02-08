import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  KycRole,
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
  imports: [CommonModule, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './kyc-profiling.page.html',
})
export class LomsKycProfilingPageComponent {
  item: KycWorklistItem | undefined;
  profile: KycProfile | null = null;

  currentRole: KycRole | null = null;

  targetSegment = '';
  ageRangeOk = '';
  existingCustomer = '';
  creditStatus = '';

  fullName = '';
  dateOfBirth = '';
  gender = '';
  nationality = '';
  educationLevel = '';
  occupation = '';

  residenceType = '';
  yearsAtAddress = '';
  presentAddress = '';
  permanentAddress = '';
  permanentSame = '';
  mailingAddress = '';

  sourceOfFunds = '';
  grossMonthlyIncome = '';
  totalMonthlyExpenses = '';
  tin = '';
  mainBankName = '';

  maritalStatus = '';
  spouseName = '';
  dependents = '';
  nextOfKinName = '';
  relationWithNextOfKin = '';

  pepStatus = '';
  sanctionsResult = '';
  fatcaStatus = '';
  taxResidencyCountry = '';

  nidProvided = true;
  utilityProvided = true;
  tinProvided = true;

  riskScore = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    const appId = this.route.snapshot.paramMap.get('appId');
    const role = this.route.snapshot.queryParamMap.get('role');
    if (role === 'Admin' || role === 'Branch' || role === 'Checker') {
      this.currentRole = role;
    }
    if (appId) {
      this.item = getWorklistItem(appId);
      this.profile = ensureProfile(appId);
      this.riskScore = this.profile ? this.profile.riskScore : 0;
      this.fullName = this.item ? this.item.applicant : '';
    }
  }

  recalculateRisk(): void {
    let score = 0;

    if (this.dateOfBirth) {
      const birth = new Date(this.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
      }
      if (age && age < 21) {
        score += 10;
      }
    }

    if (this.pepStatus && this.pepStatus !== 'None') {
      score += 50;
    }

    if (this.sanctionsResult === 'Match Found') {
      score += 40;
    }

    const income = parseInt(this.grossMonthlyIncome || '0', 10);
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

  isChecker(): boolean {
    return this.currentRole === 'Checker';
  }

  isBranch(): boolean {
    return this.currentRole === 'Branch';
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

  approveKyc(): void {
    if (this.item) {
      updateKycStatus(this.item.appId, 'Approved');
    }
    this.router.navigate(['/loms', 'kyc']);
  }

  rejectKyc(): void {
    if (this.item) {
      updateKycStatus(this.item.appId, 'Rejected');
    }
    this.router.navigate(['/loms', 'kyc']);
  }
}

