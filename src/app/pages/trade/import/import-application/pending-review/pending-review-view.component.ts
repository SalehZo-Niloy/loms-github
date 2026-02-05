import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface SummaryItem {
  label: string;
  value: string;
}

interface PolicyItem {
  label: string;
  note: string;
  checked: boolean;
}

interface DocumentItem {
  name: string;
  fileName: string;
  size: string;
  verified: boolean;
}

@Component({
  selector: 'app-pending-review-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './pending-review-view.component.html',
})
export class PendingReviewViewComponent {
  header = {
    title: 'Review & Approve Import LC',
    subtitle: 'Final business and policy approval before LC opening',
    status: 'Pending Trade Approval'
  };

  breadcrumbInfo = {
    reference: 'LC-2024-001',
    customer: 'Acme Corp Ltd.',
    lcType: 'Sight LC',
    submissionDate: 'Jan 13, 2024'
  };

  summary: SummaryItem[] = [
    { label: 'Invoice Amount', value: '$125,000.00 USD' },
    { label: 'Beneficiary Name', value: 'Global Exports Inc.' },
    { label: 'Beneficiary Country', value: 'United States' },
    { label: 'Incoterms', value: 'FOB' },
    { label: 'Shipment Period', value: 'Feb 15, 2024 - Mar 15, 2024' },
    { label: 'Port of Loading', value: 'Los Angeles, USA' },
    { label: 'Port of Discharge', value: 'Karachi, Pakistan' },
    {
      label: 'Description of Goods',
      value:
        'Industrial machinery parts and components as per proforma invoice PI-2024-0056'
    }
  ];

  policyChecklist: PolicyItem[] = [
    {
      label: 'Customer within approved trade profile',
      note: 'Trade limit verified and sufficient',
      checked: true
    },
    {
      label: 'Goods permissible under policy',
      note: 'Classification matches approved categories',
      checked: true
    },
    {
      label: 'Country risk acceptable',
      note: 'Beneficiary country within risk parameters',
      checked: true
    },
    {
      label: 'Amount within approved limits',
      note: 'LC value complies with facility limits',
      checked: true
    },
    {
      label: 'No compliance red flags',
      note: 'AML/CFT screening completed',
      checked: true
    }
  ];

  roSnapshot = {
    status: 'Validated',
    validatedBy: 'Sarah Johnson',
    role: 'Relationship Officer',
    validatedDate: 'Jan 13, 2024 10:45 AM',
    remarks:
      'All documents verified and found complete. Customer has excellent track record with 15+ successful LC transactions. Goods classification confirmed as permissible under trade policy. Recommend approval.',
    checklistStatus: 'All validation checks completed successfully'
  };

  documents: DocumentItem[] = [
    {
      name: 'Proforma Invoice',
      fileName: 'PI-2024-0056.pdf',
      size: '245 KB',
      verified: true
    },
    {
      name: 'Purchase Order',
      fileName: 'PO-2024-0123.pdf',
      size: '182 KB',
      verified: true
    },
    {
      name: 'Import License',
      fileName: 'IL-2024-0089.pdf',
      size: '156 KB',
      verified: true
    },
    {
      name: 'Trade Agreement',
      fileName: 'TA-2024-0034.pdf',
      size: '312 KB',
      verified: true
    }
  ];

  tradeRemarks = '';
  decision = 'approve';

  onSaveAndContinue(): void {
    Swal.fire({
      title: 'Progress Saved',
      text: 'Review has been saved. You can continue later.',
      icon: 'success',
      confirmButtonColor: '#4b5563',
      confirmButtonText: 'OK',
    });
  }

  onReject(): void {
    Swal.fire({
      title: 'Request Rejected',
      text: 'Import LC request has been rejected and returned with remarks.',
      icon: 'success',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'OK',
    });
  }

  onApprove(): void {
    Swal.fire({
      title: 'Request Approved',
      text: 'Import LC request has been approved and forwarded to Trade Officer.',
      icon: 'success',
      confirmButtonColor: '#059669',
      confirmButtonText: 'OK',
    });
  }
}
