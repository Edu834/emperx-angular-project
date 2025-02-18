import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SearchComponent } from "../../shared/search/search.component";

@Component({
  selector: 'app-about-us',
  imports: [HeaderComponent, FooterComponent, SearchComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  
}
