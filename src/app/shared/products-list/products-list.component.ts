import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent {
  products: Product[] = [
    { 
      id: 1, 
      name: 'Producto 1', 
      price: 100, 
      imageUrl: 'https://via.placeholder.com/150', 
      gender: 'men', 
      category: 'ready-to-wear', 
      subcategory: 'knitwear', 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
    },
    { 
      id: 2, 
      name: 'Producto 2', 
      price: 200, 
      imageUrl: 'https://via.placeholder.com/150', 
      gender: 'women', 
      category: 'ready-to-wear', 
      subcategory: 'dresses', 
      description: "Vestido elegante y sofisticado, ideal para cualquier ocasión especial."
    },
    { 
      id: 3, 
      name: 'Producto 3', 
      price: 300, 
      imageUrl: 'https://via.placeholder.com/150', 
      gender: 'men', 
      category: 'ready-to-wear', 
      subcategory: 'tops&bodysuits', 
      description: "Camiseta moderna y cómoda, perfecta para un look casual."
    },
    { 
      id: 4, 
      name: 'Producto 4', 
      price: 400, 
      imageUrl: 'https://via.placeholder.com/150', 
      gender: 'women', 
      category: 'ready-to-wear', 
      subcategory: 't-shirts', 
      description: "Playera versátil con un diseño minimalista, ideal para combinar con cualquier outfit."
    },
    { 
      id: 5, 
      name: 'Producto 5', 
      price: 500, 
      imageUrl: 'https://via.placeholder.com/150', 
      gender: 'men', 
      category: 'ready-to-wear', 
      subcategory: 'jeans', 
      description: "Jeans de alta calidad con ajuste cómodo y duradero, perfectos para el día a día."
    }
  ];
  
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
