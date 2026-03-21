export type MessageSender = 'USER' | 'BOT' | 'AGENT';
export type SessionStatus = 'ACTIVE' | 'ESCALATED' | 'CLOSED';

export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  intent?: string;
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  messages: ChatMessage[];
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  userId: string;
}
