import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';

@Component({ standalone: true, imports: [CommonModule, RouterLink], templateUrl: './admin-dashboard.component.html' })
export class AdminDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly pending = computed(() => this.auth.users().filter((account) => account.status === 'pending'));
  protected readonly hospitals = computed(() => this.auth.usersForRole('hospital'));
  protected readonly pharmacies = computed(() => this.auth.usersForRole('pharmacy'));
  protected readonly orders = computed(() => this.data.orders());
  protected readonly activities = computed(() => this.data.activities().slice(0, 4));
}
