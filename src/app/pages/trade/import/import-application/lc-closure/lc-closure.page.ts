import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

interface SummaryRow {
  label: string;
  value: string;
  accent?: string;
}

@Component({
  selector: 'app-lc-closure-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './lc-closure.page.html',
})
export class LcClosurePageComponent implements OnInit, AfterViewInit {
  header = {
    title: 'Letter of Credit Successfully Closed',
    subtitle: 'The import LC has been formally closed after successful settlement',
    status: 'LC Closed',
  };

  closure = {
    reference: 'LC-IMP-2024-001587',
    closureDate: 'January 15, 2024',
    closureTime: '14:30 GMT',
  };

  reason = {
    title: 'Settlement Completed',
    description:
      'All obligations under the LC have been fulfilled. Payment has been processed and documents have been accepted.',
  };

  outcome = {
    title: 'Successful Closure',
    description:
      'LC closed without discrepancies. All terms and conditions were met satisfactorily.',
  };

  summary: SummaryRow[] = [
    { label: 'LC Amount', value: 'USD 150,000.00' },
    { label: 'Amount Utilized', value: 'USD 148,750.00' },
    { label: 'Unutilized Amount', value: 'USD 1,250.00', accent: 'text-emerald-600' },
    { label: 'Bank Charges', value: 'USD 875.00' },
  ];

  finalStatus = {
    title: 'LC Closed',
    note: 'This letter of credit is now permanently closed and cannot be reopened.',
  };

  authorizedBy = {
    name: 'Michael Chen',
    role: 'Senior Trade Finance Manager',
  };

  showClosureSection = false;
  @ViewChild('closureHeader') closureHeader!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // show the top confirmation section when navigated from a swal OK
    try {
      this.showClosureSection = !!(history && (history.state as any)?.showClosureSection);
    } catch (e) {
      this.showClosureSection = false;
    }
  }

  ngAfterViewInit(): void {
    if (this.showClosureSection && this.closureHeader) {
      setTimeout(() => {
        try {
          this.closureHeader.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {
          // ignore
        }
      }, 60);
    }
  }

  onAcknowledge() {
    const ref = this.closure?.reference || 'LC-UNKNOWN';
    this.showAlert('Acknowledged', `Closure recorded for ${ref}`, '#2563eb', () => {
      this.showClosureSection = true;
      try {
        this.cdr.detectChanges();
      } catch (e) {}
      setTimeout(() => {
        try {
          this.closureHeader?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {}
      }, 60);
    });
  }

  private showAlert(title: string, text: string, accentColor: string, onOk?: () => void) {
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
      try {
        if (onOk) onOk();
      } catch (e) {}
      overlay.remove();
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
