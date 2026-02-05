import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface ReferenceItem {
  label: string;
  value: string;
}

interface DocumentItem {
  name: string;
  description: string;
  required: boolean;
  received: boolean;
}

interface ProcessStep {
  title: string;
  note: string;
  status: 'current' | 'pending' | 'completed';
}

@Component({
  selector: 'app-document-receive-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './document-receive.page.html',
})
export class DocumentReceivePageComponent {
  header = {
    title: 'Document Receipt',
    subtitle: 'Record receipt of export documents under Import Letter of Credit',
  };

  user = {
    name: 'John Mitchell',
  };

  referenceInfo: ReferenceItem[] = [
    { label: 'LC Number', value: 'LC/IMP/2024/00847' },
    { label: 'Beneficiary', value: 'Global Export Solutions Ltd.' },
    { label: 'LC Amount', value: 'USD 250,000.00' },
    { label: 'Issue Date', value: '15 January 2024' },
    { label: 'Expiry Date', value: '30 June 2024' },
    { label: 'Latest Shipment', value: '15 June 2024' },
  ];

  documents: DocumentItem[] = [
    {
      name: 'Bill of Lading (B/L)',
      description: 'Original shipping document',
      required: true,
      received: true,
    },
    {
      name: 'Commercial Invoice',
      description: 'Detailed invoice with goods description',
      required: true,
      received: true,
    },
    {
      name: 'Certificate of Origin (COO)',
      description: 'Country of origin certification',
      required: true,
      received: false,
    },
    {
      name: 'Insurance Policy',
      description: 'Cargo insurance coverage',
      required: true,
      received: false,
    },
    {
      name: 'Packing List',
      description: 'Detailed packing information',
      required: false,
      received: false,
    },
    {
      name: 'Inspection Certificate',
      description: 'Quality inspection report',
      required: false,
      received: false,
    },
  ];

  processSteps: ProcessStep[] = [
    { title: 'Documents Received', note: 'Current stage', status: 'current' },
    { title: 'Documents Under Checking', note: 'After confirmation', status: 'pending' },
    { title: 'Compliance Review', note: '1-2 business days', status: 'pending' },
    { title: 'Documents Accepted', note: 'Final approval', status: 'pending' },
  ];

  receiptDetails = {
    date: '2024-01-15',
    time: '14:30',
    receivedBy: 'John Mitchell (Current User)',
    deliveryMethod: 'Courier Service',
    notes: '',
  };

  deliveryMethods = ['Courier Service', 'In-person Drop', 'Bank Mail', 'Third-Party Agent'];

  get documentsReceivedCount(): number {
    return this.documents.filter((doc) => doc.received).length;
  }

  get requiredDocumentsCount(): number {
    return this.documents.filter((doc) => doc.required).length;
  }

  get optionalDocumentsCount(): number {
    return this.documents.filter((doc) => !doc.required).length;
  }

  get receivedRequiredCount(): number {
    return this.documents.filter((doc) => doc.required && doc.received).length;
  }

  get receivedOptionalCount(): number {
    return this.documents.filter((doc) => !doc.required && doc.received).length;
  }

  get completionPercent(): number {
    if (!this.documents.length) {
      return 0;
    }

    return Math.round((this.documentsReceivedCount / this.documents.length) * 100);
  }

  onConfirmReceipt() {
    const received = this.documentsReceivedCount;
    const total = this.documents.length;
    const pct = this.completionPercent;
    this.showAlert(
      'Receipt Confirmed',
      `${received} of ${total} documents recorded (${pct}% complete)`,
      '#2563eb',
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
