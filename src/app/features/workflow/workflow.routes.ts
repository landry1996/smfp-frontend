import { Routes } from '@angular/router';
export const WORKFLOW_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent) },
  { path: 'approvals', loadComponent: () => import('./approvals/approvals.component').then(m => m.ApprovalsComponent) },
];
