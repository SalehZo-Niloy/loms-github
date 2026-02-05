import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradeStatus, WorkflowService } from './workflow.service';

export interface ExportBill {
  id: string;
  customerName: string;
  cif: string;
  lcNumber: string;
  amount: number;
  currency: string;
  status: string; // Using string to allow TradeStatus enum values
  updatedAt: string;
  
  // Details
  applicantName: string;
  issuingBank: string;
  lcIssueDate: string;

  // Buyer & Bill
  buyerName: string;
  country: string;
  collectionType: string;
  tenor: number;

  // Documents (mock)
  documents: any[];
  
  // History
  history?: {
    status: string;
    date: string;
    time: string;
    actor: string;
    comment?: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ExportBillService {
  private readonly STORAGE_KEY = 'export_bills';
  private mockBills: ExportBill[] = [
    {
      id: 'BC-2025-001',
      customerName: 'Global Textiles Ltd',
      cif: 'CIF-8821',
      lcNumber: 'LC-UK-1001',
      amount: 50000.00,
      currency: 'USD',
      status: TradeStatus.SUBMITTED,
      updatedAt: '2025-01-19',
      applicantName: 'Global Textiles Ltd',
      issuingBank: 'Barclays UK',
      lcIssueDate: '2025-01-10',
      buyerName: 'London Fashion Week',
      country: 'United Kingdom',
      collectionType: 'D/P',
      tenor: 0,
      documents: [],
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: '19 Jan 2025',
          time: '10:00',
          actor: 'CUSTOMER',
          comment: 'Submitted for collection.'
        }
      ]
    },
    {
      id: 'BC-2025-002',
      customerName: 'Agro Exporters Inc',
      cif: 'CIF-3342',
      lcNumber: 'LC-DE-3030',
      amount: 75000.00,
      currency: 'EUR',
      status: TradeStatus.VERIFIED,
      updatedAt: '2025-01-18',
      applicantName: 'Agro Exporters Inc',
      issuingBank: 'Deutsche Bank',
      lcIssueDate: '2025-01-05',
      buyerName: 'Berlin Markets',
      country: 'Germany',
      collectionType: 'D/A',
      tenor: 30,
      documents: []
    },
    {
      id: 'BC-2025-003',
      customerName: 'Tech Components Ltd',
      cif: 'CIF-5511',
      lcNumber: 'LC-JP-4040',
      amount: 200000,
      currency: 'JPY',
      status: TradeStatus.APPROVED,
      updatedAt: '2025-01-15',
      applicantName: 'Tech Components Ltd',
      issuingBank: 'MUFG Bank',
      lcIssueDate: '2025-01-01',
      buyerName: 'Tokyo Electronics',
      country: 'Japan',
      collectionType: 'D/P',
      tenor: 0,
      documents: []
    },
    {
      id: 'BC-2025-004',
      customerName: 'Luxury Leather Co',
      cif: 'CIF-9988',
      lcNumber: 'LC-IT-6060',
      amount: 150000.00,
      currency: 'USD',
      status: TradeStatus.SENT_TO_IMPORTER,
      updatedAt: '2025-01-12',
      applicantName: 'Luxury Leather Co',
      issuingBank: 'Intesa Sanpaolo',
      lcIssueDate: '2024-12-28',
      buyerName: 'Milan Fashion House',
      country: 'Italy',
      collectionType: 'D/A',
      tenor: 60,
      documents: []
    }
  ];

  private bills = new BehaviorSubject<ExportBill[]>([]);
  bills$ = this.bills.asObservable();

  constructor(private workflowService: WorkflowService) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.bills.next(JSON.parse(stored));
    } else {
      this.bills.next(this.mockBills);
      this.saveToStorage(this.mockBills);
    }
  }

  private saveToStorage(bills: ExportBill[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bills));
  }

  addBill(billData: Partial<ExportBill>) {
    const newBill: ExportBill = {
      id: `BC-2025-${Math.floor(100 + Math.random() * 900)}`,
      customerName: billData.applicantName || 'Unknown',
      cif: 'CIF-9999',
      lcNumber: billData.lcNumber || '',
      amount: billData.amount || 0,
      currency: billData.currency || 'USD',
      status: TradeStatus.SUBMITTED,
      updatedAt: new Date().toISOString().split('T')[0],
      applicantName: billData.applicantName || '',
      issuingBank: billData.issuingBank || '',
      lcIssueDate: billData.lcIssueDate || '',
      buyerName: billData.buyerName || '',
      country: billData.country || '',
      collectionType: billData.collectionType || '',
      tenor: billData.tenor || 0,
      documents: billData.documents || [],
      history: [
        {
          status: TradeStatus.SUBMITTED,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          actor: 'CUSTOMER',
          comment: 'Submitted for collection.'
        }
      ]
    };

    const currentBills = this.bills.value;
    const updated = [newBill, ...currentBills];
    this.bills.next(updated);
    this.saveToStorage(updated);
  }

  getBill(id: string) {
    return this.bills.pipe(
      map(bills => bills.find(b => b.id === id))
    );
  }
  
  updateStatus(id: string, status: string, role: string, comment?: string) {
    const bills = this.bills.value;
    const index = bills.findIndex(b => b.id === id);
    if (index !== -1) {
       const currentStatus = bills[index].status;
       if (!this.workflowService.canTransition('EXPORT_BILL', currentStatus, status, role) && role !== 'SYSTEM') {
          console.warn(`Invalid status transition from ${currentStatus} to ${status} by ${role}`);
       }

       const updatedBill = { ...bills[index] };
       updatedBill.status = status;
       updatedBill.updatedAt = new Date().toISOString().split('T')[0];
       
       updatedBill.history = [
         {
           status: status,
           date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
           time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
           actor: role,
           comment: comment
         },
         ...(updatedBill.history || [])
       ];

       const updated = [...bills];
       updated[index] = updatedBill;
       this.bills.next(updated);
       this.saveToStorage(updated);
    }
  }
}

