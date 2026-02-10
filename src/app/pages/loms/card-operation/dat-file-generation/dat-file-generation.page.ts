import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../../styles/layout/loms-layout.component';
import Swal from 'sweetalert2';

interface DatApplicationRow {
  id: string;
  customerName: string;
  cardNetwork: string;
  productType: string;
  approvalDate: string;
  issuanceDate: string;
  creditLimit: string;
  status: 'Issued' | 'Approved';
  customerType: 'Individual' | 'Corporate';
  issuanceChannel: 'Branch' | 'Online' | 'Call Center';
  branchRegion: string;
}

@Component({
  selector: 'app-loms-dat-file-generation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './dat-file-generation.page.html'
})
export class LomsDatFileGenerationPageComponent {
  processingDate = '15 January 2025';
  cardNetwork = 'Visa';
  issuingBin = '456789';
  datVersion = 'v3.2';

  dateType = 'Issuance Date';
  fromDate = '';
  toDate = '';
  cardStatus = 'All';
  networkFilter = 'All';
  productType = 'All';
  customerType = 'All';
  issuanceChannel = 'All';
  branchRegion = 'All Branches';

  filingMode: 'single' | 'batch' = 'batch';
  batchReferenceNumber = 'BATCH-2025-001';
  fileNamingConvention = 'System Generated';
  fileName = 'DAT_VISA_20250115.dat';
  fileFormat = 'DAT';

  allApplications: DatApplicationRow[] = [
    {
      id: 'APP-2025-001234',
      customerName: 'Md. Rafiqul Islam',
      cardNetwork: 'Visa',
      productType: 'Gold',
      approvalDate: 'Jan 10, 2025',
      issuanceDate: 'Jan 12, 2025',
      creditLimit: 'BDT 150,000',
      status: 'Issued',
      customerType: 'Individual',
      issuanceChannel: 'Branch',
      branchRegion: 'Dhaka'
    },
    {
      id: 'APP-2025-001235',
      customerName: 'Ayesha Islam',
      cardNetwork: 'Visa',
      productType: 'Platinum',
      approvalDate: 'Jan 11, 2025',
      issuanceDate: 'Jan 13, 2025',
      creditLimit: 'BDT 250,000',
      status: 'Issued',
      customerType: 'Individual',
      issuanceChannel: 'Branch',
      branchRegion: 'Dhaka'
    },
    {
      id: 'APP-2025-001236',
      customerName: 'Kamal Rahman',
      cardNetwork: 'Visa',
      productType: 'Classic',
      approvalDate: 'Jan 09, 2025',
      issuanceDate: 'Jan 11, 2025',
      creditLimit: 'BDT 80,000',
      status: 'Approved',
      customerType: 'Individual',
      issuanceChannel: 'Online',
      branchRegion: 'Chattogram'
    },
    {
      id: 'APP-2025-001237',
      customerName: 'Farzana Haque',
      cardNetwork: 'Visa',
      productType: 'Gold',
      approvalDate: 'Jan 12, 2025',
      issuanceDate: 'Jan 14, 2025',
      creditLimit: 'BDT 185,000',
      status: 'Issued',
      customerType: 'Individual',
      issuanceChannel: 'Branch',
      branchRegion: 'Sylhet'
    },
    {
      id: 'APP-2025-001238',
      customerName: 'Rahman Traders Ltd.',
      cardNetwork: 'Visa',
      productType: 'Platinum',
      approvalDate: 'Jan 13, 2025',
      issuanceDate: 'Jan 15, 2025',
      creditLimit: 'BDT 300,000',
      status: 'Issued',
      customerType: 'Corporate',
      issuanceChannel: 'Call Center',
      branchRegion: 'Dhaka'
    }
  ];

  applications: DatApplicationRow[] = [];

  selectedIds = new Set<string>();

  constructor(private router: Router) {
    this.applications = [...this.allApplications];
  }

  get totalRecords(): number {
    return this.applications.length;
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get recordCount(): number {
    return this.selectedIds.size;
  }

  isAllSelected(): boolean {
    return this.selectedIds.size > 0 && this.selectedIds.size === this.applications.length;
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.applications.forEach(row => this.selectedIds.add(row.id));
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

  onSearch(): void {
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    this.selectedIds.clear();

    this.applications = this.allApplications.filter(row => {
      const dateValue = this.dateType === 'Approval Date' ? row.approvalDate : row.issuanceDate;
      const rowDate = new Date(dateValue);

      if (from && rowDate < from) {
        return false;
      }

      if (to && rowDate > to) {
        return false;
      }

      if (this.cardStatus !== 'All' && row.status !== this.cardStatus) {
        return false;
      }

      if (this.networkFilter !== 'All' && row.cardNetwork !== this.networkFilter) {
        return false;
      }

      if (this.productType !== 'All' && row.productType !== this.productType) {
        return false;
      }

      if (this.customerType !== 'All' && row.customerType !== this.customerType) {
        return false;
      }

      if (this.issuanceChannel !== 'All' && row.issuanceChannel !== this.issuanceChannel) {
        return false;
      }

      if (this.branchRegion !== 'All Branches' && row.branchRegion !== this.branchRegion) {
        return false;
      }

      return true;
    });
  }

  onReset(): void {
    this.dateType = 'Issuance Date';
    this.fromDate = '';
    this.toDate = '';
    this.cardStatus = 'All';
    this.networkFilter = 'All';
    this.productType = 'All';
    this.customerType = 'All';
    this.issuanceChannel = 'All';
    this.branchRegion = 'All Branches';
    this.selectedIds.clear();
    this.applications = [...this.allApplications];
  }

  get canExport(): boolean {
    return this.selectedIds.size > 0;
  }

  getExportFileName(): string {
    return this.fileName;
  }

  getExportAppIds(): string {
    return Array.from(this.selectedIds).join(', ');
  }

  getExportContentPreview(): string {
    const header = `HDR|${this.cardNetwork.toUpperCase()}|${this.issuingBin}|20250115|${this.recordCount}|${this.datVersion}`;
    if (!this.selectedIds.size) {
      return header;
    }
    const rows = this.applications
      .filter(row => this.selectedIds.has(row.id))
      .map(row => `ROW|${row.id}|${row.customerName}|${row.cardNetwork}|${row.productType}|${row.creditLimit}`);
    return [header, ...rows].join('\n');
  }

  async onExportDatFile(): Promise<void> {
    if (!this.canExport) {
      return;
    }

    const result = await Swal.fire({
      title: 'Export DAT file?',
      text: `This will download a DAT file for ${this.recordCount} selected record(s).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, export'
    });

    if (!result.isConfirmed) {
      return;
    }

    const content = this.getExportContentPreview();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.getExportFileName() || 'dat-export.dat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    await Swal.fire({
      title: 'DAT file generated',
      text: 'A dummy DAT file has been downloaded with sample data.',
      icon: 'success',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'OK'
    });
  }

  onBackToDashboard(): void {
    this.router.navigate(['/loms', 'card-operation', 'application']);
  }
}
