import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from "../../shared/header/header.component";
import { SearchComponent } from "../../shared/search/search.component";
import { CarrouselComponent } from "./carrousel/carrousel.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [FooterComponent, HeaderComponent, SearchComponent,CommonModule , CarrouselComponent, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent  {
goBack() {
throw new Error('Method not implemented.');
}
  showChild =  true;

}
