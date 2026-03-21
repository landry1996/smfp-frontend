// ── Enums / types ──────────────────────────────────────────────────────────────
export type LoanPurpose    = 'PERSONAL' | 'HOME' | 'BUSINESS' | 'AUTO' | 'EDUCATION';
export type LoanEmployment = 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED';
export type LoanStatus     = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED';

// ── Request DTOs ───────────────────────────────────────────────────────────────
/** Corps de la demande de prêt – POST /loans */
export interface LoanRequest {
  userId:         string;
  loanAmount:     number;
  durationMonths: number;
  purpose:        LoanPurpose;
  employment:     LoanEmployment;
}

/** Corps de la simulation – POST /loans/simulate */
export interface SimulateRequest {
  principal:          number;
  annualInterestRate: number;
  durationMonths:     number;
  amortizationType?:  'FRENCH' | 'GERMAN' | 'ANNUITY';
}

// ── Response DTOs ──────────────────────────────────────────────────────────────
/** Prêt retourné par le backend (GET /loans/{id}, GET /loans/user/{userId}) */
export interface LoanResponse {
  id:                    string;
  userId:                string;
  /** Montant emprunté (champ backend : loanAmount) */
  loanAmount:            number;
  principalBorrowed?:    number;
  durationMonths:        number;
  monthlyPayment?:       number;
  /** Taux d'intérêt annuel en % (ex: 8.5 = 8,5%) – ne pas multiplier par 100 */
  interestRate:          number;
  status:                LoanStatus;
  applicationDate?:      string;
  disbursementDate?:     string;
  expectedMaturityDate?: string;
  paidAmount?:           number;
  purpose?:              string;
  reference?:            string;
  createdAt?:            string;
}

/** Résultat d'une simulation – POST /loans/simulate */
export interface LoanSimulationResult {
  principal:          number;
  annualInterestRate: number;
  durationMonths:     number;
  monthlyPayment:     number;
  totalPayment:       number;
  totalInterest:      number;
  schedule?:          RepaymentScheduleEntry[];
}

export interface RepaymentScheduleEntry {
  installmentNumber: number;
  dueDate:           string;
  principalAmount:   number;
  interestAmount:    number;
  totalAmount:       number;
  status:            'PENDING' | 'PAID' | 'OVERDUE';
}

export interface LoanRepayment {
  id:     string;
  loanId: string;
  amount: number;
  paidAt: string;
  status: string;
}

export interface CreditScore {
  userId:       string;
  score:        number;
  grade:        string;
  factors?:     Record<string, number>;
  calculatedAt: string;
}
