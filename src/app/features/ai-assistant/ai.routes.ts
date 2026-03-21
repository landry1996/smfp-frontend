import { Routes } from '@angular/router';

export const AI_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ai-chat/ai-chat.component').then(m => m.AiChatComponent),
  },
  {
    path: 'summarize',
    loadComponent: () => import('./ai-summarize/ai-summarize.component').then(m => m.AiSummarizeComponent),
  },
  {
    path: 'fraud-explain',
    loadComponent: () => import('./fraud-explain/fraud-explain.component').then(m => m.FraudExplainComponent),
  },
];
