import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ArticuloEnPedidoDTO, IdArticuloEnPedido, Producto, ProductView } from '../../../Interfaces/interfaces-globales';

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

  eliminarArticuloEnCarrito(idArticuloEnPedido: IdArticuloEnPedido): Observable<any> {
    return this.http.post<any>('http://localhost:8087/api/pedidos/eliminarArticuloPedido', idArticuloEnPedido).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en al eliminar del carrito'));
      })
    );
  }

  cambiarCantidadArticuloEnCarrito(idArticuloEnPedido: IdArticuloEnPedido, accion: string): Observable<any> {
    return this.http.put<any>('http://localhost:8087/api/pedidos/cambiarCantidadArticuloPedido/'+ accion, idArticuloEnPedido).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en al cambiar la cantidad del articulo en el carrito'));
      }
      )
    );
  }

  listarPedidos(idUsuario: number): Observable<any> {
    return this.http.get<any>('http://localhost:8087/api/pedidos/buscarPor/' + idUsuario).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en al listar los pedidos'));
      })
    );
  }

  listarArticulosPedido(idPedido: number): Observable<any> {
    return this.http.get<any>('http://localhost:8087/api/pedidos/buscarArticulosEnPedido/' + idPedido).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en al listar los articulos del pedido'));
      })
    );
  }

  listarPedidosPorEstado(idUsuario: number, estado: string): Observable<any> {
    return this.http.get<any>('http://localhost:8087/api/pedidos/buscarPor/' + idUsuario + '/' + estado).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error en al listar los pedidos por estado'));
      })
    );
  }
    listarPedidosTodo(){
    return this.http.get<any[]>('http://localhost:8087/api/pedidos/');
  }
  pedidosByFecha(){
    return this.http.get<any[]>('http://localhost:8087/api/pedidos/byFecha');
  }

  deleteOrder(idPedido: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:8087/api/pedidos/${idPedido}`).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => new Error(error.message || 'Error al eliminar el pedido'));
      })
    );
  }

}
