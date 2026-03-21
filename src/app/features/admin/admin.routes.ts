import { Routes } from '@angular/router';
export const ADMIN_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent) },
  { path: 'rbac', loadComponent: () => import('./rbac/rbac.component').then(m => m.RbacComponent) },
];
