import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-routes',
  imports: [RouterLink],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit{
  products: any[] = [];
  gender: string = ''; 
  genderName: string = ''; 
  category: string = ''; 
  categoryName: string = '';
  subcategory: string = ''; 
  subcategoryName: string = '';  

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.category = params.get('category') || ''; 
      this.subcategory = params.get('subcategory') || ''; 
      this.setNames(); 
      // this.loadProducts(); 
      // console.log(this.category);
    });
  }

  setNames() {
    // Asigna nombres legibles según el género
    if (this.gender === 'men') {
      this.genderName = 'Men';
    } else if (this.gender === 'women') {
      this.genderName = 'Women';
    } else {
      this.genderName = 'All Products'; // Si no hay género, muestra todos los productos
    }

    // Asigna nombres legibles según la categoría
    if (this.category) {
      this.categoryName = this.capitalize(this.category);
    } else {
      this.categoryName = ''; // Si no hay categoría, dejar vacío
    }

    if (this.subcategory) {
      this.subcategoryName = this.capitalize(this.subcategory);
    } else {
      this.subcategoryName = ''; // Si no hay categoría, dejar vacío
    }
  }
  
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
