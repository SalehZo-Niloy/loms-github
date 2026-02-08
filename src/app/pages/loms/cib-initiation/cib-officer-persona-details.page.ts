import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { CibAssignment, CibPersona, CibStateService, CibStatus } from '../../../services/cib-state.service';

interface CibTimelineItem {
  label: string;
  description: string;
  status: 'done' | 'active' | 'pending';
}

interface CibCorrectionItem {
  id: string;
  status: 'Open' | 'Resolved';
  title: string;
  raisedBy: string;
  date: string;
  type: 'Error' | 'Info';
}

@Component({
  selector: 'app-loms-cib-officer-persona-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cib-officer-persona-details.page.html'
})
export class LomsCibOfficerPersonaDetailsPageComponent {
  breadcrumb = 'CIB Persona Details – Officer Assignment';

  selectedPersona: CibPersona | null = null;
  personas: CibPersona[] = [];

  officers: string[] = ['Farhan Ahmed', 'Kamal Hossain', 'Shahina Begum', 'Nusrat Jahan'];
  priorityLevels: Array<CibAssignment['priority']> = ['Low', 'Normal', 'High'];

  assignOfficer = '';
  priority: CibAssignment['priority'] = 'Normal';
  expectedCompletionDate = '';
  assignmentRemarks = '';

  timelineItems: CibTimelineItem[] = [];
  corrections: CibCorrectionItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cibState: CibStateService
  ) {
    const state = this.cibState.getState();
    this.personas = state.personas;

    const appId = this.route.snapshot.paramMap.get('appId');
    if (appId) {
      this.setSelectedPersonaById(appId);
    } else if (this.personas.length > 0) {
      this.setSelectedPersona(this.personas[0]);
    }
  }

  get hasSelection(): boolean {
    return !!this.selectedPersona;
  }

  get currentStatusBadgeClasses(): string {
    if (!this.selectedPersona) {
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
    return this.getStatusBadgeClasses(this.selectedPersona.status);
  }

  getStatusBadgeClasses(status: CibStatus): string {
    if (status === 'Draft') {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    }
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
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
    if (status === 'Finalization Pending') {
      return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    }
    if (status === 'Submitted') {
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  onBackToAssignmentQueue(): void {
    this.router.navigate(['/loms', 'cib-initiation', 'officer-assignment']);
  }

  onViewSubmittedCibData(): void {
    if (!this.selectedPersona) {
      return;
    }
    this.router.navigate(['/loms', 'cib-initiation', 'persona', this.selectedPersona.appId]);
  }

  setSelectedPersonaById(appId: string): void {
    const persona = this.personas.find((p) => p.appId === appId) || null;
    if (!persona && this.personas.length > 0) {
      this.setSelectedPersona(this.personas[0]);
      return;
    }
    if (persona) {
      this.setSelectedPersona(persona);
    }
  }

  setSelectedPersona(persona: CibPersona): void {
    this.selectedPersona = persona;
    this.buildTimeline();
    this.buildCorrections();
    this.loadAssignment();
  }

  isRowActive(persona: CibPersona): boolean {
    return !!this.selectedPersona && this.selectedPersona.appId === persona.appId;
  }

  private loadAssignment(): void {
    if (!this.selectedPersona) {
      this.assignOfficer = '';
      this.priority = 'Normal';
      this.expectedCompletionDate = '';
      this.assignmentRemarks = '';
      return;
    }
    const assignment = this.cibState.getAssignment(this.selectedPersona.appId);
    if (!assignment) {
      this.assignOfficer = '';
      this.priority = 'Normal';
      this.expectedCompletionDate = '';
      this.assignmentRemarks = '';
      return;
    }
    this.assignOfficer = assignment.assignedOfficer || '';
    this.priority = assignment.priority;
    this.expectedCompletionDate = assignment.expectedCompletionDate || '';
    this.assignmentRemarks = assignment.remarks;
  }

  private buildTimeline(): void {
    if (!this.selectedPersona) {
      this.timelineItems = [];
      return;
    }

    const status = this.selectedPersona.status;

    const items: CibTimelineItem[] = [
      {
        label: 'Initiated by RM',
        description: 'CIB request created for applicant.',
        status: 'done'
      },
      {
        label: 'Sent to RR CPU',
        description: 'CIB request received at CPU for assignment.',
        status: status === 'Pending Assignment' || status === 'Assigned' || status === 'Data Entry In Progress' || status === 'Finalization Pending' || status === 'Submitted' ? 'done' : 'pending'
      },
      {
        label: 'Assigned to Officer',
        description: 'CIB request assigned to officer.',
        status: status === 'Assigned' || status === 'Data Entry In Progress' || status === 'Finalization Pending' || status === 'Submitted' ? 'done' : 'pending'
      },
      {
        label: 'Data Entry In Progress',
        description: 'CIB data entry started by officer.',
        status: status === 'Data Entry In Progress' ? 'active' : status === 'Finalization Pending' || status === 'Submitted' ? 'done' : 'pending'
      },
      {
        label: 'Finalization Pending',
        description: 'Awaiting review and final submission.',
        status: status === 'Finalization Pending' ? 'active' : status === 'Submitted' ? 'done' : 'pending'
      },
      {
        label: 'CIB Report Submitted',
        description: 'CIB report submitted to loan workflow.',
        status: status === 'Submitted' ? 'done' : 'pending'
      }
    ];

    this.timelineItems = items;
  }

  private buildCorrections(): void {
    if (!this.selectedPersona) {
      this.corrections = [];
      return;
    }

    this.corrections = [];
  }

  get canAssign(): boolean {
    if (!this.selectedPersona) {
      return false;
    }
    if (!this.assignOfficer) {
      return false;
    }
    if (!this.priority) {
      return false;
    }
    if (!this.expectedCompletionDate) {
      return false;
    }
    return true;
  }

  onAssignOfficer(): void {
    if (!this.canAssign || !this.selectedPersona) {
      return;
    }
    this.cibState.assignOfficer(
      [this.selectedPersona.appId],
      this.assignOfficer,
      this.priority,
      this.expectedCompletionDate,
      this.assignmentRemarks
    );
    const state = this.cibState.getState();
    const updated = state.personas.find((p) => p.appId === this.selectedPersona!.appId);
    if (updated) {
      this.selectedPersona = updated;
    }
    this.buildTimeline();
    this.loadAssignment();
  }

  onUpdateAssignment(): void {
    this.onAssignOfficer();
  }

  onPrintDetails(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}

