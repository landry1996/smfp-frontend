// ── Enums / types ──────────────────────────────────────────────────────────────
export type PaymentStatus       = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type MobileMoneyOperator = 'ORANGE' | 'MTN' | 'EXPRESS_UNION';

// ── Request DTOs ───────────────────────────────────────────────────────────────
/** Virement bancaire – POST /payments/transfer */
export interface TransferRequest {
  fromAccountId: string;
  toAccountId:   string;
  amount:        number;
  description?:  string;
}

/** Paiement Mobile Money – POST /payments/mobile-money */
export interface MobileMoneyRequest {
  fromAccountId: string;
  phoneNumber:   string;
  operator:      MobileMoneyOperator;
  amount:        number;
  description?:  string;
}

export interface QRCodeRequest {
  accountId:    string;
  amount?:      number;
  description?: string;
}

export interface RecurringPaymentRequest {
  fromAccountId: string;
  toAccountId:   string;
  amount:        number;
  frequency:     'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate:     string;
  endDate?:      string;
  description?:  string;
}

// ── Response DTOs ──────────────────────────────────────────────────────────────
export interface Payment {
  id:               string;
  reference?:       string;
  type?:            string;
  paymentMethod?:   string;
  amount:           number;
  currency:         string;
  status:           PaymentStatus;
  direction?:       'CREDIT' | 'DEBIT';
  beneficiaryName?: string;
  recipientAccount?: string;
  createdAt:        string;
  completedAt?:     string;
}

export interface TransferResponse {
  paymentId:     string;
  fromAccountId: string;
  toAccountId:   string;
  amount:        number;
  status:        string;
  createdAt:     string;
  completedAt?:  string;
}
