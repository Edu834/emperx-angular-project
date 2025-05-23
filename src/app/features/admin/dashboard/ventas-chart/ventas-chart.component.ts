import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { OrdersService } from '../../../../core/service/orders/orders.service';

@Component({
  selector: 'app-ventas-chart',
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './ventas-chart.component.html',
  styleUrl: './ventas-chart.component.css'
})
export class VentasChartComponent {
  Highcharts: typeof Highcharts = Highcharts;

  // Datos de ejemplo para el gráfico
    chartOptions: Highcharts.Options = {
    chart: {
      type: 'line'  // Cambia a 'bar' si prefieres un gráfico de barras
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: [], // Aquí van los días del mes
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Sales'
      }
    },
    series: [{
      name: 'Sales',
      type: 'line',
      data: [2, 3, 5, 7, 6, 4, 3]
    }]
  };

    constructor(private ordersService: OrdersService) {}
  
    totalPedidosMes: number = 0;

    ngOnInit() {
  this.ordersService.pedidosByFecha().subscribe(data => {
    // Filtramos los pedidos para el mes actual
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son 0-indexed
    const currentYear = currentDate.getFullYear();
    console.log(data);
    data = data.filter(d => {
      const fecha = new Date(d.fecha);
      return fecha.getMonth() + 1 === currentMonth && fecha.getFullYear() === currentYear;
    });
    console.log(data);
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
    this.totalPedidosMes = data.reduce((acc) => acc + 1, 0);
  });
}
}
