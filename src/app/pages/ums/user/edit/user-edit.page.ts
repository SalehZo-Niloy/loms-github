import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UiInputComponent } from '../../../../components/ui/ui-input.component';
import { UiButtonComponent } from '../../../../components/ui/ui-button.component';
import { UiDropdownComponent } from '../../../../components/ui/ui-dropdown.component';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    TradeLayoutComponent,
    UiInputComponent,
    UiButtonComponent,
    UiDropdownComponent,
    RouterLink
  ],
  templateUrl: './user-edit.page.html'
})
export class UserEditPageComponent implements OnInit {
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

  userId = '';

  role = '';
  designation = '';

  roleOptions = [
    { label: 'Customer', value: 'customer' },
    { label: 'Relationship Officer', value: 'relationship-officer' },
    { label: 'Trade Officer', value: 'trade-officer' },
    { label: 'Manager', value: 'manager' },
    { label: 'Super Admin', value: 'super-admin' }
  ];

  designationOptions = [
    { label: 'Senior Officer', value: 'senior-officer' },
    { label: 'Analyst', value: 'analyst' },
    { label: 'Manager', value: 'manager' },
    { label: 'Administrator', value: 'administrator' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  goBackToList(): void {
    this.router.navigate(['/ums/users']);
  }

  save(): void {
    this.router.navigate(['/ums/users']);
  }
}
