import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService, Analytics } from '../report.service';
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private reportSvc = inject(ReportService);

  analytics = signal<Analytics | null>(null);
  data      = signal<Record<string, unknown>[]>([]);
  loading   = signal(true);
  error     = signal(false);

  ngOnInit() {
    this.reportSvc.getAnalytics().subscribe({
      next: d => {
        if (Array.isArray(d)) {
          this.data.set(d as Record<string, unknown>[]);
        } else {
          this.analytics.set(d as Analytics);
          if ((d as Analytics).data) this.data.set((d as Analytics).data!);
        }
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  tableKeys(): string[] {
    if (this.data().length === 0) return [];
    return Object.keys(this.data()[0]).slice(0, 6);
  }
}
