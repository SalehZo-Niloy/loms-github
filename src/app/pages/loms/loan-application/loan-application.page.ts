import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiInputComponent } from '../../../components/ui/ui-input.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { AlertService } from '../../../services/alert.service';

interface LoanApplicationForm {
  existingCustomer: 'yes' | 'no';
  applicationCheck: string;
  customerPointType: string;
  customerPointName: string;
  accountName: string;
  applyDate: string;
  proposalType: string;
  requestType: string;
  assessmentType: string;
  productName: string;
  loanType: string;
  businessType: string;
  organizationType: string;
  collateralStatus: 'secured' | 'unsecured' | '';
  ruralUrban: 'rural' | 'urban' | '';
  branchCode: string;
  businessSourceRm: string;
  urgencyStatus: string;
  urgencyRemarks: string;
  leadId: string;
}

type LoanApplicationStepStatus = 'completed' | 'in-progress' | 'pending';

@Component({
  selector: 'app-loms-loan-application-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent,
    UiButtonComponent,
    UiInputComponent,
    UiDropdownComponent
  ],
  templateUrl: './loan-application.page.html'
})
export class LomsLoanApplicationPageComponent {
  @ViewChildren('stepButton') stepButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  title = 'Application Information';

  stepTitles: string[] = [
    'Application Information',
    'Document Information',
    'Demographic Information',
    'Product Information',
    'Security Information',
    'Financial Information',
    'Financial Assessment',
    'Preview'
  ];

  currentStep = 0;
  completedSteps: number[] = [];
  draftSteps: number[] = [];
  private readonly progressStorageKey = 'lomsCompletedSteps';
  private readonly draftStorageKey = 'lomsDraftSteps';
  private readonly formStorageKey = 'lomsLoanForm';

  applicationCheckOptions = [
    { label: 'New', value: 'new' },
    { label: 'Renewal', value: 'renewal' },
    { label: 'Enhancement', value: 'enhancement' },
  ];

  customerPointTypeOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Business', value: 'business' },
    { label: 'Corporate', value: 'corporate' }
  ];

  proposalTypeOptions = [
    { label: 'Fresh', value: 'fresh' },
    { label: 'Restructure', value: 'restructure' },
    { label: 'Refinance', value: 'refinance' }
  ];

  requestTypeOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Fast Track', value: 'fast_track' },
    { label: 'Priority', value: 'priority' }
  ];

  assessmentTypeOptions = [
    { label: 'Automated', value: 'automated' },
    { label: 'Manual', value: 'manual' },
    { label: 'Hybrid', value: 'hybrid' }
  ];

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

  businessTypeOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Manufacturing', value: 'manufacturer' },
    { label: 'Partnership', value: 'partnership' },
    { label: 'Limited Company', value: 'limited_company' },
    { label: 'LLP', value: 'llp' },
    { label: 'Other', value: 'other' }
  ];

  organizationTypeOptions = [
    { label: 'SME', value: 'sme' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'Retail', value: 'retail' },
    { label: 'Other', value: 'other' }
  ];

  branchOptions = [
    { label: 'Dhanmondi Branch (001)', value: '001' },
    { label: 'Gulshan Branch (002)', value: '002' },
    { label: 'Motijheel Branch (003)', value: '003' }
  ];

  relationshipManagerOptions = [
    { label: 'Ahmed Rahman', value: 'ahmed_rahman' },
    { label: 'Nusrat Jahan', value: 'nusrat_jahan' },
    { label: 'Kamal Hossain', value: 'kamal_hossain' },
    { label: 'Tony', value: 'tony' },
    { label: 'Rahim Khan', value: 'rahim_khan' },
    { label: 'Sakib Khan', value: 'sakib_khan' },
    
  ];

  urgencyStatusOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'High Priority', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
  ];

  form: LoanApplicationForm = {
    existingCustomer: 'yes',
    applicationCheck: '',
    customerPointType: '',
    customerPointName: '',
    accountName: '',
    applyDate: '',
    proposalType: '',
    requestType: '',
    assessmentType: '',
    productName: '',
    loanType: '',
    businessType: '',
    organizationType: '',
    collateralStatus: '',
    ruralUrban: '',
    branchCode: '',
    businessSourceRm: '',
    urgencyStatus: 'normal',
    urgencyRemarks: '',
    leadId: ''
  };

  lastSavedDraft: LoanApplicationForm | null = null;
  lastSubmittedApplication: LoanApplicationForm | null = null;

  constructor(private router: Router, private alertService: AlertService) {
    this.loadCompletedStepsFromStorage();
    this.loadFormFromStorage();
  }

  getStepStatus(index: number): LoanApplicationStepStatus {
    if (this.completedSteps.includes(index)) {
      return 'completed';
    }
    if (index === this.currentStep) {
      return 'in-progress';
    }
    return 'pending';
  }

  getStepCircleClasses(index: number): string[] {
    if (index === 1) {
      return ['hidden'];
    }
    if (index === 1) {
      return ['hidden'];
    }
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

  getStepLabelClasses(index: number): string[] {
    if (index === 1) {
      return ['hidden'];
    }
    const isCompleted = this.completedSteps.includes(index);
    const isDraft = this.draftSteps.includes(index);
    const isCurrent = index === this.currentStep;

    if (isCompleted) {
      return ['text-emerald-700'];
    }

    if (isDraft) {
      return ['text-amber-600'];
    }

    if (isCurrent) {
      return ['text-blue-600'];
    }

    return ['text-slate-500'];
  }

  goToStep(index: number): void {
    if (index < 0 || index >= this.stepTitles.length) {
      return;
    }

    if (index === 0) {
      this.currentStep = 0;
      return;
    }
    if (index === 1 || index === 2) {
      this.router.navigate(['/loms', 'demographic-application', 'application']);
      return;
    }

    if (index === 3) {
      this.router.navigate(['/loms', 'product-application', 'application']);
      return;
    }

    if (index === 4) {
      this.router.navigate(['/loms', 'security-application', 'application']);
      return;
    }

    if (index === 5) {
      this.router.navigate(['/loms', 'financial-application', 'application']);
      return;
    }

    if (index === 6) {
      this.router.navigate(['/loms', 'financial-assessment', 'application']);
      return;
    }

    if (index === 7) {
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
    this.router.navigate(['/loms', 'demographic-application', 'application']);
  }

  goToQueryDashboard(): void {
    this.router.navigate(['/loms', 'query']);
  }

  goToDedupCheck(): void {
    const customerType = this.form.businessType === 'individual' ? 'individual' : 'business';

    const dedupParams = {
      customerType,
      fullName: this.form.accountName,
      nationalId: '',
      dateOfBirth: '',
      mobileNumber: '',
      tinNumber: '',
      passportNumber: '',
      fatherName: '',
      motherName: ''
    };

    this.router.navigate(['/loms', 'de-dup', 'application'], {
      queryParams: dedupParams
    });
  }

  exportApplicationData(): LoanApplicationForm {
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
      const parsed = JSON.parse(raw) as Partial<LoanApplicationForm>;
      this.form = {
        ...this.form,
        ...parsed
      };
    } catch {
    }
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

  private saveFormToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.sessionStorage.setItem(this.formStorageKey, JSON.stringify(this.form));
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
}
