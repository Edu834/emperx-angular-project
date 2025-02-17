
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/service/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  

  // Método para volver atrás
  
  loginObj: any = {
    username: "",
    password: ""
  };



  

  constructor(private authService: AuthService, private router: Router, private location: Location) {}
  goBack(): void {
    this.location.back();
  }
  onLogin() {
    this.authService.login(this.loginObj).subscribe({
      next: data => {
        if (data) {
          // Guardar el token y redirigir al home
          this.authService.saveUser(data);
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: error => {
        alert('Hubo un problema con el inicio de sesión');
      }
    });
  }
}

