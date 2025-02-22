import { Component, Input } from '@angular/core';
import { FooterComponent } from "../../../shared/footer/footer.component";
import { ProductsListComponent } from "../../../shared/products-list/products-list.component";
import { SearchComponent } from "../../../shared/search/search.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { ActivatedRoute } from '@angular/router';
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
  imports: [FooterComponent, SearchComponent, HeaderComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() detallesVisible: boolean | undefined;
  showChild =  false;
  

  product!: Product | undefined; // Permite que product sea indefinido hasta que se encuentre
  // Simulando un servicio para productos
  products: Product[] = [
      { id: 1, name: 'Producto 1', price: 100, imageUrl: 'https://via.placeholder.com/150', gender: 'men', category: 'shoes', subcategory: 'sneakers' },
      { id: 2, name: 'Producto 2', price: 200, imageUrl: 'https://via.placeholder.com/150', gender: 'women', category: 'dresses', subcategory: 'casual' },
      { id: 3, name: 'Producto 3', price: 300, imageUrl: 'https://via.placeholder.com/150', gender: 'men', category: 'shirts', subcategory: 'formal' },
      { id: 4, name: 'Producto 4', price: 400, imageUrl: 'https://via.placeholder.com/150', gender: 'women', category: 'shoes', subcategory: 'heels' },
      { id: 5, name: 'Producto 5', price: 500, imageUrl: 'https://via.placeholder.com/150', gender: 'men', category: 'pants', subcategory: 'jeans' },
    ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.products.find(product => product.id === productId);
  }

}
