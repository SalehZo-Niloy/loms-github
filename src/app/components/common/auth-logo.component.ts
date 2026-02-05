import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-logo',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-2">
      <img src="era_logo.svg" alt="ERA InfoTech Limited" class="h-10 w-auto mr-4" />
      <span class="text-sm font-medium text-gray-900">
        Loan Origination and Management System
      </span>
    </div>
  `
})
export class AuthLogoComponent {}

