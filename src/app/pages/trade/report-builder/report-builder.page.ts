import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { TradeLayoutComponent } from '../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-report-builder-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TradeLayoutComponent,
    UiButtonComponent,
    UiDropdownComponent,
  ],
  templateUrl: './report-builder.page.html',
})
export class ReportBuilderPageComponent {
  query = `SELECT
    lc.lc_reference,
    lc.lc_date,

    c.customer_name,
    lc.lc_type,

    lc.currency,
    lc.amount,

    b.beneficiary_name,

    s.status_name AS lc_status,

    e.employee_name AS assigned_officer

FROM lc_master lc

-- Join Customer Table
INNER JOIN customers c
    ON lc.customer_id = c.customer_id

-- Join Beneficiary Table
INNER JOIN beneficiaries b
    ON lc.beneficiary_id = b.beneficiary_id

-- Join Status Lookup Table
INNER JOIN lc_status s
    ON lc.status_id = s.status_id

-- Join Employee Table (Assigned Officer)
INNER JOIN employees e
    ON lc.assigned_to = e.employee_id

ORDER BY lc.lc_date DESC;

`;

  previewText = '';
  showExportOptions = false;
  showHtmlPreview = false;

  templateOptions = [
    {
      label: 'LC Summary (Template)',
      value: `SELECT lc.lc_reference, lc.lc_date, c.customer_name, lc.lc_type, lc.currency, lc.amount\nFROM lc_master lc\nINNER JOIN customers c ON lc.customer_id = c.customer_id\nORDER BY lc.lc_date DESC;`,
    },
    {
      label: 'LC Details (Template)',
      value: `SELECT *\nFROM lc_master lc\nWHERE lc.lc_reference = 'LC-2024-001';`,
    },
    {
      label: 'Beneficiary Report (Template)',
      value: `SELECT b.beneficiary_name, lc.lc_reference, lc.amount\nFROM beneficiaries b\nJOIN lc_master lc ON lc.beneficiary_id = b.beneficiary_id;`,
    },
  ];

  selectedTemplate = '';

  runQuery(): void {
    // Show the HTML table view when Run is clicked
    this.showHtmlPreview = true;
    this.previewText = '';
  }

  toggleHtmlPreview(): void {
    this.showHtmlPreview = !this.showHtmlPreview;
    if (this.showHtmlPreview) {
      this.previewText = '';
    }
  }

  toggleExportOptions(): void {
    this.showExportOptions = !this.showExportOptions;
  }

  applyTemplate(value: string): void {
    this.selectedTemplate = value || '';
    if (value) {
      this.query = value;
    }
  }

  formatQuery(): void {
    this.query = this.query.trim();
  }
}
