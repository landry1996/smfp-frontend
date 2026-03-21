import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminUser } from '../admin.service';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatusBadgePipe],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private adminSvc = inject(AdminService);

  data    = signal<AdminUser[]>([]);
  loading = signal(true);
  error   = signal(false);
  search  = new FormControl('');

  filtered = computed(() => {
    const q = this.search.value?.toLowerCase() ?? '';
    if (!q) return this.data();
    return this.data().filter(u =>
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.adminSvc.getUsers().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  toggleUser(user: AdminUser) {
    const action$ = user.status === 'ACTIVE'
      ? this.adminSvc.suspendUser(user.userId ?? user.id!)
      : this.adminSvc.reactivateUser(user.userId ?? user.id!);

    action$.subscribe({
      next: () => {
        this.data.update(users =>
          users.map(u =>
            (u.userId ?? u.id) === (user.userId ?? user.id)
              ? { ...u, status: user.status === 'ACTIVE' ? 'SUSPENDED' as const : 'ACTIVE' as const }
              : u
          )
        );
      },
    });
  }

  initials(user: AdminUser): string {
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }
}
