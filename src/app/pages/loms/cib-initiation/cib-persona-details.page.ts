import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { CibPersona, CibStateService, CibStatus } from '../../../services/cib-state.service';

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
  selector: 'app-loms-cib-persona-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cib-persona-details.page.html'
})
export class LomsCibPersonaDetailsPageComponent {
  breadcrumb = 'CIB Persona Details';

  selectedPersona: CibPersona | null = null;
  personas: CibPersona[] = [];

  actionType = '';
  remarks = '';

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
    if (status === 'Initiated' || status === 'Assigned') {
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

  onBackToList(): void {
    this.router.navigate(['/loms', 'cib-initiation', 'application']);
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
  }

  isRowActive(persona: CibPersona): boolean {
    return !!this.selectedPersona && this.selectedPersona.appId === persona.appId;
  }

  private buildTimeline(): void {
    if (!this.selectedPersona) {
      this.timelineItems = [];
      return;
    }

    const status = this.selectedPersona.status;

    const items: CibTimelineItem[] = [
      {
        label: 'CIB Initiated by RM',
        description: 'CIB request created from loan application.',
        status: 'done'
      },
      {
        label: 'Sent to CIB CPU',
        description: 'Request forwarded to CPU for assignment.',
        status: status === 'Pending Assignment' || status === 'Assigned' || status === 'Data Entry In Progress' || status === 'Finalization Pending' || status === 'Submitted' ? 'done' : 'pending'
      },
      {
        label: 'Assigned to CIB Officer',
        description: 'Persona assigned to CIB data entry officer.',
        status: status === 'Assigned' || status === 'Data Entry In Progress' || status === 'Finalization Pending' || status === 'Submitted' ? 'done' : 'pending'
      },
      {
        label: 'CIB Data Entry in Progress',
        description: 'Processing CIB data from Bangladesh Bank.',
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

    const baseDate = '15-05-2024';

    if (this.selectedPersona.status === 'Draft' || this.selectedPersona.status === 'Data Entry In Progress') {
      this.corrections = [
        {
          id: 'corr-1',
          status: 'Open',
          title: 'Data mismatch in NID format',
          raisedBy: 'CIB Officer',
          date: baseDate,
          type: 'Error'
        },
        {
          id: 'corr-2',
          status: 'Resolved',
          title: 'Missing mobile number updated',
          raisedBy: 'CIB CPU',
          date: '13-05-2024',
          type: 'Info'
        }
      ];
    } else {
      this.corrections = [
        {
          id: 'corr-2',
          status: 'Resolved',
          title: 'Missing mobile number updated',
          raisedBy: 'CIB CPU',
          date: '13-05-2024',
          type: 'Info'
        }
      ];
    }
  }

  get canSubmitAction(): boolean {
    if (!this.selectedPersona) {
      return false;
    }
    if (!this.actionType) {
      return false;
    }
    return this.remarks.trim().length >= 20;
  }

  onSubmitAction(): void {
    if (!this.canSubmitAction || !this.selectedPersona) {
      return;
    }
    this.actionType = '';
    this.remarks = '';
  }

  onPrintDetails(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}

