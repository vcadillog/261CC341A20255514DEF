import { Component, OnInit, OnDestroy, inject, signal, afterNextRender, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { EleccionService } from '../../services/eleccion.service';
import { ResultadoElectoralResponse } from '../../model/resultado-electoral-response';

Chart.register(...registerables);

const GRAY = '#b0b0b0';


const percentPlugin = {
  id: 'percentLabels',
  afterDraw(chart: Chart) {
    const { ctx, data } = chart;
    const meta = chart.getDatasetMeta(0);
    const total = (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
    if (total === 0) return;
    ctx.save();
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    meta.data.forEach((arc: any, i: number) => {
      if (i !== 0) return;
      const angle = (arc.startAngle + arc.endAngle) / 2;
      const x = arc.x + Math.cos(angle) * (arc.outerRadius * 0.6);
      const y = arc.y + Math.sin(angle) * (arc.outerRadius * 0.6);
      const pct = ((data.datasets[0].data as number[])[i] / total * 100).toFixed(3);
      ctx.fillText(`${pct}%`, x, y);
    });
    ctx.restore();
  },
};

const PIE_COLOR = '#3498db';

@Component({
  selector: 'app-eleccion',
  imports: [CommonModule],
  templateUrl: './eleccion.html',
  styleUrl: './eleccion.css',
})
export class Eleccion implements OnInit, OnDestroy {
  private eleccionService = inject(EleccionService);
  private injector = inject(Injector);
  private charts: Chart[] = [];
  private data: ResultadoElectoralResponse[] = [];

  loading = signal(true);
  error = signal('');
  activeTab = signal('todos');
  leftName = signal('');
  leftParty = signal('');
  leftVotes = signal(0);
  rightName = signal('');
  rightParty = signal('');
  rightVotes = signal(0);

  ngOnInit(): void {
    this.eleccionService.getResultados().subscribe({
      next: (data) => {
        this.loading.set(false);
        if (!data || data.length === 0) {
          this.error.set('No hay resultados electorales disponibles.');
          return;
        }
        this.data = data;
        afterNextRender(() => this.renderActiveCharts(), { injector: this.injector });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(`Error al cargar los datos: ${err.message}`);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  switchTab(tab: string): void {
    this.activeTab.set(tab);
    this.destroyCharts();
    afterNextRender(() => this.renderActiveCharts(), { injector: this.injector });
  }

  private destroyCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  private renderActiveCharts(): void {
    if (this.data.length < 2) return;

    const a = this.data[0];
    const b = this.data[1];

    let valA: number;
    let valB: number;
    switch (this.activeTab()) {
      case 'peru':
        valA = a.votosNacionales;
        valB = b.votosNacionales;
        break;
      case 'extranjero':
        valA = a.votosExtranjero;
        valB = b.votosExtranjero;
        break;
      case 'todos':
      default:
        valA = a.totalVotos;
        valB = b.totalVotos;
        break;
    }

    const winner = valA >= valB ? a : b;
    const loser = valA >= valB ? b : a;
    const winVal = Math.max(valA, valB);
    const loseVal = Math.min(valA, valB);

    this.leftName.set(winner.candidato);
    this.leftParty.set(winner.partido);
    this.leftVotes.set(winVal);
    this.rightName.set(loser.candidato);
    this.rightParty.set(loser.partido);
    this.rightVotes.set(loseVal);

    this.createPieChart('chartA', `${winner.candidato} (${winner.partido})`, winVal, loseVal, PIE_COLOR);
    this.createPieChart('chartB', `${loser.candidato} (${loser.partido})`, loseVal, winVal, PIE_COLOR);
  }

  private createPieChart(id: string, label: string, ownValue: number, otherValue: number, ownColor: string): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = ownValue + otherValue;
    const pct = total > 0 ? ((ownValue / total) * 100).toFixed(1) : '0';

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [`${label}: ${ownValue.toLocaleString()} (${pct}%)`, `Resto: ${otherValue.toLocaleString()} votos`],
        datasets: [
          {
            data: [ownValue, otherValue],
            backgroundColor: [ownColor, GRAY],
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed.toLocaleString()} votos`,
            },
          },
        },
      },
      plugins: [percentPlugin],
    });
    this.charts.push(chart);
  }
}
