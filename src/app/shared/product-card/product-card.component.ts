import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductView } from '../../Interfaces/interfaces-globales';
import { FavoritesService } from '../../core/service/favorites/favorites.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,  // Si estás usando Angular 14+ puedes usar "standalone"
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'] // Cambiado a "styleUrls"
})
export class ProductCardComponent {
  foto: string = '';
  @Input() product!: ProductView ; // Asegúrate de que este tipo se defina correctamente en tu archivo de interfaces.
  constructor(private favoritesService: FavoritesService ) {}
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
  favoritos: number[] = [];
  cargarFavoritos() {
    this.favoritesService.getFavoritos().subscribe(favoritos => {
      this.favoritos = favoritos.map(p => p.idProducto);
    });
  }
   // Método para añadir o quitar de favoritos
toggleFavorito(producto: ProductView) {
  console.log('Producto:', producto);
  if (this.favoritesService.esFavorito(producto.idProducto)) {
    this.favoritesService.eliminarFavorito(producto.idProducto);
  } else {
    this.favoritesService.agregarFavorito(producto);
  }
  this.cargarFavoritos();
}

// Verificar si un producto está en favoritos
esFavorito(productoId: string): boolean {
  return this.favoritesService.esFavorito(productoId);
}
}
