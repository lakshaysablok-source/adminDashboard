import { Component, inject, OnInit, signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { BaseChartDirective } from 'ng2-charts';
  import { ChartConfiguration } from 'chart.js';
  import { MockDataService } from '../../core/services/mock-data.service';

  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    template: `
      <div class="space-y-6 animate-fade-in">
        <!-- Page Title -->
        <div>
          <h1 class="text-2xl font-bold text-primary">Dashboard</h1>
          <p class="text-muted text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          @for (stat of stats(); track stat.label; let i = $index) {
            <div class="card" [style.animation-delay]="i * 80 + 'ms'" style="animation: slideInUp 0.4s ease forwards; opacity:0">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-sm text-muted">{{ stat.label }}</p>
                  <p class="text-2xl font-bold text-primary mt-1">{{ stat.value }}</p>
                </div>
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  [style.background]="'var(--accent-50)'" [style.color]="'var(--accent-600)'">
                  {{ stat.icon }}
                </div>
              </div>
              <div class="flex items-center gap-1 text-sm">
                <span [class]="stat.delta > 0 ? 'text-green-500' : 'text-red-500'">
                  {{ stat.delta > 0 ? '↑' : '↓' }} {{ stat.delta | number:'1.1-1' }}%
                </span>
                <span class="text-muted">vs last month</span>
              </div>
            </div>
          }
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <!-- Revenue Chart -->
          <div class="card xl:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-primary">Revenue Overview</h3>
                <p class="text-xs text-muted">Current year vs previous year</p>
              </div>
              <span class="badge badge-accent">2024</span>
            </div>
            @if (revenueChart()) {
              <div class="chart-container" style="height:240px">
                <canvas baseChart
                  [data]="revenueChart()!"
                  [options]="lineChartOptions"
                  type="line">
                </canvas>
              </div>
            } @else {
              <div class="skeleton h-40 w-full"></div>
            }
          </div>

          <!-- Traffic Doughnut -->
          <div class="card">
            <div class="mb-4">
              <h3 class="font-semibold text-primary">Traffic Sources</h3>
              <p class="text-xs text-muted">By channel this month</p>
            </div>
            @if (trafficChart()) {
              <div class="chart-container" style="height:200px">
                <canvas baseChart
                  [data]="trafficChart()!"
                  [options]="doughnutOptions"
                  type="doughnut">
                </canvas>
              </div>
              <div class="mt-4 space-y-2">
                @for (source of trafficSources(); track source.label) {
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-2.5 h-2.5 rounded-full" [style.background]="source.color"></div>
                      <span class="text-secondary">{{ source.label }}</span>
                    </div>
                    <span class="font-medium">{{ source.pct }}%</span>
                  </div>
                }
              </div>
            } @else {
              <div class="skeleton h-48 w-full"></div>
            }
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-primary">Recent Transactions</h3>
            <button class="text-sm text-accent-600 hover:underline">View all</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left pb-3 text-muted font-medium">ID</th>
                  <th class="text-left pb-3 text-muted font-medium">Customer</th>
                  <th class="text-left pb-3 text-muted font-medium">Amount</th>
                  <th class="text-left pb-3 text-muted font-medium">Status</th>
                  <th class="text-left pb-3 text-muted font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of transactions(); track tx.id) {
                  <tr class="border-b border-border/50 hover:bg-elevated transition-colors">
                    <td class="py-3 font-mono text-accent-600">{{ tx.id }}</td>
                    <td class="py-3 font-medium">{{ tx.user }}</td>
                    <td class="py-3 font-semibold">{{ tx.amount }}</td>
                    <td class="py-3">
                      <span class="badge"
                        [class.badge-success]="tx.status === 'completed'"
                        [class.badge-warning]="tx.status === 'pending'"
                        [class.badge-danger]="tx.status === 'failed'">
                        {{ tx.status }}
                      </span>
                    </td>
                    <td class="py-3 text-muted">{{ tx.date }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,
  })
  export default class DashboardComponent implements OnInit {
    private data = inject(MockDataService);

    stats = signal<any[]>([]);
    revenueChart = signal<ChartConfiguration<'line'>['data'] | null>(null);
    trafficChart = signal<ChartConfiguration<'doughnut'>['data'] | null>(null);
    trafficSources = signal<any[]>([]);
    transactions = signal<any[]>([]);

    lineChartOptions: ChartConfiguration<'line'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: false } },
      elements: { line: { tension: 0.4 } },
    };

    doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: '70%',
    };

    ngOnInit() {
      this.data.getStats().subscribe(s => {
        this.stats.set([
          { label: 'Total Revenue',    value: s.revenue.value,    delta: s.revenue.delta,    icon: '💰' },
          { label: 'Total Users',      value: s.users.value,      delta: s.users.delta,      icon: '👥' },
          { label: 'Active Sessions',  value: s.sessions.value,   delta: s.sessions.delta,   icon: '📡' },
          { label: 'Conversion Rate',  value: s.conversion.value, delta: s.conversion.delta, icon: '📈' },
        ]);
      });

      this.data.getRevenueChart().subscribe(d => {
        this.revenueChart.set({
          labels: d.labels,
          datasets: [
            { label: '2024', data: d.current,  borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.1)', fill: true },
            { label: '2023', data: d.previous, borderColor: '#94a3b8', backgroundColor: 'transparent',          borderDash: [5,5] },
          ],
        });
      });

      this.data.getTrafficSources().subscribe(d => {
        const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];
        this.trafficChart.set({
          labels: d.labels,
          datasets: [{ data: d.data, backgroundColor: colors, borderWidth: 0 }],
        });
        this.trafficSources.set(d.labels.map((l: string, i: number) => ({
          label: l, pct: d.data[i], color: colors[i],
        })));
      });

      this.data.getTransactions().subscribe(t => this.transactions.set(t));
    }
  }