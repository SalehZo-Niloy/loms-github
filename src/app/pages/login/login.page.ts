import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { AuthLogoComponent } from '../../components/common/auth-logo.component';
import { tradeTheme } from '../../styles/theme';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, AuthLogoComponent, ...HlmFieldImports, ...HlmButtonImports],
  templateUrl: './login.page.html'
})
export class LoginPageComponent implements OnInit {
  username = '';
  password = '';
  isPasswordVisible = false;

  theme = tradeTheme;

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const credentials: Array<{ username: string; password: string; role: string }> = [
      { username: 'customer', password: '123456', role: 'customer' },
      { username: 'ro', password: '123456', role: 'relationship-officer' },
      { username: 'rm', password: '123456', role: 'relationship-manager' },
      { username: 'to', password: '123456', role: 'trade-officer' },
      { username: 'manager', password: '123456', role: 'manager' },
      { username: 'admin', password: '123456', role: 'super-admin' }
    ];

    const match = credentials.find((c) => c.username === this.username && c.password === this.password);

    if (match) {
      window.localStorage.setItem('currentUser', JSON.stringify(match));
      this.router.navigate(['/dashboard']);
    }
  }
}
