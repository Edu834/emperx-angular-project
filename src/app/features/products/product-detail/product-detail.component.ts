import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto, ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductsService } from '../../../core/service/products/products.service';
import { SearchComponent } from "../../../shared/search/search.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [SearchComponent, HeaderComponent, FooterComponent]
})
export class ProductDetailComponent implements OnInit {

  showChild =  false;
  @Input() detallesVisible: boolean | undefined;
  product!: Producto | undefined; 
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

  constructor(private route: ActivatedRoute, private productsService: ProductsService) {}
id: string = '';
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.id)
  
    
    if (this.id) {
      this.getProductDetails(this.id);
    } else {
      console.error('ID del producto no válido');
    }
    console.log('ID del producto:', this.id);
  }

  getProductDetails(productId: string): void {
    this.productsService.getProductById(productId).subscribe(
      (product: Producto | null) => {
        if (product) {
          this.product = product;
          console.log('Producto obtenido:', product.subcategoria.nombre);
        } else {
          console.error('Producto no encontrado');
        }
      },
      (error: any) => {
        console.error('Error al obtener el producto:', error);
      }
    );
  }

  onColorChange(color: string) {
    this.selectedColor = this.selectedColor === color ? null : color;
    console.log('Color seleccionado:', this.selectedColor ?? 'Ninguno');
  }

  getSelectedColor(): string {
    return this.selectedColor ? this.selectedColor : 'Sin color seleccionado';
  }
}
