import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LomsLayoutComponent } from '../../../styles/layout/loms-layout.component';

type IssuancePriority = 'Normal' | 'Urgent';
type MakerStatus = 'Draft' | 'Ready' | 'Submitted';
type ViewAsRole = 'Maker' | 'Checker';

interface IssuanceApplicationHeader {
  id: string;
  date: string;
  customerName: string;
  cif: string;
  cardType: string;
  cardProduct: string;
  priority: IssuancePriority;
  productStatus: string;
}

interface CustomerAccountSnapshot {
  customerName: string;
  customerSegment: string;
  cif: string;
  mobile: string;
  email: string;
  branchName: string;
  accountNumber: string;
  accountCurrency: string;
  accountLimit: string;
  accountStatus: string;
}

interface IssuanceDetailsForm {
  cardProductConfirmation: string;
  cardVariant: string;
  embossingName: string;
  cardNetwork: string;
  cardCurrency: string;
  cardValidity: string;
}

interface UsageConfigurationForm {
  atmEnabled: boolean;
  posEnabled: boolean;
  ecommerceEnabled: boolean;
  internationalEnabled: boolean;
}

interface DeliveryInformationForm {
  deliveryMode: string;
  deliveryBranch: string;
  deliveryPriority: string;
}

interface PinSecurityForm {
  pinGenerationMode: string;
  smsEnabled: boolean;
}

interface SupplementaryCardItem {
  id: number;
  name: string;
  relationship: string;
  dob: string;
  nationalId: string;
  mobile: string;
  cardType: string;
  status: 'Active' | 'Pending';
}

interface AttachmentItem {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface ProcessingTimelineItem {
  id: string;
  label: string;
  description: string;
  time: string;
  status: 'done' | 'active' | 'pending';
}

@Component({
  selector: 'app-loms-card-issuance-processing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LomsLayoutComponent],
  templateUrl: './card-operation-issuance-processing.page.html'
})
export class LomsCardIssuanceProcessingPageComponent implements OnInit {
  @ViewChild('supportingFileInput') supportingFileInput?: ElementRef<HTMLInputElement>;
  userName = 'Kamal Rahman';
  userRole = 'Maker';
  branchName = 'Banani Head Office';

  viewAs: ViewAsRole = 'Maker';

  applicationHeader: IssuanceApplicationHeader = {
    id: 'CRD-2025-0012',
    date: '2025-02-08',
    customerName: 'Md. Rafiqul Islam',
    cif: 'CIF-789456',
    cardType: 'Debit Card',
    cardProduct: 'Classic Debit Card',
    priority: 'Urgent',
    productStatus: 'Maker Processing'
  };

  customerSnapshot: CustomerAccountSnapshot = {
    customerName: 'Md. Rafiqul Islam',
    customerSegment: 'Retail Banking',
    cif: 'CIF-789456',
    mobile: '+880 1712-345678',
    email: 'rafiqul.islam@email.com',
    branchName: 'Head Office',
    accountNumber: '1234567890123',
    accountCurrency: 'BDT',
    accountLimit: 'BDT 500,000',
    accountStatus: 'Active'
  };

  issuanceDetails: IssuanceDetailsForm = {
    cardProductConfirmation: 'Classic Debit Card',
    cardVariant: 'Classic',
    embossingName: 'MD RAFIQUL ISLAM',
    cardNetwork: 'Visa',
    cardCurrency: 'BDT',
    cardValidity: '5 Years'
  };

  usageConfiguration: UsageConfigurationForm = {
    atmEnabled: true,
    posEnabled: true,
    ecommerceEnabled: true,
    internationalEnabled: false
  };

  deliveryInformation: DeliveryInformationForm = {
    deliveryMode: 'Branch Pickup',
    deliveryBranch: 'Gulshan Branch',
    deliveryPriority: 'Normal'
  };

  pinSecurity: PinSecurityForm = {
    pinGenerationMode: 'Customer Will Set PIN',
    smsEnabled: true
  };

  supplementaryCards: SupplementaryCardItem[] = [
    {
      id: 1,
      name: 'Ayesha Islam',
      relationship: 'Spouse',
      dob: '15-Mar-1990',
      nationalId: '1234567890123',
      mobile: '+880 1712-987654',
      cardType: 'Classic Debit',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Fahim Islam',
      relationship: 'Son',
      dob: '20-Jun-2005',
      nationalId: '9876543210987',
      mobile: '+880 1712-111222',
      cardType: 'Classic Debit',
      status: 'Pending'
    }
  ];

  processingNotes = '';

  attachments: AttachmentItem[] = [
    {
      id: 1,
      name: 'Card Application Form.pdf',
      type: 'Application Form',
      size: '320 KB',
      uploadedAt: 'Uploaded on 01-Feb-2025 at 2:15 PM'
    },
    {
      id: 2,
      name: 'National ID Copy.jpg',
      type: 'KYC Document',
      size: '180 KB',
      uploadedAt: 'Uploaded on 01-Feb-2025 at 2:18 PM'
    },
    {
      id: 3,
      name: 'Account Statement.pdf',
      type: 'Account Document',
      size: '540 KB',
      uploadedAt: 'Uploaded on 01-Feb-2025 at 2:20 PM'
    }
  ];

  nextAttachmentId = 4;

  timelineItems: ProcessingTimelineItem[] = [
    {
      id: 'escalatedToMaker',
      label: 'Escalated to Maker',
      description: 'By: Sarah Ahmed (Reviewer)',
      time: '08-Feb-2025 at 1:30 PM',
      status: 'done'
    },
    {
      id: 'makerStarted',
      label: 'Maker Started Processing',
      description: 'By: Kamal Rahman (Maker)',
      time: '08-Feb-2025 at 2:10 PM',
      status: 'active'
    },
    {
      id: 'pendingChecker',
      label: 'Pending Checker Approval',
      description: 'Awaiting submission',
      time: 'Pending',
      status: 'pending'
    }
  ];

  makerStatus: MakerStatus = 'Draft';
  draggingAttachmentId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.onFormChanged();
  }

  get makerStatusLabel(): string {
    if (this.makerStatus === 'Submitted') {
      return 'Submitted to Checker';
    }
    if (this.makerStatus === 'Ready') {
      return 'Ready for Submission';
    }
    return 'More information required before submission';
  }

  get makerStatusDescription(): string {
    if (this.makerStatus === 'Submitted') {
      return 'Submission has been sent to checker for approval.';
    }
    if (this.makerStatus === 'Ready') {
      return 'All mandatory fields have been completed. You can now submit this application to a Checker for approval.';
    }
    return 'Complete issuance details, delivery, PIN handling, and attachments to enable submission to checker.';
  }

  get makerStatusBadgeClasses(): string {
    if (this.makerStatus === 'Submitted') {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (this.makerStatus === 'Ready') {
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  get canSubmitToChecker(): boolean {
    return this.makerStatus === 'Ready';
  }

  get isReadOnly(): boolean {
    return this.viewAs === 'Checker' || this.makerStatus === 'Submitted';
  }

  setViewAs(role: ViewAsRole): void {
    this.viewAs = role;
  }

  onBackToDashboard(): void {
    this.router.navigate(['/loms', 'card-operation', 'application']);
  }

  onPrint(): void {
    window.print();
  }

  onViewHistory(): void {
    if (this.viewAs === 'Maker') {
      this.viewAs = 'Checker';
      return;
    }
    this.viewAs = 'Maker';
  }

  onUploadAreaClick(): void {
    if (this.isReadOnly) {
      return;
    }
    this.supportingFileInput?.nativeElement.click();
  }

  onFormChanged(): void {
    if (this.makerStatus === 'Submitted' || this.isReadOnly) {
      return;
    }

    const hasIssuanceBasics =
      this.issuanceDetails.cardProductConfirmation.trim().length > 0 &&
      this.issuanceDetails.cardVariant.trim().length > 0 &&
      this.issuanceDetails.embossingName.trim().length > 0 &&
      this.issuanceDetails.cardNetwork.trim().length > 0 &&
      this.issuanceDetails.cardCurrency.trim().length > 0 &&
      this.issuanceDetails.cardValidity.trim().length > 0;

    const hasDeliveryBasics =
      this.deliveryInformation.deliveryMode.trim().length > 0 &&
      this.deliveryInformation.deliveryBranch.trim().length > 0 &&
      this.deliveryInformation.deliveryPriority.trim().length > 0;

    const hasPinConfig = this.pinSecurity.pinGenerationMode.trim().length > 0;

    const hasAttachment = this.attachments.length > 0;

    this.makerStatus =
      hasIssuanceBasics && hasDeliveryBasics && hasPinConfig && hasAttachment
        ? 'Ready'
        : 'Draft';
  }

  onFilesSelected(event: Event): void {
    if (this.isReadOnly) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    Array.from(input.files).forEach((file) => {
      const sizeInKb = Math.round(file.size / 1024);
      this.attachments.push({
        id: this.nextAttachmentId++,
        name: file.name,
        type: 'Supporting Document',
        size: `${sizeInKb} KB`,
        uploadedAt: `Uploaded on ${timestamp}`
      });
    });

    input.value = '';
    this.onFormChanged();
  }

  viewAttachment(id: number): void {
    const attachment = this.attachments.find((item) => item.id === id);
    if (!attachment) {
      return;
    }

    alert(`Previewing: ${attachment.name}`);
  }

  onAttachmentDragStart(event: DragEvent, id: number): void {
    if (this.isReadOnly) {
      return;
    }
    this.draggingAttachmentId = id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(id));
    }
  }

  onAttachmentDragOver(event: DragEvent): void {
    if (this.isReadOnly) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onAttachmentDrop(targetId: number): void {
    if (this.isReadOnly) {
      return;
    }
    const sourceId = this.draggingAttachmentId ?? targetId;
    if (sourceId === targetId) {
      return;
    }
    const fromIndex = this.attachments.findIndex((item) => item.id === sourceId);
    const toIndex = this.attachments.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }
    const updated = [...this.attachments];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    this.attachments = updated;
    this.onFormChanged();
  }

  onAttachmentDragEnd(): void {
    this.draggingAttachmentId = null;
  }

  removeAttachment(id: number): void {
    if (this.isReadOnly) {
      return;
    }

    this.attachments = this.attachments.filter((a) => a.id !== id);
    this.onFormChanged();
  }

  saveDraft(): void {
    if (this.isReadOnly) {
      return;
    }
    this.makerStatus = 'Draft';
  }

  cancelProcessing(): void {
    this.router.navigate(['/loms', 'card-operation', 'application']);
  }

  submitToChecker(): void {
    if (!this.canSubmitToChecker) {
      return;
    }

    this.makerStatus = 'Submitted';
    this.timelineItems = this.timelineItems.map((item) => {
      if (item.id === 'escalatedToMaker') {
        return { ...item, status: 'done' };
      }
      if (item.id === 'makerStarted') {
        return { ...item, status: 'done' };
      }
      if (item.id === 'pendingChecker') {
        return { ...item, status: 'active', time: 'Just now' };
      }
      return item;
    });
  }
}
