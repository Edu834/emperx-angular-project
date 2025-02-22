import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  
  @Input() product!: Product; // Define el tipo según tu modelo de producto
  detallesVisible: boolean = false;

  mostrarDetallesProducto(){
    this.detallesVisible = !this.detallesVisible
  }

}
export interface Product {
  id: number;             // ID único del producto
  name: string;          // Nombre del producto
  price: number;         // Precio del producto
  imageUrl: string;      // URL de la imagen del producto
  description?: string;  // Descripción del producto (opcional)
}