import { Routes } from '@angular/router';
export const FRAUD_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./fraud-dashboard/fraud-dashboard.component').then(m => m.FraudDashboardComponent) },
  { path: 'alerts', loadComponent: () => import('./fraud-alerts/fraud-alerts.component').then(m => m.FraudAlertsComponent) },
  { path: 'rules', loadComponent: () => import('./fraud-rules/fraud-rules.component').then(m => m.FraudRulesComponent) },
  { path: 'patterns', loadComponent: () => import('./fraud-patterns/fraud-patterns.component').then(m => m.FraudPatternsComponent) },
];
