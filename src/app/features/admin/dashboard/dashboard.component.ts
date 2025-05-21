import { Component } from '@angular/core';
import { UsuariosChartComponent } from "./usuarios-chart/usuarios-chart.component";

@Component({
  selector: 'app-dashboard',
  imports: [UsuariosChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
