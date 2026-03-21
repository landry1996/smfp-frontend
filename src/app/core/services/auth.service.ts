import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {
  LoginRequest, LoginResponse, TwoFactorRequest,
  CurrentUser, UserSession
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http      = inject(HttpClient);
  private router    = inject(Router);
  private tokenSvc  = inject(TokenService);

  private readonly api = environment.apiUrl;

  // ── State ──
  private _currentUser = signal<CurrentUser | null>(null);
  private _loading     = signal(false);
  private _pendingTwoFactor = signal<{ requiresTwoFactor: boolean; twoFactorToken?: string } | null>(null);

  readonly currentUser        = this._currentUser.asReadonly();
  readonly loading            = this._loading.asReadonly();
  readonly pendingTwoFactor   = this._pendingTwoFactor.asReadonly();
  readonly isAuthenticated    = computed(() => !!this._currentUser());
  readonly isAdmin            = computed(() => this._currentUser()?.role === 'ADMIN');
  readonly isAgent            = computed(() => this._currentUser()?.role === 'AGENT' || this.isAdmin());

  // ── Auth ──
  register(req: { firstName: string; lastName: string; email: string; phoneNumber: string; password: string }) {
    return this.http.post(`${this.api}/users/register`, req);
  }

  login(req: LoginRequest) {
    this._loading.set(true);
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, req).pipe(
      tap(res => {
        this._loading.set(false);
        if (res.requiresTwoFactor) {
          this._pendingTwoFactor.set({
            requiresTwoFactor: true,
            twoFactorToken: res.twoFactorToken
          });
          this.router.navigate(['/auth/2fa']);
        } else {
          this.handleLoginSuccess(res);
        }
      }),
      catchError(err => { this._loading.set(false); throw err; })
    );
  }

  verifyTwoFactor(code: string) {
    const pending = this._pendingTwoFactor();
    if (!pending?.twoFactorToken) return EMPTY;
    const req: TwoFactorRequest = { twoFactorToken: pending.twoFactorToken, code };
    return this.http.post<LoginResponse>(`${this.api}/auth/verify-2fa`, req).pipe(
      tap(res => {
        this._pendingTwoFactor.set(null);
        this.handleLoginSuccess(res);
      })
    );
  }

  refreshToken() {
    const refreshToken = this.tokenSvc.getRefreshToken();
    if (!refreshToken) return EMPTY;
    return this.http.post<LoginResponse>(`${this.api}/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        this.tokenSvc.setAccessToken(res.accessToken);
        if (res.refreshToken) this.tokenSvc.setRefreshToken(res.refreshToken);
      })
    );
  }

  loadCurrentUser() {
    return this.http.get<CurrentUser>(`${this.api}/auth/me`).pipe(
      tap(user => this._currentUser.set(user))
    );
  }

  logout() {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe({ complete: () => this.clearSession() });
  }

  logoutAll() {
    this.http.post(`${this.api}/auth/logout-all`, {}).subscribe({ complete: () => this.clearSession() });
  }

  getSessions() {
    return this.http.get<UserSession[]>(`${this.api}/auth/sessions`);
  }

  revokeSession(sessionId: string) {
    return this.http.delete(`${this.api}/auth/sessions/${sessionId}`);
  }

  private handleLoginSuccess(res: LoginResponse) {
    this.tokenSvc.setAccessToken(res.accessToken);
    this.tokenSvc.setRefreshToken(res.refreshToken);
    this.loadCurrentUser().subscribe(() => this.router.navigate(['/dashboard']));
  }

  private clearSession() {
    this.tokenSvc.clear();
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}
