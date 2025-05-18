import { Component, Input, OnInit } from '@angular/core';


import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductsService } from '../../core/service/products/products.service';
import { Articulo, ProductView } from '../../Interfaces/interfaces-globales';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-random-products',
  templateUrl: 'random-product.component.html',
  styleUrls: [],
  imports: [ProductCardComponent, CommonModule],
})
export class RandomProductsComponent implements OnInit {
  randomProducts: ProductView[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.listArticulos().subscribe(listaArticulos => {
      const allProducts: ProductView[] = this.convertirArticulosAProductos(listaArticulos);
      this.randomProducts = this.seleccionarAleatorios(allProducts, 3);
    });
  }

  private convertirArticulosAProductos(listaArticulos: Articulo[]): ProductView[] {
    const products: ProductView[] = [];

    listaArticulos.forEach(e => {
      let product = products.find(p => p.idProducto === e.producto.idProducto);
      if (!product) {
        products.push({
          idProducto: e.producto.idProducto,
          subcategoria: e.producto.subcategoria,
          sexo: e.producto.sexo,
          name: e.producto.nombre,
          price: e.producto.precio,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 1,
          estados: e.estados.map((estado: any) => estado.nombre),
          color: [e.color],
          size: [e.talla],
          articulos: [e.idArticulo],
          galeria: e.producto.galeria,
          marca: e.producto.marca
        });
      } else {
        product.stock += 1;
        if (!product.color.includes(e.color)) product.color.push(e.color);
        if (!product.size.includes(e.talla)) product.size.push(e.talla);
        product.articulos.push(e.idArticulo);
      }
    });

    return products;
  }

  private seleccionarAleatorios(lista: ProductView[], cantidad: number): ProductView[] {
    const copia = [...lista];
    return copia.sort(() => 0.5 - Math.random()).slice(0, cantidad);
  }
}
