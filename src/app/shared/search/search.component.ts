import { Component, Input } from '@angular/core';
import { RoutesComponent } from "./routes/routes.component";

@Component({
  selector: 'app-search',
  imports: [RoutesComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  
  @Input() newArrivalsHeader: boolean | undefined;
}
