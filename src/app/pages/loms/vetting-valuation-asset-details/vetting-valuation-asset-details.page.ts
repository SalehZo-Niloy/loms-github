import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';
import { AlertService } from '../../../services/alert.service';

type VettingStatusKey = 'assigned' | 'pending' | 'inReview' | 'completed';
type UploadStatusKey = 'uploaded' | 'pending';
type VerificationStatusKey = 'notReviewed' | 'accepted' | 'rejected';

interface AssetRow {
  id: string;
  name: string;
  type: string;
  documentName: string;
  documentMissing: boolean;
  vettingType: string;
  forwardTo: string;
  assignee: string;
  status: string;
  statusKey: VettingStatusKey;
  saved: boolean;
}

interface DocumentRow {
  assetName: string;
  documentName: string;
  documentType: string;
  uploadedBy: string;
  uploadedAt: string;
  uploadStatus: string;
  uploadStatusKey: UploadStatusKey;
  verificationStatus: string;
  verificationStatusKey: VerificationStatusKey;
}

@Component({
  selector: 'app-loms-vetting-valuation-asset-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LomsLayoutComponent],
  templateUrl: './vetting-valuation-asset-details.page.html'
})
export class LomsVettingValuationAssetDetailsPageComponent {
  header = {
    applicationId: 'LN-2026-02-2201',
    customerName: 'Md. Karim Rahman',
    product: 'Home Loan',
    branch: 'Gulshan',
    loanAmount: 'BDT 5,000,000',
    overallStatus: 'Assigned'
  };

  assets: AssetRow[] = [
    {
      id: 'AST-001',
      name: 'Residential Flat - Gulshan 2, Plot 45',
      type: 'Flat',
      documentName: 'Title_Deed_AST001.pdf',
      documentMissing: false,
      vettingType: '',
      forwardTo: '',
      assignee: '',
      status: 'Pending',
      statusKey: 'pending',
      saved: false
    },
    {
      id: 'AST-002',
      name: 'Commercial Building - Banani, Road 11',
      type: 'Commercial',
      documentName: '',
      documentMissing: true,
      vettingType: '',
      forwardTo: '',
      assignee: '',
      status: 'Pending',
      statusKey: 'pending',
      saved: false
    },
    {
      id: 'AST-003',
      name: 'Land Plot - Dhanmondi, 5 Katha',
      type: 'Land',
      documentName: 'Land_Document_AST003.pdf',
      documentMissing: false,
      vettingType: '',
      forwardTo: '',
      assignee: '',
      status: 'Pending',
      statusKey: 'pending',
      saved: false
    }
  ];

  documents: DocumentRow[] = [
    {
      assetName: 'Residential Flat - Gulshan 2',
      documentName: 'Title_Deed_AST001.pdf',
      documentType: 'Title Deed',
      uploadedBy: 'Rafiq Ahmed',
      uploadedAt: '2026-02-02 09:45 AM',
      uploadStatus: 'Uploaded',
      uploadStatusKey: 'uploaded',
      verificationStatus: 'Not Reviewed',
      verificationStatusKey: 'notReviewed'
    },
    {
      assetName: 'Land Plot - Dhanmondi',
      documentName: 'Land_Document_AST003.pdf',
      documentType: 'Land Document',
      uploadedBy: 'Rafiq Ahmed',
      uploadedAt: '2026-02-02 10:12 AM',
      uploadStatus: 'Uploaded',
      uploadStatusKey: 'uploaded',
      verificationStatus: 'Accepted',
      verificationStatusKey: 'accepted'
    }
  ];

  vettingTypes = ['Title Verification', 'Physical Visit', 'Legal Check', 'Market Survey'];
  forwardOptions = ['Valuation Officer', 'Legal Officer', 'External Surveyor'];
  assignees = ['Select', 'Rafiq Ahmed', 'Shamim Haider', 'Nusrat Jahan'];

  selectedAssetIds = new Set<string>();

  constructor(private alertService: AlertService) {}

  get assetCount(): number {
    return this.assets.length;
  }

  get documentCount(): number {
    return this.documents.length;
  }

  get allSelected(): boolean {
    return this.assets.length > 0 && this.assets.every(a => this.selectedAssetIds.has(a.id));
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.selectedAssetIds.clear();
      return;
    }
    this.assets.forEach(a => this.selectedAssetIds.add(a.id));
  }

  toggleAssetSelection(id: string): void {
    if (this.selectedAssetIds.has(id)) {
      this.selectedAssetIds.delete(id);
    } else {
      this.selectedAssetIds.add(id);
    }
  }

  uploadDocument(asset: AssetRow): void {
    asset.documentMissing = false;
    asset.documentName = asset.documentName || `${asset.id}_Document.pdf`;
    asset.status = 'In Review';
    asset.statusKey = 'inReview';

    const exists = this.documents.find(d => d.documentName === asset.documentName);
    if (!exists) {
      this.documents.unshift({
        assetName: asset.name.split(',')[0],
        documentName: asset.documentName,
        documentType: asset.type,
        uploadedBy: 'Rafiq Ahmed',
        uploadedAt: '2026-02-08 11:20 AM',
        uploadStatus: 'Uploaded',
        uploadStatusKey: 'uploaded',
        verificationStatus: 'Not Reviewed',
        verificationStatusKey: 'notReviewed'
      });
    }
  }

  saveAsset(asset: AssetRow): void {
    asset.saved = true;
  }

  clearSave(asset: AssetRow): void {
    asset.saved = false;
  }

  statusClass(statusKey: VettingStatusKey): string {
    switch (statusKey) {
      case 'assigned':
        return 'bg-blue-100 text-blue-700';
      case 'inReview':
        return 'bg-violet-50 text-violet-700';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  }

  uploadStatusClass(statusKey: UploadStatusKey): string {
    return statusKey === 'uploaded'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';
  }

  verificationStatusClass(statusKey: VerificationStatusKey): string {
    switch (statusKey) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700';
      case 'rejected':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  }

  viewDocument(doc: DocumentRow): void {
    doc.verificationStatus = doc.verificationStatus === 'Accepted' ? 'Not Reviewed' : 'Accepted';
    doc.verificationStatusKey =
      doc.verificationStatus === 'Accepted' ? 'accepted' : 'notReviewed';
  }

  reuploadDocument(doc: DocumentRow): void {
    doc.uploadStatus = 'Uploaded';
    doc.uploadStatusKey = 'uploaded';
    doc.uploadedAt = '2026-02-08 11:45 AM';
  }

  deleteDocument(doc: DocumentRow): void {
    this.documents = this.documents.filter(d => d !== doc);
  }

  async forwardForVetting(): Promise<void> {
    await this.alertService.showSuccess(
      'Assets have been forwarded for Vetting / Valuation.',
      '#2563eb'
    );
  }
}
