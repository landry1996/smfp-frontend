import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { PaymentService, MobileMoneyRequest } from '../payment.service';

@Component({
  selector: 'app-mobile-money',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './mobile-money.component.html',
})
export class MobileMoneyComponent {
  private paymentSvc = inject(PaymentService);
  private router     = inject(Router);
  private fb         = inject(FormBuilder);

  selectedProvider = signal<string | null>(null);
  submitting       = signal(false);
  success          = signal(false);
  apiError         = signal<string | null>(null);

  operators = [
    { code: 'ORANGE',        name: 'Orange Money',  icon: '🟠' },
    { code: 'MTN',           name: 'MTN MoMo',      icon: '🟡' },
    { code: 'EXPRESS_UNION', name: 'Express Union',  icon: '🔵' },
  ];

  form = this.fb.group({
    accountId:   ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^6[0-9]{8}$/)]],
    amount:      [null as number | null, [Validators.required, Validators.min(100)]],
    description: [''],
  });

  selectOperator(code: string) {
    this.selectedProvider.set(code);
  }

  submit() {
    if (this.form.invalid || !this.selectedProvider()) return;
    this.submitting.set(true);
    this.apiError.set(null);

    const payload: MobileMoneyRequest = {
      accountId:   this.form.value.accountId!,
      phoneNumber: this.form.value.phoneNumber!,
      provider:    this.selectedProvider() as MobileMoneyRequest['provider'],
      amount:      this.form.value.amount!,
      description: this.form.value.description ?? undefined,
    };

    this.paymentSvc.cashOut(payload).subscribe({
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
