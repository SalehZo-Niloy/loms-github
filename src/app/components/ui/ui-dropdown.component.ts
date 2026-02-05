import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tradeTheme } from '../../styles/theme';

interface UiDropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-1.5">
      <label class="text-xs font-medium text-slate-700">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-md border px-3 text-sm text-slate-700 h-10"
          [ngClass]="[theme.border.strong, theme.surface.card]"
          (click)="toggleOpen()"
          style="align-items: center;"
        >
          <span>
            {{ selectedLabel || placeholder || 'Select' }}
          </span>
          <span class="ml-2 flex h-4 w-4 items-center justify-center text-slate-400">
            <svg
              viewBox="0 0 20 20"
              class="h-3.5 w-3.5"
              [style.transform]="open ? 'rotate(180deg)' : 'rotate(0deg)'"
            >
              <path
                d="M5 7.5l5 5 5-5"
                stroke="currentColor"
                stroke-width="1.7"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
        <div
          *ngIf="open"
          class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border py-1 text-sm shadow-lg"
          [ngClass]="[theme.border.default, theme.surface.card]"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 h-10"
            *ngFor="let option of options"
            (click)="select(option)"
          >
            <span>{{ option.label }}</span>
            <span *ngIf="option.value === value" class="text-xs text-blue-600">●</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UiDropdownComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() options: UiDropdownOption[] = [];

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  open = false;

  theme = tradeTheme;

  get selectedLabel(): string {
    const match = this.options.find((o) => o.value === this.value);
    return match ? match.label : '';
  }

  toggleOpen(): void {
    this.open = !this.open;
  }

  select(option: UiDropdownOption): void {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.open = false;
  }
}
