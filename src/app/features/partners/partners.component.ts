import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';

@Component({ selector: 'app-partners-workspace', standalone: true, imports: [FormsModule], templateUrl: './partners.component.html' })
export class PartnersComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly router = inject(Router);
  protected readonly user = computed(() => this.auth.currentUser()!);
  protected readonly search = signal('');
  protected readonly isSupplierView = computed(() => this.user().role === 'hospital');
  protected readonly partners = computed(() => {
    const term = this.search().trim().toLowerCase();
    const list = this.isSupplierView() ? this.data.suppliers : this.data.buyers;
    return !term ? list : list.filter((partner) => `${partner.name} ${partner.location} ${partner.type}`.toLowerCase().includes(term));
  });

  protected createOrder(partnerId: string): void {
    this.router.navigate([`/app/${this.user().role}/orders`], { queryParams: { partner: partnerId } });
  }
}
