import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { UiStepTimelineComponent } from '../../../../../components/ui/ui-step-timeline.component';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

@Component({
  selector: 'app-import-customer-view-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, FormsModule, UiButtonComponent, UiStepTimelineComponent, PdfJsViewerModule],
  templateUrl: './customer-view.page.html'
})
export class ImportCustomerViewPageComponent implements OnInit, OnDestroy {
  viewAs = 'Customer';
  referenceNumber = 'LC-2025-001';
  requestDateTime = new Date().toLocaleString();
  submittedBy = '';
  currentStatus = 'Under Review';
  currentStatusDescription = 'Your application has been received and is currently being reviewed by our trade finance team.';

  workflow = [
    { label: 'Application Submitted', status: 'Completed' },
    { label: 'Bank Review', status: 'In Progress' },
    { label: 'Approval & Issuance', status: 'Pending' }
  ];

  summary = {
    typeOfLc: '',
    invoiceAmount: '',
    currency: '',
    beneficiaryName: '',
    beneficiaryCountry: '',
    incoterms: '',
    goodsDescription: '',
    expectedShipment: ''
  };

  uploadedReference = {
    fileName: 'No file uploaded',
    uploadedAt: '-'
  };

  acknowledgements = [
    'Application received successfully',
    'Initial validation passed',
    'Assigned to Trade Finance Officer'
  ];

  timelineSteps = [
    {
      label: 'LC Initiated',
      description: 'Request submitted'
    },
    {
      label: 'Bank Review',
      description: 'Documents verified'
    },
    {
      label: 'Application Entry',
      description: 'System processed'
    },
    {
      label: 'LC Draft Prepared',
      description: 'Draft created'
    },
    {
      label: 'LC Approved',
      description: 'Final approval'
    },
    {
      label: 'LC Issuance',
      description: 'In progress'
    }
  ];

  currentStepIndex = 0;

  isLoading = true;
  hasError = false;
  errorMessage = '';
  hasSummaryData = false;

  draftPdfPath = '/assets/pdf/101.pdf';
  draftLoading = false;
  draftError = '';
  showDraftModal = false;
  isAuthorizedForDraft = true;

  private subscription: Subscription = new Subscription();

  constructor(
    private importLcStateService: ImportLcStateService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.updateCurrentStepFromStatus(this.currentStatus);

    const referenceFromQuery = this.route.snapshot.queryParamMap.get('reference');

    if (referenceFromQuery && typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('importLcRequests');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const match = parsed.find((item: any) => item.reference === referenceFromQuery);
            if (match) {
              if (match.status) {
                this.currentStatus = match.status;
              }
              if (match.statusDescription) {
                this.currentStatusDescription = match.statusDescription;
              }
              this.updateCurrentStepFromStatus(this.currentStatus);
              this.populateFromStored(match);
              this.hasSummaryData = true;
              this.isLoading = false;
              return;
            }
          }
        }
      } catch (error) {
        console.error('Failed to load import LC request details', error);
        this.hasError = true;
        this.errorMessage = 'Unable to load request details. Please try again.';
        this.isLoading = false;
      }
    }

    this.subscription = this.importLcStateService.state$.subscribe((state) => {
      this.submittedBy = state.applicantName || 'Unknown Applicant';

      this.summary = {
        typeOfLc: state.lcType || '-',
        invoiceAmount: state.invoiceAmount || '-',
        currency: state.currency || '-',
        beneficiaryName: state.beneficiaryName || '-',
        beneficiaryCountry: state.beneficiaryCountry || '-',
        incoterms: state.incoterm || '-',
        goodsDescription: state.goodsDescription || '-',
        expectedShipment: state.shipmentPeriod || '-'
      };

      if ((state as any).poReferenceFileName) {
        this.uploadedReference = {
          fileName: (state as any).poReferenceFileName,
          uploadedAt: new Date().toLocaleDateString()
        };
      }

      if ((state as any).status) {
        this.currentStatus = (state as any).status;
      }
      if ((state as any).statusDescription) {
        this.currentStatusDescription = (state as any).statusDescription;
      }

      this.updateCurrentStepFromStatus(this.currentStatus);

      this.hasSummaryData =
        !!this.summary.typeOfLc ||
        !!this.summary.invoiceAmount ||
        !!this.summary.currency ||
        !!this.summary.beneficiaryName ||
        !!this.summary.beneficiaryCountry ||
        !!this.summary.incoterms ||
        !!this.summary.goodsDescription ||
        !!this.summary.expectedShipment;

      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goBackToSubmitting(): void {
    const queryParams = this.route.snapshot.queryParams;

    this.router
      .navigate(['/trade', 'import', 'submitting'], { queryParams })
      .catch(() => {
        console.error('Navigation to Import LC list page failed');
      });
  }

  private updateCurrentStepFromStatus(status: string): void {
    const value = (status || '').toLowerCase();

    if (value.includes('initiated') || value.includes('submitted')) {
      this.currentStepIndex = 0;
      return;
    }

    if (value.includes('bank review') || value === 'bank review') {
      this.currentStepIndex = 1;
      return;
    }

    if (value.includes('under review')) {
      this.currentStepIndex = 1;
      return;
    }

    if (value.includes('application') || value.includes('entry')) {
      this.currentStepIndex = 2;
      return;
    }

    if (value.includes('draft')) {
      this.currentStepIndex = 3;
      return;
    }

    if (value.includes('approved')) {
      this.currentStepIndex = 4;
      return;
    }

    if (value.includes('issuance') || value.includes('issued')) {
      this.currentStepIndex = 5;
      return;
    }

    this.currentStepIndex = 0;
  }

  private populateFromStored(item: any): void {
    this.referenceNumber = item.reference || this.referenceNumber;
    this.requestDateTime = item.submissionDate || this.requestDateTime;
    this.submittedBy = item.applicantName || 'Unknown Applicant';

    this.summary = {
      typeOfLc: item.lcType || '-',
      invoiceAmount: item.amount ? `${item.amount} ${item.currency || ''}`.trim() : '-',
      currency: item.currency || '-',
      beneficiaryName: item.beneficiaryName || '-',
      beneficiaryCountry: item.beneficiaryCountry || '-',
      incoterms: item.incoterm || '-',
      goodsDescription: item.goodsDescription || '-',
      expectedShipment: item.shipmentPeriod || '-'
    };

    if (item.poReferenceFileName) {
      this.uploadedReference = {
        fileName: item.poReferenceFileName,
        uploadedAt: item.submissionDate || new Date().toLocaleDateString()
      };
    }
  }

  print(): void {
    window.print();
  }

  viewFile(): void {
    if (!this.checkDraftAccess()) {
      return;
    }
    this.draftError = '';
    this.showDraftModal = true;
  }

  downloadFile(): void {
    if (!this.checkDraftAccess()) {
      return;
    }
    this.draftError = '';
    const link = document.createElement('a');
    link.href = this.draftPdfPath;
    link.download = this.buildDraftFileName();
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printDraft(): void {
    if (!this.checkDraftAccess()) {
      return;
    }
    this.draftError = '';
    const printWindow = window.open(this.draftPdfPath, '_blank');
    if (!printWindow) {
      this.draftError =
        'Unable to open print preview. Please allow pop-ups and try again.';
      return;
    }
    const onLoad = () => {
      try {
        printWindow.focus();
        printWindow.print();
      } finally {
        printWindow.removeEventListener('load', onLoad);
      }
    };
    printWindow.addEventListener('load', onLoad);
  }

  closeDraftModal(): void {
    this.showDraftModal = false;
  }

  private buildDraftFileName(): string {
    const reference = this.referenceNumber || 'import-lc-draft';
    return `${reference}-draft.pdf`;
  }

  private checkDraftAccess(): boolean {
    if (!this.isAuthorizedForDraft) {
      this.draftError = 'You are not authorized to access this document.';
      return false;
    }
    return true;
  }

  viewSubmittedDetails(): void {
    console.log('View details clicked');
  }

  downloadAcknowledgement(): void {
    console.log('Download acknowledgement clicked');
  }

  saveReference(): void {
    console.log('Save reference clicked');
  }

  contactRO(): void {
    console.log('Contact RO clicked');
  }
}
