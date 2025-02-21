import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  
  @Input() product!: Product; // Define el tipo según tu modelo de producto

}
export interface Product {
  id: number;             // ID único del producto
  name: string;          // Nombre del producto
  price: number;         // Precio del producto
  imageUrl: string;      // URL de la imagen del producto
  description?: string;  // Descripción del producto (opcional)
}