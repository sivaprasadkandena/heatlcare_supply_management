import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';

@Component({ standalone: true, imports: [CommonModule, RouterLink], templateUrl: './pharmacy-dashboard.component.html' })
export class PharmacyDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly medicines = computed(() => this.data.medicinesFor(this.user().id));
  protected readonly orders = computed(() => this.data.ordersFor(this.user().id, 'pharmacy'));
  protected readonly pending = computed(() => this.orders().filter((item) => item.status === 'Pending approval').length);
  protected readonly fulfilment = computed(() => this.orders().filter((item) => ['Processing', 'In transit'].includes(item.status)).length);
  protected readonly lowStock = computed(() => this.medicines().filter((item) => item.status === 'Low stock').length);
  protected readonly buyers = computed(() => this.data.buyers.slice(0, 3));
}
