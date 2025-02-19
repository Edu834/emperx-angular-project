import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private router: Router) {}

  listProductosPorSubCategoria(idSubcategoria: number) {
    idSubcategoria=1;
    return this.http.get('http://localhost:8087/api/articulos/buscarPor/Subcategoria/' + idSubcategoria).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }
  listArticulos() {
    return this.http.get('http://localhost:8087/api/articulos').pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return of(null);  
      })
    );
  }
}
