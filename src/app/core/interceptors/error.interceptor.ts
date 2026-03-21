import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = err.error?.message ?? err.message;

      switch (err.status) {
        case 0:
          toastr.error('Impossible de contacter le serveur. Vérifiez votre connexion.', 'Erreur réseau');
          break;
        case 400:
          toastr.warning(message || 'Requête invalide.', 'Erreur de validation');
          break;
        case 404:
          toastr.warning('Ressource introuvable.', '404');
          break;
        case 408:
        case 503:
          toastr.error('Service temporairement indisponible (circuit breaker actif). Réessayez dans quelques secondes.', 'Timeout');
          break;
        case 500:
          toastr.error('Erreur interne du serveur. L\'équipe technique a été notifiée.', 'Erreur serveur');
          break;
        default:
          if (err.status !== 401 && err.status !== 403) {
            toastr.error(message || 'Une erreur inattendue est survenue.', `Erreur ${err.status}`);
          }
      }

      return throwError(() => err);
    })
  );
};
