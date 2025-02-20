import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { WomenProductsComponent } from "./women-products/women-products.component";
import { MenProductsComponent } from "./men-products/men-products.component";
import { ProductsService } from '../../core/service/products/products.service';

interface Estado{
  idEstado: number;
  nombre: string;
}
interface Galeria{
  
}
interface Categoria{
  idCategoria: number;
  nombre: string;
  descripcion: string;
}
interface SubCategoria{
  idSubcategoria: number;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
}

interface Producto{
  idProducto: string;
  descripcion: string;
  marca: string;
  nombre: string;
  sexo: string;
  galeria: Galeria;
  subcategoria: SubCategoria;
}

interface Articulo{
  idArticulo: string;
  color: string;
  descripcion: string;
  nombre: string;
  precio: number;
  stock: number;
  talla: string;
  estados: Estado[];
  producto: Producto;
}

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SearchComponent, FooterComponent, WomenProductsComponent, MenProductsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  showChild =  false;
  
  listaArticulos: Articulo[] = [];
  categorias: Categoria[]=[];
  gender: string = ''; 
  mostrarCategoria: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private service: ProductsService
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
      this.inicio();
    });
   
  }
  inicio(): void{
    this.service.listArticulosPorSubCategoria(this.idSubcategoria).subscribe((data: any) => {
      console.log('Articulos por subcategoria:', data);
    });
    this.service.listArticulos().subscribe((data: any) => {
      console.log('Todos los articulos:', data);
    });
    this.service.listArticulosPorSexo(this.sexo).subscribe((data: any) => {
      console.log('Articulos por sexo:', data);
      this.listaArticulos = data;
      console.log('LISTAAA DE ARTICULOSSS VARIABLEEE', this.listaArticulos);
    });
    this.service.listArticulosPorSexoAndCategoria(this.sexo, this.idCategoria).subscribe((data: any) => {
      console.log('Articulos por sexo y categoria:', data);
    });
  }
}
