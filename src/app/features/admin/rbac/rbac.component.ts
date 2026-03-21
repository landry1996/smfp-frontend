import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, RbacRole } from '../admin.service';

@Component({
  selector: 'app-rbac',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rbac.component.html',
})
export class RbacComponent implements OnInit {
  private adminSvc = inject(AdminService);

  data    = signal<RbacRole[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.adminSvc.getRoles().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
