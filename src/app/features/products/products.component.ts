import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, SearchComponent, FooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent  {
  
}
