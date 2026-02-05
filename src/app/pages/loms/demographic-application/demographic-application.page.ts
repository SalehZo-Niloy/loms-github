import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiInputComponent } from '../../../components/ui/ui-input.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { AlertService } from '../../../services/alert.service';

interface DemographicAddress {
  division: string;
  district: string;
  thana: string;
  addressLine: string;
}

interface DemographicPersona {
  id: number;
  type: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
  maritalStatus: string;
  nationalId: string;
  mobileNumber: string;
  emailAddress: string;
  presentAddress: DemographicAddress;
  permanentAddress: DemographicAddress;
  sameAsPresent: boolean;
}

interface DemographicApplicationForm {
  personaType: string;
  personas: DemographicPersona[];
}

type DemographicApplicationStepStatus = 'completed' | 'in-progress' | 'pending';

@Component({
  selector: 'app-loms-demographic-application-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent,
    UiButtonComponent,
    UiInputComponent,
    UiDropdownComponent
  ],
  templateUrl: './demographic-application.page.html'
})
export class LomsDemographicApplicationPageComponent {
  @ViewChildren('stepButton') stepButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  title = 'Demographic Application';

  stepTitles: string[] = [
    'Application Information',
    'Demographic Information',
    'Product Information',
    'Financial Information',
    'Security Information',
    'Document Information',
    'Preview'
  ];

  currentStep = 1;
  completedSteps: number[] = [];
  draftSteps: number[] = [];
  private readonly progressStorageKey = 'lomsCompletedSteps';
  private readonly draftStorageKey = 'lomsDraftSteps';
  private readonly formStorageKey = 'lomsDemographicForm';

  personaTypeOptions = [
    { label: 'Primary Applicant', value: 'primary' },
    { label: 'Co-applicant', value: 'co_applicant' },
    { label: 'Guarantor', value: 'guarantor' },
    { label: 'Reference Person', value: 'reference_person' },
    { label: 'Nominee', value: 'nominee' }
  ];

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  maritalStatusOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
    { label: 'Divorced', value: 'divorced' },
    { label: 'Widowed', value: 'widowed' }
  ];

  divisionOptions = [
    { label: 'Dhaka', value: 'dhaka' },
    { label: 'Chittagong', value: 'chittagong' },
    { label: 'Khulna', value: 'khulna' },
    { label: 'Rajshahi', value: 'rajshahi' },
    { label: 'Rangpur', value: 'rangpur' },
    { label: 'Sylhet', value: 'sylhet' }
  ];

  districtOptions = [
    { label: 'Dhaka', value: 'dhaka' },
    { label: 'Bogura', value: 'bogura' },
    { label: 'Comilla', value: 'comilla' },
    { label: 'Feni', value: 'feni' },
    { label: 'Jessore', value: 'jessore' },
    { label: 'Kushtia', value: 'kushtia' },
    { label: 'Lakshmipur', value: 'lakshmipur' },
    { label: 'Madaripur', value: 'madaripur' },
    { label: 'Manikganj', value: 'manikganj' },
    { label: 'Narayanganj', value: 'narayanganj' },
    { label: 'Natore', value: 'natore' },
    { label: 'Pabna', value: 'pabna' },
    { label: 'Rajshahi', value: 'rajshahi' },
    { label: 'Rangpur', value: 'rangpur' },

  ];

  thanaOptions = [
    { label: 'Thana 1', value: 'thana1' },
    { label: 'Thana 2', value: 'thana2' },
    { label: 'Thana 3', value: 'thana3' }
  ];

  nextPersonaId = 2;

  activePersonaId = 1;

  validationErrors: {
    [personaId: number]: {
      presentAddress?: string[];
      permanentAddress?: string[];
    };
  } = {};

  form: DemographicApplicationForm = {
    personaType: 'co_applicant',
    personas: [
      {
        id: 1,
        type: 'primary',
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        nationalId: '',
        mobileNumber: '',
        emailAddress: '',
        presentAddress: {
          division: '',
          district: '',
          thana: '',
          addressLine: ''
        },
        permanentAddress: {
          division: '',
          district: '',
          thana: '',
          addressLine: ''
        },
        sameAsPresent: false
      }
    ]
  };

  lastSavedDraft: DemographicApplicationForm | null = null;
  lastSubmittedApplication: DemographicApplicationForm | null = null;

  constructor(private router: Router, private alertService: AlertService) {
    this.loadCompletedStepsFromStorage();
    this.loadFormFromStorage();
  }

  addPersona(): void {
    const type = this.form.personaType || 'co_applicant';
    if (type === 'primary') {
      const hasPrimary = this.form.personas.some(persona => persona.type === 'primary');
      if (hasPrimary) {
        return;
      }
    }

    const persona: DemographicPersona = {
      id: this.nextPersonaId++,
      type,
      fullName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationalId: '',
      mobileNumber: '',
      emailAddress: '',
      presentAddress: {
        division: '',
        district: '',
        thana: '',
        addressLine: ''
      },
      permanentAddress: {
        division: '',
        district: '',
        thana: '',
        addressLine: ''
      },
      sameAsPresent: false
    };

    this.form.personas = [...this.form.personas, persona];
    this.activePersonaId = persona.id;
  }

  getPersonaLabel(type: string): string {
    const found = this.personaTypeOptions.find(option => option.value === type);
    if (found) {
      return found.label;
    }
    return 'Applicant';
  }

  get mainApplicant(): DemographicPersona | null {
    const persona = this.form.personas.find(item => item.type === 'primary');
    if (!persona) {
      return null;
    }
    return persona;
  }

  get activePersona(): DemographicPersona | null {
    const persona = this.form.personas.find(item => item.id === this.activePersonaId);
    if (persona) {
      return persona;
    }
    if (this.form.personas.length > 0) {
      return this.form.personas[0];
    }
    return null;
  }

  get otherPersonas(): DemographicPersona[] {
    const main = this.mainApplicant;
    return this.form.personas.filter(persona => {
      if (!main) {
        return true;
      }
      return persona.id !== main.id;
    });
  }

  setActivePersona(id: number): void {
    const exists = this.form.personas.some(persona => persona.id === id);
    if (!exists) {
      return;
    }
    this.activePersonaId = id;
  }

  isMainApplicantActive(): boolean {
    const main = this.mainApplicant;
    if (!main) {
      return false;
    }
    const active = this.activePersona;
    if (!active) {
      return false;
    }
    return active.id === main.id;
  }

  getStepStatus(index: number): DemographicApplicationStepStatus {
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
      this.currentStep = 1;
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
      this.router.navigate(['/loms', 'document-application', 'application'], {
        queryParams: { step: 5 }
      });
      return;
    }

    if (index === 6) {
      this.router.navigate(['/loms', 'document-application', 'application'], {
        queryParams: { step: 6 }
      });
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

  private setPersonaAddressErrors(
    personaId: number,
    errors: { presentAddress?: string[]; permanentAddress?: string[] }
  ): void {
    if (errors.presentAddress || errors.permanentAddress) {
      this.validationErrors = { ...this.validationErrors, [personaId]: errors };
      return;
    }
    const updated = { ...this.validationErrors };
    delete updated[personaId];
    this.validationErrors = updated;
  }

  private clearPersonaAddressErrors(
    personaId: number,
    section?: 'presentAddress' | 'permanentAddress'
  ): void {
    const existing = this.validationErrors[personaId];
    if (!existing) {
      return;
    }
    if (!section) {
      const updated = { ...this.validationErrors };
      delete updated[personaId];
      this.validationErrors = updated;
      return;
    }
    const updatedSection = { ...existing };
    delete updatedSection[section];
    if (!updatedSection.presentAddress && !updatedSection.permanentAddress) {
      const updated = { ...this.validationErrors };
      delete updated[personaId];
      this.validationErrors = updated;
      return;
    }
    this.validationErrors = { ...this.validationErrors, [personaId]: updatedSection };
  }

  private validatePersonaAddresses(persona: DemographicPersona): boolean {
    const presentErrors: string[] = [];
    if (!persona.presentAddress.division) {
      presentErrors.push('Present division is required.');
    }
    if (!persona.presentAddress.district) {
      presentErrors.push('Present district is required.');
    }
    if (!persona.presentAddress.thana) {
      presentErrors.push('Present thana is required.');
    }
    if (!persona.presentAddress.addressLine) {
      presentErrors.push('Present address is required.');
    }

    const permanentErrors: string[] = [];
    if (!persona.permanentAddress.division) {
      permanentErrors.push('Permanent division is required.');
    }
    if (!persona.permanentAddress.district) {
      permanentErrors.push('Permanent district is required.');
    }
    if (!persona.permanentAddress.thana) {
      permanentErrors.push('Permanent thana is required.');
    }
    if (!persona.permanentAddress.addressLine) {
      permanentErrors.push('Permanent address is required.');
    }

    const errors: { presentAddress?: string[]; permanentAddress?: string[] } = {};
    if (presentErrors.length) {
      errors.presentAddress = presentErrors;
    }
    if (permanentErrors.length) {
      errors.permanentAddress = permanentErrors;
    }
    this.setPersonaAddressErrors(persona.id, errors);
    return !presentErrors.length && !permanentErrors.length;
  }

  private validateAllPersonas(): boolean {
    let allValid = true;
    for (const persona of this.form.personas) {
      const valid = this.validatePersonaAddresses(persona);
      if (!valid) {
        allValid = false;
      }
    }
    return allValid;
  }

  proceedToNextStep(): void {
    const isValid = this.validateAllPersonas();
    if (!isValid) {
      return;
    }
    this.lastSubmittedApplication = { ...this.form };
    if (!this.completedSteps.includes(this.currentStep)) {
      this.completedSteps.push(this.currentStep);
      this.draftSteps = this.draftSteps.filter(step => step !== this.currentStep);
      this.saveCompletedStepsToStorage();
    }
    this.saveFormToStorage();
    this.router.navigate(['/loms', 'product-application', 'application']);
  }

  toggleSameAsPresent(persona: DemographicPersona): void {
    if (persona.sameAsPresent) {
      persona.permanentAddress = { ...persona.presentAddress };
      this.clearPersonaAddressErrors(persona.id, 'permanentAddress');
    }
  }

  exportApplicationData(): DemographicApplicationForm {
    return this.form;
  }

  goBackToLoanApplication(): void {
    this.saveAsDraft();
    this.router.navigate(['/loms', 'loan-application', 'application']);
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
      const parsed = JSON.parse(raw) as Partial<DemographicApplicationForm>;
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

