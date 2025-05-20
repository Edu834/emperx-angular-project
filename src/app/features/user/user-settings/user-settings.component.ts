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
  isModalOpen = false;
  editError: string = '';
  passwordForm: FormGroup;
  editForm: FormGroup;
  currentUserData: User | null = null;
  date: string | undefined;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private location: Location, 
    private userService: UserService
  ) {
    // Formulario de edición de datos del usuario
    this.editForm = this.formBuilder.group({
      idUsuario: ['', Validators.required],
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], // Contraseña actual (para mantener la lógica del perfil)
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: [''],
      country: [''],
      province: [''],
      city: [''],
      zipCode: [''],
    });

    // Formulario exclusivo para el cambio de contraseña
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],  // Contraseña actual
      newPassword: ['', [Validators.required]], // Nueva contraseña
      confirmNewPassword: ['', [Validators.required]], // Confirmación de la nueva contraseña
    });
  }

  ngOnInit(): void {
    // Cargar los datos actuales del usuario
    this.userService.getAuthenticatedUser().subscribe((userData: User | null) => {
      
      if (userData) {
        this.currentUserData = userData;
        this.editForm.controls['idUsuario'].setValue(userData.idUsuario);
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
        console.log(userData.idUsuario);
        console.log(this.currentUserData);
        this.date = this.getDate(this.currentUserData.fechaAlta);
      }
    });
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }
  // Abre el modal
  openModal() {
    this.isModalOpen = true;
  }

  // Cierra el modal
  closeModal() {
    this.isModalOpen = false;
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
  onChangePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;
  
      // Verificar si la nueva contraseña y la confirmación coinciden
      if (newPassword !== confirmNewPassword) {
        this.editError = 'Las contraseñas no coinciden';
        return;
      }
  
      if (!this.currentUserData) {
        console.error('No se pudo obtener el ID del usuario');
        this.editError = 'No se pudo obtener el ID del usuario. Intenta de nuevo.';
        return;
      }
  
      // Obtener el idUsuario desde el currentUserData
      const idUsuario = this.currentUserData.idUsuario;
      console.log(idUsuario);
      // Llamar al servicio de cambio de contraseña
      this.userService.changePassword(idUsuario, currentPassword, newPassword).subscribe({
        next: (response: any) => {
          console.log("Usuario actualizado correctamente");
            this.router.navigate(['/user/profile']); // Redirigir al perfil
        },
        error: (error) => {
          console.error('Error al cambiar la contraseña', error);
          this.editError = 'Error al cambiar la contraseña. Intenta de nuevo.';
        }
      });
    } else {
      console.error('Formulario inválido');
      this.editError = 'Por favor, completa todos los campos correctamente.';
    }
  }
  
}