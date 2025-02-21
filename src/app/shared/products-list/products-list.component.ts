import { Component } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-products-list',
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  products: Product[] = [
    { id: 1, name: 'Producto 1', price: 100, imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Producto 2', price: 200, imageUrl: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Producto 3', price: 300, imageUrl: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Producto 4', price: 400, imageUrl: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Producto 5', price: 500, imageUrl: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Producto 6', price: 600, imageUrl: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Producto 7', price: 700, imageUrl: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Producto 8', price: 800, imageUrl: 'https://via.placeholder.com/150' },
    { id: 9, name: 'Producto 9', price: 900, imageUrl: 'https://via.placeholder.com/150' },
    { id: 10, name: 'Producto 10', price: 1000, imageUrl: 'https://via.placeholder.com/150' },
    { id: 11, name: 'Producto 11', price: 1100, imageUrl: 'https://via.placeholder.com/150' },
    { id: 12, name: 'Producto 12', price: 1200, imageUrl: 'https://via.placeholder.com/150' },
    { id: 13, name: 'Producto 13', price: 1300, imageUrl: 'https://via.placeholder.com/150' },
    { id: 14, name: 'Producto 14', price: 1400, imageUrl: 'https://via.placeholder.com/150' },
    { id: 15, name: 'Producto 15', price: 1500, imageUrl: 'https://via.placeholder.com/150' },
    { id: 16, name: 'Producto 16', price: 1600, imageUrl: 'https://via.placeholder.com/150' },
    { id: 17, name: 'Producto 17', price: 1700, imageUrl: 'https://via.placeholder.com/150' },
    { id: 18, name: 'Producto 18', price: 1800, imageUrl: 'https://via.placeholder.com/150' },
    { id: 19, name: 'Producto 19', price: 1900, imageUrl: 'https://via.placeholder.com/150' },
    { id: 20, name: 'Producto 20', price: 2000, imageUrl: 'https://via.placeholder.com/150' }
  ];
}
export interface Product {
  id: number;             // ID único del producto
  name: string;          // Nombre del producto
  price: number;         // Precio del producto
  imageUrl: string;      // URL de la imagen del producto
  description?: string;  // Descripción del producto (opcional)
}