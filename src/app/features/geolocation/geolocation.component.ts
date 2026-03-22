import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationService, AgentLocationResponse } from './geolocation.service';
@Component({
  selector: 'app-geolocation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './geolocation.component.html',
})
export class GeolocationComponent implements OnInit {
  private geoSvc = inject(GeolocationService);

  data           = signal<AgentLocationResponse[]>([]);
  activeCount    = signal<number>(0);
  loading        = signal(true);
  error          = signal(false);

  ngOnInit() {
    this.geoSvc.getActiveAgents().subscribe({
      next:  ids => {
        this.activeCount.set(ids.length);
        this.loading.set(false);
      },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
