import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface DiscrepancyItem {
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface DetailRow {
  label: string;
  value: string;
}

interface TeamMember {
  label: string;
  name: string;
}

interface ActionCard {
  title: string;
  description: string;
  action: string;
}

@Component({
  selector: 'app-discrepancy-record-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent],
  templateUrl: './discrepancy-record.page.html',
})
export class DiscrepancyRecordPageComponent {
  header = {
    title: 'LC Discrepancy Recording',
    reference: 'LC-2024-001847',
    lcAmount: 'USD 250,000.00',
    status: 'Discrepancy Found',
    priority: 'High Priority',
  };

  discrepancyList: DiscrepancyItem[] = [
    {
      title: 'Missing Packing List Copy',
      description: '1 out of 3 copies missing for original set',
      severity: 'High',
    },
    {
      title: 'Invoice Date Discrepancy',
      description: 'Invoice date is outside LC validity window',
      severity: 'Medium',
    },
  ];

  summary = {
    total: 2,
    high: 1,
    medium: 1,
    low: 0,
  };

  criticalDetails: DetailRow[] = [
    { label: 'Discrepancy Type', value: 'Missing Required Packing List Copy' },
    { label: 'Document', value: 'Packing List (Original Set)' },
    { label: 'LC Term', value: '1 of 3 copies required in original set' },
    { label: 'Received', value: '2 of 3 copies received' },
  ];

  documentDetails: DetailRow[] = [
    { label: 'Document Reference', value: 'PL-2024-07891' },
    { label: 'Issue Date', value: 'Jan 12, 2024' },
    { label: 'Issuer', value: 'Shanghai Exporters Ltd.' },
    { label: 'Shipment', value: 'Shanghai to New York' },
  ];

  complianceNotes =
    'The LC requires three original packing lists. Only two originals are present. The missing copy needs to be provided before acceptance.';

  analysis = [
    {
      title: 'Examining Bank Assessment',
      description:
        'The missing copy is a documentary requirement and may affect compliance. Bank cannot proceed without all originals.',
    },
    {
      title: 'Trade Compliance Evaluation',
      description:
        'The document set is otherwise consistent with LC terms. This discrepancy can be resolved if the missing copy is provided.',
    },
    {
      title: 'Recommendation',
      description:
        'Notify customer to provide the missing document or request waiver from applicant.',
    },
  ];

  team = {
    compliance: [
      { label: 'Compliance Officer', name: 'Sarah Johnson' },
      { label: 'Trade Officer', name: 'James Mitchell' },
    ],
    review: [
      { label: 'Review Status', name: 'Pending Customer Reply' },
      { label: 'Review Date', name: 'Jan 16, 2024 10:30 AM' },
    ],
  };

  actions: ActionCard[] = [
    {
      title: 'Notify Customer',
      description: 'Send discrepancy notice to applicant/beneficiary for resolution.',
      action: 'Send Notification',
    },
    {
      title: 'Send for Confirmation',
      description: 'Send documents for confirmation with discrepancy details.',
      action: 'Send for Confirmation',
    },
  ];

  additionalActions = ['Export', 'Print Summary', 'View History', 'Edit Remarks'];

  currentStatus = {
    title: 'Status: Awaiting Customer Confirmation',
    note: 'Discrepancy notice has been prepared and is ready for transmission. Awaiting customer response.',
    steps: [
      'Discrepancy notice prepared',
      'Pending transmission to customer',
      'Customer response pending',
      'Resolution follow-up',
    ],
  };

  remarks = '';

  constructor(private router: Router) {}

  sendForConfirmation(): void {
    this.router.navigate(['/trade/import/discrepancy-record/confirmation']);
  }

  sendNotification(): void {
    this.router.navigate(['/trade/import/discrepancy-record/notification']);
  }
}
