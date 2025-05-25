import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Articulo, ArticuloEnPedidoDTO, ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductsService } from '../../../core/service/products/products.service';
import { SearchComponent } from "../../../shared/search/search.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../../core/service/favorites/favorites.service';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from "./product-information/product-information.component";
import { RandomProductsComponent } from "../../../shared/random-product/random-product.component";
import { User } from '../../../core/service/user/user';
import { UserService } from '../../../core/service/user/user.service';
import { OrdersService } from '../../../core/service/orders/orders.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [
    SearchComponent, HeaderComponent, FooterComponent, FormsModule,
    CommonModule, AccordionComponent, RandomProductsComponent 
  ],
  standalone: true
})
export class ProductDetailComponent implements OnInit {

  mostrarBotonFiltros = false;
  mostrarFiltros = false;
  showChild = false;
  @Input() detallesVisible?: boolean;

  selectedColor: string | null = null;
  availableSizes: string[] = [];
  selectedSize: string | null = null;
  selectedDays = 1; // Mínimo 1 día para alquiler
  listaArticulos: any;
  availableStates: { idArticulo: string; estados: string; deshabilitado: boolean; }[] = [];
  
  // Variables para cálculo de precio
  precioBase: number = 0;
  precioFinal: number = 0;
  
  // Mapeo estado → descuento (0 a 1)
  estadoDescuentos: { [estadoNombre: string]: number } = {
    'Nuevo': 0,
    'Mal estado': 0.5,
    'Reparado': 0.2,
    'Usado': 0.3,
    'Excelente': 0.1,
    'Bueno': 0.15,
    'Regular': 0.4,
    // Añade más estados según tu necesidad
  };

  resumenProductosConArticulos: ProductView[] = [];
  articulos: Articulo[] = [];
  articuloEnPedidoDTO?: ArticuloEnPedidoDTO;
  name = '';
  idUsuario = 0;

  fotoSeleccionada = '';

  product?: ProductView;

  favoritos: number[] = [];

  selectedStateId: string | null = null;

  colorMap: { [key: string]: string } = {
    'Negro': 'black',
    'Blanco': 'white',
    'Azul': 'blue',
    'Rojo': 'red',
    'Verde': 'green',
    'Amarillo': 'yellow',
    'Gris': 'gray',
    'Beige': '#f5f5dc',
    'Rosa': 'pink',
    // Añade más si necesitas
  };

  constructor(
    private route: ActivatedRoute,
    private service: ProductsService,
    private userService: UserService,
    private ordersService: OrdersService,
    private favoritesService: FavoritesService,
  
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.name = params.get('name') ?? '';
      this.obtenerArticulosDelProducto(this.name);
    });
  }

  getFotosGaleria(): string[] {
    if (!this.product || !this.product.galeria) return [];
    const fotos = Object.values(this.product.galeria).filter(foto => typeof foto === 'string' && foto.trim() !== '');
    return fotos.length > 0 ? fotos : ['https://assets-global.website-files.com/6256995755a7ea0a3d8fbd11/645924d369c84c1e3dbda2ad_Frame%201.jpg'];
  }

  cambiarImagen(foto: string): void {
    this.fotoSeleccionada = foto;
  }

  obtenerArticulosDelProducto(name: string): void {
    this.service.getArticulosByNameProduct(name).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.articulos = data;
          this.cargarDatos(data);
        } else {
          this.articulos = [];
          this.cargarDatos([]);
        }
      },
      error => console.error('Error al cargar los artículos:', error)
    );
  }

  cargarDatos(data: Articulo[]): void {
    this.resumenProductosConArticulos = [];

    data.forEach(e => {
      let productoExistente = this.resumenProductosConArticulos.find(p => p.idProducto === e.producto.idProducto);

      if (!productoExistente) {
        productoExistente = {
          idProducto: e.producto.idProducto,
          subcategoria: e.producto.subcategoria,
          sexo: e.producto.sexo,
          name: e.producto.nombre,
          price: e.producto.precio,
          imageUrl: e.producto.galeria ? Object.values(e.producto.galeria).find(foto => typeof foto === 'string' && foto.trim() !== '') || 'https://assets-global.website-files.com/6256995755a7ea0a3d8fbd11/645924d369c84c1e3dbda2ad_Frame%201.jpg' : 'https://assets-global.website-files.com/6256995755a7ea0a3d8fbd11/645924d369c84c1e3dbda2ad_Frame%201.jpg',
          description: e.producto.descripcion,
          stock: e.stock,
          estados: e.estados.map(estado => estado.nombre),
          color: [e.color],
          size: [e.talla],
          articulos: [e.idArticulo],
          galeria: e.producto.galeria,
          marca: e.producto.marca
        };
        this.resumenProductosConArticulos.push(productoExistente);
      } else {
        productoExistente.stock += e.stock;
        if (!productoExistente.color.includes(e.color)) productoExistente.color.push(e.color);
        if (!productoExistente.size.includes(e.talla)) productoExistente.size.push(e.talla);
        if (!productoExistente.articulos.includes(e.idArticulo)) productoExistente.articulos.push(e.idArticulo);
      }
    });

    if (this.resumenProductosConArticulos.length > 0) {
      this.product = this.resumenProductosConArticulos[0];
      
      // Inicializar precios
      this.precioBase = this.product.price;
      this.selectedDays = 1; // Mínimo un día para alquiler
      this.precioFinal = this.precioBase * this.selectedDays; // Precio inicial sin descuento
      
      if (this.product.galeria && (this.product.galeria as any).fotoFrontal) {
        this.fotoSeleccionada = (this.product.galeria as any).fotoFrontal;
      } else {
        this.fotoSeleccionada = this.product.imageUrl;
      }
    }
  }

  onSelectedColor(color: string): void {
    this.selectedColor = color;
    this.selectedSize = null;
    this.selectedStateId = null; // Resetear estado seleccionado
    this.availableSizes = [];
    this.availableStates = [];
    this.updateAvailableSizes();
    this.actualizarPrecioFinal(); // Recalcular precio
  }

  updateAvailableSizes(): void {
    if (!this.selectedColor) {
      this.availableSizes = [];
      return;
    }
    const sizes = this.articulos
      .filter(a => a.color === this.selectedColor)
      .map(a => a.talla);

    this.availableSizes = Array.from(new Set(sizes));
  }

  onSelectSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSize = select.value;
    this.selectedStateId = null; // Resetear estado seleccionado
    this.updateAvailableStates();
    this.actualizarPrecioFinal(); // Recalcular precio
  }

  updateAvailableStates(): void {
    if (!this.selectedColor || !this.selectedSize) {
      this.availableStates = [];
      return;
    }
    const filtered = this.articulos.filter(a => a.color === this.selectedColor && a.talla === this.selectedSize);
    this.availableStates = filtered.map(a => {
      const nombresEstados = a.estados.map(e => e.nombre);
      const deshabilitado = nombresEstados.some(n => n.includes("Alquilado") || n.includes("Retirado"));
      return {
        idArticulo: a.idArticulo,
        estados: nombresEstados.join(' - '),
        deshabilitado
      };
    });
  }

  onSelectedState(idArticulo: string): void {
    this.selectedStateId = idArticulo;
    const estado = this.availableStates.find(a => a.idArticulo === idArticulo);
    if (estado) {
      this.aplicarDescuentoPorEstado(estado.estados);
    }
    console.log('Estado seleccionado:', estado);
  }

  cargarFavoritos(): void {
    this.favoritesService.getFavoritos().subscribe(favs => {
      this.favoritos = favs.map(p => p.idProducto);
    });
  }

  toggleFavorito(producto: ProductView): void {
    if (this.favoritesService.esFavorito(producto.idProducto)) {
      this.favoritesService.eliminarFavorito(producto.idProducto);
    } else {
      this.favoritesService.agregarFavorito(producto);
    }
    this.cargarFavoritos();
  }

  esFavorito(productoId: string): boolean {
    return this.favoritesService.esFavorito(productoId);
  }

  getCssColor(colorName: string): string {
    return this.colorMap[colorName] ?? 'transparent';
  }

  onSelectedDays(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDays = Math.max(1, parseInt(input.value, 10) || 1); // Mínimo 1 día
    this.actualizarPrecioFinal();
  }

addToBag(): void {
  if (!this.selectedColor || !this.selectedSize || !this.selectedStateId) {
    alert('Seleccione un color, talla y estado para agregar al carrito');
    return;
  }

  const selectedArticulo = this.articulos.find(a => a.idArticulo === this.selectedStateId);
  if (!selectedArticulo) {
    alert('No se encontró el artículo seleccionado');
    return;
  }

  // Actualiza el precio final antes de agregar al carrito
  this.actualizarPrecioFinal();

  this.userService.getAuthenticatedUser().subscribe(user => {
    if (user) {
      this.idUsuario = user.idUsuario;
      this.articuloEnPedidoDTO = {
        idArticulo: selectedArticulo.idArticulo,
        idUsuario: this.idUsuario.toString(),
        cantidad: 1,
        diasAlquiler: this.selectedDays,
        precioFinal: this.precioFinal
      };

      if (this.articuloEnPedidoDTO) {
        this.crearArticuloEnCarrito(this.articuloEnPedidoDTO).subscribe({
          next: (res) => {
            // Navega al carrito tras añadir con éxito
            this.router.navigate(['/user/bag']);
          },
          error: (err) => {
            console.error('Error al agregar al carrito:', err);
          }
        });
      }
    } else {
      console.error('No se pudo obtener el usuario autenticado');
      this.router.navigate(['/login']);
    }
  });
}

  crearArticuloEnCarrito(articuloEnPedidoDTO: ArticuloEnPedidoDTO) {
    return this.ordersService.crearArticuloEnCarrito(articuloEnPedidoDTO);
  }

  // Función para aplicar descuento basado en el estado del artículo
  aplicarDescuentoPorEstado(estadosString: string): void {
    const estados = estadosString.split(' - ');
    let descuentoAplicado = 0;
    let estadoEncontrado = '';
    
    // Buscar en todos los estados si contienen alguna palabra clave
    for (const estado of estados) {
      const estadoLowerCase = estado.toLowerCase();
      
      // Buscar cada palabra clave en el estado
      for (const [palabraClave, descuento] of Object.entries(this.estadoDescuentos)) {
        if (estadoLowerCase.includes(palabraClave.toLowerCase())) {
          // Si encontramos una coincidencia, usar el mayor descuento
          if (descuento > descuentoAplicado) {
            descuentoAplicado = descuento;
            estadoEncontrado = palabraClave;
          }
        }
      }
    }
    
    this.precioFinal = this.precioBase * (1 - descuentoAplicado) * this.selectedDays;
    
    console.log(`Estado encontrado: ${estadoEncontrado}, Descuento: ${descuentoAplicado * 100}%, Precio final: ${this.precioFinal}`);
  }

  // Función para actualizar el precio final
  actualizarPrecioFinal(): void {
    if (!this.selectedStateId) {
      // Si no hay estado seleccionado, precio base * días sin descuento
      this.precioFinal = this.precioBase * this.selectedDays;
      return;
    }
    
    // Buscar el estado para recalcular con descuento
    const estado = this.availableStates.find(a => a.idArticulo === this.selectedStateId);
    if (estado) {
      this.aplicarDescuentoPorEstado(estado.estados);
    } else {
      this.precioFinal = this.precioBase * this.selectedDays;
    }
  }

  // Función auxiliar para obtener el descuento aplicado (para mostrar en template)
  getDescuentoAplicado(): number {
    if (!this.selectedStateId) return 0;
    
    const estado = this.availableStates.find(a => a.idArticulo === this.selectedStateId);
    if (estado) {
      const estados = estado.estados.split(' - ');
      let descuentoMaximo = 0;
      
      // Buscar en todos los estados si contienen alguna palabra clave
      for (const estadoTexto of estados) {
        const estadoLowerCase = estadoTexto.toLowerCase();
        
        // Buscar cada palabra clave en el estado
        for (const [palabraClave, descuento] of Object.entries(this.estadoDescuentos)) {
          if (estadoLowerCase.includes(palabraClave.toLowerCase())) {
            if (descuento > descuentoMaximo) {
              descuentoMaximo = descuento;
            }
          }
        }
      }
      
      return descuentoMaximo;
    }
    return 0;
  }

  // Función auxiliar para obtener el ahorro en moneda
  getAhorroEnMoneda(): number {
    const descuento = this.getDescuentoAplicado();
    return (this.precioBase * descuento * this.selectedDays);
  }

  // Función auxiliar para formatear precio
  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR' // Cambia según tu moneda
    });
  }
}