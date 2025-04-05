import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<any>({}); // Almacena los filtros aplicados
  filters$ = this.filtersSubject.asObservable(); // Observable para otros componentes

  applyFilters(newFilters: any) {
    const currentFilters = this.filtersSubject.value;
    const updatedFilters = { ...currentFilters, ...newFilters };

    // 🧹 Eliminar filtros vacíos
    Object.keys(updatedFilters).forEach(key => {
      if (!updatedFilters[key] || (Array.isArray(updatedFilters[key]) && updatedFilters[key].length === 0)) {
        delete updatedFilters[key];
      }
    });

    // Reemplaza completamente los filtros actuales
    this.filtersSubject.next(updatedFilters);
  }

  // (Opcional) Para limpiar todos los filtros
  clearFilters() {
    this.filtersSubject.next({});
  }

  // (Opcional) Obtener los filtros actuales
  getCurrentFilters() {
    return this.filtersSubject.value;
  }

  removeFilter(filterKey: string) {
    const currentFilters = this.filtersSubject.value;
    delete currentFilters[filterKey]; // Elimina el filtro específico
    this.filtersSubject.next(currentFilters); // Actualiza el estado global de filtros
  }
  // Método para actualizar un filtro
  updateFilter(key: string, value: any): void {
    const currentFilters = this.filtersSubject.value;
    currentFilters[key] = value;
    this.filtersSubject.next({ ...currentFilters });
  }
}
