import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';

@Component({ selector: 'app-reports-workspace', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './reports.component.html' })
export class ReportsComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly medicines = computed(() => this.data.medicinesFor(this.user().id));
  protected readonly orders = computed(() => this.data.ordersFor(this.user().id, this.user().role as 'hospital' | 'pharmacy'));
  protected readonly delivered = computed(() => this.orders().filter((order) => order.status === 'Delivered').length);
  protected readonly stockHealth = computed(() => this.medicines().length ? Math.round((this.medicines().filter((medicine) => medicine.status === 'In stock').length / this.medicines().length) * 100) : 0);
  protected readonly inStock = computed(() => this.medicines().filter((medicine) => medicine.status === 'In stock').length);
  protected readonly lowStock = computed(() => this.medicines().filter((medicine) => medicine.status === 'Low stock').length);
  protected readonly expiring = computed(() => this.medicines().filter((medicine) => medicine.status === 'Expiring soon').length);
  protected readonly inventoryPath = computed(() => `/app/${this.user().role}/inventory`);
  protected download(): void { window.alert('Demo report download started. In production this would generate a CSV or PDF.'); }
}
