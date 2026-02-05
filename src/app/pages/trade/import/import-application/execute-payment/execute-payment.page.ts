import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { Router } from '@angular/router';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface StatusItem {
  title: string;
  note: string;
  status: 'done' | 'pending';
}

interface ActivityItem {
  label: string;
  time: string;
  tone: 'green' | 'blue' | 'amber';
}

@Component({
  selector: 'app-execute-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './execute-payment.page.html',
})
export class ExecutePaymentPageComponent {
  header = {
    title: 'Execute Payment to Negotiating Bank',
    subtitle: 'Process payment for compliant document presentation under LC terms',
    session: 'TF-2024-0115-001',
  };

  reference = {
    lcNumber: 'LC240115001',
    documentSet: 'DS-LC240115001-001',
    negotiatingBank: 'Standard Chartered Bank, Singapore',
    presentationDate: '2024-01-15',
  };

  amounts = {
    lcAmount: 'USD 2,500,000.00',
    discrepancy: 'USD 150.00',
    netAmount: 'USD 2,499,850.00',
  };

  nostro = {
    account: 'USD Nostro - Chase Bank NY (00123456)',
    balance: 'USD 45,750,000.00',
    swift: 'SCBLSGSG',
    beneficiaryAccount: 'SG1234567890123456',
  };

  nostroAccounts = ['USD Nostro - Chase Bank NY (00123456)', 'USD Nostro - HSBC HK (00993455)'];

  status: StatusItem[] = [
    { title: 'Document Verification', note: 'Completed - No discrepancies', status: 'done' },
    { title: 'LC Terms Compliance', note: 'Verified and approved', status: 'done' },
    { title: 'Payment Execution', note: 'Pending authorization', status: 'pending' },
    { title: 'Accounting Posted', note: 'Awaiting payment completion', status: 'pending' },
  ];

  transaction = {
    reference: 'TXN-240115-001',
    valueDate: '2024-01-15',
    processingTime: '~15 minutes',
    totalAmount: 'USD 2,499,850.00',
  };

  activity: ActivityItem[] = [
    { label: 'Documents received and verified', time: '2 minutes ago', tone: 'green' },
    { label: 'LC compliance check completed', time: '5 minutes ago', tone: 'blue' },
    { label: 'Payment authorization requested', time: '8 minutes ago', tone: 'amber' },
  ];

  constructor(private router: Router) {}

  onExecutePayment() {
    const net = this.amounts.netAmount;
    const beneficiary = this.nostro.beneficiaryAccount || this.nostro.account;
    const ref = this.transaction.reference;
    const msg = `Executing ${net} to ${beneficiary}. Transaction ref: ${ref}`;
    this.showAlert('Payment Executed', msg, '#2563eb');
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
      width: '380px',
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
    Object.assign(content.style, { padding: '18px' });

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
    btn.onclick = () => {
      overlay.remove();
      this.router.navigate(['/trade/import/lc-closure'], { state: { showClosureSection: true } });
    };

    content.appendChild(h);
    content.appendChild(p);
    content.appendChild(btn);

    box.appendChild(accent);
    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
}
