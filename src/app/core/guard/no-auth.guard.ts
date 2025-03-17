import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { Observable, map } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        console.warn('noAuthGuard - Usuario ya autenticado, redirigiendo a home...');
        return router.createUrlTree(['/home']); 
      }

      return true;
    })
  );
};
