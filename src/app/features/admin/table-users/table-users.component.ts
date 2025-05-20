// COMPONENTE ANGULAR
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/service/user/user.service';
import { User } from '../../../core/service/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true, // Añadido porque estás usando imports directamente en el componente
  imports: [CommonModule, FormsModule],
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
})
export class TableUsersComponent implements OnInit {


  users: User[] = [];
  displayedUsers: User[] = [];
  page: number = 1;
  limit: number = 10;      // Cambiado a 10 usuarios por página (era 1)
  total: number = 0;
  loading = false;
  editingUser: User | null = null;
  search: string = '';     // Tipado correctamente

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();      // Es mejor llamar a loadUsers() que tiene manejo de errores
  }
  initialsSortAsc: boolean = true;


toggleInitialsSort() {
  this.initialsSortAsc = !this.initialsSortAsc;
  this.displayedUsers.sort((a, b) => {
    const initialsA = this.getInitials(a);
    const initialsB = this.getInitials(b);
    return this.initialsSortAsc
      ? initialsA.localeCompare(initialsB)
      : initialsB.localeCompare(initialsA);
  });
}
verDetalle(user: any) {
  this.router.navigate(['/admin/customers', user.idUsuario]);
}

getInitials(user: any): string {
  const nombre = user.nombre?.trim();
  const apellido = user.apellido?.trim();
  if (nombre && apellido) {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }
  return user.username?.substring(0, 2).toUpperCase() || '';
}

  goToPage(p: number) {
    this.page = p;
    this.updateDisplayedUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: User[] | { users: User[] }) => {
        // Verificar la estructura de la respuesta
        if (Array.isArray(res)) {
          this.users = res;
        } else if (res && (res as any).users && Array.isArray((res as any).users)) {
          this.users = (res as any).users;
        } else {
          this.users = [];
          console.error('Formato de respuesta inesperado:', res);
        }
        
        this.total = this.users.length;
        this.updateDisplayedUsers();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
      }
    });
  }

  updateDisplayedUsers() {
    // Aplicar búsqueda si existe
    let filteredUsers = this.users;
    if (this.search && this.search.trim() !== '') {
      const searchTerm = this.search.toLowerCase();
      filteredUsers = this.users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm))
      );
    }
    
    // Actualizar total después de filtrar
    this.total = filteredUsers.length;
    
    // Aplicar paginación
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    this.displayedUsers = filteredUsers.slice(start, end);
  }

  searchUsers() {
    this.page = 1;
    this.updateDisplayedUsers(); // Solo necesitamos actualizar la vista, no recargar
  }

  deleteUser(user: any): void {
  console.log(user.idUsuario);  // Aquí está el id correcto
  if (confirm(`¿Seguro que quieres eliminar a ${user.firstname} ${user.lastname}?`)) {
    this.userService.deleteUser(user.idUsuario).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.idUsuario !== user.idUsuario);
        this.displayedUsers = [...this.users];
        alert('Usuario eliminado');
      },
      error: () => alert('Error al eliminar usuario')
    });
  }
}

  startEdit(user: User) {
    this.editingUser = { ...user };
  }

  // saveEdit() {
  //   if (!this.editingUser) return;
  //   this.userService.updateUser(this.editingUser.id_usuario, this.editingUser).subscribe({
  //     next: () => {
  //       this.editingUser = null;
  //       this.loadUsers();
  //     },
  //     error: (err) => {
  //       console.error('Error al actualizar usuario:', err);
  //       alert('Error al actualizar usuario');
  //     }
  //   });
  // }

  cancelEdit() {
    this.editingUser = null;
  }

  get totalPages(): number[] {
    if (!this.users.length || !this.limit) return [];
    const count = Math.ceil(this.total / this.limit);
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}