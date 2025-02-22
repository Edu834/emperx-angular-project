import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink,],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent  {
  
  @Input() product!: Product;
  detallesVisible: boolean = false;

  mostrarDetallesProducto() {
    this.detallesVisible = !this.detallesVisible;
  }
}
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  gender: string;
  category: string;
  subcategory: string;
}