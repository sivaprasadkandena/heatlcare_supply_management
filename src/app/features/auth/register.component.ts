import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected form = { name: '', organization: '', username: '', password: '', confirmPassword: '', role: 'hospital' as 'hospital' | 'pharmacy' };
  protected message = signal('');
  protected error = signal('');

  protected register(): void {
    this.error.set('');
    this.message.set('');
    if (!this.form.name || !this.form.organization || !this.form.username || !this.form.password) {
      this.error.set('Please complete every registration field.');
      return;
    }
    if (this.form.password.length < 4) {
      this.error.set('Use a password with at least 4 characters for this demo.');
      return;
    }
    if (this.form.password !== this.form.confirmPassword) {
      this.error.set('Password confirmation does not match.');
      return;
    }
    const result = this.auth.register(this.form);
    if (!result.success) {
      this.error.set(result.message);
      return;
    }
    this.data.addActivity('account', `${this.form.organization} registered`, `A new ${this.form.role} account is waiting for administrator approval.`);
    this.message.set(result.message);
    this.form = { name: '', organization: '', username: '', password: '', confirmPassword: '', role: 'hospital' };
  }
}
