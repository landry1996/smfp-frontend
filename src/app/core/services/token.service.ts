import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TokenService {

  private accessToken: string | null = null; // en mémoire (XSS-safe)

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(environment.refreshTokenKey, token);
  }

  clear(): void {
    this.accessToken = null;
    localStorage.removeItem(environment.refreshTokenKey);
  }

  isAccessTokenExpired(): boolean {
    if (!this.accessToken) return true;
    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
