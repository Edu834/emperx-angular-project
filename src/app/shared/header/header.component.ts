import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleMenuComponent } from './toggle-menu/toggle-menu.component';
import { AuthService } from '../../core/service/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ToggleMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
  }

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

  

  showComponent: boolean = false;  // Controla la visibilidad del div
  width: string = '0%';  // Inicializa el ancho del div

  toggleComponent() {
    this.showComponent = !this.showComponent;
    this.width = this.showComponent ? '100%' : '0%';  // Ajusta el ancho basado en la visibilidad
  }

  handleCloseMenu() {
    this.showComponent = false;  // Oculta el menú cuando se hace clic en el botón "X"
    this.width = '0%';  // Ajusta el ancho a 0% cuando se cierra
  }

  lastScrollTop = 0;
  isHeaderVisible = true;

 

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      // Scrolling down
      this.isHeaderVisible = false;
    } else {
      // Scrolling up
      this.isHeaderVisible = true;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  
}
