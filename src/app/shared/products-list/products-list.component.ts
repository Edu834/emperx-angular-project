import { Component } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-products-list',
  imports: [ProductCardComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
//   showChild =  false;
    
//     listaArticulos: Articulo[] = [];
//     categorias: Categoria[]=[];
//     gender: string = ''; 
//     mostrarCategoria: boolean = false;
  
//     constructor(
//       private route: ActivatedRoute, 
//       private service: ProductsService,
//       private router: Router
//     ) {}
    
//     idSubcategoria: number = 1;
//     sexo: string = "H";
//     nombreCategoria: string = '';
//     idCategoria: any = '';
  
  
//     ngOnInit(): void {
//       this.route.paramMap.subscribe((params) => {
//         this.gender = params.get('gender') || '';
//         this.mostrarCategoria = !!params.get('category');
//         this.nombreCategoria = params.get('category') || '';
//       });
//       if (this.gender === "women") {
//           this.sexo = "M";
//       }else{
//         this.sexo = "H";
//       }
  
//       this.service.listCategorias().subscribe((data: any) => {
//         console.log('Categorias', data);
//         this.categorias = data;
//         console.log('LISTAAA DE CATEGORIAAAAS VARIABLEEE', this.categorias);
//         this.idCategoria = this.categorias.find(categoria => categoria.nombre.toLowerCase().trim() === this.nombreCategoria.toLowerCase().trim())?.idCategoria;
//         console.log('ID CATEGORIAAAA', this.idCategoria);
//         console.log('NOMBRE CATEGORIAAAA', this.nombreCategoria);
//         console.log('Element', this.categorias.find(categoria => categoria.nombre.toLowerCase().trim() === this.nombreCategoria.toLowerCase().trim())?.idCategoria);
//         this.inicio();
//       });
     
//     }
//     inicio(): void{
//       this.service.listArticulosPorSubCategoria(this.idSubcategoria).subscribe((data: any) => {
//         // console.log('Articulos por subcategoria:', data);
//       });
//       this.service.listArticulos().subscribe((data: any) => {
//         // console.log('Todos los articulos:', data);
//       });
//       this.service.listArticulosPorSexo(this.sexo).subscribe((data: any) => {
//         // console.log('Articulos por sexo:', data);
//         this.listaArticulos = data;
//         // console.log('LISTAAA DE ARTICULOSSS VARIABLEEE', this.listaArticulos);
//       });
//       if (this.nombreCategoria !== '') {
//         console.log('Articulos por sexo y categoria:', this.sexo , this.idCategoria);
//         this.service.listArticulosPorSexoAndCategoria(this.sexo, this.idCategoria).subscribe((data: any) => {
//           console.log('Articulos por sexo y categoria:', this.idCategoria);
//           console.log('Articulos por sexo y categoria DDD:', data);
//           if (data && data.length > 0) {
//             this.listaArticulos = data;
//           } else {
//             console.error('No se encontraron artículos para el sexo:', this.sexo , this.idCategoria);
//           }
//         });
//       }
//     }
  products: Product[] = [
    { id: 1, name: 'Producto 1', price: 100, imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Producto 2', price: 200, imageUrl: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Producto 3', price: 300, imageUrl: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Producto 4', price: 400, imageUrl: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Producto 5', price: 500, imageUrl: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Producto 6', price: 600, imageUrl: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Producto 7', price: 700, imageUrl: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Producto 8', price: 800, imageUrl: 'https://via.placeholder.com/150' },
    { id: 9, name: 'Producto 9', price: 900, imageUrl: 'https://via.placeholder.com/150' },
    { id: 10, name: 'Producto 10', price: 1000, imageUrl: 'https://via.placeholder.com/150' },
    { id: 11, name: 'Producto 11', price: 1100, imageUrl: 'https://via.placeholder.com/150' },
    { id: 12, name: 'Producto 12', price: 1200, imageUrl: 'https://via.placeholder.com/150' },
    { id: 13, name: 'Producto 13', price: 1300, imageUrl: 'https://via.placeholder.com/150' },
    { id: 14, name: 'Producto 14', price: 1400, imageUrl: 'https://via.placeholder.com/150' },
    { id: 15, name: 'Producto 15', price: 1500, imageUrl: 'https://via.placeholder.com/150' },
    { id: 16, name: 'Producto 16', price: 1600, imageUrl: 'https://via.placeholder.com/150' },
    { id: 17, name: 'Producto 17', price: 1700, imageUrl: 'https://via.placeholder.com/150' },
    { id: 18, name: 'Producto 18', price: 1800, imageUrl: 'https://via.placeholder.com/150' },
    { id: 19, name: 'Producto 19', price: 1900, imageUrl: 'https://via.placeholder.com/150' },
    { id: 20, name: 'Producto 20', price: 2000, imageUrl: 'https://via.placeholder.com/150' }
  ];
}
export interface Product {
  id: number;             // ID único del producto
  name: string;          // Nombre del producto
  price: number;         // Precio del producto
  imageUrl: string;      // URL de la imagen del producto
  description?: string;  // Descripción del producto (opcional)
}