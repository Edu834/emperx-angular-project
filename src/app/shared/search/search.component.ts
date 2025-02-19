import { Component, Input } from '@angular/core';
import { RoutesComponent } from "./routes/routes.component";
import { FilterPanelComponent } from "./filter-panel/filter-panel.component";

@Component({
  selector: 'app-search',
  imports: [RoutesComponent, FilterPanelComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  
  @Input() newArrivalsHeader: boolean | undefined;
}
