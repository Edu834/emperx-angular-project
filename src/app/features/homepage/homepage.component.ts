import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";

@Component({
  selector: 'app-homepage',
  imports: [FooterComponent, HeaderComponent, SearchComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',

})
export class HomepageComponent {
  ngOnInit() {
    
  }
  
}
