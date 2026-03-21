import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Report {
  id?:          string;
  title?:       string;
  name?:        string;
  type:         string;
  status:       string;
  periodStart?: string;
  periodEnd?:   string;
  generatedAt?: string;
}

export interface Analytics {
  avgTransactionsPerDay?: number;
  avgTransactionVolume?:  number;
  successRate?:           number;
  newCustomers?:          number;
  data?:                  Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Liste des rapports – GET /reports */
  getReports() {
    return this.http.get<Report[]>(`${this.api}/reports`);
  }

  /** Analytics – GET /analytics */
  getAnalytics() {
    return this.http.get<Analytics | Record<string, unknown>[]>(`${this.api}/analytics`);
  }
}
