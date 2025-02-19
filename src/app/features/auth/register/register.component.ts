import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  registerObj: any = {
    // firstname: "",
    // lastname: "",
    username: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  };

  register() {
    console.log(this.registerObj)
    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    
    this.authService.register(this.registerObj).pipe(first()).subscribe(
      response => {
        if (response) {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        }
      },
      error => {
        console.error('Registration error', error);
      }
    );
  }
}
