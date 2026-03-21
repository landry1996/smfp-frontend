import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JobExecution, Dag } from '../../core/models/orchestration.models';

export type { JobExecution, Dag };

@Injectable({ providedIn: 'root' })
export class OrchestrationService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Exécutions de jobs – GET /job-executions */
  getJobExecutions() {
    return this.http.get<JobExecution[]>(`${this.api}/job-executions`);
  }

  /** DAGs configurés – GET /dags */
  getDags() {
    return this.http.get<Dag[]>(`${this.api}/dags`);
  }
}
