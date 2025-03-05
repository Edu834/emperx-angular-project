import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginRequest } from '../../../features/auth/login/loginRequest';
import { RegisterRequest } from '../../../features/auth/register/registerRequest';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';
  private expirationKey = 'token_expiration';
  private expirationTimeout: any; // Variable para manejar el timeout

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkTokenExpiration(); // Verifica si el token ha expirado al iniciar la app
    this.currentUserLoginOn.next(this.getToken() !== null);
    this.currentUserData.next(this.getToken());
  }
  

  register(credentials: RegisterRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8087/auth/register', credentials).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en el registro'));
      })
    );
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8087/auth/login', credentials).pipe(
      tap((userData) => {
        this.setToken(userData.token); // Guardar token con expiración tomada del propio token
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

  get userData(): Observable<any> {
    return this.currentUserData.asObservable();
  }

  // 🔹 Guardar token y establecer expiración a partir del campo `exp` en el token
  public setToken(token: string): void {
    const expirationTime = this.getExpirationTimeFromToken(token);
    if (expirationTime) {
      sessionStorage.setItem(this.tokenKey, token);
      sessionStorage.setItem(this.expirationKey, expirationTime.toString());

      this.scheduleTokenRemoval(expirationTime - Date.now()); // Establecemos el tiempo de expiración exacto
    }
  }
 
  

  
  // 🔹 Obtener token si no ha expirado
getToken(): string | null {
    const expiration = sessionStorage.getItem(this.expirationKey);
    if (expiration && Date.now() > +expiration) {
      this.removeToken();
      return null;
    }
    return sessionStorage.getItem(this.tokenKey);
  }

  // 🔹 Programar la eliminación del token después del tiempo de expiración
  private scheduleTokenRemoval(delay: number): void {
    if (this.expirationTimeout) {
      clearTimeout(this.expirationTimeout);
    }

    this.expirationTimeout = setTimeout(() => {
      this.removeToken();
      alert("⚠️ Tu sesión ha expirado. Inicia sesión nuevamente.");
      this.router.navigate(['/login']); // Redirigir a login al expirar
    }, delay);
  }

  // 🔹 Verificar expiración al iniciar la app
  private checkTokenExpiration(): void {
    const expiration = sessionStorage.getItem(this.expirationKey);
    if (expiration) {
      const expirationTime = +expiration;
      const timeRemaining = expirationTime - Date.now();

      if (timeRemaining <= 0) {
        this.removeToken(); // Eliminar el token si ha expirado
      } else {
        this.scheduleTokenRemoval(timeRemaining); // Si aún no ha expirado, programar eliminación
      }
    } else {
      this.removeToken(); // Si no existe un token, eliminar todo
    }
  }

  // 🔹 Eliminar token
  private removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.expirationKey);
    this.currentUserLoginOn.next(false);
    this.currentUserData.next(null);
  }

  // 🔹 Cerrar sesión manualmente
  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  // 🔹 Verificar autenticación
  isAuthenticated(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  // 🔹 Decodificar el token JWT y extraer la fecha de expiración
  private getExpirationTimeFromToken(token: string): number | null {
    try {
      const payload = token.split('.')[1]; // Obtenemos la parte payload del JWT
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // Decodificamos en Base64Url
      const parsedPayload = JSON.parse(decodedPayload);

      return parsedPayload.exp ? parsedPayload.exp * 1000 : null; // Convertimos exp a milisegundos
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
