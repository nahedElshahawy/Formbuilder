// src/app/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add headers or modify request
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${this.getToken()}`,
        // Add other headers as needed
      }
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}