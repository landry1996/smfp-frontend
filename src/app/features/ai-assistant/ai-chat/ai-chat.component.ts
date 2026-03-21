import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiService, AiChatResponse } from '../ai.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ai-chat.component.html',
})
export class AiChatComponent {
  private aiSvc = inject(AiService);

  messageControl = new FormControl('', [Validators.required, Validators.maxLength(4000)]);
  loading  = signal(false);
  response = signal<AiChatResponse | null>(null);
  error    = signal(false);

  send() {
    if (this.messageControl.invalid || this.loading()) return;

    const message = this.messageControl.value!.trim();
    this.loading.set(true);
    this.response.set(null);
    this.error.set(false);

    this.aiSvc.chat({ message, language: 'fr' }).subscribe({
      next: r => { this.response.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  reset() {
    this.messageControl.reset();
    this.response.set(null);
    this.error.set(false);
  }
}
