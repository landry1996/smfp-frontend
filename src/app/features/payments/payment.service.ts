import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface TransferRequest {
  fromAccountId: string;
  toAccountId:   string;
  amount:        number;
  description?:  string;
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

export interface MobileMoneyRequest {
  accountId:    string;
  phoneNumber:  string;
  provider:     'ORANGE' | 'MTN' | 'EXPRESS_UNION';
  amount:       number;
  description?: string;
  billerCode?:  string;
  billReference?: string;
}

export interface MobileMoneyResponse {
  id:          string;
  provider?:   string;
  phoneNumber: string;
  accountId?:  string;
  amount:      number;
  status:      string;
  type:        string;
  createdAt:   string;
}

export interface Payment {
  id:              string;
  reference?:      string;
  type?:           string;
  paymentMethod?:  string;
  amount:          number;
  currency:        string;
  status:          string;
  direction?:      'CREDIT' | 'DEBIT';
  beneficiaryName?: string;
  recipientAccount?: string;
  createdAt:       string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Historique des paiements de l'utilisateur */
  getPayments(userId: string) {
    return this.http.get<Payment[]>(`${this.api}/payments/user/${userId}`);
  }

  /** Virement bancaire – POST /payments/transfer */
  transfer(req: TransferRequest) {
    return this.http.post<TransferResponse>(`${this.api}/payments/transfer`, req);
  }

  /** Cash-out: virement compte bancaire → mobile money */
  cashOut(req: MobileMoneyRequest) {
    return this.http.post<MobileMoneyResponse>(`${this.api}/mobile-money/cash-out`, req);
  }

  /** Cash-in: recharge compte bancaire depuis mobile money */
  cashIn(req: MobileMoneyRequest) {
    return this.http.post<MobileMoneyResponse>(`${this.api}/mobile-money/cash-in`, req);
  }

  /** Paiement de facture via mobile money */
  billPayment(req: MobileMoneyRequest) {
    return this.http.post<MobileMoneyResponse>(`${this.api}/mobile-money/bill-payment`, req);
  }

  /** Transactions mobile money d'un compte */
  getMobileMoneyTransactions(accountId: string) {
    return this.http.get<MobileMoneyResponse[]>(`${this.api}/mobile-money/account/${accountId}`);
  }

  /** Détecter l'opérateur depuis le numéro de téléphone */
  detectProvider(phoneNumber: string) {
    return this.http.get<{ code: string; name: string; shortCode: string }>(
      `${this.api}/mobile-money/detect-provider`, { params: { phoneNumber } }
    );
  }
}
