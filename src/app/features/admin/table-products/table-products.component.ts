import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../core/service/products/products.service';
import { Producto } from '../../../Interfaces/interfaces-globales';

@Component({
  selector: 'app-table-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-products.component.html',
  styleUrl: './table-products.component.css'
})
export class TableProductsComponent {

    products: Producto[] = [];
    displayedProducts: Producto[] = [];
    page: number = 1;
    limit: number = 10; 
    total: number = 0;
    loading = false;
    editingProduct: Producto | null = null;
    search: string = '';   

  constructor(private productsService: ProductsService, private router: Router) {}

  ngOnInit(): void {
      this.loadProducts();      // Es mejor llamar a loadUsers() que tiene manejo de errores
    }
  
  verDetalle(product: Producto) {
    this.router.navigate(['/admin/products/', product.idProducto]);
  }
  
    goToPage(p: number) {
      this.page = p;
      this.updateDisplayedProducts();
    }
  
    loadProducts() {
      this.loading = true;
      this.productsService.obtenerProductos().subscribe({
        next: (res: Producto[] | { products: Producto[] }) => {
          // Verificar la estructura de la respuesta
          if (Array.isArray(res)) {
            this.products = res;
          } else if (res && (res as any).products && Array.isArray((res as any).products)) {
            this.products = (res as any).products;
          } else {
            this.products = [];
            console.error('Formato de respuesta inesperado:', res);
          }
          
          this.total = this.products.length;
          this.updateDisplayedProducts();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.loading = false;
        }
      });
    }
  
    updateDisplayedProducts() {
      // Aplicar búsqueda si existe
      let filteredProducts = this.products;
      if (this.search && this.search.trim() !== '') {
        const searchTerm = this.search.toLowerCase();
        filteredProducts = this.products.filter(product => 
          product.nombre.toLowerCase().includes(searchTerm)
        );
      }
      
      // Actualizar total después de filtrar
      this.total = filteredProducts.length;
      
      // Aplicar paginación
      const start = (this.page - 1) * this.limit;
      const end = start + this.limit;
      this.displayedProducts = filteredProducts.slice(start, end);
    }
  
    searchProducts() {
      this.page = 1;
      this.updateDisplayedProducts(); // Solo necesitamos actualizar la vista, no recargar
    }
  
    deleteProduct(product: Producto): void {
    console.log(product.idProducto);  // Aquí está el id correcto
    if (confirm(`¿Seguro que quieres eliminar ${product.nombre}?`)) {
      this.productsService.deleteProduct(product.idProducto).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.idProducto !== product.idProducto);
          this.displayedProducts = [...this.products];
          alert('Producto eliminado');
        },
        error: () => alert('Error al eliminar el producto')
      });
    }
  }
  
    startEdit(product: Producto) {
      this.editingProduct = { ...product };
    }
  
    cancelEdit() {
      this.editingProduct = null;
    }
  
    get totalPages(): number[] {
      if (!this.products.length || !this.limit) return [];
      const count = Math.ceil(this.total / this.limit);
      return Array.from({ length: count }, (_, i) => i + 1);
    }
}
