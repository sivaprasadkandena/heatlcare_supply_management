import { Component } from '@angular/core';
import { InventoryComponent } from '../features/inventory/inventory.component';

@Component({ standalone: true, imports: [InventoryComponent], template: '<app-inventory-workspace />' })
export class HospitalInventoryComponent {}
