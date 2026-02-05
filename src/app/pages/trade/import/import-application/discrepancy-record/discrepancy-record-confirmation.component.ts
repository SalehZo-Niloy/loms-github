import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface DiscrepancyItem {
  title: string;
  description: string;
  severity: 'Critical' | 'Medium' | 'Low';
  field: string;
  detectedOn: string;
}

interface DecisionCard {
  title: string;
  description: string;
  bullets: string[];
  actionLabel: string;
  accent: 'green' | 'red';
}

@Component({
  selector: 'app-discrepancy-record-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent],
  templateUrl: './discrepancy-record-confirmation.component.html',
})
export class DiscrepancyRecordConfirmationComponent {
  header = {
    title: 'Discrepancy Review',
    documentId: 'INV-2024-0847',
    status: 'Pending Review',
  };

  alert = {
    title: 'Discrepancies Detected',
    message:
      "We've identified 3 discrepancies in the submitted documentation. Please review and confirm your decision below.",
  };

  discrepancies: DiscrepancyItem[] = [
    {
      title: 'Invoice Amount Mismatch',
      description:
        'The total amount on the invoice ($15,420.00) does not match the purchase order amount ($14,850.00). Difference: $570.00',
      severity: 'Critical',
      field: 'Total Amount',
      detectedOn: 'Jan 14, 2024',
    },
    {
      title: 'Missing Signature',
      description:
        'The authorization signature is missing from page 3 of the contract document. This signature is required for processing.',
      severity: 'Medium',
      field: 'Authorized Signature',
      detectedOn: 'Jan 14, 2024',
    },
    {
      title: 'Date Format Inconsistency',
      description:
        'The delivery date is formatted as DD/MM/YYYY (15/01/2024) while our system expects MM/DD/YYYY format.',
      severity: 'Low',
      field: 'Delivery Date',
      detectedOn: 'Jan 14, 2024',
    },
  ];

  decisions: DecisionCard[] = [
    {
      title: 'Accept Discrepancies',
      description: 'Acknowledge and proceed with the current documentation.',
      bullets: [
        'Discrepancies are logged for record',
        'Proceed directly to payment processing',
        'Transaction completed within 24 hours',
      ],
      actionLabel: 'Accept & Proceed to Payment',
      accent: 'green',
    },
    {
      title: 'Reject Discrepancies',
      description: 'Request correction or return documentation.',
      bullets: [
        'Case escalated to review team',
        'Documents returned for correction',
        'Payment processing on hold',
      ],
      actionLabel: 'Reject & Escalate',
      accent: 'red',
    },
  ];

  decision = 'accept';

  constructor(private router: Router) {}

  onRejectEscalate() {
    this.router.navigate(['/trade/import/discrepancy-record/reject']);
  }

  onAcceptProceed() {
    this.router.navigate(['/trade/import/lc-settlement-decision']);
  }
}
