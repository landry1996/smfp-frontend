import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FraudService, FraudRule } from '../fraud.service';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-fraud-rules',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgePipe],
  templateUrl: './fraud-rules.component.html',
})
export class FraudRulesComponent implements OnInit {
  private fraudSvc = inject(FraudService);

  data    = signal<FraudRule[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.fraudSvc.getRules().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  toggleRule(rule: FraudRule) {
    const action$ = rule.enabled
      ? this.fraudSvc.disableRule(rule.id)
      : this.fraudSvc.enableRule(rule.id);

    action$.subscribe({
      next: () => {
        this.data.update(rules =>
          rules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r)
        );
      },
    });
  }
}
