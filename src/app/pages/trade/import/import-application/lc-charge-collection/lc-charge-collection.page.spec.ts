import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LcChargeCollectionPageComponent } from './lc-charge-collection.page';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

describe('LcChargeCollectionPageComponent', () => {
  let stateService: ImportLcStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcChargeCollectionPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    stateService = TestBed.inject(ImportLcStateService);
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LcChargeCollectionPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should update header and summary reference from shared state', () => {
    const fixture = TestBed.createComponent(LcChargeCollectionPageComponent);
    const component = fixture.componentInstance;

    stateService.updateState({ lcReference: 'LC-REF-TEST' });
    fixture.detectChanges();

    expect(component.header.reference).toBe('LC-REF-TEST');
    expect(component.summary.reference).toBe('LC-REF-TEST');
  });
});
