import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FraudService, FraudPattern } from '../fraud.service';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-fraud-patterns',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgePipe],
  templateUrl: './fraud-patterns.component.html',
})
export class FraudPatternsComponent implements OnInit {
  private fraudSvc = inject(FraudService);

  data    = signal<FraudPattern[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.fraudSvc.getPatterns().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  confidenceClass(confidence: number | undefined): string {
    const BASE = 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium';
    if (confidence == null) return `${BASE} bg-gray-100 text-gray-600`;
    if (confidence >= 0.8)  return `${BASE} bg-red-100 text-red-700`;
    if (confidence >= 0.5)  return `${BASE} bg-orange-100 text-orange-700`;
    return `${BASE} bg-yellow-100 text-yellow-700`;
  }
}
