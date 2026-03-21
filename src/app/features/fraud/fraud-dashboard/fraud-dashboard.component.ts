import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FraudService, FraudAlert } from '../fraud.service';
import { FraudDashboardOverview } from '../../../core/models/fraud.models';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-fraud-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgePipe],
  templateUrl: './fraud-dashboard.component.html',
})
export class FraudDashboardComponent implements OnInit {
  private fraudSvc = inject(FraudService);

  overview     = signal<FraudDashboardOverview | null>(null);
  recentAlerts = signal<FraudAlert[]>([]);
  loading      = signal(true);
  error        = signal(false);

  ngOnInit() {
    this.fraudSvc.getOverview().subscribe({
      next:  d => { this.overview.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
    this.fraudSvc.getRecentAlerts(5).subscribe({
      next: d => this.recentAlerts.set(d),
      error: () => {},
    });
  }
}
