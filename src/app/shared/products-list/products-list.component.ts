import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Articulo, ProductView } from '../../Interfaces/interfaces-globales';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/service/products/products.service';
import { FilterService } from '../../core/service/filter/filter.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductCardComponent, InfiniteScrollDirective, CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  showChild = false;
  listaArticulos: Articulo[] = [];
  listaArticulosOriginal: Articulo[] = [];
  products: ProductView[] = [];
  productosPaginados: ProductView[] = [];
  filtros: any = {};
  filtrosSubscription!: Subscription;
  gender: string = ''; 
  mostrarCategoria: boolean = false;
  nombreCategoria: string = '';
  nombreSubcategoria: string = '';
  sexo: string = "H";
  idCategoria: any = '';
  @Output() articulosCargados = new EventEmitter<Articulo[]>();

  // Paginación
  pageSize: number = 6;
  currentPage: number = 1;
  loading: boolean = false;
  availableSizes: string[] = [];
  


  constructor(
    private route: ActivatedRoute,
    private service: ProductsService,
    private filterService: FilterService
  ) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.actualizarSexoYCategoria(params);
      this.obtenerArticulos();
    });

    this.filtrosSubscription = this.filterService.filters$.subscribe(filters => {
      this.filtros = filters;
      this.aplicarFiltros(); // Aplicamos los filtros cada vez que cambian
    });
  }

  ngOnDestroy(): void {
    this.filtrosSubscription?.unsubscribe();
  }

  actualizarSexoYCategoria(params: any): void {
    this.gender = params.get('gender') || '';
    this.mostrarCategoria = !!params.get('category');
    this.nombreCategoria = params.get('category') || '';
    this.sexo = this.gender === "women" ? "M" : "H";
    this.nombreSubcategoria = params.get('subcategory') || '';
  }

  obtenerArticulos(): void {
    this.service.listArticulos().subscribe({
      next: (data: any) => {
        this.listaArticulosOriginal = data;
        this.listaArticulos = [...data];
        this.articulosCargados.emit(this.listaArticulosOriginal); // 👈 aquí

        this.aplicarFiltros(); // Aplicamos los filtros cuando obtenemos los artículos
        this.filterService.setAvailableSizesFromCategory(this.listaArticulos, this.nombreCategoria, this.nombreSubcategoria);

      },
      error: (error) => {
        console.error('Error al cargar los artículos:', error);
      }
    });
  }
  obtenerTallasDisponibles(articulos: Articulo[]): string[] {
    const tallas = articulos.map(a => a.talla).filter((value, index, self) => self.indexOf(value) === index);
    return tallas;
  }
  // Método para aplicar filtros a los artículos
  aplicarFiltros(): void {
    console.log('Aplicando filtros:', this.filtros);
    let articulosFiltrados = [...this.listaArticulosOriginal];  // Copia de la lista original de artículos

    // Filtramos los productos de acuerdo a los filtros aplicados
    if (this.filtros) {
      articulosFiltrados = articulosFiltrados.filter(articulo => {
        let cumpleFiltros = true;

        // Filtrar por marcas (múltiples marcas permitidas)
        if (this.filtros.brand && this.filtros.brand.length > 0) {
          cumpleFiltros = cumpleFiltros && this.filtros.brand.includes(articulo.producto.marca);
        }

        // Filtrar por color
        if (this.filtros.color) {
          cumpleFiltros = cumpleFiltros && articulo.color === this.filtros.color;
        }

        // Filtrar por rango de precio
        if (this.filtros.priceRange) {
          const [minPrice, maxPrice] = (this.filtros.priceRange || '0-999999').split('-').map(Number);
          cumpleFiltros = cumpleFiltros && articulo.producto.precio >= minPrice && articulo.producto.precio <= maxPrice;
        }

        // Filtrar por talla (si existen tallas seleccionadas)
        if (this.filtros.size && this.filtros.size.length > 0) {
          cumpleFiltros = cumpleFiltros && this.filtros.size.includes(articulo.talla);
        }

        return cumpleFiltros;
      });
    }

    // Filtros por categoría y subcategoría
    if (this.nombreSubcategoria && this.nombreSubcategoria !== 'view-all') {
      articulosFiltrados = articulosFiltrados.filter(a => 
        a.producto.subcategoria.nombre.toLowerCase().trim() === this.nombreSubcategoria &&
        a.producto.sexo === this.sexo
      );
    } else if (this.nombreCategoria && this.nombreCategoria !== 'view-all') {
      articulosFiltrados = articulosFiltrados.filter(a => 
        a.producto.subcategoria.categoria.nombre.toLowerCase().trim() === this.nombreCategoria &&
        a.producto.sexo === this.sexo
      );
    } else {
      articulosFiltrados = articulosFiltrados.filter(a => a.producto.sexo === this.sexo);
    }

    // Actualizamos la lista de productos filtrados
    this.listaArticulos = articulosFiltrados;
    this.cargarCartasProductos();  // Método para recargar las cartas de productos
}


  cargarCartasProductos(): void {
    this.products = [];

    this.listaArticulos.forEach(e => {
      let product = this.products.find(p => p.idProducto === e.producto.idProducto);
      if (!product) {
        this.products.push({
          idProducto: e.producto.idProducto,
          subcategoria: e.producto.subcategoria,
          sexo: e.producto.sexo,
          name: e.producto.nombre,
          price: e.producto.precio,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 1,
          estados: e.estados.map((estado: any) => estado.nombre),
          color: [e.color],
          size: [e.talla],
          articulos: [e.idArticulo],
          galeria: e.producto.galeria,
          marca: e.producto.marca
        });
      } else {
        product.stock += 1;
        if (!product.color.includes(e.color)) product.color.push(e.color);
        if (!product.size.includes(e.talla)) product.size.push(e.talla);
        product.articulos.push(e.idArticulo);
      }
    });

    this.currentPage = 1;
    this.productosPaginados = this.products.slice(0, this.pageSize);
  }

  onScroll(): void {
    if (this.loading) return;
  
    this.loading = true;
  
    setTimeout(() => {
      const nextPage = this.currentPage + 1;
      const start = (nextPage - 1) * this.pageSize;
      const end = start + this.pageSize;
  
      const siguientes = this.products.slice(start, end);
      if (siguientes.length > 0) {
        this.productosPaginados = [...this.productosPaginados, ...siguientes];
        this.currentPage = nextPage;
      }
  
      this.loading = false;
    }, 500);
  }
  
}
