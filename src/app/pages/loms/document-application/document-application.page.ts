import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { AlertService } from '../../../services/alert.service';

type DocumentUploadStatus = 'pending' | 'uploaded' | 'failed';

interface DocumentUploadEntry {
  id: number;
  typeValue: string;
  typeLabel: string;
  fileName: string;
  fileSizeBytes: number;
  status: DocumentUploadStatus;
  uploadedAt: string | null;
  description: string;
}

interface DocumentApplicationForm {
  documents: DocumentUploadEntry[];
}

type DocumentApplicationStepStatus = 'completed' | 'in-progress' | 'pending';

@Component({
  selector: 'app-loms-document-application-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, UiButtonComponent, UiDropdownComponent],
  templateUrl: './document-application.page.html',
})
export class LomsDocumentApplicationPageComponent {
  @ViewChildren('stepButton') stepButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  title = 'Loan Application Form';

  stepTitles: string[] = [
    'Application Information',
    'Document Information',
    'Demographic Information',
    'Product Information',
    'Security Information',
    'Financial Information',
    'Financial Assessment',
    'Preview',
  ];

  currentStep = 1;
  completedSteps: number[] = [];
  draftSteps: number[] = [];
  private readonly progressStorageKey = 'lomsCompletedSteps';
  private readonly draftStorageKey = 'lomsDraftSteps';
  private readonly formStorageKey = 'lomsDocumentForm';

  form: DocumentApplicationForm = {
    documents: [],
  };

  lastSavedDraft: DocumentApplicationForm | null = null;
  lastSubmittedApplication: DocumentApplicationForm | null = null;

  nextDocumentId = 1;

  documentTypeOptions = [
    { label: 'National ID (NID)', value: 'nid' },
    { label: 'Photograph', value: 'photo' },
    { label: 'Bank Statement', value: 'bank_statement' },
    { label: 'Utility Bill', value: 'utility_bill' },
    { label: 'Salary Certificate', value: 'salary_certificate' },
    { label: 'Other Supporting Document', value: 'supporting' },
  ];

  selectedDocumentType = '';

  constructor(
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) {
    this.loadCompletedStepsFromStorage();
    this.loadFormFromStorage();
  }

  getStepStatus(index: number): DocumentApplicationStepStatus {
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
        'ease-out',
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
        'ease-out',
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
        'ease-out',
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
      'ease-out',
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
      this.currentStep = 1;
      return;
    }

    if (index === 2) {
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

  removeDocument(id: number): void {
    this.form.documents = this.form.documents.filter((d) => d.id !== id);
  }

  onCommonFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!this.selectedDocumentType) {
      input.value = '';
      return;
    }
    if (!input.files || input.files.length === 0) {
      return;
    }

    const newEntries = Array.from(input.files).map((file) =>
      this.createDocumentFromFile(file, this.selectedDocumentType),
    );
    this.form.documents = [...this.form.documents, ...newEntries];
    input.value = '';
    this.saveFormToStorage();
  }

  saveAsDraft(): void {
    this.lastSavedDraft = {
      documents: this.cloneDocuments(this.form.documents),
    };
    this.saveFormToStorage();
  }

  saveDraftWithAlert(): void {
    this.saveAsDraft();
    if (
      !this.completedSteps.includes(this.currentStep) &&
      !this.draftSteps.includes(this.currentStep)
    ) {
      this.draftSteps.push(this.currentStep);
      this.saveCompletedStepsToStorage();
    }
    this.alertService.showSuccess('Draft has been saved.', '#2563eb');
  }

  proceedToNextStep(): void {
    this.lastSubmittedApplication = {
      documents: this.cloneDocuments(this.form.documents),
    };
    this.saveFormToStorage();
    if (!this.completedSteps.includes(this.currentStep)) {
      this.completedSteps.push(this.currentStep);
      this.draftSteps = this.draftSteps.filter((step) => step !== this.currentStep);
      this.saveCompletedStepsToStorage();
    }
    this.router.navigate(['/loms', 'application-preview']);
  }

  goBackToFinancial(): void {
    this.saveAsDraft();
    this.router.navigate(['/loms', 'security-application', 'application']);
  }

  exportApplicationData(): DocumentApplicationForm {
    return {
      documents: this.cloneDocuments(this.form.documents),
    };
  }

  getUploadStatusLabel(entry: DocumentUploadEntry): string {
    if (entry.status === 'uploaded') {
      return 'Uploaded Successfully';
    }
    if (entry.status === 'failed') {
      return 'Upload Failed';
    }
    return 'Pending Upload';
  }

  getUploadStatusDescription(entry: DocumentUploadEntry): string {
    if (entry.status === 'uploaded') {
      return 'File is uploaded and ready for review.';
    }
    if (entry.status === 'failed') {
      return 'There was a problem with this upload.';
    }
    return 'No file uploaded yet.';
  }

  getFileSizeLabel(entry: DocumentUploadEntry): string {
    if (!entry.fileSizeBytes) {
      return '';
    }
    const kb = entry.fileSizeBytes / 1024;
    if (kb < 1024) {
      return kb.toFixed(1) + ' KB';
    }
    const mb = kb / 1024;
    return mb.toFixed(1) + ' MB';
  }

  getUploadedAtLabel(entry: DocumentUploadEntry): string {
    if (!entry.uploadedAt) {
      return '';
    }
    const date = new Date(entry.uploadedAt);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString();
  }

  getUploadProgress(entry: DocumentUploadEntry): number {
    if (entry.status === 'uploaded') {
      return 100;
    }
    if (entry.status === 'failed') {
      return 0;
    }
    return 0;
  }

  private createDocumentFromFile(file: File, typeValue?: string): DocumentUploadEntry {
    const selectedValue = typeValue || '';
    const matched = this.documentTypeOptions.find((option) => option.value === selectedValue);
    const typeLabel = matched?.label || this.getTypeLabelFromFile(file.name);
    return {
      id: this.nextDocumentId++,
      typeValue: selectedValue || 'general',
      typeLabel,
      fileName: file.name,
      fileSizeBytes: file.size,
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      description: '',
    };
  }

  private getTypeLabelFromFile(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) {
      return 'Supporting Document';
    }
    if (ext === 'pdf') {
      return 'PDF Document';
    }
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
      return 'Image Document';
    }
    return 'Supporting Document';
  }

  private cloneDocuments(entries: DocumentUploadEntry[]): DocumentUploadEntry[] {
    return entries.map((entry) => ({ ...entry }));
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
      const parsed = JSON.parse(raw) as DocumentApplicationForm;
      if (parsed && Array.isArray(parsed.documents)) {
        this.form = {
          documents: this.cloneDocuments(parsed.documents),
        };
        const maxId = parsed.documents.reduce(
          (max, entry) => (entry.id && entry.id > max ? entry.id : max),
          0,
        );
        this.nextDocumentId = maxId + 1;
      }
    } catch {}
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
            .map((value) => Number(value));
        }
      }

      const rawDraft = window.sessionStorage.getItem(this.draftStorageKey);
      if (rawDraft) {
        const parsedDraft = JSON.parse(rawDraft);
        if (Array.isArray(parsedDraft)) {
          this.draftSteps = parsedDraft
            .filter((value: unknown) => Number.isInteger(value as number))
            .map((value) => Number(value));
        }
      }
    } catch {}
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
    } catch {}
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
      } catch {}
    }
    this.router.navigate(['/loms', 'loan-application', 'application']);
  }

  private saveFormToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const snapshot: DocumentApplicationForm = {
        documents: this.cloneDocuments(this.form.documents),
      };
      window.sessionStorage.setItem(this.formStorageKey, JSON.stringify(snapshot));
    } catch {}
  }
}
