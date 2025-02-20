import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { FilterPanelComponent } from "../../shared/search/filter-panel/filter-panel.component";
import { ProductsService } from '../../core/service/products/products.service';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SearchComponent, FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  showChild =  false;
  idSubcategoria: number = 1;
  sexo: string = "H";
  idCategoria: number = 1;

  constructor(private service: ProductsService) {}

  ngOnInit(): void {
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
