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
      id: 'relationship-manager',
      name: 'Relationship Manager',
      description: 'Manages customer relationships and leads loan origination activities.',
      users: 24,
      status: 'Active'
    },
    {
      id: 'sub-manager',
      name: 'Sub-Manager',
      description: 'Supports branch manager in supervising lending and operations.',
      users: 10,
      status: 'Active'
    },
    {
      id: 'branch-manager',
      name: 'Branch Manager',
      description: 'Leads branch business, approvals and overall performance.',
      users: 8,
      status: 'Active'
    },
    {
      id: 'central-processing-unit',
      name: 'Central Processing Unit',
      description: 'Central team handling documentation, verification and processing.',
      users: 6,
      status: 'Active'
    },
    {
      id: 'credit-risk-analyst',
      name: 'Credit Risk Analyst',
      description: 'Analyzes credit risk, prepares assessments and recommendations.',
      users: 4,
      status: 'Active'
    },
    {
      id: 'credit-approver',
      name: 'Credit Approver',
      description: 'Approves credit proposals within delegated authority limits.',
      users: 3,
      status: 'Active'
    },
    {
      id: 'chief-risk-officer',
      name: 'Chief Risk Officer',
      description: 'Oversees enterprise credit risk and policy governance.',
      users: 1,
      status: 'Active'
    },
    {
      id: 'md',
      name: 'MD',
      description: 'Overall head of the institution with final decision authority.',
      users: 1,
      status: 'Active'
    }
  ];
}
