// ── Enums / types ──────────────────────────────────────────────────────────────
/** Niveau de risque d'une alerte ou d'un check fraude */
export type FraudRiskLevel   = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Statut d'une alerte fraude (valeurs exactes du backend fraud-detection-service) */
export type FraudAlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CLOSED';

// ── Entities ───────────────────────────────────────────────────────────────────
export interface FraudAlert {
  id:             string;
  transactionId?: string;
  userId?:        string;
  ruleCode?:      string;
  type?:          string;
  riskLevel:      FraudRiskLevel;
  status:         FraudAlertStatus;
  createdAt:      string;
  resolvedAt?:    string;
}

export interface FraudRule {
  id:                  string;
  code:                string;
  name:                string;
  description?:        string;
  priority?:           number;
  enabled:             boolean;
  triggerCount?:       number;
  falsePositiveCount?: number;
  createdAt?:          string;
}

export interface FraudPattern {
  id:            string;
  name?:         string;
  patternType:   string;
  description?:  string;
  confidence?:   number;
  active:        boolean;
  occurrences?:  number;
  lastDetected?: string;
  riskScore?:    number;
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
export interface FraudDashboardOverview {
  totalChecks:          number;
  fraudulentChecks?:    number;
  blockedTransactions?: number;
  openAlerts:           number;
  criticalAlerts:       number;
  /** Taux de fraude entre 0 et 1 (ex: 0.023 = 2,3%) */
  fraudRate:            number;
  activeRules?:         number;
  recentChecks?:        FraudCheckStat[];
}

export interface FraudCheckStat {
  id:            string;
  transactionId: string;
  riskLevel:     FraudRiskLevel;
  riskScore:     number;
  blocked:       boolean;
  checkedAt:     string;
}
