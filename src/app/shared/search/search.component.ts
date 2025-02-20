'@angular/core';
import { RoutesComponent } from "./routes/routes.component";
import { FilterPanelComponent } from "./filter-panel/filter-panel.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-search',
  imports: [RoutesComponent, FilterPanelComponent,],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  gender: string = ''; 
  mostrarFiltros: boolean | undefined ;
  textHideFilter: string = "Hide filters";

  @Input() newArrivalsHeader: boolean | undefined;

  constructor(
      private route: ActivatedRoute, 
      
    ) {}
  ngOnInit(): void {
    
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.mostrarFiltros = !!params.get('category');

    });
  }

  hideFilterPanel() {
    this.mostrarFiltros = !this.mostrarFiltros; 
    if (this.mostrarFiltros) {
        this.textHideFilter = "Hide filters"; 
    } else {
        this.textHideFilter = "Show filters"; 
    }
  }
}