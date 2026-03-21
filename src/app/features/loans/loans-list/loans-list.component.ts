import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoanService, LoanResponse } from '../loan.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe, StatusBadgePipe],
  templateUrl: './loans-list.component.html',
})
export class LoansListComponent implements OnInit {
  private loanSvc = inject(LoanService);
  private auth    = inject(AuthService);

  data    = signal<LoanResponse[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) { this.error.set(true); this.loading.set(false); return; }

    this.loanSvc.getLoansByUser(userId).subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
