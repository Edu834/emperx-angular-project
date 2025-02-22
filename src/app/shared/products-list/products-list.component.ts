import { Component } from '@angular/core';

@Component({
  selector: 'app-products-list',
  imports: [],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  showChild =  false;
    
    listaArticulos: Articulo[] = [];
    categorias: Categoria[]=[];
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
    idCategoria: any = '';
  
  
    ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        this.gender = params.get('gender') || '';
        this.mostrarCategoria = !!params.get('category');
        this.nombreCategoria = params.get('category') || '';
      });
      if (this.gender === "women") {
          this.sexo = "M";
      }else{
        this.sexo = "H";
      }
  
      this.service.listCategorias().subscribe((data: any) => {
        console.log('Categorias', data);
        this.categorias = data;
        console.log('LISTAAA DE CATEGORIAAAAS VARIABLEEE', this.categorias);
        this.idCategoria = this.categorias.find(categoria => categoria.nombre.toLowerCase().trim() === this.nombreCategoria.toLowerCase().trim())?.idCategoria;
        console.log('ID CATEGORIAAAA', this.idCategoria);
        console.log('NOMBRE CATEGORIAAAA', this.nombreCategoria);
        console.log('Element', this.categorias.find(categoria => categoria.nombre.toLowerCase().trim() === this.nombreCategoria.toLowerCase().trim())?.idCategoria);
        this.inicio();
      });
     
    }
    inicio(): void{
      this.service.listArticulosPorSubCategoria(this.idSubcategoria).subscribe((data: any) => {
        // console.log('Articulos por subcategoria:', data);
      });
      this.service.listArticulos().subscribe((data: any) => {
        // console.log('Todos los articulos:', data);
      });
      this.service.listArticulosPorSexo(this.sexo).subscribe((data: any) => {
        // console.log('Articulos por sexo:', data);
        this.listaArticulos = data;
        // console.log('LISTAAA DE ARTICULOSSS VARIABLEEE', this.listaArticulos);
      });
      if (this.nombreCategoria !== '') {
        console.log('Articulos por sexo y categoria:', this.sexo , this.idCategoria);
        this.service.listArticulosPorSexoAndCategoria(this.sexo, this.idCategoria).subscribe((data: any) => {
          console.log('Articulos por sexo y categoria:', this.idCategoria);
          console.log('Articulos por sexo y categoria DDD:', data);
          if (data && data.length > 0) {
            this.listaArticulos = data;
          } else {
            console.error('No se encontraron artículos para el sexo:', this.sexo , this.idCategoria);
          }
        });
      }
    }
}
