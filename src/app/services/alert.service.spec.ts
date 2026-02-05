import { TestBed } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService],
    });

    service = TestBed.inject(AlertService);
  });

  it('uses provided hex color for button styling', async () => {
    const fireSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
        value: true,
      }),
    );

    await service.showSuccess('Test message', '#ff0000');

    expect(fireSpy).toHaveBeenCalled();
    const args = fireSpy.calls.mostRecent().args[0] as any;
    expect(args.confirmButtonColor).toBe('#ff0000');
    expect(args.cancelButtonColor).toBe('#ff0000');
    expect(args.icon).toBe('success');
  });

  it('accepts named CSS colors', async () => {
    const fireSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
        value: true,
      }),
    );

    await service.showSuccess('Test message', 'green');

    const args = fireSpy.calls.mostRecent().args[0] as any;
    expect(args.confirmButtonColor).toBe('green');
    expect(args.cancelButtonColor).toBe('green');
  });

  it('falls back to default color for invalid input', async () => {
    const fireSpy = spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
        value: true,
      }),
    );

    await service.showSuccess('Test message', 'not-a-valid-color#');

    const args = fireSpy.calls.mostRecent().args[0] as any;
    expect(args.confirmButtonColor).toBe('#16a34a');
    expect(args.cancelButtonColor).toBe('#16a34a');
  });

  it('handles errors from SweetAlert gracefully', async () => {
    const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.reject(new Error('Swal failure')));

    const result = await service.showSuccess('Test message', '#000000');

    expect(fireSpy).toHaveBeenCalled();
    expect(result.isDismissed).toBeTrue();
    expect(result.isConfirmed).toBeFalse();
  });
});

