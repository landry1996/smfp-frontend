import { Routes } from '@angular/router';
export const ORCHESTRATION_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent) },
  { path: 'dags', loadComponent: () => import('./dags/dags.component').then(m => m.DagsComponent) },
];
