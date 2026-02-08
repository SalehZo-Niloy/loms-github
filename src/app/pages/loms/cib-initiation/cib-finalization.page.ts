import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { CibFinalizationForm, CibLoanEntry, CibPersona, CibStateService } from '../../../services/cib-state.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-loms-cib-finalization-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cib-finalization.page.html'
})
export class LomsCibFinalizationPageComponent {
  title = 'CIB Finalization';

  stepTitles = ['CIB Initiation', 'Officer Assignment', 'CIB Finalization'];

  personas: CibPersona[] = [];
  selectedPersona: CibPersona | null = null;

  cibStatusOptions = ['Clean', 'Adverse', 'Restructured'];

  summaryCibStatus = '';
  summaryNumberOfActiveLoans = 0;
  summaryHighestClassification = '';
  summaryCibReportDate = '';

  loanEntries: CibLoanEntry[] = [];
  officerRemarks = '';

  totalOutstandingAmount = 0;
  totalOverdueAmount = 0;

  constructor(
    private cibState: CibStateService,
    private router: Router,
    private alertService: AlertService
  ) {
    const state = this.cibState.getState();
    this.personas = state.personas.filter(p =>
      p.status === 'Assigned' ||
      p.status === 'Data Entry In Progress' ||
      p.status === 'Finalization Pending' ||
      p.status === 'Submitted'
    );
    if (this.personas.length > 0) {
      this.setSelectedPersona(this.personas[0]);
    }
  }

  get hasPersona(): boolean {
    return !!this.selectedPersona;
  }

  get canSaveDraft(): boolean {
    return this.hasPersona;
  }

  get canSendForReview(): boolean {
    return this.hasPersona && !!this.summaryCibStatus && !!this.summaryCibReportDate;
  }

  get canSubmit(): boolean {
    return this.canSendForReview && this.loanEntries.length > 0;
  }

  get isFinalStepCompleted(): boolean {
    return !!this.selectedPersona && this.selectedPersona.status === 'Submitted';
  }

  selectPersona(persona: CibPersona): void {
    this.setSelectedPersona(persona);
  }

  private setSelectedPersona(persona: CibPersona): void {
    this.selectedPersona = persona;
    this.cibState.startDataEntry(persona.appId);
    this.reloadFinalization();
  }

  private reloadFinalization(): void {
    if (!this.selectedPersona) {
      this.loanEntries = [];
      this.summaryCibStatus = '';
      this.summaryNumberOfActiveLoans = 0;
      this.summaryHighestClassification = '';
      this.summaryCibReportDate = '';
      this.officerRemarks = '';
      this.totalOutstandingAmount = 0;
      this.totalOverdueAmount = 0;
      return;
    }
    const state = this.cibState.getState();
    const form = state.finalizations[this.selectedPersona.appId] as CibFinalizationForm | undefined;
    if (!form) {
      this.loanEntries = [];
      this.summaryCibStatus = '';
      this.summaryNumberOfActiveLoans = 0;
      this.summaryHighestClassification = '';
      this.summaryCibReportDate = '';
      this.officerRemarks = '';
      this.totalOutstandingAmount = 0;
      this.totalOverdueAmount = 0;
      return;
    }
    this.summaryCibStatus = form.cibStatus;
    this.summaryNumberOfActiveLoans = form.numberOfActiveLoans;
    this.summaryHighestClassification = form.highestClassification;
    this.summaryCibReportDate = form.cibReportDate;
    this.officerRemarks = form.officerRemarks;
    this.loanEntries = form.loanEntries;
    this.totalOutstandingAmount = form.totalOutstandingAmount;
    this.totalOverdueAmount = form.totalOverdueAmount;
  }

  onSummaryChange(): void {
    if (!this.selectedPersona) return;
    this.cibState.updateFinalizationForm(this.selectedPersona.appId, {
      cibStatus: this.summaryCibStatus,
      numberOfActiveLoans: this.summaryNumberOfActiveLoans,
      highestClassification: this.summaryHighestClassification,
      cibReportDate: this.summaryCibReportDate,
      officerRemarks: this.officerRemarks
    });
    this.reloadFinalization();
  }

  onAddLoanEntry(): void {
    if (!this.selectedPersona) return;
    const empty: CibLoanEntry = {
      bankName: '',
      loanType: '',
      sanctionAmount: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
      classification: ''
    };
    this.cibState.addLoanEntry(this.selectedPersona.appId, empty);
    this.reloadFinalization();
  }

  onLoanFieldChange(index: number, field: keyof CibLoanEntry, value: string): void {
    if (!this.selectedPersona) return;
    let patch: Partial<CibLoanEntry>;
    if (field === 'sanctionAmount' || field === 'outstandingAmount' || field === 'overdueAmount') {
      const raw = value ?? '';
      const asString = typeof raw === 'number' ? String(raw) : String(raw);
      const num = parseFloat(asString.trim() || '0') || 0;
      patch = { [field]: num } as Partial<CibLoanEntry>;
    } else {
      const raw = value ?? '';
      const asString = typeof raw === 'number' ? String(raw) : String(raw);
      patch = { [field]: asString } as Partial<CibLoanEntry>;
    }
    this.cibState.updateLoanEntry(this.selectedPersona.appId, index, patch);
    this.reloadFinalization();
  }

  onLoanFieldBlur(index: number, field: keyof CibLoanEntry, value: any): void {
    if (!this.selectedPersona) return;
    let patch: Partial<CibLoanEntry>;
    if (field === 'sanctionAmount' || field === 'outstandingAmount' || field === 'overdueAmount') {
      const raw = value ?? '';
      const asString = typeof raw === 'number' ? String(raw) : String(raw);
      const num = parseFloat(asString.trim() || '0') || 0;
      patch = { [field]: num } as Partial<CibLoanEntry>;
    } else {
      const raw = value ?? '';
      const asString = typeof raw === 'number' ? String(raw) : String(raw);
      patch = { [field]: asString } as Partial<CibLoanEntry>;
    }
    this.cibState.updateLoanEntry(this.selectedPersona.appId, index, patch);
    this.reloadFinalization();
  }

  onRemoveLoanEntry(index: number): void {
    if (!this.selectedPersona) return;
    this.cibState.removeLoanEntry(this.selectedPersona.appId, index);
    this.reloadFinalization();
  }

  onBackToAssignment(): void {
    this.router.navigate(['/loms', 'cib-initiation', 'officer-assignment']);
  }

  onSaveDraft(): void {
    if (!this.canSaveDraft || !this.selectedPersona) return;
    this.onSummaryChange();
    this.cibState.startDataEntry(this.selectedPersona.appId);
    this.reloadFinalization();
  }

  onSendForReview(): void {
    if (!this.canSendForReview || !this.selectedPersona) return;
    this.onSummaryChange();
    this.cibState.markFinalizationPending(this.selectedPersona.appId);
    this.reloadFinalization();
  }

  async onSubmitReport(): Promise<void> {
    if (!this.canSubmit || !this.selectedPersona) return;
    this.onSummaryChange();
    this.cibState.submitCibReport(this.selectedPersona.appId);
    this.reloadFinalization();
    await this.alertService.showSuccess('CIB report has been submitted successfully.', '#059669');
  }
}
