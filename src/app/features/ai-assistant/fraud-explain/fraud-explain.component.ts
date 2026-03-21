import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiService, AiChatResponse } from '../ai.service';

@Component({
  selector: 'app-fraud-explain',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './fraud-explain.component.html',
})
export class FraudExplainComponent {
  private aiSvc = inject(AiService);
  private fb    = inject(FormBuilder);

  readonly riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  form = this.fb.group({
    transactionId:  ['', Validators.required],
    amount:         [null as number | null, [Validators.required, Validators.min(1)]],
    riskScore:      [0.8, [Validators.required, Validators.min(0), Validators.max(1)]],
    riskLevel:      ['HIGH', Validators.required],
    triggeredRules: [''],
    location:       [''],
    userId:         [''],
    language:       ['fr', Validators.required],
  });

  loading  = signal(false);
  response = signal<AiChatResponse | null>(null);
  error    = signal(false);

  submit() {
    if (this.form.invalid || this.loading()) return;

    const v = this.form.value;
    const rules = (v.triggeredRules ?? '')
      .split(',')
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0);

    this.loading.set(true);
    this.response.set(null);
    this.error.set(false);

    this.aiSvc.explainFraud({
      transactionId:  v.transactionId!,
      amount:         v.amount!,
      riskScore:      v.riskScore!,
      riskLevel:      v.riskLevel!,
      triggeredRules: rules,
      location:       v.location || undefined,
      userId:         v.userId || undefined,
      language:       v.language!,
    }).subscribe({
      next: r => { this.response.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  reset() {
    this.form.reset({ riskScore: 0.8, riskLevel: 'HIGH', language: 'fr' });
    this.response.set(null);
    this.error.set(false);
  }

  riskPercent(): number {
    return Math.round((this.form.value.riskScore ?? 0) * 100);
  }
}
