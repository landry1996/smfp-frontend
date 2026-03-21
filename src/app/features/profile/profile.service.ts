import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id?:               string;
  userId?:           string;
  email:             string;
  firstName:         string;
  lastName:          string;
  fullName?:         string;
  phone?:            string;
  phoneNumber?:      string;
  role?:             string;
  roles?:            string[];
  status?:           string;
  twoFactorEnabled?: boolean;
  kycVerified?:      boolean;
  emailVerified?:    boolean;
  createdAt?:        string;
  lastPasswordChange?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Profil de l'utilisateur connecté – GET /auth/me */
  getProfile() {
    return this.http.get<UserProfile>(`${this.api}/auth/me`);
  }

  /** Profil d'un utilisateur par son ID – GET /users/{userId} */
  getUserById(userId: string) {
    return this.http.get<UserProfile>(`${this.api}/users/${userId}`);
  }
}
