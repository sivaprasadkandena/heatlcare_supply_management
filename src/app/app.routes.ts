import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';
import { ShellComponent } from './shared/shell.component';
import { RoleRedirectComponent } from './shared/role-redirect.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { AdminApprovalsComponent } from './admin/admin-approvals.component';
import { AdminHospitalsComponent } from './admin/admin-hospitals.component';
import { AdminPharmaciesComponent } from './admin/admin-pharmacies.component';
import { AdminActivityComponent } from './admin/admin-activity.component';
import { HospitalDashboardComponent } from './hospital/hospital-dashboard.component';
import { HospitalInventoryComponent } from './hospital/hospital-inventory.component';
import { HospitalSuppliersComponent } from './hospital/hospital-suppliers.component';
import { HospitalOrdersComponent } from './hospital/hospital-orders.component';
import { HospitalReportsComponent } from './hospital/hospital-reports.component';
import { PharmacyDashboardComponent } from './pharmacy/pharmacy-dashboard.component';
import { PharmacyInventoryComponent } from './pharmacy/pharmacy-inventory.component';
import { PharmacyBuyersComponent } from './pharmacy/pharmacy-buyers.component';
import { PharmacyOrdersComponent } from './pharmacy/pharmacy-orders.component';
import { PharmacyReportsComponent } from './pharmacy/pharmacy-reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Sign in | MedSync' },
  { path: 'register', component: RegisterComponent, title: 'Register | MedSync' },
  {
    path: 'app', component: ShellComponent, canActivate: [authGuard], children: [
      { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [roleGuard('admin')] },
      { path: 'admin/approvals', component: AdminApprovalsComponent, canActivate: [roleGuard('admin')] },
      { path: 'admin/hospitals', component: AdminHospitalsComponent, canActivate: [roleGuard('admin')] },
      { path: 'admin/pharmacies', component: AdminPharmaciesComponent, canActivate: [roleGuard('admin')] },
      { path: 'admin/activity', component: AdminActivityComponent, canActivate: [roleGuard('admin')] },
      { path: 'hospital/dashboard', component: HospitalDashboardComponent, canActivate: [roleGuard('hospital')] },
      { path: 'hospital/inventory', component: HospitalInventoryComponent, canActivate: [roleGuard('hospital')] },
      { path: 'hospital/suppliers', component: HospitalSuppliersComponent, canActivate: [roleGuard('hospital')] },
      { path: 'hospital/orders', component: HospitalOrdersComponent, canActivate: [roleGuard('hospital')] },
      { path: 'hospital/reports', component: HospitalReportsComponent, canActivate: [roleGuard('hospital')] },
      { path: 'pharmacy/dashboard', component: PharmacyDashboardComponent, canActivate: [roleGuard('pharmacy')] },
      { path: 'pharmacy/inventory', component: PharmacyInventoryComponent, canActivate: [roleGuard('pharmacy')] },
      { path: 'pharmacy/buyers', component: PharmacyBuyersComponent, canActivate: [roleGuard('pharmacy')] },
      { path: 'pharmacy/orders', component: PharmacyOrdersComponent, canActivate: [roleGuard('pharmacy')] },
      { path: 'pharmacy/reports', component: PharmacyReportsComponent, canActivate: [roleGuard('pharmacy')] },
      { path: '', component: RoleRedirectComponent },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
