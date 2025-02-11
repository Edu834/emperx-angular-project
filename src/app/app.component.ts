import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/footer/footer.component";
import { HomepageComponent } from './features/homepage/homepage.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HomepageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'emperx-angular-project';
}
