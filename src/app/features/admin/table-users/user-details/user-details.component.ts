import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/service/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/service/user/user';

@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  templateUrl: './user-details.component.html',
  imports: [CommonModule, FormsModule],
})
export class UserDetailsComponent implements OnInit {
  user: User = {} as User;
  editing = false;
  editedUser: User = {} as User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUsuarioById(+id).subscribe({
        next: (data) => {
          this.user = this.mapUserFromBackend(data);
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);
        }
      });
    }
  }

  private mapUserFromBackend(data: any): User {
    return {
      ...data,
      idUsuario: data.id_usuario
    };
  }

  deleteUser(): void {
    if (!this.user?.idUsuario) return;

    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(this.user.idUsuario).subscribe({
        next: () => {
          alert('Usuario eliminado con éxito');
          this.router.navigate(['/admin/customers']);
        },
        error: (error) => {
          alert('Error al eliminar el usuario');
          console.error(error);
        }
      });
    }
  }

  startEdit(): void {
    this.editedUser = { ...this.user };
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    this.editedUser = {} as User;
  }

  saveUser(): void {
    if (!this.editedUser || !this.user?.idUsuario) return;

    this.userService.updateUser2(this.user.idUsuario, this.editedUser).subscribe({
      next: (updatedUser) => {
        this.user = this.mapUserFromBackend(updatedUser);
        this.editing = false;
        this.editedUser = {} as User;
        alert('Usuario actualizado correctamente');
      },
      error: (error) => {
        alert('Error al actualizar el usuario');
        console.error(error);
      }
    });
  }
}
