import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../services/alert.service';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface SummaryItem {
  label: string;
  value: string;
}

interface DocumentRow {
  type: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
}

interface ComparisonRow {
  parameter: string;
  requestValue: string;
  documentValue: string;
  matches: boolean;
}

interface ChecklistItem {
  label: string;
  checked: boolean;
}

interface EligibilityItem {
  label: string;
  status: string;
  statusClass: string;
}

interface SubmittingLcInfo {
  reference: string;
  submissionDate: string;
  lcType: string;
  amount: string;
  currency: string;
  beneficiaryName: string;
  portOfDischarge: string;
  status: string;
}

type TabId =
  | 'lc-identification'
  | 'customer-applicant'
  | 'credit-sanction'
  | 'lc-nature-rules'
  | 'beneficiary-parties'
  | 'banks-routing'
  | 'amount-currency'
  | 'dates-shipment'
  | 'goods-transport'
  | 'documents-conditions'
  | 'instructions-settlement';

interface TabDefinition {
  id: TabId;
  label: string;
}

interface TabField {
  label: string;
  value: string;
  helper?: string;
  tone: 'system' | 'ro' | 'customer';
  readOnly: boolean;
}

@Component({
  selector: 'app-document-handover-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './document-handover-view.component.html',
})
export class DocumentHandoverViewComponent {
  constructor(
    private router: Router,
    private alertService: AlertService,
  ) {}

  activeTabId: TabId = 'lc-identification';

  tabs: TabDefinition[] = [
    { id: 'lc-identification', label: 'LC Identification' },
    { id: 'customer-applicant', label: 'Customer & Applicant' },
    { id: 'credit-sanction', label: 'Credit & Sanction' },
    { id: 'lc-nature-rules', label: 'LC Nature & Rules' },
    { id: 'beneficiary-parties', label: 'Beneficiary & Parties' },
    { id: 'banks-routing', label: 'Banks & Routing' },
    { id: 'amount-currency', label: 'Amount & Currency' },
    { id: 'dates-shipment', label: 'Dates & Shipment' },
    { id: 'goods-transport', label: 'Goods & Transport' },
    { id: 'documents-conditions', label: 'Documents & Conditions' },
    { id: 'instructions-settlement', label: 'Instructions & Settlement' },
  ];

  header = {
    title: 'Import LC - Document Review & Handover',
    reference: 'IMPTLC/2024/001234',
    lcType: 'Sight',
    status: 'Draft'
  };

  submittingInfo: SubmittingLcInfo = {
    reference: 'IMPTLC/2024/001234',
    submissionDate: '12 Jan 2024',
    lcType: 'Usance',
    amount: '€180,000',
    currency: 'EUR',
    beneficiaryName: 'European Trading Co',
    portOfDischarge: 'Port of Rotterdam',
    status: 'Bank Review'
  };

  tabFields: Record<TabId, TabField[]> = {
    'lc-identification': [
      {
        label: 'Booking Date',
        value: '12-Jan-2024',
        helper: 'System Generated',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Business Date',
        value: '12-Jan-2024',
        helper: 'System Generated',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Draft LC / Draft from Clone',
        value: 'New Draft',
        helper: 'System',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Tracking No',
        value: 'TRK/2024/001234',
        helper: 'System Generated',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'LC Number',
        value: 'IMPTLC/2024/001234',
        helper: 'RO Generated',
        tone: 'ro',
        readOnly: true,
      },
      {
        label: 'LC Status',
        value: 'Draft',
        helper: 'System',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Draft No',
        value: '001',
        helper: 'System',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'LC Finance',
        value: 'Cash',
        helper: 'RO Input',
        tone: 'ro',
        readOnly: true,
      },
      {
        label: 'SWIFT Indicator',
        value: 'SWIFT700',
        helper: 'RO Input',
        tone: 'ro',
        readOnly: true,
      },
    ],
    'customer-applicant': [
      {
        label: 'Customer ID (CIF)',
        value: 'CIF000123',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Applicant Name (50)',
        value: 'Acme Imports Ltd.',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Contact No',
        value: '+880 1711 000000',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Applicant Account Number',
        value: '0011-000123-001',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Applicant Bank A/C No (51A)',
        value: '0011-000123-LC',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'VAT Reg. No',
        value: 'VAT-2024-000123',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'TIN No',
        value: 'TIN-123456789',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Bank Registration No',
        value: 'BR-2024-0099',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'AD Branch',
        value: 'Gulshan AD Branch',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Transaction Branch',
        value: 'Gulshan Main Branch',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'credit-sanction': [
      {
        label: 'Limit ID',
        value: 'LIM-2024-00045',
        helper: 'System Generated',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Customer Sanction Limit',
        value: 'USD 5,000,000',
        helper: 'Credit Limit',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Available Global Limit',
        value: 'USD 1,100,000',
        helper: 'After Current Exposure',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Current A/C Balance',
        value: 'USD 250,000',
        helper: 'System Balance',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Booking / LTR / PAD Amount',
        value: 'USD 850,000',
        helper: 'Derived',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Interest Used Limit',
        value: 'USD 120,000',
        helper: 'Accrued',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'Lien MLC Amount',
        value: 'USD 50,000',
        helper: 'Lien Marked',
        tone: 'system',
        readOnly: true,
      },
    ],
    'lc-nature-rules': [
      {
        label: 'LC Type',
        value: 'Regular',
        helper: 'Customer Selected',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Incoterms',
        value: 'CIF',
        helper: 'Customer Selected',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Form of LC (40A)',
        value: 'Irrevocable',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Applicable Rules (40E)',
        value: 'UCP Latest Version',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Negotiation Type',
        value: 'By Negotiation',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Recourse Allowed',
        value: 'Yes',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Transferable (43T)',
        value: 'No',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Mixed Payment Details (42M)',
        value: 'Sight 80% / Usance 20%',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'beneficiary-parties': [
      {
        label: 'Beneficiary Name (59)',
        value: 'Shanghai Industrial Exports Co. Ltd.',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Origin Country',
        value: 'China',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Beneficiary A/C',
        value: 'CN-001-998877',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Beneficiary Bank Name',
        value: 'Bank of Shanghai',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Beneficiary Bank Country',
        value: 'China',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Drawer / Drawee (42A)',
        value: 'Applicant / Beneficiary',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'banks-routing': [
      {
        label: 'Receiving BIC',
        value: 'ABCDBDDHXXX',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Negotiating Bank BIC',
        value: 'CITIBDDXXXX',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Transferring Bank BIC',
        value: 'HSBCGB2LXXX',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Advising Bank A/C No (57A)',
        value: 'ADV-000122-01',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Advising Bank BIC (57A)',
        value: 'DEUTDEFFXXX',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Reimbursing Bank A/C No (53A)',
        value: 'REM-009988-01',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Reimbursing Bank BIC (53A)',
        value: 'CHASUS33XXX',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'amount-currency': [
      {
        label: 'PI Amount (FC)',
        value: 'USD 850,000.00',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Currency',
        value: 'USD',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'LC Amount (32B)',
        value: 'USD 850,000.00',
        helper: 'RO / System',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Exchange Rate',
        value: '110.50',
        helper: 'RO / System',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Cross Currency Rate',
        value: '1.00',
        helper: 'RO / System',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Tolerance % (39A)',
        value: '+/- 10%',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Cash Margin %',
        value: '20%',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'LC Open Value',
        value: 'USD 850,000.00',
        helper: 'System Derived',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'LC Current Value',
        value: 'USD 850,000.00',
        helper: 'System Derived',
        tone: 'system',
        readOnly: true,
      },
      {
        label: 'LC Available Value',
        value: 'USD 850,000.00',
        helper: 'System Derived',
        tone: 'system',
        readOnly: true,
      },
    ],
    'dates-shipment': [
      {
        label: 'Shipment Period',
        value: '15-Jan-2024 to 30-Jan-2024',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Port of Loading',
        value: 'Shanghai Port',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Port of Discharge',
        value: 'Mumbai Port',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Date of Issue (31C)',
        value: '12-Jan-2024',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Expiry Date & Place (31D)',
        value: '12-Jan-2025, Dhaka',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Latest Shipment Date (44C)',
        value: '30-Jan-2024',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Period for Presentation (48)',
        value: '21 days from shipment',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'PSV / CRF & Issue Date',
        value: 'PSV-2024-001 / 10-Jan-2024',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'goods-transport': [
      {
        label: 'Goods Description (45A)',
        value: 'Industrial machinery parts as per PI-ABC-001234',
        helper: 'Customer Data',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'HS Code',
        value: '8479.89',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Mode of Transport',
        value: 'Sea',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Through Land Port',
        value: 'No',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'From Port (44E)',
        value: 'Shanghai Port',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Transport To / Port of Discharge (44F)',
        value: 'Mumbai Port',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Destination Place (44B)',
        value: 'Dhaka, Bangladesh',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Freight Charge',
        value: 'Prepaid',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Insurance Code',
        value: 'CIF',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'documents-conditions': [
      {
        label: 'Proforma Invoice',
        value: 'Uploaded',
        helper: 'Customer Uploaded',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Commercial Invoice',
        value: 'Uploaded',
        helper: 'Customer Uploaded',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Packing List',
        value: 'Uploaded',
        helper: 'Customer Uploaded',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Insurance',
        value: 'Uploaded',
        helper: 'Customer Uploaded',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Certificate of Origin',
        value: 'Uploaded',
        helper: 'Customer Uploaded',
        tone: 'customer',
        readOnly: true,
      },
      {
        label: 'Documents Required (46A)',
        value: 'As per bank standard LC document set',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Conditions (47A)',
        value: 'Standard LC conditions apply',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Additional Conditions',
        value: 'Any discrepancy subject to applicant approval',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Charges (71D)',
        value: 'As per bank tariff',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Charges Paid By',
        value: 'Applicant',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Over Bank Charges Paid By',
        value: 'Beneficiary',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
    'instructions-settlement': [
      {
        label: 'Confirmation Instructions (49)',
        value: 'May Add',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Requested Confirmation A/C No (58A)',
        value: 'CONF-001-2024',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Requested Confirmation BIC (58A)',
        value: 'CONFDEFFXXX',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Instructions (78)',
        value: 'Handle documents on standard terms',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Send to Receiver (72Z)',
        value: 'As per SWIFT standard',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Available With (41D)',
        value: 'Any bank by negotiation',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Available By (41A)',
        value: 'By Acceptance',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Rate Code',
        value: 'LCSTD',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Charges Place (44A)',
        value: 'Dhaka',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
      {
        label: 'Transshipment Allowed (43P)',
        value: 'No',
        helper: 'RO Editable',
        tone: 'ro',
        readOnly: false,
      },
    ],
  };

  get activeFields(): TabField[] {
    return this.tabFields[this.activeTabId];
  }

  setActiveTab(tabId: TabId): void {
    this.activeTabId = tabId;
  }

  getTabClasses(tab: TabDefinition): string[] {
    if (tab.id === this.activeTabId) {
      return [
        'inline-flex',
        'items-center',
        'gap-2',
        'rounded-full',
        'border',
        'border-blue-600',
        'bg-blue-50',
        'px-3',
        'py-1',
        'font-semibold',
        'text-blue-700',
      ];
    }
    if (tab.id === 'amount-currency') {
      return [
        'inline-flex',
        'items-center',
        'gap-1',
        'rounded-full',
        'border',
        'border-emerald-500',
        'bg-emerald-50',
        'px-3',
        'py-1',
        'font-semibold',
        'text-emerald-700',
      ];
    }
    return [
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'border-transparent',
      'px-3',
      'py-1',
      'text-slate-600',
      'hover:bg-slate-50',
    ];
  }

  goBackToHandoverList(): void {
    this.router.navigate(['/trade/import/document-handover']);
  }

  summary: SummaryItem[] = [
    { label: 'Invoice Amount', value: 'USD 850,000.00' },
    { label: 'Beneficiary', value: 'Shanghai Industrial Exports Co. Ltd., China' },
    { label: 'Incoterms', value: 'CIF Mumbai Port' },
    { label: 'Shipment Period', value: '15-Jan-2024 to 30-Jan-2024' },
    { label: 'Port of Loading', value: 'Shanghai Port' },
    { label: 'Port of Discharge', value: 'Mumbai Port' }
  ];

  documents: DocumentRow[] = [
    {
      type: 'Proforma Invoice',
      fileName: 'PI_ABC_001234.pdf',
      uploadedBy: 'Customer Portal',
      uploadDate: '12-Jan-2024'
    },
    {
      type: 'Commercial Invoice',
      fileName: 'CI_ABC_001234.pdf',
      uploadedBy: 'Customer Portal',
      uploadDate: '12-Jan-2024'
    },
    {
      type: 'Packing List',
      fileName: 'PL_ABC_001234.pdf',
      uploadedBy: 'Customer Portal',
      uploadDate: '12-Jan-2024'
    },
    {
      type: 'Certificate of Origin',
      fileName: 'CO_ABC_001234.pdf',
      uploadedBy: 'Customer Portal',
      uploadDate: '12-Jan-2024'
    },
    {
      type: 'Insurance',
      fileName: 'INS_ABC_001234.pdf',
      uploadedBy: 'Customer Portal',
      uploadDate: '12-Jan-2024'
    }
  ];

  comparison: ComparisonRow[] = [
    {
      parameter: 'Invoice Amount',
      requestValue: 'USD 850,000.00',
      documentValue: 'USD 850,000.00',
      matches: true
    },
    {
      parameter: 'Beneficiary Name',
      requestValue: 'Shanghai Industrial Exports Co. Ltd.',
      documentValue: 'Shanghai Industrial Exports Co. Ltd.',
      matches: true
    },
    {
      parameter: 'Goods Description',
      requestValue: 'Industrial Machinery Parts',
      documentValue: 'Industrial Machinery Parts',
      matches: true
    },
    {
      parameter: 'Shipment Period',
      requestValue: '15-Jan-2024 to 30-Jan-2024',
      documentValue: 'Within Period',
      matches: true
    }
  ];

  checklist: ChecklistItem[] = [
    { label: 'Proforma invoice present and readable', checked: true },
    { label: 'Beneficiary details match LC request', checked: true },
    { label: 'Goods description consistent', checked: true },
    { label: 'Amount and currency consistent', checked: true },
    { label: 'No material discrepancies found', checked: false }
  ];

  discrepancy = {
    description: '',
    missingItems: ''
  };

  remarks = {
    tradeRemarks: ''
  };

  routingDecision = 'forward';

  sanctionOverview = {
    totalLimit: 'USD 5,000,000',
    utilizedLimit: 'USD 3,900,000',
    availableLimit: 'USD 1,100,000',
    utilizationPercent: 78,
    status: 'Sufficient'
  };

  exposure = {
    proposedAmount: 'USD 850,000',
    availableAfter: 'USD 250,000',
    withinLimit: true
  };

  eligibility: EligibilityItem[] = [
    { label: 'Import LC', status: 'Allowed', statusClass: 'bg-emerald-100 text-emerald-700' },
    { label: 'PAD', status: 'Allowed', statusClass: 'bg-emerald-100 text-emerald-700' }
  ];

  alertMessage = 'Available limit is nearing threshold. Please review carefully.';

  onForward(color: string): void {
    this.alertMessage = 'Request forwarded to Trade In-Charge for review.';
    this.alertService.showSuccess(this.alertMessage, color);
  }

  onSendBack(color: string): void {
    this.alertMessage = 'Request marked to be returned to customer for correction.';
    this.alertService.showSuccess(this.alertMessage, color);
  }

  onSaveAndContinue(color: string): void {
    this.alertMessage = 'Progress saved. You can continue the handover later.';
    this.alertService.showSuccess(this.alertMessage, color);
  }

  onCancel(color: string): void {
    this.alertMessage = 'No action taken on this handover.';
    this.alertService.showSuccess(this.alertMessage, color);
  }
}
