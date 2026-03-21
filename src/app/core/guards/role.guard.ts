import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth     = inject(AuthService);
  const router   = inject(Router);
  const required = route.data['roles'] as Role[];

  if (!required || required.length === 0) return true;

  const user = auth.currentUser();
  if (!user) { router.navigate(['/auth/login']); return false; }

  if (required.includes(user.role)) return true;

  router.navigate(['/forbidden']);
  return false;
};
