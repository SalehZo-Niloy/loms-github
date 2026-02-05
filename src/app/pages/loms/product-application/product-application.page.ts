import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiInputComponent } from '../../../components/ui/ui-input.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { AlertService } from '../../../services/alert.service';

interface ProductApplicationForm {
  productName: string;
  loanType: string;
  requestedAmount: string;
  loanTenureMonths: string;
  interestRate: string;
  repaymentFrequency: string;
  disbursementAccountBank: string;
  disbursementAccountNumber: string;
  expectedDisbursementDate: string;
  accountHolderName: string;
}

type ProductApplicationStepStatus = 'completed' | 'in-progress' | 'pending';

@Component({
  selector: 'app-loms-product-application-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent,
    UiButtonComponent,
    UiInputComponent,
    UiDropdownComponent
  ],
  templateUrl: './product-application.page.html'
})
export class LomsProductApplicationPageComponent {
  @ViewChildren('stepButton') stepButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  title = 'Loan Product & Disbursement Details';

  stepTitles: string[] = [
    'Application Information',
    'Demographic Information',
    'Product Information',
    'Financial Information',
    'Security Information',
    'Document Information',
    'Preview'
  ];

  currentStep = 2;
  completedSteps: number[] = [];
  draftSteps: number[] = [];
  private readonly progressStorageKey = 'lomsCompletedSteps';
  private readonly draftStorageKey = 'lomsDraftSteps';
  private readonly formStorageKey = 'lomsProductForm';

  productNameOptions = [
    { label: 'Personal Loan', value: 'personal' },
    { label: 'Home Loan', value: 'home' },
    { label: 'Auto Loan', value: 'auto' },
    { label: 'Business Loan', value: 'business' },
    { label: 'Corporate Loan', value: 'corporate' },
    { label: 'SME Loan', value: 'sme' }
  ];

  loanTypeOptions = [
    { label: 'Demand Loan', value: 'demand' },
    { label: 'Term Loan', value: 'term' },
    { label: 'Revolving Loan', value: 'revolving' },
    { label: 'Mortgage Loan', value: 'mortgage' },
    { label: 'Overdraft Loan', value: 'overdraft' },
    { label: 'Installment Loan', value: 'installment' }
  ];

  repaymentFrequencyOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Half Yearly', value: 'half_yearly' },
    { label: 'Yearly', value: 'yearly' }
  ];

  disbursementBankOptions = [
    { label: 'Prime Bank', value: 'prime_bank' },
    { label: 'City Bank', value: 'city_bank' },
    { label: 'Bank of Asia', value: 'bank_of_asia' },
    { label: 'Bank of Bangladesh', value: 'bank_of_bd' },
    
  ];

  form: ProductApplicationForm = {
    productName: '',
    loanType: '',
    requestedAmount: '',
    loanTenureMonths: '',
    interestRate: '',
    repaymentFrequency: 'monthly',
    disbursementAccountBank: '',
    disbursementAccountNumber: '',
    expectedDisbursementDate: '',
    accountHolderName: ''
  };

  lastSavedDraft: ProductApplicationForm | null = null;
  lastSubmittedApplication: ProductApplicationForm | null = null;

  constructor(private router: Router, private alertService: AlertService) {
    this.loadCompletedStepsFromStorage();
    this.loadFormFromStorage();
  }

  getStepStatus(index: number): ProductApplicationStepStatus {
    if (this.completedSteps.includes(index)) {
      return 'completed';
    }
    if (index === this.currentStep) {
      return 'in-progress';
    }
    return 'pending';
  }

  getStepCircleClasses(index: number): string[] {
    const isCompleted = this.completedSteps.includes(index);
    const isDraft = this.draftSteps.includes(index);
    const isCurrent = index === this.currentStep;

    if (isCompleted) {
      return [
        'inline-flex',
        'items-center',
        'gap-2',
        'rounded-full',
        'border',
        'border-emerald-500',
        'bg-emerald-50',
        'px-3',
        'py-1.5',
        'text-xs',
        'font-semibold',
        'text-emerald-700',
        'shadow-sm',
        'transition-colors',
        'duration-150',
        'ease-out'
      ];
    }

    if (isDraft) {
      return [
        'inline-flex',
        'items-center',
        'gap-2',
        'rounded-full',
        'border',
        'border-amber-500',
        'bg-amber-50',
        'px-3',
        'py-1.5',
        'text-xs',
        'font-semibold',
        'text-amber-700',
        'shadow-sm',
        'transition-colors',
        'duration-150',
        'ease-out'
      ];
    }

    if (isCurrent) {
      return [
        'inline-flex',
        'items-center',
        'gap-2',
        'rounded-full',
        'border',
        'border-blue-600',
        'bg-blue-50',
        'px-3',
        'py-1.5',
        'text-xs',
        'font-semibold',
        'text-blue-700',
        'shadow-sm',
        'transition-colors',
        'duration-150',
        'ease-out'
      ];
    }

    return [
      'inline-flex',
      'items-center',
      'gap-2',
      'rounded-full',
      'border',
      'border-transparent',
      'px-3',
      'py-1.5',
      'text-xs',
      'font-medium',
      'text-slate-600',
      'hover:bg-slate-50',
      'hover:text-slate-900',
      'transition-colors',
      'duration-150',
      'ease-out'
    ];
  }

  goToStep(index: number): void {
    if (index < 0 || index >= this.stepTitles.length) {
      return;
    }

    if (index === 0) {
      this.router.navigate(['/loms', 'loan-application', 'application']);
      return;
    }

    if (index === 1) {
      this.router.navigate(['/loms', 'demographic-application', 'application']);
      return;
    }

    if (index === 2) {
      this.currentStep = 2;
      return;
    }

    if (index === 3) {
      this.router.navigate(['/loms', 'financial-application', 'application']);
      return;
    }

    if (index === 4) {
      this.router.navigate(['/loms', 'security-application', 'application']);
      return;
    }

    if (index === 5) {
      this.router.navigate(['/loms', 'document-application', 'application']);
      return;
    }

    if (index === 6) {
      this.saveFormToStorage();
      this.router.navigate(['/loms', 'application-preview']);
    }
  }

  onStepKeydown(event: KeyboardEvent, index: number): void {
    const key = event.key;

    if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'Home' || key === 'End') {
      event.preventDefault();
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.goToStep(index);
      return;
    }

    let targetIndex: number | null = null;

    if (key === 'ArrowRight') {
      targetIndex = index + 1 < this.stepTitles.length ? index + 1 : index;
    } else if (key === 'ArrowLeft') {
      targetIndex = index - 1 >= 0 ? index - 1 : index;
    } else if (key === 'Home') {
      targetIndex = 0;
    } else if (key === 'End') {
      targetIndex = this.stepTitles.length - 1;
    }

    if (targetIndex !== null && targetIndex !== index) {
      this.goToStep(targetIndex);
      this.focusStep(targetIndex);
    }
  }

  private focusStep(index: number): void {
    const buttons = this.stepButtons?.toArray();
    if (!buttons || index < 0 || index >= buttons.length) {
      return;
    }
    const target = buttons[index];
    if (target?.nativeElement) {
      target.nativeElement.focus();
    }
  }

  saveAsDraft(): void {
    this.lastSavedDraft = { ...this.form };
    this.saveFormToStorage();
  }

  saveDraftWithAlert(): void {
    this.saveAsDraft();
    if (!this.completedSteps.includes(this.currentStep) && !this.draftSteps.includes(this.currentStep)) {
      this.draftSteps.push(this.currentStep);
      this.saveCompletedStepsToStorage();
    }
    this.alertService.showSuccess('Draft has been saved.', '#2563eb');
  }

  proceedToNextStep(): void {
    if (!this.completedSteps.includes(this.currentStep)) {
      this.completedSteps.push(this.currentStep);
      this.draftSteps = this.draftSteps.filter(step => step !== this.currentStep);
      this.saveCompletedStepsToStorage();
    }
    this.lastSubmittedApplication = { ...this.form };
    this.saveFormToStorage();
    const amount = this.numericRequestedAmount;
    if (amount > 0 && typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('lomsRequestedAmount', String(amount));
      } catch {
      }
    }
    this.router.navigate(['/loms', 'financial-application', 'application']);
  }

  goBackToDemographic(): void {
    this.saveAsDraft();
    this.router.navigate(['/loms', 'demographic-application', 'application']);
  }

  exportApplicationData(): ProductApplicationForm {
    return this.form;
  }

  private loadFormFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(this.formStorageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<ProductApplicationForm>;
      this.form = {
        ...this.form,
        ...parsed
      };
    } catch {
    }
  }

  private get numericRequestedAmount(): number {
    const value = parseFloat(this.form.requestedAmount);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  private get numericInterestRate(): number {
    const value = parseFloat(this.form.interestRate);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  private get numericLoanTenureMonths(): number {
    const value = parseFloat(this.form.loanTenureMonths);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  get emiAmount(): number {
    const principal = this.numericRequestedAmount;
    const annualRate = this.numericInterestRate;
    const tenureMonths = this.numericLoanTenureMonths;

    if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
      return 0;
    }

    const monthlyRate = annualRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);

    const emi = (principal * monthlyRate * factor) / (factor - 1);
    return Number.isFinite(emi) ? emi : 0;
  }

  get totalRepaymentAmount(): number {
    const tenureMonths = this.numericLoanTenureMonths;
    if (tenureMonths <= 0) {
      return 0;
    }
    return this.emiAmount * tenureMonths;
  }

  get totalInterestPayable(): number {
    const principal = this.numericRequestedAmount;
    const total = this.totalRepaymentAmount;
    if (principal <= 0 || total <= 0) {
      return 0;
    }
    const interest = total - principal;
    return interest > 0 ? interest : 0;
  }

  private loadCompletedStepsFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const rawCompleted = window.sessionStorage.getItem(this.progressStorageKey);
      if (rawCompleted) {
        const parsedCompleted = JSON.parse(rawCompleted);
        if (Array.isArray(parsedCompleted)) {
          this.completedSteps = parsedCompleted
            .filter((value: unknown) => Number.isInteger(value as number))
            .map(value => Number(value));
        }
      }

      const rawDraft = window.sessionStorage.getItem(this.draftStorageKey);
      if (rawDraft) {
        const parsedDraft = JSON.parse(rawDraft);
        if (Array.isArray(parsedDraft)) {
          this.draftSteps = parsedDraft
            .filter((value: unknown) => Number.isInteger(value as number))
            .map(value => Number(value));
        }
      }
    } catch {
    }
  }

  private saveCompletedStepsToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const uniqueCompleted = Array.from(new Set(this.completedSteps)).sort((a, b) => a - b);
      const uniqueDraft = Array.from(new Set(this.draftSteps)).sort((a, b) => a - b);
      window.sessionStorage.setItem(this.progressStorageKey, JSON.stringify(uniqueCompleted));
      window.sessionStorage.setItem(this.draftStorageKey, JSON.stringify(uniqueDraft));
    } catch {
    }
  }

  onRefreshSteps(): void {
    this.completedSteps = [];
    this.draftSteps = [];
    this.lastSavedDraft = null;
    this.lastSubmittedApplication = null;
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(this.progressStorageKey);
        window.sessionStorage.removeItem(this.draftStorageKey);
        window.sessionStorage.removeItem('lomsRequestedAmount');
      } catch {
      }
    }
    this.router.navigate(['/loms', 'loan-application', 'application']);
  }

  private saveFormToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.sessionStorage.setItem(this.formStorageKey, JSON.stringify(this.form));
    } catch {
    }
  }
}
