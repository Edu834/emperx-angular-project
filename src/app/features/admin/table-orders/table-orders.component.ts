import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../../../core/service/orders/orders.service';

@Component({
  selector: 'app-table-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-orders.component.html',
  styleUrl: './table-orders.component.css'
})
export class TableOrdersComponent {

  orders: any[] = [];
  displayedOrders: any[] = [];
  page: number = 1;
  limit: number = 10; 
  total: number = 0;
  loading = false;
  editingOrder: any | null = null;
  search: string = '';   

  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
        this.loadOrders();      // Es mejor llamar a loadUsers() que tiene manejo de errores
      }
    
    verDetalle(order: any) {
      this.router.navigate(['/admin/orders/', order.idProducto]);
    }
    
      goToPage(p: number) {
        this.page = p;
        this.updateDisplayedOrders();
      }
    
      loadOrders() {
        this.loading = true;
        this.ordersService.listarPedidosTodo().subscribe({
          next: (res) => {
            // Verificar la estructura de la respuesta
            if (Array.isArray(res)) {
              this.orders = res;
              console.log('Pedidos:', this.orders);
            } else if (res && (res as any).orders && Array.isArray((res as any).orders)) {
              this.orders = (res as any).orders;
            } else {
              this.orders = [];
              console.error('Formato de respuesta inesperado:', res);
            }
            
            this.total = this.orders.length;
            this.updateDisplayedOrders();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar pedidos:', err);
            this.loading = false;
          }
        });
      }
    
      updateDisplayedOrders() {
        // Aplicar búsqueda si existe
        let filteredOrders = this.orders;
        if (this.search && this.search.trim() !== '') {
          const searchTerm = this.search.toLowerCase();
          filteredOrders = this.orders.filter(order => 
            order.usuario.username.toLowerCase().includes(searchTerm)
          );
        }
        
        // Actualizar total después de filtrar
        this.total = filteredOrders.length;
        
        // Aplicar paginación
        const start = (this.page - 1) * this.limit;
        const end = start + this.limit;
        this.displayedOrders = filteredOrders.slice(start, end);
      }
    
      searchOrders() {
        this.page = 1;
        this.updateDisplayedOrders(); // Solo necesitamos actualizar la vista, no recargar
      }
    
      deleteOrder(order: any): void {
      console.log(order.idPedido);  // Aquí está el id correcto
      if (confirm(`¿Seguro que quieres eliminar este pedido`)) {
        this.ordersService.deleteOrder(order.idPedido).subscribe({
          next: () => {
            this.orders = this.orders.filter(p => p.idPedido !== order.idPedido);
            this.displayedOrders = [...this.orders];
            alert('Pedido eliminado');
          },
          error: () => alert('Error al eliminar el pedido' +  order.idPedido)
        });
      }
    }
    
      startEdit(order: any) {
        this.editingOrder = { ...order };
      }
    
      cancelEdit() {
        this.editingOrder = null;
      }
    
      get totalPages(): number[] {
        if (!this.orders.length || !this.limit) return [];
        const count = Math.ceil(this.total / this.limit);
        return Array.from({ length: count }, (_, i) => i + 1);
      }

}
