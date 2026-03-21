import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AiChatRequest, AiChatResponse,
  AiSummarizeRequest, FraudExplainRequest,
} from '../../core/models/ai.models';

export type { AiChatRequest, AiChatResponse, AiSummarizeRequest, FraudExplainRequest };

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private api  = environment.aiUrl;

  /** Chat libre avec le modèle Mistral — POST /api/ai/chat */
  chat(request: AiChatRequest) {
    return this.http.post<AiChatResponse>(`${this.api}/chat`, request);
  }

  /** Résumé d'un texte ou document — POST /api/ai/summarize */
  summarize(request: AiSummarizeRequest) {
    return this.http.post<AiChatResponse>(`${this.api}/summarize`, request);
  }

  /** Explication d'une alerte fraude — POST /api/ai/fraud/explain */
  explainFraud(request: FraudExplainRequest) {
    return this.http.post<AiChatResponse>(`${this.api}/fraud/explain`, request);
  }
}
