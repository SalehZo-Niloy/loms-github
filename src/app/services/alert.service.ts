import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

type ButtonColor = string;

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly defaultSuccessColor = '#2563eb';

  async showSuccess(message: string, buttonColor: ButtonColor): Promise<SweetAlertResult> {
    const normalizedColor = this.normalizeColor(buttonColor);
    const icon: SweetAlertIcon = 'success';

    try {
      return await Swal.fire({
        title: 'Success',
        text: message,
        icon,
        confirmButtonText: 'OK',
        confirmButtonColor: normalizedColor,
        cancelButtonColor: normalizedColor,
        buttonsStyling: true,
        showClass: {
          popup: 'swal2-show',
        },
        hideClass: {
          popup: 'swal2-hide',
        },
        backdrop: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        focusConfirm: true,
        customClass: {
          popup: 'tf-swal-popup',
          confirmButton: 'tf-swal-confirm-button',
        },
      });
    } catch (error) {
      console.error('Error showing success alert', error);
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
        value: undefined,
      };
    }
  }

  private normalizeColor(color: ButtonColor): string {
    if (!color) {
      return this.defaultSuccessColor;
    }

    const trimmed = color.trim();
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

    if (hexPattern.test(trimmed)) {
      return trimmed;
    }

    if (/^[a-zA-Z]+$/.test(trimmed)) {
      return trimmed;
    }

    return this.defaultSuccessColor;
  }
}
