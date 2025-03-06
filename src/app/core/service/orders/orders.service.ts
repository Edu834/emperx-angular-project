import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ArticuloEnPedidoDTO, Producto, ProductView } from '../../../Interfaces/interfaces-globales';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private router: Router) {}

  crearArticuloEnCarrito(articuloEnPedidoDTO: ArticuloEnPedidoDTO): Observable<any> {
    return this.http.post<any>('http://localhost:8087/api/pedidos/addArticuloPedido', articuloEnPedidoDTO).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en al añadir al carrito'));
      })
    );
  }

}
