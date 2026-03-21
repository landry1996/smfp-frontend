import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BLOCKED';

export interface AdminUser {
  userId:      string;
  id?:         string;
  email:       string;
  firstName:   string;
  lastName:    string;
  fullName?:   string;
  status:      UserStatus;
  roles?:      string[];
  role?:       string;
  createdAt?:  string;
  twoFactorEnabled?: boolean;
  kycVerified?:      boolean;
}

export interface RbacRole {
  id:               string;
  role:             string;
  displayName:      string;
  description?:     string;
  hierarchyLevel:   number;
  permissionCodes:  string[];
  permissionCount:  number;
  isSystem:         boolean;
  isActive:         boolean;
}

export interface RbacPermission {
  id:           string;
  code:         string;
  name:         string;
  description?: string;
  category:     string;
  resourceType: string;
  actionType:   string;
  isSystem:     boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Liste tous les utilisateurs – GET /users */
  getUsers() {
    return this.http.get<AdminUser[]>(`${this.api}/users`);
  }

  /** Active un utilisateur – POST /users/{userId}/activate */
  activateUser(userId: string) {
    return this.http.post(`${this.api}/users/${userId}/activate`, {});
  }

  /** Suspend un utilisateur – POST /users/{userId}/suspend */
  suspendUser(userId: string) {
    return this.http.post(`${this.api}/users/${userId}/suspend`, {});
  }

  /** Bloque un utilisateur – POST /users/{userId}/block */
  blockUser(userId: string) {
    return this.http.post(`${this.api}/users/${userId}/block`, {});
  }

  /** Réactive un utilisateur – POST /users/{userId}/reactivate */
  reactivateUser(userId: string) {
    return this.http.post(`${this.api}/users/${userId}/reactivate`, {});
  }

  /** Roles RBAC – GET /rbac/roles */
  getRoles() {
    return this.http.get<RbacRole[]>(`${this.api}/rbac/roles`);
  }

  /** Permissions RBAC – GET /rbac/permissions */
  getPermissions() {
    return this.http.get<RbacPermission[]>(`${this.api}/rbac/permissions`);
  }

  /** Hiérarchie des rôles – GET /rbac/roles/hierarchy */
  getRoleHierarchy() {
    return this.http.get<{ role: string; displayName: string; hierarchyLevel: number; permissionCount: number }[]>(
      `${this.api}/rbac/roles/hierarchy`
    );
  }
}
