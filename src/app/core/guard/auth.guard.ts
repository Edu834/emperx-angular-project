import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('authGuard - Estado de autenticación:', authService.isAuthenticated());

  if (!authService.isAuthenticated()) {
    console.warn('authGuard - Usuario no autenticado, redirigiendo a login...');
    return router.createUrlTree(['/login']); // Redirige si NO está autenticado
  }

  return true; // Permite el acceso si está autenticado
};
