import { Component, Input, OnInit } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Articulo, Categoria, ProductView } from '../../Interfaces/interfaces-globales';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/service/products/products.service';
import { FavoritesService } from '../../core/service/favorites/favorites.service';
import { FilterService } from '../../core/service/filter/filter.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  showChild = false;
  listaArticulos: Articulo[] = [];
  products: ProductView[] = [];
  gender: string = ''; 
  mostrarCategoria: boolean = false;
  filtros: any = {};
  
  idSubcategoria: number = 1;
  sexo: string = "H";
  nombreCategoria: string = '';
  nombreSubcategoria: string = '';
  idCategoria: any = '';

  constructor(
    private route: ActivatedRoute, 
    private service: ProductsService,
    private filterService: FilterService  // Inyectamos el servicio de filtros
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en la URL para actualizar género y categoría
    this.route.paramMap.subscribe((params) => {
      this.actualizarSexoYCategoria(params);
      this.obtenerArticulos();
    });

    // Escuchar cambios en los filtros del `FilterService`
    this.filterService.filters$.subscribe(filters => {
      this.filtros = filters;
      this.aplicarFiltros();
    });
  }

  actualizarSexoYCategoria(params: any): void {
    this.gender = params.get('gender') || '';
    this.mostrarCategoria = !!params.get('category');
    this.nombreCategoria = params.get('category') || '';
    this.sexo = this.gender === "women" ? "M" : "H";
    this.nombreSubcategoria = params.get('subcategory') || '';
  }

  obtenerArticulos(): void {
    // Obtener todos los artículos de la API
    this.service.listArticulos().subscribe({
      next: (data: any) => {
        this.listaArticulos = data;
        this.aplicarFiltros(); // Filtrar los productos después de obtener los artículos
      },
      error: (error) => {
        console.error('Error al cargar los artículos:', error);
      }
    });
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros:', this.filtros);

    // Filtrar `listaArticulos` según los filtros aplicados
    let articulosFiltrados = this.listaArticulos.filter(articulo => {
      let cumpleFiltros = true;

      if (this.filtros.brand) {
          cumpleFiltros = cumpleFiltros && articulo.producto.marca === this.filtros.brand;
      }
      if (this.filtros.color) {
          cumpleFiltros = cumpleFiltros && articulo.color === this.filtros.color;
      }
      if (this.filtros.priceRange) {
          const [minPrice, maxPrice] = this.filtros.priceRange.split('-').map(Number);
          cumpleFiltros = cumpleFiltros && articulo.producto.precio >= minPrice && articulo.producto.precio <= maxPrice;
      }
      if (this.filtros.size) {
          cumpleFiltros = cumpleFiltros && articulo.talla === this.filtros.size;
      }

      return cumpleFiltros;
  });



    // Aplicar filtros de género y categoría
    if (this.nombreCategoria === '' && this.nombreSubcategoria === '') {
      articulosFiltrados = articulosFiltrados.filter(a => a.producto.sexo === this.sexo);
    } else if (this.nombreCategoria !== '' && this.nombreSubcategoria === '') {
      articulosFiltrados = articulosFiltrados.filter(a => 
        a.producto.subcategoria.categoria.nombre.toLowerCase().trim() === this.nombreCategoria && 
        a.producto.sexo === this.sexo
      );
    } else if (this.nombreSubcategoria !== '' && this.nombreSubcategoria !== 'view-all') {
      articulosFiltrados = articulosFiltrados.filter(a => 
        a.producto.subcategoria.nombre.toLowerCase().trim() === this.nombreSubcategoria &&
        a.producto.sexo === this.sexo
      );
    }

    this.listaArticulos = articulosFiltrados;
    this.cargarCartasProductos();
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
          price: e.precio,
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
  }
}
