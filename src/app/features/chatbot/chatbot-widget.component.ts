import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../../core/services/auth.service';
import { ChatMessage } from '../../core/models/chatbot.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chatbot-widget.component.html',
})
export class ChatbotWidgetComponent implements OnDestroy {
  private auth    = inject(AuthService);
  open            = signal(false);
  messages        = signal<ChatMessage[]>([]);
  connecting      = signal(false);
  sessionId       = signal('');
  messageControl  = new FormControl('');
  private stompClient?: Client;

  toggle() {
    this.open.update(v => !v);
    if (this.open() && !this.stompClient?.connected) this.connect();
  }

  private connect() {
    this.connecting.set(true);
    const sid = `session-${Date.now()}`;
    this.sessionId.set(sid);

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        this.connecting.set(false);
        this.stompClient!.subscribe(`/user/queue/chat/${sid}`, (msg: IMessage) => {
          const body = JSON.parse(msg.body) as ChatMessage;
          this.messages.update(m => [...m, body]);
        });
        this.addBotMessage('Bonjour ! Je suis votre assistant SMFP. Comment puis-je vous aider ?');
      },
      onDisconnect: () => this.connecting.set(false),
    });
    this.stompClient.activate();
  }

  sendMessage() {
    const text = this.messageControl.value?.trim();
    if (!text || !this.stompClient?.connected) return;

    const userId = this.auth.currentUser()?.userId ?? 'anonymous';
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sessionId: this.sessionId(),
      content: text,
      sender: 'USER',
      timestamp: new Date().toISOString(),
    };
    this.messages.update(m => [...m, msg]);
    this.stompClient.publish({
      destination: `/app/chat/${this.sessionId()}`,
      body: JSON.stringify({ sessionId: this.sessionId(), message: text, userId }),
    });
    this.messageControl.reset();
  }

  private addBotMessage(content: string) {
    this.messages.update(m => [...m, {
      id: Date.now().toString(), sessionId: this.sessionId(),
      content, sender: 'BOT', timestamp: new Date().toISOString()
    }]);
  }

  ngOnDestroy() { this.stompClient?.deactivate(); }
}
