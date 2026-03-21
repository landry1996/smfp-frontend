export type Role = 'CLIENT' | 'AGENT' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  sessionId: string;
  expiresIn: number;
  refreshExpiresIn: number;
  requiresTwoFactor: boolean;
  twoFactorToken?: string;
}

export interface TwoFactorRequest {
  twoFactorToken: string;
  code: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface UserSession {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivityAt: string;
  current: boolean;
}

export interface CurrentUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string;
}
