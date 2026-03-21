export type NotificationChannel  = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'WEBHOOK';
export type NotificationStatus   = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreference {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  channels: NotificationChannel[];
}
