import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductView } from '../../Interfaces/interfaces-globales';

@Component({
  selector: 'app-product-card',
  standalone: true,  // Si estás usando Angular 14+ puedes usar "standalone"
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'] // Cambiado a "styleUrls"
})
export class ProductCardComponent {
  foto: string = '';
  @Input() product!: ProductView | undefined; // Asegúrate de que este tipo se defina correctamente en tu archivo de interfaces.

  getSexo(): string {
    return this.product?.sexo === 'H' ? 'men' : 'women';
  }

  getCategoria(): string {  
    return this.product?.subcategoria.categoria.nombre.toLowerCase() ?? '';
  }

  getSubcategoria(): string {
    return this.product?.subcategoria.nombre.toLowerCase() ?? '';
  }
  getName(): string {
    return this.product?.name ?? '';
  }
  getFoto(): string {
    console.log('Foto:', this.product?.galeria);
    this.foto = this.product?.galeria.fotoFrontal ?? ''
    
    return this.foto;
  }
  // Variable para controlar la visibilidad de los detalles del producto
  detallesVisible: boolean = false;

  // Función para mostrar u ocultar detalles del producto
  mostrarDetallesProducto() {
    this.detallesVisible = !this.detallesVisible;
  }
}
