import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Document {
  id:            string;
  userId?:       string;
  name?:         string;
  originalFileName?: string;
  documentType?: string;
  contentType?:  string;
  status:        string;
  version?:      number;
  createdAt?:    string;
  uploadedAt?:   string;
}

export interface DownloadUrlResponse {
  url:               string;
  expirationMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Documents d'un utilisateur – GET /documents/user/{userId} */
  getUserDocuments(userId: string) {
    return this.http.get<Document[]>(`${this.api}/documents/user/${userId}`);
  }

  /** Documents actifs d'un utilisateur – GET /documents/user/{userId}/active */
  getActiveDocuments(userId: string) {
    return this.http.get<Document[]>(`${this.api}/documents/user/${userId}/active`);
  }

  /** Document par ID – GET /documents/{documentId} */
  getDocument(documentId: string) {
    return this.http.get<Document>(`${this.api}/documents/${documentId}`);
  }

  /** URL de téléchargement temporaire – GET /documents/{documentId}/download-url */
  getDownloadUrl(documentId: string, expirationMinutes = 15) {
    return this.http.get<DownloadUrlResponse>(
      `${this.api}/documents/${documentId}/download-url`,
      { params: { expirationMinutes: String(expirationMinutes) } }
    );
  }

  /** Télécharger le contenu binaire – GET /documents/{documentId}/download */
  downloadDocument(documentId: string) {
    return this.http.get(`${this.api}/documents/${documentId}/download`, {
      responseType: 'blob',
    });
  }

  /** Uploader un document – POST /documents/upload (multipart) */
  uploadDocument(file: File, userId: string, type: string, name?: string, description?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('type', type);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    return this.http.post<Document>(`${this.api}/documents/upload`, formData);
  }

  /** Supprimer un document (soft delete) – DELETE /documents/{documentId} */
  deleteDocument(documentId: string) {
    return this.http.delete(`${this.api}/documents/${documentId}`);
  }

  /** Rechercher des documents – GET /documents/user/{userId}/search?query= */
  searchDocuments(userId: string, query: string) {
    return this.http.get<Document[]>(
      `${this.api}/documents/user/${userId}/search`, { params: { query } }
    );
  }
}
