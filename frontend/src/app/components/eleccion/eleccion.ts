import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { EleccionService } from '../../services/eleccion.service';
import { ResultadoElectoralResponse } from '../../model/resultado-electoral-response';

Chart.register(...registerables);

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

@Component({
  selector: 'app-eleccion',
  imports: [CommonModule],
  templateUrl: './eleccion.html',
  styleUrl: './eleccion.css',
})
export class Eleccion implements OnInit, OnDestroy {
  private eleccionService = inject(EleccionService);
  private charts: Chart[] = [];

  loading = true;
  error = '';

  ngOnInit(): void {
    this.eleccionService.getResultados().subscribe({
      next: (data) => {
        this.loading = false;
        if (!data || data.length === 0) {
          this.error = 'No hay resultados electorales disponibles.';
          return;
        }
        setTimeout(() => this.renderCharts(data));
      },
      error: (err) => {
        this.loading = false;
        this.error = `Error al cargar los datos: ${err.message}`;
      },
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  private renderCharts(data: ResultadoElectoralResponse[]): void {
    const labels = data.map((r) => `${r.candidato} (${r.partido})`);
    const backgroundColors = COLORS.slice(0, data.length);

    this.createBarChart('chartNacionales', labels, data.map((r) => r.votosNacionales), backgroundColors);
    this.createBarChart('chartExtranjero', labels, data.map((r) => r.votosExtranjero), backgroundColors);
    this.createBarChart('chartTotal', labels, data.map((r) => r.totalVotos), backgroundColors);
  }

  private createBarChart(id: string, labels: string[], values: number[], colors: string[]): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.toLocaleString()} votos`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (v) => Number(v).toLocaleString(),
            },
          },
          y: {
            ticks: {
              font: { size: 11 },
            },
          },
        },
      },
    });
    this.charts.push(chart);
  }
}
