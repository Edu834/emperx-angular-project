import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  register(registerObj: {username:"", address:"", email:"", phone:"", password:"", confirmPassword:""}) {
    return this.http.post('http://localhost:8087/api/usuarios/registro', registerObj).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }

  // Método para autenticar al usuario
  login(loginObj: { username: string, password: string }) {
    return this.http.post('http://localhost:8087/api/usuarios/login', loginObj).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }

  
  saveUser(data: any) {
    if (data && data.username) {
      // Almacenar los datos del usuario en el localStorage
      localStorage.setItem('user', JSON.stringify(data));  
      this.router.navigate(['/home']);  // Redirigir a la página de inicio
    } else {
      throw new Error('No user data received');
    }
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;  // Si hay un usuario en el localStorage, está autenticado
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  
}
