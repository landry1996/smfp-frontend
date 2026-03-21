import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './two-factor.component.html',
})
export class TwoFactorComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  error = signal('');

  form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth.verifyTwoFactor(this.form.value.code!).subscribe({
      error: (err) => this.error.set(err.error?.message ?? 'Code invalide'),
    });
  }

  back() { this.router.navigate(['/auth/login']); }
}
