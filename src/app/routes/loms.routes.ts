import { Routes } from '@angular/router';
import { TradeDashboardPageComponent } from '../pages/loms/dashboard/loms-dashboard.page';
import { CpvDashboardPageComponent } from '../pages/loms/cpv/dashboard/cpv-dashboard.page';
import { CpvInitiationAssignPageComponent } from '../pages/loms/cpv/initiation-assign/cpv-initiation-assign.page';
import { LomsProductDashboardPageComponent } from '../pages/loms/product/product-dashboard.page';
import { LomsProductWizardPageComponent } from '../pages/loms/product/product-wizard.page';
import { LomsProductViewPageComponent } from '../pages/loms/product/product-view.page';
import { LomsQueryDashboardPageComponent } from '../pages/loms/query/query-dashboard.page';
import { LomsQueryCreatePageComponent } from '../pages/loms/query/query-create.page';
import { LomsKycDashboardPageComponent } from '../pages/loms/kyc/kyc-dashboard.page';
import { LomsKycSetupWizardPageComponent } from '../pages/loms/kyc/kyc-setup-wizard.page';
import { LomsKycProfilingPageComponent } from '../pages/loms/kyc/kyc-profiling.page';
import { LomsSubmissionPageComponent } from '../pages/loms/submission/submission.page';

export const lomsRoutes: Routes = [
  {
    path: 'dashboard',
    component: TradeDashboardPageComponent
  },
  {
    path: 'cpv/dashboard',
    component: CpvDashboardPageComponent
  },
  {
    path: 'cpv/initiation-assign',
    component: CpvInitiationAssignPageComponent
  },
  {
    path: 'product',
    component: LomsProductDashboardPageComponent
  },
  {
    path: 'product/create',
    component: LomsProductWizardPageComponent
  },
  {
    path: 'product/view/:code',
    component: LomsProductViewPageComponent
  },
  {
    path: 'query',
    component: LomsQueryDashboardPageComponent
  },
  {
    path: 'query/create',
    component: LomsQueryCreatePageComponent
  },
  {
    path: 'query/:id',
    component: LomsQueryDashboardPageComponent
  },
  {
    path: 'kyc',
    component: LomsKycDashboardPageComponent
  },
  {
    path: 'kyc/setup/create',
    component: LomsKycSetupWizardPageComponent
  },
  {
    path: 'kyc/profiling/:appId',
    component: LomsKycProfilingPageComponent
  },
  {
    path: 'submission',
    component: LomsSubmissionPageComponent
  },
  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full'
  }
];
