import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

interface ChargeItem {
  title: string;
  subtitle: string;
  calculation: string;
  rateLabel: string;
  amount: string;
  accentClass: string;
  iconBg: string;
  iconText: string;
}

interface InfoCard {
  label: string;
  value: string;
  accent?: string;
}

interface ProcessStep {
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

@Component({
  selector: 'app-lc-charge-collection-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './lc-charge-collection.page.html',
})
export class LcChargeCollectionPageComponent implements OnInit {
  lcReferenceControl = new FormControl<string | null>(null);

  lcOptions: string[] = [
    'LC-2024-00847',
    'LC-2024-01001',
    'LC-2024-01025',
    'LC-2025-00003',
    'LC-REF-TEST',
  ];
  header = {
    title: 'LC Charges Collection',
    reference: 'LC-2024-00847',
    status: 'Awaiting Charges',
    marginStatus: 'Completed',
  };

  user = {
    name: 'James Mitchell',
    role: 'Trade Officer',
    initials: 'JM',
  };

  customerInfo: InfoCard[] = [
    { label: 'Applicant', value: 'GlobalTech Industries Ltd' },
    { label: 'LC Amount', value: 'USD 2,450,000.00', accent: 'text-blue-700' },
    { label: 'Margin Blocked', value: 'USD 490,000.00', accent: 'text-emerald-700' },
    { label: 'Customer ID', value: 'CUST-2024-5478' },
    { label: 'LC Type', value: 'Irrevocable' },
    { label: 'Expiry Date', value: 'March 15, 2025' },
  ];

  charges: ChargeItem[] = [
    {
      title: 'LC Opening Commission',
      subtitle: 'Quarterly basis charge',
      calculation: 'Calculation: USD 2,450,000.00 × 0.25% | Period: Jan 15 - Apr 15, 2025',
      rateLabel: 'Rate: 0.25% per quarter',
      amount: 'USD 6,125.00',
      accentClass: 'border-blue-200 bg-blue-50',
      iconBg: 'bg-blue-600',
      iconText: 'text-white',
    },
    {
      title: 'SWIFT Transmission Fee',
      subtitle: 'MT700 message issuance',
      calculation: 'Standard SWIFT messaging charge | To: Shanghai Bank, China',
      rateLabel: 'Fixed charge',
      amount: 'USD 50.00',
      accentClass: 'border-purple-200 bg-purple-50',
      iconBg: 'bg-purple-600',
      iconText: 'text-white',
    },
    {
      title: 'Amendment Fee',
      subtitle: 'Processing & documentation',
      calculation: 'Amendment processing and notification',
      rateLabel: 'Standard charge',
      amount: 'USD 150.00',
      accentClass: 'border-slate-200 bg-white',
      iconBg: 'bg-slate-700',
      iconText: 'text-white',
    },
    {
      title: 'Handling & Processing',
      subtitle: 'Administrative charge',
      calculation: 'Documentation and operational processing',
      rateLabel: 'Administrative',
      amount: 'USD 100.00',
      accentClass: 'border-amber-200 bg-amber-50',
      iconBg: 'bg-amber-600',
      iconText: 'text-white',
    },
  ];

  totals = {
    subtotal: 'USD 6,425.00',
    vat: 'USD 963.75',
    total: 'USD 7,388.75',
  };

  summary = {
    reference: 'LC-2024-00847',
    customer: 'GlobalTech Industries Ltd',
    charges: [
      { label: 'Opening Commission', value: '$6,125.00' },
      { label: 'SWIFT Fee', value: '$50.00' },
      { label: 'Amendment Fee', value: '$150.00' },
      { label: 'Handling Fee', value: '$100.00' },
      { label: 'VAT (15%)', value: '$963.75' },
    ],
    total: 'USD 7,388.75',
    debitAccount: '4521-8890-3321',
    debitType: 'USD Current Account',
  };

  steps: ProcessStep[] = [
    { title: 'LC Opened', date: 'Jan 15, 2025', status: 'completed' },
    { title: 'Margin Blocked', date: 'Completed', status: 'completed' },
    { title: 'Collect Charges', date: 'In Progress', status: 'in-progress' },
    { title: 'Issue MT700', date: 'Pending', status: 'pending' },
  ];

  debitAccounts = [
    {
      label: '4521-8890-3321 - USD Current Account (Bal: $3,360,000.00)',
      accountNumber: '4521-8890-3321',
      accountType: 'USD Current Account',
      balance: '$3,360,000.00',
      amountToDebit: 'USD 7,388.75',
      balanceAfter: 'USD 3,352,611.25',
    },
    {
      label: '9856-1200-5531 - USD Savings Account (Bal: $1,120,000.00)',
      accountNumber: '9856-1200-5531',
      accountType: 'USD Savings Account',
      balance: '$1,120,000.00',
      amountToDebit: 'USD 7,388.75',
      balanceAfter: 'USD 1,112,611.25',
    },
  ];

  selectedAccount = this.debitAccounts[0];

  constructor(private importLcStateService: ImportLcStateService) {
  }

  ngOnInit(): void {
    const state = this.importLcStateService.getState();
    const initialRef = state.lcReference || this.header.reference || this.lcOptions[0] || null;

    if (initialRef) {
      this.header = {
        ...this.header,
        reference: initialRef,
      };
      this.summary = {
        ...this.summary,
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
        this.summary = {
          ...this.summary,
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
        this.summary = {
          ...this.summary,
          reference: state.lcReference,
        };
        if (this.lcReferenceControl.value !== state.lcReference) {
          this.lcReferenceControl.setValue(state.lcReference, { emitEvent: false });
        }
      }
    });
  }

  get summaryTotal(): string {
    return this.totals.total;
  }

  stepClasses(status: ProcessStep['status']): string[] {
    if (status === 'completed') {
      return ['bg-emerald-100', 'text-emerald-700'];
    }
    if (status === 'in-progress') {
      return ['bg-blue-100', 'text-blue-700'];
    }
    return ['bg-slate-100', 'text-slate-500'];
  }

  stepDot(status: ProcessStep['status']): string[] {
    if (status === 'completed') {
      return ['bg-emerald-600', 'text-white'];
    }
    if (status === 'in-progress') {
      return ['bg-blue-600', 'text-white'];
    }
    return ['bg-slate-300', 'text-slate-600'];
  }

  onCollectCharges() {
    // use emerald color matching the button (emerald-600)
    this.showAlert('Charges Collected', 'Successfully collected charges', '#16a34a');
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
