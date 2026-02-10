import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../../styles/layout/loms-layout.component';
import Swal from 'sweetalert2';

type DisbursementStatus =
  | 'Not Dispatched'
  | 'Dispatched'
  | 'Delivered'
  | 'Not Delivered'
  | 'Returned'
  | 'Re-Dispatched';

type CardStatus = 'Issued' | 'Approved';

type DeliveryMode = 'Branch Pickup' | 'Courier' | 'Postal Service' | 'Hand Delivery';

type IssuanceChannel = 'Branch' | 'Online' | 'Call Center' | 'Campaign';

interface CardDisbursementRow {
  id: string;
  customerName: string;
  maskedCardNumber: string;
  cardNetwork: string;
  productType: string;
  approvalDate: string;
  issuanceDate: string;
  dispatchDate: string;
  deliveryDate: string;
  deliveryMode: DeliveryMode;
  disbursementStatus: DisbursementStatus;
  cardStatus: CardStatus;
  branchRegion: string;
  issuanceChannel: IssuanceChannel;
}

@Component({
  selector: 'app-loms-card-disbursement-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './card-disbursement.page.html'
})
export class LomsCardDisbursementPageComponent {
  businessDate = '15 January 2025';
  cardNetwork = 'Visa';
  issuingBin = '456789';

  dateType = 'Issuance Date';
  fromDate = '';
  toDate = '';
  disbursementStatusFilter = 'All';
  deliveryModeFilter = 'All';
  productTypeFilter = 'All';
  issuanceChannelFilter = 'All';
  branchRegionFilter = 'All Branches';

  bulkStatus = '';
  bulkDeliveryMode = '';

  uploadStatusVisible = false;
  uploadCount = 0;

  allRows: CardDisbursementRow[] = [
    {
      id: 'APP-2025-001234',
      customerName: 'Md. Rafiqul Islam',
      maskedCardNumber: '**** 4521',
      cardNetwork: 'Visa',
      productType: 'Gold',
      approvalDate: '2025-01-10',
      issuanceDate: '2025-01-12',
      dispatchDate: '2025-01-13',
      deliveryDate: '2025-01-14',
      deliveryMode: 'Courier',
      disbursementStatus: 'Delivered',
      cardStatus: 'Issued',
      branchRegion: 'Dhaka North',
      issuanceChannel: 'Branch'
    },
    {
      id: 'APP-2025-001235',
      customerName: 'Ayesha Islam',
      maskedCardNumber: '**** 8932',
      cardNetwork: 'Visa',
      productType: 'Platinum',
      approvalDate: '2025-01-11',
      issuanceDate: '2025-01-13',
      dispatchDate: '2025-01-14',
      deliveryDate: '2025-01-15',
      deliveryMode: 'Branch Pickup',
      disbursementStatus: 'Dispatched',
      cardStatus: 'Issued',
      branchRegion: 'Dhaka South',
      issuanceChannel: 'Branch'
    },
    {
      id: 'APP-2025-001236',
      customerName: 'Kamal Rahman',
      maskedCardNumber: '**** 2145',
      cardNetwork: 'Visa',
      productType: 'Classic',
      approvalDate: '2025-01-09',
      issuanceDate: '2025-01-11',
      dispatchDate: '2025-01-12',
      deliveryDate: '2025-01-13',
      deliveryMode: 'Postal Service',
      disbursementStatus: 'Not Dispatched',
      cardStatus: 'Approved',
      branchRegion: 'Chattogram',
      issuanceChannel: 'Online'
    },
    {
      id: 'APP-2025-001237',
      customerName: 'Farzana Haque',
      maskedCardNumber: '**** 7823',
      cardNetwork: 'Visa',
      productType: 'Gold',
      approvalDate: '2025-01-12',
      issuanceDate: '2025-01-14',
      dispatchDate: '2025-01-15',
      deliveryDate: '2025-01-16',
      deliveryMode: 'Courier',
      disbursementStatus: 'Not Delivered',
      cardStatus: 'Issued',
      branchRegion: 'Sylhet',
      issuanceChannel: 'Campaign'
    }
  ];

  rows: CardDisbursementRow[] = [];

  selectedIds = new Set<string>();

  constructor(private router: Router) {
    this.rows = [...this.allRows];
  }

  get totalRecords(): number {
    return this.rows.length;
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get canApplyBulk(): boolean {
    return this.selectedIds.size > 0 && !!this.bulkStatus && !!this.bulkDeliveryMode;
  }

  isAllSelected(): boolean {
    return this.selectedIds.size > 0 && this.selectedIds.size === this.rows.length;
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.rows.forEach(row => this.selectedIds.add(row.id));
    } else {
      this.selectedIds.clear();
    }
  }

  toggleRowSelection(id: string, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  private matchesDateFilter(row: CardDisbursementRow): boolean {
    if (!this.fromDate && !this.toDate) {
      return true;
    }

    let value = row.issuanceDate;
    if (this.dateType === 'Approval Date') {
      value = row.approvalDate;
    } else if (this.dateType === 'Dispatch Date') {
      value = row.dispatchDate;
    } else if (this.dateType === 'Delivery Date') {
      value = row.deliveryDate;
    }

    const rowDate = new Date(value);
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    if (from && rowDate < from) {
      return false;
    }

    if (to && rowDate > to) {
      return false;
    }

    return true;
  }

  onSearch(): void {
    this.selectedIds.clear();

    this.rows = this.allRows.filter(row => {
      if (!this.matchesDateFilter(row)) {
        return false;
      }

      if (this.disbursementStatusFilter !== 'All' && row.disbursementStatus !== this.disbursementStatusFilter) {
        return false;
      }

      if (this.deliveryModeFilter !== 'All' && row.deliveryMode !== this.deliveryModeFilter) {
        return false;
      }

      if (this.productTypeFilter !== 'All' && row.productType !== this.productTypeFilter) {
        return false;
      }

      if (this.issuanceChannelFilter !== 'All' && row.issuanceChannel !== this.issuanceChannelFilter) {
        return false;
      }

      if (this.branchRegionFilter !== 'All Branches' && row.branchRegion !== this.branchRegionFilter) {
        return false;
      }

      return true;
    });
  }

  onReset(): void {
    this.dateType = 'Issuance Date';
    this.fromDate = '';
    this.toDate = '';
    this.disbursementStatusFilter = 'All';
    this.deliveryModeFilter = 'All';
    this.productTypeFilter = 'All';
    this.issuanceChannelFilter = 'All';
    this.branchRegionFilter = 'All Branches';
    this.selectedIds.clear();
    this.rows = [...this.allRows];
  }

  onExcelUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.uploadCount = 100;
    this.uploadStatusVisible = true;
    input.value = '';
  }

  async onApplyBulkUpdate(): Promise<void> {
    if (!this.canApplyBulk) {
      return;
    }

    const count = this.selectedIds.size;

    const result = await Swal.fire({
      title: 'Confirm bulk update?',
      text: `Apply status "${this.bulkStatus}" and delivery mode "${this.bulkDeliveryMode}" to ${count} selected record(s).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Apply'
    });

    if (!result.isConfirmed) {
      return;
    }

    this.rows = this.rows.map(row => {
      if (this.selectedIds.has(row.id)) {
        return {
          ...row,
          disbursementStatus: this.bulkStatus as DisbursementStatus,
          deliveryMode: this.bulkDeliveryMode as DeliveryMode
        };
      }
      return row;
    });

    this.allRows = this.allRows.map(row => {
      if (this.selectedIds.has(row.id)) {
        return {
          ...row,
          disbursementStatus: this.bulkStatus as DisbursementStatus,
          deliveryMode: this.bulkDeliveryMode as DeliveryMode
        };
      }
      return row;
    });

    await Swal.fire({
      title: 'Bulk update applied',
      text: `Successfully updated ${count} record(s).`,
      icon: 'success',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'OK'
    });
  }

  async onViewDetails(row: CardDisbursementRow): Promise<void> {
    await Swal.fire({
      title: 'Disbursement details',
      html: `
        <div class="tf-swal-details">
          <div><strong>Application ID:</strong> ${row.id}</div>
          <div><strong>Customer:</strong> ${row.customerName}</div>
          <div><strong>Card:</strong> ${row.maskedCardNumber} (${row.cardNetwork} ${row.productType})</div>
          <div><strong>Delivery mode:</strong> ${row.deliveryMode}</div>
          <div><strong>Disbursement status:</strong> ${row.disbursementStatus}</div>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Close'
    });
  }

  async onBackToDashboard(): Promise<void> {
    this.router.navigate(['/loms', 'card-operation', 'application']);
  }
}

