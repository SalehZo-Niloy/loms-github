import { Injectable } from '@angular/core';

export type CibStatus = 'Not Requested' | 'Draft' | 'Initiated' | 'Pending Assignment' | 'Assigned' | 'Data Entry In Progress' | 'Finalization Pending' | 'Submitted';

export interface CibPersona {
  appId: string;
  personaType: 'Applicant' | 'Co-Applicant' | 'Guarantor';
  fullName: string;
  nid: string;
  dob: string;
  mobile: string;
  status: CibStatus;
}

export interface CibAssignment {
  appId: string;
  personaType: string;
  assignedOfficer: string | null;
  priority: 'Low' | 'Normal' | 'High';
  expectedCompletionDate: string | null;
  remarks: string;
}

export interface CibLoanEntry {
  bankName: string;
  loanType: string;
  sanctionAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  classification: string;
}

export interface CibFinalizationForm {
  cibStatus: string;
  numberOfActiveLoans: number;
  totalOutstandingAmount: number;
  totalOverdueAmount: number;
  highestClassification: string;
  cibReportDate: string;
  loanEntries: CibLoanEntry[];
  officerRemarks: string;
}

export interface CibWorkflowState {
  personas: CibPersona[];
  assignments: CibAssignment[];
  finalizations: Record<string, CibFinalizationForm>;
  currentStepIndex: number;
}

@Injectable({ providedIn: 'root' })
export class CibStateService {
  private readonly storageKey = 'lomsCibState';
  private state: CibWorkflowState = {
    personas: [],
    assignments: [],
    finalizations: {},
    currentStepIndex: 0
  };

  constructor() {
    this.load();
    if (this.state.personas.length === 0) {
      this.bootstrapDemo();
      this.save();
    }
  }

  getState(): CibWorkflowState {
    return this.state;
  }

  setCurrentStep(index: number): void {
    this.state.currentStepIndex = index;
    this.save();
  }

  searchPersonas(query: string): CibPersona[] {
    const q = (query || '').toLowerCase();
    if (!q) return this.state.personas;
    return this.state.personas.filter(p =>
      p.appId.toLowerCase().includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.nid.toLowerCase().includes(q)
    );
  }

  initiateRequests(appIds: string[]): void {
    this.state.personas = this.state.personas.map(p =>
      appIds.includes(p.appId)
        ? { ...p, status: p.status === 'Not Requested' ? 'Initiated' : p.status }
        : p
    );
    this.save();
  }

  markDraft(appIds: string[]): void {
    this.state.personas = this.state.personas.map(p =>
      appIds.includes(p.appId)
        ? {
            ...p,
            status: p.status === 'Not Requested' || p.status === 'Draft' ? 'Draft' : p.status
          }
        : p
    );
    this.save();
  }

  assignOfficer(appIds: string[], officer: string, priority: 'Low' | 'Normal' | 'High', expectedDate: string, remarks: string): void {
    appIds.forEach(appId => {
      const persona = this.state.personas.find(p => p.appId === appId);
      if (!persona) return;
      const existing = this.state.assignments.find(a => a.appId === appId && a.personaType === persona.personaType);
      const assignment: CibAssignment = {
        appId,
        personaType: persona.personaType,
        assignedOfficer: officer,
        priority,
        expectedCompletionDate: expectedDate,
        remarks
      };
      if (existing) {
        Object.assign(existing, assignment);
      } else {
        this.state.assignments.push(assignment);
      }
      persona.status = 'Assigned';
    });
    this.save();
  }

  getAssignment(appId: string): CibAssignment | null {
    const persona = this.state.personas.find(p => p.appId === appId);
    if (!persona) return null;
    return this.state.assignments.find(a => a.appId === appId && a.personaType === persona.personaType) || null;
  }

  startDataEntry(appId: string): void {
    const persona = this.state.personas.find(p => p.appId === appId);
    if (!persona) return;
    persona.status = 'Data Entry In Progress';
    if (!this.state.finalizations[appId]) {
      this.state.finalizations[appId] = {
        cibStatus: '',
        numberOfActiveLoans: 0,
        totalOutstandingAmount: 0,
        totalOverdueAmount: 0,
        highestClassification: '',
        cibReportDate: '',
        loanEntries: [],
        officerRemarks: ''
      };
    }
    this.save();
  }

  addLoanEntry(appId: string, entry: CibLoanEntry): void {
    const form = this.state.finalizations[appId];
    if (!form) return;
    form.loanEntries = [...form.loanEntries, entry];
    this.recalculateTotals(appId);
    this.save();
  }

  updateLoanEntry(appId: string, index: number, entry: Partial<CibLoanEntry>): void {
    const form = this.state.finalizations[appId];
    if (!form) return;
    const current = form.loanEntries[index];
    if (!current) return;
    form.loanEntries[index] = { ...current, ...entry };
    this.recalculateTotals(appId);
    this.save();
  }

  removeLoanEntry(appId: string, index: number): void {
    const form = this.state.finalizations[appId];
    if (!form) return;
    form.loanEntries = form.loanEntries.filter((_, i) => i !== index);
    this.recalculateTotals(appId);
    this.save();
  }

  updateFinalizationForm(appId: string, patch: Partial<CibFinalizationForm>): void {
    if (!this.state.finalizations[appId]) return;
    this.state.finalizations[appId] = { ...this.state.finalizations[appId], ...patch };
    this.save();
  }

  submitCibReport(appId: string): void {
    const persona = this.state.personas.find(p => p.appId === appId);
    if (!persona) return;
    persona.status = 'Submitted';
    this.save();
  }

  markFinalizationPending(appId: string): void {
    const persona = this.state.personas.find(p => p.appId === appId);
    if (!persona) return;
    persona.status = 'Finalization Pending';
    this.save();
  }

  private recalculateTotals(appId: string): void {
    const form = this.state.finalizations[appId];
    if (!form) return;
    const totalOutstanding = form.loanEntries.reduce((s, e) => s + (e.outstandingAmount || 0), 0);
    const totalOverdue = form.loanEntries.reduce((s, e) => s + (e.overdueAmount || 0), 0);
    form.totalOutstandingAmount = totalOutstanding;
    form.totalOverdueAmount = totalOverdue;
  }

  private load(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CibWorkflowState;
      if (parsed && parsed.personas) {
        this.state = parsed;
      }
    } catch {
    }
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
    }
  }

  private bootstrapDemo(): void {
    this.state.personas = [
      {
        appId: 'APP-2024-001',
        personaType: 'Applicant',
        fullName: 'Mohammed Karim Rahman',
        nid: '19921234567890',
        dob: '15-03-1992',
        mobile: '01712345678',
        status: 'Not Requested'
      },
      {
        appId: 'APP-2024-002',
        personaType: 'Applicant',
        fullName: 'Farhana Yeasmin',
        nid: '19931234567891',
        dob: '08-11-1993',
        mobile: '01812345679',
        status: 'Draft'
      },
      {
        appId: 'APP-2024-003',
        personaType: 'Co-Applicant',
        fullName: 'Tanvir Ahmed',
        nid: '19891234567892',
        dob: '27-05-1989',
        mobile: '01612345670',
        status: 'Initiated'
      },
      {
        appId: 'APP-2024-004',
        personaType: 'Guarantor',
        fullName: 'Rafiqul Islam',
        nid: '19871234567896',
        dob: '10-01-1988',
        mobile: '01912345680',
        status: 'Pending Assignment'
      },
      {
        appId: 'APP-2024-005',
        personaType: 'Applicant',
        fullName: 'Nasrin Akter',
        nid: '19951234567893',
        dob: '02-02-1995',
        mobile: '01512345671',
        status: 'Assigned'
      },
      {
        appId: 'APP-2024-006',
        personaType: 'Co-Applicant',
        fullName: 'Mehedi Hasan',
        nid: '19901234567894',
        dob: '19-09-1990',
        mobile: '01798765432',
        status: 'Data Entry In Progress'
      },
      {
        appId: 'APP-2024-007',
        personaType: 'Guarantor',
        fullName: 'Shahida Parvin',
        nid: '19851234567895',
        dob: '30-12-1985',
        mobile: '01898765433',
        status: 'Finalization Pending'
      },
      {
        appId: 'APP-2024-008',
        personaType: 'Applicant',
        fullName: 'Abdul Matin',
        nid: '19821234567896',
        dob: '05-06-1982',
        mobile: '01998765434',
        status: 'Submitted'
      }
    ];
    this.state.assignments = [];
    this.state.finalizations = {};
    this.state.currentStepIndex = 0;
  }
}
