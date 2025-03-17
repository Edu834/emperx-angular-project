import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/service/products/products.service';
import { RoutesComponent } from './routes/routes.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { ProductsListComponent } from '../products-list/products-list.component';
import { ProductView } from '../../Interfaces/interfaces-globales';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RoutesComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  query: string = ''; // Valor del input de búsqueda
  productos: any[] = []; // Todos los productos disponibles
  productosFiltrados: any[] = []; // Productos filtrados basados en la búsqueda
  showProductList: boolean = false; // Variable para controlar la visibilidad de la lista de productos

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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener todos los productos desde la API
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data);
        this.productos = data || [];
      },
      error: (err) => {
        console.error('Error obteniendo productos:', err);
      }
    });

    // Manejo de parámetros de ruta
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.category = params.get('category') || '';
      this.name = params.get('name'); // Capturar el ID del producto si existe

      // Mostrar filtros solo si hay 'gender' y 'category', pero NO un 'id'
      this.mostrarFiltros = !!this.gender && !!this.category && !this.name;
      this.mostrarBotonFiltros = this.mostrarFiltros;
    });
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
    this.textHideFilter = this.mostrarFiltros ? "Hide filters" : "Show filters";
    this.toggleFiltrosEvent.emit(this.mostrarFiltros);
  }

  // Método para filtrar productos, categorías y subcategorías
  
  onSearchChange() {
    const queryLower = this.query.toLowerCase().trim();
    if (this.query.trim() === '') {
      this.productosFiltrados = []; // Si no hay texto, vaciar los productos filtrados
      this.showProductList = false; // Ocultar la lista
    } else {
      this.productosFiltrados = this.productos.filter(producto => 
        producto.nombre?.toLowerCase().includes(queryLower) ||
        producto.subcategoria?.nombre?.toLowerCase().includes(queryLower) ||
        producto.subcategoria?.categoria?.nombre?.toLowerCase().includes(queryLower) ||
        producto.marca?.toLowerCase().includes(queryLower)
      );
      
      this.showProductList = this.productosFiltrados.length > 0; // Mostrar la lista si hay resultados
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.searchBox.nativeElement.contains(event.target)) {
      this.showProductList = false; // Ocultar la lista de productos
    }else{
      this.showProductList = true; // Mostrar la lista de productos
    }
  }
  // Redirigir al producto, categoría o subcategoría cuando se presiona Enter
  onEnter(): void {
    if (this.productosFiltrados.length > 0) {
      this.redirigir(this.productosFiltrados[0]);
    }
  }

  // Redirigir a la página de detalle correspondiente
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
    console.log('Ver producto:', product);

    if (!product) {
        console.error('❌ Producto inválido:', product);
        return;
    }

    const sexoTransformado = product.sexo
        ? product.sexo === 'H' ? 'men' : product.sexo === 'M' ? 'women' : product.sexo.toLowerCase()
        : 'unknown';

    const categoriaTransformada = product.subcategoria?.categoria?.nombre?.toLowerCase() || 'unknown';
    const subcategoriaTransformada = product.subcategoria?.nombre?.toLowerCase() || 'unknown';
    const nombreTransformado = product.nombre?.toLowerCase().trim() || 'unknown';

    console.log('🟢 Sexo:', sexoTransformado);
    console.log('🟢 Categoría:', categoriaTransformada);
    console.log('🟢 Subcategoría:', subcategoriaTransformada);
    console.log('🟢 Nombre transformado:', nombreTransformado);

    this.router.navigate(['/product', sexoTransformado, categoriaTransformada, subcategoriaTransformada, nombreTransformado]);
}

}
