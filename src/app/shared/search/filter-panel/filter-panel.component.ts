import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../core/service/filter/filter.service';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Input() mostrarFiltros: boolean = false;
  @Output() filtrosAplicados = new EventEmitter<any>();

  // Filtros seleccionados
  selectedBrand: string | null = null;
  selectedColor: string | null = null;
  selectedPriceRange: string | null = null;
  selectedSizes: string[] = [];

  // Variables relacionadas con la navegación
  genderRoute: string = 'men';
  category: string = 'view-all';
  subcategory: string = 'view-all';
  isCheckedMen: boolean = false;
  isCheckedWomen: boolean = false;
  activeSubcategory: string = 'View all';

  // Opciones de filtros
  brands: string[] = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Under Armour'];
  subcategories: { [key: string]: string[] } = {
    men: ['View all', 'Suits', 'Coats & Jackets', 'Dresses', 'Skirts', 'T-Shirts', 'Tops & Bodysuits', 'Jeans & Trousers', 'Knitwear', 'Sweatshirts', 'Totes', 'Clutches', 'Boots', 'Sneakers', 'Watches', 'Hats'],
    women: ['View all', 'Suits', 'Coats & Jackets', 'Dresses', 'Skirts', 'T-Shirts', 'Tops & Bodysuits', 'Jeans & Trousers', 'Knitwear', 'Sweatshirts', 'Totes', 'Clutches', 'Boots', 'Sneakers', 'Watches', 'Hats']
  };

  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  readonly priceRanges = [
    { label: '0€ - 25€', value: '0-25' },
    { label: '25€ - 50€', value: '25-50' },
    { label: '50€ - 100€', value: '50-100' },
    { label: '100€ - 200€', value: '100-200' }
  ];

  colors = [
    { name: 'Negro', code: '#000000' },
    { name: 'Azul', code: '#007bff' },
    { name: 'Marrón', code: '#8B4513' },
    { name: 'Verde', code: '#4CAF50' },
    { name: 'Gris', code: '#808080' },
    { name: 'Multicolor', code: 'linear-gradient(45deg, red, blue, yellow, green)' },
    { name: 'Naranja', code: '#FF5722' },
    { name: 'Rosa', code: '#E91E63' },
    { name: 'Morado', code: '#9C27B0' },
    { name: 'Rojo', code: '#F44336' },
    { name: 'Blanco', code: '#FFFFFF', border: '1px solid #ccc' },
    { name: 'Amarillo', code: '#FFEB3B' },
  ];

  constructor(private route: ActivatedRoute, private router: Router, private filterService: FilterService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.genderRoute = params.get('gender') || 'men';
      this.category = params.get('category') || 'view-all';
      this.subcategory = params.get('subcategory') || 'view-all';
      this.selectedBrand = params.get('brand') || null;
      this.selectedColor = params.get('color') || null;
      this.selectedPriceRange = params.get('price') || null;
      this.selectedSizes = params.get('sizes') ? params.get('sizes')!.split(',') : [];

      this.activeSubcategory = this.subcategories[this.genderRoute]?.find(
        sub => sub.toLowerCase().replace(/ /g, '-') === this.subcategory
      ) || 'View all';

      this.isCheckedMen = this.genderRoute === 'men';
      this.isCheckedWomen = this.genderRoute === 'women';

      this.mostrarFiltros = !!this.category;
    });

    this.updateFilters();
  }

  onColorChange(color: string) {
    this.selectedColor = this.selectedColor === color ? null : color;
    this.updateFilters();
  }

  onPriceRangeChange(price: string) {
    this.selectedPriceRange = this.selectedPriceRange === price ? null : price;
    this.updateFilters();
  }

  onBrandChange(brand: string) {
    this.selectedBrand = this.selectedBrand === brand ? null : brand;
    this.updateFilters();
  }

  onGenderChange(gender: string) {
    this.isCheckedMen = gender === 'men';
    this.isCheckedWomen = gender === 'women';
    this.router.navigate(['/products', gender, this.category, this.subcategory], { queryParamsHandling: 'merge' });
  }

  onSubcategoryChange(subcategory: string) {
    this.activeSubcategory = subcategory;
    this.subcategory = subcategory.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/products', this.genderRoute, this.category, this.subcategory], { queryParamsHandling: 'merge' });
  }

  onSizeChange(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    } else {
      this.selectedSizes.push(size);
    }
    this.updateFilters();
  }

  updateFilters() {
    const filters: any = {
      brand: this.selectedBrand || undefined,
      color: this.selectedColor || undefined,
      price: this.selectedPriceRange || undefined,
      sizes: this.selectedSizes.length > 0 ? this.selectedSizes : undefined
    };

    this.filterService.applyFilters(filters);

    this.router.navigate([], {
      queryParams: Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
      queryParamsHandling: 'merge'
    });
  }

  getSelectedBrand(): string {
    return this.selectedBrand || 'Sin marca seleccionada';
  }

  getFilteredPriceRange(): string {
    return this.selectedPriceRange || 'Sin filtro de precio';
  }

  getSelectedColor(): string {
    return this.selectedColor || 'Sin color seleccionado';
  }

  getSelectedSizes(): string {
    return this.selectedSizes.length ? this.selectedSizes.join(', ') : 'Ninguna talla seleccionada';
  }

  filterVisibility: { [key: string]: boolean } = {
    gender: true,
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
