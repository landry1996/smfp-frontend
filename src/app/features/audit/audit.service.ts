import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AuditSearchRequest {
  aggregateType?: string;
  aggregateId?:   string;
  eventTypes?:    string[];
  startDate?:     string;
  endDate?:       string;
  userId?:        string;
  limit?:         number;
  offset?:        number;
}

export interface AuditEvent {
  id?:           string;
  eventType?:    string;
  action?:       string;
  aggregateType?: string;
  resourceType?:  string;
  entity?:        string;
  aggregateId?:  string;
  userId?:       string;
  username?:     string;
  payload?:      Record<string, unknown>;
  details?:      string;
  description?:  string;
  ipAddress?:    string;
  timestamp?:    string;
  createdAt?:    string;
  success?:      boolean;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /**
   * Rechercher dans le journal d'audit
   * POST /audit/search
   */
  searchEvents(req: AuditSearchRequest = {}) {
    return this.http.post<AuditEvent[]>(`${this.api}/audit/search`, req);
  }

  /**
   * Export du journal d'audit
   * POST /audit/export
   */
  export(req: AuditSearchRequest & { format: 'JSON' | 'CSV' | 'XML' }) {
    return this.http.post(`${this.api}/audit/export`, req, { responseType: 'blob' });
  }
}
