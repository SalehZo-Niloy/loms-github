import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-ui-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <table class="min-w-full divide-y divide-blue-100 text-sm bg-white">
          <ng-content></ng-content>
        </table>
      </div>
    </div>
  `
})
export class UiTableComponent {
  theme = tradeTheme;
}
