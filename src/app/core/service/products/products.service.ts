import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Producto, ProductView } from '../../../Interfaces/interfaces-globales';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private router: Router) {}

  listArticulosPorSubCategoria(idSubcategoria: number) {
    idSubcategoria=1;
    return this.http.get('http://localhost:8087/api/articulos/buscarPor/Subcategoria/' + idSubcategoria).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of([]);  
      })
    );
  }
  listArticulos() {
    return this.http.get('http://localhost:8087/api/articulos').pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of([]);  
      })
    );
  }
  listArticulosPorSexo(sexo: string) {
    return this.http.get('http://localhost:8087/api/articulos/buscarPorSexo/'+ sexo).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }
  listArticulosPorSexoAndCategoria(sexo: string, idCategoria: any) {
    return this.http.get('http://localhost:8087/api/articulos/buscarPorSexoYCategoria/'+ sexo + '/' + idCategoria).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }
  listCategorias() {
    return this.http.get('http://localhost:8087/api/articulos/categorias').pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);
      })
    );
  }
  listSubcategorias() {
    return this.http.get('http://localhost:8087/api/articulos/subcategorias').pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);
      })
    );
  }
  getProductById(id: string) {
    return this.http.get<Producto>(`http://localhost:8087/api/productos/buscarUno/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(null);  
      })
    );
  }

  getArticulosByNameProduct(name: string) {
    return this.http.get('http://localhost:8087/api/articulos/buscarPorNombreProducto/' + name).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }

  obtenerProductos(): Observable<any> {
    return this.http.get<any>('http://localhost:8087/api/productos/');
  }
}
