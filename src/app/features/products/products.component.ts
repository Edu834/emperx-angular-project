import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { WomenProductsComponent } from "./women-products/women-products.component";
import { MenProductsComponent } from "./men-products/men-products.component";
import { ProductsListComponent } from "../../shared/products-list/products-list.component";
import { FilterPanelComponent } from "../../shared/search/filter-panel/filter-panel.component";
import { ProductDetailComponent } from "./product-detail/product-detail.component";

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SearchComponent, FooterComponent, WomenProductsComponent, MenProductsComponent, ProductsListComponent, FilterPanelComponent, ProductDetailComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent  {

  mostrarFiltros: boolean = true; // Estado compartido para filtros
  detallesVisible: boolean = false;
  // Método que recibe el cambio de SearchComponent
  onToggleFiltros(value: boolean) {
    this.mostrarFiltros = value;
  }

  showChild =  false;

  
  gender: string = ''; 
  mostrarCategoria: boolean = false;


  constructor(
    private route: ActivatedRoute, 
    
  ) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.mostrarCategoria = !!params.get('category');
      
    });
  }
  
}
