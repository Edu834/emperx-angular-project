import { Component } from '@angular/core';
import { OrdersService } from '../../../core/service/orders/orders.service';
import { UserService } from '../../../core/service/user/user.service';
import { User } from '../../../core/service/user/user';
import { Articulo, Estado, Pedido, Producto } from '../../../Interfaces/interfaces-globales';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { ProductsService } from '../../../core/service/products/products.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css']
})
export class BagComponent {
  currentUserData: User | undefined;
  carrito: Pedido | undefined;

  // Mapas para fotos, productos y artículos
  fotosMap: { [idArticulo: string]: string } = {};
  productosMap: { [idArticulo: string]: Producto } = {};
  articulosMap: { [idArticulo: string]: Articulo } = {};

  estadosPermitidos = ['Nuevo', 'Algo Usado', 'Usado', 'Mal Estado'];

  constructor(
    private location: Location,
    private pedidoService: OrdersService,
    private userService: UserService,
    private productService: ProductsService,
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      if (userData) {
        this.currentUserData = userData;
        this.listarPedidos(userData.idUsuario, 'Carrito');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  calcularTotal(): number {
    if (!this.carrito?.articulosEnPedido) return 0;
    return this.carrito.articulosEnPedido.reduce((total, articulo) => total + articulo.precioFinal, 0);
  }

  listarPedidos(idUsuario: number, estado: string): void {
    this.pedidoService.listarPedidosPorEstado(idUsuario, estado).subscribe(pedidos => {
      this.carrito = pedidos[0];
      if (this.carrito?.articulosEnPedido && Array.isArray(this.carrito.articulosEnPedido)) {
        this.carrito.articulosEnPedido.forEach(articuloEnPedido => {
          const idArticulo = articuloEnPedido?.id?.idArticulo;
          if (idArticulo) {
            // Obtener información del producto
            this.productService.productoByIdArticulo(idArticulo).subscribe((producto: Producto) => {
              // Guardar foto y producto en mapas
              this.fotosMap[idArticulo] = producto.galeria?.fotoFrontal || '';
              this.productosMap[idArticulo] = producto;

              // Obtener info completa del artículo
              this.productService.obtenerArticuloPorId(idArticulo).subscribe((articulo: Articulo) => {
                this.articulosMap[idArticulo] = articulo;
              });
            });
          } else {
            console.warn('Artículo sin idArticulo:', articuloEnPedido);
          }
        });
      }
    });
  }

  eliminarArticulo(articuloEnPedido: any): void {
    const id = articuloEnPedido.id;
    if (!id || !id.idArticulo || !id.idPedido) return;

    this.ordersService.eliminarArticuloEnCarrito(id).subscribe({
      next: (pedidoActualizado) => {
        this.carrito = pedidoActualizado;
        // Eliminar entradas del artículo eliminado en los mapas
        delete this.fotosMap[id.idArticulo];
        delete this.productosMap[id.idArticulo];
        delete this.articulosMap[id.idArticulo];

        // Actualizar lista de artículos en carrito
        if (this.carrito && pedidoActualizado.articulosEnPedido && Array.isArray(pedidoActualizado.articulosEnPedido)) {
          this.carrito.articulosEnPedido = pedidoActualizado.articulosEnPedido;
        }
      },
      error: (err) => {
        console.error('Error al eliminar el artículo del pedido:', err);
      }
    });
  }

  // Filtrar y mostrar estados permitidos
  getEstadosFiltrados(estados: Estado[]): string {
    if (!estados) return '';
    return estados
      .filter(estado => this.estadosPermitidos.includes(estado.nombre))
      .map(estado => estado.nombre)
      .join(', ');
  }

  // Mapear sexo a gender para la ruta
  mapSexoToGender(sexo: string): string {
    if (!sexo) return 'unisex';
    sexo = sexo.toLowerCase();
    if (sexo === 'm') return 'women';
    if (sexo === 'h') return 'men';
    return 'unisex';
  }

  // Navegar a la página del producto con ruta correcta y codificada
  goToProduct(product: Producto): void {
    if (!product) return;

    const gender = this.mapSexoToGender(product.sexo);
    const category = product.subcategoria?.categoria?.nombre || 'categoria';
    const subcategory = product.subcategoria?.nombre || 'subcategoria';
    const name = product.nombre || 'producto';

    // Codificar cada segmento para evitar problemas con espacios y caracteres especiales
    this.router.navigate([
      '/product',
      encodeURIComponent(gender),
      encodeURIComponent(category.toLowerCase()),
      encodeURIComponent(subcategory.toLowerCase()),
      encodeURIComponent(name.toLowerCase())
    ]);
  }
}
