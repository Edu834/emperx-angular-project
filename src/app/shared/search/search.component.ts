import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/service/products/products.service';
import { RoutesComponent } from './routes/routes.component';
import { FilterService } from '../../core/service/filter/filter.service';
import { FilterSummaryComponent } from "./filter-summary/filter-summary.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RoutesComponent, FilterSummaryComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query: string = '';
  productos: any[] = [];
  productosFiltrados: any[] = [];
  showProductList: boolean = false;
  filtrosSeleccionados: any = {};

  @ViewChild('searchBox') searchBox!: ElementRef;

  gender: string = '';
  category: string | undefined;
  name: string | null | undefined;

  mostrarFiltros: boolean = true;
  mostrarBotonFiltros: boolean = true;
  textHideFilter: string = "Hide filters";

  @Output() toggleFiltrosEvent = new EventEmitter<boolean>();
  @Input() newArrivalsHeader: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductsService,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data || [];
        this.applyFilters(); // aplicar filtros si ya hay
      },
      error: (err) => {
        console.error('Error obteniendo productos:', err);
      }
    });

    this.filterService.filters$.subscribe(filters => {
      this.filtrosSeleccionados = filters;
      this.applyFilters();
    });

    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.category = params.get('category') || '';
      this.name = params.get('name');

      this.mostrarFiltros = !!this.gender && !!this.category && !this.name;
      this.mostrarBotonFiltros = this.mostrarFiltros;
    });
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
    this.textHideFilter = this.mostrarFiltros ? "Hide filters" : "Show filters";
    this.toggleFiltrosEvent.emit(this.mostrarFiltros);
  }

  // 👇 Eliminar individualmente un filtro desde FilterSummary
onEliminarFiltro(filtro: { nombre: string, valor: string }) {
  const { nombre, valor } = filtro;

  if (!this.filtrosSeleccionados[nombre]) return;

  // Si es un array (como talla o color múltiple)
  if (Array.isArray(this.filtrosSeleccionados[nombre])) {
    this.filtrosSeleccionados[nombre] = this.filtrosSeleccionados[nombre].filter((v: string) => v !== valor);

    // Si el array queda vacío, eliminamos la propiedad
    if (this.filtrosSeleccionados[nombre].length === 0) {
      delete this.filtrosSeleccionados[nombre];
    }
  } 
  // Si es un valor único (como brand o priceRange)
  else if (this.filtrosSeleccionados[nombre] === valor) {
    delete this.filtrosSeleccionados[nombre];
  }

  // ✅ Aplicar los filtros actualizados globalmente
  this.filterService.applyFilters({ ...this.filtrosSeleccionados });
}


  applyFilters(): void {
    const filters = this.filtrosSeleccionados;

    if (Object.keys(filters).length > 0) {
      this.productosFiltrados = this.productos.filter(producto =>
        Object.keys(filters).every(key => {
          const value = filters[key];

          if (key === 'gender' && producto.sexo) {
            return producto.sexo === value;
          }

          if (key === 'category' && producto.subcategoria) {
            return producto.subcategoria.categoria.nombre === value;
          }

          if (Array.isArray(value)) {
            return value.includes(producto[key]);
          }

          return producto[key] === value;
        })
      );
    } else {
      this.productosFiltrados = this.productos;
    }
  }

  onSearchChange(): void {
    const queryLower = this.query.toLowerCase().trim();
    if (queryLower === '') {
      this.productosFiltrados = [];
      this.showProductList = false;
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre?.toLowerCase().includes(queryLower) ||
        producto.subcategoria?.nombre?.toLowerCase().includes(queryLower) ||
        producto.subcategoria?.categoria?.nombre?.toLowerCase().includes(queryLower) ||
        producto.marca?.toLowerCase().includes(queryLower)
      );

      this.showProductList = this.productosFiltrados.length > 0;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.searchBox.nativeElement.contains(event.target)) {
      this.showProductList = false;
    } else {
      this.showProductList = true;
    }
  }

  onEnter(): void {
    if (this.productosFiltrados.length > 0) {
      this.redirigir(this.productosFiltrados[0]);
    }
  }

  redirigir(item: any): void {
    if (item.idProducto) {
      this.router.navigate(['/producto', item.idProducto]);
    } else if (item.subcategoria?.categoria?.idCategoria) {
      this.router.navigate(['/categoria', item.subcategoria.categoria.idCategoria]);
    } else if (item.subcategoria?.idSubcategoria) {
      this.router.navigate(['/subcategoria', item.subcategoria.idSubcategoria]);
    } else {
      console.warn('No se encontró una redirección válida para:', item);
    }
  }

  verProducto(product: any): void {
    if (!product) return;

    const sexo = product.sexo === 'H' ? 'men' : product.sexo === 'M' ? 'women' : product.sexo.toLowerCase();
    const categoria = product.subcategoria?.categoria?.nombre?.toLowerCase() || 'unknown';
    const subcategoria = product.subcategoria?.nombre?.toLowerCase() || 'unknown';
    const nombre = product.nombre?.toLowerCase().trim() || 'unknown';

    this.router.navigate(['/product', sexo, categoria, subcategoria, nombre]);
  }
}
