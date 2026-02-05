import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type BusinessLine = 'Retail' | 'SME' | 'Credit Card';
type InterestType = 'Fixed' | 'Floating' | 'Tiered';
type PersonaType = 'Applicant' | 'Co-applicant';
type WorkflowStage = 'Initial' | 'Credit Risk' | 'Post Approval' | 'Post Disbursement' | 'ALL';
type RequiredFlag = 'Yes' | 'No';
type ChargeTypeKind = 'Flat' | 'Rate';
type ChargeApplicability = 'Always' | 'Conditional';
type RepaymentType = 'EMI' | 'Equal Principal' | 'Revolving';

@Component({
  selector: 'app-loms-product-wizard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent, RouterLink],
  templateUrl: './product-wizard.page.html'
})
export class LomsProductWizardPageComponent {
  steps = [
    { id: 1, label: 'Attributes' },
    { id: 2, label: 'Segments' },
    { id: 3, label: 'Documents' },
    { id: 4, label: 'Security' },
    { id: 5, label: 'Terms & Charges' },
    { id: 6, label: 'Review' }
  ];

  activeStep = 1;

  businessLines: BusinessLine[] = ['Retail', 'SME', 'Credit Card'];
  interestTypes: InterestType[] = ['Fixed', 'Floating', 'Tiered'];

  segments = ['Mass', 'NRB', 'Affluent', 'SME Micro', 'SME Medium', 'Student'];

  securityTypes = ['Cash', 'FDR', 'Vehicle', 'Property'];

  personaTypes: PersonaType[] = ['Applicant', 'Co-applicant'];
  workflowStages: WorkflowStage[] = ['Initial', 'Credit Risk', 'Post Approval', 'Post Disbursement', 'ALL'];
  requiredOptions: RequiredFlag[] = ['Yes', 'No'];
  repaymentTypes: RepaymentType[] = ['EMI', 'Equal Principal', 'Revolving'];
  chargeTypeKinds: ChargeTypeKind[] = ['Flat', 'Rate'];
  chargeApplicabilities: ChargeApplicability[] = ['Always', 'Conditional'];

  documentTypes: string[] = ['NID/Passport', 'Birth Certificate', 'TIN Certificate', 'Trade License', 'Utility Bill'];
  chargeTypes: string[] = ['Application Fee', 'Processing Fee', 'CIV Charge', 'CPV Charge', 'Stamp Fee', 'Documentation Fee'];

  selectedBusinessLine: BusinessLine | '' = '';
  productCode = '';
  productName = '';
  selectedProductType = '';
  selectedCurrency = '';
  selectedInterestType: InterestType | '' = '';
  description = '';

  channelBranch = false;
  channelDigital = false;
  channelAgent = false;

  selectedSegment = '';
  selectedGender = 'Any';
  coApplicantRequired = 'None';
  guarantorRequired = 'None';

  personaSalaried = false;
  personaSelfEmployed = false;
  personaBusinessOwner = false;
  personaFreelancer = false;
  personaStudent = false;

  minAge = '';
  maxAge = '';
  minimumIncome = '';
  businessVintageMonths = '';

  minLoanAmount = '';
  maxLoanAmount = '';
  minTenorMonths = '';
  maxTenorMonths = '';

  interestRate = '';
  penalInterestRate = '';
  insuranceRequired: RequiredFlag | '' = '';

  securities: {
    securityType: string;
    valuationRequired: RequiredFlag | '';
    margin: string;
    ltv: string;
  }[] = [];

  documents: {
    documentType: string;
    personaType: PersonaType | '';
    workflowStage: WorkflowStage | '';
    required: RequiredFlag | '';
    conditionalRule: string;
    notes: string;
  }[] = [];

  charges: {
    chargeType: string;
    type: ChargeTypeKind | '';
    amountOrRate: string;
    vat: RequiredFlag | '';
    applicability: ChargeApplicability | '';
    mandatory: RequiredFlag | '';
  }[] = [];

  mandatoryPending = 0;

  selectedRepaymentType: RepaymentType | '' = '';

  setActiveStep(step: number): void {
    this.activeStep = step;
  }

  next(): void {
    if (this.activeStep < this.steps.length) {
      this.activeStep += 1;
    }
  }

  previous(): void {
    if (this.activeStep > 1) {
      this.activeStep -= 1;
    }
  }

  addDocument(): void {
    this.documents.push({
      documentType: '',
      personaType: '',
      workflowStage: '',
      required: '',
      conditionalRule: '',
      notes: ''
    });
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
  }

  addSecurity(): void {
    this.securities.push({
      securityType: '',
      valuationRequired: '',
      margin: '',
      ltv: ''
    });
  }

  removeSecurity(index: number): void {
    this.securities.splice(index, 1);
  }

  addCharge(): void {
    this.charges.push({
      chargeType: '',
      type: '',
      amountOrRate: '',
      vat: '',
      applicability: '',
      mandatory: ''
    });
  }

  removeCharge(index: number): void {
    this.charges.splice(index, 1);
  }

  getSelectedChannels(): string {
    const channels: string[] = [];
    if (this.channelBranch) {
      channels.push('Branch');
    }
    if (this.channelDigital) {
      channels.push('Digital');
    }
    if (this.channelAgent) {
      channels.push('Agent');
    }
    return channels.join(', ');
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('loms_products');
      if (!stored) {
        const seed = [
          {
            code: 'RET_HOME_LOAN',
            name: 'Retail Home Loan',
            businessLine: 'Retail',
            version: 1,
            status: 'Approved',
            updatedOn: '2026-02-03'
          },
          {
            code: 'SME_TERM_LOAN',
            name: 'SME Growth Loan',
            businessLine: 'SME',
            version: 1,
            status: 'Draft',
            updatedOn: '2026-02-03'
          },
          {
            code: 'CC_PLATINUM',
            name: 'Platinum Credit Card',
            businessLine: 'Credit Card',
            version: 1,
            status: 'Submitted',
            updatedOn: '2026-02-03'
          }
        ];
        window.localStorage.setItem('loms_products', JSON.stringify(seed));
      }
    }

    const mode = this.route.snapshot.queryParamMap.get('mode');
    const code = this.route.snapshot.queryParamMap.get('code');
    if (mode === 'clone' && code && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('loms_products');
      if (stored) {
        try {
          const products = JSON.parse(stored) as {
            code: string;
            name: string;
            businessLine: BusinessLine;
          }[];
          const base = products.find(p => p.code === code);
          if (base) {
            this.selectedBusinessLine = base.businessLine;
            this.productCode = base.code;
            this.productName = base.name;
          }
        } catch {
        }
      }
    }
  }

  getSelectedPersonas(): string {
    const personas: string[] = [];
    if (this.personaSalaried) {
      personas.push('Salaried');
    }
    if (this.personaSelfEmployed) {
      personas.push('Self-employed');
    }
    if (this.personaBusinessOwner) {
      personas.push('Business Owner');
    }
    if (this.personaFreelancer) {
      personas.push('Freelancer');
    }
    if (this.personaStudent) {
      personas.push('Student');
    }
    return personas.join(', ');
  }

  submitForApproval(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem('loms_products');
    let products: {
      code: string;
      name: string;
      businessLine: BusinessLine;
      version: number;
      status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
      updatedOn: string;
    }[] = [];

    if (stored) {
      try {
        products = JSON.parse(stored);
      } catch {
        products = [];
      }
    }

    const existingForCode = products.filter(p => p.code === this.productCode);
    const maxVersion = existingForCode.reduce((max, p) => (p.version > max ? p.version : max), 0);
    const nextVersion = maxVersion > 0 ? maxVersion + 1 : 1;

    const today = new Date().toLocaleDateString('en-US');

    const newProduct = {
      code: this.productCode || 'NEW_PRODUCT',
      name: this.productName || 'New Product',
      businessLine: (this.selectedBusinessLine || 'Retail') as BusinessLine,
      version: nextVersion,
      status: 'Submitted' as const,
      updatedOn: today
    };

    products.unshift(newProduct);
    window.localStorage.setItem('loms_products', JSON.stringify(products));
    this.router.navigate(['/loms', 'product']);
  }
}
