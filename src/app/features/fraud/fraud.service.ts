import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  FraudAlert, FraudAlertStatus, FraudRule, FraudPattern, FraudDashboardOverview,
} from '../../core/models/fraud.models';

export type { FraudAlert, FraudAlertStatus, FraudRule, FraudPattern };

@Injectable({ providedIn: 'root' })
export class FraudService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Vue d'ensemble du tableau de bord fraude */
  getOverview() {
    return this.http.get<FraudDashboardOverview>(`${this.api}/fraud/dashboard/overview`);
  }

  /** Alertes fraude – GET /fraud/alerts */
  getAlerts() {
    return this.http.get<FraudAlert[]>(`${this.api}/fraud/alerts`);
  }

  /** Alertes récentes – GET /fraud/alerts?limit=N&status=NEW */
  getRecentAlerts(limit = 5) {
    return this.http.get<FraudAlert[]>(`${this.api}/fraud/alerts?limit=${limit}&status=NEW`);
  }

  /**
   * Mettre à jour le statut d'une alerte
   * PUT /fraud/alerts/{alertId}/status?status=RESOLVED&resolution=...
   */
  updateAlertStatus(alertId: string, status: FraudAlertStatus, resolution = '') {
    return this.http.put(
      `${this.api}/fraud/alerts/${alertId}/status?status=${status}&resolution=${encodeURIComponent(resolution)}`,
      {}
    );
  }

  /** Règles de détection – GET /fraud/rules */
  getRules() {
    return this.http.get<FraudRule[]>(`${this.api}/fraud/rules`);
  }

  /** Activer une règle – POST /fraud/rules/{ruleId}/enable */
  enableRule(ruleId: string) {
    return this.http.post(`${this.api}/fraud/rules/${ruleId}/enable`, {});
  }

  /** Désactiver une règle – POST /fraud/rules/{ruleId}/disable */
  disableRule(ruleId: string) {
    return this.http.post(`${this.api}/fraud/rules/${ruleId}/disable`, {});
  }

  /** Patterns de fraude – GET /fraud/patterns */
  getPatterns() {
    return this.http.get<FraudPattern[]>(`${this.api}/fraud/patterns`);
  }
}
