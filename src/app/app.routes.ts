import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ── Landing page (redirects to /dashboard if already authenticated) ──
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full',
  },

  // ── Demo request (public) ──
  {
    path: 'demo',
    loadComponent: () => import('./features/demo/demo.component').then(m => m.DemoComponent),
  },

  // ── Auth (public) ──
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // ── Protected shell ──
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'accounts',
        loadChildren: () => import('./features/accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES)
      },
      {
        path: 'payments',
        loadChildren: () => import('./features/payments/payments.routes').then(m => m.PAYMENTS_ROUTES)
      },
      {
        path: 'loans',
        loadChildren: () => import('./features/loans/loans.routes').then(m => m.LOANS_ROUTES)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      // AGENT + ADMIN
      {
        path: 'geolocation',
        canActivate: [roleGuard],
        data: { roles: ['AGENT', 'ADMIN'] },
        loadComponent: () => import('./features/geolocation/geolocation.component').then(m => m.GeolocationComponent)
      },
      {
        path: 'workflow',
        canActivate: [roleGuard],
        data: { roles: ['AGENT', 'ADMIN'] },
        loadChildren: () => import('./features/workflow/workflow.routes').then(m => m.WORKFLOW_ROUTES)
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: ['AGENT', 'ADMIN'] },
        loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      },
      // ADMIN only
      {
        path: 'fraud',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/fraud/fraud.routes').then(m => m.FRAUD_ROUTES)
      },
      {
        path: 'orchestration',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/orchestration/orchestration.routes').then(m => m.ORCHESTRATION_ROUTES)
      },
      {
        path: 'audit',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent)
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'ai-assistant',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('./features/ai-assistant/ai.routes').then(m => m.AI_ROUTES)
      },
    ]
  },

  { path: 'forbidden', loadComponent: () => import('./shared/components/forbidden/forbidden.component').then(m => m.ForbiddenComponent) },
  { path: '**',        loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
