import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, last, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from './user';
import { LoginRequest } from '../../../features/auth/login/loginRequest';
import { RegisterRequest } from '../../../features/auth/register/RegisterRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem('token') !=null);
    this.currentUserData=new BehaviorSubject<any>((sessionStorage.getItem('token') || ""));
  } 

  register(credentials: RegisterRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8087/auth/register', credentials).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8087/auth/login', credentials).pipe(
      tap((userData) => {
        sessionStorage.setItem('token', userData.token);
        this.currentUserLoginOn.next(true);
        this.currentUserData.next(userData.token);
      }),
      map((userData) => userData.token),
      catchError(error => {
        console.error('Error en la autenticación:', error);
        return throwError(() => new Error(error.error?.message || 'Error desconocido en el login'));
      })
    );
  }
  
  get userData(): Observable<User> {
    return this.currentUserData.asObservable();
  }
  
 // Método para cerrar sesión
 logout() {
  sessionStorage.removeItem('token');
  this.currentUserLoginOn.next(false); // 🔹 Notificar que cerró sesión
  this.currentUserData.next(null);
  this.router.navigate(['/login']); // Redirigir al login
}

// Método para obtener el estado de autenticación
isAuthenticated(): Observable<boolean> {
  return this.currentUserLoginOn.asObservable();
}

  
}
