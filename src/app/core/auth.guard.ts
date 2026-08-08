import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from './models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.currentUser() ? true : inject(Router).createUrlTree(['/login']);
};

export const roleGuard = (...roles: UserRole[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const user = auth.currentUser();
  if (user && roles.includes(user.role)) return true;
  return inject(Router).createUrlTree([user ? `/app/${user.role}/dashboard` : '/login']);
};
