import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface LcDetail {
  label: string;
  value: string;
}

interface SettlementOption {
  title: string;
  subtitle: string;
  tags: string[];
  bullets: string[];
  highlight: 'green' | 'blue';
  amounts: { label: string; value: string }[];
  action: string;
}

@Component({
  selector: 'app-lc-settlement-decision-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './lc-settlement-decision.page.html',
})
export class LcSettlementDecisionPageComponent {
  header = {
    title: 'LC Settlement Decision',
    lcNumber: '#LC-2024-TF-0923',
    status: 'Documents Verified',
  };

  details: LcDetail[] = [
    { label: 'LC Amount', value: '$485,750.00' },
    { label: 'Applicant', value: 'Global Trading Corp' },
    { label: 'Beneficiary', value: 'Export Solutions Ltd' },
    { label: 'Expiry Date', value: 'March 15, 2024' },
  ];

  options: SettlementOption[] = [
    {
      title: 'Sight Payment',
      subtitle: 'Immediate payment upon presentation of complying documents',
      tags: ['Instant', 'Direct Settlement'],
      bullets: [
        'Immediate payment authorization',
        'Direct fund transfer to beneficiary',
        'Real-time settlement confirmation',
        'Processing time: Within 2 hours',
      ],
      highlight: 'green',
      amounts: [
        { label: 'Settlement Amount', value: '$485,750.00' },
        { label: 'Processing Fee', value: '$125.00' },
      ],
      action: 'Process Sight Payment',
    },
    {
      title: 'Usance (Acceptance / PAD)',
      subtitle: 'Deferred payment with acceptance or payment at due date',
      tags: ['Deferred', 'PAD Creation'],
      bullets: [
        'Payment at Due (PAD) creation',
        'Acceptance draft generation',
        'Maturity date scheduling',
        'Processing time: 1-2 business days',
      ],
      highlight: 'blue',
      amounts: [
        { label: 'PAD Amount', value: '$485,750.00' },
        { label: 'Tenor', value: '90 Days' },
        { label: 'Maturity Date', value: 'April 15, 2024' },
      ],
      action: 'Create PAD & Acceptance',
    },
  ];

  guidelines = {
    title: 'Settlement Guidelines',
    note: 'Please review the LC terms carefully before selecting the settlement method. The choice will determine the payment workflow and timing.',
    sight: [
      'Documents are complying',
      'No discrepancies identified',
      'LC allows sight payment',
      'Immediate settlement required',
    ],
    usance: [
      'LC specifies deferred payment',
      'Acceptance required',
      'Tenor period defined',
      'PAD creation needed',
    ],
  };

  constructor(private router: Router) {}

  onOptionClick(option: SettlementOption) {
    if (option.highlight === 'green') {
      this.router.navigate(['/trade/import/execute-payment']);
    } else if (option.highlight === 'blue') {
      this.router.navigate(['/trade/import/pad-creation']);
    }
  }
}
