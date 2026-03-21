import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

const PUBLIC_URLS = ['/api/auth/login', '/api/auth/verify-2fa', '/api/users/register'];

let isRefreshing = false;

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenSvc = inject(TokenService);
  const authSvc  = inject(AuthService);
  const router   = inject(Router);

  if (PUBLIC_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = tokenSvc.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !isRefreshing) {
        isRefreshing = true;
        return authSvc.refreshToken().pipe(
          switchMap(res => {
            isRefreshing = false;
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.accessToken}` }
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            isRefreshing = false;
            authSvc.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      if (err.status === 403) router.navigate(['/forbidden']);
      return throwError(() => err);
    })
  );
};
