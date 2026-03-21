import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuditService, AuditEvent } from './audit.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './audit.component.html',
})
export class AuditComponent implements OnInit {
  private auditSvc = inject(AuditService);

  data         = signal<AuditEvent[]>([]);
  filteredData = signal<AuditEvent[]>([]);
  loading      = signal(true);
  error        = signal(false);
  searchControl = new FormControl('');
  actionFilter  = new FormControl('');

  ngOnInit() {
    this.auditSvc.searchEvents({ limit: 200 }).subscribe({
      next: d => {
        this.data.set(d);
        this.filteredData.set(d);
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.actionFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters() {
    const q      = this.searchControl.value?.toLowerCase() ?? '';
    const action = this.actionFilter.value ?? '';
    this.filteredData.set(
      this.data().filter(log => {
        const matchSearch = !q || [log.userId, log.username, log.action, log.eventType, log.details, log.description]
          .some(v => v?.toLowerCase().includes(q));
        const matchAction = !action || log.action === action || log.eventType === action;
        return matchSearch && matchAction;
      })
    );
  }

  actionClass(action: string): string {
    const map: Record<string, string> = {
      CREATE:  'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700',
      UPDATE:  'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700',
      DELETE:  'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700',
      LOGIN:   'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700',
      LOGOUT:  'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600',
      PAYMENT: 'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700',
    };
    return map[action] ?? 'inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600';
  }
}
