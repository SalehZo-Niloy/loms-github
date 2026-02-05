import { Injectable } from '@angular/core';

export type TransactionType = 'REQUEST' | 'EXPORT_BILL' | 'EXPORT_PROCEED';

export enum TradeStatus {
  // Common
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  RETURNED = 'RETURNED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',

  // Request Specific
  RO_VALIDATION = 'RO_VALIDATION',
  TO_TRADE_OFFICER = 'TO_TRADE_OFFICER',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  DC_ADVICE_ISSUED = 'DC_ADVICE_ISSUED',
  RETURNED_TO_CUSTOMER = 'RETURNED_TO_CUSTOMER',

  // Export Bill Specific
  VERIFIED = 'VERIFIED',
  SENT_TO_IMPORTER = 'SENT_TO_IMPORTER',

  // Export Proceed Specific
  SWIFT_VALIDATED = 'SWIFT_VALIDATED',
  DISCREPANCY_RAISED = 'DISCREPANCY_RAISED',
  REALIZED = 'REALIZED'
}

export interface StatusTransition {
  from: TradeStatus;
  to: TradeStatus;
  allowedRoles: string[]; // 'CUSTOMER', 'RO', 'TO', 'APPROVER', 'SYSTEM'
  requiresComment?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  
  private transitions: Record<TransactionType, StatusTransition[]> = {
    'REQUEST': [
      { from: TradeStatus.DRAFT, to: TradeStatus.SUBMITTED, allowedRoles: ['CUSTOMER'] },
      { from: TradeStatus.SUBMITTED, to: TradeStatus.RO_VALIDATION, allowedRoles: ['SYSTEM', 'RO'] },
      { from: TradeStatus.RO_VALIDATION, to: TradeStatus.TO_TRADE_OFFICER, allowedRoles: ['RO'] },
      { from: TradeStatus.RO_VALIDATION, to: TradeStatus.RETURNED_TO_CUSTOMER, allowedRoles: ['RO'], requiresComment: true },
      { from: TradeStatus.TO_TRADE_OFFICER, to: TradeStatus.PENDING_APPROVAL, allowedRoles: ['TO'] },
      { from: TradeStatus.TO_TRADE_OFFICER, to: TradeStatus.RETURNED, allowedRoles: ['TO'], requiresComment: true }, // Returned to RO
      { from: TradeStatus.PENDING_APPROVAL, to: TradeStatus.APPROVED, allowedRoles: ['APPROVER'] },
      { from: TradeStatus.PENDING_APPROVAL, to: TradeStatus.RETURNED, allowedRoles: ['APPROVER'], requiresComment: true },
      { from: TradeStatus.APPROVED, to: TradeStatus.DC_ADVICE_ISSUED, allowedRoles: ['SYSTEM', 'TO'] }
    ],
    'EXPORT_BILL': [
      { from: TradeStatus.DRAFT, to: TradeStatus.SUBMITTED, allowedRoles: ['CUSTOMER'] },
      { from: TradeStatus.SUBMITTED, to: TradeStatus.VERIFIED, allowedRoles: ['TO'] },
      { from: TradeStatus.SUBMITTED, to: TradeStatus.RETURNED, allowedRoles: ['TO'], requiresComment: true },
      { from: TradeStatus.VERIFIED, to: TradeStatus.APPROVED, allowedRoles: ['APPROVER'] },
      { from: TradeStatus.APPROVED, to: TradeStatus.SENT_TO_IMPORTER, allowedRoles: ['TO', 'SYSTEM'] }
    ],
    'EXPORT_PROCEED': [
      { from: TradeStatus.SUBMITTED, to: TradeStatus.SWIFT_VALIDATED, allowedRoles: ['SYSTEM', 'TO'] },
      { from: TradeStatus.SWIFT_VALIDATED, to: TradeStatus.PENDING_APPROVAL, allowedRoles: ['TO'] },
      { from: TradeStatus.SWIFT_VALIDATED, to: TradeStatus.DISCREPANCY_RAISED, allowedRoles: ['TO'], requiresComment: true },
      { from: TradeStatus.PENDING_APPROVAL, to: TradeStatus.REALIZED, allowedRoles: ['APPROVER'] }
    ]
  };

  constructor() { }

  canTransition(type: TransactionType, currentStatus: string, newStatus: string, role: string): boolean {
    const validTransitions = this.transitions[type];
    if (!validTransitions) return false;

    const transition = validTransitions.find(t => t.from === currentStatus && t.to === newStatus);
    if (!transition) return false;

    return transition.allowedRoles.includes(role);
  }

  getAvailableTransitions(type: TransactionType, currentStatus: string, role: string): StatusTransition[] {
    const validTransitions = this.transitions[type];
    if (!validTransitions) return [];

    return validTransitions.filter(t => t.from === currentStatus && t.allowedRoles.includes(role));
  }

  getNextStatus(type: TransactionType, currentStatus: string): string | null {
    // Helper for simple linear flows (optional)
    return null; 
  }
}
