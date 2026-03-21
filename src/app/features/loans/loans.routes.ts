import { Routes } from '@angular/router';
export const LOANS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./loans-list/loans-list.component').then(m => m.LoansListComponent) },
  { path: 'apply', loadComponent: () => import('./loan-apply/loan-apply.component').then(m => m.LoanApplyComponent) },
  { path: 'simulator', loadComponent: () => import('./loan-simulator/loan-simulator.component').then(m => m.LoanSimulatorComponent) },
  { path: ':id', loadComponent: () => import('./loan-detail/loan-detail.component').then(m => m.LoanDetailComponent) },
];
