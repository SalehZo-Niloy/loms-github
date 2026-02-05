import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiTableComponent } from '../../components/ui/ui-table.component';
import { CommonFooterComponent } from '../../components/common/common-footer.component';
import { UserMenuComponent } from '../../components/common/user-menu.component';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, UiTableComponent, CommonFooterComponent, UserMenuComponent],
  templateUrl: './dashboard.page.html',
})
export class DashboardPageComponent {
  theme = tradeTheme;

  solutions = [
    // {
    //   id: 'trade-finance',
    //   label: 'Trade Finance',
    //   category: 'Core Solution',
    //   description: 'Process guarantees, letters of credit and export transactions in one place.',
    //   accent: 'bg-blue-50 text-blue-700',
    // },
    // {
    //   id: 'trade-finance-customer',
    //   label: 'Trade Finance (Customer)',
    //   category: 'Customer Portal',
    //   description: 'Customer-facing workspace to initiate and track trade requests.',
    //   accent: 'bg-emerald-50 text-emerald-700',
    // },
    {
      id: 'loms',
      label: 'Loan Origination and Management System',
      category: 'Core Solution',
      description: 'Loan origination, processing, and management in one place.',
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'ums',
      label: 'User Management',
      category: 'Administration',
      description: 'Manage users, roles and access across all trade solutions.',
      accent: 'bg-indigo-50 text-indigo-700',
    },
    // {
    //   id: 'work-flow',
    //   label: 'Workflow',
    //   category: 'Operations',
    //   description: 'Configure and monitor approval workflows across modules.',
    //   accent: 'bg-amber-50 text-amber-700',
    // },
  ];

  users = [
    {
      name: 'Rahim Uddin',
      email: 'rahim.uddin@example.com',
      role: 'User',
      status: 'Active',
    },
    {
      name: 'Fatema Begum',
      email: 'fatema.begum@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      name: 'Sajib Ahmed',
      email: 'sajib.ahmed@example.com',
      role: 'User',
      status: 'Invited',
    },
    {
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@example.com',
      role: 'User',
      status: 'Suspended',
    },
  ];

  constructor(private router: Router) {}

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter((user) => user.status === 'Active').length;
  }

  get invitedUsers(): number {
    return this.users.filter((user) => user.status === 'Invited').length;
  }

  getUserInitials(name: string): string {
    if (!name) {
      return '';
    }

    return name
      .split(' ')
      .filter((part) => part && part.length > 0)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return this.theme.status.success;
      case 'Invited':
        return this.theme.status.info;
      case 'Suspended':
        return this.theme.status.danger;
      default:
        return this.theme.status.neutral;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Active':
        return 'Active user';
      case 'Invited':
        return 'Invite sent';
      case 'Suspended':
        return 'Suspended';
      default:
        return status;
    }
  }

  goToSolution(solution: string): void {
    if (solution === 'trade-finance') {
      this.router.navigate(['/trade/dashboard']);
      return;
    }

    if (solution === 'trade-finance-customer') {
      if (typeof window !== 'undefined') {
        window.open('https://tradefinanceconfig.netlify.app/', '_blank');
      }
      return;
    }

    if (solution === 'work-flow') {
      this.router.navigate(['/workflow/work-flow']);
      return;
    }

    if (solution === 'corporate-internet-banking') {
      this.router.navigate(['/trade/dashboard']);
      return;
    }

    if (solution === 'ums') {
      this.router.navigate(['/ums/users']);
      return;
    }
    if (solution === 'loms') {
      this.router.navigate(['/loms/dashboard']);
      return;
    }
  }
}
