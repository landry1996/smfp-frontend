import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="text-8xl mb-4">🚫</div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p class="text-gray-500 mb-6">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <a routerLink="/dashboard" class="btn-primary">Retour au dashboard</a>
      </div>
    </div>
  `,
})
export class ForbiddenComponent {}
