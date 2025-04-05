import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
export class FilterPanelComponent implements OnInit {
  @Input() mostrarFiltros: boolean = false;
  @Output() filtrosAplicados = new EventEmitter<any>();

  selectedBrand: string | null = null;
  selectedColor: string | null = null;
  selectedPriceRange: string | null = null;
  selectedSizes: string[] = [];

  genderRoute: string = 'men';
  category: string = 'view-all';
  subcategory: string = 'view-all';
  isCheckedMen: boolean = false;
  isCheckedWomen: boolean = false;
  activeSubcategory: string = 'View all';

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

  filterVisibility: { [key: string]: boolean } = {
    gender: true,
    subcategory: false,
    size: false,
    priceRange: false,
    brand: false,
    color: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterService
  ) {}

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

      this.updateFilters();
    });

    this.filterService.filters$.subscribe(filters => {
      this.selectedSizes = filters.size || [];
    });
  }

  toggleDropdown(filter: string) {
    this.filterVisibility[filter] = !this.filterVisibility[filter];
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

  // Método para manejar la selección de una talla
  onSizeChange(size: string): void {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    } else {
      this.selectedSizes.push(size);
    }
    this.updateFilters();
  }

  // Método para eliminar un filtro individual
  onRemoveFilter(filterName: string, value: string): void {
    switch (filterName) {
      case 'brand':
        if (this.selectedBrand === value) {
          this.selectedBrand = null;
        }
        break;
      case 'color':
        if (this.selectedColor === value) {
          this.selectedColor = null;
        }
        break;
      case 'priceRange':
        if (this.selectedPriceRange === value) {
          this.selectedPriceRange = null;
        }
        break;
      case 'size':
        this.selectedSizes = this.selectedSizes.filter(size => size !== value);
        break;
    }
    this.updateFilters();
  }

  // Método para cambiar el género (hombres/mujeres)
  onGenderChange(gender: string) {
    this.isCheckedMen = gender === 'men';
    this.isCheckedWomen = gender === 'women';

    this.router.navigate(['/products', gender, this.category, this.subcategory], { queryParamsHandling: 'merge' });
  }

  // Método para cambiar la subcategoría
  onSubcategoryChange(subcategory: string) {
    this.activeSubcategory = subcategory;
    this.subcategory = subcategory.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/products', this.genderRoute, this.category, this.subcategory], { queryParamsHandling: 'merge' });
  }

  // Actualizar filtros
  updateFilters() {
    const filters: any = {
      brand: this.selectedBrand || undefined,
      color: this.selectedColor || undefined,
      priceRange: this.selectedPriceRange || undefined,
      size: this.selectedSizes.length > 0 ? this.selectedSizes : undefined
    };

    

    // Emitir los filtros para otros componentes
    this.filtrosAplicados.emit(filters);

    // Aplicar los filtros globalmente
    this.filterService.applyFilters(filters);
  }

  // Obtener filtros seleccionados
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
}
