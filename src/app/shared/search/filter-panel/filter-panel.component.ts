import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {

  subcategories: { [key: string]: string[] } = {
    men: [
      'View all',
      'Dresses',
      'Coats & Jackets',
      'Tops & Bodysuits',
      'T-Shirts',
      'Pants',
      'Jeans',
      'Skirts',
      'Shorts',
      'Sweaters',
      'Shoes',
      'Bags & Accessories'
    ],
    women: [
      'View all',
      'Dresses',
      'Coats & Jackets',
      'Tops & Bodysuits',
      'T-Shirts',
      'Pants',
      'Jeans',
      'Skirts',
      'Shorts',
      'Sweaters',
      'Shoes',
      'Bags & Accessories'
    ]
  };

  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // Opciones de tallas
  selectedSizes: string[] = []; // Guardará las tallas seleccionadas

  products: any[] = [];
  genderRoute: string = ''; 
  mostrarFiltros: boolean = false;
  category: string = 'view-all';
  subcategory: string = 'view-all';
  isCheckedMen: boolean = false;
  isCheckedWomen: boolean = false;
  activeSubcategory: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.genderRoute = params.get('gender') || 'men';
      this.category = params.get('category') || 'view-all';
      this.subcategory = params.get('subcategory') || 'view-all';

      this.activeSubcategory = this.subcategories[this.genderRoute]?.find(
        sub => sub.toLowerCase().replace(/ /g, '-') === this.subcategory
      ) || 'View all';

      this.isCheckedMen = this.genderRoute === 'men';
      this.isCheckedWomen = this.genderRoute === 'women';

      this.mostrarFiltros = !!this.category;
    });
  }
  
  onGenderChange(gender: string) {
    this.isCheckedMen = gender === 'men';
    this.isCheckedWomen = gender === 'women';
    this.router.navigate(['/products', gender, this.category, this.subcategory]);
  }

  onSubcategoryChange(subcategory: string) {
    this.activeSubcategory = subcategory;
    this.subcategory = subcategory.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/products', this.genderRoute, this.category, this.subcategory]);
  }


  onSizeChange(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    } else {
      this.selectedSizes.push(size);
    }
    console.log("Tallas seleccionadas:", this.selectedSizes);
  }

 
  getSelectedSizes(): string {
    return this.selectedSizes.length ? this.selectedSizes.join(', ') : 'None';
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
