import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ImportCustomerViewPageComponent } from './customer-view.page';

describe('ImportCustomerViewPageComponent', () => {
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    navigateSpy = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [ImportCustomerViewPageComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: navigateSpy,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { reference: 'LCTEST123' },
              queryParamMap: convertToParamMap({ reference: 'LCTEST123' }),
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ImportCustomerViewPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should navigate back to submitting page with existing query params', async () => {
    const fixture = TestBed.createComponent(ImportCustomerViewPageComponent);
    const component = fixture.componentInstance;

    await component.goBackToSubmitting();

    expect(navigateSpy).toHaveBeenCalledWith(['/trade', 'import', 'submitting'], {
      queryParams: { reference: 'LCTEST123' },
    });
  });

  it('should render timeline with first step completed by default', () => {
    const fixture = TestBed.createComponent(ImportCustomerViewPageComponent);
    fixture.detectChanges();

    const circles = fixture.debugElement.queryAll(By.css('[data-testid="step-circle"]'));
    expect(circles.length).toBeGreaterThan(0);
    expect(circles[0].nativeElement.className).toContain('bg-emerald-500');

    if (circles.length > 1) {
      expect(circles[1].nativeElement.className).not.toContain('bg-emerald-500');
    }
  });

  it('should update timeline when workflow progresses', () => {
    const fixture = TestBed.createComponent(ImportCustomerViewPageComponent);
    const component = fixture.componentInstance;

    component.currentStepIndex = 2;
    fixture.detectChanges();

    const circles = fixture.debugElement.queryAll(By.css('[data-testid="step-circle"]'));
    expect(circles.length).toBeGreaterThan(2);
    expect(circles[0].nativeElement.className).toContain('bg-emerald-500');
    expect(circles[1].nativeElement.className).toContain('bg-emerald-500');
    expect(circles[2].nativeElement.className).toContain('bg-emerald-500');
  });

  it('should render responsive timeline container classes', () => {
    const fixture = TestBed.createComponent(ImportCustomerViewPageComponent);
    fixture.detectChanges();

    const timelineContainer = fixture.debugElement.query(By.css('app-ui-step-timeline'));
    expect(timelineContainer).toBeTruthy();
  });
});
