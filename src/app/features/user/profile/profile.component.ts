import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { User } from '../../../core/service/user/user';
import { UserService } from '../../../core/service/user/user.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../../../core/service/auth/auth.service';
import { RouterLink } from '@angular/router';
import { FavoritesComponent } from '../../favorites/favorites.component';
import { FavoritesService } from '../../../core/service/favorites/favorites.service';
import { ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductCardComponent } from "../../../shared/product-card/product-card.component";

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, FooterComponent, RouterLink, ProductCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user?:User;
  date?: string;          // Para mostrar la fecha de nacimiento en un formato más amigable
  isLoading: boolean = true;    // Para mostrar un cargando mientras obtenemos los datos
  error: string = '';          // Para mostrar un mensaje de error en caso de que falle la solicitud
  favoritos: any[] = [];

  constructor(private userService: UserService, private favoritosService: FavoritesService) {}

  ngOnInit(): void {
    
    this.userService.getAuthenticatedUser().subscribe({
      next: (data) => {
        if (data) {
          this.user = data;  
          this.date = this.getDate(this.user.fechaAlta);
          console.log(data);
        } else {
          this.error = 'No se pudo obtener la información del usuario.';
        }
        this.isLoading = false;  
      },
      error: (err) => {
        this.error = 'Error al cargar la información del usuario.';
        console.error(err);
        this.isLoading = false;
      }
    });
    this.favoritosService.getFavoritos().subscribe((data: ProductView[]) => {
      this.favoritos = data.slice(-3); // Obtiene los últimos 3 elementos
    });
  }
  getDate(fechaAlta: string | Date): string {
    const date = new Date(fechaAlta);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return `Member since ${date.toLocaleDateString('en-US', options)}`;
  }
  
  
  
}
