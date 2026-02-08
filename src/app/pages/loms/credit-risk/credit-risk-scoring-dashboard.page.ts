import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  CreditRiskApplication,
  CreditRiskAppStatus,
  CreditRiskProductType,
  getCreditRiskApplications,
} from './credit-risk-data';

type ProductFilter = CreditRiskProductType | 'All Products';
type StatusFilter = 'All Statuses' | CreditRiskAppStatus;
type UserRole = 'Maker' | 'Checker';

@Component({
  standalone: true,
  selector: 'app-credit-risk-scoring-dashboard',
  imports: [CommonModule, NgIf, NgFor, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './credit-risk-scoring-dashboard.page.html',
})
export class CreditRiskScoringDashboardPage {
  role: UserRole = 'Maker';
  productFilter: ProductFilter = 'All Products';
  statusFilter: StatusFilter = 'All Statuses';
  searchTerm = '';

  applications: CreditRiskApplication[] = getCreditRiskApplications();

  constructor(private router: Router) {}

  get filteredApplications(): CreditRiskApplication[] {
    return this.applications.filter(app => {
      if (
        this.productFilter !== 'All Products' &&
        app.product !== this.productFilter
      ) {
        return false;
      }
      if (this.statusFilter !== 'All Statuses') {
        if (app.status !== this.statusFilter) {
          return false;
        }
      }
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        if (
          !app.appId.toLowerCase().includes(term) &&
          !app.applicant.toLowerCase().includes(term)
        ) {
          return false;
        }
      }
      return true;
    });
  }

  isMaker(): boolean {
    return this.role === 'Maker';
  }

  isChecker(): boolean {
    return this.role === 'Checker';
  }

  onOpen(app: CreditRiskApplication): void {
    const mode = this.isMaker() ? 'maker' : 'checker';
    this.router.navigate(['/loms', 'credit-risk', 'scoring', app.appId], {
      queryParams: { mode },
    });
  }
}
