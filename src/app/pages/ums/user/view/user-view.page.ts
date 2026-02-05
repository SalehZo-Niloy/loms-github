import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiTableComponent } from '../../../../components/ui/ui-table.component';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';
import { tradeTheme } from '../../../../styles/theme';

@Component({
  selector: 'app-user-view-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiTableComponent, RouterLink],
  templateUrl: './user-view.page.html'
})
export class UserViewPageComponent {
  theme = tradeTheme;

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

  users = [
    {
      id: 'customer',
      name: 'Corporate Customer',
      email: 'customer@example.com',
      role: 'Customer',
      designation: 'Client',
      status: 'Active'
    },
    {
      id: 'ro',
      name: 'Relationship Officer',
      email: 'ro@example.com',
      role: 'Relationship Officer',
      designation: 'Officer',
      status: 'Active'
    },
    {
      id: 'to',
      name: 'Trade Officer',
      email: 'to@example.com',
      role: 'Trade Officer',
      designation: 'Officer',
      status: 'Active'
    },
    {
      id: 'manager',
      name: 'Trade Manager',
      email: 'manager@example.com',
      role: 'Manager',
      designation: 'Manager',
      status: 'Active'
    },
    {
      id: 'admin',
      name: 'Super Admin',
      email: 'admin@example.com',
      role: 'Super Admin',
      designation: 'Administrator',
      status: 'Active'
    }
  ];
}
