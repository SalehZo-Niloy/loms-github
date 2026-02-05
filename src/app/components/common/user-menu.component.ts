import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        type="button"
        class="flex items-center gap-3 rounded-full border px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
        [ngClass]="[theme.border.default, theme.surface.card]"
        (click)="toggleUserMenu()"
      >
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {{ initial || 'U' }}
        </div>
        <span class="text-sm font-medium text-slate-900">
          {{ username || 'User' }}
        </span>
        <span class="text-xs text-slate-500">&#9662;</span>
      </button>
      <div
        *ngIf="userMenuOpen"
        class="absolute right-0 mt-2 w-40 rounded-lg border py-1 text-sm shadow-lg"
        [ngClass]="[theme.border.default, theme.surface.card]"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
          (click)="logout()"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  `
})
export class UserMenuComponent implements OnInit {
  username = '';
  initial = '';
  userMenuOpen = false;

  theme = tradeTheme;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const raw = window.localStorage.getItem('currentUser');

    if (!raw) {
      return;
    }

    try {
      const current: { username?: string } = JSON.parse(raw);

      if (current && current.username) {
        this.username = current.username;
        this.initial = current.username.charAt(0).toUpperCase();
      }
    } catch {
      return;
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }

    this.router.navigate(['/']);
  }
}
