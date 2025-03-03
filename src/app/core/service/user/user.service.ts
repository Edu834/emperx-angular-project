import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../auth/user';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUsers(id:number):Observable<User>{ {
    return this.http.get<User>(`http://localhost:8087/api/usuarios/`+ id).pipe(
      catchError(this.handleError)
    );
}


  
}

  getAuthenticatedUser(): Observable<User | null> {
    const token = sessionStorage.getItem('token'); 
    if (!token) {
      return of(null); 
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Configurar el encabezado


    return this.http.get<User>(`http://localhost:8087/api/usuarios/me`, {headers}).pipe(
      catchError(error => {
        console.error('Error al obtener el usuario autenticado', error);
        return of(null);  
      })
    );
  }

  

  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.error('An error occurred:', error.error);
    }else{
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(()=> new Error('Algo falló. Por favor, inténtelo de nuevo más tarde.'));
  }
}