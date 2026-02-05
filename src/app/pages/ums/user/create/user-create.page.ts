import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiInputComponent } from '../../../../components/ui/ui-input.component';
import { UiButtonComponent } from '../../../../components/ui/ui-button.component';
import { UiDropdownComponent } from '../../../../components/ui/ui-dropdown.component';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [
    CommonModule,
    TradeLayoutComponent,
    UiInputComponent,
    UiButtonComponent,
    UiDropdownComponent,
    RouterLink
  ],
  templateUrl: './user-create.page.html'
})
export class UserCreatePageComponent {
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

  fullName = '';
  username = '';
  email = '';
  mobileNumber = '';

  role = '';
  designation = '';
  branch = '';
  department = '';

  roleOptions = [
    { label: 'Relationship Manager', value: 'relationship-manager' },
    { label: 'Sub-Manager', value: 'sub-manager' },
    { label: 'Branch Manager', value: 'branch-manager' },
    { label: 'Central Processing Unit', value: 'central-processing-unit' },
    { label: 'Credit Risk Analyst', value: 'credit-risk-analyst' },
    { label: 'Credit Approver', value: 'credit-approver' },
    { label: 'Chief Risk Officer', value: 'chief-risk-officer' },
    { label: 'MD', value: 'md' }
  ];

  designationOptions = [
    { label: 'Senior Officer', value: 'senior-officer' },
    { label: 'Analyst', value: 'analyst' },
    { label: 'Manager', value: 'manager' },
    { label: 'Administrator', value: 'administrator' }
  ];

   branchOptions = [
    { label: 'Head Office - Dhaka', value: 'dhaka-head-office' },
    { label: 'Gulshan Branch - Dhaka', value: 'dhaka-gulshan' },
    { label: 'Motijheel Branch - Dhaka', value: 'dhaka-motijheel' },
    { label: 'Chattogram Branch', value: 'chattogram' },
    { label: 'Sylhet Branch', value: 'sylhet' }
  ];

  departmentOptions = [
    { label: 'Corporate Banking', value: 'corporate-banking' },
    { label: 'Trade Operations', value: 'trade-operations' },
    { label: 'Risk Management', value: 'risk-management' },
    { label: 'Technology', value: 'technology' }
  ];

  constructor(private router: Router) {}

  goBackToList(): void {
    this.router.navigate(['/ums/users']);
  }

  submit(): void {
    this.router.navigate(['/ums/users']);
  }
}
