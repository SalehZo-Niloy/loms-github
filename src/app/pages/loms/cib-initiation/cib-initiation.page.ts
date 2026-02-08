import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { CibPersona, CibStateService, CibStatus } from '../../../services/cib-state.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-loms-cib-initiation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cib-initiation.page.html'
})
export class LomsCibInitiationPageComponent {
  title = 'CIB Initiation';
  stepTitles = ['CIB Initiation', 'Officer Assignment', 'CIB Finalization'];

  searchTerm = '';
  statusFilter: 'All' | CibStatus = 'All';

  personas: (CibPersona & { selected: boolean })[] = [];

  constructor(
    private cibState: CibStateService,
    private router: Router,
    private alertService: AlertService
  ) {
    const state = this.cibState.getState();
    this.personas = state.personas.map((p) => ({ ...p, selected: false }));
  }

  get currentStepIndex(): number {
    return this.cibState.getState().currentStepIndex;
  }

  get filteredPersonas(): (CibPersona & { selected: boolean })[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.personas.filter((p) => {
      if (this.statusFilter !== 'All' && p.status !== this.statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        p.appId.toLowerCase().includes(q) ||
        p.nid.toLowerCase().includes(q) ||
        p.mobile.toLowerCase().includes(q)
      );
    });
  }

  get totalSelected(): number {
    return this.personas.filter((p) => p.selected).length;
  }

  get allVisibleSelected(): boolean {
    if (this.filteredPersonas.length === 0) {
      return false;
    }
    return this.filteredPersonas.every((p) => p.selected);
  }

  get isInitiateDisabled(): boolean {
    return this.totalSelected === 0;
  }

  get isSaveDraftDisabled(): boolean {
    return this.totalSelected === 0;
  }

  toggleSelectAll(checked: boolean): void {
    const ids = new Set(this.filteredPersonas.map((p) => p.appId));
    this.personas = this.personas.map((p) =>
      ids.has(p.appId) ? { ...p, selected: checked } : p
    );
  }

  togglePersonaSelection(persona: CibPersona & { selected: boolean }, checked: boolean): void {
    this.personas = this.personas.map((p) =>
      p.appId === persona.appId ? { ...p, selected: checked } : p
    );
  }

  getStatusBadgeClasses(status: CibStatus): string {
    if (status === 'Draft') {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    }
    if (status === 'Initiated') {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }
    if (status === 'Submitted') {
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  onSaveDraft(): void {
    const selectedIds = this.personas.filter((p) => p.selected).map((p) => p.appId);
    if (selectedIds.length === 0) {
      return;
    }
    this.cibState.markDraft(selectedIds);
    const state = this.cibState.getState();
    this.personas = state.personas.map((p) => ({
      ...p,
      selected: selectedIds.includes(p.appId)
    }));
  }

  async onInitiateRequests(): Promise<void> {
    const selectedIds = this.personas.filter((p) => p.selected).map((p) => p.appId);
    if (selectedIds.length === 0) {
      return;
    }
    this.cibState.initiateRequests(selectedIds);
    const state = this.cibState.getState();
    this.personas = state.personas.map((p) => ({
      ...p,
      selected: false
    }));
    const count = selectedIds.length;
    const message =
      count === 1
        ? 'CIB request has been initiated for 1 application.'
        : `CIB requests have been initiated for ${count} applications.`;
    await this.alertService.showSuccess(message, '#2563eb');
  }

  openPersonaDetails(persona: CibPersona): void {
    this.router.navigate(['/loms', 'cib-initiation', 'persona', persona.appId]);
  }
}
