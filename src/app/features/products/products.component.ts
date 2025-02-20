import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { WomenProductsComponent } from "./women-products/women-products.component";
import { MenProductsComponent } from "./men-products/men-products.component";
import { ProductsService } from '../../core/service/products/products.service';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SearchComponent, FooterComponent, WomenProductsComponent, MenProductsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  showChild =  false;

  
  gender: string = ''; 
  mostrarCategoria: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private service: ProductsService
  ) {}
  
  idSubcategoria: number = 1;
  sexo: string = "H";
  idCategoria: number = 1;


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.mostrarCategoria = !!params.get('category');
      
    });
    this.service.listArticulosPorSubCategoria(this.idSubcategoria).subscribe((data: any) => {
      console.log('Articulos por subcategoria:', data);
    });
    this.service.listArticulos().subscribe((data: any) => {
      console.log('Todos los articulos:', data);
    });
    this.service.listArticulosPorSexo(this.sexo).subscribe((data: any) => {
      console.log('Articulos por sexo:', data);
    });
    this.service.listArticulosPorSexoAndCategoria(this.sexo, this.idCategoria).subscribe((data: any) => {
      console.log('Articulos por sexo y categoria:', data);
    });
    
  }
}
