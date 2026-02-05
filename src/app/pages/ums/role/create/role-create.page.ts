import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiInputComponent } from '../../../../components/ui/ui-input.component';
import { UiButtonComponent } from '../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-role-create-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiInputComponent, UiButtonComponent, RouterLink],
  templateUrl: './role-create.page.html'
})
export class RoleCreatePageComponent {
  menuItems = [
    {
      label: 'Users',
      route: ['/ums', 'users']
    },
    {
      label: 'Roles',
      route: ['/ums', 'roles']
    }
  ];

  roleName = '';

  constructor(private router: Router) {}

  goBackToList(): void {
    this.router.navigate(['/ums/roles']);
  }

  submit(): void {
    this.router.navigate(['/ums/roles']);
  }
}
