import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface WorkflowTask {
  id:           string;
  taskName?:    string;
  name?:        string;
  description?: string;
  status:       string;
  priority:     TaskPriority;
  assigneeId?:  string;
  assignedTo?:  string;
  dueDate?:     string;
  workflowInstanceId?: string;
}

export interface Approval {
  id:             string;
  workflowType?:  string;
  subject?:       string;
  description?:   string;
  status:         string;
  requestedBy?:   string;
  createdAt:      string;
}

export interface ApprovalDecisionRequest {
  approverId: string;
  decision:   'APPROVED' | 'REJECTED';
  comment?:   string;
}

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Tâches en attente – GET /tasks/pending */
  getTasks() {
    return this.http.get<{ content: WorkflowTask[] }>(`${this.api}/tasks/pending`);
  }

  /** Tâches assignées à un utilisateur – GET /tasks/user/{assigneeId} */
  getTasksForUser(assigneeId: string) {
    return this.http.get<{ content: WorkflowTask[] }>(`${this.api}/tasks/user/${assigneeId}`);
  }

  /**
   * Compléter une tâche – POST /tasks/{taskId}/complete
   * @param completedBy  userId de l'agent qui complète
   */
  completeTask(taskId: string, completedBy: string, variables?: Record<string, unknown>) {
    return this.http.post<WorkflowTask>(
      `${this.api}/tasks/${taskId}/complete`,
      { completedBy, variables: variables ?? {} }
    );
  }

  /** Approbations en attente – GET /approvals/pending */
  getApprovals() {
    return this.http.get<{ content: Approval[] }>(`${this.api}/approvals/pending`);
  }

  /** Approbations en attente pour un approbateur – GET /approvals/user/{approverId}/pending */
  getPendingForUser(approverId: string) {
    return this.http.get<Approval[]>(`${this.api}/approvals/user/${approverId}/pending`);
  }

  /**
   * Soumettre une décision – POST /approvals/{id}/decision
   */
  submitDecision(approvalId: string, req: ApprovalDecisionRequest) {
    return this.http.post<Approval>(`${this.api}/approvals/${approvalId}/decision`, req);
  }
}
