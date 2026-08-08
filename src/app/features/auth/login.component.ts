import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected username = '';
  protected password = '';
  protected showPassword = signal(false);
  protected error = signal('');

  constructor() {
    if (this.auth.currentUser()) this.router.navigateByUrl(this.homePath());
  }

  protected login(): void {
    this.error.set('');
    const result = this.auth.login(this.username, this.password);
    if (!result.success) {
      this.error.set(result.message ?? 'Unable to sign in.');
      return;
    }
    this.router.navigateByUrl(this.homePath());
  }

  protected useDemo(username: string, password: string): void {
    this.username = username;
    this.password = password;
    this.error.set('');
  }

  private homePath(): string {
    return `/app/${this.auth.currentUser()?.role ?? 'hospital'}/dashboard`;
  }
}
