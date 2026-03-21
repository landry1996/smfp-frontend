import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Notification } from '../../core/models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Notifications d'un utilisateur – GET /notifications/user/{userId} */
  getNotifications(userId: string) {
    return this.http.get<Notification[]>(`${this.api}/notifications/user/${userId}`);
  }

  /** Marquer une notification comme lue – PUT /notifications/{id}/read */
  markAsRead(notificationId: string) {
    return this.http.put(`${this.api}/notifications/${notificationId}/read`, {});
  }

  /** Marquer toutes les notifications comme lues – POST /notifications/user/{userId}/read-all */
  markAllRead(userId: string) {
    return this.http.post(`${this.api}/notifications/user/${userId}/read-all`, {});
  }
}
