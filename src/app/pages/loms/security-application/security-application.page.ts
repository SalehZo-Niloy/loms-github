import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiInputComponent } from '../../../components/ui/ui-input.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { AlertService } from '../../../services/alert.service';

type SecurityApplicationStepStatus = 'completed' | 'in-progress' | 'pending';

interface SecurityEntry {
  id: number;
  securityType: string;
  securityOwnership: string;
  propertyType: string;
  ownershipDocumentReference: string;
  propertyAddress: string;
  marketValue: string;
  forcedSaleValue: string;
  valuationDate: string;
}

interface SecurityApplicationForm {
  securities: SecurityEntry[];
}

@Component({
  selector: 'app-loms-security-application-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent,
    UiButtonComponent,
    UiInputComponent,
    UiDropdownComponent
  ],
  templateUrl: './security-application.page.html'
})
export class LomsSecurityApplicationPageComponent implements OnInit {
  @ViewChildren('stepButton') stepButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  title = 'Security Information';

  stepTitles: string[] = [
    'Application Information',
    'Demographic Information',
    'Product Information',
    'Financial Information',
    'Security Information',
    'Document Information',
    'Preview'
  ];

  currentStep = 4;
  completedSteps: number[] = [];
  draftSteps: number[] = [];
  private readonly progressStorageKey = 'lomsCompletedSteps';
  private readonly draftStorageKey = 'lomsDraftSteps';
  private readonly formStorageKey = 'lomsSecurityForm';

  securityTypeOptions = [
    { label: 'Property', value: 'property' },
    { label: 'Vehicle', value: 'vehicle' },
    { label: 'FDR', value: 'fdr' },
    { label: 'Cash / Deposit', value: 'cash' },
    { label: 'Guarantee', value: 'guarantee' }
  ];

  securityOwnershipOptions = [
    { label: 'Applicant', value: 'applicant' },
    { label: 'Co-applicant', value: 'co_applicant' },
    { label: 'Guarantor', value: 'guarantor' },
    { label: 'Third Party', value: 'third_party' }
  ];

  propertyTypeOptions = [
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Industrial', value: 'industrial' },
    { label: 'Land', value: 'land' }
  ];

  currencyLabel = 'BDT';

  form: SecurityApplicationForm = {
    securities: [
      {
        id: 1,
        securityType: 'property',
        securityOwnership: '',
        propertyType: '',
        ownershipDocumentReference: '',
        propertyAddress: '',
        marketValue: '',
        forcedSaleValue: '',
        valuationDate: ''
      }
    ]
  };

  lastSavedDraft: SecurityApplicationForm | null = null;
  lastSubmittedApplication: SecurityApplicationForm | null = null;

  referenceLoanAmount = 0;
  nextSecurityId = 2;

  constructor(private router: Router, private alertService: AlertService) {
    this.loadCompletedStepsFromStorage();
    this.loadFormFromStorage();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.sessionStorage.getItem('lomsRequestedAmount');
        if (raw) {
          const value = parseFloat(raw);
          if (Number.isFinite(value) && value > 0) {
            this.referenceLoanAmount = value;
          }
        }
      } catch {
      }
    }
  }

  getStepStatus(index: number): SecurityApplicationStepStatus {
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
      this.router.navigate(['/loms', 'product-application', 'application']);
      return;
    }

    if (index === 3) {
      this.router.navigate(['/loms', 'financial-application', 'application']);
      return;
    }

    if (index === 4) {
      this.currentStep = 4;
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

  addSecurityEntry(): void {
    this.form.securities = [
      ...this.form.securities,
      {
        id: this.nextSecurityId++,
        securityType: 'property',
        securityOwnership: '',
        propertyType: '',
        ownershipDocumentReference: '',
        propertyAddress: '',
        marketValue: '',
        forcedSaleValue: '',
        valuationDate: ''
      }
    ];
  }

  saveAsDraft(): void {
    this.lastSavedDraft = {
      securities: this.form.securities.map(entry => ({ ...entry }))
    };
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
    this.lastSubmittedApplication = {
      securities: this.form.securities.map(entry => ({ ...entry }))
    };
    this.saveFormToStorage();
    this.router.navigate(['/loms', 'document-application', 'application']);
  }

  goBackToFinancial(): void {
    this.saveAsDraft();
    this.router.navigate(['/loms', 'financial-application', 'application']);
  }

  exportApplicationData(): SecurityApplicationForm {
    return {
      securities: this.form.securities.map(entry => ({ ...entry }))
    };
  }

  get totalSecurityValue(): number {
    return this.form.securities.reduce((sum, entry) => {
      const value = parseFloat(entry.forcedSaleValue || entry.marketValue);
      if (!Number.isFinite(value) || value <= 0) {
        return sum;
      }
      return sum + value;
    }, 0);
  }

  get loanToValueRatio(): number {
    if (this.referenceLoanAmount <= 0) {
      return 0;
    }
    const ratio = (this.totalSecurityValue / this.referenceLoanAmount) * 100;
    if (!Number.isFinite(ratio) || ratio <= 0) {
      return 0;
    }
    return ratio;
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

  private loadFormFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(this.formStorageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as SecurityApplicationForm;
      if (parsed && Array.isArray(parsed.securities) && parsed.securities.length) {
        this.form = {
          securities: parsed.securities.map(entry => ({ ...entry }))
        };
        this.nextSecurityId =
          parsed.securities.reduce((max, entry) => (entry.id && entry.id > max ? entry.id : max), 0) + 1;
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
      const snapshot: SecurityApplicationForm = {
        securities: this.form.securities.map(entry => ({ ...entry }))
      };
      window.sessionStorage.setItem(this.formStorageKey, JSON.stringify(snapshot));
    } catch {
    }
  }
}
