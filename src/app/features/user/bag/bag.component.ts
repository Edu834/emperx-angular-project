import { Component } from '@angular/core';
import { OrdersService } from '../../../core/service/orders/orders.service';
import { UserService } from '../../../core/service/user/user.service';
import { User } from '../../../core/service/user/user';
import { Pedido } from '../../../Interfaces/interfaces-globales';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.css'
})
export class BagComponent {
  currentUserData: User | undefined;
  carrito: Pedido | undefined;

  goBack(): void {
    this.location.back();
  }

  constructor(private location: Location, private pedidoService: OrdersService, private userService: UserService){}
  ngOnInit() {  
    this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      if (userData) {
        this.currentUserData = userData;
        this.listarPedidos(userData.id_usuario, 'Carrito');
      }
    }
  );
  }

  listarPedidos(idUsuario: number, estado: string): void {
    this.pedidoService.listarPedidosPorEstado(idUsuario,estado).subscribe(pedidos => {
      this.carrito = pedidos[0];
      console.log(this.carrito);
    });
  }
}
