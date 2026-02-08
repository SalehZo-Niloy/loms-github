import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { CibPersona, CibStateService, CibStatus } from '../../../services/cib-state.service';

interface OfficerAssignmentRow extends CibPersona {
  requestDate: string;
  rmName: string;
  branch: string;
  product: string;
  selected: boolean;
}

@Component({
  selector: 'app-loms-cib-officer-assignment-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cib-officer-assignment.page.html'
})
export class LomsCibOfficerAssignmentPageComponent {
  title = 'Officer Assignment';

  stepTitles = ['CIB Initiation', 'Officer Assignment', 'CIB Finalization'];

  filterType: 'No Filter' | 'Persona Type' = 'No Filter';
  filterAttribute = '';

  officerOptions: string[] = ['Farhan Ahmed', 'Kamal Hossain', 'Shahina Begum', 'Nusrat Jahan'];
  assignToOfficer = '';

  rows: OfficerAssignmentRow[] = [];

  constructor(private cibState: CibStateService, private router: Router) {
    const state = this.cibState.getState();
    const baseRows: OfficerAssignmentRow[] = state.personas.map(p => ({
      ...p,
      requestDate: '15-05-2024',
      rmName: p.personaType === 'Applicant' ? 'Farhan Ahmed' : p.personaType === 'Co-Applicant' ? 'Shahina Begum' : 'Nusrat Jahan',
      branch: p.personaType === 'Applicant' ? 'Gulshan' : p.personaType === 'Co-Applicant' ? 'Uttara' : 'Dhanmondi',
      product: 'Personal Loan',
      selected: false
    }));

    this.rows = baseRows.filter(r =>
      r.status === 'Initiated' ||
      r.status === 'Pending Assignment' ||
      r.status === 'Assigned' ||
      r.status === 'Data Entry In Progress' ||
      r.status === 'Finalization Pending'
    );
  }

  get currentStepIndex(): number {
    return 1;
  }

  get totalPending(): number {
    return this.rows.length;
  }

  get filterablePersonaTypes(): string[] {
    const types = new Set(this.rows.map(r => r.personaType));
    return Array.from(types);
  }

  get filteredRows(): OfficerAssignmentRow[] {
    if (this.filterType === 'No Filter' || !this.filterAttribute) {
      return this.rows;
    }
    if (this.filterType === 'Persona Type') {
      return this.rows.filter(r => r.personaType === this.filterAttribute);
    }
    return this.rows;
  }

  get anySelected(): boolean {
    return this.rows.some(r => r.selected);
  }

  get allVisibleSelected(): boolean {
    if (this.filteredRows.length === 0) {
      return false;
    }
    return this.filteredRows.every(r => r.selected);
  }

  get isSaveDisabled(): boolean {
    if (!this.assignToOfficer) {
      return true;
    }
    if (!this.anySelected) {
      return true;
    }
    return false;
  }

  toggleSelectAll(checked: boolean): void {
    const visibleIds = new Set(this.filteredRows.map(r => r.appId));
    this.rows = this.rows.map(r =>
      visibleIds.has(r.appId) ? { ...r, selected: checked } : r
    );
  }

  toggleRowSelection(row: OfficerAssignmentRow, checked: boolean): void {
    this.rows = this.rows.map(r =>
      r.appId === row.appId ? { ...r, selected: checked } : r
    );
  }

  getStatusBadgeClasses(status: CibStatus): string {
    if (status === 'Initiated') {
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
    if (status === 'Pending Assignment') {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    }
    if (status === 'Assigned') {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }
    if (status === 'Data Entry In Progress') {
      return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    }
    if (status === 'Finalization Pending') {
      return 'bg-purple-50 text-purple-700 border border-purple-100';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  onSaveAssignments(): void {
    if (this.isSaveDisabled) {
      return;
    }
    const selectedIds = this.rows.filter(r => r.selected).map(r => r.appId);
    if (selectedIds.length === 0) {
      return;
    }
    this.cibState.assignOfficer(
      selectedIds,
      this.assignToOfficer,
      'Normal',
      '',
      'Assigned from Officer Assignment screen'
    );
    const state = this.cibState.getState();
    const updatedStatuses = new Map(state.personas.map(p => [p.appId, p.status]));
    this.rows = this.rows.map(r => ({
      ...r,
      status: updatedStatuses.get(r.appId) || r.status,
      selected: false
    })).filter(r => r.status === 'Initiated' || r.status === 'Pending Assignment');
  }

  openPersonaDetails(row: OfficerAssignmentRow): void {
    this.router.navigate(['/loms', 'cib-initiation', 'officer-assignment', 'persona', row.appId]);
  }
}
