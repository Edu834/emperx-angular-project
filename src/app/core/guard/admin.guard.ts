import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service'; // ajusta el path si es necesario

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();
    console.log(role);
    if (role === 'ADMIN') {
      return true;
    }

    // Redirige si no es admin
    this.router.navigate(['/unauthorized']); // o cualquier ruta que desees
    return false;
  }
}
