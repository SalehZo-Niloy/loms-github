import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface AmendmentType {
  label: string;
  description: string;
  selected: boolean;
}

interface StatusStep {
  title: string;
  note: string;
  status: 'completed' | 'current' | 'pending';
}

interface ReferenceItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-lc-amendment-request-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './lc-amendment-request.page.html',
})
export class LcAmendmentRequestPageComponent {
  header = {
    title: 'LC Amendment Request',
    subtitle: 'Submit amendments to your existing Import Letter of Credit',
  };

  user = {
    name: 'John Mitchell',
  };

  referenceInfo: ReferenceItem[] = [
    { label: 'LC Number', value: 'LC/IMP/2024/00847' },
    { label: 'Issue Date', value: '15 January 2024' },
    { label: 'Beneficiary', value: 'Global Export Solutions Ltd.' },
    { label: 'Current Amount', value: 'USD 250,000.00' },
    { label: 'Expiry Date', value: '30 June 2024' },
    { label: 'Latest Shipment', value: '15 June 2024' },
  ];

  amendmentTypes: AmendmentType[] = [
    { label: 'Amount', description: 'Increase or decrease LC value', selected: true },
    { label: 'Expiry Date', description: 'Extend or modify expiry', selected: false },
    { label: 'Shipment Date', description: 'Update shipment timeline', selected: false },
    { label: 'Terms & Conditions', description: 'Modify LC terms', selected: false },
  ];

  summary = {
    selected: 0,
    currentValue: 'USD 250,000',
    newValue: 'USD 250,000',
    fee: 'USD 150',
  };

  statusFlow: StatusStep[] = [
    { title: 'Draft Created', note: 'Current stage', status: 'current' },
    { title: 'Pending Approval', note: 'After submission', status: 'pending' },
    { title: 'Bank Processing', note: '1-2 business days', status: 'pending' },
    { title: 'Completed', note: 'Amendment active', status: 'pending' },
  ];

  details = {
    newAmount: 'USD 250,000.00',
    amountChange: '+ USD 0.00',
    newExpiry: '2024-06-30',
    newShipment: '2024-06-15',
    termsChanges: '',
  };

  remarks = '';

  get selectedCount(): number {
    return this.amendmentTypes.filter((item) => item.selected).length;
  }

  onSubmitAmendment() {
    const types =
      this.amendmentTypes
        .filter((t) => t.selected)
        .map((t) => t.label)
        .join(', ') || 'No specific type selected';
    const message = `Submitted amendment request (${this.selectedCount}): ${types}`;
    this.showAlert('Amendment Submitted', message, '#2563eb');
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
