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
        this.editForm.controls['password'].setValue(userData.password);
        
        console.log(userData.id_usuario);
        console.log(this.currentUserData);
      }
    });
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }
  
  onSubmit(): void {
    if (this.editForm.valid) {
      // Usamos 'editForm.value' directamente si se ajusta al tipo de User
      const userData: User = this.editForm.value;
      console.log(this.editForm.value);
      this.userService.updateUser(userData).subscribe({
        
      });
    } else {
      // Si el formulario no es válido, puedes manejarlo aquí
      console.error("Formulario inválido");
      this.editError = "Por favor, completa todos los campos correctamente.";
    }
  }
  
}