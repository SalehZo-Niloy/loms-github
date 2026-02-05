import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TradeStatus, WorkflowService } from './workflow.service';

export interface MasterLCRequest {
  id: string;
  exportLCNo: string; // The ID or Number of the linked Export LC
  
  // Step 2: Parties
  applicantName: string;
  supplierType: string;
  supplierName: string;
  supplierAddress: string;

  // Step 3: PI & Goods
  piNumber?: string;
  piDate: string;
  hsCode: string;
  goodsDescription: string;
  partialShipmentAllowed: boolean;
  transshipmentAllowed: boolean;

  // Step 4: Limits & Charges
  // Removed Margin, Commission, etc. as per requirement
  requestedAmount: number;
  currency: string;
  
  // Step 5: Documents
  documents: {
    name: string;
    type: string;
    uploaded: boolean;
  }[];

  // Trade Officer / Financials
  limitApproved?: number;
  limitUtilized?: number;
  limitAvailable?: number;
  
  marginPercent?: number;
  marginAmount?: number;
  commissionPercent?: number;
  totalCharges?: number;

  status: string;
  submissionDate: string;
  updatedAt: string;
  history: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MasterLCService {
  private readonly STORAGE_KEY = 'master_lc_requests';
  
  private mockRequests: MasterLCRequest[] = [
    {
      id: 'MLCRQ-2026-119704',
      exportLCNo: 'ELC/LN/2026/045',
      applicantName: 'Best Garments Ltd (BD)',
      supplierType: 'Local',
      supplierName: 'gtty',
      supplierAddress: 'Dhaka',
      piDate: '2026-01-15',
      hsCode: '6109.10',
      goodsDescription: 'Cotton T-Shirts',
      partialShipmentAllowed: true,
      transshipmentAllowed: false,
      requestedAmount: 9.00,
      currency: 'GBP',
      documents: [],
      status: 'Manager Approved',
      submissionDate: '2026-01-20',
      updatedAt: '2026-01-20',
      history: [
        {
          status: 'Submitted',
          date: '20 Jan 2026',
          time: '10:30 AM',
          actor: 'Customer',
          comment: 'Application Submitted'
        },
        {
          status: 'Pending Manager Approval',
          date: '20 Jan 2026',
          time: '11:15 AM',
          actor: 'Trade Officer',
          comment: 'Verified documents and limits. Forwarding for approval.'
        },
        {
          status: 'Manager Approved',
          date: '20 Jan 2026',
          time: '12:00 PM',
          actor: 'Manager',
          comment: 'Approved. Proceed with issuance.'
        }
      ]
    },
    {
      id: 'MLCRQ-2026-253377',
      exportLCNo: 'ELC/LN/2026/045',
      applicantName: 'Best Garments Ltd (BD)',
      supplierType: 'Local',
      supplierName: 'gtty',
      supplierAddress: 'Dhaka',
      piDate: '2026-01-18',
      hsCode: '6109.10',
      goodsDescription: 'Cotton T-Shirts',
      partialShipmentAllowed: true,
      transshipmentAllowed: false,
      requestedAmount: 9.00,
      currency: 'GBP',
      documents: [],
      status: 'Pending Approval',
      submissionDate: '2026-01-20',
      updatedAt: '2026-01-20',
      history: [
        {
          status: 'Submitted',
          date: '20 Jan 2026',
          time: '09:00 AM',
          actor: 'Customer',
          comment: 'Application Submitted'
        }
      ]
    },
    {
      id: 'MLCRQ-2026-100001',
      exportLCNo: 'ELC/NY/2026/001',
      applicantName: 'Best Garments Ltd (BD)',
      supplierType: 'Local',
      supplierName: 'Local Fabrics Ltd',
      supplierAddress: 'Gazipur',
      piDate: '2026-01-10',
      hsCode: '5208.10',
      goodsDescription: 'Woven Fabrics',
      partialShipmentAllowed: false,
      transshipmentAllowed: false,
      requestedAmount: 30000.00,
      currency: 'USD',
      documents: [],
      status: 'Pending Approval',
      submissionDate: '2026-01-19',
      updatedAt: '2026-01-19',
      history: []
    }
  ];

  private requestsSubject = new BehaviorSubject<MasterLCRequest[]>([]);
  public requests$ = this.requestsSubject.asObservable();

  constructor(private workflowService: WorkflowService) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          this.requestsSubject.next(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to load master lc requests', e);
      }
    }
    // Fallback to mock data
    this.requestsSubject.next(this.mockRequests);
  }

  private saveToStorage(requests: MasterLCRequest[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests));
  }

  getRequests(): Observable<MasterLCRequest[]> {
    return this.requests$;
  }

  getRequestById(id: string): MasterLCRequest | undefined {
    return this.requestsSubject.value.find(r => r.id === id);
  }

  addRequest(request: Partial<MasterLCRequest>) {
    const current = this.requestsSubject.value;
    const newRequest: MasterLCRequest = {
      id: `MLCRQ-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending Approval', // Default status
      submissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      updatedAt: new Date().toISOString(),
      history: [{
        status: 'Submitted',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        actor: 'Customer',
        comment: 'Application Submitted'
      }],
      documents: [],
      // Defaults
      exportLCNo: request.exportLCNo || '',
      applicantName: request.applicantName || '',
      supplierType: request.supplierType || 'Local',
      supplierName: request.supplierName || '',
      supplierAddress: request.supplierAddress || '',
      piDate: request.piDate || '',
      hsCode: request.hsCode || '',
      goodsDescription: request.goodsDescription || '',
      partialShipmentAllowed: request.partialShipmentAllowed || false,
      transshipmentAllowed: request.transshipmentAllowed || false,
      requestedAmount: request.requestedAmount || 0,
      currency: request.currency || 'USD',
      ...request
    } as MasterLCRequest;

    const updated = [newRequest, ...current];
    this.requestsSubject.next(updated);
    this.saveToStorage(updated);
  }

  updateRequest(updatedRequest: MasterLCRequest) {
    const current = this.requestsSubject.value;
    const index = current.findIndex(r => r.id === updatedRequest.id);
    if (index > -1) {
      const updated = [...current];
      updated[index] = { ...updatedRequest, updatedAt: new Date().toISOString() };
      this.requestsSubject.next(updated);
      this.saveToStorage(updated);
    }
  }

  updateStatus(id: string, newStatus: string, actor: string = 'System', comment: string = '') {
    const current = this.requestsSubject.value;
    const index = current.findIndex(r => r.id === id);
    if (index > -1) {
      const updatedReq = { ...current[index] };
      updatedReq.status = newStatus;
      updatedReq.updatedAt = new Date().toISOString();
      updatedReq.history = [
        {
          status: newStatus,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          actor: actor,
          comment: comment
        },
        ...(updatedReq.history || [])
      ];
      
      const updated = [...current];
      updated[index] = updatedReq;
      this.requestsSubject.next(updated);
      this.saveToStorage(updated);
    }
  }
}
