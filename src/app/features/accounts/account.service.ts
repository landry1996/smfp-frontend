import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Account, AccountType, BalanceHistory } from '../../core/models/account.models';

// ── Open account ──────────────────────────────────────────────────────────────

export interface OpenAccountRequest {
  userId: string;
  type:   AccountType;
}

export interface AccountIdResponse {
  accountId: string;
}

// ── Deposit ───────────────────────────────────────────────────────────────────

export interface DepositRequest {
  accountId: string;
  amount:    number;
}

// ── Balance history ───────────────────────────────────────────────────────────

export interface AverageBalanceResponse {
  accountId: string;
  fromDate:  string;
  toDate:    string;
  average:   number;
}

// ── Available balance ─────────────────────────────────────────────────────────

export interface AvailableBalanceResponse {
  accountId:        string;
  totalBalance:     number;
  heldAmount:       number;
  availableBalance: number;
}

// ── Blocking ──────────────────────────────────────────────────────────────────

export type BlockType = 'FULL' | 'DEBIT_ONLY' | 'CREDIT_ONLY' | 'AMOUNT_HOLD';

export interface AccountBlockRequest {
  blockType:      BlockType;
  reason:         string;
  reasonDetails?: string;
  blockedBy:      string;
  blockedAmount?: number;
  expiresAt?:     string; // ISO datetime
}

export interface AccountBlockResponse {
  blockId:        string;
  accountId:      string;
  blockType:      BlockType;
  reason:         string;
  blockedBy:      string;
  blockedAmount?: number;
  active:         boolean;
  createdAt:      string;
  expiresAt?:     string;
}

export interface AccountUnblockRequest {
  unblockedBy: string;
  reason:      string;
}

export interface OperationCheckResponse {
  accountId: string;
  operation: string;
  allowed:   boolean;
}

// ── Auto savings ──────────────────────────────────────────────────────────────

export type SavingsRuleType = 'FIXED_AMOUNT' | 'PERCENTAGE' | 'ROUND_UP';
export type SavingsFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'PER_TRANSACTION';

export interface SavingsRuleRequest {
  targetAccountId:        string;
  ruleName:               string;
  ruleType:               SavingsRuleType;
  fixedAmount?:           number;
  percentage?:            number;
  frequency:              SavingsFrequency;
  dayOfMonth?:            number;
  dayOfWeek?:             number;
  minimumTransferAmount?: number;
  maximumTransferAmount?: number;
  startDate?:             string;
  endDate?:               string;
}

export interface SavingsRuleResponse {
  ruleId:          string;
  accountId:       string;
  targetAccountId: string;
  ruleName:        string;
  ruleType:        SavingsRuleType;
  fixedAmount?:    number;
  percentage?:     number;
  frequency:       SavingsFrequency;
  active:          boolean;
  totalSaved?:     number;
  startDate?:      string;
  endDate?:        string;
}

export interface SavingsExecutionResponse {
  ruleId:  string;
  success: boolean;
  amount:  number;
  message: string;
}

export interface SavingsStatisticsResponse {
  accountId:       string;
  totalRules:      number;
  activeRules:     number;
  totalSaved:      number;
  totalExecutions: number;
}

// ── Interest rates ────────────────────────────────────────────────────────────

export interface InterestRateResponse {
  rateId:            string;
  accountType:       AccountType;
  annualRate:        number;
  minimumBalance:    number;
  calculationMethod: string;
  paymentFrequency:  string;
  effectiveFrom:     string;
  effectiveTo?:      string;
  active:            boolean;
}

export interface RateResponse {
  accountType: AccountType;
  rateType:    string;
  rate:        number;
}

export interface InterestPreviewResponse {
  accountType:    AccountType;
  balance:        number;
  durationMonths: number;
  annualRate:     number;
  estimatedInterest: number;
}

export interface InterestCalculationResponse {
  accountId:    string;
  fromDate:     string;
  toDate:       string;
  interestEarned: number;
  annualRate:   number;
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // ── Comptes ────────────────────────────────────────────────────────────────

  /** Comptes d'un utilisateur – GET /accounts/user/{userId} */
  getAccountsByUser(userId: string) {
    return this.http.get<Account[]>(`${this.api}/accounts/user/${userId}`);
  }

  /**
   * Ouvrir un nouveau compte – POST /accounts
   * Retourne l'ID du compte créé.
   */
  openAccount(req: OpenAccountRequest) {
    return this.http.post<AccountIdResponse>(`${this.api}/accounts`, req);
  }

  /** Effectuer un dépôt – POST /accounts/deposit */
  deposit(req: DepositRequest) {
    return this.http.post<void>(`${this.api}/accounts/deposit`, req);
  }

  // ── Solde disponible ───────────────────────────────────────────────────────

  /** Solde disponible hors blocages – GET /accounts/{accountId}/available-balance */
  getAvailableBalance(accountId: string) {
    return this.http.get<AvailableBalanceResponse>(
      `${this.api}/accounts/${accountId}/available-balance`
    );
  }

  // ── Historique du solde ────────────────────────────────────────────────────

  /** Historique quotidien/mensuel – GET /accounts/{accountId}/history */
  getBalanceHistory(accountId: string, fromDate?: string, toDate?: string) {
    const params: Record<string, string> = {};
    if (fromDate) params['fromDate'] = fromDate;
    if (toDate)   params['toDate']   = toDate;
    return this.http.get<BalanceHistory[]>(
      `${this.api}/accounts/${accountId}/history`, { params }
    );
  }

  /** Solde moyen journalier – GET /accounts/{accountId}/history/average */
  getAverageDailyBalance(accountId: string, fromDate?: string, toDate?: string) {
    const params: Record<string, string> = {};
    if (fromDate) params['fromDate'] = fromDate;
    if (toDate)   params['toDate']   = toDate;
    return this.http.get<AverageBalanceResponse>(
      `${this.api}/accounts/${accountId}/history/average`, { params }
    );
  }

  // ── Blocages ───────────────────────────────────────────────────────────────

  /** Bloquer un compte – POST /accounts/{accountId}/block */
  blockAccount(accountId: string, req: AccountBlockRequest) {
    return this.http.post<AccountBlockResponse>(
      `${this.api}/accounts/${accountId}/block`, req
    );
  }

  /** Poser un blocage de montant (hold) – POST /accounts/{accountId}/hold */
  placeHold(accountId: string, req: AccountBlockRequest) {
    return this.http.post<AccountBlockResponse>(
      `${this.api}/accounts/${accountId}/hold`, req
    );
  }

  /** Débloquer – POST /accounts/blocks/{blockId}/unblock */
  unblockAccount(blockId: string, req: AccountUnblockRequest) {
    return this.http.post<AccountBlockResponse>(
      `${this.api}/accounts/blocks/${blockId}/unblock`, req
    );
  }

  /** Blocages actifs d'un compte – GET /accounts/{accountId}/blocks */
  getActiveBlocks(accountId: string) {
    return this.http.get<AccountBlockResponse[]>(
      `${this.api}/accounts/${accountId}/blocks`
    );
  }

  /** Tous les blocages (y compris historique) – GET /accounts/{accountId}/blocks/all */
  getAllBlocks(accountId: string) {
    return this.http.get<AccountBlockResponse[]>(
      `${this.api}/accounts/${accountId}/blocks/all`
    );
  }

  /** Vérifier si un compte peut débiter – GET /accounts/{accountId}/blocks/can-debit */
  canDebit(accountId: string) {
    return this.http.get<OperationCheckResponse>(
      `${this.api}/accounts/${accountId}/blocks/can-debit`
    );
  }

  /** Vérifier si un compte peut créditer – GET /accounts/{accountId}/blocks/can-credit */
  canCredit(accountId: string) {
    return this.http.get<OperationCheckResponse>(
      `${this.api}/accounts/${accountId}/blocks/can-credit`
    );
  }

  // ── Épargne automatique ────────────────────────────────────────────────────

  /** Créer une règle d'épargne – POST /accounts/{accountId}/savings-rules */
  createSavingsRule(accountId: string, req: SavingsRuleRequest) {
    return this.http.post<SavingsRuleResponse>(
      `${this.api}/accounts/${accountId}/savings-rules`, req
    );
  }

  /** Règles d'épargne d'un compte – GET /accounts/{accountId}/savings-rules */
  getSavingsRules(accountId: string, activeOnly = false) {
    return this.http.get<SavingsRuleResponse[]>(
      `${this.api}/accounts/${accountId}/savings-rules`,
      { params: { activeOnly: String(activeOnly) } }
    );
  }

  /** Désactiver une règle d'épargne – POST /accounts/savings-rules/{ruleId}/deactivate */
  deactivateSavingsRule(ruleId: string) {
    return this.http.post<SavingsRuleResponse>(
      `${this.api}/accounts/savings-rules/${ruleId}/deactivate`, {}
    );
  }

  /** Exécuter manuellement une règle – POST /accounts/savings-rules/{ruleId}/execute */
  executeSavingsRule(ruleId: string) {
    return this.http.post<SavingsExecutionResponse>(
      `${this.api}/accounts/savings-rules/${ruleId}/execute`, {}
    );
  }

  /** Statistiques d'épargne – GET /accounts/{accountId}/savings-stats */
  getSavingsStatistics(accountId: string) {
    return this.http.get<SavingsStatisticsResponse>(
      `${this.api}/accounts/${accountId}/savings-stats`
    );
  }

  // ── Taux d'intérêt ─────────────────────────────────────────────────────────

  /** Tous les taux – GET /accounts/interest-rates */
  getAllInterestRates() {
    return this.http.get<InterestRateResponse[]>(`${this.api}/accounts/interest-rates`);
  }

  /** Taux effectifs – GET /accounts/interest-rates/effective */
  getEffectiveInterestRates() {
    return this.http.get<InterestRateResponse[]>(
      `${this.api}/accounts/interest-rates/effective`
    );
  }

  /** Taux effectif pour un type de compte – GET /accounts/interest-rates/effective/{accountType} */
  getEffectiveRateForType(accountType: AccountType) {
    return this.http.get<InterestRateResponse>(
      `${this.api}/accounts/interest-rates/effective/${accountType}`
    );
  }

  /** Taux mensuel pour un type de compte – GET /accounts/interest-rates/monthly-rate/{accountType} */
  getMonthlyRate(accountType: AccountType) {
    return this.http.get<RateResponse>(
      `${this.api}/accounts/interest-rates/monthly-rate/${accountType}`
    );
  }

  // ── Calcul d'intérêts ──────────────────────────────────────────────────────

  /** Simuler des intérêts pour un montant donné – GET /accounts/interest/preview */
  previewInterest(accountType: AccountType, balance: number, durationMonths: number) {
    return this.http.get<InterestPreviewResponse>(
      `${this.api}/accounts/interest/preview`,
      { params: { accountType, balance: String(balance), durationMonths: String(durationMonths) } }
    );
  }

  /** Calcul réel des intérêts – GET /accounts/{accountId}/interest/calculate */
  calculateInterest(accountId: string, fromDate?: string, toDate?: string) {
    const params: Record<string, string> = {};
    if (fromDate) params['fromDate'] = fromDate;
    if (toDate)   params['toDate']   = toDate;
    return this.http.get<InterestCalculationResponse>(
      `${this.api}/accounts/${accountId}/interest/calculate`, { params }
    );
  }
}
