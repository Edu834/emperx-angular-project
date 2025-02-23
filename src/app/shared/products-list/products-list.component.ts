import { Component, Input } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { Articulo, Categoria, ProductView } from '../../Interfaces/interfaces-globales';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/service/products/products.service';

@Component({
  selector: 'app-products-list',
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  showChild =  false;
    
  filtros: any = {};

  @Input() filters: any = {};

  listaArticulos: Articulo[] = [];
    categorias: Categoria[]=[];
    products: ProductView[] = [];
    gender: string = ''; 
    mostrarCategoria: boolean = false;
  
    constructor(
      private route: ActivatedRoute, 
      private service: ProductsService,
      private router: Router
    ) {}
    
    idSubcategoria: number = 1;
    sexo: string = "H";
    nombreCategoria: string = '';
    nombreSubcategoria: string = '';
    idCategoria: any = '';

  // Aquí puedes manejar la lógica para mostrar productos según los filtros
  ngOnChanges() {
    console.log('Filtros recibidos:', this.filters);
    console.log(this.filters.brand);
    console.log(this.filters.color);
    console.log(this.filters.price);
    console.log(this.filters.size);
  
    // Aquí puedes actualizar la lista de productos en función de los filtros
    this.aplicarFiltros();
  }
  
  onFiltrosAplicados(filtros: any) {
    this.filtros = filtros;
    this.aplicarFiltros();
  }
  
  aplicarFiltros() {
    console.log('Filtros aplicados:', this.filtros);
    
    // Filtrar la lista de artículos según los filtros aplicados
    this.listaArticulos = this.listaArticulos.filter(articulo => {
      let cumpleFiltros = true;
  
      if (this.filtros.brand) {
        cumpleFiltros = cumpleFiltros && articulo.producto.marca === this.filtros.brand;
      }
      if (this.filtros.color) {
        cumpleFiltros = cumpleFiltros && articulo.color === this.filtros.color;
      }
      if (this.filtros.price) {
        cumpleFiltros = cumpleFiltros && articulo.precio <= this.filtros.price;
      }
      if (this.filtros.size) {
        cumpleFiltros = cumpleFiltros && articulo.talla === this.filtros.size;
      }
  
      // Añadir más condiciones de filtrado según sea necesario
      return cumpleFiltros;
    });
    this.cargarCartasProductos();
  }



  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.actualizarSexoYCategoria(params);
      this.obtenerArticulos();
    });
  }
  actualizarSexoYCategoria(params: any): void {
    this.gender = params.get('gender') || '';
    this.mostrarCategoria = !!params.get('category');
    this.nombreCategoria = params.get('category') || '';
    this.sexo = this.gender === "women" ? "M" : "H";
    this.nombreSubcategoria = params.get('subcategory') || '';
    console.log('Sexo:', this.sexo);
    console.log('Categoria:', this.nombreCategoria);
    console.log('Subcategoria:', this.nombreSubcategoria);
  }
  obtenerArticulos(): void {
    this.service.listArticulos().subscribe({
      next: (data: any) => {
        this.listaArticulos = data;
        this.cargarDatos(); // Filtrar los productos después de obtener los artículos
      },
      error: (error) => {
        console.error('Error al cargar los artículos:', error);
      }
    });
  }
  
  cargarDatos(): void{
    if(this.nombreCategoria === '' && this.nombreSubcategoria === ''){
      this.listaArticulos = this.listaArticulos.filter((articulo) => articulo.producto.sexo == this.sexo);
      console.log('Articulos por sexo:', this.listaArticulos);
      this.cargarCartasProductos();
      console.log('Productos:', this.products);
    }else if(this.nombreCategoria !== '' && this.nombreSubcategoria === ''){
      this.listaArticulos = this.listaArticulos.filter((articulo) => articulo.producto.subcategoria.categoria.nombre.toLocaleLowerCase() == this.nombreCategoria && articulo.producto.sexo == this.sexo);
      console.log('Articulos por categoria:', this.listaArticulos);
      this.cargarCartasProductos();
      console.log('Productos:', this.products);
    }else{
      if(this.nombreSubcategoria === 'view-all'){
        this.listaArticulos = this.listaArticulos.filter((articulo) => articulo.producto.subcategoria.categoria.nombre.toLocaleLowerCase() == this.nombreCategoria && articulo.producto.sexo == this.sexo);
      console.log('Articulos por categoria:', this.listaArticulos);
      this.cargarCartasProductos();
      console.log('Productos:', this.products);
      }else{
        this.listaArticulos = this.listaArticulos.filter((articulo) => articulo.producto.subcategoria.nombre.toLocaleLowerCase() == this.nombreSubcategoria && articulo.producto.sexo == this.sexo);
        console.log('Articulos por subcategoria:', this.listaArticulos);
        this.cargarCartasProductos();
        console.log('Productos:', this.products);
      }
    }
  }

  cargarCartasProductos(): void {
    this.products = [];
    let i = 0;
    this.listaArticulos.forEach(e => {
      let product = this.products.find(product => product.producto.idProducto === e.producto.idProducto);
      if (product === undefined) {
        i++;
        let tallas: string[] = [e.talla];
        let colores: string[] = [e.color];
        let articulos: string[] = [e.idArticulo];
        this.products.push({
          id: i,
          producto: e.producto,
          name: e.producto.nombre,
          price: e.precio,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 1,
          color: colores,
          size: tallas,
          articulos: articulos
        });
      } else {
        product.stock += 1;
        if (!product.color.includes(e.color)) {
          product.color.push(e.color);
        }
        if (!product.size.includes(e.talla)) {
          product.size.push(e.talla);
        }
        product.articulos.push(e.idArticulo);
      }
    });
  }
}
