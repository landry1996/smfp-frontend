import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height:60vh">
      <div class="text-center py-5">
        <i class="bi bi-question-circle text-secondary" style="font-size:5rem"></i>
        <h1 class="fw-bold mt-3 mb-2">404 – Page introuvable</h1>
        <p class="text-muted mb-4">La page que vous cherchez n\'existe pas ou a ete deplacee.</p>
        <a routerLink="/dashboard" class="btn btn-primary">
          <i class="bi bi-house me-2"></i>Retour au dashboard
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
