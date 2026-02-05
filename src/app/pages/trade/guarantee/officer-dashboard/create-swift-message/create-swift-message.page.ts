import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { UiInputComponent } from '../../../../../components/ui/ui-input.component';
import Swal from 'sweetalert2';

interface HeaderErrors {
  senderReference: string;
  dateOfIssue: string;
  purposeOfMessage: string;
  dateOfExpiry: string;
}

interface UndertakingDetails {
  formOfUndertaking: string;
  applicableRules: string;
  undertakingNumber: string;
  expiryType: string;
  claimClause: string;
  autoExtension: string;
  reductionClause: string;
}

interface AmountCurrencyDetails {
  currency: string;
  guaranteeAmount: string;
  amountInWords: string;
  amountTolerance: string;
  maximumAmount: string;
  additionalAmounts: string;
}

interface BankDetails {
  name: string;
  bic: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
}

interface ApplicantDetails {
  name: string;
  cif: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  email: string;
}

interface BeneficiaryDetails {
  name: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  bankName: string;
  bankBic: string;
}

interface PartiesDetails {
  issuingBank: BankDetails;
  applicant: ApplicantDetails;
  beneficiary: BeneficiaryDetails;
  advisingBank: BankDetails;
  includeAdvisingBank: boolean;
}

interface UnderlyingTransactionDetails {
  contractReference: string;
  contractDate: string;
  description: string;
  details: string;
  contractValue: string;
  guaranteePercentage: string;
  performancePeriod: string;
}

interface TermsDetails {
  templateType: string;
  guaranteeType: string;
  claimPeriodDays: number;
  generatedText: string;
  underlying: UnderlyingTransactionDetails;
}

@Component({
  selector: 'app-create-swift-message-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiInputComponent],
  templateUrl: './create-swift-message.page.html'
})
export class CreateSwiftMessagePageComponent {
  activeStep = 1;
  completedStepIds: number[] = [];

  steps = [
    { id: 1, label: 'Message Header & Control' },
    { id: 2, label: 'Undertaking Details' },
    { id: 3, label: 'Amount & Currency' },
    { id: 4, label: 'Parties Information' },
    { id: 5, label: 'Terms & Conditions' },
    { id: 6, label: 'Review & Generate' }
  ];

  senderReference = 'GTR-2024-001234';
  dateOfIssue = '240111';
  purposeOfMessage = 'ISSU';
  dateOfExpiry = '241231';

  purposeOptions = [
    { value: 'ISSU', label: 'ISSU - Issue' },
    { value: 'AMND', label: 'AMND - Amendment' },
    { value: 'CANC', label: 'CANC - Cancellation' }
  ];

  headerErrors: HeaderErrors = {
    senderReference: '',
    dateOfIssue: '',
    purposeOfMessage: '',
    dateOfExpiry: ''
  };

  undertaking: UndertakingDetails = {
    formOfUndertaking: 'STAND - Standby Letter of Credit',
    applicableRules: 'URDG758 - Uniform Rules for Demand Guarantee',
    undertakingNumber: 'GTR-2024-001234-MT760',
    expiryType: 'FIXD - Fixed expiry date',
    claimClause:
      'Claims must be presented within 30 days after expiry date, accompanied by beneficiary’s signed statement confirming applicant’s default under the underlying contract.',
    autoExtension: 'none',
    reductionClause: 'none'
  };

  amountCurrency: AmountCurrencyDetails = {
    currency: 'USD - United States Dollar',
    guaranteeAmount: '2,500,000.00',
    amountInWords: 'Two Million Five Hundred Thousand and 00/100 United States Dollars',
    amountTolerance: 'none',
    maximumAmount: '',
    additionalAmounts: ''
  };

  parties: PartiesDetails = {
    issuingBank: {
      name: 'International Trade Bank',
      bic: 'ITBKAEADXXX',
      addressLine1: 'Sheikh Zayed Road, Dubai, United Arab Emirates',
      addressLine2: 'PO Box 123456',
      addressLine3: 'Trade Finance Operations'
    },
    applicant: {
      name: 'Global Construction LLC',
      cif: 'CIF-2024-789456',
      addressLine1: 'Business Bay, Dubai, United Arab Emirates',
      addressLine2: 'Trade Finance Department',
      addressLine3: '',
      email: 'finance@globalconstruction.ae'
    },
    beneficiary: {
      name: 'Ministry of Infrastructure & Development',
      country: 'United Arab Emirates',
      addressLine1: 'Government Complex, Capital District',
      addressLine2: 'Abu Dhabi, United Arab Emirates',
      addressLine3: 'PO Box 54321',
      bankName: 'Emirates National Bank',
      bankBic: 'ENBKAEXXXX'
    },
    advisingBank: {
      name: 'Global Correspondent Bank',
      bic: 'CORRAEADXXX',
      addressLine1: 'Correspondent Banking Division',
      addressLine2: 'London, United Kingdom',
      addressLine3: ''
    },
    includeAdvisingBank: false
  };

  terms: TermsDetails = {
    templateType: 'standard',
    guaranteeType: 'Performance Guarantee',
    claimPeriodDays: 30,
    generatedText:
      'We issue this irrevocable demand guarantee in favour of the Beneficiary for the account of the Applicant in connection with the underlying contract. Any demand must state that the Applicant has failed to perform its obligations under the contract and be presented in writing within the claim period.',
    underlying: {
      contractReference: 'INF-2024-789',
      contractDate: '2024-01-15',
      description: 'Infrastructure Development Project – Phase 2',
      details:
        'This guarantee is issued in respect of Contract No. INF-2024-789 dated 15 January 2024 between the Applicant and the Beneficiary for infrastructure development works.',
      contractValue: 'USD 5,000,000.00',
      guaranteePercentage: '50%',
      performancePeriod: '24 months'
    }
  };

  finalConfirmOperationalAccuracy = false;
  finalConfirmSwiftTextReviewed = false;
  finalConfirmAuthority = false;

  constructor(private router: Router) {}

  onClaimPeriodDaysChange(rawValue: string): void {
    const parsed = Number.parseInt(rawValue || '0', 10);
    this.terms.claimPeriodDays = Number.isNaN(parsed) ? 0 : parsed;
  }

  isStepCompleted(stepId: number): boolean {
    return this.completedStepIds.includes(stepId);
  }

  getPreviousStepLabel(): string {
    if (this.activeStep <= 1) {
      return 'Previous';
    }
    const previous = this.steps.find(step => step.id === this.activeStep - 1);
    return previous ? previous.label : 'Previous';
  }

  get totalSteps(): number {
    return this.steps.length;
  }

  get effectiveCompletedStepsCount(): number {
    const base = this.completedStepsCount;
    if (this.activeStep && !this.isStepCompleted(this.activeStep)) {
      return base + 1;
    }
    return base;
  }

  get completedStepsCount(): number {
    return this.completedStepIds.length;
  }

  get overallProgressPercent(): number {
    if (this.totalSteps === 0) {
      return 0;
    }
    const percent = (this.effectiveCompletedStepsCount / this.totalSteps) * 100;
    const rounded = Math.round(percent);
    if (rounded < 0) {
      return 0;
    }
    if (rounded > 100) {
      return 100;
    }
    return rounded;
  }

  get isHeaderSectionComplete(): boolean {
    return this.validateHeaderStep(false);
  }

  get isUndertakingSectionComplete(): boolean {
    return (
      !!this.undertaking.formOfUndertaking &&
      !!this.undertaking.applicableRules &&
      !!this.undertaking.undertakingNumber &&
      !!this.undertaking.claimClause
    );
  }

  get isAmountSectionComplete(): boolean {
    return (
      !!this.amountCurrency.currency &&
      !!this.amountCurrency.guaranteeAmount &&
      !!this.amountCurrency.amountInWords
    );
  }

  get isPartiesSectionComplete(): boolean {
    return !!this.parties.applicant.name && !!this.parties.beneficiary.name;
  }

  get isTermsSectionComplete(): boolean {
    return !!this.terms.generatedText && !!this.terms.underlying.contractReference;
  }

  get isAllChecklistComplete(): boolean {
    return (
      this.isHeaderSectionComplete &&
      this.isUndertakingSectionComplete &&
      this.isAmountSectionComplete &&
      this.isPartiesSectionComplete &&
      this.isTermsSectionComplete
    );
  }

  get canGenerateSwift(): boolean {
    return (
      this.finalConfirmOperationalAccuracy &&
      this.finalConfirmSwiftTextReviewed &&
      this.finalConfirmAuthority &&
      this.isAllChecklistComplete
    );
  }

  get swiftPreviewText(): string {
    const lines: string[] = [];
    const currencyCodeRaw = this.amountCurrency.currency || '';
    const currencyCodeParts = currencyCodeRaw.split(' - ');
    const currencyCode = currencyCodeParts[0] || currencyCodeRaw;
    lines.push('MT760 DEMAND GUARANTEE');
    lines.push('');
    lines.push(`:20:${this.senderReference}`);
    lines.push(`:23:${this.purposeOfMessage}`);
    lines.push(`:31C:${this.dateOfIssue}`);
    lines.push(`:31D:${this.dateOfExpiry}`);
    lines.push(`:40A:${this.undertaking.formOfUndertaking}`);
    lines.push(`:40C:${this.undertaking.applicableRules}`);
    lines.push(`:25:${this.undertaking.undertakingNumber}`);
    lines.push(`:32B:${currencyCode} ${this.amountCurrency.guaranteeAmount}`);
    lines.push(`:50:${this.parties.applicant.name}`);
    lines.push(`:59:${this.parties.beneficiary.name}`);
    lines.push('');
    lines.push(':77J:');
    lines.push(this.undertaking.claimClause);
    return lines.join('\n');
  }

  get claimClauseCharacters(): string {
    const length = this.undertaking.claimClause.length;
    return `${length}/350`;
  }

  getFormattedDateFromYYMMDD(value: string): string {
    const trimmed = value ? value.trim() : '';
    if (!/^\d{6}$/.test(trimmed)) {
      return '';
    }
    const yy = Number.parseInt(trimmed.slice(0, 2), 10);
    const mm = Number.parseInt(trimmed.slice(2, 4), 10);
    const dd = Number.parseInt(trimmed.slice(4, 6), 10);
    const year = 2000 + yy;
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
      return '';
    }
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[mm - 1];
    const day = dd.toString().padStart(2, '0');
    return `${day}-${monthName}-${year}`;
  }

  getValidityPeriodDays(): string {
    const start = this.parseDateFromYYMMDD(this.dateOfIssue);
    const end = this.parseDateFromYYMMDD(this.dateOfExpiry);
    if (!start || !end) {
      return '';
    }
    const diffMs = end.getTime() - start.getTime();
    if (!Number.isFinite(diffMs)) {
      return '';
    }
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return days.toString();
  }

  goBackToReview(): void {
    this.router.navigate(['/trade', 'guarantee-application-review']);
  }

  selectStep(stepId: number): void {
    if (stepId < 1 || stepId > this.steps.length) {
      return;
    }
    this.activeStep = stepId;
  }

  goToStep(stepId: number): void {
    if (stepId < 1 || stepId > this.steps.length) {
      return;
    }
    this.activeStep = stepId;
  }

  canProceedFromCurrentStep(): boolean {
    if (this.activeStep === 1) {
      return this.validateHeaderStep(false);
    }
    return true;
  }

  next(): void {
    if (this.activeStep === 1 && !this.validateHeaderStep(true)) {
      return;
    }

    this.markStepCompleted(this.activeStep);

    if (this.activeStep < this.steps.length) {
      this.activeStep += 1;
      return;
    }

    this.submitAndEscalate();
  }

  previous(): void {
    if (this.activeStep > 1) {
      this.activeStep -= 1;
      return;
    }
    this.goBackToReview();
  }

  getNextStepLabel(): string {
    if (this.activeStep >= this.steps.length) {
      return 'Review & Generate';
    }
    const next = this.steps.find(step => step.id === this.activeStep + 1);
    return next ? next.label : 'Next';
  }

  private parseDateFromYYMMDD(value: string): Date | null {
    const trimmed = value ? value.trim() : '';
    if (!/^\d{6}$/.test(trimmed)) {
      return null;
    }
    const yy = Number.parseInt(trimmed.slice(0, 2), 10);
    const mm = Number.parseInt(trimmed.slice(2, 4), 10);
    const dd = Number.parseInt(trimmed.slice(4, 6), 10);
    const year = 2000 + yy;
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
      return null;
    }
    return new Date(Date.UTC(year, mm - 1, dd));
  }

  private markStepCompleted(stepId: number): void {
    if (stepId < 1 || stepId > this.steps.length) {
      return;
    }
    if (!this.completedStepIds.includes(stepId)) {
      this.completedStepIds.push(stepId);
    }
  }

  private validateHeaderStep(markErrors: boolean): boolean {
    let valid = true;
    const errors: HeaderErrors = {
      senderReference: '',
      dateOfIssue: '',
      purposeOfMessage: '',
      dateOfExpiry: ''
    };

    if (!this.senderReference.trim()) {
      valid = false;
      errors.senderReference = 'Sender reference is required.';
    }

    if (!this.dateOfIssue.trim()) {
      valid = false;
      errors.dateOfIssue = 'Date of issue is required.';
    } else if (!/^\d{6}$/.test(this.dateOfIssue.trim())) {
      valid = false;
      errors.dateOfIssue = 'Use YYMMDD format.';
    }

    if (!this.purposeOfMessage.trim()) {
      valid = false;
      errors.purposeOfMessage = 'Purpose of message is required.';
    }

    if (!this.dateOfExpiry.trim()) {
      valid = false;
      errors.dateOfExpiry = 'Date of expiry is required.';
    } else if (!/^\d{6}$/.test(this.dateOfExpiry.trim())) {
      valid = false;
      errors.dateOfExpiry = 'Use YYMMDD format.';
    }

    if (markErrors) {
      this.headerErrors = errors;
    }

    return valid;
  }

  submitAndEscalate(): void {
    Swal.fire({
      title: 'Submit SWIFT and escalate?',
      text: 'This will submit the MT76x message and escalate the case to checker.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Submitted',
          text: 'SWIFT message has been marked as submitted and escalated to checker.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/trade', 'guarantee-officer-dashboard']);
        });
      }
    });
  }
}
