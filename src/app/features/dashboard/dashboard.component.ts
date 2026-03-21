import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AccountService } from '../accounts/account.service';
import { NotificationService } from '../notifications/notification.service';
import { FraudService } from '../fraud/fraud.service';
import { Account } from '../../core/models/account.models';
import { Notification } from '../../core/models/notification.models';
import { FraudDashboardOverview } from '../../core/models/fraud.models';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private accountSvc      = inject(AccountService);
  private notificationSvc = inject(NotificationService);
  private fraudSvc        = inject(FraudService);
  auth    = inject(AuthService);
  user    = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;
  isAgent = this.auth.isAgent;

  accounts      = signal<Account[]>([]);
  notifications = signal<Notification[]>([]);
  fraudOverview = signal<FraudDashboardOverview | null>(null);
  loading       = signal(true);

  totalBalance        = computed(() => this.accounts().reduce((s, a) => s + a.balance, 0));
  activeAccounts      = computed(() => this.accounts().filter(a => a.status === 'ACTIVE').length);
  unreadNotifications = computed(() => this.notifications().filter(n => !n.read).length);

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (userId) {
      this.accountSvc.getAccountsByUser(userId).subscribe({
        next: d => this.accounts.set(d),
        error: () => {},
      });
      this.notificationSvc.getNotifications(userId).subscribe({
        next: d => this.notifications.set(d),
        error: () => {},
      });
    }
    if (this.isAdmin()) {
      this.fraudSvc.getOverview().subscribe({
        next: d => this.fraudOverview.set(d),
        error: () => {},
      });
    }
    this.loading.set(false);
  }
}
