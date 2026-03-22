import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
interface ScheduleEntry {
  month:     number;
  payment:   number;
  principal: number;
  interest:  number;
  balance:   number;
}

interface SimulationResult {
  monthly:   number;
  total:     number;
  interests: number;
  schedule:  ScheduleEntry[];
}

@Component({
  selector: 'app-loan-simulator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './loan-simulator.component.html',
})
export class LoanSimulatorComponent {
  private fb = inject(FormBuilder);

  /** Noms de champs alignés sur le backend /loans/simulate */
  form = this.fb.group({
    principal:          [1_000_000, [Validators.required, Validators.min(50_000)]],
    durationMonths:     [24,        [Validators.required, Validators.min(6)]],
    annualInterestRate: [10,        [Validators.required, Validators.min(0.1)]],
  });

  result = computed((): SimulationResult | null => {
    const v = this.form.value;
    const P = v.principal ?? 0;
    const n = v.durationMonths ?? 1;
    const r = (v.annualInterestRate ?? 1) / 100 / 12;
    if (P <= 0 || n <= 0 || r <= 0) return null;

    const monthly   = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total     = monthly * n;
    const interests = total - P;

    const schedule: ScheduleEntry[] = [];
    let balance = P;
    for (let i = 1; i <= Math.min(6, n); i++) {
      const interest  = balance * r;
      const principal = monthly - interest;
      balance -= principal;
      schedule.push({ month: i, payment: monthly, principal, interest, balance: Math.max(0, balance) });
    }

    return { monthly, total, interests, schedule };
  });
}
