import { Pipe, PipeTransform } from '@angular/core';

const BASE = 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium';
const DEFAULT = `${BASE} bg-gray-100 text-gray-600`;

const STATUS_MAP: Record<string, string> = {
  // Generic
  ACTIVE:      `${BASE} bg-green-100 text-green-700`,
  INACTIVE:    DEFAULT,
  CLOSED:      DEFAULT,
  PENDING:     `${BASE} bg-yellow-100 text-yellow-700`,
  APPROVED:    `${BASE} bg-blue-100 text-blue-700`,
  REJECTED:    `${BASE} bg-red-100 text-red-700`,
  CANCELLED:   DEFAULT,
  BLOCKED:     `${BASE} bg-red-100 text-red-700`,
  // Payments
  COMPLETED:   `${BASE} bg-green-100 text-green-700`,
  FAILED:      `${BASE} bg-red-100 text-red-700`,
  // Loans
  DISBURSED:   `${BASE} bg-blue-100 text-blue-700`,
  DEFAULTED:   `${BASE} bg-red-100 text-red-700`,
  // Fraud risk
  CRITICAL:    `${BASE} bg-red-100 text-red-700`,
  HIGH:        `${BASE} bg-orange-100 text-orange-700`,
  MEDIUM:      `${BASE} bg-yellow-100 text-yellow-700`,
  LOW:         `${BASE} bg-green-100 text-green-700`,
  // Fraud alerts
  NEW:         `${BASE} bg-red-100 text-red-700`,
  ACKNOWLEDGED:`${BASE} bg-orange-100 text-orange-700`,
  RESOLVED:    `${BASE} bg-green-100 text-green-700`,
  // Users (admin)
  SUSPENDED:   `${BASE} bg-orange-100 text-orange-700`,
  // Loans
  APPLIED:     `${BASE} bg-yellow-100 text-yellow-700`,
  UNDER_REVIEW:`${BASE} bg-blue-100 text-blue-700`,
  REPAYING:    `${BASE} bg-indigo-100 text-indigo-700`,
  // Workflow
  IN_PROGRESS: `${BASE} bg-blue-100 text-blue-700`,
  // Jobs
  RUNNING:     `${BASE} bg-blue-100 text-blue-700`,
  RETRYING:    `${BASE} bg-yellow-100 text-yellow-700`,
  // Documents
  ARCHIVED:    DEFAULT,
  VERIFIED:    `${BASE} bg-green-100 text-green-700`,
};

@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): string {
    return STATUS_MAP[status] ?? DEFAULT;
  }
}
