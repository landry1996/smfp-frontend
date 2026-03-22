import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FraudService, FraudAlert } from '../fraud.service';
@Component({
  selector: 'app-fraud-alerts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fraud-alerts.component.html',
})
export class FraudAlertsComponent implements OnInit {
  private fraudSvc = inject(FraudService);

  data    = signal<FraudAlert[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.fraudSvc.getAlerts().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  resolve(alert: FraudAlert) {
    this.fraudSvc.updateAlertStatus(alert.id, 'RESOLVED', 'Résolu manuellement').subscribe({
      next: () => {
        this.data.update(alerts =>
          alerts.map(a => a.id === alert.id ? { ...a, status: 'RESOLVED' as const } : a)
        );
      },
    });
  }
}
