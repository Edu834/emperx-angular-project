import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { Observable, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      console.log('authGuard - Estado de autenticación:', isAuthenticated);

      if (!isAuthenticated) {
        console.warn('authGuard - Usuario no autenticado, redirigiendo a login...');
        return router.createUrlTree(['/login']); // Redirige si NO está autenticado
      }

      return true; // Permite el acceso si está autenticado
    })
  );
};
