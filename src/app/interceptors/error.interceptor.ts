import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);
  return next(request).pipe(catchError((error: unknown) => {
    const message = error instanceof HttpErrorResponse ? error.status === 0 ? 'Unable to connect to the employee service.' : `Request failed (${error.status}). Please try again.` : 'An unexpected error occurred.';
    notificationService.showMessage(message);
    return throwError(() => new Error(message));
  }));
};
