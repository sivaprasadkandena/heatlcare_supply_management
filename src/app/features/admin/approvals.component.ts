import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { AppUser } from '../../core/models';

@Component({ selector: 'app-approvals-workspace', standalone: true, imports: [CommonModule], templateUrl: './approvals.component.html' })
export class ApprovalsComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  protected readonly pending = computed(() => this.auth.users().filter((user) => user.status === 'pending'));
  protected readonly reviewed = computed(() => this.auth.users().filter((user) => user.status !== 'pending' && user.role !== 'admin'));
  protected approve(user: AppUser): void { this.auth.updateRegistration(user.id, 'approved'); this.data.addActivity('approval', `${user.organization} approved`, `${user.role} registration was approved by the administrator.`); }
  protected decline(user: AppUser): void { this.auth.updateRegistration(user.id, 'declined'); this.data.addActivity('approval', `${user.organization} declined`, `${user.role} registration was declined by the administrator.`); }
  protected remove(user: AppUser): void { this.auth.deleteUser(user.id); this.data.addActivity('account', `${user.organization} removed`, 'An organisation account was removed by the administrator.'); }
}
