import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import {
  CreditRiskConfig,
  CreditRiskProductType,
  getActiveConfigIdForProduct,
  getCreditRiskConfigs,
} from './credit-risk-data';

type FilterStatus = 'All Statuses' | 'Draft' | 'Active' | 'Inactive';
type UserRole = 'Maker' | 'Checker';

@Component({
  standalone: true,
  selector: 'app-credit-risk-dashboard',
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './credit-risk-dashboard.page.html',
})
export class CreditRiskDashboardPage {
  role: UserRole = 'Maker';
  productFilter: CreditRiskProductType | 'All Products' = 'All Products';
  statusFilter: FilterStatus = 'All Statuses';
  searchTerm = '';

  configs: CreditRiskConfig[] = getCreditRiskConfigs();

  activeRetailId = getActiveConfigIdForProduct('Retail');
  activeCardId = getActiveConfigIdForProduct('Credit Card');

  constructor(private router: Router) {}

  get filteredConfigs(): CreditRiskConfig[] {
    return this.configs.filter(cfg => {
      if (
        this.productFilter !== 'All Products' &&
        cfg.productType !== this.productFilter
      ) {
        return false;
      }
      if (this.statusFilter !== 'All Statuses') {
        if (cfg.status !== this.statusFilter) {
          return false;
        }
      }
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        if (
          !cfg.id.toLowerCase().includes(term) &&
          !cfg.name.toLowerCase().includes(term)
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

  onNewConfiguration(): void {
    this.router.navigate(['/loms/credit-risk/create']);
  }

  onView(cfg: CreditRiskConfig): void {
    const queryParams =
      this.role === 'Checker'
        ? { mode: 'view', id: cfg.id, role: 'Checker' }
        : { mode: 'view', id: cfg.id };

    this.router.navigate(['/loms/credit-risk/create'], { queryParams });
  }

  onEdit(cfg: CreditRiskConfig): void {
    this.router.navigate(['/loms/credit-risk/create'], {
      queryParams: { mode: 'edit', id: cfg.id },
    });
  }

  onClone(cfg: CreditRiskConfig): void {
    this.router.navigate(['/loms/credit-risk/create'], {
      queryParams: { mode: 'clone', id: cfg.id },
    });
  }
}
