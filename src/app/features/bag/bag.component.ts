import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RandomProductsComponent } from "../../shared/random-product/random-product.component";
import { Articulo } from '../../Interfaces/interfaces-globales';
import { BagService } from '../../core/service/bag/bag.service';
import { OrderService } from '../../core/service/order/order.service';
import { UserService } from '../../core/service/user/user.service';
import { User } from '../../core/service/user/user';

@Component({
  selector: 'app-bag',
  imports: [HeaderComponent, FooterComponent, CommonModule, RandomProductsComponent],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.css'
})
export class BagComponent {
  articulosCarrito: Articulo[] = [];
  idPedido: string = '';
  usuario: any | undefined;
  constructor(private location: Location, private bagService: BagService, private orderService: OrderService, private userService: UserService) { }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.userService.getAuthenticatedUser().subscribe({
      next: data => {
        if (data) this.usuario = data;
        console.log(this.usuario);
        this.mostrarArticulosPedido();
      },
      error: err => {
        console.error(err);
      }
    });
  }
  goBack(): void {
    this.location.back();
  }

  mostrarArticulosPedido(): void {
    if (!this.usuario) {
      console.error('Usuario no definido');
      return;
    }
    this.orderService.buscarPedidoPorUsuarioyEstado(this.usuario.id_usuario, "CARRITO").subscribe({
      next: data => {
        if (data) this.idPedido = data[0].idPedido;
        console.log(this.idPedido);
        if (!this.idPedido) {
          console.error('No se encontró el idPedido en el localStorage');
          return;
        }
        //cargo los articulos del carrtito del usuario
        this.bagService.getArticulosPedido(this.idPedido).subscribe({
          next: data => {
            if (data) this.articulosCarrito = data;
            console.log(this.articulosCarrito);
          }, error: err => {
            console.error(err);
          }
        });
      },
      error: err => {
        console.error(err);
      }
    }
    );
  }
}
