import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { User } from '../../../core/service/user/user';
import { UserService } from '../../../core/service/user/user.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../../../core/service/auth/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FavoritesComponent } from '../../favorites/favorites.component';
import { FavoritesService } from '../../../core/service/favorites/favorites.service';
import { Articulo, Pedido, Producto, ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductCardComponent } from "../../../shared/product-card/product-card.component";
import { OrdersService } from '../../../core/service/orders/orders.service';
import { ProductsService } from '../../../core/service/products/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, FooterComponent, RouterLink, ProductCardComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user?:User;
  date?: string;          // Para mostrar la fecha de nacimiento en un formato más amigable
  isLoading: boolean = true;    // Para mostrar un cargando mientras obtenemos los datos
  error: string = '';          // Para mostrar un mensaje de error en caso de que falle la solicitud
  favoritos: any[] = [];
  orders: Pedido[] | undefined;
    currentUserData: any;

    pedidos: Pedido[] = [];
  
    estados: string[] = ['Pagado', 'Enviado', 'Completado', 'Cancelado'];
    estadoSeleccionado: string = this.estados[0];
  
    fotosMap: { [idArticulo: string]: string } = {};
    productosMap: { [idArticulo: string]: Producto } = {};
    articulosMap: { [idArticulo: string]: Articulo } = {};

  constructor(private userService: UserService, private favoritosService: FavoritesService, private route: ActivatedRoute,
    // private location: Location,
    private pedidoService: OrdersService,
    private productsService: ProductsService) {}

  ngOnInit(): void {
    
    this.userService.getAuthenticatedUser().subscribe({
      next: (data) => {
        if (data) {
          this.user = data;  
          this.date = this.getDate(this.user.fechaAlta);
          this.listarPedidos(this.user.idUsuario);
          // console.log(data);
        } else {
          this.error = 'No se pudo obtener la información del usuario.';
        }
        this.isLoading = false;  
      },
      error: (err) => {
        this.error = 'Error al cargar la información del usuario.';
        console.error(err);
        this.isLoading = false;
      }

    })
    
    ;
    this.favoritosService.getFavoritos().subscribe((data: ProductView[]) => {
      this.favoritos = data.slice(-3); // Obtiene los últimos 3 elementos
    });
  }
  getDate(fechaAlta: string | Date): string {
    console.log('Fecha de alta:', fechaAlta);
    const date = new Date(fechaAlta);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return `Member since ${date.toLocaleDateString('en-US', options)}`;
  }
  
   listarPedidos(idUsuario: number): void {
    console.log('Entrarr');
      this.pedidoService.listarPedidos(idUsuario).subscribe((pedidos: Pedido[]) => {
       const ultimosPedidos = pedidos.slice(-2).reverse(); // opcional reverse() para mostrar el más reciente primero
        this.pedidos = ultimosPedidos;
        
        console.log('Pedidos obtenidos:', pedidos.length);
        // this.cambiarEstado(this.estadoSeleccionado); // inicializar filtrado
  
        for (const pedido of this.pedidos) {
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
