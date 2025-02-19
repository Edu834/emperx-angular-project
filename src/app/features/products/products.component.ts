import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { WomenProductsComponent } from "./women-products/women-products.component";
import { MenProductsComponent } from "./men-products/men-products.component";

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SearchComponent, FooterComponent, WomenProductsComponent, MenProductsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent  {
  showChild =  false;

  
  gender: string = ''; 
  

  constructor(
    private route: ActivatedRoute, 
    
  ) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
       
      
    });
  }
  
}
