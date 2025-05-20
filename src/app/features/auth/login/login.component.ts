import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/service/auth/auth.service';
import { LoginRequest } from './loginRequest';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // corregido de styleUrl a styleUrls
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError = "Por favor completa todos los campos.";
      return;
    }

    const loginData: LoginRequest = this.loginForm.value;

    this.loginService.login(loginData, loginData.rememberMe).subscribe({
      next: (token) => {
        // token ya es un string (por el map en el service)
        if (loginData.rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        this.router.navigateByUrl('/inicio');
        this.loginForm.reset();
        this.loginError = "";
      },
      error: (err) => {
        console.error("Login fallido", err);
        this.loginError = err.message || "Usuario o contraseña incorrectos.";
      },
    });
  }

  goHome(): void {
    this.router.navigateByUrl('/inicio');
  }
}
