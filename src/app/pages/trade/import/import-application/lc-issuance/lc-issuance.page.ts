import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

interface PartyCard {
  label: string;
  name: string;
  address: string;
  swift: string;
  account?: string;
}

interface TermField {
  label: string;
  value: string;
}

interface DocumentItem {
  name: string;
  description: string;
}

interface RuleItem {
  title: string;
  description: string;
}

interface LcIssuanceData {
  header: {
    title: string;
    reference: string;
    status: string;
    approvedBy: string;
    approvedDate: string;
  };
  parties: PartyCard[];
  terms: TermField[];
  documents: DocumentItem[];
  rules: RuleItem[];
  mt700: {
    reference: string;
    preview: string;
  };
  validation: {
    status: string;
    note: string;
  };
}

@Component({
  selector: 'app-import-lc-issuance-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './lc-issuance.page.html',
})
export class ImportLcIssuancePageComponent implements OnInit {
  lcOptions = [
    'LC-2024-00847',
    'LC-2024-01001',
    'LC-2024-01025',
    'LC-2025-00003',
    'LC-REF-TEST',
  ];

  lcReferenceControl = new FormControl<string | null>(null);

  lcReferencesLoading = false;

  lcReferencesError = '';

  private lcDataset: Record<string, LcIssuanceData> = {
    'LC-2024-00847': {
      header: {
        title: 'LC Issuance & MT700 Preparation',
        reference: 'LC-2024-00847',
        status: 'Approved',
        approvedBy: 'Sarah Johnson',
        approvedDate: 'Jan 14, 2025',
      },
      parties: [
        {
          label: 'Applicant',
          name: 'GlobalTech Industries Ltd',
          address:
            '4000th 4522-18990-2321\n45 Commerce Street, Financial District\nNew York, NY 10014, USA',
          swift: 'GTIUS33XXX',
          account: 'AC-00000029839-231',
        },
        {
          label: 'Beneficiary',
          name: 'Shanghai Electronics Co., Ltd',
          address: 'No. 88 Pudong Avenue, Pudong District\nShanghai 200120, China',
          swift: 'SHENSHNXXX',
          account: 'Bank of China, Shanghai Branch',
        },
      ],
      terms: [
        { label: 'LC Amount', value: '$2,450,000.00' },
        { label: 'Currency', value: 'USD' },
        { label: 'Tolerance', value: '+/-5%' },
        { label: 'Expiry Date', value: 'March 15, 2025' },
        { label: 'Latest Shipment Date', value: 'February 28, 2025' },
        { label: 'Port of Loading', value: 'Shanghai Port, China' },
        { label: 'Port of Discharge', value: 'Port of New York, USA' },
      ],
      documents: [
        {
          name: 'Commercial Invoice',
          description: 'Original + 3 copies, signed and stamped',
        },
        {
          name: 'Bill of Lading',
          description:
            'Full set of clean on-board ocean bills of lading made out to order and blank endorsed',
        },
        {
          name: 'Packing List',
          description: 'Original + 2 copies showing detailed packing information',
        },
        {
          name: 'Certificate of Origin',
          description: 'Form A issued by Chamber of Commerce',
        },
        {
          name: 'Insurance Certificate',
          description: 'Covering 110% of invoice value for all risks including war risks',
        },
      ],
      rules: [
        {
          title: 'UCP 600 Compliance',
          description:
            'This documentary credit is subject to the Uniform Customs and Practice for Documentary Credits (2007 Revision), ICC Publication No. 600.',
        },
        {
          title: 'Irrevocable Documentary Credit',
          description: 'Transferable: No · Partial Shipments: Allowed · Transshipment: Not Allowed',
        },
      ],
      mt700: {
        reference: 'LC-2024-00847',
        preview: `:27: 1/1
:40A: IRREVOCABLE
:20: LC-2024-00847
:31C: 240114
:40E: UCP LATEST VERSION
:31D: 250315 NEW YORK
:50: APPLICANT
GLOBALTECH INDUSTRIES LTD
45 COMMERCE STREET
NEW YORK NY 10014 USA
:59: BENEFICIARY
SHANGHAI ELECTRONICS CO LTD
NO 88 PUDONG AVENUE
SHANGHAI 200120 CHINA
:32B: USD2450000
:41A: BANK OF CHINA SHANGHAI
:42C: AT SIGHT
:43P: PARTIAL SHIPMENTS ALLOWED
:43T: TRANSSHIPMENT NOT ALLOWED
:44E: PORT OF LOADING SHANGHAI
:44F: PORT OF DISCHARGE NEW YORK
:44C: LATEST DATE OF SHIPMENT 250228
:45A: GOODS
INDUSTRIAL MACHINERY COMPONENTS
:46A: DOCUMENTS REQUIRED
COMMERCIAL INVOICE
BILL OF LADING
PACKING LIST
CERTIFICATE OF ORIGIN
INSURANCE CERTIFICATE
:47A: ADDITIONAL CONDITIONS
ALL DOCUMENTS MUST INDICATE LC NUMBER
:71B: CHARGES FOR BENEFICIARY
:49: CONFIRMATION INSTRUCTIONS
WITHOUT`,
      },
      validation: {
        status: 'Message Validated',
        note: 'Ready for transmission',
      },
    },
    'LC-2024-01001': {
      header: {
        title: 'LC Issuance & MT700 Preparation',
        reference: 'LC-2024-01001',
        status: 'Pending Approval',
        approvedBy: 'Awaiting Manager',
        approvedDate: '—',
      },
      parties: [
        {
          label: 'Applicant',
          name: 'Continental Foods GmbH',
          address: 'Am Handelshafen 12\n20457 Hamburg\nGermany',
          swift: 'COFODEHHXXX',
          account: 'DE89 3704 0044 0532 0130 00',
        },
        {
          label: 'Beneficiary',
          name: 'Mediterranean Agro Exports',
          address: 'Via Roma 221\n90133 Palermo\nItaly',
          swift: 'MAGEIT21XXX',
          account: 'IT60 X054 2811 1010 0000 0123 456',
        },
      ],
      terms: [
        { label: 'LC Amount', value: '€980,000.00' },
        { label: 'Currency', value: 'EUR' },
        { label: 'Tolerance', value: '+/-3%' },
        { label: 'Expiry Date', value: 'July 30, 2025' },
        { label: 'Latest Shipment Date', value: 'July 10, 2025' },
        { label: 'Port of Loading', value: 'Palermo Port, Italy' },
        { label: 'Port of Discharge', value: 'Hamburg Port, Germany' },
      ],
      documents: [
        {
          name: 'Commercial Invoice',
          description: 'Net and gross weight to be stated',
        },
        {
          name: 'Bill of Lading',
          description: 'To order of issuing bank, freight prepaid',
        },
        {
          name: 'Health Certificate',
          description: 'Issued by competent authority of exporting country',
        },
        {
          name: 'Phytosanitary Certificate',
          description: 'Covering all shipped agricultural products',
        },
      ],
      rules: [
        {
          title: 'UCP 600 Compliance',
          description:
            'Subject to UCP 600 with latest ICC amendments applicable at time of issuance.',
        },
        {
          title: 'LC Type',
          description: 'Irrevocable, transferable, available by negotiation at any bank.',
        },
      ],
      mt700: {
        reference: 'LC-2024-01001',
        preview: `:27: 1/1
:40A: IRREVOCABLE TRANSFERABLE
:20: LC-2024-01001
:31C: 240501
:40E: UCP LATEST VERSION
:31D: 250730 HAMBURG
:32B: EUR980000
:44E: PORT OF LOADING PALERMO
:44F: PORT OF DISCHARGE HAMBURG
:45A: PACKED FOOD PRODUCTS
:46A: STANDARD DOCUMENT SET INCLUDING HEALTH CERTIFICATES`,
      },
      validation: {
        status: 'Draft Prepared',
        note: 'Pending trade manager validation',
      },
    },
    'LC-2024-01025': {
      header: {
        title: 'LC Issuance & MT700 Preparation',
        reference: 'LC-2024-01025',
        status: 'Approved',
        approvedBy: 'Michael Tan',
        approvedDate: 'Feb 02, 2025',
      },
      parties: [
        {
          label: 'Applicant',
          name: 'Pacific Textiles Pte Ltd',
          address: '25 Marina View\nSingapore 018987',
          swift: 'PACTSGSGXXX',
          account: 'SG45 1234 5678 9012',
        },
        {
          label: 'Beneficiary',
          name: 'Dhaka Garments Export Ltd',
          address: 'Plot 21, EPZ\nChittagong, Bangladesh',
          swift: 'DGEXBDDHXXX',
          account: 'Local beneficiary account with advising bank',
        },
      ],
      terms: [
        { label: 'LC Amount', value: 'USD 1,200,000.00' },
        { label: 'Currency', value: 'USD' },
        { label: 'Tolerance', value: '+/-10%' },
        { label: 'Expiry Date', value: 'September 10, 2025' },
        { label: 'Latest Shipment Date', value: 'August 25, 2025' },
        { label: 'Port of Loading', value: 'Chittagong Port, Bangladesh' },
        { label: 'Port of Discharge', value: 'Singapore Port' },
      ],
      documents: [
        {
          name: 'Commercial Invoice',
          description: 'Unit price and HS codes to be stated',
        },
        {
          name: 'Bill of Lading',
          description: 'Clean on board, showing freight collect',
        },
        {
          name: 'Packing List',
          description: 'Detailed carton-wise packing list',
        },
      ],
      rules: [
        {
          title: 'Incoterms',
          description: 'CFR Singapore Port (Incoterms 2020)',
        },
        {
          title: 'Reimbursement',
          description: 'Reimbursing bank nominated as per field 53A.',
        },
      ],
      mt700: {
        reference: 'LC-2024-01025',
        preview: `:20: LC-2024-01025
:31C: 250202
:32B: USD1200000
:44E: PORT OF LOADING CHITTAGONG
:44F: PORT OF DISCHARGE SINGAPORE
:45A: GARMENTS AND TEXTILES`,
      },
      validation: {
        status: 'Message Validated',
        note: 'Checked with trade operations',
      },
    },
    'LC-2025-00003': {
      header: {
        title: 'LC Issuance & MT700 Preparation',
        reference: 'LC-2025-00003',
        status: 'Draft',
        approvedBy: 'Not yet approved',
        approvedDate: '—',
      },
      parties: [
        {
          label: 'Applicant',
          name: 'Northern Energy Corp',
          address: '1010 Aurora Avenue\nCalgary, AB, Canada',
          swift: 'NOENCACTXXX',
          account: 'CA19 0000 1111 2222 3333',
        },
        {
          label: 'Beneficiary',
          name: 'Oslo Marine Equipment AS',
          address: 'Fjordgata 9\n0150 Oslo\nNorway',
          swift: 'OSMEKJEXXX',
          account: 'NO93 8601 1117 947',
        },
      ],
      terms: [
        { label: 'LC Amount', value: 'NOK 9,800,000.00' },
        { label: 'Currency', value: 'NOK' },
        { label: 'Tolerance', value: '0%' },
        { label: 'Expiry Date', value: 'December 20, 2025' },
        { label: 'Latest Shipment Date', value: 'November 30, 2025' },
        { label: 'Port of Loading', value: 'Oslo Port, Norway' },
        { label: 'Port of Discharge', value: 'Halifax, Canada' },
      ],
      documents: [
        {
          name: 'Commercial Invoice',
          description: 'To show LC number and contract reference',
        },
        {
          name: 'Bill of Lading',
          description: 'To indicate “Marine equipment, HS code 8905”',
        },
        {
          name: 'Insurance Policy',
          description: 'Placed in Canada; beneficiary as loss payee',
        },
      ],
      rules: [
        {
          title: 'Governing Rules',
          description: 'Subject to UCP 600 and ISBP latest version.',
        },
      ],
      mt700: {
        reference: 'LC-2025-00003',
        preview: `:20: LC-2025-00003
:31C: 250305
:32B: NOK9800000
:44E: PORT OF LOADING OSLO
:44F: PORT OF DISCHARGE HALIFAX`,
      },
      validation: {
        status: 'Draft',
        note: 'To be validated after credit approval is received',
      },
    },
    'LC-REF-TEST': {
      header: {
        title: 'LC Issuance & MT700 Preparation',
        reference: 'LC-REF-TEST',
        status: 'Test Scenario',
        approvedBy: 'Test User',
        approvedDate: 'Jan 01, 2025',
      },
      parties: [
        {
          label: 'Applicant',
          name: 'Demo Trading House',
          address: '123 Demo Street\nDemo City',
          swift: 'DEMOBDDHXXX',
          account: '0000-TEST-ACCOUNT',
        },
        {
          label: 'Beneficiary',
          name: 'Sample Exporters Ltd',
          address: '456 Sample Road\nSample Country',
          swift: 'SAMPUS33XXX',
          account: '0000-SAMPLE-ACCOUNT',
        },
      ],
      terms: [
        { label: 'LC Amount', value: 'USD 100,000.00' },
        { label: 'Currency', value: 'USD' },
        { label: 'Tolerance', value: '+/-2%' },
        { label: 'Expiry Date', value: 'June 30, 2025' },
        { label: 'Latest Shipment Date', value: 'June 15, 2025' },
        { label: 'Port of Loading', value: 'Demo Port' },
        { label: 'Port of Discharge', value: 'Sample Port' },
      ],
      documents: [
        {
          name: 'Commercial Invoice',
          description: 'Demo description for test scenario',
        },
      ],
      rules: [
        {
          title: 'Test Rule',
          description: 'Used only for UI validation of dropdown behaviour.',
        },
      ],
      mt700: {
        reference: 'LC-REF-TEST',
        preview: `:20: LC-REF-TEST
:32B: USD100000`,
      },
      validation: {
        status: 'Test Data',
        note: 'Not for production use',
      },
    },
  };

  header: LcIssuanceData['header'] = this.lcDataset['LC-2024-00847'].header;

  parties: PartyCard[] = this.lcDataset['LC-2024-00847'].parties;

  terms: TermField[] = this.lcDataset['LC-2024-00847'].terms;

  documents: DocumentItem[] = this.lcDataset['LC-2024-00847'].documents;

  rules: RuleItem[] = this.lcDataset['LC-2024-00847'].rules;

  mt700 = this.lcDataset['LC-2024-00847'].mt700;

  validation = this.lcDataset['LC-2024-00847'].validation;

  constructor(private importLcStateService: ImportLcStateService) {
  }

  ngOnInit(): void {
    this.lcReferenceControl.valueChanges.subscribe((reference) => {
      if (reference) {
        this.onReferenceChange(reference);
        this.importLcStateService.updateState({
          lcReference: reference,
        });
      }
    });

    this.fetchAvailableLcReferences();
  }

  fetchAvailableLcReferences(): void {
    this.lcReferencesLoading = true;
    this.lcReferencesError = '';

    of(this.lcOptions)
      .pipe(
        finalize(() => {
          this.lcReferencesLoading = false;
        }),
      )
      .subscribe({
        next: (references) => {
          this.lcOptions = references;

          const state = this.importLcStateService.getState();
          const initialReference = state.lcReference || references[0] || null;

          if (initialReference) {
            this.lcReferenceControl.setValue(initialReference, { emitEvent: true });
            this.importLcStateService.updateState({
              lcReference: initialReference,
              lcReferences: references,
            });
          } else {
            this.importLcStateService.updateState({
              lcReferences: references,
            });
          }
        },
        error: () => {
          this.lcReferencesError = 'Unable to load LC references. Please try again.';
        },
      });
  }

  onSaveDraft() {
    // secondary button look — use slate color for draft toast
    this.showToast('Draft saved', '#475569');
  }

  onValidateLc() {
    this.showAlert('LC Validated', 'Successfully validated LC', '#f59e0b');
  }

  onSubmitForIssuance() {
    this.showAlert('Submitted', 'LC submitted for issuance', '#2563eb');
  }

  onReferenceChange(reference: string) {
    try {
      const data = this.lcDataset[reference];
      if (!data) {
        console.error('No LC issuance data found for reference', reference);
        return;
      }

      this.header = { ...data.header };
      this.parties = data.parties.map((p) => ({ ...p }));
      this.terms = data.terms.map((t) => ({ ...t }));
      this.documents = data.documents.map((d) => ({ ...d }));
      this.rules = data.rules.map((r) => ({ ...r }));
      this.mt700 = {
        reference: data.mt700.reference,
        preview: data.mt700.preview,
      };
      this.validation = { ...data.validation };
    } catch (error) {
      console.error('Failed to update LC issuance data for reference', reference, error);
    }
  }

  private showToast(message: string, bgColor: string = '#10b981') {
    const id = `tf-toast-${Date.now()}`;
    const el = document.createElement('div');
    el.id = id;
    // make a slightly larger, card-like toast at bottom-left with an icon
    el.innerHTML = `<div style="display:flex;align-items:center;gap:10px;"><svg width=18 height=18 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='12' cy='12' r='10' fill='rgba(255,255,255,0.12)'/><path d='M9.5 12.5l1.8 1.8L15 10.6' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg><div style="font-size:13px;color:white">${message}</div></div>`;
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '18px',
      left: '18px',
      background: bgColor,
      color: 'white',
      padding: '12px 16px',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(2,6,23,0.2)',
      zIndex: '9999',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    });
    document.body.appendChild(el);
    // fade out after delay
    setTimeout(() => {
      el.style.transition = 'opacity 300ms ease, transform 300ms ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(() => el.remove(), 320);
    }, 1600);
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

    // top accent bar
    const accent = document.createElement('div');
    Object.assign(accent.style, {
      height: '8px',
      background: accentColor,
      width: '100%',
    });

    const content = document.createElement('div');
    Object.assign(content.style, {
      padding: '20px',
    });

    const h = document.createElement('div');
    h.textContent = title;
    Object.assign(h.style, {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#0f172a',
    });

    const p = document.createElement('div');
    p.textContent = text;
    Object.assign(p.style, { fontSize: '13px', color: '#475569', marginBottom: '18px' });

    const btn = document.createElement('button');
    btn.textContent = 'OK';
    Object.assign(btn.style, {
      background: accentColor,
      color: 'white',
      border: 'none',
      padding: '10px 18px',
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
