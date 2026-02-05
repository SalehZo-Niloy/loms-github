import { Routes } from '@angular/router';
import { TradeDashboardPageComponent } from '../pages/trade/dashboard/trade-dashboard.page';
import { GuaranteeApplicationPageComponent } from '../pages/trade/guarantee/guarantee-application/guarantee-application.page';
import { GuaranteeIssuancePageComponent } from '../pages/trade/guarantee/officer-dashboard/guarantee-issuance/guarantee-issuance.page';
import { GuaranteeOfficerDashboardPageComponent } from '../pages/trade/guarantee/officer-dashboard/officer-dashboard.page';
import { GuaranteeApplicationReviewPageComponent } from '../pages/trade/guarantee/officer-dashboard/guarantee-application-review/guarantee-application-review.page';
import { CreateSwiftMessagePageComponent } from '../pages/trade/guarantee/officer-dashboard/create-swift-message/create-swift-message.page';
import { GuaranteeAmendmentReviewPageComponent } from '../pages/trade/guarantee/officer-dashboard/amendment-processing/guarantee-amendment-review.page';
import { GuaranteeAmendmentSwiftPageComponent } from '../pages/trade/guarantee/officer-dashboard/amendment-processing/guarantee-amendment-swift.page';
import { GuaranteeAmendmentFinalReviewPageComponent } from '../pages/trade/guarantee/officer-dashboard/amendment-processing/guarantee-amendment-final-review.page';
import { GuaranteeOfficerCheckerDashboardPageComponent } from '../pages/trade/guarantee/guarantee-officer-checker-dashboard/guarantee-officer-checker-dashboard.page';
import { GuaranteeCheckerApplicationReviewPageComponent } from '../pages/trade/guarantee/guarantee-officer-checker-dashboard/application-review/application-review.page';
import { GuaranteeClaimHandlingPageComponent } from '../pages/trade/guarantee/officer-dashboard/claim/guarantee-claim-handling.page';
import { GuaranteeClaimSettlementPageComponent } from '../pages/trade/guarantee/officer-dashboard/claim/guarantee-claim-settlement.page';
import { GuaranteeRegulatoryEvaluationPageComponent } from '../pages/trade/guarantee/regulatory-officer-dashboard/regulatory-evaluation/regulatory-evaluation.page';
import { ImportApplicationPageComponent } from '../pages/trade/import/import-application/import-application.page';
import { ImportSubmittingPageComponent } from '../pages/trade/import/import-application/submitting/submitting.page';
import { ImportSubmittingViewPageComponent } from '../pages/trade/import/import-application/submitting/submitting.page.view';
import { ImportCustomerViewPageComponent } from '../pages/trade/import/import-application/submitting/customer-view.page';
import { ImportDocumentHandoverPageComponent } from '../pages/trade/import/import-application/document-handover/document-handover.page';
import { DocumentHandoverViewComponent } from '../pages/trade/import/import-application/document-handover/document-handover-view.component';
import { ImportPendingReviewPageComponent } from '../pages/trade/import/import-application/pending-review/pending-review.page';
import { PendingReviewViewComponent } from '../pages/trade/import/import-application/pending-review/pending-review-view.component';
import { ImportLcIssuancePageComponent } from '../pages/trade/import/import-application/lc-issuance/lc-issuance.page';
import { LcChargeCollectionPageComponent } from '../pages/trade/import/import-application/lc-charge-collection/lc-charge-collection.page';
import { LcMarginCollectionPageComponent } from '../pages/trade/import/import-application/lc-margin-collection/lc-margin-collection.page';
import { LcAcceptancePageComponent } from '../pages/trade/import/import-application/lc-acceptance/lc-acceptance.page';
import { LcAmendmentRequestPageComponent } from '../pages/trade/import/import-application/lc-amendment-request/lc-amendment-request.page';
import { DocumentReceivePageComponent } from '../pages/trade/import/import-application/document-receive/document-receive.page';
import { DocumentCheckingPageComponent } from '../pages/trade/import/import-application/document-checking/document-checking.page';
import { DiscrepancyRecordPageComponent } from '../pages/trade/import/import-application/discrepancy-record/discrepancy-record.page';
import { DiscrepancyRecordConfirmationComponent } from '../pages/trade/import/import-application/discrepancy-record/discrepancy-record-confirmation.component';
import { DiscrepancyRecordNotificationComponent } from '../pages/trade/import/import-application/discrepancy-record/discrepancy-record-notification.component';
import { DiscrepancyRecordRejectComponent } from '../pages/trade/import/import-application/discrepancy-record/discrepancy-record-reject.component';
import { LcSettlementDecisionPageComponent } from '../pages/trade/import/import-application/lc-settlement-decision/lc-settlement-decision.page';
import { PadCreationPageComponent } from '../pages/trade/import/import-application/pad-creation/pad-creation.page';
import { ExecutePaymentPageComponent } from '../pages/trade/import/import-application/execute-payment/execute-payment.page';
import { LcClosurePageComponent } from '../pages/trade/import/import-application/lc-closure/lc-closure.page';
// import { TradeDashboardPageComponent } from '../pages/trade/dashboard/trade-dashboard.page';
// import { GuaranteeApplicationPageComponent } from '../pages/trade/guarantee/guarantee-application/guarantee-application.page';
import { CustomerDashboardPageComponent } from '../pages/trade/dc-advising/customer/dashboard/customer-dashboard.page';
import { CreateRequestPageComponent } from '../pages/trade/dc-advising/customer/create-request/create-request.page';
import { RequestDetailsPageComponent } from '../pages/trade/dc-advising/customer/request-details/request-details.page';
import { RODashboardPageComponent } from '../pages/trade/dc-advising/ro/dashboard/ro-dashboard.page';
import { RORequestDetailsPageComponent } from '../pages/trade/dc-advising/ro/request-details/ro-request-details.page';
import { TradeOfficerDashboardPageComponent } from '../pages/trade/dc-advising/to/dashboard/to-dashboard.page';
import { TradeOfficerRequestDetailsPageComponent } from '../pages/trade/dc-advising/to/request-details/to-request-details.page';
import { ApproverDashboardPageComponent } from '../pages/trade/dc-advising/approver/dashboard/approver-dashboard.page';
import { ApproverRequestDetailsPageComponent } from '../pages/trade/dc-advising/approver/request-details/approver-request-details.page';
import { ExportBillCustomerDashboardPageComponent } from '../pages/trade/export-bill/customer/dashboard/export-bill-customer-dashboard.page';
import { ExportBillCustomerRequestDetailsPageComponent } from '../pages/trade/export-bill/customer/request-details/export-bill-customer-request-details.page';
import { CreateExportBillPageComponent } from '../pages/trade/export-bill/customer/create/create-export-bill.page';
import { ExportBillRoDashboardPageComponent } from '../pages/trade/export-bill/ro/dashboard/export-bill-ro-dashboard.page';
import { ExportBillRORequestDetailsPageComponent } from '../pages/trade/export-bill/ro/request-details/export-bill-ro-request-details.page';
import { ExportBillToDashboardPageComponent } from '../pages/trade/export-bill/to/dashboard/export-bill-to-dashboard.page';
import { ExportBillToRequestDetailsPageComponent } from '../pages/trade/export-bill/to/request-details/export-bill-to-request-details.page';
import { ExportBillApproverDashboardPageComponent } from '../pages/trade/export-bill/approver/dashboard/export-bill-approver-dashboard.page';
import { ExportBillApproverRequestDetailsPageComponent } from '../pages/trade/export-bill/approver/request-details/export-bill-approver-request-details.page';
import { ExportProceedToDashboardPageComponent } from '../pages/trade/export-proceed/to/dashboard/export-proceed-to-dashboard.page';
import { ExportProceedToRequestDetailsPageComponent } from '../pages/trade/export-proceed/to/request-details/export-proceed-to-request-details.page';
import { ExportProceedApproverDashboardPageComponent } from '../pages/trade/export-proceed/approver/dashboard/export-proceed-approver-dashboard.page';
import { ExportProceedApproverRequestDetailsPageComponent } from '../pages/trade/export-proceed/approver/request-details/export-proceed-approver-request-details.page';
import { ExportProceedCustomerDashboardPageComponent } from '../pages/trade/export-proceed/customer/dashboard/export-proceed-customer-dashboard.page';
import { ExportProceedCustomerRequestDetailsPageComponent } from '../pages/trade/export-proceed/customer/request-details/export-proceed-customer-request-details.page';
import { MasterLCCustomerDashboardPageComponent } from '../pages/trade/master-lc/customer/dashboard/master-lc-customer-dashboard.page';
import { MasterLCCreatePageComponent } from '../pages/trade/master-lc/customer/create/master-lc-create.page';
import { MasterLCToDashboardPageComponent } from '../pages/trade/master-lc/to/dashboard/master-lc-to-dashboard.page';
import { MasterLCToRequestDetailsPageComponent } from '../pages/trade/master-lc/to/request-details/master-lc-to-request-details.page';
import { MasterLCManagerDashboardPageComponent } from '../pages/trade/master-lc/manager/dashboard/master-lc-manager-dashboard.page';
import { MasterLCManagerRequestDetailsPageComponent } from '../pages/trade/master-lc/manager/request-details/master-lc-manager-request-details.page';
import { ReportBuilderPageComponent } from '../pages/trade/report-builder/report-builder.page';

export const tradeRoutes: Routes = [
  {
    path: 'dashboard',
    component: TradeDashboardPageComponent
  },
  {
    path: 'guarantee',
    component: GuaranteeApplicationPageComponent
  },
  {
    path: 'guarantee-regulatory-evaluation',
    component: GuaranteeRegulatoryEvaluationPageComponent
  },
  {
    path: 'guarantee-issuance',
    component: GuaranteeIssuancePageComponent
  },
  {
    path: 'guarantee-amendment-processing',
    component: GuaranteeAmendmentReviewPageComponent
  },
  {
    path: 'guarantee-amendment-processing/create-swift',
    component: GuaranteeAmendmentSwiftPageComponent
  },
  {
    path: 'guarantee-amendment-processing/final-review',
    component: GuaranteeAmendmentFinalReviewPageComponent
  },
  {
    path: 'guarantee-officer-dashboard',
    component: GuaranteeOfficerDashboardPageComponent
  },
  {
    path: 'guarantee-claim-handling',
    component: GuaranteeClaimHandlingPageComponent
  },
  {
    path: 'guarantee-claim-settlement',
    component: GuaranteeClaimSettlementPageComponent
  },
  {
    path: 'guarantee-officer-checker-dashboard',
    component: GuaranteeOfficerCheckerDashboardPageComponent
  },
  {
    path: 'guarantee-officer-checker-dashboard/application-review',
    component: GuaranteeCheckerApplicationReviewPageComponent
  },
  {
    path: 'guarantee-application-review',
    component: GuaranteeApplicationReviewPageComponent
  },
  {
    path: 'create-swift-message',
    component: CreateSwiftMessagePageComponent
  },
  {
    path: 'import',
    component: ImportApplicationPageComponent
  },
  {
    path: 'import/submitting',
    component: ImportSubmittingViewPageComponent
  },
  {
    path: 'import/submitting/create',
    component: ImportSubmittingPageComponent
  },
  {
    path: 'import/customer-view',
    component: ImportCustomerViewPageComponent
  },
  {
    path: 'import/document-handover',
    component: ImportDocumentHandoverPageComponent
  },
  {
    path: 'import/document-handover/view/:reference',
    component: DocumentHandoverViewComponent
  },
  {
    path: 'import/pending-review',
    component: ImportPendingReviewPageComponent
  },
  {
    path: 'import/pending-review/view/:reference',
    component: PendingReviewViewComponent
  },
  {
    path: 'import/lc-issuance',
    component: ImportLcIssuancePageComponent
  },
  {
    path: 'import/lc-charge-collection',
    component: LcChargeCollectionPageComponent
  },
  {
    path: 'import/lc-margin-collection',
    component: LcMarginCollectionPageComponent
  },
  {
    path: 'import/lc-acceptance',
    component: LcAcceptancePageComponent
  },
  {
    path: 'import/lc-amendment-request',
    component: LcAmendmentRequestPageComponent
  },
  {
    path: 'import/document-receive',
    component: DocumentReceivePageComponent
  },
  {
    path: 'import/document-checking',
    component: DocumentCheckingPageComponent
  },
  {
    path: 'import/discrepancy-record',
    component: DiscrepancyRecordPageComponent
  },
  {
    path: 'import/discrepancy-record/confirmation',
    component: DiscrepancyRecordConfirmationComponent
  },
  {
    path: 'import/discrepancy-record/notification',
    component: DiscrepancyRecordNotificationComponent
  },
  {
    path: 'import/discrepancy-record/reject',
    component: DiscrepancyRecordRejectComponent
  },
  {
    path: 'import/lc-settlement-decision',
    component: LcSettlementDecisionPageComponent
  },
  {
    path: 'import/pad-creation',
    component: PadCreationPageComponent
  },
  {
    path: 'import/execute-payment',
    component: ExecutePaymentPageComponent
  },
  {
    path: 'import/lc-closure',
    component: LcClosurePageComponent
  },
  {
    path: 'dc-advising/customer/dashboard',
    component: CustomerDashboardPageComponent
  },
  {
    path: 'dc-advising/customer/create-request',
    component: CreateRequestPageComponent
  },
  {
    path: 'dc-advising/customer/request/:id',
    component: RequestDetailsPageComponent
  },
  {
    path: 'dc-advising/ro/dashboard',
    component: RODashboardPageComponent
  },
  {
    path: 'dc-advising/ro/request/:id',
    component: RORequestDetailsPageComponent
  },
  {
    path: 'dc-advising/to/dashboard',
    component: TradeOfficerDashboardPageComponent
  },
  {
    path: 'dc-advising/to/request/:id',
    component: TradeOfficerRequestDetailsPageComponent
  },
  {
    path: 'dc-advising/approver/dashboard',
    component: ApproverDashboardPageComponent
  },
  {
    path: 'dc-advising/approver/request/:id',
    component: ApproverRequestDetailsPageComponent
  },
  {
    path: 'export-bill/customer/dashboard',
    component: ExportBillCustomerDashboardPageComponent
  },
  {
    path: 'export-bill/customer/request/:id',
    component: ExportBillCustomerRequestDetailsPageComponent
  },
  {
    path: 'export-bill/customer/create',
    component: CreateExportBillPageComponent
  },
  {
    path: 'export-bill/ro/dashboard',
    component: ExportBillRoDashboardPageComponent
  },
  {
    path: 'export-bill/ro/request/:id',
    component: ExportBillRORequestDetailsPageComponent
  },
  {
    path: 'export-bill/to/dashboard',
    component: ExportBillToDashboardPageComponent
  },
  {
    path: 'export-bill/to/request/:id',
    component: ExportBillToRequestDetailsPageComponent
  },
  {
    path: 'export-bill/approver/dashboard',
    component: ExportBillApproverDashboardPageComponent
  },
  {
    path: 'export-bill/approver/request/:id',
    component: ExportBillApproverRequestDetailsPageComponent
  },
  {
    path: 'export-proceed/to/dashboard',
    component: ExportProceedToDashboardPageComponent
  },
  {
    path: 'export-proceed/to/request/:id',
    component: ExportProceedToRequestDetailsPageComponent
  },
  {
    path: 'export-proceed/approver/dashboard',
    component: ExportProceedApproverDashboardPageComponent
  },
  {
    path: 'export-proceed/approver/request/:id',
    component: ExportProceedApproverRequestDetailsPageComponent
  },
  {
    path: 'export-proceed/customer/dashboard',
    component: ExportProceedCustomerDashboardPageComponent
  },
  {
    path: 'export-proceed/customer/request/:id',
    component: ExportProceedCustomerRequestDetailsPageComponent
  },
  {
    path: 'master-lc/customer/dashboard',
    component: MasterLCCustomerDashboardPageComponent
  },
  {
    path: 'master-lc/customer/create',
    component: MasterLCCreatePageComponent
  },
  {
    path: 'master-lc/to/dashboard',
    component: MasterLCToDashboardPageComponent
  },
  {
    path: 'master-lc/to/request/:id',
    component: MasterLCToRequestDetailsPageComponent
  },
  {
    path: 'master-lc/manager/dashboard',
    component: MasterLCManagerDashboardPageComponent
  },
  {
    path: 'master-lc/manager/request/:id',
    component: MasterLCManagerRequestDetailsPageComponent
  },
  {
    path: 'report-builder',
    component: ReportBuilderPageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
