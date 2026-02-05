import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UiButtonComponent } from '../../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../../styles/layout/trade-layout.component';

interface ReferenceItem {
  label: string;
  value: string;
}

interface NotificationItem {
  label: string;
  value: string;
  accent?: string;
}

interface DiscrepancyItem {
  title: string;
  description: string;
  severity: 'Critical' | 'Minor';
}

interface SummaryCard {
  label: string;
  value: number;
  accent: string;
}

interface ChecklistItem {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-discrepancy-record-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, TradeLayoutComponent, UiButtonComponent],
  templateUrl: './discrepancy-record-notification.component.html',
})
export class DiscrepancyRecordNotificationComponent {
  constructor(private router: Router) {}

  header = {
    title: 'Customer Discrepancy Response Handling',
    subtitle: 'Process customer decision on Import LC discrepancy notification',
    status: 'Awaiting Customer Confirmation',
    officer: 'Sarah Johnson',
    session: '2024-01-20 14:30',
  };

  referenceInfo: ReferenceItem[] = [
    { label: 'LC Reference Number', value: 'LC240120001' },
    { label: 'Issue Date', value: '15-Jan-2024' },
    { label: 'Beneficiary Name', value: 'Global Export Solutions Ltd.' },
    { label: 'Document Presentation Date', value: '18-Jan-2024' },
    { label: 'LC Amount', value: 'USD 250,000.00' },
    { label: 'Expiry Date', value: '28-Feb-2024' },
  ];

  notificationDetails: NotificationItem[] = [
    { label: 'Notification Sent', value: '19-Jan-2024 09:30 AM' },
    { label: 'Mode of Notification', value: 'Portal + Email + SWIFT' },
    {
      label: 'Response Deadline',
      value: '24-Jan-2024 (5 banking days)',
      accent: 'text-rose-600',
    },
  ];

  summaryCards: SummaryCard[] = [
    { label: 'Critical', value: 2, accent: 'text-rose-600' },
    { label: 'Minor', value: 1, accent: 'text-amber-600' },
    { label: 'Total', value: 3, accent: 'text-slate-600' },
  ];

  discrepancies: DiscrepancyItem[] = [
    {
      title: 'Invoice date exceeds shipment date',
      description: 'Invoice dated 20-Jan-2024 while B/L shows shipment on 19-Jan-2024',
      severity: 'Critical',
    },
    {
      title: 'Missing insurance certificate',
      description: 'Required insurance document not presented with shipment documents',
      severity: 'Critical',
    },
    {
      title: 'Minor spelling error in consignee name',
      description: '"Acme Corp" instead of "ACME Corporation" on commercial invoice',
      severity: 'Minor',
    },
  ];

  verificationChecklist: ChecklistItem[] = [
    { label: 'Customer identity verified through secure channel', checked: false },
    { label: 'Customer instruction clearly recorded and documented', checked: false },
    { label: 'Waiver/rejection aligns with original notification', checked: false },
    { label: 'Action complies with UCP 600 & bank policy', checked: false },
  ];

  decision = '';

  get canConfirm(): boolean {
    const allChecked = this.verificationChecklist.every((item) => item.checked);
    return Boolean(this.decision) && allChecked;
  }

  get showSettlementRoute(): boolean {
    return this.decision === 'accept';
  }

  get showRejectRoute(): boolean {
    return this.decision === 'reject';
  }

  confirmDecision() {
    if (!this.canConfirm) {
      return;
    }

    if (this.decision === 'accept') {
      this.router.navigate(['/trade/import/lc-settlement-decision']);
      return;
    }

    if (this.decision === 'reject') {
      this.router.navigate(['/trade/import/discrepancy-record/reject']);
    }
  }

  goBack() {
    this.router.navigate(['/trade/import/discrepancy-record']);
  }
}
