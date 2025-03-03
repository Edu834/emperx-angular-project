import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-favorites',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  constructor( private location: Location){}
  goBack(): void {
    this.location.back();
  }
}
