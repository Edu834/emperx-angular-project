import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

   private apiUrl = 'http://localhost:8087/api/usuarios'; // Ajusta a tu backend

  

getAllUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Maneja diferentes formatos de respuesta
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.usuarios)) {
          return response.usuarios;
        } else if (response && Array.isArray(response.users)) {
          return response.users;
        } else {
          console.warn('Formato de respuesta inesperado en getAllUsers:', response);
          return [];
        }
      }),
      catchError(this.handleError)
    );
  }



  updateUserByid(id: string, data: Partial<User>) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  constructor(private http:HttpClient) { }

  getUsers(id:number):Observable<User>{ {
    return this.http.get<User>(`http://localhost:8087/api/usuarios/`+ id).pipe(
      catchError(this.handleError)
    );
}


  
}

getAuthenticatedUser(): Observable<User | null> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    return of(null);
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any>(`http://localhost:8087/api/usuarios/me`, { headers }).pipe(
    map(apiUser => {
      if (!apiUser) return null;

      const adaptedUser: User = {
        idUsuario: apiUser.id_usuario,
        username: apiUser.username,
        firstname: apiUser.firstname,
        lastname: apiUser.lastname,
        password: apiUser.password,
        email: apiUser.email,
        direccion: apiUser.direccion,
        sexo: apiUser.sexo,
        telefono: apiUser.telefono,
        fechaAlta: new Date(apiUser.fecha_alta),
        fechaNacimiento: new Date(apiUser.fecha_nacimiento),
        country: apiUser.country,
        province: apiUser.province,
        city: apiUser.city,
        zipCode: apiUser.zipCode,
        role: apiUser.role
      };

      return adaptedUser;
    }),
    catchError(error => {
      console.error('Error al obtener el usuario autenticado', error);
      return of(null);
    })
  );
}


  
  // getAuthenticatedUserId(): Observable<number | null> {
  //   return this.getAuthenticatedUser().pipe(
  //     map(user => user ? user.id_usuario : null),
  //     catchError(error => {
  //       console.error('Error al obtener el ID del usuario autenticado', error);
  //       return of(null);
  //     })
  //   );
  // }
  

  updateUser(userData: any): Observable<any> {
    return this.http.put<any>('http://localhost:8087/auth/edit', userData).pipe(
      catchError(error => {
        console.error('Error al actualizar el usuario:', error);
        return throwError(() => new Error(error.error?.message || 'Error al actualizar el usuario'));
      }),
      tap(response => {
        console.log('Usuario actualizado con éxito:', response);
      })
    );
  }

    updateUser2(id: number, user: any): Observable<any> {
      console.log(user);
      console.log(id);
    return this.http.put<any>(`http://localhost:8087/api/usuarios/${id}`, user);
  }
  
  changePassword(idUsuario: number, passwordActual: string, nuevaPassword: string): Observable<any> {
    const body = {
      idUsuario: idUsuario,        // Se agrega el id del usuario
      passwordActual: passwordActual,
      nuevaPassword: nuevaPassword
    };

    // Suponiendo que el backend tenga un endpoint para cambiar la contraseña
    return this.http.put<any>(`http://localhost:8087/auth/change-password`, body);
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

  getUsuarioById(id: number) {
  return this.http.get(`http://localhost:8087/api/usuarios/${id}`);
  }

  eliminarUsuario(id: string) {
    return this.http.delete(`http://localhost:8087/api/usuarios/${id}`);
  }
  
  obtenerUsuariosPorDia() {
    return this.http.get<any[]>('http://localhost:8087/api/usuarios/nuevos-por-dia');
  }
}