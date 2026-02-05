import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  KycRole,
  KycSetup,
  KycWorklistItem,
  getKycSetups,
  getBranchWorklist,
  getCheckerWorklist,
  getActiveSetupIdForProduct,
  cloneKycSetup,
  setActiveKycSetup,
} from './kyc-data';

@Component({
  selector: 'app-loms-kyc-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './kyc-dashboard.page.html',
})
export class LomsKycDashboardPageComponent {
  currentRole: KycRole = 'Admin';

  setups: KycSetup[] = getKycSetups();
  branchItems: KycWorklistItem[] = getBranchWorklist();
  checkerItems: KycWorklistItem[] = getCheckerWorklist();

  constructor(private router: Router) {}

  get activeRetailId(): string | null {
    return getActiveSetupIdForProduct('Retail');
  }

  get activeCardId(): string | null {
    return getActiveSetupIdForProduct('CreditCard');
  }

  onRoleChange(): void {}

  createNewSetup(): void {
    this.router.navigate(['/loms', 'kyc', 'setup', 'create']);
  }

  cloneSetup(setup: KycSetup): void {
    const cloned = cloneKycSetup(setup.id);
    if (cloned) {
      this.setups = getKycSetups();
    }
  }

  submitSetup(setup: KycSetup): void {
    setActiveKycSetup(setup.id);
    this.setups = getKycSetups();
  }

  editSetup(setup: KycSetup): void {
    this.router.navigate(['/loms', 'kyc', 'setup', 'create'], {
      queryParams: { mode: 'edit', id: setup.id },
    });
  }

  startKyc(appId: string): void {
    this.router.navigate(['/loms', 'kyc', 'profiling', appId]);
  }
}
