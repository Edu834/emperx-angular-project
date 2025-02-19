import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  imports: [],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent {
  showGender = false;
  showSubcategory = false;
  showSize = false;
  showPriceRange = false;
  showBrand = false;
  showColor = false;
  priceValue = 100; // Valor inicial del rango de precio

  toggleDropdown(filter: string) {
    switch (filter) {
      case 'gender':
        this.showGender = !this.showGender;
        break;
      case 'subcategory':
        this.showSubcategory = !this.showSubcategory;
        break;
      case 'size':
        this.showSize = !this.showSize;
        break;
      case 'priceRange':
        this.showPriceRange = !this.showPriceRange;
        break;
      case 'brand':
        this.showBrand = !this.showBrand;
        break;
      case 'color':
        this.showColor = !this.showColor;
        break;
    }
  }
  
}
