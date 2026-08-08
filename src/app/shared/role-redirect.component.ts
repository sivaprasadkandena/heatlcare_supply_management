import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({ standalone: true, template: '' })
export class RoleRedirectComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  ngOnInit(): void {
    const role = this.auth.currentUser()?.role;
    this.router.navigateByUrl(role ? `/app/${role}/dashboard` : '/login');
  }
}
