import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule, Location } from '@angular/common';
import { OrdersService } from '../../../core/service/orders/orders.service';
import { UserService } from '../../../core/service/user/user.service';
import { User } from '../../../core/service/user/user';
import { ArticuloEnPedido } from '../../../Interfaces/interfaces-globales';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  currentUserData: any;
  orders: ArticuloEnPedido[] = [];
  constructor( private location: Location, private pedidoService: OrdersService, private userService: UserService){}
  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {  
    this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      if (userData) {
        this.currentUserData = userData;
        this.listarPedidos(userData.id_usuario);
      }
    }
  );
  }
  
  listarPedidos(idUsuario: number): void {
    this.pedidoService.listarPedidos(idUsuario).subscribe(pedidos => {
      console.log(pedidos);
      this.orders = pedidos;
      console.log(this.orders);
    });
  }
  
}
