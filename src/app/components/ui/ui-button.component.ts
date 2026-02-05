import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled"
      class="inline-flex items-center justify-center rounded-md border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      [ngClass]="classes"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class UiButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;

  theme = tradeTheme;

  get classes(): string[] {
    const base = ['px-4', 'py-2'];

    if (this.fullWidth) {
      base.push('w-full');
    }

    if (this.variant === 'primary') {
      base.push('border-transparent', ...this.theme.button.primary.split(' '));
    } else if (this.variant === 'secondary') {
      base.push(...this.theme.button.secondary.split(' '));
    } else {
      base.push('border-transparent', ...this.theme.button.ghost.split(' '));
    }

    return base;
  }
}
