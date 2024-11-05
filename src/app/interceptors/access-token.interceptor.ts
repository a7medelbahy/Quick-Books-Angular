import { inject } from '@angular/core';
import { HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';


export const accessTokenInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
  const headers: any = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  request = request.clone({ setHeaders: headers });
  return next(request);
};
