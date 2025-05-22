import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  buscarPedidosPorUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>('http://localhost:8087/api/pedidos/buscarPor/' + idUsuario).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en el registro'));
      })
    );
  }


}
