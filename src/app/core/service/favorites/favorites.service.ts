import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favoritos';
  private favoritos: any[] = [];
  private favoritesSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.cargarFavoritos();
  }

  // Obtener el observable de favoritos
  getFavoritos() {
    return this.favoritesSubject.asObservable();
  }

  // Cargar favoritos desde localStorage al iniciar el servicio
  private cargarFavoritos() {
    try {
      const favoritos = localStorage.getItem(this.storageKey);
      this.favoritos = favoritos ? JSON.parse(favoritos) : [];
      this.favoritesSubject.next(this.favoritos);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favoritos = [];
    }
  }

  // Agregar un producto a favoritos
  agregarFavorito(producto: any) {
    const productoId = String(producto.idProducto); // Asegurar que es string

    if (!this.favoritos.some((p) => String(p.idProducto) === productoId)) {
      this.favoritos.push({ ...producto, idProducto: productoId });
      this.actualizarStorage();
    }
  }

  // Eliminar un producto de favoritos
  eliminarFavorito(productId: string) {
    this.favoritos = this.favoritos.filter((p) => String(p.idProducto) !== productId);
    this.actualizarStorage();
  }

  // Verificar si un producto está en favoritos
  esFavorito(productId: string): boolean {
    return this.favoritos.some((p) => String(p.idProducto) === productId);
  }

  // Actualizar localStorage y emitir cambios
  private actualizarStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favoritos));
    this.favoritesSubject.next([...this.favoritos]);
  }
}
