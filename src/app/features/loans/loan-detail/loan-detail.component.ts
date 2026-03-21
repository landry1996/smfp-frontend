import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LoanService, LoanResponse } from '../loan.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe, StatusBadgePipe],
  templateUrl: './loan-detail.component.html',
})
export class LoanDetailComponent implements OnInit {
  private loanSvc = inject(LoanService);
  private route   = inject(ActivatedRoute);

  loan    = signal<LoanResponse | null>(null);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error.set(true); this.loading.set(false); return; }

    this.loanSvc.getLoan(id).subscribe({
      next:  d => { this.loan.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
