import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filtrosSubject = new BehaviorSubject<any>(null);
  filters$ = this.filtrosSubject.asObservable();

  applyFilters(filters: any) {
    this.filtrosSubject.next(filters);
  }
}
