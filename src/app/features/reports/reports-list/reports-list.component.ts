import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService, Report } from '../report.service';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reports-list.component.html',
})
export class ReportsListComponent implements OnInit {
  private reportSvc = inject(ReportService);

  data    = signal<Report[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    this.reportSvc.getReports().subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
