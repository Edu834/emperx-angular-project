
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/service/auth/auth.service';
import { Location } from '@angular/common';
import { LoginRequest } from './loginRequest';


@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  
  loginError:string="";
  loginForm:any;

  constructor(private formBuilder:FormBuilder, private router:Router, private loginService: AuthService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  get email(){
    return this.loginForm.controls.username;
  }

  get password()
  {
    return this.loginForm.controls.password;
  }

  login(){
    
    if(this.loginForm.valid){
      this.loginError="";
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError = "Error al iniciar sesión: " + (errorData.error|| "Intente nuevamente.");
        },
        complete: () => {
          console.info("Login completo");
          this.router.navigateByUrl('/inicio');
          this.loginForm.reset();
          
        }
      })

    }
    else{
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }
  
  goHome(){
    this.router.navigateByUrl('/inicio');
  }
}

