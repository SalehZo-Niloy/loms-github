import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';
import Swal from 'sweetalert2';

interface HeaderBadge {
  label: string;
  value: string;
  bgClass: string;
}

interface SnapshotItem {
  label: string;
  value: string;
}

interface EligibilityItem {
  label: string;
  status: 'pass' | 'pending' | 'critical';
}

interface LifecycleItem {
  label: string;
  description: string;
  dateTime: string;
  statusClass: string;
}

interface SwiftItem {
  label: string;
  reference: string;
  valueDate: string;
  amount: string;
}

interface FinancialCard {
  label: string;
  value: string;
  subLabel: string;
  badge?: string;
  bgClass: string;
  accentClass: string;
}

interface RegulatoryCard {
  label: string;
  value: string;
  status: string;
  bgClass: string;
  accentClass: string;
}

interface AuditItem {
  label: string;
  reference: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-guarantee-regulatory-evaluation-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent],
  templateUrl: './regulatory-evaluation.page.html'
})
export class GuaranteeRegulatoryEvaluationPageComponent {
  headerBadges: HeaderBadge[] = [
    {
      label: 'Guarantee Reference',
      value: 'GTR-2024-001234',
      bgClass: 'bg-violet-500 text-white'
    },
    {
      label: 'Guarantee Type',
      value: 'Performance Guarantee',
      bgClass: 'bg-violet-500 text-white'
    },
    {
      label: 'Current Status',
      value: 'Claim Settled',
      bgClass: 'bg-violet-500 text-white'
    },
    {
      label: 'Reportable Event',
      value: 'Claim Settlement',
      bgClass: 'bg-violet-500 text-white'
    },
    {
      label: 'Event Date',
      value: '30-Dec-2024 10:45',
      bgClass: 'bg-violet-500 text-white'
    },
    {
      label: 'Reporting Trigger',
      value: 'Event-based',
      bgClass: 'bg-violet-500 text-white'
    }
  ];

  snapshotItems: SnapshotItem[] = [
    { label: 'Issue Date', value: '15-Jun-2024' },
    { label: 'Expiry Date', value: '31-Dec-2024' },
    { label: 'Claim Period End', value: '30-Jan-2025' },
    { label: 'Guarantee Amount', value: 'USD 750,000' },
    { label: 'Margin Amount', value: 'USD 187,500' },
    { label: 'Commission Amount', value: 'USD 11,250' },
    { label: 'Customer CIF', value: 'CIF-987654321' },
    { label: 'Beneficiary Country', value: 'United States' },
    { label: 'Beneficiary Bank', value: 'Citibank N.A. (CITIAEAD)' }
  ];

  eligibilityItems: EligibilityItem[] = [
    { label: 'Reportable event confirmed', status: 'pass' },
    { label: 'Data completeness verified', status: 'pass' },
    { label: 'Accounting completed', status: 'pass' },
    { label: 'SWIFT acknowledgements received', status: 'pass' },
    { label: 'Regulatory thresholds evaluated', status: 'pass' }
  ];

  lifecycleItems: LifecycleItem[] = [
    {
      label: 'Guarantee Issued',
      description: 'MT760 - Guarantee Issuance',
      dateTime: '15-Jun-2024 09:30',
      statusClass: 'border-emerald-200 bg-emerald-50 text-emerald-800'
    },
    {
      label: 'Amendment Processed',
      description: 'MT767 - Amount Increase',
      dateTime: '15-Sep-2024 14:20',
      statusClass: 'border-blue-200 bg-blue-50 text-blue-800'
    },
    {
      label: 'Payment Executed',
      description: 'MT202 - Payment Execution',
      dateTime: '30-Dec-2024 10:47',
      statusClass: 'border-amber-200 bg-amber-50 text-amber-800'
    },
    {
      label: 'Guarantee Closed',
      description: 'Lifecycle Completed • Settled',
      dateTime: '30-Dec-2024 10:50',
      statusClass: 'border-slate-200 bg-slate-50 text-slate-800'
    }
  ];

  swiftItems: SwiftItem[] = [
    {
      label: 'MT760 - Issuance Summary',
      reference: 'SWIFT-760-2024-001234',
      valueDate: '15-Jun-2024',
      amount: 'USD 500,000'
    },
    {
      label: 'MT767 - Amendment Summary',
      reference: 'SWIFT-767-2024-001234',
      valueDate: '15-Sep-2024',
      amount: 'Increase USD 250,000'
    }
  ];

  financialCards: FinancialCard[] = [
    {
      label: 'Off-Balance Sheet Exposure',
      value: 'USD 750,000',
      subLabel: 'Final guarantee amount',
      badge: 'Reported',
      bgClass: 'bg-orange-50',
      accentClass: 'text-orange-700'
    },
    {
      label: 'Utilized Guarantee Limit',
      value: 'USD 750,000',
      subLabel: 'Including latest amendment',
      bgClass: 'bg-sky-50',
      accentClass: 'text-sky-700'
    },
    {
      label: 'Available Guarantee Limit',
      value: 'USD 4,250,000',
      subLabel: 'Post-adjustment balance',
      bgClass: 'bg-emerald-50',
      accentClass: 'text-emerald-700'
    }
  ];

  regulatoryCards: RegulatoryCard[] = [
    {
      label: 'Central Bank Regulation',
      value: 'CBUAE - Trade Finance Guidelines',
      status: 'Section 4.2 • Compliant',
      bgClass: 'bg-emerald-50',
      accentClass: 'text-emerald-700'
    },
    {
      label: 'FX Regulation Applicability',
      value: 'Cross-Border',
      status: 'USD jurisdiction reporting required',
      bgClass: 'bg-sky-50',
      accentClass: 'text-sky-700'
    },
    {
      label: 'Large Exposure Threshold',
      value: 'Below Threshold',
      status: '< 15% of capital base',
      bgClass: 'bg-amber-50',
      accentClass: 'text-amber-700'
    },
    {
      label: 'Country Risk',
      value: 'Low Risk',
      status: 'United States • Category A',
      bgClass: 'bg-violet-50',
      accentClass: 'text-violet-700'
    },
    {
      label: 'Sector Classification',
      value: 'Infrastructure / Construction',
      status: 'Standard',
      bgClass: 'bg-indigo-50',
      accentClass: 'text-indigo-700'
    },
    {
      label: 'Reporting Frequency Rule',
      value: 'Event-based',
      status: 'Triggered by claim settlement',
      bgClass: 'bg-lime-50',
      accentClass: 'text-lime-700'
    }
  ];

  auditItems: AuditItem[] = [
    {
      label: 'Issuance Report - Jun 2024',
      reference: 'REG-2024-06-001234',
      date: 'Jun 2024',
      status: 'Filed'
    },
    {
      label: 'Amendment Report - Sep 2024',
      reference: 'REG-2024-09-001234',
      date: 'Sep 2024',
      status: 'Filed'
    },
    {
      label: 'Exception History',
      reference: 'None',
      date: 'Q4 2024',
      status: 'Clean'
    }
  ];

  submitToRegulator(): void {
    Swal.fire({
      title: 'Submit to Regulator?',
      text: 'This will confirm that the reporting pack has been submitted to the regulator.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, submit'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Submitted',
          text: 'Reporting status is now marked as submitted to the regulator.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false
        });
      }
    });
  }
}

