'@angular/core';
import { RoutesComponent } from "./routes/routes.component";
import { FilterPanelComponent } from "./filter-panel/filter-panel.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProductsListComponent } from "../products-list/products-list.component";


@Component({
  selector: 'app-search',
  imports: [RoutesComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  
  gender: string = ''; 
  mostrarFiltros: boolean = true ;
  mostrarBotonFiltros: boolean = true;
  textHideFilter: string = "Hide filters";
  @Output() toggleFiltrosEvent = new EventEmitter<boolean>();
  @Input() newArrivalsHeader: boolean | undefined;
  category: string | undefined;
  id: string | null | undefined;

  constructor(
      private route: ActivatedRoute, 
      
    ) {}
    ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        this.gender = params.get('gender') || '';
        this.category = params.get('category') || '';
        this.id = params.get('name'); // Esto captura el `id`, si existe
    
        // Mostrar filtros solo si hay 'gender' y 'category', pero NO un 'id'
        this.mostrarFiltros = !!this.gender && !!this.category && !this.id;
    
        // Controlar si se muestra el botón de filtros
        this.mostrarBotonFiltros = this.mostrarFiltros;
      });
    }
    
    
    
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
    this.textHideFilter = this.mostrarFiltros ? "Hide filters" : "Show filters";
    
    // Emitimos el estado actualizado a ProductsComponent
    this.toggleFiltrosEvent.emit(this.mostrarFiltros);
  }
  // hideFilterPanel() {
  //   this.mostrarFiltros = !this.mostrarFiltros; 
  //   if (this.mostrarFiltros) {
  //       this.textHideFilter = "Hide filters"; 
  //   } else {
  //       this.textHideFilter = "Show filters"; 
  //   }
  // }
}