import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkflowService, TradeStatus } from './workflow.service';

export interface Document {
  name: string;
  size?: number;
  type?: string;
  status?: 'VALID' | 'INVALID' | 'PENDING';
  remark?: string;
  uploadDate?: string;
}

export interface HistoryEvent {
  status: string;
  date: string;
  time: string;
  actor: string; // 'CUSTOMER' | 'RO' | 'TO'
  comment?: string;
}

export interface TradeRequest {
  id: string;
  applicant: {
    name: string;
    cif: string;
    account: string;
    email: string;
  };
  exportLC: {
    lcNo: string;
    lcType: string;
    amount: string;
    currency: string;
    exchangeRate: string;
    amountLcy: string;
    expiryDate: string;
    issueDate: string;
    issuingBank: string;
    beneficiaryName: string;
  };
  dcAdvice?: {
    dcNumber: string;
    shipmentDate: string;
    expiryDate: string;
  };
  documents: Document[];
  history: HistoryEvent[];
  status: string;
  updatedAt: string;
  submissionDate?: string;
  charges?: {
    amount: number;
    currency: string;
    description: string;
    status: 'PENDING' | 'APPLIED';
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TradeRequestService {
  private readonly STORAGE_KEY = 'trade_requests';
  private mockRequests: TradeRequest[] = [
    {
      id: 'DC-2025-100001',
      status: TradeStatus.TO_TRADE_OFFICER,
      updatedAt: '2026-01-19',
      submissionDate: '2026-01-17',
      applicant: {
        name: 'Global Textiles Ltd',
        cif: 'CIF88221',
        account: 'ACC99123',
        email: 'info@globaltextiles.com'
      },
      exportLC: {
        lcNo: 'LC-DXB-9921',
        lcType: 'Irrevocable',
        amount: '50000',
        currency: 'USD',
        exchangeRate: '3.67',
        amountLcy: '183500',
        issueDate: '2026-01-10',
        expiryDate: '2026-01-30',
        issuingBank: 'Emirates NBD',
        beneficiaryName: 'Global Textiles Ltd'
      },
      documents: [
        {
          name: 'Commercial Invoice.pdf',
          size: 1024 * 500,
          status: 'INVALID',
          remark: 'Incorrect amount matching LC',
          uploadDate: '2026-01-19'
        },
        {
          name: 'Packing List.pdf',
          size: 1024 * 200,
          status: 'VALID',
          uploadDate: '2026-01-19'
        }
      ],
      history: [
        {
          status: TradeStatus.TO_TRADE_OFFICER,
          date: '19 Jan 2026',
          time: '15:08',
          actor: 'RO',
          comment: 'RO Validation passed.'
        },
        {
          status: TradeStatus.SUBMITTED,
          date: '19 Jan 2026',
          time: '11:59',
          actor: 'CUSTOMER',
          comment: 'Resubmitted by customer.'
        },
        {
          status: TradeStatus.RETURNED,
          date: '18 Jan 2026',
          time: '11:02',
          actor: 'RO',
          comment: 'Please correct the invoice amount.'
        },
        {
          status: TradeStatus.SUBMITTED,
          date: '17 Jan 2026',
          time: '11:02',
          actor: 'CUSTOMER',
          comment: 'Submitted for advice.'
        }
      ],
      charges: []
    },
    {
      id: 'DC-2025-100003',
      status: TradeStatus.PENDING_APPROVAL,
      updatedAt: '2026-01-19',
      submissionDate: '2026-01-12',
      applicant: {
        name: 'Agri Foods Corp',
        cif: 'CIF55443',
        account: 'ACC44556',
        email: 'contact@agrifoods.com'
      },
      exportLC: {
        lcNo: 'LC-LDN-4411',
        lcType: 'Irrevocable',
        amount: '200000',
        currency: 'GBP',
        exchangeRate: '4.65',
        amountLcy: '930000',
        issueDate: '2026-01-12',
        expiryDate: '2026-03-01',
        issuingBank: 'Barclays',
        beneficiaryName: 'Agri Foods Corp'
      },
      documents: [],
      history: []
    },
    {
      id: 'DC-2025-100004',
      status: TradeStatus.APPROVED,
      updatedAt: '2026-01-18',
      submissionDate: '2026-01-15',
      applicant: {
        name: 'Metal Works Co',
        cif: 'CIF99887',
        account: 'ACC77889',
        email: 'sales@metalworks.com'
      },
      exportLC: {
        lcNo: 'LC-TOK-1122',
        lcType: 'Revocable',
        amount: '75000',
        currency: 'JPY',
        exchangeRate: '0.025',
        amountLcy: '1875',
        issueDate: '2026-01-15',
        expiryDate: '2026-04-15',
        issuingBank: 'MUFG Bank',
        beneficiaryName: 'Metal Works Co'
      },
      documents: [],
      history: []
    },
    {
      id: 'DC-2025-100005',
      status: TradeStatus.DC_ADVICE_ISSUED,
      updatedAt: '2026-01-17',
      submissionDate: '2026-01-10',
      applicant: {
        name: 'Solar Solutions',
        cif: 'CIF11223',
        account: 'ACC33445',
        email: 'energy@solar.com'
      },
      exportLC: {
        lcNo: 'LC-BER-9988',
        lcType: 'Irrevocable',
        amount: '300000',
        currency: 'EUR',
        exchangeRate: '3.95',
        amountLcy: '1185000',
        issueDate: '2026-01-10',
        expiryDate: '2026-05-10',
        issuingBank: 'Deutsche Bank',
        beneficiaryName: 'Solar Solutions'
      },
      documents: [],
      history: []
    },
    {
      id: 'DC-2026-633298',
      status: TradeStatus.DC_ADVICE_ISSUED,
      updatedAt: '2026-01-19',
      submissionDate: '2026-01-01',
      applicant: {
        name: 'My Company Ltd',
        cif: 'CIF12345',
        account: 'ACC123456',
        email: 'me@company.com'
      },
      exportLC: {
        lcNo: '99999999999',
        lcType: 'Confirmed',
        amount: '75000',
        currency: 'EUR',
        exchangeRate: '1.1',
        amountLcy: '82500',
        issueDate: '2026-01-01',
        expiryDate: '2026-06-01',
        issuingBank: 'Deutsche Bank',
        beneficiaryName: 'My Company Ltd'
      },
      documents: [],
      history: []
    }
  ];

  private requestsSubject = new BehaviorSubject<TradeRequest[]>(this.mockRequests);
  requests$ = this.requestsSubject.asObservable();

  constructor(private workflowService: WorkflowService) {
    this.loadFromStorage();
  }

  private saveToStorage(requests: TradeRequest[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
            this.requestsSubject.next(parsed);
        }
      } catch (e) {
        console.error('Failed to load requests from storage', e);
      }
    }
  }

  getRequests() {
    return this.requestsSubject.value;
  }

  getRequestById(id: string): TradeRequest | undefined {
    return this.requestsSubject.value.find(r => r.id === id);
  }

  addRequest(request: Partial<TradeRequest>) {
    const newRequest: TradeRequest = {
      id: 'DC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
      status: TradeStatus.SUBMITTED,
      updatedAt: new Date().toISOString().split('T')[0],
      submissionDate: new Date().toISOString().split('T')[0],
      applicant: request.applicant as any,
      exportLC: request.exportLC as any,
      dcAdvice: request.dcAdvice as any,
      documents: request.documents?.map(d => ({...d, status: 'PENDING'})) || [],
      history: [
        {
            status: TradeStatus.SUBMITTED,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            actor: 'CUSTOMER',
            comment: 'Submitted for advice.'
        }
      ]
    };

    const currentRequests = this.requestsSubject.value;
    const updated = [newRequest, ...currentRequests];
    this.requestsSubject.next(updated);
    this.saveToStorage(updated);
  }

  updateRequestStatus(id: string, status: string, actor: string, comment?: string) {
    const requests = this.requestsSubject.value;
    const requestIndex = requests.findIndex(r => r.id === id);

    if (requestIndex !== -1) {
      // Validate transition
      const currentStatus = requests[requestIndex].status;
      if (!this.workflowService.canTransition('REQUEST', currentStatus, status, actor) && actor !== 'SYSTEM') {
        console.warn(`Invalid status transition from ${currentStatus} to ${status} by ${actor}`);
        // We allow it for now but log warning, or we could return false
      }

      const updatedRequest = { ...requests[requestIndex] };
      updatedRequest.status = status;
      updatedRequest.updatedAt = new Date().toISOString().split('T')[0];
      
      updatedRequest.history = [
        {
          status: status,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          actor: actor,
          comment: comment
        },
        ...updatedRequest.history
      ];

      requests[requestIndex] = updatedRequest;
      this.requestsSubject.next([...requests]);
      this.saveToStorage(requests);
    }
  }

  updateDocumentStatus(requestId: string, docName: string, status: 'VALID' | 'INVALID' | 'PENDING') {
    const requests = this.requestsSubject.value;
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex !== -1) {
      const updatedRequest = { ...requests[requestIndex] };
      const docIndex = updatedRequest.documents.findIndex(d => d.name === docName);

      if (docIndex !== -1) {
        updatedRequest.documents[docIndex] = {
          ...updatedRequest.documents[docIndex],
          status: status
        };
        requests[requestIndex] = updatedRequest;
        this.requestsSubject.next([...requests]);
        this.saveToStorage(requests);
      }
    }
  }

  updateRequestCharges(id: string, charges: { amount: number; currency: string; description: string; status: 'PENDING' | 'APPLIED' }[]) {
    const requests = this.requestsSubject.value;
    const requestIndex = requests.findIndex(r => r.id === id);

    if (requestIndex !== -1) {
      const updatedRequest = { ...requests[requestIndex] };
      updatedRequest.charges = charges;
      requests[requestIndex] = updatedRequest;
      this.requestsSubject.next([...requests]);
      this.saveToStorage(requests);
    }
  }

  getRequest(id: string): Observable<TradeRequest | undefined> {
    return this.requests$.pipe(
      map(requests => requests.find(r => r.id === id))
    );
  }
}
