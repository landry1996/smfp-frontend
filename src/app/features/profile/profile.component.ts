import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, UserProfile } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private profileSvc = inject(ProfileService);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.profileSvc.getProfile().subscribe({
      next:  d => { this.profile.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  initials(p: UserProfile): string {
    return `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }
}
