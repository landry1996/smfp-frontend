import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type LoanPurpose    = 'PERSONAL' | 'HOME' | 'BUSINESS' | 'AUTO' | 'EDUCATION';
export type LoanEmployment = 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED';
export type LoanStatus     = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED';

export interface LoanRequest {
  userId:         string;
  loanAmount:     number;
  durationMonths: number;
  purpose:        LoanPurpose;
  employment:     LoanEmployment;
}

export interface LoanResponse {
  id:                  string;
  userId:              string;
  loanAmount:          number;
  principalBorrowed:   number;
  durationMonths:      number;
  monthlyPayment:      number;
  /** Taux annuel en pourcentage (ex: 8.5 pour 8,5%) */
  interestRate:        number;
  status:              LoanStatus;
  applicationDate:     string;
  disbursementDate?:   string;
  expectedMaturityDate?: string;
  paidAmount?:         number;
  purpose?:            string;
  reference?:          string;
}

export interface SimulateRequest {
  principal:          number;
  annualInterestRate: number;
  durationMonths:     number;
  amortizationType?:  'FRENCH' | 'GERMAN' | 'ANNUITY';
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Prêts d'un utilisateur – GET /loans/user/{userId} */
  getLoansByUser(userId: string) {
    return this.http.get<LoanResponse[]>(`${this.api}/loans/user/${userId}`);
  }

  /** Détail d'un prêt – GET /loans/{loanId} */
  getLoan(loanId: string) {
    return this.http.get<LoanResponse>(`${this.api}/loans/${loanId}`);
  }

  /** Demande de prêt – POST /loans */
  applyForLoan(req: LoanRequest) {
    return this.http.post<LoanResponse>(`${this.api}/loans`, req);
  }

  /** Simuler un prêt – POST /loans/simulate */
  simulate(req: SimulateRequest) {
    return this.http.post<any>(`${this.api}/loans/simulate`, req);
  }
}
