import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AccountService } from '../account.service';
import { Account } from '../../../core/models/account.models';
@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accounts-list.component.html',
})
export class AccountsListComponent implements OnInit {
  private accountSvc = inject(AccountService);
  private auth       = inject(AuthService);

  data    = signal<Account[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) { this.error.set(true); this.loading.set(false); return; }

    this.accountSvc.getAccountsByUser(userId).subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
