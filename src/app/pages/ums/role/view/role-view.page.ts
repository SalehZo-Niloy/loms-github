import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiTableComponent } from '../../../../components/ui/ui-table.component';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-role-view-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiTableComponent, RouterLink],
  templateUrl: './role-view.page.html'
})
export class RoleViewPageComponent {
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

  roles = [
    {
      id: 'customer',
      name: 'Customer',
      description: 'Corporate customer initiating trade requests and viewing status.',
      users: 24,
      status: 'Active'
    },
    {
      id: 'relationship-officer',
      name: 'Relationship Officer',
      description: 'Front-office officer managing customer relationships and requests.',
      users: 10,
      status: 'Active'
    },
    {
      id: 'trade-officer',
      name: 'Trade Officer',
      description: 'Operations user processing and verifying guarantees and SWIFT messages.',
      users: 8,
      status: 'Active'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Manager overseeing trade volumes, approvals and workflows.',
      users: 4,
      status: 'Active'
    },
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full access across trade and user management modules.',
      users: 1,
      status: 'Active'
    }
  ];
}
