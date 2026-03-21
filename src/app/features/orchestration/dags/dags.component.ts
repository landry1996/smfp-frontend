import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrchestrationService, Dag } from '../orchestration.service';

@Component({
  selector: 'app-dags',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dags.component.html',
})
export class DagsComponent implements OnInit {
  private orchSvc = inject(OrchestrationService);

  data    = signal<Dag[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.orchSvc.getDags().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
