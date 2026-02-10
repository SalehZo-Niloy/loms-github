import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiSideModalComponent } from '../../../components/ui/ui-side-modal.component';
import { LomsApplicationSubmissionPageComponent } from '../application-submission/application-submission.page';
import { LomsApplicationCommunicationPageComponent } from '../application-communication/application-communication.page';

type StepStatus = 'completed' | 'in-progress' | 'pending' | 'draft';

interface DocumentUploadEntryPreview {
  id: number;
  typeValue: string;
  typeLabel: string;
  fileName: string;
  fileSizeBytes: number;
  status: string | null;
  uploadedAt: string | null;
}

interface DocumentApplicationPreview {
  documents: DocumentUploadEntryPreview[];
}

@Component({
  selector: 'app-loms-application-preview-page',
  standalone: true,
  imports: [
    CommonModule,
    LomsLayoutComponent,
    UiButtonComponent,
    UiSideModalComponent,
    LomsApplicationSubmissionPageComponent,
    LomsApplicationCommunicationPageComponent
  ],
  templateUrl: './application-preview.page.html'
})
export class LomsApplicationPreviewPageComponent {
  @ViewChildren('stepButton') stepButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  title = 'Application Preview';

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

  currentStep = 7;
  completedSteps: number[] = [];
  draftSteps: number[] = [];

  private readonly progressStorageKey = 'lomsCompletedSteps';
  private readonly draftStorageKey = 'lomsDraftSteps';
  private readonly loanFormStorageKey = 'lomsLoanForm';
  private readonly demographicFormStorageKey = 'lomsDemographicForm';
  private readonly productFormStorageKey = 'lomsProductForm';
  private readonly financialFormStorageKey = 'lomsFinancialForm';
  private readonly securityFormStorageKey = 'lomsSecurityForm';
  private readonly documentFormStorageKey = 'lomsDocumentForm';

  loanData: any = null;
  demographicData: any = null;
  productData: any = null;
  financialData: any = null;
  securityData: any = null;
  documentData: DocumentApplicationPreview | null = null;

  showSubmissionDrawer = false;
  showCommunicationDrawer = false;

  constructor(private router: Router) {
    this.loadStepStateFromStorage();
    this.loadAllSectionsFromStorage();
  }

  getStepCircleClasses(index: number): string[] {
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

  getSectionStatusLabel(index: number): string {
    const status = this.getSectionStatus(index);
    if (status === 'completed') {
      return 'Completed';
    }
    if (status === 'draft') {
      return 'Draft';
    }
    return 'Needs Attention';
  }

  getSectionStatusClasses(index: number): string[] {
    const status = this.getSectionStatus(index);

    if (status === 'completed') {
      return [
        'inline-flex',
        'items-center',
        'gap-1.5',
        'rounded-full',
        'border',
        'border-emerald-200',
        'bg-emerald-50',
        'px-2.5',
        'py-0.5',
        'text-[11px]',
        'font-semibold',
        'text-emerald-700'
      ];
    }

    if (status === 'draft') {
      return [
        'inline-flex',
        'items-center',
        'gap-1.5',
        'rounded-full',
        'border',
        'border-amber-200',
        'bg-amber-50',
        'px-2.5',
        'py-0.5',
        'text-[11px]',
        'font-semibold',
        'text-amber-700'
      ];
    }

    return [
      'inline-flex',
      'items-center',
      'gap-1.5',
      'rounded-full',
      'border',
      'border-red-200',
      'bg-red-50',
      'px-2.5',
      'py-0.5',
      'text-[11px]',
      'font-semibold',
      'text-red-700'
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

    this.currentStep = 7;
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

  onEditSection(index: number): void {
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
      this.router.navigate(['/loms', 'security-application', 'application']);
      return;
    }
    if (index === 5) {
      this.router.navigate(['/loms', 'demographic-application', 'application']);
      return;
    }
  }

  onConfirmSubmission(): void {
    this.router.navigate(['/loms']);
  }

  goToSubmission(): void {
    this.showCommunicationDrawer = false;
    this.showSubmissionDrawer = true;
  }

  goToCommunication(): void {
    this.showSubmissionDrawer = false;
    this.showCommunicationDrawer = true;
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

  private getSectionStatus(index: number): StepStatus {
    const stepIndex =
      index === 0
        ? 0
        : index === 1
        ? 2
        : index === 2
        ? 3
        : index === 3
        ? 5
        : index === 4
        ? 4
        : index === 5
        ? 2
        : index;

    if (this.completedSteps.includes(stepIndex)) {
      return 'completed';
    }
    if (this.draftSteps.includes(stepIndex)) {
      return 'draft';
    }
    if (stepIndex === this.currentStep) {
      return 'in-progress';
    }
    return 'pending';
  }

  private loadStepStateFromStorage(): void {
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

  private loadAllSectionsFromStorage(): void {
    this.loanData = this.loadLoanSection();
    this.demographicData = this.loadSection(this.demographicFormStorageKey);
    this.productData = this.loadSection(this.productFormStorageKey);
    this.financialData = this.loadSection(this.financialFormStorageKey);
    this.securityData = this.loadSection(this.securityFormStorageKey);
    this.documentData = this.loadDocumentSection();
  }

  private loadLoanSection(): any | null {
    const raw = this.loadSection(this.loanFormStorageKey);
    if (!raw) {
      return null;
    }
    return {
      ...raw,
      applicationDate: raw.applicationDate || raw.applyDate || null
    };
  }

  private loadDocumentSection(): DocumentApplicationPreview | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const raw = window.sessionStorage.getItem(this.documentFormStorageKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as DocumentApplicationPreview;
      if (!parsed || !Array.isArray(parsed.documents)) {
        return null;
      }
      return {
        documents: parsed.documents.map(entry => ({ ...entry }))
      };
    } catch {
      return null;
    }
  }

  private loadSection(storageKey: string): any | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as any;
    } catch {
      return null;
    }
  }
}
