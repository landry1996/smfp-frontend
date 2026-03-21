// ── Enums / types ──────────────────────────────────────────────────────────────
export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING';

export type JobType =
  | 'DAILY_INTEREST_CALCULATION'
  | 'MONTHLY_REPORT_GENERATION'
  | 'ML_MODEL_RETRAINING'
  | 'DATABASE_BACKUP'
  | 'GDPR_DATA_CLEANUP'
  | 'REGULATORY_FILE_GENERATION'
  | 'EXTERNAL_BANK_SYNC';

// ── Entities ───────────────────────────────────────────────────────────────────
/** Exécution d'un job planifié – GET /job-executions */
export interface JobExecution {
  id:            string;
  jobName?:      string;
  name?:         string;
  jobType?:      string;
  type?:         string;
  status:        JobStatus;
  startedAt?:    string;
  createdAt?:    string;
  finishedAt?:   string;
  durationMs?:   number;
  triggeredBy?:  string;
  retryCount?:   number;
  errorMessage?: string;
}

/** DAG (Directed Acyclic Graph) – GET /dags */
export interface Dag {
  id?:             string;
  dagId?:          string;
  name?:           string;
  description?:    string;
  schedule?:       string;
  cronExpression?: string;
  paused:          boolean;
  active?:         boolean;
  lastRun?:        string;
  nextRun?:        string;
}

/** Étape d'un DAG (utilisée dans la configuration avancée) */
export interface DagStep {
  stepOrder:       number;
  jobType:         JobType;
  dependsOnSteps:  number[];
  timeoutSeconds:  number;
  retryPolicy:     { maxRetries: number; delaySeconds: number; backoffMultiplier: number };
}
