import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/service/products/products.service';
import { RoutesComponent } from './routes/routes.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { ProductsListComponent } from '../products-list/products-list.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RoutesComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  query: string = '';
  productos: any[] = [];
  productosFiltrados: any[] = [];

  gender: string = ''; 
  category: string | undefined;
  id: string | null | undefined;

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
    this.productoService.obtenerProductos().subscribe((data) => {
      console.log(data);
      this.productos = data;
      // this.productosFiltrados = [...this.productos]; // Mantener una copia limpia
     
    });

    // Manejo de parámetros de ruta
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.category = params.get('category') || '';
      this.id = params.get('id'); // Capturar el ID del producto si existe

      // Mostrar filtros solo si hay 'gender' y 'category', pero NO un 'id'
      this.mostrarFiltros = !!this.gender && !!this.category && !this.id;
      this.mostrarBotonFiltros = this.mostrarFiltros;
    });
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
    this.textHideFilter = this.mostrarFiltros ? "Hide filters" : "Show filters";
    this.toggleFiltrosEvent.emit(this.mostrarFiltros);
  }

  // Método para filtrar productos, categorías y subcategorías
  onSearchChange(): void {
    const queryLower = this.query.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(queryLower) ||
      producto.subcategoria.nombre.toLowerCase().includes(queryLower) ||
      producto.subcategoria.categoria.nombre.toLowerCase().includes(queryLower)
    );
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
    }
  }
}
