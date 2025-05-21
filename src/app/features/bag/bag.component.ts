import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RandomProductsComponent } from "../../shared/random-product/random-product.component";

@Component({
  selector: 'app-bag',
  imports: [HeaderComponent, FooterComponent, CommonModule, RandomProductsComponent],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.css'
})
export class BagComponent {
    constructor( private location: Location){}
    
    goBack(): void {
    this.location.back();
  }
}
