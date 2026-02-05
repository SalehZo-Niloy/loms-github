import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface LcInfoItem {
  label: string;
  value: string;
}

interface SummaryBlock {
  label: string;
  value: string;
}

@Component({
  selector: 'app-pad-creation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './pad-creation.page.html',
})
export class PadCreationPageComponent {
  header = {
    title: 'Create Payment at Due (PAD)',
    lcNumber: '#LC-2024-TF-0923',
    badge: 'Usance Settlement',
  };

  steps = [
    { label: 'LC Verified', status: 'completed' },
    { label: 'Route Selected', status: 'completed' },
    { label: 'PAD Creation', status: 'current' },
    { label: 'Completion', status: 'pending' },
  ];

  lcInfo: LcInfoItem[] = [
    { label: 'LC Number', value: '#LC-2024-TF-0923' },
    { label: 'Original Amount', value: '$485,750.00' },
    { label: 'Beneficiary', value: 'Export Solutions Ltd' },
    { label: 'LC Expiry', value: 'March 15, 2024' },
  ];

  padDetails = {
    reference: 'PAD-2024-0923-001',
    amount: '485,750.00',
    tenor: 90,
    tenorUnit: 'Days',
    maturityDate: '2024-04-15',
  };

  interest = {
    application: 'Simple Interest',
    rate: 5.25,
    basis: '360 Days',
  };

  interestSummary = {
    principal: '$485,750.00',
    interest: '$6,321.56',
    total: '$492,071.56',
  };

  padSummary = {
    reference: 'PAD-2024-0923-001',
    lcReference: '#LC-2024-TF-0923',
    creationDate: 'Jan 15, 2024',
    principal: '$485,750.00',
    interest: '$6,321.56',
    maturityDate: 'Apr 15, 2024',
    totalDue: '$492,071.56',
  };

  summaryBlocks: SummaryBlock[] = [
    { label: 'PAD Reference', value: 'PAD-2024-0923-001' },
    { label: 'LC Reference', value: '#LC-2024-TF-0923' },
    { label: 'Creation Date', value: 'Jan 15, 2024' },
    { label: 'Principal Amount', value: '$485,750.00' },
    { label: 'Interest Amount', value: '$6,321.56' },
    { label: 'Maturity Date', value: 'Apr 15, 2024' },
  ];

  constructor(private router: Router) {}

  onCreatePad() {
    const ref = this.padSummary.reference || this.padDetails.reference || 'PAD-NEW';
    const total = this.padSummary.totalDue || `$${this.padDetails.amount}`;
    const msg = `PAD ${ref} created. Total due at maturity: ${total}`;
    this.showAlert('PAD Created', msg, '#2563eb');
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
      this.router.navigate(['/trade/import/execute-payment']);
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
