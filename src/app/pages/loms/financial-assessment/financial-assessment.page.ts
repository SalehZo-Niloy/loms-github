import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import Swal from 'sweetalert2';

interface SecurityEntryPreview {
  securityType: string;
  securityOwnership: string;
  propertyType: string;
  marketValue: string;
  forcedSaleValue: string;
  valuationDate: string;
}

interface ExistingFacility {
  facilityName: string;
  institution: string;
  facilityType: string;
  outstanding: string;
  emi: string;
}

interface FinancialAssessmentState {
  primary: FinancialAssessmentForm;
  coApplicants: FinancialAssessmentForm[];
}

interface FinancialAssessmentForm {
  schemeName: string;
  productName: string;
  requestType: string;
  reviewType: string;
  persona: string;

  incomeProfile: string;
  industrySegment: string;
  incomeCategory: string;
  grossMonthlyIncome: string;
  variableMonthlyIncome: string;
  rentalIncome: string;
  otherIncome: string;

  basicSalary: string;
  houseRentAllowance: string;
  conveyanceAllowance: string;
  otherAllowance: string;
  salaryCreditMode: string;
  employerCategory: string;

  livingExpenses: string;
  liabilityExpenses: string;
  otherExpenses: string;

  existingLoanOutstanding: string;
  existingLoanEmi: string;
  creditCardLimit: string;
  creditCardOutstanding: string;
  creditCardMinPayment: string;

  totalMonthlyIncome: string;
  totalMonthlyExpenses: string;
  netDisposableIncome: string;
  interestRateSection4: string;

  proposedLoanAmount: string;
  proposedTenorMonths: string;
  proposedEmi: string;
  interestRateSection5: string;
  dbrBefore: string;
  dbrAfter: string;

  systemOpinion: string;
  systemOpinionReason: string;
  suggestedLoanAdjustment: string;
  suggestedTenorAdjustment: string;
}

@Component({
  selector: 'app-loms-financial-assessment-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent
  ],
  templateUrl: './financial-assessment.page.html'
})
export class LomsFinancialAssessmentPageComponent {
  requestedAmountDisplay = '';
  totalSecurityValueDisplay = '';
  loanToValueRatioDisplay = '';

  securities: SecurityEntryPreview[] = [];
  existingFacilities: ExistingFacility[] = [];

  primaryForm!: FinancialAssessmentForm;
  coApplicantForms: FinancialAssessmentForm[] = [];
  activePersonaIndex = 0;
  form!: FinancialAssessmentForm;

  private readonly requestedAmountKey = 'lomsRequestedAmount';
  private readonly securityFormKey = 'lomsSecurityForm';
  private readonly formStorageKey = 'lomsFinancialAssessmentForm';
  private readonly existingFacilitiesKey = 'lomsExistingFacilities';

  constructor() {
    this.primaryForm = this.createEmptyForm();
    this.form = this.primaryForm;
    this.loadRequestedAmount();
    this.loadSecurities();
    this.loadExistingFacilities();
    this.loadForm();
    this.recalculateFromForm();
    this.calculateLoanToValueRatio();
  }

  private createEmptyForm(): FinancialAssessmentForm {
    return {
      schemeName: '',
      productName: '',
      requestType: '',
      reviewType: '',
      persona: '',
      incomeProfile: '',
      industrySegment: '',
      incomeCategory: '',
      grossMonthlyIncome: '',
      variableMonthlyIncome: '',
      rentalIncome: '',
      otherIncome: '',
      basicSalary: '',
      houseRentAllowance: '',
      conveyanceAllowance: '',
      otherAllowance: '',
      salaryCreditMode: '',
      employerCategory: '',
      livingExpenses: '',
      liabilityExpenses: '',
      otherExpenses: '',
      existingLoanOutstanding: '',
      existingLoanEmi: '',
      creditCardLimit: '',
      creditCardOutstanding: '',
      creditCardMinPayment: '',
      totalMonthlyIncome: '',
      totalMonthlyExpenses: '',
      netDisposableIncome: '',
      interestRateSection4: '',
      proposedLoanAmount: '',
      proposedTenorMonths: '',
      proposedEmi: '',
      interestRateSection5: '',
      dbrBefore: '',
      dbrAfter: '',
      systemOpinion: '',
      systemOpinionReason: '',
      suggestedLoanAdjustment: '',
      suggestedTenorAdjustment: ''
    };
  }

  get personaOptions(): string[] {
    const labels = ['Primary Applicant'];
    for (let i = 0; i < this.coApplicantForms.length; i++) {
      labels.push(`Co-Applicant ${i + 1}`);
    }
    return labels;
  }

  get ltvRatioClass(): string {
    const value = parseFloat(this.loanToValueRatioDisplay.replace('%', ''));
    if (!Number.isFinite(value)) {
      return 'text-slate-600';
    }
    if (value <= 70) {
      return 'text-emerald-700';
    }
    if (value <= 85) {
      return 'text-amber-600';
    }
    return 'text-red-600';
  }

  get dbrAfterClass(): string {
    const value = parseFloat(this.form.dbrAfter.replace('%', ''));
    if (!Number.isFinite(value)) {
      return 'text-slate-700';
    }
    if (value <= 40) {
      return 'text-emerald-700';
    }
    if (value <= 55) {
      return 'text-amber-600';
    }
    return 'text-red-600';
  }

  onAmountFieldChange(): void {
    this.recalculateFromForm();
  }

  onFinalizeAssessment(): void {
    this.recalculateFromForm();
    this.saveFormToStorage();
    this.showFinalizeSuccessAlert();
  }

  onSimpleFieldChange(): void {
    this.saveFormToStorage();
  }

  private loadRequestedAmount(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(this.requestedAmountKey);
      if (!raw) {
        this.requestedAmountDisplay = '';
        return;
      }
      const value = parseFloat(raw);
      if (!Number.isFinite(value) || value <= 0) {
        this.requestedAmountDisplay = '';
        return;
      }
      this.requestedAmountDisplay = this.formatAmount(value);
    } catch {
      this.requestedAmountDisplay = '';
    }
  }

  private loadForm(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(this.formStorageKey);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as FinancialAssessmentState | FinancialAssessmentForm | null;
      if (!parsed) {
        return;
      }
      if ((parsed as FinancialAssessmentState).primary) {
        const state = parsed as FinancialAssessmentState;
        this.primaryForm = {
          ...this.createEmptyForm(),
          ...(state.primary || {})
        };
        this.coApplicantForms = Array.isArray(state.coApplicants)
          ? state.coApplicants.map(form => ({
              ...this.createEmptyForm(),
              ...form
            }))
          : [];
      } else {
        const single = parsed as Partial<FinancialAssessmentForm>;
        this.primaryForm = {
          ...this.createEmptyForm(),
          ...single
        };
        this.coApplicantForms = [];
      }
      this.activePersonaIndex = 0;
      this.form = this.primaryForm;
    } catch {
    }
  }

  private loadSecurities(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(this.securityFormKey);
      if (!raw) {
        this.securities = [];
        return;
      }
      const parsed = JSON.parse(raw) as { securities?: any[] } | null;
      if (!parsed || !Array.isArray(parsed.securities)) {
        this.securities = [];
        return;
      }
      this.securities = parsed.securities.map(entry => ({
        securityType: entry.securityType || '',
        securityOwnership: entry.securityOwnership || '',
        propertyType: entry.propertyType || '',
        marketValue: entry.marketValue || '',
        forcedSaleValue: entry.forcedSaleValue || '',
        valuationDate: entry.valuationDate || ''
      }));
    } catch {
      this.securities = [];
    }
  }

  private loadExistingFacilities(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(this.existingFacilitiesKey);
      if (!raw) {
        this.existingFacilities = [];
        return;
      }
      const parsed = JSON.parse(raw) as ExistingFacility[] | null;
      if (!parsed || !Array.isArray(parsed)) {
        this.existingFacilities = [];
        return;
      }
      this.existingFacilities = parsed.map(item => ({
        facilityName: item.facilityName || '',
        institution: item.institution || '',
        facilityType: item.facilityType || '',
        outstanding: item.outstanding || '',
        emi: item.emi || ''
      }));
      this.recalculateExistingFacilityTotals();
    } catch {
      this.existingFacilities = [];
    }
  }

  private calculateLoanToValueRatio(): void {
    const requested = this.parseAmount(this.requestedAmountDisplay);
    const totalSecurity = this.calculateTotalSecurityValue();

    if (requested <= 0 || totalSecurity <= 0) {
      this.totalSecurityValueDisplay = totalSecurity > 0 ? this.formatAmount(totalSecurity) : '';
      this.loanToValueRatioDisplay = '';
      return;
    }

    const ratio = (requested / totalSecurity) * 100;
    this.totalSecurityValueDisplay = this.formatAmount(totalSecurity);
    this.loanToValueRatioDisplay = ratio.toFixed(2) + '%';
  }

  private recalculateFromForm(): void {
    const basic = this.parseAmount(this.form.basicSalary);
    const hra = this.parseAmount(this.form.houseRentAllowance);
    const conveyance = this.parseAmount(this.form.conveyanceAllowance);
    const otherAllowance = this.parseAmount(this.form.otherAllowance);

    const standardIncome = basic + hra + conveyance + otherAllowance;
    const variable = this.parseAmount(this.form.variableMonthlyIncome);
    const rental = this.parseAmount(this.form.rentalIncome);
    const otherInc = this.parseAmount(this.form.otherIncome);

    const totalIncome = standardIncome + variable + rental + otherInc;

    if (standardIncome > 0) {
      this.form.grossMonthlyIncome = this.formatAmount(standardIncome);
    }

    this.form.totalMonthlyIncome = totalIncome > 0 ? this.formatAmount(totalIncome) : '';

    const living = this.parseAmount(this.form.livingExpenses);
    const liability = this.parseAmount(this.form.liabilityExpenses);
    const otherExp = this.parseAmount(this.form.otherExpenses);

    const totalExp = living + liability + otherExp;
    this.form.totalMonthlyExpenses = totalExp > 0 ? this.formatAmount(totalExp) : '';

    const ndi = totalIncome - totalExp;
    this.form.netDisposableIncome =
      Number.isFinite(ndi) && ndi !== 0 ? this.formatAmount(ndi) : '';

    const proposedEmi = this.parseAmount(this.form.proposedEmi);
    const existingEmi = this.parseAmount(this.form.existingLoanEmi);

    const totalEmi = proposedEmi + existingEmi;
    const dbrBefore =
      totalIncome > 0 ? (existingEmi / totalIncome) * 100 : NaN;
    const dbrAfter =
      totalIncome > 0 ? (totalEmi / totalIncome) * 100 : NaN;

    this.form.dbrBefore = Number.isFinite(dbrBefore)
      ? dbrBefore.toFixed(2) + '%'
      : '';
    this.form.dbrAfter = Number.isFinite(dbrAfter)
      ? dbrAfter.toFixed(2) + '%'
      : '';

    this.saveFormToStorage();
  }

  private recalculateExistingFacilityTotals(): void {
    if (!this.existingFacilities.length) {
      return;
    }
    const totalOutstanding = this.existingFacilities.reduce((sum, item) => {
      const value = this.parseAmount(item.outstanding);
      return sum + (Number.isFinite(value) && value > 0 ? value : 0);
    }, 0);
    const totalEmi = this.existingFacilities.reduce((sum, item) => {
      const value = this.parseAmount(item.emi);
      return sum + (Number.isFinite(value) && value > 0 ? value : 0);
    }, 0);
    this.form.existingLoanOutstanding =
      totalOutstanding > 0 ? this.formatAmount(totalOutstanding) : '';
    this.form.existingLoanEmi =
      totalEmi > 0 ? this.formatAmount(totalEmi) : '';
  }

  private saveExistingFacilities(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.sessionStorage.setItem(
        this.existingFacilitiesKey,
        JSON.stringify(this.existingFacilities)
      );
    } catch {
    }
  }

  private saveFormToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const state: FinancialAssessmentState = {
        primary: this.primaryForm,
        coApplicants: this.coApplicantForms
      };
      window.sessionStorage.setItem(
        this.formStorageKey,
        JSON.stringify(state)
      );
    } catch {
    }
  }

  private calculateTotalSecurityValue(): number {
    if (!this.securities.length) {
      return 0;
    }
    return this.securities.reduce((sum, entry) => {
      const value = this.parseAmount(entry.forcedSaleValue || entry.marketValue);
      if (!Number.isFinite(value) || value <= 0) {
        return sum;
      }
      return sum + value;
    }, 0);
  }

  private parseAmount(value: string): number {
    if (!value) {
      return 0;
    }
    const cleaned = value.replace(/,/g, '').replace(/[^\d.]/g, '');
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private formatAmount(value: number): string {
    if (!Number.isFinite(value)) {
      return '';
    }
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  addExistingFacility(): void {
    this.existingFacilities = [
      ...this.existingFacilities,
      {
        facilityName: '',
        institution: '',
        facilityType: '',
        outstanding: '',
        emi: ''
      }
    ];
    this.saveExistingFacilities();
  }

  onExistingFacilityChange(): void {
    this.recalculateExistingFacilityTotals();
    this.saveExistingFacilities();
    this.saveFormToStorage();
    this.recalculateFromForm();
  }

  onPersonaChange(index: number): void {
    if (index === this.activePersonaIndex) {
      return;
    }
    this.activePersonaIndex = index;
    if (index === 0) {
      this.form = this.primaryForm;
    } else {
      const coIndex = index - 1;
      if (!this.coApplicantForms[coIndex]) {
        this.coApplicantForms[coIndex] = this.createEmptyForm();
      }
      this.form = this.coApplicantForms[coIndex];
    }
    this.form.persona = this.personaOptions[index] || '';
  }

  onExcelSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }
    const name = file.name.toLowerCase();
    if (
      !(
        name.endsWith('.xlsx') ||
        name.endsWith('.xls') ||
        name.endsWith('.csv')
      )
    ) {
      input.value = '';
      return;
    }
    this.applyMockExcelResult();
    input.value = '';
  }

  private applyMockExcelResult(): void {
    this.form.incomeProfile = 'Salaried';
    this.form.industrySegment = 'Service';
    this.form.incomeCategory = 'Professional';
    this.form.basicSalary = this.formatAmount(150000);
    this.form.houseRentAllowance = this.formatAmount(30000);
    this.form.conveyanceAllowance = this.formatAmount(10000);
    this.form.otherAllowance = this.formatAmount(5000);
    this.form.variableMonthlyIncome = this.formatAmount(20000);
    this.form.rentalIncome = this.formatAmount(15000);
    this.form.otherIncome = this.formatAmount(5000);
    this.form.salaryCreditMode = 'Bank Transfer';
    this.form.employerCategory = 'Private';
    this.form.livingExpenses = this.formatAmount(60000);
    this.form.liabilityExpenses = this.formatAmount(25000);
    this.form.otherExpenses = this.formatAmount(15000);
    this.recalculateFromForm();
  }

  onOcrPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }
    if (file.type !== 'application/pdf') {
      input.value = '';
      return;
    }
    this.applyMockOcrResult();
    input.value = '';
  }

  private applyMockOcrResult(): void {
    this.existingFacilities = [
      {
        facilityName: 'Home Loan',
        institution: 'ABC Bank',
        facilityType: 'Mortgage',
        outstanding: this.formatAmount(1500000),
        emi: this.formatAmount(45000)
      },
      {
        facilityName: 'Car Loan',
        institution: 'XYZ Finance',
        facilityType: 'Auto Loan',
        outstanding: this.formatAmount(600000),
        emi: this.formatAmount(18000)
      }
    ];
    this.form.creditCardLimit = this.formatAmount(200000);
    this.form.creditCardOutstanding = this.formatAmount(80000);
    this.form.creditCardMinPayment = this.formatAmount(5000);
    this.recalculateExistingFacilityTotals();
    this.saveExistingFacilities();
    this.saveFormToStorage();
    this.recalculateFromForm();
  }

  onSaveDraftClick(): void {
    this.saveFormToStorage();
    this.showDraftSavedTooltip();
  }

  onRefreshClick(): void {
    this.primaryForm = this.createEmptyForm();
    this.coApplicantForms = [];
    this.activePersonaIndex = 0;
    this.form = this.primaryForm;
    this.existingFacilities = [];
    this.saveExistingFacilities();
    this.recalculateFromForm();
    this.calculateLoanToValueRatio();
  }

  onAddCoApplicantClick(): void {
    const newForm = this.createEmptyForm();
    this.coApplicantForms = [...this.coApplicantForms, newForm];
    this.activePersonaIndex = this.coApplicantForms.length;
    this.form = newForm;
    this.form.persona = this.personaOptions[this.activePersonaIndex] || '';
    this.saveFormToStorage();
  }

  private showDraftSavedTooltip(): void {
    Swal.fire({
      icon: 'success',
      title: 'Draft saved',
      text: 'Financial assessment draft has been saved.',
      timer: 1600,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  }

  private showFinalizeSuccessAlert(): void {
    Swal.fire({
      title: 'Assessment finalized',
      text: 'Financial assessment has been finalized successfully.',
      icon: 'success',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'OK'
    });
  }
}
