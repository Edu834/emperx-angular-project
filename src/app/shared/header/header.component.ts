import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToggleMenuComponent } from './toggle-menu/toggle-menu.component';
import { AuthService } from '../../core/service/auth/auth.service';
import { UserService } from '../../core/service/user/user.service';
import { User } from '../../core/service/user/user';


import { ProductsService } from '../../core/service/products/products.service';
import { Articulo, Categoria, Subcategoria } from '../../Interfaces/interfaces-globales';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ToggleMenuComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  name = '';
  error?: string;
  
  text: string = 'WELCOME TO EMPERX!';
  texts: string[] = ['RETURNS AND EXCHANGES FREE OF SHIPPING CHARGES', 'FREE STANDARD SHIPPING WITH SUBSCRIPTION'];
  currentIndex: number = 0;
  fade: boolean = false;

  showComponent = false;
  width = '0%';

  lastScrollTop = 0;
  isHeaderVisible = true;

  // Estructura para el menú dinámico
  menuData: Record<string, Record<string, Set<string>>> = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    // Rotación de textos
    setInterval(() => {
      this.fade = true;
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        this.text = this.texts[this.currentIndex];
        this.fade = false;
      }, 500);
    }, 30000);

    // Auth y datos usuario
    if (sessionStorage.getItem('token')) {
  const token = sessionStorage.getItem('token')!;
  const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del JWT
  const role = payload.role; // Extrae el rol
  console.log('Rol del usuario:', role);
}


    this.userService.getAuthenticatedUser().subscribe({
      next: data => {
        if (data) this.name = data.firstname;
        else this.error = 'No se pudo obtener la información del usuario.';
      },
      error: err => {
        this.error = 'Error al cargar la información del usuario.';
        console.error(err);
      }
    });

    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });

    // Obtener artículos y generar menú dinámico
    this.productsService.listArticulos().subscribe({
      next: (articulos: Articulo[]) => {
        console.log("Artículos recibidos de la API:", articulos);
        
        if (!articulos || articulos.length === 0) {
          console.warn("No se recibieron artículos de la API.");
          return;
        }
        
        // Construimos la estructura de menú para todos los artículos
        this.menuData = this.buildMenuData(articulos);
        console.log('Menú dinámico generado:', this.menuData);
      },
      error: (err) => {
        console.error('Error al cargar artículos:', err);
        this.error = 'No se pudieron cargar los productos';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleComponent() {
    this.showComponent = !this.showComponent;
    this.width = this.showComponent ? '100%' : '0%';
  }

  handleCloseMenu() {
    this.showComponent = false;
    this.width = '0%';
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    this.isHeaderVisible = currentScroll <= this.lastScrollTop || currentScroll < 50;
    this.lastScrollTop = Math.max(0, currentScroll);
  }

  // Mapear códigos de sexo a categorías en inglés para las rutas
  mapSexoToCategory(sexo: string): string {
    // Mapear valores de sexo a las categorías que usamos en las rutas (en minúsculas)
    switch (sexo.toUpperCase()) {
      case 'H':
        return 'men';
      case 'M':
        return 'women';
      case 'U':
        return 'unisex';
      default:
        return sexo.toLowerCase(); // Mantener el valor si ya está en el formato esperado
    }
  }

  // Normalizar texto para URLs (minúsculas y reemplazar espacios por guiones)
  normalizeForUrl(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  // Procesamiento dinámico de artículos a estructura para el menú
  buildMenuData(articulos: Articulo[]): Record<string, Record<string, Set<string>>> {
    const data: Record<string, Record<string, Set<string>>> = {};
    
    console.log(`Procesando ${articulos.length} artículos`);
    
    for (let i = 0; i < articulos.length; i++) {
      const art = articulos[i];
      
      // Verificar la estructura completa del objeto
      if (!art.producto) {
        console.warn(`Artículo ${i} no tiene propiedad 'producto'`);
        continue;
      }
      
      if (!art.producto.sexo) {
        console.warn(`Artículo ${i} no tiene propiedad 'sexo'`);
        continue;
      }
      
      if (!art.producto.subcategoria) {
        console.warn(`Artículo ${i} no tiene propiedad 'subcategoria'`);
        continue;
      }
      
      if (!art.producto.subcategoria.categoria) {
        console.warn(`Artículo ${i} no tiene propiedad 'categoria' en 'subcategoria'`);
        continue;
      }
      
      // Mapear el código de sexo (H/M/U) a la categoría en inglés (men/women/unisex)
      const sexo = this.mapSexoToCategory(art.producto.sexo);
      
      // Normalizar categoría y subcategoría para URLs (minúsculas)
      const categoria = art.producto.subcategoria.categoria.nombre;
      const subcategoria = art.producto.subcategoria.nombre;
      
      // Guardamos los valores originales para mostrar en el menú
      const categoriaDisplay = categoria;
      const subcategoriaDisplay = subcategoria;
      
      // Valores normalizados para URLs
      const categoriaUrl = this.normalizeForUrl(categoria);
      const subcategoriaUrl = this.normalizeForUrl(subcategoria);
      
      console.log(`Artículo procesado: sexo=${sexo}, categoria=${categoriaDisplay} (${categoriaUrl}), subcategoria=${subcategoriaDisplay} (${subcategoriaUrl})`);
      
      // Validamos que tenemos categoría y subcategoría
      if (categoria && subcategoria) {
        // Inicializamos la estructura si no existe
        if (!data[sexo]) data[sexo] = {};
        if (!data[sexo][categoriaUrl]) {
          data[sexo][categoriaUrl] = new Set();
          // Almacenamos el nombre de visualización junto con la URL
          (data[sexo][categoriaUrl] as any).displayName = categoriaDisplay;
        }
        
        // Agregamos la subcategoría (como un objeto con nombre de visualización y URL)
        data[sexo][categoriaUrl].add(subcategoriaUrl);
        // Almacenamos el nombre de visualización para esta subcategoría
        (data[sexo][categoriaUrl] as any)[subcategoriaUrl] = subcategoriaDisplay;
      }
    }

    return data;
  }

  // Métodos auxiliares para acceder al menú dinámico en el HTML
  getCategories(sexo: string): string[] {
    return this.menuData[sexo] ? Object.keys(this.menuData[sexo]) : [];
  }

  getCategoryDisplayName(sexo: string, categoria: string): string {
    if (this.menuData[sexo] && this.menuData[sexo][categoria] && (this.menuData[sexo][categoria] as any).displayName) {
      return (this.menuData[sexo][categoria] as any).displayName;
    }
    return categoria; // Fallback al valor normalizado si no hay nombre de visualización
  }

  getSubcategories(sexo: string, categoria: string): string[] {
    if (this.menuData[sexo] && this.menuData[sexo][categoria]) {
      return Array.from(this.menuData[sexo][categoria]);
    }
    return [];
  }

  getSubcategoryDisplayName(sexo: string, categoria: string, subcategoria: string): string {
    if (this.menuData[sexo] && this.menuData[sexo][categoria] && (this.menuData[sexo][categoria] as any)[subcategoria]) {
      return (this.menuData[sexo][categoria] as any)[subcategoria];
    }
    return subcategoria; // Fallback al valor normalizado si no hay nombre de visualización
  }
}