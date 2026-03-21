import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkflowService, Approval, ApprovalDecisionRequest } from '../workflow.service';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgePipe],
  templateUrl: './approvals.component.html',
})
export class ApprovalsComponent implements OnInit {
  private workflowSvc = inject(WorkflowService);
  private authSvc     = inject(AuthService);

  data    = signal<Approval[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.workflowSvc.getApprovals().subscribe({
      next:  d => { this.data.set(d.content ?? []); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  decide(approval: Approval, decision: 'APPROVED' | 'REJECTED') {
    const approverId = this.authSvc.currentUser()?.userId ?? '';
    const req: ApprovalDecisionRequest = { approverId, decision };
    this.workflowSvc.submitDecision(approval.id, req).subscribe({
      next: (updated) => {
        this.data.update(approvals =>
          approvals.map(a => a.id === approval.id ? { ...a, status: updated.status } : a)
        );
      },
    });
  }
}
