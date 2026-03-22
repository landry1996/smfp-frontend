import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrchestrationService, JobExecution } from '../orchestration.service';
@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit {
  private orchSvc = inject(OrchestrationService);

  data    = signal<JobExecution[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.orchSvc.getJobExecutions().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
