import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../../core/service/products/products.service';
import { Producto } from '../../../../Interfaces/interfaces-globales';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

    product: Producto = {} as Producto;
    editing = false;
    editedProduct: Producto = {} as Producto;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.productsService.getProductById(id).subscribe({
          next: (data) => {
            if (data) {
              this.product = data;
            }
          },
          error: (err) => {
            console.error('Error al obtener el producto:', err);
          }
        });
      }
    }
  
    deleteProduct(): void {
      if (!this.product?.idProducto) return;
  
      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        this.productsService.deleteProduct(this.product.idProducto).subscribe({
          next: () => {
            alert('Producto eliminado con éxito');
            this.router.navigate(['/admin/products']);
          },
          error: (error) => {
            alert('Error al eliminar el producto');
            console.error(error);
          }
        });
      }
    }
  
    startEdit(): void {
      this.editedProduct = { ...this.product };
      this.editing = true;
    }
  
    cancelEdit(): void {
      this.editing = false;
      this.editedProduct = {} as Producto;
    }
  
    saveUser(): void {
      if (!this.editedProduct || !this.product?.idProducto) return;
  
      this.productsService.updateProduct(this.product.idProducto, this.editedProduct).subscribe({
        next: (updatedProduct) => {
          this.product = updatedProduct;
          this.editing = false;
          this.editedProduct = {} as Producto;
          alert('Producto actualizado correctamente');
        },
        error: (error) => {
          alert('Error al actualizar el usuario');
          console.error(error);
        }
      });
    }

}
