import { Component } from '@angular/core';
import { OrdersComponent } from '../features/orders/orders.component';

@Component({ standalone: true, imports: [OrdersComponent], template: '<app-orders-workspace />' })
export class PharmacyOrdersComponent {}
