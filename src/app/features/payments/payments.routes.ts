import { Routes } from '@angular/router';
export const PAYMENTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./payments-list/payments-list.component').then(m => m.PaymentsListComponent) },
  { path: 'transfer', loadComponent: () => import('./transfer/transfer.component').then(m => m.TransferComponent) },
  { path: 'mobile-money', loadComponent: () => import('./mobile-money/mobile-money.component').then(m => m.MobileMoneyComponent) },
];
