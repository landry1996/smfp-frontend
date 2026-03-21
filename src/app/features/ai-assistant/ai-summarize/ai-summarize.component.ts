import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiService, AiChatResponse } from '../ai.service';

@Component({
  selector: 'app-ai-summarize',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ai-summarize.component.html',
})
export class AiSummarizeComponent {
  private aiSvc = inject(AiService);
  private fb    = inject(FormBuilder);

  form = this.fb.group({
    text:     ['', [Validators.required, Validators.maxLength(8000)]],
    maxWords: [100, [Validators.required, Validators.min(20), Validators.max(500)]],
    language: ['fr', Validators.required],
    context:  [''],
  });

  loading  = signal(false);
  response = signal<AiChatResponse | null>(null);
  error    = signal(false);

  submit() {
    if (this.form.invalid || this.loading()) return;

    const v = this.form.value;
    this.loading.set(true);
    this.response.set(null);
    this.error.set(false);

    this.aiSvc.summarize({
      text:     v.text!,
      maxWords: v.maxWords!,
      language: v.language!,
      context:  v.context || undefined,
    }).subscribe({
      next: r => { this.response.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  reset() {
    this.form.reset({ maxWords: 100, language: 'fr' });
    this.response.set(null);
    this.error.set(false);
  }
}
