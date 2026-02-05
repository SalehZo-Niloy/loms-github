import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

@Component({
  selector: 'app-import-submitting-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiInputComponent, UiButtonComponent],
  templateUrl: './submitting.page.html',
})
export class ImportSubmittingPageComponent implements OnInit, OnDestroy {
  requestType = 'Initiate Import Letter of Credit';
  lcType = '';
  purposeOfImport = '';

  applicantName = '';
  accountNumber = '';
  contactEmail = '';
  contactPhone = '';

  beneficiaryName = '';
  beneficiaryCountry = '';
  beneficiaryBankName = '';
  beneficiaryBankCountry = '';

  poReference = '';
  invoiceDate = '';
  invoiceAmount = '';
  currency = '';

  goodsDescription = '';
  quantity = '';
  shipmentPeriod = '';
  portOfLoading = '';
  portOfDischarge = '';

  incoterm = '';
  partialShipmentAllowed: 'yes' | 'no' | '' = '';
  transshipmentAllowed: 'yes' | 'no' | '' = '';

  preferredIssuingBranch = '';
  preferredAdvisingBank = '';
  remarks = '';

  confirm = false;

  lcTypes = ['Sight LC', 'Usance LC', 'Deferred LC'];
  countries = ['Bangladesh', 'United States', 'China', 'United Arab Emirates', 'India'];
  currencies = ['USD', 'EUR', 'BDT', 'GBP'];
  incoterms = ['FOB', 'CIF', 'CFR', 'DAP', 'EXW'];
  branches = ['Main Branch', 'Gulshan Branch', 'Motijheel Branch'];

  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';

  poReferenceFile: File | null = null;
  isSubmitting = false;

  uploadedFiles: File[] = [];
  isUploading = false;
  isPreviewOpen = false;
  previewFileUrl: string | null = null;
  previewFileType: 'image' | 'pdf' | 'other' | '' = '';
  previewFileName = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private importLcStateService: ImportLcStateService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.importLcStateService.state$.subscribe((state) => {
      this.requestType = state.requestType;
      this.lcType = state.lcType;
      this.purposeOfImport = state.purposeOfImport;
      this.applicantName = state.applicantName;
      this.accountNumber = state.accountNumber;
      this.contactEmail = state.contactEmail;
      this.contactPhone = state.contactPhone;
      this.beneficiaryName = state.beneficiaryName;
      this.beneficiaryCountry = state.beneficiaryCountry;
      this.beneficiaryBankName = state.beneficiaryBankName;
      this.beneficiaryBankCountry = state.beneficiaryBankCountry;
      this.poReference = state.poReference;
      this.invoiceDate = state.invoiceDate;
      this.invoiceAmount = state.invoiceAmount;
      this.currency = state.currency;
      this.goodsDescription = state.goodsDescription;
      this.quantity = state.quantity;
      this.shipmentPeriod = state.shipmentPeriod;
      this.portOfLoading = state.portOfLoading;
      this.portOfDischarge = state.portOfDischarge;
      this.incoterm = state.incoterm;
      this.partialShipmentAllowed = state.partialShipmentAllowed;
      this.transshipmentAllowed = state.transshipmentAllowed;
      this.preferredIssuingBranch = state.preferredIssuingBranch;
      this.preferredAdvisingBank = state.preferredAdvisingBank;
      this.remarks = state.remarks;
      this.confirm = state.confirm;

      if (state.poReferenceFile) {
        this.poReferenceFile = state.poReferenceFile;
      }
    });
  }

  ngOnDestroy(): void {
    this.updateServiceState();
    this.subscription.unsubscribe();
  }

  private addRequestToLocalList(reference: string, submissionDate: string): boolean {
    if (typeof window === 'undefined') {
      return true;
    }

    try {
      const stored = window.localStorage.getItem('importLcRequests');
      let requests: any[] = [];

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          requests = parsed;
        }
      }

      const newRequest = {
        reference,
        submissionDate,
        lcType: this.lcType,
        amount: this.invoiceAmount,
        currency: this.currency,
        beneficiaryName: this.beneficiaryName,
        beneficiaryCountry: this.beneficiaryCountry,
        incoterm: this.incoterm,
        goodsDescription: this.goodsDescription,
        shipmentPeriod: this.shipmentPeriod,
        portOfDischarge: this.portOfDischarge,
        status: 'LC Initiated',
        applicantName: this.applicantName,
        poReferenceFileName: this.poReferenceFile?.name || this.poReference || '',
      };

      requests.unshift(newRequest);
      window.localStorage.setItem('importLcRequests', JSON.stringify(requests));

      return true;
    } catch (error) {
      this.statusType = 'error';
      this.statusMessage = 'Failed to save your request. Please try again.';
      return false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  previewFile(file: File): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.previewFileUrl) {
      URL.revokeObjectURL(this.previewFileUrl);
    }

    const url = URL.createObjectURL(file);
    this.previewFileUrl = url;
    this.previewFileName = file.name;

    if (file.type === 'application/pdf') {
      this.previewFileType = 'pdf';
    } else if (file.type.startsWith('image/')) {
      this.previewFileType = 'image';
    } else {
      this.previewFileType = 'other';
    }

    this.isPreviewOpen = true;
  }

  closePreview(): void {
    if (this.previewFileUrl) {
      URL.revokeObjectURL(this.previewFileUrl);
    }
    this.previewFileUrl = null;
    this.previewFileName = '';
    this.previewFileType = '';
    this.isPreviewOpen = false;
  }

  updateServiceState(): void {
    this.importLcStateService.updateState({
      requestType: this.requestType,
      lcType: this.lcType,
      purposeOfImport: this.purposeOfImport,
      applicantName: this.applicantName,
      accountNumber: this.accountNumber,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      beneficiaryName: this.beneficiaryName,
      beneficiaryCountry: this.beneficiaryCountry,
      beneficiaryBankName: this.beneficiaryBankName,
      beneficiaryBankCountry: this.beneficiaryBankCountry,
      poReference: this.poReference,
      poReferenceFileName: this.poReferenceFile?.name || '',
      invoiceDate: this.invoiceDate,
      invoiceAmount: this.invoiceAmount,
      currency: this.currency,
      goodsDescription: this.goodsDescription,
      quantity: this.quantity,
      shipmentPeriod: this.shipmentPeriod,
      portOfLoading: this.portOfLoading,
      portOfDischarge: this.portOfDischarge,
      incoterm: this.incoterm,
      partialShipmentAllowed: this.partialShipmentAllowed,
      transshipmentAllowed: this.transshipmentAllowed,
      preferredIssuingBranch: this.preferredIssuingBranch,
      preferredAdvisingBank: this.preferredAdvisingBank,
      remarks: this.remarks,
      confirm: this.confirm,
      poReferenceFile: this.poReferenceFile,
    });
  }

  saveDraft(): void {
    this.updateServiceState();
    this.statusType = 'success';
    this.statusMessage = 'Draft saved.';
  }

  submitRequest(): void {
    this.isSubmitting = true;
    const now = new Date();
    const submissionDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const reference =
      'LC' +
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      Math.floor(1000 + Math.random() * 9000).toString();

    this.updateServiceState();
    const saved = this.addRequestToLocalList(reference, submissionDate);
    if (!saved) {
      this.isSubmitting = false;
      return;
    }

    this.statusType = 'success';
    this.statusMessage = `LC initiation request submitted. Reference: ${reference}.`;

    this.router
      .navigate(['/trade', 'import', 'submitting'], {
        queryParams: { reference },
      })
      .catch(() => {
        this.statusType = 'error';
        this.statusMessage =
          'Your request was submitted but navigation to the LC list failed. Please open the Import LC list from the menu.';
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  backToList(): void {
    this.router.navigate(['/trade', 'import', 'submitting']);
  }

  cancel(): void {
    this.router.navigate(['/trade', 'import']);
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    if (field === 'poReference') {
      this.isUploading = true;
      const maxSize = 10 * 1024 * 1024;
      const newFiles: File[] = [];
      const errors: string[] = [];

      Array.from(input.files).forEach((file) => {
        const isAllowedType =
          file.type === 'application/pdf' ||
          file.type.startsWith('image/') ||
          file.type === 'text/plain';

        if (!isAllowedType) {
          errors.push(`File type not allowed: ${file.name}`);
          return;
        }

        if (file.size > maxSize) {
          errors.push(`File too large (max 10MB): ${file.name}`);
          return;
        }

        newFiles.push(file);
      });

      if (newFiles.length > 0) {
        this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
        this.poReferenceFile = this.uploadedFiles[0];
        this.updateServiceState();
      }

      if (errors.length > 0) {
        this.statusType = 'error';
        this.statusMessage = errors.join(' ');
      }

      this.isUploading = false;
    }
  }

  removeFile(field: string): void {
    if (field === 'poReference') {
      this.poReferenceFile = null;
      this.uploadedFiles = [];
      this.updateServiceState();
    }
  }

  onConfirmChange(val: boolean): void {
    this.confirm = val;
  }

  refreshForm(): void {
    this.importLcStateService.resetState();
    this.requestType = 'Initiate Import Letter of Credit';
    this.lcType = '';
    this.purposeOfImport = '';
    this.applicantName = '';
    this.accountNumber = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.beneficiaryName = '';
    this.beneficiaryCountry = '';
    this.beneficiaryBankName = '';
    this.beneficiaryBankCountry = '';
    this.poReference = '';
    this.poReferenceFile = null;
    this.invoiceDate = '';
    this.invoiceAmount = '';
    this.currency = '';
    this.goodsDescription = '';
    this.quantity = '';
    this.shipmentPeriod = '';
    this.portOfLoading = '';
    this.portOfDischarge = '';
    this.incoterm = '';
    this.partialShipmentAllowed = '';
    this.transshipmentAllowed = '';
    this.preferredIssuingBranch = '';
    this.preferredAdvisingBank = '';
    this.remarks = '';
    this.confirm = false;
    this.statusMessage = '';
    this.statusType = '';
  }
}
