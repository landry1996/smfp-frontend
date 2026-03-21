import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from './notification.service';
import { Notification } from '../../core/models/notification.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  private notifSvc = inject(NotificationService);
  private auth     = inject(AuthService);

  data    = signal<Notification[]>([]);
  loading = signal(true);
  error   = signal(false);
  unread  = computed(() => this.data().filter(n => !n.read).length);

  private userId = '';

  ngOnInit() {
    this.userId = this.auth.currentUser()?.userId ?? '';
    if (!this.userId) { this.error.set(true); this.loading.set(false); return; }

    this.notifSvc.getNotifications(this.userId).subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  markRead(notif: Notification) {
    if (notif.read) return;
    this.data.update(ns => ns.map(n => n.id === notif.id ? { ...n, read: true } : n));
    this.notifSvc.markAsRead(notif.id).subscribe();
  }

  markAllRead() {
    this.data.update(ns => ns.map(n => ({ ...n, read: true })));
    this.notifSvc.markAllRead(this.userId).subscribe();
  }

  channelBadge(channel: string): string {
    const map: Record<string, string> = {
      EMAIL:   'inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700',
      SMS:     'inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700',
      PUSH:    'inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700',
      WEBHOOK: 'inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700',
    };
    return map[channel] ?? 'inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600';
  }
}
