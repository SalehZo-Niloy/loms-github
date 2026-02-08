import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type BusinessLine = 'Retail' | 'SME' | 'Credit Card';
type ProductStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

interface ProductSummary {
  code: string;
  name: string;
  businessLine: BusinessLine;
  version: number;
  status: ProductStatus;
  updatedOn: string;
}

@Component({
  selector: 'app-loms-product-view-page',
  standalone: true,
  imports: [CommonModule, LomsLayoutComponent, RouterLink],
  templateUrl: './product-view.page.html'
})
export class LomsProductViewPageComponent {
  product: ProductSummary | null = null;
  mode: 'view' | 'review' = 'view';

  private readonly STORAGE_KEY = 'loms_products';

  private products: ProductSummary[] = [
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

  constructor(private route: ActivatedRoute, private router: Router) {
    const code = this.route.snapshot.paramMap.get('code');
    const mode = this.route.snapshot.queryParamMap.get('mode');
    this.mode = mode === 'review' ? 'review' : 'view';

    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          this.products = JSON.parse(stored) as ProductSummary[];
        } catch {
          window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
        }
      } else {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
      }
    }

    if (code) {
      this.product = this.products.find(p => p.code === code) ?? null;
    }
  }

  get canApproveOrReject(): boolean {
    return this.mode === 'review' && this.product?.status === 'Submitted';
  }

  approve(): void {
    this.updateStatus('Approved');
  }

  reject(): void {
    this.updateStatus('Rejected');
  }

  private updateStatus(status: ProductStatus): void {
    if (!this.product || !this.canApproveOrReject) {
      return;
    }

    this.product.status = status;
    this.product.updatedOn = new Date().toLocaleDateString('en-US');
    this.persist();
    this.router.navigate(['/loms', 'product']);
  }

  private persist(): void {
    if (typeof window === 'undefined' || !this.product) {
      return;
    }

    const stored = window.localStorage.getItem(this.STORAGE_KEY);
    let products: ProductSummary[] = [];

    if (stored) {
      try {
        products = JSON.parse(stored) as ProductSummary[];
      } catch {
        products = [];
      }
    }

    const index = products.findIndex(
      p => p.code === this.product?.code && p.version === this.product?.version
    );

    if (index >= 0) {
      products[index] = this.product;
    } else {
      products.unshift(this.product);
    }

    window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }
}

