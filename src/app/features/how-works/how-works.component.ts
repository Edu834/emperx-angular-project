import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-how-works',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './how-works.component.html',
  styleUrl: './how-works.component.css'
})
export class HowWorksComponent {

}
