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

  // Aquí puedes manejar la lógica para mostrar productos según los filtros
  ngOnChanges() {
    console.log('Filtros recibidos:', this.filters);
    console.log(this.filters.brand);
    console.log(this.filters.color);
    console.log(this.filters.price);

    // Aquí puedes actualizar la lista de productos en función de los filtros
  }

  onFiltrosAplicados(filtros: any) {
    this.filtros = filtros;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    // Aquí implementas la lógica para aplicar los filtros a los productos
    console.log('Filtros aplicados:', this.filtros);
  }

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
        this.listaArticulos = this.listaArticulos.filter((articulo) => articulo.producto.subcategoria.nombre.toLocaleLowerCase() == this.nombreSubcategoria && articulo.producto.sexo == this.sexo);
        console.log('Articulos por subcategoria:', this.listaArticulos);
        this.cargarCartasProductos();
        console.log('Productos:', this.products);
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
  // products: ProductView[] = [
  //   { id: 1, name: 'Producto 1', price: 100, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 2, name: 'Producto 2', price: 200, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 3, name: 'Producto 3', price: 300, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 4, name: 'Producto 4', price: 400, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 5, name: 'Producto 5', price: 500, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 6, name: 'Producto 6', price: 600, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 7, name: 'Producto 7', price: 700, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 8, name: 'Producto 8', price: 800, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 9, name: 'Producto 9', price: 900, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 10, name: 'Producto 10', price: 1000, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 11, name: 'Producto 11', price: 1100, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 12, name: 'Producto 12', price: 1200, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 13, name: 'Producto 13', price: 1300, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 14, name: 'Producto 14', price: 1400, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 15, name: 'Producto 15', price: 1500, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 16, name: 'Producto 16', price: 1600, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 17, name: 'Producto 17', price: 1700, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 18, name: 'Producto 18', price: 1800, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 19, name: 'Producto 19', price: 1900, imageUrl: 'https://via.placeholder.com/150' },
  //   { id: 20, name: 'Producto 20', price: 2000, imageUrl: 'https://via.placeholder.com/150' }
  // ];
}
