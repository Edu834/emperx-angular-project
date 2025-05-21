import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

// Asume que tu servicio ya está creado y exportado

import { UserService } from '../../../../core/service/user/user.service';

@Component({
  selector: 'app-usuarios-chart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  template: `
  <div class="bg-white w-full h-full flex items-center flex-col shadow-md rounded-md p-3">
    <div class="flex justify-between w-full px-2 mb-4">
      <div>
        <p class="text-3xl"><strong>Customers</strong> </p>
        <p>THIS MONTH</p>
      </div>
      
      <p class="text-4xl">{{ totalUsuariosMes }}</p>
    </div>
    
 
    

<highcharts-chart
  [Highcharts]="Highcharts"
  [options]="chartOptions"
  class="w-full"
  style="  display: block;"
></highcharts-chart>
</div>
  `
})
export class UsuariosChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line'  // Línea, puedes cambiar a 'bar' o 'column' si quieres
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: [], // Aquí van las fechas (días del mes)
      title: {
        text: 'Días'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: ' usuarios'
    },
    series: [
      {
        type: 'line',
        name: 'Usuarios nuevos',
        data: [] // Aquí van las cantidades
      }
    ]
  };

  constructor(private userService: UserService) {}

  totalUsuariosMes: number = 0;

ngOnInit() {
  this.userService.obtenerUsuariosPorDia().subscribe(data => {
    // Actualizamos la gráfica
    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        categories: data.map(d => d.fecha),
        title: { text: 'Días' }
      },
      series: [{
        type: 'line',
        name: 'Usuarios nuevos',
        data: data.map(d => d.cantidad)
      }]
    };

    // Sumamos el total de usuarios para este mes
    this.totalUsuariosMes = data.reduce((acc, cur) => acc + cur.cantidad, 0);
  });
}
}
