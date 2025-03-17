import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/service/products/products.service';
import { Articulo, ProductView } from '../../../Interfaces/interfaces-globales';
import { ProductCardComponent } from "../../../shared/product-card/product-card.component";
import { ProductsListComponent } from "../../../shared/products-list/products-list.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrousel',
  imports: [RouterLink , CommonModule],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css'
})
export class CarrouselComponent implements AfterViewInit {
  // products = [
  //   { name: 'Producto 1', price: 100, image: 'url_de_imagen_1' },
  //   { name: 'Producto 2', price: 200, image: 'url_de_imagen_2' },
  //   { name: 'Producto 3', price: 300, image: 'url_de_imagen_3' },
  //   { name: 'Producto 4', price: 400, image: 'url_de_imagen_4' },
  //   { name: 'Producto 5', price: 500, image: 'url_de_imagen_5' },
  //   // Puedes agregar más productos aquí
  // ];

  @ViewChild('carousel') carousel: any;
  @Input() product!: ProductView | undefined; 

  ngAfterViewInit() {
    // Inicializamos el scroll en 0 cuando la vista se haya cargado
    this.carousel.nativeElement.scrollLeft = 0;
  }

  // Función para desplazarse hacia el producto anterior
  prevSlide() {
    const carouselElement = this.carousel.nativeElement;
    const scrollWidth = carouselElement.scrollWidth;
    const clientWidth = carouselElement.clientWidth;
    
    // Desplazamiento de solo 100 píxeles en cada clic
    const desplazamiento = 300;

    // Si hemos llegado al inicio, vamos al último producto
    if (carouselElement.scrollLeft === 0) {
      carouselElement.scrollLeft = scrollWidth - clientWidth;
    } else {
      carouselElement.scrollLeft -= desplazamiento; // Desplazar hacia la izquierda
    }
  }

  // Función para desplazarse al siguiente producto
  nextSlide() {
    const carouselElement = this.carousel.nativeElement;
    const scrollWidth = carouselElement.scrollWidth;
    const clientWidth = carouselElement.clientWidth;
    
    // Desplazamiento de solo 100 píxeles en cada clic
    const desplazamiento = 300;

    // Si hemos llegado al final, vamos al primer producto
    if (carouselElement.scrollLeft + clientWidth === scrollWidth) {
      carouselElement.scrollLeft = 0;
    } else {
      carouselElement.scrollLeft += desplazamiento; // Desplazar hacia la derecha
    }
  }
  products: ProductView[] = [];
  listaArticulos: Articulo[] = [];
  currentIndex: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private service: ProductsService,
    private router: Router

    
  ) {}


  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.obtenerArticulos();
    });
  }

  obtenerArticulos(): void {
    this.service.listArticulos().subscribe({
      next: (data: any) => {
        this.listaArticulos = data;
        this.cargarCartasProductos();
        console.log('Productos:', this.products);
      },
      error: (error) => {
        console.error('Error al cargar los artículos:', error);
      }
    });
  }

  cargarCartasProductos(): void {
    this.products = [];
    let i = 0;
    this.listaArticulos.forEach(e => {
      let product = this.products.find(product => product.idProducto === e.producto.idProducto);
      if (product === undefined) {
        i++;
        let tallas: string[] = [e.talla];
        let colores: string[] = [e.color];
        let articulos: string[] = [e.idArticulo];
        this.products.push({
          idProducto: e.producto.idProducto,
          subcategoria: e.producto.subcategoria,
          sexo: e.producto.sexo,
          name: e.producto.nombre,
          price: e.precio,
          imageUrl: 'https://via.placeholder.com/150',
          stock: 1,
          estados: e.estados.map((estado: any) => estado.nombre),
          color: colores,
          size: tallas,
          articulos: articulos,
          galeria: e.producto.galeria,
          marca: e.producto.marca
        });
        
      } else {
        product.stock += 1;
        if (!product.color.includes(e.color)) {
          product.color.push(e.color);
        }
        if (!product.size.includes(e.talla)) {
          product.size.push(e.talla);
        }
        product.articulos.push(e.idArticulo);
      }
      // Limitar a 10 productos
  this.products = this.products.slice(0, 10  );
  
    });
    
  }
  
  verProducto(product: ProductView): void {
    const sexoTransformado = product.sexo === 'H' ? 'men' : product.sexo === 'M' ? 'women' : product.sexo.toLowerCase();
    const categoriaTransformada = product.subcategoria.categoria.nombre.toLowerCase();
    const subcategoriaTransformada = product.subcategoria.nombre.toLowerCase();
    const nombreTransformado = product.name.toLowerCase();

    this.router.navigate(['/product', sexoTransformado, categoriaTransformada, subcategoriaTransformada, nombreTransformado]);
}

}
