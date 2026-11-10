import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ApiServiceAdmin } from './services/adminservice';

export const adminGuard: CanActivateFn = () => {
  const adminService = inject(ApiServiceAdmin);
  const router = inject(Router);

  return adminService.verifyAdminAccess().pipe(
    map((response: { isAdmin: boolean }) => {
      return response.isAdmin ? true : router.createUrlTree(['/']);
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
