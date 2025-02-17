import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('authGuard - Estado de autenticación:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    console.warn('authGuard - Usuario ya autenticado, redirigiendo...');
    return router.createUrlTree(['/home']); // Redirige al dashboard o página principal
  }

  return true; // Permite acceder a la página de login si NO está autenticado
};
