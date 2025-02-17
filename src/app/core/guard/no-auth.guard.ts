import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const noAuthGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.warn('noAuthGuard - Usuario ya autenticado, redirigiendo a home...');
    return router.createUrlTree(['/home']); // Redirige a home si ya está logueado
  }

  return true; // Permite acceder a /login si NO está autenticado
};
