import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../styles/layout/trade-layout.component';
import { tradeTheme } from '../../../styles/theme';

@Component({
  selector: 'app-test-work-flow-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent],
  templateUrl: './test-work-flow.page.html',
})
export class TestWorkFlowPageComponent {
  theme = tradeTheme;

  workflowUrl = '';

  safeUrl: SafeResourceUrl | null = null;

  menuItems = [
    {
      label: 'Work Flow',
      route: ['/workflow', 'work-flow'],
    },
    {
      label: 'Test Work Flow',
      route: ['/workflow', 'test-work-flow'],
    },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  openWorkflowUrl(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.workflowUrl);
  }
}
