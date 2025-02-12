import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  text: string = 'WELCOME TO EMPERX!';
  texts: string[] = ['RETURNS AND EXCHANGES FREE OF SHIPPING CHARGES', 'FREE STANDARD SHIPPING WITH SUBSCRIPTION'];
  currentIndex: number = 0;
  fade: boolean = false;

  ngOnInit() {
    setInterval(() => {
      this.fade = true;
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        this.text = this.texts[this.currentIndex];
        this.fade = false;
      }, 500); // Duración de la transición
    }, 30000);
  }
}
