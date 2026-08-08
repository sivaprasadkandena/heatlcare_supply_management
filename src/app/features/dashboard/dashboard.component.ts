import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly medicines = computed(() => {
    const user = this.user();
    return user.role === 'admin' ? this.data.medicines() : this.data.medicinesFor(user.id);
  });
  protected readonly orders = computed(() => {
    const user = this.user();
    if (user.role === 'admin') return this.data.orders();
    return this.data.ordersFor(user.id, user.role);
  });
  protected readonly partners = computed(() => this.user().role === 'pharmacy' ? this.data.buyers : this.data.suppliers);
  protected readonly pending = computed(() => this.auth.users().filter((user) => user.status === 'pending'));
  protected readonly lowStock = computed(() => this.medicines().filter((medicine) => medicine.status === 'Low stock').length);
  protected readonly expiring = computed(() => this.medicines().filter((medicine) => medicine.status === 'Expiring soon').length);
  protected readonly openOrders = computed(() => this.orders().filter((order) => order.status !== 'Delivered' && order.status !== 'Cancelled').length);
}
