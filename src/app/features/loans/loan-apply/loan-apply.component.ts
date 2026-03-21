import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoanService, LoanPurpose, LoanEmployment } from '../loan.service';

@Component({
  selector: 'app-loan-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './loan-apply.component.html',
})
export class LoanApplyComponent {
  private loanSvc = inject(LoanService);
  private auth    = inject(AuthService);
  private router  = inject(Router);
  private fb      = inject(FormBuilder);

  submitting = signal(false);
  success    = signal(false);
  apiError   = signal<string | null>(null);

  durations = [6, 12, 18, 24, 36, 48, 60, 84, 120];

  /** Champs alignés sur le backend: userId, loanAmount, durationMonths, purpose, employment */
  form = this.fb.group({
    purpose:        ['' as LoanPurpose | '', Validators.required],
    employment:     ['' as LoanEmployment | '', Validators.required],
    loanAmount:     [null as number | null, [Validators.required, Validators.min(50000)]],
    durationMonths: [12, Validators.required],
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const userId = this.auth.currentUser()?.userId;
    if (!userId) { this.apiError.set('Utilisateur non authentifié.'); return; }

    this.submitting.set(true);
    this.apiError.set(null);

    this.loanSvc.applyForLoan({
      userId,
      loanAmount:     this.form.value.loanAmount!,
      durationMonths: this.form.value.durationMonths!,
      purpose:        this.form.value.purpose as LoanPurpose,
      employment:     this.form.value.employment as LoanEmployment,
    }).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        setTimeout(() => this.router.navigate(['/loans']), 2000);
      },
      error: (err) => {
        this.apiError.set(err?.error?.message ?? 'Une erreur est survenue.');
        this.submitting.set(false);
      },
    });
  }
}
