import { TestBed } from '@angular/core/testing';
import { WorkflowService, TradeStatus } from './workflow.service';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Request Transitions', () => {
    it('should allow CUSTOMER to transition from DRAFT to SUBMITTED', () => {
      const result = service.canTransition('REQUEST', TradeStatus.DRAFT, TradeStatus.SUBMITTED, 'CUSTOMER');
      expect(result).toBeTrue();
    });

    it('should NOT allow RO to transition from DRAFT to SUBMITTED', () => {
      const result = service.canTransition('REQUEST', TradeStatus.DRAFT, TradeStatus.SUBMITTED, 'RO');
      expect(result).toBeFalse();
    });

    it('should allow RO to transition from SUBMITTED to RO_VALIDATION', () => {
      const result = service.canTransition('REQUEST', TradeStatus.SUBMITTED, TradeStatus.RO_VALIDATION, 'RO');
      expect(result).toBeTrue();
    });

    it('should allow TO to transition from TO_TRADE_OFFICER to PENDING_APPROVAL', () => {
      const result = service.canTransition('REQUEST', TradeStatus.TO_TRADE_OFFICER, TradeStatus.PENDING_APPROVAL, 'TO');
      expect(result).toBeTrue();
    });

    it('should allow APPROVER to transition from PENDING_APPROVAL to APPROVED', () => {
      const result = service.canTransition('REQUEST', TradeStatus.PENDING_APPROVAL, TradeStatus.APPROVED, 'APPROVER');
      expect(result).toBeTrue();
    });
  });

  describe('Export Bill Transitions', () => {
    it('should allow TO to transition from SUBMITTED to VERIFIED', () => {
      const result = service.canTransition('EXPORT_BILL', TradeStatus.SUBMITTED, TradeStatus.VERIFIED, 'TO');
      expect(result).toBeTrue();
    });

    it('should allow APPROVER to transition from VERIFIED to APPROVED', () => {
      const result = service.canTransition('EXPORT_BILL', TradeStatus.VERIFIED, TradeStatus.APPROVED, 'APPROVER');
      expect(result).toBeTrue();
    });
  });

  describe('Export Proceed Transitions', () => {
    it('should allow SYSTEM to transition from SUBMITTED to SWIFT_VALIDATED', () => {
      const result = service.canTransition('EXPORT_PROCEED', TradeStatus.SUBMITTED, TradeStatus.SWIFT_VALIDATED, 'SYSTEM');
      expect(result).toBeTrue();
    });

    it('should allow TO to transition from SWIFT_VALIDATED to PENDING_APPROVAL', () => {
      const result = service.canTransition('EXPORT_PROCEED', TradeStatus.SWIFT_VALIDATED, TradeStatus.PENDING_APPROVAL, 'TO');
      expect(result).toBeTrue();
    });
  });
});
