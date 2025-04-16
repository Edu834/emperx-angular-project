import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterService } from '../../../core/service/filter/filter.service';

@Component({
  selector: 'app-filter-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngFor="let key of getKeys()">
      <ng-container *ngIf="isArray(filtros[key]); else valorSimple">
        <!-- <span class="font-semibold capitalize">{{ key }}:</span> -->
        <ng-container *ngFor="let val of filtros[key]">
          <span class="ml-2 inline-block bg-gray-200 px-2  text-black">
            {{ val }}
            <button class="ml-1 text-red-600" (click)="remove(key, val)">x</button>
          </span>
        </ng-container>
      </ng-container>
      <ng-template #valorSimple>
        <!-- <span class="font-semibold capitalize">{{ key }}:</span> -->
        <span class="ml-2 inline-block bg-gray-200 px-2  text-black">
          {{ filtros[key] }}
          <button class="ml-1 text-red-600" (click)="remove(key, filtros[key])">x</button>
        </span>
      </ng-template>
    </ng-container>
  `
})
export class FilterSummaryComponent implements OnInit {
  filtros: any = {};

  @Output() eliminarFiltro = new EventEmitter<{ nombre: string, valor: string }>();

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.filterService.filters$.subscribe(filtros => {
      if (filtros) {
        this.filtros = filtros;
      }
    });
  }

  getKeys(): string[] {
    return Object.keys(this.filtros).filter(key => this.filtros[key] !== undefined && this.filtros[key] !== null);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  remove(nombre: string, valor: string) {
    this.eliminarFiltro.emit({ nombre, valor });
  }
}
