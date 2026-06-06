import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const isLoginRequest = req.url.includes('/auth/login');

  if (token && !isLoginRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only redirect to login on 401 for non-login requests
      // For login requests, let the error pass through to the component
      if (error.status === 401 && !isLoginRequest) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};