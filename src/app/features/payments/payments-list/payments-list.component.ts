import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentService, Payment } from '../payment.service';
@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payments-list.component.html',
})
export class PaymentsListComponent implements OnInit {
  private paymentSvc = inject(PaymentService);
  private auth       = inject(AuthService);

  data    = signal<Payment[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) { this.error.set(true); this.loading.set(false); return; }

    this.paymentSvc.getPayments(userId).subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
