import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

interface SummaryRow {
  label: string;
  value: string;
}

interface ProcessStep {
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface AccountOption {
  label: string;
  accountNumber: string;
  accountType: string;
  balance: string;
}

@Component({
  selector: 'app-lc-margin-collection-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TradeLayoutComponent,
    UiButtonComponent,
  ],
  templateUrl: './lc-margin-collection.page.html',
})
export class LcMarginCollectionPageComponent implements OnInit {
  lcReferenceControl = new FormControl<string | null>(null);
  lcOptions: string[] = [
    'LC-2024-00847',
    'LC-2024-01001',
    'LC-2024-01025',
    'LC-2025-00003',
    'LC-REF-TEST',
  ];
  header = {
    title: 'LC Margin Collection & Blocking',
    reference: 'LC-2024-00847',
    status: 'Awaiting Margin',
    openedOn: 'Jan 15, 2025',
  };

  user = {
    name: 'James Mitchell',
    role: 'Trade Officer',
    initials: 'JM',
  };

  lcSummary: SummaryRow[] = [
    { label: 'Applicant', value: 'GlobalTech Industries Ltd' },
    { label: 'LC Amount', value: 'USD 2,450,000.00' },
    { label: 'Beneficiary', value: 'Shanghai Electronics Co., Ltd' },
    { label: 'Expiry Date', value: 'March 15, 2025' },
    { label: 'LC Type', value: 'Irrevocable' },
    { label: 'Latest Shipment', value: 'February 28, 2025' },
  ];

  margin = {
    lcAmount: '2,450,000.00',
    percentage: 20,
    amount: 490000,
  };

  marginSummary = {
    reference: 'LC-2024-00847',
    totalAmount: 'USD 2,450,000.00',
    marginRequired: 'USD 490,000.00',
    debitAccount: '4521-8890-3321',
    availableBalance: '$3,850,000.00',
    afterBlocking: '$3,360,000.00',
    period: 'Until March 15, 2025',
  };

  accountOptions: AccountOption[] = [
    {
      label: '4521-8890-3321 - USD Current Account (Bal: $3,850,000.00)',
      accountNumber: '4521-8890-3321',
      accountType: 'USD Current Account',
      balance: '$3,850,000.00',
    },
    {
      label: '3251-5580-1122 - USD Savings Account (Bal: $1,200,000.00)',
      accountNumber: '3251-5580-1122',
      accountType: 'USD Savings Account',
      balance: '$1,200,000.00',
    },
  ];

  selectedAccount = this.accountOptions[0];

  constructor(private importLcStateService: ImportLcStateService) {}

  ngOnInit(): void {
    const state = this.importLcStateService.getState();
    const initialRef = state.lcReference || this.header.reference || null;

    if (initialRef) {
      this.header = {
        ...this.header,
        reference: initialRef,
      };
      this.marginSummary = {
        ...this.marginSummary,
        reference: initialRef,
      };
      this.lcReferenceControl.setValue(initialRef, { emitEvent: false });
    }

    this.lcReferenceControl.valueChanges.subscribe((reference) => {
      if (reference) {
        this.header = {
          ...this.header,
          reference,
        };
        this.marginSummary = {
          ...this.marginSummary,
          reference,
        };
        this.importLcStateService.updateState({ lcReference: reference });
      }
    });

    this.importLcStateService.state$.subscribe((state) => {
      if (state.lcReference) {
        this.header = {
          ...this.header,
          reference: state.lcReference,
        };
        this.marginSummary = {
          ...this.marginSummary,
          reference: state.lcReference,
        };
        if (this.lcReferenceControl.value !== state.lcReference) {
          this.lcReferenceControl.setValue(state.lcReference, { emitEvent: false });
        }
      }
    });

    this.recalculateMargin();
  }

  recalculateMargin() {
    const baseAmount = this.parseAmount(this.margin.lcAmount);
    const percentageNumber = Number(this.margin.percentage) || 0;

    if (!Number.isFinite(baseAmount) || baseAmount <= 0 || percentageNumber < 0) {
      this.margin.amount = 0;
      this.margin.percentage = 0;
      this.marginSummary = {
        ...this.marginSummary,
        marginRequired: `USD ${this.formatAmount(0)}`,
      };
      return;
    }

    const calculatedAmount = (baseAmount * percentageNumber) / 100;
    this.margin.amount = Number(calculatedAmount.toFixed(2));
    this.marginSummary = {
      ...this.marginSummary,
      marginRequired: `USD ${this.formatAmount(this.margin.amount)}`,
    };
  }

  onPercentageChange(value: string | number) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      this.margin.percentage = 0;
    } else if (numeric > 100) {
      this.margin.percentage = 100;
    } else {
      this.margin.percentage = Number(numeric.toFixed(2));
    }
    this.recalculateMargin();
  }

  onAmountChange(value: string | number) {
    const baseAmount = this.parseAmount(this.margin.lcAmount);
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      this.margin.amount = 0;
      this.margin.percentage = 0;
      this.marginSummary = {
        ...this.marginSummary,
        marginRequired: `USD ${this.formatAmount(0)}`,
      };
      return;
    }

    let enteredAmount = typeof value === 'number' ? value : this.parseAmount(String(value));
    if (!Number.isFinite(enteredAmount) || enteredAmount < 0) enteredAmount = 0;
    if (enteredAmount > baseAmount) enteredAmount = baseAmount;

    this.margin.amount = Number(enteredAmount.toFixed(2));

    const percentage = baseAmount === 0 ? 0 : (enteredAmount / baseAmount) * 100;
    this.margin.percentage = Number(percentage.toFixed(2));

    this.marginSummary = {
      ...this.marginSummary,
      marginRequired: `USD ${this.formatAmount(this.margin.amount)}`,
    };
  }

  private parseAmount(value: string | number): number {
    if (typeof value === 'number') return value;
    const normalized = String(value).replace(/,/g, '');
    const numeric = Number(normalized);
    if (Number.isNaN(numeric)) return 0;
    return numeric;
  }

  private formatAmount(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  steps: ProcessStep[] = [
    { title: 'LC Opened', date: 'Jan 15, 2025', status: 'completed' },
    { title: 'Block Margin', date: 'In Progress', status: 'in-progress' },
    { title: 'Collect Charges', date: 'Pending', status: 'pending' },
    { title: 'Issue MT700', date: 'Pending', status: 'pending' },
  ];

  stepClasses(status: ProcessStep['status']): string[] {
    if (status === 'completed') {
      return ['bg-emerald-100', 'text-emerald-700'];
    }
    if (status === 'in-progress') {
      return ['bg-purple-100', 'text-purple-700'];
    }
    return ['bg-slate-100', 'text-slate-500'];
  }

  stepDot(status: ProcessStep['status']): string[] {
    if (status === 'completed') {
      return ['bg-emerald-600', 'text-white'];
    }
    if (status === 'in-progress') {
      return ['bg-purple-600', 'text-white'];
    }
    return ['bg-slate-300', 'text-slate-600'];
  }

  onBlockMargin() {
    // show a purple-accent modal matching the button
    this.showAlert(
      'Margin Blocked',
      `USD ${this.formatAmount(this.margin.amount)} has been blocked from ${this.selectedAccount.accountNumber}`,
      '#7c3aed',
    );
  }

  private showAlert(title: string, text: string, accentColor: string) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000',
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      background: 'white',
      padding: '0',
      borderRadius: '12px',
      width: '360px',
      boxShadow: '0 18px 60px rgba(2,6,23,0.25)',
      textAlign: 'center',
      color: '#0f172a',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    });

    const accent = document.createElement('div');
    Object.assign(accent.style, {
      height: '8px',
      background: accentColor,
      width: '100%',
    });

    const content = document.createElement('div');
    Object.assign(content.style, {
      padding: '18px',
    });

    const h = document.createElement('div');
    h.textContent = title;
    Object.assign(h.style, {
      fontSize: '17px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#0f172a',
    });

    const p = document.createElement('div');
    p.textContent = text;
    Object.assign(p.style, { fontSize: '13px', color: '#475569', marginBottom: '16px' });

    const btn = document.createElement('button');
    btn.textContent = 'OK';
    Object.assign(btn.style, {
      background: accentColor,
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '700',
    });
    btn.onclick = () => overlay.remove();

    content.appendChild(h);
    content.appendChild(p);
    content.appendChild(btn);

    box.appendChild(accent);
    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
}
