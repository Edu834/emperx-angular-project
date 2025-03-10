import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favoritos';

  constructor() {}

  // Obtener la lista de favoritos desde localStorage
  getFavoritos(): any[] {
    try {
      const favoritos = localStorage.getItem(this.storageKey);
      return favoritos ? JSON.parse(favoritos) : [];
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      return [];
    }
  }

  // Agregar un producto a favoritos
  agregarFavorito(producto: any) {
    let favoritos = this.getFavoritos();
    const productoId = String(producto.idProducto); // Asegurar que es string

    if (!favoritos.some((p) => String(p.idProducto) === productoId)) {
      favoritos.push({ ...producto, idProducto: productoId }); // Asegurar consistencia
      localStorage.setItem(this.storageKey, JSON.stringify(favoritos));
    }
  }

  // Eliminar un producto de favoritos
  eliminarFavorito(productId: string) {
    let favoritos = this.getFavoritos().filter((p) => String(p.idProducto) !== productId);
    localStorage.setItem(this.storageKey, JSON.stringify(favoritos));
  }

  // Verificar si un producto está en favoritos
  esFavorito(productId: string): boolean {
    return this.getFavoritos().some((p) => String(p.idProducto) === productId);
  }
}
