import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const isApiRequest =
    req.url.startsWith('https://localhost:7043/') ||
    req.url.startsWith(
      'https://intellectualconversationapi-bbbzgaccfravf3es.westus3-01.azurewebsites.net/',
    );

  if (!token || !isApiRequest) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest);
};
