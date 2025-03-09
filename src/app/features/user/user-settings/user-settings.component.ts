import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../core/service/user/user';
import { AuthService } from '../../../core/service/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/service/user/user.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {
  editError: string = '';
  editForm: FormGroup;
  currentUserData: User | null = null;
  date: string | undefined;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private location: Location, private userService: UserService) {
    this.editForm = this.formBuilder.group({
      idUsuario: ['', Validators.required],
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: [''],
      country: [''],
      province: [''],
      city: [''],
      zipCode: [''],

    });
  }

  ngOnInit(): void {
    // Cargar los datos actuales del usuario
    this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      
      if (userData) {
        this.currentUserData = userData;
        this.editForm.controls['idUsuario'].setValue(userData.id_usuario);
        this.editForm.controls['username'].setValue(userData.username);
        this.editForm.controls['firstname'].setValue(userData.firstname);
        this.editForm.controls['lastname'].setValue(userData.lastname);
        this.editForm.controls['email'].setValue(userData.email);
        this.editForm.controls['telefono'].setValue(userData.telefono);
        this.editForm.controls['direccion'].setValue(userData.direccion);
        this.editForm.controls['sexo'].setValue(userData.sexo);
        this.editForm.controls['country'].setValue(userData.country);
        this.editForm.controls['province'].setValue(userData.province);
        this.editForm.controls['city'].setValue(userData.city);
        this.editForm.controls['zipCode'].setValue(userData.zipCode);
        this.editForm.controls['password'].setValue(userData.password);
        this.editForm.controls['fechaNacimiento'].setValue(userData.fechaNacimiento);
        console.log(userData.id_usuario);
        console.log(this.currentUserData);
        this.date = this.getDate(this.currentUserData.fechaAlta);
      }
    });
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }
  getDate(fechaAlta: string | Date): string {
    const date = new Date(fechaAlta);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return `Member since ${date.toLocaleDateString('en-US', options)}`;
  }
  onSubmit(): void {
    if (this.editForm.valid) {
      const userData: User = this.editForm.value;
  
      this.userService.updateUser(userData).subscribe({
        next: (response: any) => {
          if (response && response.token) {
            console.log(response.token)
            sessionStorage.setItem('token', response.token);
  
            // ✅ Si tienes un AuthService, actualiza el token allí también
            this.authService.setToken(response.token);
  
            console.log("Usuario actualizado correctamente");
            this.router.navigate(['/user/profile']); // Redirigir al perfil
          }
        },
        error: (error) => {
          console.error("Error al actualizar usuario", error);
          this.editError = "Error al actualizar usuario. Inténtalo de nuevo.";
        }
      });
    } else {
      console.error("Formulario inválido");
      this.editError = "Por favor, completa todos los campos correctamente.";
    }
  }
}