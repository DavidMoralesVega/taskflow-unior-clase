import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Auth } from './auth';

// Adds the token to every request and closes the session when the API answers 401.
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(Auth);
  const token = auth.token();

  const withToken = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(withToken).pipe(
    catchError((error) => {
      if (error.status === 401 && token) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
