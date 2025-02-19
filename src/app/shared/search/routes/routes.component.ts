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

  constructor(
    private route: ActivatedRoute, 
    // private productsService: ProductsService 
  ) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe((params) => {
      this.gender = params.get('gender') || '';
      this.setCategoryName(); 
      // this.loadProducts(); 
    });
  }

  // loadProducts() {
  //   // Carga los productos según la categoría seleccionada
  //   this.productsService.getProductsByCategory(this.category).subscribe((data) => {
  //     this.products = data;
  //   });
  // }

  setCategoryName() {
    // Asigna nombres legibles según la categoría
    if (this.gender === 'men') {
      this.genderName = 'Men';
    } else if (this.gender === 'women') {
      this.genderName = 'Women';
    } else {
      this.genderName = 'Todos los productos'; // Si no hay categoría, muestra todos los productos
    }
  }
}
