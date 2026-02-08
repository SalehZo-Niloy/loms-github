import { TestBed } from '@angular/core/testing';
import { CibStateService } from './cib-state.service';

describe('CibStateService', () => {
  let service: CibStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CibStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should bootstrap demo personas', () => {
    const state = service.getState();
    expect(state.personas.length).toBeGreaterThan(0);
  });

  it('should initiate requests for selected applications', () => {
    const firstAppId = service.getState().personas[0]?.appId;
    if (!firstAppId) {
      fail('No personas available in initial state');
    }
    service.initiateRequests([firstAppId]);
    const updated = service.getState().personas.find(p => p.appId === firstAppId);
    expect(updated?.status === 'Initiated' || updated?.status === 'Draft').toBeTrue();
  });

  it('should assign officer and update status', () => {
    const firstAppId = service.getState().personas[0]?.appId;
    if (!firstAppId) {
      fail('No personas available in initial state');
    }
    service.assignOfficer([firstAppId], 'Test Officer', 'Normal', '2026-02-07', 'For testing');
    const assignment = service.getAssignment(firstAppId);
    expect(assignment).toBeTruthy();
    expect(assignment?.assignedOfficer).toBe('Test Officer');
  });

  it('should start data entry and create finalization form', () => {
    const firstAppId = service.getState().personas[0]?.appId;
    if (!firstAppId) {
      fail('No personas available in initial state');
    }
    service.startDataEntry(firstAppId);
    const state = service.getState();
    expect(state.finalizations[firstAppId]).toBeTruthy();
  });
});

