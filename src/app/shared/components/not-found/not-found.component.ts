import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="text-8xl mb-4">🔍</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p class="text-gray-500 mb-6">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <a routerLink="/dashboard" class="btn-primary">Retour au dashboard</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
