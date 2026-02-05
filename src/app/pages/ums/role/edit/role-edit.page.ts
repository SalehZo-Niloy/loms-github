import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UiInputComponent } from '../../../../components/ui/ui-input.component';
import { UiButtonComponent } from '../../../../components/ui/ui-button.component';
import { TradeLayoutComponent } from '../../../../styles/layout/trade-layout.component';

@Component({
  selector: 'app-role-edit-page',
  standalone: true,
  imports: [CommonModule, TradeLayoutComponent, UiInputComponent, UiButtonComponent, RouterLink],
  templateUrl: './role-edit.page.html'
})
export class RoleEditPageComponent implements OnInit {
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

  roleId = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  goBackToList(): void {
    this.router.navigate(['/ums/roles']);
  }

  save(): void {
    this.router.navigate(['/ums/roles']);
  }
}
