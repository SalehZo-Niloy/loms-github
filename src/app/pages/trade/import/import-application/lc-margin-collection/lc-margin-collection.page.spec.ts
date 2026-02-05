import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LcMarginCollectionPageComponent } from './lc-margin-collection.page';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

describe('LcMarginCollectionPageComponent', () => {
  let stateService: ImportLcStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcMarginCollectionPageComponent],
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
    const fixture = TestBed.createComponent(LcMarginCollectionPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should update header and margin summary reference from shared state', () => {
    const fixture = TestBed.createComponent(LcMarginCollectionPageComponent);
    const component = fixture.componentInstance;

    stateService.updateState({ lcReference: 'LC-REF-TEST' });
    fixture.detectChanges();

    expect(component.header.reference).toBe('LC-REF-TEST');
    expect(component.marginSummary.reference).toBe('LC-REF-TEST');
  });
});
