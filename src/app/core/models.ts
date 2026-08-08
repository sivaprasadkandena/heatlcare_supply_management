export type UserRole = 'admin' | 'hospital' | 'pharmacy';
export type AccountStatus = 'approved' | 'pending' | 'declined';
export type StockStatus = 'In stock' | 'Low stock' | 'Expiring soon';
export type OrderStatus = 'Draft' | 'Pending approval' | 'Processing' | 'In transit' | 'Delivered' | 'Cancelled';

export interface AppUser {
  id: string;
  name: string;
  organization: string;
  username: string;
  password: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
}

export type SessionUser = Omit<AppUser, 'password'>;

export interface Medicine {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  manufacturer: string;
  manufactureDate: string;
  expiryDate: string;
  status: StockStatus;
  updatedAt: string;
}

export interface SupplyOrder {
  id: string;
  buyerId: string;
  supplierId: string;
  buyerName: string;
  supplierName: string;
  medicine: string;
  items: number;
  amount: number;
  createdAt: string;
  status: OrderStatus;
}

export interface Partner {
  id: string;
  initials: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  score: number;
  completedOrders: number;
  color: 'blue' | 'purple' | 'orange' | 'teal';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  kind: 'order' | 'approval' | 'inventory' | 'account';
}
