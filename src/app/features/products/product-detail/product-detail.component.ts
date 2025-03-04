import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Articulo, Producto, ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductsService } from '../../../core/service/products/products.service';
import { SearchComponent } from "../../../shared/search/search.component";
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [SearchComponent, HeaderComponent, FooterComponent, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  
 
  
  showChild = false;
  @Input() detallesVisible: boolean | undefined;
  
  selectedColor: string | null = null;
  availableSizes: string[] = [];
  selectedSize: string | null = null;
  listaArticulos: any;
  availableStates: { idArticulo: string; estados: string; deshabilitado: boolean; }[] = [];
  
  resumenProductosConArticulos: ProductView[] = [];
  articulos: Articulo[] = [];
  name: string = '';

  constructor(private route: ActivatedRoute, private service: ProductsService) {}

  ngOnInit(): void {
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


  // Obtener todas las fotos de la galería
  getFotosGaleria(): string[] {
    return [
      this.product?.galeria.fotoFrontal,
      this.product?.galeria.fotoTrasera,
      this.product?.galeria.fotoModeloCerca,
      this.product?.galeria.fotoModeloFrontal,
      this.product?.galeria.fotoModeloTrasera
    ].filter(foto => foto !== undefined) as string[];
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
      this.product = this.resumenProductosConArticulos.find(p => p.idProducto === e.producto.idProducto);
  
      if (!this.product) {
        this.resumenProductosConArticulos.push({
          idProducto: e.producto.idProducto,
          subcategoria: e.producto.subcategoria,
          sexo: e.producto.sexo,
          name: e.producto.nombre,
          price: e.precio,
          imageUrl: e.producto.galeria ? e.producto.galeria[0] : 'https://via.placeholder.com/150',
          description: e.producto.descripcion,
          stock: e.stock,
          estados: e.estados.map((estado: any) => estado.nombre),
          color: [e.color],
          size: [e.talla],
          articulos: [e.idArticulo],
          galeria: e.producto.galeria
        });
      } else {
        this.product.stock += e.stock;
        if (!this.product.color.includes(e.color)) this.product.color.push(e.color);
        if (!this.product.size.includes(e.talla)) this.product.size.push(e.talla);
        if (!this.product.articulos.includes(e.idArticulo)) this.product.articulos.push(e.idArticulo);
        this.product.price = (this.product.price + e.precio) / 2; // Promediar precio
      }
    });
  
    console.log('Producto final consolidado:', this.resumenProductosConArticulos);
  }

  onSelectedColor(color: string): void {
    this.selectedColor = color; // Almacena el color seleccionado
    console.log('Color seleccionado:', this.selectedColor);

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


}
