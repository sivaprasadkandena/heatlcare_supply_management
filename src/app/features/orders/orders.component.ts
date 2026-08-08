import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { OrderStatus, Partner, SupplyOrder } from '../../core/models';

@Component({ selector: 'app-orders-workspace', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './orders.component.html' })
export class OrdersComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly route = inject(ActivatedRoute);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly filter = signal('All');
  protected readonly showModal = signal(false);
  protected form = { partnerId: '', medicine: '', items: 1, amount: 0 };
  protected readonly partners = computed<Partner[]>(() => this.user().role === 'hospital' ? this.data.suppliers : this.data.buyers);
  protected readonly orders = computed(() => this.data.ordersFor(this.user().id, this.user().role as 'hospital' | 'pharmacy'));
  protected readonly filteredOrders = computed(() => this.filter() === 'All' ? this.orders() : this.orders().filter((order) => order.status === this.filter()));
  protected readonly inProgress = computed(() => this.orders().filter((order) => !['Delivered', 'Cancelled'].includes(order.status)).length);
  protected readonly delivered = computed(() => this.orders().filter((order) => order.status === 'Delivered').length);
  protected readonly totalValue = computed(() => this.orders().reduce((total, order) => total + order.amount, 0));

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['partner']) this.openCreate(String(params['partner']));
    });
  }

  protected openCreate(partnerId = ''): void { this.form = { partnerId, medicine: '', items: 1, amount: 0 }; this.showModal.set(true); }
  protected create(): void {
    const user = this.user();
    const partner = this.partners().find((item) => item.id === this.form.partnerId);
    if (!partner || !this.form.medicine || this.form.items < 1 || this.form.amount < 1) return;
    this.data.createOrder(user.role === 'hospital'
      ? { buyerId: user.id, buyerName: user.organization, supplierId: partner.id, supplierName: partner.name, medicine: this.form.medicine, items: Number(this.form.items), amount: Number(this.form.amount) }
      : { buyerId: partner.id, buyerName: partner.name, supplierId: user.id, supplierName: user.organization, medicine: this.form.medicine, items: Number(this.form.items), amount: Number(this.form.amount) });
    this.showModal.set(false);
  }
  protected progress(order: SupplyOrder): void {
    const status: OrderStatus = this.user().role === 'hospital'
      ? 'Processing'
      : order.status === 'Pending approval' ? 'Processing' : order.status === 'Processing' ? 'In transit' : 'Delivered';
    this.data.updateOrderStatus(order.id, status);
  }
  protected actionLabel(order: SupplyOrder): string {
    if (this.user().role === 'hospital') return 'Send order';
    if (order.status === 'Pending approval') return 'Accept';
    if (order.status === 'Processing') return 'Dispatch';
    return 'Mark delivered';
  }
  protected cancel(order: SupplyOrder): void { this.data.updateOrderStatus(order.id, 'Cancelled'); }
}
