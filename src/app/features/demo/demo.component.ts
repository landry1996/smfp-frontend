import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
})
export class DemoComponent {
  private fb = inject(FormBuilder);

  readonly currentYear = new Date().getFullYear();

  submitted = signal(false);
  loading   = signal(false);

  readonly benefits = [
    { icon: 'bi-lightning-charge-fill', text: 'Gestion des comptes et transactions en temps réel' },
    { icon: 'bi-graph-up-arrow',        text: 'Détection intelligente de fraude par IA' },
    { icon: 'bi-bar-chart-fill',        text: 'Tableaux de bord financiers et rapports analytiques' },
    { icon: 'bi-phone-fill',            text: 'Intégration Mobile Money et API ouverte' },
  ];

  readonly userCountOptions = [
    '1 – 50',
    '51 – 200',
    '201 – 500',
    '501 – 2 000',
    '2 000+',
  ];

  form = this.fb.group({
    name:      ['', [Validators.required, Validators.minLength(2)]],
    email:     ['', [Validators.required, Validators.email]],
    org:       ['', [Validators.required]],
    country:   ['', [Validators.required]],
    userCount: ['', [Validators.required]],
    message:   [''],
  });

  get name()      { return this.form.get('name')!; }
  get email()     { return this.form.get('email')!; }
  get org()       { return this.form.get('org')!; }
  get country()   { return this.form.get('country')!; }
  get userCount() { return this.form.get('userCount')!; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    // Simulate API call — replace with real service call when endpoint is ready
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
    }, 1200);
  }
}
