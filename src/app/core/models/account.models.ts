export type AccountType = 'SAVINGS' | 'CHECKING' | 'LOAN' | 'INVESTMENT';
export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'CLOSED' | 'PENDING';

export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  reference?: string;
  createdAt: string;
}

export type BalanceHistoryType = 'DAILY' | 'MONTHLY';

export interface BalanceHistory {
  id: string;
  accountId: string;
  recordDate: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  creditCount: number;
  debitCount: number;
  minimumBalance: number;
  maximumBalance: number;
  averageBalance: number;
  type: BalanceHistoryType;
  createdAt: string;
}

export interface DepositRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface WithdrawRequest {
  accountId: string;
  amount: number;
  description?: string;
}
