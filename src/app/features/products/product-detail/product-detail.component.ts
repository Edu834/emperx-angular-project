import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Articulo, ArticuloEnPedidoDTO, Producto, ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductsService } from '../../../core/service/products/products.service';
import { SearchComponent } from "../../../shared/search/search.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../../core/service/favorites/favorites.service';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from "./product-information/product-information.component";
import { RandomProductsComponent } from "../../../shared/random-product/random-product.component";
import { User } from '../../../core/service/user/user'; // Import the User class
import { UserService } from '../../../core/service/user/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, of } from 'rxjs';
import { OrdersService } from '../../../core/service/orders/orders.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [SearchComponent, HeaderComponent, FooterComponent, FormsModule, CommonModule, AccordionComponent, RandomProductsComponent]
})
export class ProductDetailComponent implements OnInit {
  
 
  mostrarBotonFiltros: boolean = false;
  mostrarFiltros: boolean = false;
  showChild = false;
  @Input() detallesVisible: boolean | undefined;
  
  selectedColor: string | null = null;
  availableSizes: string[] = [];
  selectedSize: string | null = null;
  selectedDays: number = 0;
  listaArticulos: any;
  availableStates: { idArticulo: string; estados: string; deshabilitado: boolean; }[] = [];
  
  resumenProductosConArticulos: ProductView[] = [];
  articulos: Articulo[] = [];
  articuloEnPedidoDTO: ArticuloEnPedidoDTO | undefined;
  name: string = '';
  idUsuario: number = 0;

  constructor(private route: ActivatedRoute, private service: ProductsService, private userService: UserService, private ordersService: OrdersService, private favoritesService : FavoritesService) {}

  ngOnInit(): void {
    // this.cargarFavoritos();
    this.route.paramMap.subscribe((params) => {
      this.name = params.get('name') || '';
      this.obtenerArticulosDelProducto(this.name);
    });
    console.log(this.product?.galeria.fotoFrontal)
    if (this.product && this.product.galeria) {
      this.fotoSeleccionada = this.product.galeria.fotoFrontal
    }
  }

  fotoSeleccionada: string = '';


  getFotosGaleria(): string[] {
    if (!this.product || !this.product.galeria) {
      return [];
    }
  
    // Recolectar dinámicamente todas las propiedades del objeto galería que sean URLs válidas
    const fotos = Object.values(this.product.galeria)
      .filter((foto: any) => typeof foto === 'string' && foto.trim() !== '');
  
    // Si no hay ninguna imagen válida, retornar imagen por defecto
    return fotos.length > 0 ? fotos : ['https://assets-global.website-files.com/6256995755a7ea0a3d8fbd11/645924d369c84c1e3dbda2ad_Frame%201.jpg'];
  }
  
  

  // Cambiar la imagen seleccionada cuando se hace clic en una miniatura
  cambiarImagen(foto: string): void {
    this.fotoSeleccionada = foto;
  }

  obtenerArticulosDelProducto(name: string): void {
    this.service.getArticulosByNameProduct(name).subscribe({
      next: (data: any) => {
        this.articulos = data;
        console.log('Artículos del producto:', this.articulos);
        this.cargarDatos(data); 
      },
      error: (error) => {
        console.error('Error al cargar los artículos:', error);
      }
    });
  }

  product: ProductView | undefined;

  cargarDatos(data: any[]): void {
    this.resumenProductosConArticulos = []; // Limpiar productos previos
  
    data.forEach(e => {
      let productoExistente = this.resumenProductosConArticulos.find(p => p.idProducto === e.producto.idProducto);
  
      if (!productoExistente) {
        productoExistente = {
          idProducto: e.producto.idProducto,
          subcategoria: e.producto.subcategoria,
          sexo: e.producto.sexo,
          name: e.producto.nombre,
          price: e.producto.precio,
          imageUrl: e.producto.galeria ? e.producto.galeria[0] : 'https://assets-global.website-files.com/6256995755a7ea0a3d8fbd11/645924d369c84c1e3dbda2ad_Frame%201.jpg',
          description: e.producto.descripcion,
          stock: e.stock,
          estados: e.estados.map((estado: any) => estado.nombre),
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
  
    // Asignar el producto principal al primero de la lista consolidada
    if (this.resumenProductosConArticulos.length > 0) {
      this.product = this.resumenProductosConArticulos[0];
  
      // Asegurar foto seleccionada
      if (this.product.galeria && this.product.galeria.fotoFrontal) {
        this.fotoSeleccionada = this.product.galeria.fotoFrontal;
      }
    }
  
    console.log('Producto final consolidado:', this.resumenProductosConArticulos);
  }
  

  onSelectedColor(color: string): void {
    this.selectedColor = color; // Almacena el color seleccionado
    console.log('Color seleccionado:', this.selectedColor);
    this.selectedColor = color;
    // Reinicia la talla seleccionada y las tallas disponibles
    this.selectedSize = null; // Reinicia la talla seleccionada a null
    this.availableSizes = []; // Limpia las tallas disponibles
    this.availableStates = []; // Limpia los estados disponibles

    this.updateAvailableSizes(); // Actualiza las tallas disponibles al seleccionar un color
}

updateAvailableSizes(): void {
    if (this.selectedColor) {
        // Filtra las tallas según el color seleccionado
        const sizes = this.articulos
            .filter(articulo => articulo.color === this.selectedColor) // Filtra por color
            .map(articulo => articulo.talla); // Mapea solo las tallas
        
        this.availableSizes = Array.from(new Set(sizes)); // Elimina duplicados
        console.log('Tallas disponibles para el color seleccionado:', this.availableSizes);
    } else {
        this.availableSizes = []; // Limpia las tallas si no hay color seleccionado
    }
}


onSelectSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Hacemos un casting a HTMLSelectElement
    this.selectedSize = selectElement.value; // Ahora podemos acceder a 'value' sin errores
    console.log('Talla seleccionada:', this.selectedSize);
    this.updateAvailableStates(); // Actualiza los estados disponibles al seleccionar una talla
}

updateAvailableStates(): void {
  if (this.selectedColor && this.selectedSize) {
      const filteredArticulos = this.articulos.filter(
          articulo => articulo.color === this.selectedColor && articulo.talla === this.selectedSize
      );

      // Agrupar estados por artículo y verificar si tiene "Alquilado" o "Retirado"
      this.availableStates = filteredArticulos.map(articulo => {
          const estadoNombres = articulo.estados.map(estado => estado.nombre);
          const tieneEstadoRestringido = estadoNombres.some(estado => estado.includes("Alquilado") || estado.includes("Retirado"));

          return {
              idArticulo: articulo.idArticulo,
              estados: estadoNombres.join(' - '), // Unir estados con separador
              deshabilitado: tieneEstadoRestringido // Marcar si el artículo debe deshabilitarse
          };
      });

      console.log('Estados agrupados con restricción:', this.availableStates);
  } else {
      this.availableStates = []; // Vaciar si no hay selección válida
  }
}

selectedStateId: string | null = null; // Variable para almacenar el estado seleccionado

onSelectedState(idArticulo: string): void {
  this.selectedStateId = idArticulo; // Almacena el idArticulo seleccionado
  const selectedState = this.availableStates.find(articulo => articulo.idArticulo === idArticulo);
  console.log('Estado seleccionado:', selectedState);
}

favoritos: number[] = [];
  cargarFavoritos() {
    this.favoritesService.getFavoritos().subscribe(favoritos => {
      this.favoritos = favoritos.map(p => p.idProducto);
    });
  }
   // Método para añadir o quitar de favoritos
toggleFavorito(producto: ProductView) {
  console.log('Producto:', producto);
  if (this.favoritesService.esFavorito(producto.idProducto)) {
    this.favoritesService.eliminarFavorito(producto.idProducto);
  } else {
    this.favoritesService.agregarFavorito(producto);
  }
  this.cargarFavoritos();
}

// Verificar si un producto está en favoritos
esFavorito(productoId: string): boolean {
  return this.favoritesService.esFavorito(productoId);
}
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
  // Agrega los que necesites
};

getCssColor(colorName: string): string {
  return this.colorMap[colorName] || 'transparent'; // fallback por si no existe
}
onSelectedDays(event: Event): void {
  const inputElement = event.target as HTMLInputElement; // Hacemos un casting a HTMLInputElement
  this.selectedDays = parseInt(inputElement.value, 10); // Convertir a número entero
  console.log('Días seleccionados:', this.selectedDays);
}

addToBag(): void {
  if (!this.selectedColor || !this.selectedSize || !this.selectedStateId) {
      alert('Seleccione un color, talla y estado para agregar al carrito');
      return;
  }

  // Obtener el artículo seleccionado
  const selectedArticulo = this.articulos.find(articulo => articulo.idArticulo === this.selectedStateId);
  if (!selectedArticulo) {
      alert('No se encontró el artículo seleccionado');
      return;
  }

  console.log('Artículo seleccionado para agregar al carrito:', selectedArticulo);
  this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
    if (userData) {
      this.idUsuario = userData.id_usuario;
      console.log('ID de usuario autenticado:', this.idUsuario);
      this.articuloEnPedidoDTO = {  
        idArticulo: selectedArticulo.idArticulo,
        idUsuario: this.idUsuario.toString(),
        cantidad: 1,
        diasAlquiler: this.selectedDays
      };
      this.crearArticuloEnCarrito(this.articuloEnPedidoDTO);
    }else{
      console.error('No se pudo obtener el usuario autenticado');
    }
  });
}

crearArticuloEnCarrito(articuloEnPedidoDTO: ArticuloEnPedidoDTO): void {
  this.ordersService.crearArticuloEnCarrito(articuloEnPedidoDTO).subscribe({
      next: (data: any) => {
          console.log('Artículo agregado al carrito:', data);
      },
      error: (error: any) => {
          console.error('Error al agregar el artículo al carrito:', error);
      }
  });
}

}
