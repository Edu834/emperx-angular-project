import { Component, OnInit } from '@angular/core';

import { CommonModule, Location } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProductView } from '../../Interfaces/interfaces-globales';
import { FavoritesService } from '../../core/service/favorites/favorites.service';
import { ProductCardComponent } from "../../shared/product-card/product-card.component";

@Component({
  selector: 'app-favorites',
  imports: [HeaderComponent, FooterComponent, ProductCardComponent, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  constructor( private location: Location, private favoritosService: FavoritesService){}
  goBack(): void {
    this.location.back();
  }
  favoritos: ProductView[] = [];

  ngOnInit() {
    this.favoritos = this.favoritosService.getFavoritos();
  }

  eliminarFavorito(productId: string) {
    console.log('Eliminar favorito', productId);
    this.favoritosService.eliminarFavorito(productId);
    this.favoritos = this.favoritosService.getFavoritos(); // Actualizar la lista
  }
}
