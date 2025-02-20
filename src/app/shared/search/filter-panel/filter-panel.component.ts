import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter-panel',
  imports: [FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent {

  products: any[] = [];
  genderRoute: string = ''; 
  mostrarFiltros: boolean = false;
  isChecked = false;
  category: string | undefined;
  isCheckedMen: boolean | undefined;
  isCheckedWomen: boolean | undefined;

  constructor(
    private route: ActivatedRoute, 
    private router: Router 
    
  ) {}
  
  ngOnInit(): void {
    

    this.route.paramMap.subscribe((params) => {
      this.genderRoute = params.get('gender') || '';
      this.mostrarFiltros = !!params.get('category');
      this.category = params.get('category') || '';
      this.isCheckedMen = this.genderRoute === 'men';
      this.isCheckedWomen = this.genderRoute === 'women';
    });
  }
  
  // Método que cambia el estado de los botones
  onCheckboxChange(gender: string) {
    console.log(gender);
    if (gender === 'men') {
      this.isCheckedMen = true; // Activa el botón "Men"
      this.isCheckedWomen = false; // Desactiva el botón "Women"
      this.router.navigate(['/products/' + gender +'/'+ this.category]); // Cambia a la ruta para "Men"
    } else if (gender === 'women') {
      this.isCheckedWomen = true; // Activa el botón "Women"
      this.isCheckedMen = false; // Desactiva el botón "Men"
      this.router.navigate(['/products/' + gender +'/'+ this.category]); // Cambia a la ruta para "Women"
    }
  }

  filterVisibility: { [key: string]: boolean } = {
    gender: false,
    subcategory: false,
    size: false,
    priceRange: false,
    brand: false,
    color: false
  };
  toggleDropdown(filter: string) {
    this.filterVisibility[filter] = !this.filterVisibility[filter];
  }

  
}
