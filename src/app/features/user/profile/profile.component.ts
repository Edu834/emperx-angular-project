import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { User } from '../../../core/service/auth/user';
import { UserService } from '../../../core/service/user/user.service';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user?:User;

  constructor(private userService:UserService) {
    this.userService.getUsers(1).subscribe({
      next: (data:User) => {
        this.user = data;
        console.log('Usuario:', this.user);
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
   }
}
