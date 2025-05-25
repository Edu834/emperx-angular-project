import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule, Location } from '@angular/common';
import { OrdersService } from '../../../core/service/orders/orders.service';
import { UserService } from '../../../core/service/user/user.service';
import { Pedido, ArticuloEnPedido, Articulo, Producto } from '../../../Interfaces/interfaces-globales';
import { ProductsService } from '../../../core/service/products/products.service';
import { User } from '../../../core/service/user/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  currentUserData: any;
  orders: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];

  estados: string[] = ['Pagado', 'Enviado', 'Entregado', 'Completado' ];
  estadoSeleccionado: string = this.estados[0];

  fotosMap: { [idArticulo: string]: string } = {};
  productosMap: { [idArticulo: string]: Producto } = {};
  articulosMap: { [idArticulo: string]: Articulo } = {};

  constructor(
    private location: Location,
    private pedidoService: OrdersService,
    private userService: UserService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      if (userData) {
        this.currentUserData = userData;
        this.listarPedidos(userData.idUsuario);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  cambiarEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.pedidosFiltrados = this.orders.filter(order => order.estado === estado);
    console.log('Pedidos filtrados por estado:', this.pedidosFiltrados);
  }

  listarPedidos(idUsuario: number): void {
    this.pedidoService.listarPedidos(idUsuario).subscribe((pedidos: Pedido[]) => {
      this.orders = pedidos;
      
      console.log('Pedidos obtenidos:', this.orders);
      this.cambiarEstado(this.estadoSeleccionado); // inicializar filtrado

      for (const pedido of this.orders) {
        for (const articulo of pedido.articulosEnPedido) {
          const idArticulo = articulo.id.idArticulo;

          this.productsService.obtenerArticuloPorId(idArticulo).subscribe((articuloData: Articulo) => {
            this.articulosMap[idArticulo] = articuloData;
            const producto = articuloData.producto;
            this.productosMap[idArticulo] = producto;

            if (producto?.galeria?.fotoFrontal) {
              this.fotosMap[idArticulo] = producto.galeria.fotoFrontal;
            }
          });
        }
      }
    });
  }
}
