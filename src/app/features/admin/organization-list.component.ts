import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { UserRole } from '../../core/models';

@Component({ selector: 'app-organization-workspace', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './organization-list.component.html' })
export class OrganizationListComponent {
  private readonly auth = inject(AuthService);
  protected readonly search = signal('');
  @Input({ required: true }) role!: UserRole;
  protected get title(): string { return this.role === 'hospital' ? 'Hospitals' : 'Pharmacies'; }
  protected readonly accounts = computed(() => {
    const term = this.search().trim().toLowerCase();
    const users = this.auth.usersForRole(this.role);
    return !term ? users : users.filter((user) => `${user.organization} ${user.name} ${user.username}`.toLowerCase().includes(term));
  });
}
