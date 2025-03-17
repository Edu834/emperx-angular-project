import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  constructor( private location: Location){}
  goBack(): void {
    this.location.back();
  }
}
