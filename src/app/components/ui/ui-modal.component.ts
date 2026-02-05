import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40"
    >
      <div
        class="relative w-full rounded-md bg-white shadow-lg"
        [ngClass]="sizeClass"
      >
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-sm font-semibold text-slate-900">
            {{ title }}
          </h2>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            (click)="close.emit()"
          >
            ✕
          </button>
        </div>
        <div class="px-6 py-4 text-xs text-slate-700">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class UiModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'md' | 'lg' = 'lg';
  @Output() close = new EventEmitter<void>();

  get sizeClass(): string {
    return this.size === 'lg' ? 'max-w-4xl' : 'max-w-xl';
  }
}

