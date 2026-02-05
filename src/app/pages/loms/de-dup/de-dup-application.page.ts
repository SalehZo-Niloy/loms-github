import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { UiInputComponent } from '../../../components/ui/ui-input.component';
import { UiDropdownComponent } from '../../../components/ui/ui-dropdown.component';
import { UiButtonComponent } from '../../../components/ui/ui-button.component';
import { UiTableComponent } from '../../../components/ui/ui-table.component';

interface DedupSearchParams {
  customerType: 'individual' | 'business';
  nationalId: string;
  dateOfBirth: string;
  fullName: string;
  mobileNumber: string;
  tinNumber: string;
  passportNumber: string;
  fatherName: string;
  motherName: string;
}

interface DedupResult {
  id: string;
  fullName: string;
  customerCode: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  productName: string;
  approvedAmount: string;
  applyStatus: 'approved' | 'pending' | 'active';
  remarks: string;
  nid: string;
}

@Component({
  selector: 'app-loms-de-dup-application-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LomsLayoutComponent,
    UiInputComponent,
    UiDropdownComponent,
    UiButtonComponent,
    UiTableComponent
  ],
  templateUrl: './de-dup-application.page.html',
  styles: [
    `
      :host ::ng-deep input,
      :host ::ng-deep textarea,
      :host ::ng-deep button,
      :host ::ng-deep select {
        border-radius: 0.25rem !important;
      }
    `
  ]
})
export class LomsDedupApplicationPageComponent implements OnInit {
  title = 'De-Duplication Search & Finding';

  customerTypeOptions = [
    { label: 'Individual Customer', value: 'individual' },
    { label: 'Corporate Customer', value: 'business' }
  ];

  searchParams: DedupSearchParams = {
    customerType: 'individual',
    nationalId: '',
    dateOfBirth: '',
    fullName: '',
    mobileNumber: '',
    tinNumber: '',
    passportNumber: '',
    fatherName: '',
    motherName: ''
  };

  matchLogic: 'AND' | 'OR' = 'AND';

  results: DedupResult[] = [
    {
      id: 'CIF-2024-00123-1',
      fullName: 'Mohammed Karim Rahman',
      customerCode: 'CIF-2024-00123',
      fatherName: 'Abdul Rahman',
      motherName: 'Fatima Begum',
      spouseName: 'Ayesha Siddique',
      productName: 'Personal Loan',
      approvedAmount: '+ 5,00,000',
      applyStatus: 'approved',
      remarks: 'Active customer with good repayment history',
      nid: '1985123456789'
    },
    {
      id: 'CIF-2024-00123-2',
      fullName: 'Mohammed Karim Rahman',
      customerCode: 'CIF-2024-00123',
      fatherName: 'Abdul Rahman',
      motherName: 'Fatima Begum',
      spouseName: 'Ayesha Siddique',
      productName: 'Auto Loan',
      approvedAmount: '+ 8,00,000',
      applyStatus: 'pending',
      remarks: 'Pending credit assessment',
      nid: '1985123456790'
    },
    {
      id: 'CIF-2024-00123-3',
      fullName: 'Mohammed K. Rahman',
      customerCode: 'CIF-2024-00123',
      fatherName: 'Abdul Rahman',
      motherName: 'Fatima Begum',
      spouseName: 'Ayesha Siddique',
      productName: 'Credit Card',
      approvedAmount: '+ 1,50,000',
      applyStatus: 'active',
      remarks: 'Multiple active products under same customer code',
      nid: '1985123456791'
    },
    {
      id: 'CIF-2024-00789-1',
      fullName: 'M. Karim Rahman',
      customerCode: 'CIF-2024-00789',
      fatherName: 'Abdul Karim',
      motherName: 'Rahima Khatun',
      spouseName: '',
      productName: 'Home Loan',
      approvedAmount: '+ 25,00,000',
      applyStatus: 'active',
      remarks: 'Partial match with similar identity information',
      nid: '197912345678901'
    },
    {
      id: 'CIF-2024-00789-2',
      fullName: 'Md. Karim Rahman',
      customerCode: 'CIF-2024-00789',
      fatherName: 'Abdul Karim',
      motherName: 'Rahima Khatun',
      spouseName: '',
      productName: 'Personal Loan',
      approvedAmount: '+ 3,00,000',
      applyStatus: 'pending',
      remarks: 'Same identity with different name spelling',
      nid: '197912345678902'
    },
    {
      id: 'CIF-2024-00901-1',
      fullName: 'Sara Ahmed',
      customerCode: 'CIF-2024-00901',
      fatherName: 'Khaled Ahmed',
      motherName: 'Zarina Begum',
      spouseName: 'Tariq Hassan',
      productName: 'Car Loan',
      approvedAmount: '+ 12,00,000',
      applyStatus: 'active',
      remarks: 'Clean repayment history, medium risk profile',
      nid: '199009876543210'
    },
    {
      id: 'CIF-2024-00901-2',
      fullName: 'Sara K. Ahmed',
      customerCode: 'CIF-2024-00901',
      fatherName: 'Khaled Ahmed',
      motherName: 'Zarina Begum',
      spouseName: 'Tariq Hassan',
      productName: 'Personal Loan',
      approvedAmount: '+ 2,50,000',
      applyStatus: 'approved',
      remarks: 'Recent loan with same mobile and NID',
      nid: '199009876543211'
    },
    {
      id: 'CIF-2024-01567-1',
      fullName: 'Md. Imran Hossain',
      customerCode: 'CIF-2024-01567',
      fatherName: 'Abdur Hossain',
      motherName: 'Shirin Akhter',
      spouseName: 'Nusrat Jahan',
      productName: 'Home Loan',
      approvedAmount: '+ 30,00,000',
      applyStatus: 'approved',
      remarks: 'High value customer with collateral',
      nid: '1988067890123'
    },
    {
      id: 'CIF-2024-01567-2',
      fullName: 'Imran Hossain',
      customerCode: 'CIF-2024-01567',
      fatherName: 'Abdur Hossain',
      motherName: 'Shirin Akhter',
      spouseName: 'Nusrat Jahan',
      productName: 'Auto Loan',
      approvedAmount: '+ 9,50,000',
      applyStatus: 'active',
      remarks: 'Secondary product under same CIF code',
      nid: '1988067890124'
    },
    {
      id: 'CIF-2024-02010-1',
      fullName: 'Nazmul Hasan',
      customerCode: 'CIF-2024-02010',
      fatherName: 'Jamal Uddin',
      motherName: 'Rehana Parvin',
      spouseName: '',
      productName: 'Personal Loan',
      approvedAmount: '+ 4,00,000',
      applyStatus: 'pending',
      remarks: 'Verification in progress due to similar identity match',
      nid: '19951230000001'
    },
    {
      id: 'CIF-2024-02010-2',
      fullName: 'Md. Nazmul Hasan',
      customerCode: 'CIF-2024-02010',
      fatherName: 'Jamal Uddin',
      motherName: 'Rehana Parvin',
      spouseName: '',
      productName: 'Credit Card',
      approvedAmount: '+ 80,000',
      applyStatus: 'approved',
      remarks: 'Same NID with different short name',
      nid: '19951230000002'
    },
    {
      id: 'CIF-2024-03025-1',
      fullName: 'Ayesha Siddique',
      customerCode: 'CIF-2024-03025',
      fatherName: 'Mahmudul Hasan',
      motherName: 'Sufia Khatun',
      spouseName: 'Karim Ullah',
      productName: 'Personal Loan',
      approvedAmount: '+ 6,50,000',
      applyStatus: 'active',
      remarks: 'Similar mobile and address to another customer',
      nid: '19920315012345'
    },
    {
      id: 'CIF-2024-03025-2',
      fullName: 'Ayesha S. Karim',
      customerCode: 'CIF-2024-03025',
      fatherName: 'Mahmudul Hasan',
      motherName: 'Sufia Khatun',
      spouseName: 'Karim Ullah',
      productName: 'Home Loan',
      approvedAmount: '+ 18,00,000',
      applyStatus: 'pending',
      remarks: 'Under review for possible duplicate CIF',
      nid: '19920315012346'
    }
  ];

  filteredResults: DedupResult[] = [];

  selectedResultId: string | null = null;

  hasSearched = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length === 0) {
        return;
      }

      this.searchParams = {
        customerType: (params['customerType'] as 'individual' | 'business') || 'individual',
        nationalId: params['nationalId'] || '',
        dateOfBirth: params['dateOfBirth'] || '',
        fullName: params['fullName'] || '',
        mobileNumber: params['mobileNumber'] || '',
        tinNumber: params['tinNumber'] || '',
        passportNumber: params['passportNumber'] || '',
        fatherName: params['fatherName'] || '',
        motherName: params['motherName'] || ''
      };

      this.runSearch();
    });
  }

  get activeLogicTitle(): string {
    return this.matchLogic === 'AND' ? 'AND Logic Active' : 'OR Logic Active';
  }

  get activeLogicDescription(): string {
    if (this.matchLogic === 'AND') {
      return 'Match will be detected only when all entered parameters match exactly with existing records.';
    }
    return 'Match will be detected when any of the entered parameters match existing records.';
  }

  get activeLogicFieldsSummary(): string {
    const activeFields: string[] = [];

    if (this.searchParams.nationalId) {
      activeFields.push('National ID');
    }
    if (this.searchParams.dateOfBirth) {
      activeFields.push('Date of Birth');
    }
    if (this.searchParams.fullName) {
      activeFields.push('Full Name');
    }
    if (this.searchParams.mobileNumber) {
      activeFields.push('Mobile Number');
    }
    if (this.searchParams.tinNumber) {
      activeFields.push('TIN Number');
    }
    if (this.searchParams.passportNumber) {
      activeFields.push('Passport Number');
    }

    if (activeFields.length === 0) {
      return 'Configure search parameters above to see how they will be evaluated for duplicate detection.';
    }

    return activeFields.join(` ${this.matchLogic} `);
  }

  runSearch(): void {
    this.hasSearched = true;
    const criteria = { ...this.searchParams };

    const hasAnyCriteria = Object.values(criteria).some((value) => value && typeof value === 'string' && value.trim() !== '');

    if (!hasAnyCriteria) {
      this.filteredResults = [...this.results];
      this.selectedResultId = null;
      return;
    }

    const matchesField = (fieldValue: string, searchValue: string): boolean => {
      if (!searchValue.trim()) {
        return true;
      }
      return fieldValue.toLowerCase().includes(searchValue.trim().toLowerCase());
    };

    this.filteredResults = this.results.filter((result) => {
      const fieldMatches = [
        matchesField(result.fullName, criteria.fullName),
        matchesField(result.nid, criteria.nationalId),
        matchesField(result.fatherName, criteria.fatherName),
        matchesField(result.motherName, criteria.motherName)
      ];

      if (this.matchLogic === 'AND') {
        return fieldMatches.every((m) => m);
      }
      return fieldMatches.some((m) => m);
    });

    this.selectedResultId = null;
  }

  resetForm(): void {
    this.searchParams = {
      customerType: 'individual',
      nationalId: '',
      dateOfBirth: '',
      fullName: '',
      mobileNumber: '',
      tinNumber: '',
      passportNumber: '',
      fatherName: '',
      motherName: ''
    };
    this.matchLogic = 'AND';
    this.filteredResults = [];
    this.selectedResultId = null;
    this.hasSearched = false;
  }

  selectResult(result: DedupResult): void {
    this.selectedResultId = result.id;
  }

  exportResults(): DedupResult[] {
    return this.filteredResults;
  }

  get selectedResult(): DedupResult | null {
    if (!this.selectedResultId) {
      return null;
    }
    return this.filteredResults.find((r) => r.id === this.selectedResultId) || null;
  }

  get activeFiltersCount(): number {
    const { customerType, ...fields } = this.searchParams;
    return Object.values(fields).filter(
      (value) => value && value.trim() !== ''
    ).length;
  }
}
