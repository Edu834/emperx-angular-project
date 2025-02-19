import { Component, Input, OnInit } from '@angular/core';
import { RoutesComponent } from "./routes/routes.component";
import { FilterPanelComponent } from "./filter-panel/filter-panel.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [RoutesComponent, FilterPanelComponent,],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  gender: string = ''; 
  mostrarFiltros: boolean = false;
  
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
}
