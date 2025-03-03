import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { User } from '../../../core/service/auth/user';
import { UserService } from '../../../core/service/user/user.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user?:User;
   
  isLoading: boolean = true;    // Para mostrar un cargando mientras obtenemos los datos
  error: string = '';          // Para mostrar un mensaje de error en caso de que falle la solicitud

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    
    this.userService.getAuthenticatedUser().subscribe({
      next: (data) => {
        if (data) {
          this.user = data;  
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
  }
  
}
