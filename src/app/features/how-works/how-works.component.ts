import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SearchComponent } from "../../shared/search/search.component";
import { FaqComponent } from "./faq/faq.component";

@Component({
  selector: 'app-how-works',
  imports: [HeaderComponent, FooterComponent, SearchComponent, FaqComponent],
  templateUrl: './how-works.component.html',
  styleUrl: './how-works.component.css'
})
export class HowWorksComponent {

  
}
