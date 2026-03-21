import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent — racine de l'application.
 * Son unique responsabilité est d'héberger le <router-outlet>.
 * Toute la logique métier (auth, layout, navigation) est déléguée
 * aux composants enfants via le routing.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {}
