import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-reviews',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.css'
})
export class UserReviewsComponent {
  constructor( private location: Location){}
  goBack(): void {
    this.location.back();
  }
}
