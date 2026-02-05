import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-1.5">
      <label class="text-xs font-medium text-slate-700">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <ng-container *ngIf="type === 'textarea'; else inputField">
        <textarea
          [attr.rows]="rows"
          class="block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          [ngClass]="[theme.input.background.default, theme.border.default]"
          [attr.placeholder]="placeholder"
          [attr.readonly]="readOnly ? '' : null"
          [value]="value"
          (input)="onInput($event)"
        ></textarea>
      </ng-container>
      <ng-template #inputField>
        <input
          [attr.type]="type"
          class="block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          [ngClass]="[theme.input.background.default, theme.border.default]"
          [attr.placeholder]="placeholder"
          [attr.readonly]="readOnly ? '' : null"
          [value]="value"
          (input)="onInput($event)"
        />
      </ng-template>
    </div>
  `
})
export class UiInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() rows = 3;
  @Input() required = false;
  @Input('readonly') readOnly = false;

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  theme = tradeTheme;

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }
}
