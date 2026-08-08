import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';

@Component({ standalone: true, imports: [CommonModule, RouterLink], templateUrl: './hospital-dashboard.component.html' })
export class HospitalDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly medicines = computed(() => this.data.medicinesFor(this.user().id));
  protected readonly orders = computed(() => this.data.ordersFor(this.user().id, 'hospital'));
  protected readonly lowStock = computed(() => this.medicines().filter((item) => item.status === 'Low stock').length);
  protected readonly expiring = computed(() => this.medicines().filter((item) => item.status === 'Expiring soon').length);
  protected readonly activeOrders = computed(() => this.orders().filter((item) => !['Delivered', 'Cancelled'].includes(item.status)).length);
  protected readonly suppliers = computed(() => this.data.suppliers.slice(0, 3));
}
