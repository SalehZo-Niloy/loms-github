import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  constructor(private route: ActivatedRoute) {
    const code = this.route.snapshot.paramMap.get('code');
    const mode = this.route.snapshot.queryParamMap.get('mode');
    this.mode = mode === 'review' ? 'review' : 'view';
    if (code) {
      this.product = this.products.find(p => p.code === code) ?? null;
    }
  }
}

