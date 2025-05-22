import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { Location } from '@angular/common';
import { RandomProductsComponent } from "../../../shared/random-product/random-product.component";
import { UserService } from '../../../core/service/user/user.service';
import { OrderService } from '../../../core/service/order/order.service';

@Component({
  selector: 'app-orders',
  imports: [HeaderComponent, FooterComponent, RandomProductsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  pedidos: any[] = [];
  usuario: any | undefined;
  constructor( private location: Location, private userService: UserService, private ordersService: OrderService){}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.userService.getAuthenticatedUser().subscribe({
      next: data => {
        if (data) this.usuario = data;
        console.log(this.usuario);
        this.mostrarPedidos();
      },
      error: err => {
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  mostrarPedidos(): void {
    if (!this.usuario) {
      console.error('Usuario no definido');
      return;
    }
    this.ordersService.buscarPedidosPorUsuario(this.usuario.id_usuario).subscribe({
      next: data => {
        if (data) this.pedidos = data;
        console.log(this.pedidos);
      }, error: err => {
        console.error(err);
      }
    });
  }
}
