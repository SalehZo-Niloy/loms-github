import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ImportLcIssuancePageComponent } from './lc-issuance.page';
import { ImportLcStateService } from '../../../../../services/import-lc-state.service';

describe('ImportLcIssuancePageComponent', () => {
  let stateService: ImportLcStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportLcIssuancePageComponent],
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
    const fixture = TestBed.createComponent(ImportLcIssuancePageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialise LC reference control and shared state', () => {
    const fixture = TestBed.createComponent(ImportLcIssuancePageComponent);
    const component = fixture.componentInstance;

    component.fetchAvailableLcReferences();

    expect(component.lcOptions.length).toBeGreaterThan(0);
    expect(component.lcReferenceControl.value).toBe(component.lcOptions[0]);

    const state = stateService.getState();
    expect(state.lcReference).toBe(component.lcOptions[0]);
  });

  it('should update header when reference control changes', () => {
    const fixture = TestBed.createComponent(ImportLcIssuancePageComponent);
    const component = fixture.componentInstance;

    component.fetchAvailableLcReferences();

    const targetReference = component.lcOptions[0];
    component.lcReferenceControl.setValue(targetReference);

    expect(component.header.reference).toBe(targetReference);
  });

  it('should render dropdown with options', () => {
    const fixture = TestBed.createComponent(ImportLcIssuancePageComponent);
    const component = fixture.componentInstance;

    component.fetchAvailableLcReferences();
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('select'));
    expect(select).toBeTruthy();

    const options = select.nativeElement.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
  });
});
