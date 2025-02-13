import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-toggle-menu',
  imports: [RouterLink, RouterLinkActive],
  
  templateUrl: './toggle-menu.component.html',
  styleUrl: './toggle-menu.component.css'
})
export class ToggleMenuComponent {
  @Output() closeMenu = new EventEmitter<void>(); 

  close() {
    this.closeMenu.emit(); 

    
  }
  showComponent: boolean = false;  
  width: string = '0%';  

  toggleCategory() {
    this.showComponent = !this.showComponent;
    this.width = this.showComponent ? '100%' : '0%';
    console.log(this.showComponent); 
  }
}
