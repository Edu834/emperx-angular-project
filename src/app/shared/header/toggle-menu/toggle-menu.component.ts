// import { Component, EventEmitter, Output } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';

// @Component({
//   selector: 'app-toggle-menu',
//   imports: [RouterLink, RouterLinkActive],
  
//   templateUrl: './toggle-menu.component.html',
//   styleUrl: './toggle-menu.component.css'
// })
// export class ToggleMenuComponent {
//   @Output() closeMenu = new EventEmitter<void>(); 


//   showComponent: 'women' | 'men'  | null = null;
//   width: string = '0%';

//   close() {
//     this.closeMenu.emit();
//   }

//   toggleGender(gender: 'women' | 'men' ) {
//     this.showComponent = this.showComponent === gender ? null : gender;
//     this.width = this.showComponent ? '100%' : '0%';
//   }

//   toggleCategory(category: 'ready-to-wear' | 'bags' | 'shoes' | 'accessories') {
    
//     console.log(category);

//   }



  // showComponentWoman: boolean = false;  
  // showComponentMan: boolean = false;
  // width: string = '0%';  

  // toggleCategoryWoman() {
  //   this.showComponentWoman = !this.showComponentWoman;
  //   this.width = this.showComponentWoman ? '100%' : '0%';
  //   // console.log(this.showComponentWoman); 
  // }

  // toggleCategoryMan() {
  //   this.showComponentMan = !this.showComponentMan;
  //   this.width = this.showComponentMan ? '100%' : '0%';
  //   // console.log(this.showComponentMan); 
  // }
// }
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-toggle-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './toggle-menu.component.html',
  styleUrls: ['./toggle-menu.component.css']
})
export class ToggleMenuComponent {
  @Output() closeMenu = new EventEmitter<void>();

  activeGender: 'women' | 'men' | null = null;
  activeCategory: string | null = null;
  menuWidth: string = '0%';  
  categoryWidth: string = '0%';

  close() {
    this.resetMenu();
    this.closeMenu.emit();
  }

  toggleGender(gender: 'women' | 'men' | null) {
    if (this.activeGender === gender) {
      this.resetMenu();
    } else {
      this.activeGender = gender;
      this.activeCategory = null;
      this.menuWidth = '100%';
      this.categoryWidth = '0%'; 
    }
  }

  toggleCategory(category: string) {
    if (this.activeCategory === category) {
      this.goBack(); 
    } else {
      this.activeCategory = category;
      this.categoryWidth = '100%';
    }
  }

  goBack() {
    if (this.activeCategory) {
      this.activeCategory = null;
      this.categoryWidth = '0%';
    } else if (this.activeGender) {
      this.resetMenu();
    }
  }

  resetMenu() {
    this.activeGender = null;
    this.activeCategory = null;
    this.menuWidth = '0%';
    this.categoryWidth = '0%';
  }
}


