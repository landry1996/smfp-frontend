import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkflowService, WorkflowTask } from '../workflow.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  private workflowSvc = inject(WorkflowService);
  private authSvc     = inject(AuthService);

  data         = signal<WorkflowTask[]>([]);
  loading      = signal(true);
  error        = signal(false);
  activeFilter = signal<string>('ALL');

  pending  = computed(() => this.data().filter(t => t.status === 'PENDING').length);
  filtered = computed(() =>
    this.activeFilter() === 'ALL'
      ? this.data()
      : this.data().filter(t => t.status === this.activeFilter())
  );

  filters = [
    { label: 'Toutes',    value: 'ALL' },
    { label: 'En attente',value: 'PENDING' },
    { label: 'En cours',  value: 'IN_PROGRESS' },
    { label: 'Terminées', value: 'COMPLETED' },
  ];

  ngOnInit() {
    this.workflowSvc.getTasks().subscribe({
      next:  d => { this.data.set(d.content ?? []); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  completeTask(task: WorkflowTask) {
    const completedBy = this.authSvc.currentUser()?.userId ?? '';
    this.workflowSvc.completeTask(task.id, completedBy).subscribe({
      next: (updated) => {
        this.data.update(tasks =>
          tasks.map(t => t.id === task.id ? { ...t, status: updated.status } : t)
        );
      },
    });
  }
}
