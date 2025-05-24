import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrdersService } from '../../core/service/orders/orders.service';
import { UserService } from '../../core/service/user/user.service';
import { Articulo, Estado, Pedido, Producto } from '../../Interfaces/interfaces-globales';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { FormBuilder, FormGroup, FormsModule, NgModel, NgModelGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../core/service/products/products.service';
import { User } from '../../core/service/user/user';


@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FooterComponent, HeaderComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  currentUserData: User | null = null;
  carrito: Pedido | null = null;

  fotosMap: { [idArticulo: string]: string } = {};
  productosMap: { [idArticulo: string]: Producto } = {};
  articulosMap: { [idArticulo: string]: Articulo } = {};

  estadosPermitidos = ['Nuevo', 'Algo Usado', 'Usado', 'Mal Estado'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private ordersService: OrdersService,
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.checkoutForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      country: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
    });
     this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      console.log('Datos del usuario autenticado:', userData);
      if (userData) {
        this.currentUserData = userData;
        this.checkoutForm.patchValue({
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          country: userData.country || '',
          province: userData.province || '',
          city: userData.city || '',
          zipCode: userData.zipCode?.toString() || '',
        });
        this.ordersService.listarPedidosPorEstado(userData.idUsuario, 'Carrito').subscribe(pedidos => {
          if (pedidos.length > 0) {
            this.carrito = pedidos[0];
            console.log('Carrito cargado:', this.carrito);
            this.cargarDatosArticulos();
          }
        });
      }
    });
  }

  cargarDatosArticulos(): void {
    if (!this.carrito?.articulosEnPedido) return;

    this.carrito.articulosEnPedido.forEach(articuloEnPedido => {
      const idArticulo = articuloEnPedido?.id?.idArticulo;
      if (!idArticulo) return;

      // Producto y foto
      this.productService.productoByIdArticulo(idArticulo).subscribe((producto: Producto) => {
        this.fotosMap[idArticulo] = producto.galeria?.fotoFrontal || '';
        this.productosMap[idArticulo] = producto;

        // Artículo completo
        this.productService.obtenerArticuloPorId(idArticulo).subscribe((articulo: Articulo) => {
          this.articulosMap[idArticulo] = articulo;
        });
      });
    });
  }

  calcularTotal(): number {
    if (!this.carrito?.articulosEnPedido) return 0;
    return this.carrito.articulosEnPedido.reduce((acc, item) => acc + item.precioFinal, 0);
  }

  eliminarArticulo(articuloEnPedido: any): void {
    const id = articuloEnPedido.id;
    if (!id || !id.idArticulo || !id.idPedido) return;

    this.ordersService.eliminarArticuloEnCarrito(id).subscribe({
      next: (pedidoActualizado) => {
        this.carrito = pedidoActualizado;

        delete this.fotosMap[id.idArticulo];
        delete this.productosMap[id.idArticulo];
        delete this.articulosMap[id.idArticulo];
      },
      error: (err) => {
        console.error('Error al eliminar el artículo del pedido:', err);
      }
    });
  }
onSubmit(): void {
  if (this.checkoutForm.valid && this.currentUserData) {
    const shippingInfo = this.checkoutForm.value;

    const updatedUser = {
      ...this.currentUserData,
      firstname: shippingInfo.firstname,
      lastname: shippingInfo.lastname,
      country: shippingInfo.country,
      province: shippingInfo.province,
      city: shippingInfo.city,
      zipCode: shippingInfo.zipCode,
    };

    // Actualizamos la info del usuario primero
    this.userService.updateUser(updatedUser).subscribe({
      next: (response) => {
        console.log('Información de envío actualizada correctamente');

        // Luego, si quieres actualizar el estado de un pedido (por ejemplo con idPedido que tienes)
        const idPedido = this.carrito?.idPedido;  // O el ID real que tengas en tu componente
        const nuevoEstado = 'Pagado'; // O el estado que quieras asignar

        if (idPedido) {
          this.ordersService.actualizarEstado(idPedido, nuevoEstado).subscribe({
            next: (pedidoActualizado) => {
              console.log('Estado del pedido actualizado correctamente', pedidoActualizado);
              // Aquí podrías redirigir o mostrar mensaje de éxito final
            },
            error: (error) => {
              console.error('Error al actualizar el estado del pedido:', error);
            }
          });
        } else {
          console.error('idPedido es undefined');
        }

      },
      error: (error) => {
        console.error('Error al actualizar la información de envío:', error);
      }
    });

  } else {
    console.error('Formulario inválido o datos de usuario no disponibles');
  }
}
  getEstadosFiltrados(estados: Estado[]): string {
    if (!estados) return '';
    return estados
      .filter(estado => this.estadosPermitidos.includes(estado.nombre))
      .map(estado => estado.nombre)
      .join(', ');
  }

  mapSexoToGender(sexo: string): string {
    if (!sexo) return 'unisex';
    const lower = sexo.toLowerCase();
    return lower === 'm' ? 'women' : lower === 'h' ? 'men' : 'unisex';
  }

  goToProduct(product: Producto): void {
    if (!product) return;

    const gender = this.mapSexoToGender(product.sexo);
    const category = product.subcategoria?.categoria?.nombre || 'categoria';
    const subcategory = product.subcategoria?.nombre || 'subcategoria';
    const name = product.nombre || 'producto';

    this.router.navigate([
      '/product',
      encodeURIComponent(gender),
      encodeURIComponent(category.toLowerCase()),
      encodeURIComponent(subcategory.toLowerCase()),
      encodeURIComponent(name.toLowerCase())
    ]);
  }

  goBack(): void {
    this.router.navigate(['/user/bag']);
  }
}
