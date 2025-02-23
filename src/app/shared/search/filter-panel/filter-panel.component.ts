import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Input() mostrarFiltros: boolean = false;  // Usamos un valor por defecto (false)
  @Output() filtrosAplicados = new EventEmitter<any>();

  // Filtros seleccionados
  selectedBrand: string | null = null;
  selectedColor: string | null = null;
  selectedPriceRange: string | null = null;
  selectedSizes: string[] = [];

  // Variables relacionadas con la navegación
  genderRoute: string = 'men'; // Default a 'men', puede ser 'women' según la ruta
  category: string = 'view-all';
  subcategory: string = 'view-all';
  isCheckedMen: boolean = false;
  isCheckedWomen: boolean = false;
  activeSubcategory: string = 'View all';

  // Opciones de filtros
  brands: string[] = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Under Armour'];
  subcategories: { [key: string]: string[] } = {
    men: ['View all', 'Dresses', 'Coats & Jackets', 'Tops & Bodysuits', 'T-Shirts', 'Pants', 'Jeans', 'Skirts', 'Shorts', 'Sweaters', 'Shoes', 'Bags & Accessories'],
    women: ['View all', 'Dresses', 'Coats & Jackets', 'Tops & Bodysuits', 'T-Shirts', 'Pants', 'Jeans', 'Skirts', 'Shorts', 'Sweaters', 'Shoes', 'Bags & Accessories']
  };

  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];  // Opciones de tallas

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

  // Constructor para la inyección de dependencias
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    this.route.paramMap.subscribe((params) => {
      this.genderRoute = params.get('gender') || 'men';
      this.category = params.get('category') || 'view-all';
      this.subcategory = params.get('subcategory') || 'view-all';

      this.activeSubcategory = this.subcategories[this.genderRoute]?.find(
        sub => sub.toLowerCase().replace(/ /g, '-') === this.subcategory
      ) || 'View all';

      // Sincronizar con los filtros iniciales
      this.isCheckedMen = this.genderRoute === 'men';
      this.isCheckedWomen = this.genderRoute === 'women';

      this.mostrarFiltros = !!this.category;
    });
  }

  // Métodos de cambio de filtro
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
    this.updateFilters();
  }

  // Método para actualizar la URL con los filtros aplicados
  updateFilters() {
    const queryParams: any = {};
    if (this.selectedBrand) queryParams.brand = this.selectedBrand;
    if (this.selectedColor) queryParams.color = this.selectedColor;
    if (this.selectedPriceRange) queryParams.price = this.selectedPriceRange;
    if (this.selectedSizes.length > 0) queryParams.sizes = this.selectedSizes.join(',');

    this.router.navigate([], { queryParams });
    this.filtrosAplicados.emit(queryParams);
    console.log(queryParams)
    // this.filtrosAplicados.emit(queryParams);

  }

  // Métodos para obtener los valores de los filtros seleccionados
  getSelectedBrand(): string {
    return this.selectedBrand ? this.selectedBrand : 'Sin marca seleccionada';
  }

  getFilteredPriceRange(): string {
    return this.selectedPriceRange ? this.selectedPriceRange : 'Sin filtro de precio';
  }

  getSelectedColor(): string {
    return this.selectedColor ? this.selectedColor : 'Sin color seleccionado';
  }

  getSelectedSizes(): string {
    return this.selectedSizes.length ? this.selectedSizes.join(', ') : 'Ninguna talla seleccionada';
  }

  // Manejo de la visibilidad de los filtros
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
