import { Routes } from '@angular/router';
import { TradeDashboardPageComponent } from '../pages/loms/dashboard/loms-dashboard.page';
import { LomsDedupApplicationPageComponent } from '../pages/loms/de-dup/de-dup-application.page';
import { LomsLoanApplicationPageComponent } from '../pages/loms/loan-application/loan-application.page';
import { LomsDemographicApplicationPageComponent } from '../pages/loms/demographic-application/demographic-application.page';
import { LomsProductApplicationPageComponent } from '../pages/loms/product-application/product-application.page';
import { LomsFinancialApplicationPageComponent } from '../pages/loms/financial-application/financial-application.page';
import { LomsSecurityApplicationPageComponent } from '../pages/loms/security-application/security-application.page';
import { LomsDocumentApplicationPageComponent } from '../pages/loms/document-application/document-application.page';
import { LomsApplicationPreviewPageComponent } from '../pages/loms/application-preview/application-preview.page';
import { CpvDashboardPageComponent } from '../pages/loms/cpv/dashboard/cpv-dashboard.page';
import { CpvInitiationAssignPageComponent } from '../pages/loms/cpv/initiation-assign/cpv-initiation-assign.page';
import { CpvFinalizationPageComponent } from '../pages/loms/cpv/finalization/cpv-finalization.page';
import { LomsProductDashboardPageComponent } from '../pages/loms/product/product-dashboard.page';
import { LomsProductWizardPageComponent } from '../pages/loms/product/product-wizard.page';
import { LomsProductViewPageComponent } from '../pages/loms/product/product-view.page';
import { LomsQueryDashboardPageComponent } from '../pages/loms/query/query-dashboard.page';
import { LomsQueryCreatePageComponent } from '../pages/loms/query/query-create.page';
import { LomsKycDashboardPageComponent } from '../pages/loms/kyc/kyc-dashboard.page';
import { LomsKycSetupWizardPageComponent } from '../pages/loms/kyc/kyc-setup-wizard.page';
import { LomsKycProfilingPageComponent } from '../pages/loms/kyc/kyc-profiling.page';
// import { LomsSubmissionPageComponent } from '../pages/loms/submission/submission.page';
// import { LomsProductDashboardPageComponent } from '../pages/loms/product/product-dashboard.page';
// import { LomsProductWizardPageComponent } from '../pages/loms/product/product-wizard.page';
// import { LomsProductViewPageComponent } from '../pages/loms/product/product-view.page';
// import { LomsQueryDashboardPageComponent } from '../pages/loms/query/query-dashboard.page';
// import { LomsQueryCreatePageComponent } from '../pages/loms/query/query-create.page';
// import { LomsKycDashboardPageComponent } from '../pages/loms/kyc/kyc-dashboard.page';
// import { LomsKycSetupWizardPageComponent } from '../pages/loms/kyc/kyc-setup-wizard.page';
// import { LomsKycProfilingPageComponent } from '../pages/loms/kyc/kyc-profiling.page';
import { LomsSubmissionPageComponent } from '../pages/loms/submission/submission.page';
import { CreditRiskDashboardPage } from '../pages/loms/credit-risk/credit-risk-dashboard.page';
import { CreditRiskWizardPage } from '../pages/loms/credit-risk/credit-risk-wizard.page';
import { CreditRiskScoringDashboardPage } from '../pages/loms/credit-risk/credit-risk-scoring-dashboard.page';
import { CreditRiskScoringAssessmentPage } from '../pages/loms/credit-risk/credit-risk-scoring-assessment.page';
import { LomsFormBuilderPageComponent } from '../pages/loms/form-builder/form-builder.page';

export const lomsRoutes: Routes = [
  {
    path: 'dashboard',
    component: TradeDashboardPageComponent
  },
  {
    path: 'de-dup/application',
    component: LomsDedupApplicationPageComponent
  },
  {
    path: 'loan-application/application',
    component: LomsLoanApplicationPageComponent
  },
  {
    path: 'demographic-application/application',
    component: LomsDemographicApplicationPageComponent
  },
  {
    path: 'product-application/application',
    component: LomsProductApplicationPageComponent
  },
  {
    path: 'financial-application/application',
    component: LomsFinancialApplicationPageComponent
  },
  {
    path: 'security-application/application',
    component: LomsSecurityApplicationPageComponent
  },
  {
    path: 'document-application/application',
    component: LomsDocumentApplicationPageComponent
  },
  {
    path: 'application-preview',
    component: LomsApplicationPreviewPageComponent
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
    path: 'cpv/finalization',
    component: CpvFinalizationPageComponent
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
    path: 'credit-risk',
    component: CreditRiskDashboardPage
  },
  {
    path: 'credit-risk/create',
    component: CreditRiskWizardPage
  },
  {
    path: 'credit-risk/scoring',
    component: CreditRiskScoringDashboardPage
  },
  {
    path: 'credit-risk/scoring/:appId',
    component: CreditRiskScoringAssessmentPage
  },
  {
    path: 'form-builder',
    component: LomsFormBuilderPageComponent
  },
  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full'
  }
];
