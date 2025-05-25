import { Component } from '@angular/core';
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { HeaderComponent } from "../../../../shared/header/header.component";
import { OrdersService } from '../../../../core/service/orders/orders.service';
import { UserService } from '../../../../core/service/user/user.service';
import { ProductsService } from '../../../../core/service/products/products.service';
import { CommonModule, Location } from '@angular/common';
import { Articulo, ArticuloEnPedido, Pedido, Producto } from '../../../../Interfaces/interfaces-globales';
import { ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-orders-details',
  imports: [FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.css'
})
export class OrdersDetailsComponent {
  articulos: Articulo[] = [];
    pedidoId: string = '';
  pedido: Pedido | null = null;
  articulosMap: { [id: string]: Articulo } = {};
  productosMap: { [id: string]: Producto } = {};
  fotosMap: { [id: string]: string } = {};
  articulosEnPedido: ArticuloEnPedido[] = [];

    constructor(
      private route: ActivatedRoute,
    private location: Location,
    private orderService: OrdersService,
    private productsService: ProductsService
  ) {}
  
  goBack(): void {
    this.location.back();
  }
    ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.pedidoId) {
      this.cargarPedido(this.pedidoId);
    }
  }

 cargarPedido(id: string): void {
    this.orderService.listarArticulosPedido(id).subscribe((articulos: ArticuloEnPedido[]) => {
      this.articulosEnPedido = articulos;
      console.log('Artículos en el pedido:', this.articulosEnPedido);
      articulos.forEach(articuloEnPedido => {
        const idArticulo = articuloEnPedido.id.idArticulo;

        // Cargar info del artículo
        this.productsService.obtenerArticuloPorId(idArticulo).subscribe((articulo: Articulo) => {
          this.articulosMap[idArticulo] = articulo;

          // Guardar el producto y foto
          const producto = articulo.producto;
          this.productosMap[idArticulo] = producto;
          this.fotosMap[idArticulo] = producto?.galeria?.fotoFrontal || '';
        });
      });
    });
  }
}


