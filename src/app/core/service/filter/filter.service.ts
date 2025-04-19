import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Articulo } from '../../../Interfaces/interfaces-globales';
// Asegúrate de importar la interfaz Articulo

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private availableSizesSource = new BehaviorSubject<string[]>([]); // Para las tallas disponibles
  availableSizes$ = this.availableSizesSource.asObservable();

  private filtrosSubject = new BehaviorSubject<any>(null);
  filters$ = this.filtrosSubject.asObservable();

  // Método para actualizar las tallas disponibles basadas en la categoría y subcategoría
  setAvailableSizesFromCategory(articulos: Articulo[], categoria: string, subcategoria: string): void {
    const sizesSet = new Set<string>(); // Usamos un Set para evitar duplicados

    // Filtrar los artículos según la categoría y subcategoría
    const filteredArticulos = articulos.filter((articulo) => {
      const isCorrectCategory =
        articulo.producto.subcategoria.categoria.nombre.toLowerCase() === categoria.toLowerCase();
      const isCorrectSubcategory =
        subcategoria === 'view-all' || articulo.producto.subcategoria.nombre.toLowerCase() === subcategoria.toLowerCase();
      return isCorrectCategory && isCorrectSubcategory;
    });

    // Extraer las tallas de los productos filtrados
    filteredArticulos.forEach((articulo) => {
      if (articulo.talla) {
        sizesSet.add(articulo.talla);
      }
    });

    // Actualizamos las tallas disponibles
    this.availableSizesSource.next(Array.from(sizesSet).sort());
  }

  // Método para aplicar filtros
  applyFilters(filters: any): void {
    this.filtrosSubject.next(filters);
  }
}
