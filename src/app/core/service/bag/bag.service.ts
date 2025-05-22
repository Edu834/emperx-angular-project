import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ArticuloEnPedidoDTO } from '../../../Interfaces/interfaces-globales';

@Injectable({
  providedIn: 'root'
})
export class BagService {

  constructor(private http: HttpClient) {}


    addArticuloCarrito(articuloEnPedidoDto :ArticuloEnPedidoDTO): Observable<any> {
      return this.http.post<any>('http://localhost:8087/api/pedidos/addArticuloPedido', articuloEnPedidoDto).pipe(
        catchError(error => {
          console.error('There was an error!', error);
          return throwError(() => new Error(error.message || 'Error en el registro'));
        })
      );
    }

    getArticulosPedido(idPedido: string): Observable<any> {
      return this.http.get<any>('http://localhost:8087/api/pedidos/buscarArticulosCompletoEnPedido/' + idPedido).pipe(
        catchError(error => {
          console.error('There was an error!', error);
          return throwError(() => new Error(error.message || 'Error en el registro'));
        })
      );
    }
}
