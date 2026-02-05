import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-common-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer
      class="w-full border-t border-blue-100 py-2 text-center text-[11px] text-slate-600"
      [ngClass]="theme.surface.accent"
    >
      Copyright ©
      <a href="#" class="text-blue-700 underline">
        ERA InfoTech Limited.
      </a>
      All Rights Reserved
    </footer>
  `
})
export class CommonFooterComponent {
  theme = tradeTheme;
}
