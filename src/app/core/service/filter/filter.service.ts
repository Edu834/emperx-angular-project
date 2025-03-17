import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<any>({}); // Almacena los filtros aplicados
  filters$ = this.filtersSubject.asObservable(); // Observable para suscribirse en otros componentes

  applyFilters(filters: any) {
    this.filtersSubject.next(filters); // Actualiza los filtros y notifica a los suscriptores
  }
}
