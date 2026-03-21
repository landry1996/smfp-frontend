import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transfer.component.html',
})
export class TransferComponent {
  private paymentSvc = inject(PaymentService);
  private router     = inject(Router);
  private fb         = inject(FormBuilder);

  submitting = signal(false);
  success    = signal(false);
  apiError   = signal<string | null>(null);

  /** Champs alignés sur le backend: fromAccountId, toAccountId, amount, description */
  form = this.fb.group({
    fromAccountId: ['', Validators.required],
    toAccountId:   ['', Validators.required],
    amount:        [null as number | null, [Validators.required, Validators.min(100)]],
    description:   [''],
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.apiError.set(null);

    this.paymentSvc.transfer(this.form.value as any).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        setTimeout(() => this.router.navigate(['/payments']), 1500);
      },
      error: (err) => {
        this.apiError.set(err?.error?.message ?? 'Une erreur est survenue.');
        this.submitting.set(false);
      },
    });
  }
}
