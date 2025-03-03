import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { RegisterRequest } from './RegisterRequest';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerError: string = '';
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private location: Location) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue] 

    }, { validators: this.passwordsMatch });
  }

  // Validación para las contraseñas coincidentes
  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsDoNotMatch: true }; // Error si no coinciden
    }
    return null;
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  // Método para registrar el usuario
  register() {
    if (this.registerForm.valid) {
      this.registerError = '';
      const registerRequest: RegisterRequest = {
        username: this.registerForm.get('username')?.value,
        firstname: this.registerForm.get('firstname')?.value,
        lastname: this.registerForm.get('lastname')?.value,
        email: this.registerForm.get('email')?.value,
        telefono: this.registerForm.get('telefono')?.value,
        direccion: this.registerForm.get('direccion')?.value,
        password: this.registerForm.get('password')?.value,
        sexo: 'Undefined',
      };
  
      this.authService.register(registerRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
          this.registerError = "Error al registrar: " + (errorData.error || "Intente nuevamente.");
        },
        complete: () => {
          console.info("Registro completo");
          this.router.navigateByUrl('/login');
          this.registerForm.reset();
        }
      });
    }else{
      this.registerForm.markAllAsTouched();
      
    }
}
}