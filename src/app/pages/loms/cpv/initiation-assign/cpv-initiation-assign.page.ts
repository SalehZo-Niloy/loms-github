import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../../styles/layout/loms-layout.component';

interface CpvRequestRow {
  id: string;
  cpvType: string;
  persona: string;
  action: 'Forward' | 'Hold';
  forwardTo: string;
  status: 'Pending';
  selected: boolean;
}

@Component({
  selector: 'app-cpv-initiation-assign-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './cpv-initiation-assign.page.html'
})
export class CpvInitiationAssignPageComponent implements OnInit {
  applicationId = 'LN-2024-001234';
  requestedLoanAmount = '৳ 5,00,000';
  productType = 'Personal Loan';

  bulkAction: 'Forward' | 'Hold' | 'None' = 'None';
  bulkForwardTo = '';

  cpvRows: CpvRequestRow[] = [
    {
      id: 'applicant-contact',
      cpvType: 'Contact Number Verification (Applicant)',
      persona: 'Applicant',
      action: 'Forward',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'guarantor-contact',
      cpvType: 'Contact Number Verification (Guarantor)',
      persona: 'Guarantor',
      action: 'Forward',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'nominee-contact',
      cpvType: 'Contact Number Verification (Nominee)',
      persona: 'Nominee',
      action: 'Forward',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'address-verification',
      cpvType: 'Address Verification',
      persona: 'Applicant',
      action: 'Forward',
      forwardTo: '',
      status: 'Pending',
      selected: false
    },
    {
      id: 'profession-verification',
      cpvType: 'Profession Verification',
      persona: 'Applicant',
      action: 'Forward',
      forwardTo: '',
      status: 'Pending',
      selected: false
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('applicationId');
      if (id) {
        this.applicationId = id;
      }
    });
  }

  toggleAll(selected: boolean): void {
    this.cpvRows = this.cpvRows.map((row) => ({
      ...row,
      selected
    }));
  }

  applyBulk(): void {
    this.cpvRows = this.cpvRows.map((row) => {
      if (!row.selected) {
        return row;
      }

      const updated: CpvRequestRow = { ...row };

      if (this.bulkAction === 'Forward') {
        updated.action = 'Forward';
      } else if (this.bulkAction === 'Hold') {
        updated.action = 'Hold';
      }

      if (this.bulkForwardTo) {
        updated.forwardTo = this.bulkForwardTo;
      }

      return updated;
    });
  }

  navigateBackToDashboard(): void {
    this.router.navigate(['/loms', 'cpv', 'dashboard']);
  }
}

