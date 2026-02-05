import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface SummaryItem {
  title: string;
  description: string;
  severity: 'Critical' | 'Medium' | 'Low';
}

interface BankDetail {
  label: string;
  value: string;
}

interface ChecklistItem {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-discrepancy-record-reject',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './discrepancy-record-reject.component.html',
})
export class DiscrepancyRecordRejectComponent {
  header = {
    title: 'Discrepancy Rejection Processing',
    lcReference: '#LC-2024-IMP-0847',
    documentRef: '#DOC-2024-0156',
    status: 'Payment Blocked',
  };

  alert = {
    title: 'Discrepancies Rejected by Customer',
    message:
      'Customer: Global Trade Solutions Ltd. has rejected the discrepancies. Payment processing is halted. Please process document return instructions.',
  };

  discrepancySummary: SummaryItem[] = [
    {
      title: 'Invoice Amount Mismatch',
      description: 'Difference: USD 570.00',
      severity: 'Critical',
    },
    {
      title: 'Missing Signature',
      description: 'Authorization signature missing',
      severity: 'Medium',
    },
    {
      title: 'Date Format Error',
      description: 'DD/MM/YYYY vs MM/DD/YYYY',
      severity: 'Low',
    },
  ];

  notifiedAt = 'Jan 14, 2024 at 09:30 AM';

  customerDecision = {
    status: 'Rejected',
    remarks:
      'The invoice amount discrepancy is unacceptable. We require corrected documents before proceeding with payment. Please return all documents to the presenting bank for amendment.',
    decisionDate: 'January 15, 2024 at 11:45 AM',
  };

  instruction = {
    type: 'Return Documents to Presenting Bank',
    communication: 'SWIFT Message',
    dispatch: 'Express Courier',
    remarks: '',
  };

  instructionTypes = [
    'Return Documents to Presenting Bank',
    'Hold Documents Pending Further Advice',
    'Return Documents to Beneficiary',
  ];

  communicationModes = ['SWIFT Message', 'Email Notification', 'Letter Dispatch'];

  dispatchMethods = ['Express Courier', 'Registered Mail', 'Bank Mail'];

  presentingBank: BankDetail[] = [
    { label: 'Bank Name', value: 'Standard Chartered Bank' },
    { label: 'Branch', value: 'Trade Finance Division, Singapore' },
    { label: 'Country', value: 'Singapore' },
    { label: 'SWIFT BIC', value: 'SCBLSG22XXX' },
  ];

  checklist: ChecklistItem[] = [
    { label: 'Customer rejection confirmed and documented', checked: true },
    { label: 'Payment processing has been halted', checked: true },
    { label: 'Document instruction captured correctly', checked: false },
    { label: 'Bank notification content prepared', checked: false },
  ];

  notice = {
    title: 'Important Notice',
    message:
      'This action will permanently record the customer rejection and halt all payment processing for this LC presentation. Documents will be processed according to your instructions above.',
    bullets: ['No Payment Will Be Executed', 'Action Is Irreversible'],
  };

  onConfirmRejection() {
    const instr = this.instruction || { type: 'Not specified', communication: 'Not specified' };
    const checked = this.checklist.filter((c) => c.checked).length;
    const total = this.checklist.length;
    const msg = `Instruction: ${instr.type}. Notify via ${instr.communication}. Checklist ${checked}/${total} completed.`;
    this.showAlert('Rejection Confirmed', msg, '#d97706');
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
