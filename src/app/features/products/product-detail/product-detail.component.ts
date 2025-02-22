import { Component, Input } from '@angular/core';
import { FooterComponent } from "../../../shared/footer/footer.component";
import { ProductsListComponent } from "../../../shared/products-list/products-list.component";
import { SearchComponent } from "../../../shared/search/search.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
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
@Component({
  selector: 'app-product-detail',
  imports: [FooterComponent, SearchComponent, HeaderComponent, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() detallesVisible: boolean | undefined;
  showChild =  false;
  

  product!: Product | undefined; // Permite que product sea indefinido hasta que se encuentre
  // Simulando un servicio para productos
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
  
    colors = [
      { name: 'Negro', code: '#000000' },
      { name: 'Azul', code: '#007bff' },
      { name: 'Marrón', code: '#8B4513' },
      { name: 'Verde', code: '#4CAF50' },
      { name: 'Gris', code: '#808080' },
      { name: 'Multicolor', code: 'linear-gradient(45deg, red, blue, yellow, green)' },
      { name: 'Naranja', code: '#FF5722' },
      { name: 'Rosa', code: '#E91E63' },
      { name: 'Morado', code: '#9C27B0' },
      { name: 'Rojo', code: '#F44336' },
      { name: 'Blanco', code: '#FFFFFF', border: '1px solid #ccc' },
      { name: 'Amarillo', code: '#FFEB3B' },
    ];
    selectedColor: string | null = null;
    onColorChange(color: string) {
      this.selectedColor = this.selectedColor === color ? null : color;
      console.log('Color seleccionado:', this.selectedColor ?? 'Ninguno');
    }
  
    getSelectedColor(): string {
      return this.selectedColor ? this.selectedColor : 'Sin color seleccionado';
    }
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.products.find(product => product.id === productId);
  }

}
