import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

interface NavItem { label: string; path: string; icon: string; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly isProfileOpen = signal(false);
  protected readonly user = computed(() => this.auth.currentUser());
  protected readonly navItems = computed<NavItem[]>(() => {
    const role = this.user()?.role;
    if (role === 'admin') return [
      { label: 'Dashboard', path: '/app/admin/dashboard', icon: '▦' },
      { label: 'Partner approvals', path: '/app/admin/approvals', icon: '◈' },
      { label: 'Hospitals', path: '/app/admin/hospitals', icon: '✚' },
      { label: 'Pharmacies', path: '/app/admin/pharmacies', icon: '⌁' },
      { label: 'Activity log', path: '/app/admin/activity', icon: '◷' },
    ];
    const workspace = role === 'pharmacy' ? 'pharmacy' : 'hospital';
    const partnerLabel = role === 'pharmacy' ? 'Buyers' : 'Suppliers';
    const partnerPath = role === 'pharmacy' ? '/app/pharmacy/buyers' : '/app/hospital/suppliers';
    return [
      { label: 'Dashboard', path: `/app/${workspace}/dashboard`, icon: '▦' },
      { label: 'Inventory', path: `/app/${workspace}/inventory`, icon: '▤' },
      { label: partnerLabel, path: partnerPath, icon: '◫' },
      { label: 'Orders', path: `/app/${workspace}/orders`, icon: '▱' },
      { label: 'Reports', path: `/app/${workspace}/reports`, icon: '◔' },
    ];
  });

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
