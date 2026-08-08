import { Injectable, signal } from '@angular/core';
import { ActivityItem, Medicine, OrderStatus, Partner, SupplyOrder } from './models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly medicinesKey = 'medsync.medicines';
  private readonly ordersKey = 'medsync.orders';
  private readonly activitiesKey = 'medsync.activities';
  readonly medicines = signal<Medicine[]>(this.read<Medicine[]>(this.medicinesKey, this.seedMedicines()));
  readonly orders = signal<SupplyOrder[]>(this.read<SupplyOrder[]>(this.ordersKey, this.seedOrders()));
  readonly activities = signal<ActivityItem[]>(this.read<ActivityItem[]>(this.activitiesKey, this.seedActivities()));

  readonly suppliers: Partner[] = [
    { id: 'pharmacy-001', initials: 'CP', name: 'CarePoint Pharma', type: 'Licensed pharmacy', location: 'Mumbai, Maharashtra', contact: 'sales@carepoint.in', score: 4.8, completedOrders: 28, color: 'purple' },
    { id: 'supplier-002', initials: 'MD', name: 'MedPlus Distributors', type: 'National distributor', location: 'Pune, Maharashtra', contact: 'orders@medplus.in', score: 4.9, completedOrders: 36, color: 'blue' },
    { id: 'supplier-003', initials: 'NL', name: 'NovaMed Labs', type: 'Manufacturer', location: 'Bengaluru, Karnataka', contact: 'supply@novamed.in', score: 4.7, completedOrders: 22, color: 'orange' },
    { id: 'supplier-004', initials: 'AH', name: 'Astra Health', type: 'Manufacturer', location: 'Hyderabad, Telangana', contact: 'network@astrahealth.in', score: 4.8, completedOrders: 18, color: 'teal' },
  ];

  readonly buyers: Partner[] = [
    { id: 'hospital-001', initials: 'CG', name: 'City General Hospital', type: 'Multi-specialty hospital', location: 'Pune, Maharashtra', contact: 'pharmacy@citygeneral.in', score: 4.9, completedOrders: 42, color: 'blue' },
    { id: 'buyer-002', initials: 'GV', name: 'Green Valley Clinic', type: 'Primary care clinic', location: 'Nashik, Maharashtra', contact: 'supply@greenvalley.in', score: 4.8, completedOrders: 28, color: 'purple' },
    { id: 'buyer-003', initials: 'MC', name: 'Metro Care Hospital', type: 'Multi-specialty hospital', location: 'Mumbai, Maharashtra', contact: 'orders@metrocare.in', score: 4.7, completedOrders: 21, color: 'orange' },
    { id: 'buyer-004', initials: 'SM', name: 'Sunrise Medical Centre', type: 'Medical centre', location: 'Nashik, Maharashtra', contact: 'procurement@sunrise.in', score: 4.6, completedOrders: 14, color: 'teal' },
  ];

  medicinesFor(ownerId: string): Medicine[] {
    return this.medicines().filter((medicine) => medicine.ownerId === ownerId);
  }

  addMedicine(medicine: Omit<Medicine, 'id' | 'updatedAt' | 'status'>): Medicine {
    const item: Medicine = { ...medicine, id: this.id('MED'), updatedAt: new Date().toISOString(), status: this.stockStatus(medicine.quantity, medicine.expiryDate) };
    this.medicines.update((items) => [item, ...items]);
    this.persistMedicines();
    this.addActivity('inventory', `${item.name} added to inventory`, `${item.quantity.toLocaleString('en-IN')} ${item.unit} from ${item.manufacturer} were added.`);
    return item;
  }

  updateMedicine(id: string, changes: Partial<Omit<Medicine, 'id' | 'ownerId'>>): void {
    this.medicines.update((items) => items.map((item) => item.id === id ? { ...item, ...changes, updatedAt: new Date().toISOString(), status: this.stockStatus(changes.quantity ?? item.quantity, changes.expiryDate ?? item.expiryDate) } : item));
    this.persistMedicines();
  }

  deleteMedicine(id: string): void {
    const medicine = this.medicines().find((item) => item.id === id);
    this.medicines.update((items) => items.filter((item) => item.id !== id));
    this.persistMedicines();
    if (medicine) this.addActivity('inventory', `${medicine.name} removed from inventory`, 'A medicine batch was removed by its owner.');
  }

  ordersFor(userId: string, role: 'hospital' | 'pharmacy'): SupplyOrder[] {
    return this.orders().filter((order) => role === 'hospital' ? order.buyerId === userId : order.supplierId === userId);
  }

  createOrder(order: Omit<SupplyOrder, 'id' | 'createdAt' | 'status'>): SupplyOrder {
    const item: SupplyOrder = { ...order, id: this.id('ORD'), createdAt: new Date().toISOString(), status: 'Pending approval' };
    this.orders.update((orders) => [item, ...orders]);
    this.persistOrders();
    this.addActivity('order', `${item.id} created`, `${item.buyerName} ordered ${item.items} item(s) from ${item.supplierName}.`);
    return item;
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    this.orders.update((orders) => orders.map((order) => order.id === id ? { ...order, status } : order));
    this.persistOrders();
    const order = this.orders().find((entry) => entry.id === id);
    if (order) this.addActivity('order', `${id} marked ${status.toLowerCase()}`, `${order.medicine} order was updated by a supply partner.`);
  }

  deleteOrder(id: string): void {
    this.orders.update((orders) => orders.filter((order) => order.id !== id));
    this.persistOrders();
    this.addActivity('order', `${id} cancelled`, 'The draft order was removed from the supply workflow.');
  }

  addActivity(kind: ActivityItem['kind'], title: string, description: string): void {
    const item: ActivityItem = { id: this.id('ACT'), kind, title, description, createdAt: new Date().toISOString() };
    this.activities.update((items) => [item, ...items].slice(0, 60));
    this.write(this.activitiesKey, this.activities());
  }

  private persistMedicines(): void { this.write(this.medicinesKey, this.medicines()); }
  private persistOrders(): void { this.write(this.ordersKey, this.orders()); }

  private stockStatus(quantity: number, expiryDate: string): Medicine['status'] {
    const expiry = new Date(expiryDate).getTime();
    const days = Number.isNaN(expiry) ? 999 : Math.ceil((expiry - Date.now()) / 86400000);
    if (days <= 90) return 'Expiring soon';
    return quantity < 100 ? 'Low stock' : 'In stock';
  }

  private seedMedicines(): Medicine[] {
    const factory = (id: string, ownerId: string, name: string, category: string, quantity: number, unit: string, manufacturer: string, manufactureDate: string, expiryDate: string): Medicine => ({ id, ownerId, name, category, quantity, unit, manufacturer, manufactureDate, expiryDate, updatedAt: '2026-08-08T08:30:00.000Z', status: this.stockStatus(quantity, expiryDate) });
    return [
      factory('MED-10024', 'hospital-001', 'Amoxicillin 500mg', 'Antibiotics', 1280, 'capsules', 'NovaMed Labs', '2026-01-15', '2028-01-14'),
      factory('MED-10038', 'hospital-001', 'Paracetamol 650mg', 'Analgesics', 840, 'tablets', 'HealWell Pharma', '2026-03-03', '2029-03-02'),
      factory('MED-10061', 'hospital-001', 'Insulin Glargine', 'Diabetes care', 38, 'pens', 'Biocare Ltd.', '2025-11-28', '2027-11-27'),
      factory('MED-10077', 'hospital-001', 'Ceftriaxone 1g', 'Antibiotics', 220, 'vials', 'NovaMed Labs', '2024-08-09', '2026-09-08'),
      factory('MED-20024', 'pharmacy-001', 'Amoxicillin 500mg', 'Antibiotics', 1420, 'capsules', 'NovaMed Labs', '2026-01-15', '2028-01-14'),
      factory('MED-20038', 'pharmacy-001', 'Paracetamol 650mg', 'Analgesics', 920, 'tablets', 'HealWell Pharma', '2026-03-03', '2029-03-02'),
      factory('MED-20061', 'pharmacy-001', 'Insulin Glargine', 'Diabetes care', 56, 'pens', 'Biocare Ltd.', '2025-11-28', '2027-11-27'),
      factory('MED-20077', 'pharmacy-001', 'Salbutamol Inhaler', 'Respiratory care', 74, 'inhalers', 'Wellness Bio', '2025-10-08', '2027-10-07'),
    ];
  }

  private seedOrders(): SupplyOrder[] {
    return [
      { id: 'ORD-24018', buyerId: 'hospital-001', supplierId: 'pharmacy-001', buyerName: 'City General Hospital', supplierName: 'CarePoint Pharma', medicine: 'Amoxicillin 500mg', items: 12, amount: 42860, createdAt: '2026-08-08T10:24:00.000Z', status: 'In transit' },
      { id: 'ORD-24012', buyerId: 'hospital-001', supplierId: 'supplier-002', buyerName: 'City General Hospital', supplierName: 'MedPlus Distributors', medicine: 'Paracetamol 650mg', items: 8, amount: 18450, createdAt: '2026-08-06T09:00:00.000Z', status: 'Processing' },
      { id: 'ORD-23996', buyerId: 'hospital-001', supplierId: 'supplier-003', buyerName: 'City General Hospital', supplierName: 'NovaMed Labs', medicine: 'Ceftriaxone 1g', items: 16, amount: 65920, createdAt: '2026-08-04T14:00:00.000Z', status: 'Delivered' },
      { id: 'ORD-24007', buyerId: 'buyer-002', supplierId: 'pharmacy-001', buyerName: 'Green Valley Clinic', supplierName: 'CarePoint Pharma', medicine: 'Insulin Glargine', items: 5, amount: 12600, createdAt: '2026-08-08T09:40:00.000Z', status: 'Pending approval' },
      { id: 'ORD-23991', buyerId: 'buyer-003', supplierId: 'pharmacy-001', buyerName: 'Metro Care Hospital', supplierName: 'CarePoint Pharma', medicine: 'Amoxicillin 500mg', items: 9, amount: 36480, createdAt: '2026-08-05T12:00:00.000Z', status: 'Delivered' },
    ];
  }

  private seedActivities(): ActivityItem[] {
    return [
      { id: 'ACT-01', kind: 'approval', title: 'Sunrise Medical Centre submitted a registration request', description: 'Hospital application is waiting for administrative approval.', createdAt: '2026-08-08T08:00:00.000Z' },
      { id: 'ACT-02', kind: 'order', title: 'CarePoint Pharma fulfilled order ORD-24012', description: 'Eight medicine batches were marked ready for dispatch.', createdAt: '2026-08-08T06:00:00.000Z' },
      { id: 'ACT-03', kind: 'inventory', title: 'Ceftriaxone 1g is approaching expiry', description: 'This batch expires within the next 90 days.', createdAt: '2026-08-07T10:00:00.000Z' },
    ];
  }

  private read<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
  }
  private write(key: string, value: unknown): void { if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value)); }
  private id(prefix: string): string { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase(); }
}
