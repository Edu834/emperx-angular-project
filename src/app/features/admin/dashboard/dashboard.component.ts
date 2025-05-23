import { Component } from '@angular/core';
import { UsuariosChartComponent } from "./usuarios-chart/usuarios-chart.component";
import { VentasChartComponent } from "./ventas-chart/ventas-chart.component";

@Component({
  selector: 'app-dashboard',
  imports: [UsuariosChartComponent, VentasChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
