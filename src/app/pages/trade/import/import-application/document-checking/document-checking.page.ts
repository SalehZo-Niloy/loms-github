import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface ReferenceItem {
  label: string;
  value: string;
}

interface TermItem {
  label: string;
  value: string;
}

interface ChecklistItem {
  label: string;
  status: 'pass' | 'fail';
}

interface DocumentCheck {
  name: string;
  description: string;
  checks: ChecklistItem[];
}

interface NextStepItem {
  title: string;
  note: string;
  status: 'current' | 'pending' | 'completed';
}

@Component({
  selector: 'app-document-checking-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './document-checking.page.html',
})
export class DocumentCheckingPageComponent {
  header = {
    title: 'Document Checking',
    subtitle: 'Verify compliance of received documents against LC terms and conditions',
  };

  referenceInfo: ReferenceItem[] = [
    { label: 'LC Number', value: 'LC/IMP/2024/00847' },
    { label: 'Beneficiary', value: 'Global Export Solutions Ltd.' },
    { label: 'LC Amount', value: 'USD 250,000.00' },
    { label: 'Documents Received', value: '16 January 2024' },
    { label: 'Expiry Date', value: '30 June 2024' },
    { label: 'Days Remaining', value: '165 days' },
  ];

  terms: TermItem[] = [
    { label: 'Commodity', value: 'Industrial Machinery Parts' },
    { label: 'Quantity', value: '500 Units' },
    { label: 'Incoterms', value: 'CIF Singapore' },
    { label: 'Unit Price', value: 'USD 500.00 per unit' },
    { label: 'Port of Loading', value: 'Hamburg, Germany' },
    { label: 'Port of Discharge', value: 'Singapore Port' },
    { label: 'Insurance', value: '110% of Invoice Value' },
    { label: 'Latest Shipment', value: '15 June 2024' },
  ];

  compliance = {
    documentsChecked: '4 / 4',
    passedChecks: '8 / 9',
    failedChecks: '1',
    overallStatus: 'Non-Compliant',
  };

  nextSteps: NextStepItem[] = [
    { title: 'Document Review Complete', note: 'Current stage', status: 'completed' },
    { title: 'Discrepancy Handling', note: 'Next: Contact beneficiary', status: 'current' },
    { title: 'Document Correction', note: 'Pending response', status: 'pending' },
    { title: 'Final Approval', note: 'After correction', status: 'pending' },
  ];

  documents: DocumentCheck[] = [
    {
      name: 'Bill of Lading (B/L)',
      description: 'Original shipping document verification',
      checks: [
        { label: 'Consignee matches LC terms', status: 'pass' },
        { label: 'Port of loading correct', status: 'pass' },
        { label: 'Shipment date within LC terms', status: 'pass' },
      ],
    },
    {
      name: 'Commercial Invoice',
      description: 'Invoice details and amount verification',
      checks: [
        { label: 'Invoice amount within LC limit', status: 'pass' },
        { label: 'Commodity description matches', status: 'fail' },
        { label: 'Unit price as per LC terms', status: 'pass' },
      ],
    },
    {
      name: 'Certificate of Origin',
      description: 'Origin certification compliance',
      checks: [
        { label: 'Origin country matches LC', status: 'pass' },
        { label: 'Valid certification authority', status: 'pass' },
      ],
    },
    {
      name: 'Insurance Policy',
      description: 'Coverage and terms verification',
      checks: [
        { label: 'Coverage percentage (110%)', status: 'pass' },
        { label: 'Policy currency matches LC', status: 'pass' },
      ],
    },
  ];

  discrepancyNotes =
    'Invoice shows "Machine Components" while LC specifies "Industrial Machinery Parts".';
  additionalNotes = '';
  decision = 'discrepancies';

  onSubmitReview() {
    const passCount = this.documents.reduce((acc, doc) => {
      return acc + doc.checks.filter((c) => c.status === 'pass').length;
    }, 0);
    const failCount = this.documents.reduce((acc, doc) => {
      return acc + doc.checks.filter((c) => c.status === 'fail').length;
    }, 0);
    const title =
      this.decision === 'clean' ? 'Review Submitted — Clean' : 'Review Submitted — Discrepancies';
    const msg = `Passed: ${passCount}, Failed: ${failCount}. Decision: ${this.decision}`;
    this.showAlert(title, msg, '#e11d48');
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
