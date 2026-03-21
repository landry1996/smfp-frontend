// ── Requests ────────────────────────────────────────────────────────────────────

export interface AiChatRequest {
  message:    string;
  sessionId?: string;
  userId?:    string;
  language?:  string;
}

export interface AiSummarizeRequest {
  text:      string;
  maxWords:  number;
  language:  string;
  context?:  string;
}

export interface FraudExplainRequest {
  transactionId:  string;
  amount:         number;
  riskScore:      number;
  riskLevel:      string;
  triggeredRules: string[];
  location?:      string;
  userId?:        string;
  language:       string;
}

// ── Response ────────────────────────────────────────────────────────────────────

export interface AiChatResponse {
  response:    string;
  model:       string;
  durationMs:  number;
  tokenCount:  number;
  /** true si Ollama était indisponible — réponse de dégradation gracieuse */
  fallback:    boolean;
  timestamp:   string;
}
