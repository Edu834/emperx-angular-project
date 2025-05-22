
import { Component   
} from '@angular/core';
import { OrdersService } from '../../../core/service/orders/orders.service';
import { UserService } from '../../../core/service/user/user.service';
import { User } from '../../../core/service/user/user';
import { Articulo, Estado, Pedido, Producto } from '../../../Interfaces/interfaces-globales';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';
import { ProductsService } from '../../../core/service/products/products.service';

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css']
})
export class BagComponent {
  currentUserData: User | undefined;
  carrito: Pedido | undefined;

  // Mapa para guardar fotos, clave: idArticulo, valor: rutaFoto
  fotosMap: { [idArticulo: string]: string } = {};
  
  // Mapa para guardar información completa del producto de cada artículo
  productosMap: { [idArticulo: string]: Producto } = {};
  articulosMap: { [idArticulo: string]: Articulo } = {};

  constructor(
    private location: Location,
    private pedidoService: OrdersService,
    private userService: UserService,
    private productService: ProductsService
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
    
    return this.carrito.articulosEnPedido.reduce((total, articuloEnPedido) => {
      return total + articuloEnPedido.precioFinal;
    }, 0);
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
              // Guardar la foto del producto en el mapa
              this.fotosMap[idArticulo] = producto.galeria.fotoFrontal;
              
              // Guardar toda la información del producto
              this.productosMap[idArticulo] = producto;
              
              console.log('Producto del artículo:', producto);
              console.log('Foto del producto:', producto.galeria.fotoFrontal);

              // Obtener información completa del artículo
            this.productService.obtenerArticuloPorId(idArticulo).subscribe((articulo: Articulo) => {
              // Guardar toda la información del artículo
              this.articulosMap[idArticulo] = articulo;
              
              console.log('Datos completos del artículo:', articulo);
              console.log('Nombre del artículo:', articulo.nombre);
              console.log('Talla:', articulo.talla);
              console.log('Color:', articulo.color);
                            console.log('Color:', articulo.estados);

              console.log('Stock disponible:', articulo.stock);
              // console.log('Código de color:', articulo.codigo_color);
              console.log('Descripción:', articulo.descripcion);
            });
            });

            
          } else {
            console.warn('Articulo sin idArticulo:', articuloEnPedido);
          }
        });
      }
    });
    
}
estadosPermitidos = ['Nuevo', 'Algo Usado', 'Usado', 'Mal Estado'];

// Método para obtener los nombres de estados filtrados
getEstadosFiltrados(estados: Estado[]): string {
  if (!estados) return '';
  return estados
    .filter(estado => this.estadosPermitidos.includes(estado.nombre))
    .map(estado => estado.nombre)
    .join(', ');
}
}