import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type BusinessLine = 'All' | 'Retail' | 'SME' | 'Credit Card';
type ProductStatus = 'All' | 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
type UserRole = 'Maker' | 'Checker';

interface ProductRow {
  code: string;
  name: string;
  businessLine: Exclude<BusinessLine, 'All'>;
  version: number;
  status: Exclude<ProductStatus, 'All'>;
  updatedOn: string;
}

@Component({
  selector: 'app-loms-product-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './product-dashboard.page.html'
})
export class LomsProductDashboardPageComponent {
  role: UserRole = 'Maker';

  businessLineFilter: BusinessLine = 'All';
  statusFilter: ProductStatus = 'All';
  searchTerm = '';

  businessLines: BusinessLine[] = ['All', 'Retail', 'SME', 'Credit Card'];
  statuses: ProductStatus[] = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];

  private readonly STORAGE_KEY = 'loms_products';

  products: ProductRow[] = [
    {
      code: 'RET_HOME_LOAN',
      name: 'Retail Home Loan',
      businessLine: 'Retail',
      version: 1,
      status: 'Approved',
      updatedOn: '2026-02-03'
    },
    {
      code: 'SME_TERM_LOAN',
      name: 'SME Growth Loan',
      businessLine: 'SME',
      version: 1,
      status: 'Draft',
      updatedOn: '2026-02-03'
    },
    {
      code: 'CC_PLATINUM',
      name: 'Platinum Credit Card',
      businessLine: 'Credit Card',
      version: 1,
      status: 'Submitted',
      updatedOn: '2026-02-03'
    }
  ];

  confirmModalVisible = false;
  confirmModalAction: 'submit' | 'clone' | null = null;
  actionProduct: ProductRow | null = null;
  cloneSuccessMessage = '';

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.products = JSON.parse(stored) as ProductRow[];
        } catch {
          this.persist();
        }
      } else {
        this.persist();
      }
    }
  }

  get filteredProducts(): ProductRow[] {
    return this.products.filter(p => {
      if (this.businessLineFilter !== 'All' && p.businessLine !== this.businessLineFilter) {
        return false;
      }
      if (this.statusFilter !== 'All' && p.status !== this.statusFilter) {
        return false;
      }
      const term = this.searchTerm.trim().toLowerCase();
      if (term) {
        const combined = `${p.code} ${p.name}`.toLowerCase();
        return combined.includes(term);
      }
      return true;
    });
  }

  isMaker(): boolean {
    return this.role === 'Maker';
  }

  onView(product: ProductRow): void {
    this.router.navigate(['/loms', 'product', 'view', product.code]);
  }

  onEdit(product: ProductRow): void {
    this.router.navigate(['/loms', 'product', 'create'], {
      queryParams: { mode: 'edit', code: product.code }
    });
  }

  onClone(product: ProductRow): void {
    this.router.navigate(['/loms', 'product', 'create'], {
      queryParams: { mode: 'clone', code: product.code }
    });
  }

  onSubmit(product: ProductRow): void {
    if (product.status !== 'Draft') {
      return;
    }
    product.status = 'Submitted';
    product.updatedOn = new Date().toLocaleDateString('en-US');
    this.persist();
  }

  onReview(product: ProductRow): void {
    if (product.status !== 'Submitted') {
      return;
    }
    this.router.navigate(['/loms', 'product', 'view', product.code], {
      queryParams: { mode: 'review' }
    });
  }

  openSubmitConfirm(product: ProductRow): void {
    this.confirmModalVisible = true;
    this.confirmModalAction = 'submit';
    this.actionProduct = product;
  }

  openCloneConfirm(product: ProductRow): void {
    this.confirmModalVisible = true;
    this.confirmModalAction = 'clone';
    this.actionProduct = product;
    this.cloneSuccessMessage = '';
  }

  confirmModal(): void {
    if (!this.actionProduct || !this.confirmModalAction) {
      this.closeModal();
      return;
    }
    if (this.confirmModalAction === 'submit') {
      this.onSubmit(this.actionProduct);
    } else if (this.confirmModalAction === 'clone') {
      this.onClone(this.actionProduct);
      this.cloneSuccessMessage = 'Product cloned successfully';
    }
    this.closeModal();
  }

  closeModal(): void {
    this.confirmModalVisible = false;
    this.confirmModalAction = null;
    this.actionProduct = null;
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
    }
  }
}


