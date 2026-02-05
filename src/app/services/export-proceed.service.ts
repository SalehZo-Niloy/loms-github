import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradeStatus, WorkflowService } from './workflow.service';

export interface ExportProceed {
  id: string;
  customer: string;
  refBill: string;
  refLC: string;
  amount: number;
  currency: string;
  status: string; // Using string to allow TradeStatus enum values
  date: string;
  cif?: string;
  accountNo?: string;
  swiftRef?: string;
  valueDate?: string;
  discrepancyReason?: string;
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
export class ExportProceedService {
  private readonly STORAGE_KEY = 'export_proceeds';
  private mockProceeds: ExportProceed[] = [
    { 
      id: 'PR-2026-232914', 
      customer: 'New Customer Ltd', 
      refBill: 'BC-25-22', 
      refLC: 'LC-25-7', 
      amount: 3390.00, 
      currency: 'USD', 
      status: TradeStatus.PENDING_APPROVAL, 
      date: '2026-01-19',
      cif: 'CIF-9999',
      accountNo: '123-456-789',
      swiftRef: 'SW-62174',
      valueDate: '2026-01-19',
      history: [
        {
          status: TradeStatus.PENDING_APPROVAL,
          date: '19 Jan 2026',
          time: '14:30',
          actor: 'TO',
          comment: 'Verified and submitted for approval.'
        }
      ]
    },
    { 
      id: 'PR-2026-757247', 
      customer: 'New Customer Ltd', 
      refBill: 'BC-25-45', 
      refLC: 'LC-25-57', 
      amount: 53907.00, 
      currency: 'USD', 
      status: TradeStatus.SWIFT_VALIDATED, 
      date: '2026-01-19' 
    },
    { 
      id: 'PR-2025-000001', 
      customer: 'Alpha Exports Ltd', 
      refBill: 'BC-25-001', 
      refLC: 'LC-25-001', 
      amount: 50000.00, 
      currency: 'USD', 
      status: TradeStatus.SWIFT_VALIDATED, 
      date: '2026-01-18' 
    },
    { 
      id: 'PR-2025-000002', 
      customer: 'Beta Textiles Inc', 
      refBill: 'BC-25-010', 
      refLC: 'LC-25-005', 
      amount: 125000.00, 
      currency: 'EUR', 
      status: TradeStatus.SWIFT_VALIDATED, 
      date: '2026-01-18' 
    },
    { 
      id: 'PR-2025-000003', 
      customer: 'Gamma Garments', 
      refBill: 'BC-25-045', 
      refLC: 'LC-25-020', 
      amount: 75000.00, 
      currency: 'USD', 
      status: TradeStatus.PENDING_APPROVAL, 
      date: '2026-01-17' 
    },
    { 
      id: 'PR-2025-000004', 
      customer: 'Delta Foods', 
      refBill: 'BC-25-067', 
      refLC: 'LC-25-033', 
      amount: 30000.00, 
      currency: 'GBP', 
      status: TradeStatus.DISCREPANCY_RAISED, 
      date: '2026-01-16',
      discrepancyReason: 'Amount mismatch with Bill value. Please clarify with remitting bank.'
    },
    { 
      id: 'PR-2025-000005', 
      customer: 'Alpha Exports Ltd', 
      refBill: 'BC-25-003', 
      refLC: 'LC-25-002', 
      amount: 100000.00, 
      currency: 'USD', 
      status: TradeStatus.REALIZED, 
      date: '2026-01-15' 
    },
  ];

  private proceeds = new BehaviorSubject<ExportProceed[]>([]);
  proceeds$ = this.proceeds.asObservable();

  constructor(private workflowService: WorkflowService) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.proceeds.next(JSON.parse(stored));
    } else {
      this.proceeds.next(this.mockProceeds);
      this.saveToStorage(this.mockProceeds);
    }
  }

  private saveToStorage(proceeds: ExportProceed[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proceeds));
  }

  getProceed(id: string) {
    return this.proceeds.pipe(
      map(items => items.find(item => item.id === id))
    );
  }

  updateStatus(id: string, status: string, reason?: string, role: string = 'SYSTEM') {
    const current = this.proceeds.getValue();
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      const currentStatus = current[index].status;
      if (!this.workflowService.canTransition('EXPORT_PROCEED', currentStatus, status, role) && role !== 'SYSTEM') {
         console.warn(`Invalid status transition from ${currentStatus} to ${status} by ${role}`);
      }

      const updated = { ...current[index], status };
      if (reason) {
        updated.discrepancyReason = reason;
      }
      current[index] = updated;
      this.proceeds.next([...current]);
      this.saveToStorage([...current]);
    }
  }

  addProceed(proceed: ExportProceed) {
    const current = this.proceeds.getValue();
    const updated = [proceed, ...current];
    this.proceeds.next(updated);
    this.saveToStorage(updated);
  }
}

