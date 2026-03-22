import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { AuthService } from '../../../core/services/auth.service';
import { Account } from '../../../core/models/account.models';
@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-detail.component.html',
})
export class AccountDetailComponent implements OnInit {
  private accountSvc = inject(AccountService);
  private authSvc    = inject(AuthService);
  private route      = inject(ActivatedRoute);

  account = signal<Account | null>(null);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    const accountId = this.route.snapshot.paramMap.get('id');
    const userId    = this.authSvc.currentUser()?.userId;
    if (!accountId || !userId) { this.error.set(true); this.loading.set(false); return; }

    // Backend n'a pas GET /accounts/{id} — on récupère tous les comptes et on filtre
    this.accountSvc.getAccountsByUser(userId).subscribe({
      next: (accounts: Account[]) => {
        const found = accounts.find((a: Account) => a.id === accountId) ?? null;
        this.account.set(found);
        if (!found) this.error.set(true);
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  detailFields(acc: Account): { label: string; value: string }[] {
    return [
      { label: 'ID',               value: acc.id ?? '-' },
      { label: 'Propriétaire',     value: acc.userId ?? '-' },
      { label: 'Type',             value: acc.type ?? '-' },
      { label: 'Devise',           value: acc.currency ?? '-' },
      { label: 'Date de création', value: acc.createdAt ? new Date(acc.createdAt).toLocaleDateString('fr-FR') : '-' },
      { label: 'Dernière MAJ',     value: acc.updatedAt ? new Date(acc.updatedAt).toLocaleDateString('fr-FR') : '-' },
    ];
  }
}
