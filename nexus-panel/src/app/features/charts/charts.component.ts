import { Component, signal } from '@angular/core';                                                                                                                                                                 
  import { CommonModule } from '@angular/common';
  import { BaseChartDirective } from 'ng2-charts';                                                                                                                                                                   
  import { ChartData, ChartOptions } from 'chart.js';
                                                                                                                                                                                                                     
  @Component({                                                                                                                                                                                                       
    selector: 'app-charts',                                                                                                                                                                                          
    standalone: true,                                                                                                                                                                                                
    imports: [CommonModule, BaseChartDirective],                                                                                                                                                                     
    template: `                                                                                                                                                                                                      
      <div class="space-y-6 animate-fade-in">                                                                                                                                                                        
        <div>                                                                                                                                                                                                        
          <h1 class="text-2xl font-bold text-primary">Charts</h1>                                                                                                                                                    
          <p class="text-muted text-sm mt-1">Chart.js integration with 6 chart types</p>                                                                                                                             
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">                                                                                                                                                          
                                                                                                                                                                                                                     
          <!-- Line Chart -->                                                                                                                                                                                        
          <div class="card">                                                                                                                                                                                         
            <div class="flex items-center justify-between mb-4">
              <div>                                                                                                                                                                                                  
                <h3 class="font-semibold text-primary">Line Chart</h3>
                <p class="text-xs text-muted">Multi-dataset with gradient fill</p>                                                                                                                                   
              </div>                                                                                                                                                                                                 
              <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer"                                                                                                      
                (click)="downloadChart('line')">⬇ PNG</button>                                                                                                                                                       
            </div>                                                                                                                                                                                                   
            <canvas id="line" baseChart [data]="lineData" [options]="lineOptions" type="line" height="120"></canvas>                                                                                                 
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Bar Chart -->                                                                                                                                                                                         
          <div class="card">                                                                                                                                                                                         
            <div class="flex items-center justify-between mb-4">                                                                                                                                                     
              <div>                                                                                                                                                                                                  
                <h3 class="font-semibold text-primary">Bar Chart</h3>
                <p class="text-xs text-muted">Grouped bars comparison</p>                                                                                                                                            
              </div>                                                                                                                                                                                                 
              <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer"                                                                                                      
                (click)="downloadChart('bar')">⬇ PNG</button>                                                                                                                                                        
            </div>                                                                                                                                                                                                   
            <canvas id="bar" baseChart [data]="barData" [options]="barOptions" type="bar" height="120"></canvas>                                                                                                     
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Horizontal Bar -->                                                                                                                                                                                    
          <div class="card">                                                                                                                                                                                         
            <div class="flex items-center justify-between mb-4">
              <div>                                                                                                                                                                                                  
                <h3 class="font-semibold text-primary">Horizontal Bar</h3>
                <p class="text-xs text-muted">Rankings & comparisons</p>                                                                                                                                             
              </div>                                                                                                                                                                                                 
            </div>                                                                                                                                                                                                   
            <canvas baseChart [data]="hBarData" [options]="hBarOptions" type="bar" height="120"></canvas>                                                                                                            
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Doughnut -->                                                                                                                                                                                          
          <div class="card">                                                                                                                                                                                         
            <div class="flex items-center justify-between mb-4">                                                                                                                                                     
              <div>                                                                                                                                                                                                  
                <h3 class="font-semibold text-primary">Doughnut Chart</h3>                                                                                                                                           
                <p class="text-xs text-muted">Part-to-whole relationships</p>                                                                                                                                        
              </div>                                                                                                                                                                                                 
            </div>                                                                                                                                                                                                   
            <div class="flex items-center gap-6">                                                                                                                                                                    
              <canvas baseChart [data]="doughnutData" [options]="doughnutOptions" type="doughnut" height="160" class="max-w-[200px]"></canvas>                                                                       
              <div class="space-y-2 flex-1">                                                                                                                                                                         
                @for (item of doughnutLegend; track item.label) {                                                                                                                                                    
                  <div class="flex items-center justify-between text-sm">                                                                                                                                            
                    <div class="flex items-center gap-2">                                                                                                                                                            
                      <div class="w-3 h-3 rounded-full" [style.background]="item.color"></div>
                      <span class="text-secondary">{{ item.label }}</span>                                                                                                                                           
                    </div>                                                                                                                                                                                           
                    <span class="font-semibold">{{ item.value }}%</span>                                                                                                                                             
                  </div>                                                                                                                                                                                             
                }                                                                                                                                                                                                    
              </div>                                                                                                                                                                                                 
            </div>                                                                                                                                                                                                   
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Radar -->                                                                                                                                                                                             
          <div class="card">              
            <div class="flex items-center justify-between mb-4">                                                                                                                                                     
              <div>                                                                                                                                                                                                  
                <h3 class="font-semibold text-primary">Radar Chart</h3>                                                                                                                                              
                <p class="text-xs text-muted">Multi-dimensional comparison</p>                                                                                                                                       
              </div>                                                                                                                                                                                                 
            </div>                                                                                                                                                                                                   
            <canvas baseChart [data]="radarData" [options]="radarOptions" type="radar" height="120"></canvas>                                                                                                        
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Polar Area -->                                                                                                                                                                                        
          <div class="card">                                                                                                                                                                                         
            <div class="flex items-center justify-between mb-4">                                                                                                                                                     
              <div>                                                                                                                                                                                                  
                <h3 class="font-semibold text-primary">Polar Area Chart</h3>                                                                                                                                         
                <p class="text-xs text-muted">Cyclic data visualization</p>                                                                                                                                          
              </div>                                                                                                                                                                                                 
            </div>                                                                                                                                                                                                   
            <canvas baseChart [data]="polarData" [options]="polarOptions" type="polarArea" height="120"></canvas>                                                                                                    
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
      </div>                                                                                                                                                                                                         
    `,            
  })
  export default class ChartsComponent {      
                                                                                                                                                                                                                     
    // ─── Line ────────────────────────────────────────────                                                                                                                                                         
    lineData: ChartData<'line'> = {                                                                                                                                                                                  
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],                                                                                                                             
      datasets: [                                                                                                                                                                                                    
        {                                                                                                                                                                                                            
          label: 'Revenue 2024',                                                                                                                                                                                     
          data: [32,48,38,62,55,78,65,88,72,94,85,105],                                                                                                                                                              
          borderColor: '#6366f1',                                                                                                                                                                                    
          backgroundColor: 'rgba(99,102,241,0.12)',                                                                                                                                                                  
          fill: true, tension: 0.4, pointRadius: 4,                                                                                                                                                                  
        },                                                                                                                                                                                                           
        {                                                                                                                                                                                                            
          label: 'Revenue 2023',                                                                                                                                                                                     
          data: [28,35,32,48,42,60,55,70,58,78,68,88],                                                                                                                                                               
          borderColor: '#94a3b8',                                                                                                                                                                                    
          backgroundColor: 'transparent',                                                                                                                                                                            
          borderDash: [6, 3], tension: 0.4, pointRadius: 3,                                                                                                                                                          
        },                                                                                                                                                                                                           
      ],                                                                                                                                                                                                             
    };                                                                                                                                                                                                               
    lineOptions: ChartOptions<'line'> = {                                                                                                                                                                            
      responsive: true,                                                                                                                                                                                              
      plugins: { legend: { position: 'top' } },                                                                                                                                                                      
      scales: { y: { beginAtZero: false } },  
    };                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    // ─── Bar ─────────────────────────────────────────────                                                                                                                                                         
    barData: ChartData<'bar'> = {                                                                                                                                                                                    
      labels: ['Q1','Q2','Q3','Q4'],                                                                                                                                                                                 
      datasets: [                                                                                                                                                                                                    
        { label: 'Product A', data: [42000,58000,53000,71000], backgroundColor: '#6366f1' },
        { label: 'Product B', data: [35000,47000,61000,55000], backgroundColor: '#06b6d4' },
        { label: 'Product C', data: [28000,32000,38000,44000], backgroundColor: '#10b981' },                                                                                                                         
      ],                                                                                                                                                                                                             
    };                                                                                                                                                                                                               
    barOptions: ChartOptions<'bar'> = {                                                                                                                                                                              
      responsive: true,                                                                                                                                                                                              
      plugins: { legend: { position: 'top' } },                                                                                                                                                                      
      scales: { y: { beginAtZero: true } },                                                                                                                                                                          
    };                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    // ─── Horizontal Bar ──────────────────────────────────                                                                                                                                                         
    hBarData: ChartData<'bar'> = {                                                                                                                                                                                   
      labels: ['React','Angular','Vue','Svelte','Next.js','Nuxt'],                                                                                                                                                   
      datasets: [{                                                                                                                                                                                                   
        label: 'Popularity Score',            
        data: [87, 72, 68, 54, 83, 61],                                                                                                                                                                              
        backgroundColor: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444'],                                                                                                                              
        borderRadius: 4,                                                                                                                                                                                             
      }],                                                                                                                                                                                                            
    };                                                                                                                                                                                                               
    hBarOptions: ChartOptions<'bar'> = {                                                                                                                                                                             
      indexAxis: 'y',                                                                                                                                                                                                
      responsive: true,                                                                                                                                                                                              
      plugins: { legend: { display: false } },                                                                                                                                                                       
      scales: { x: { beginAtZero: true, max: 100 } },                                                                                                                                                                
    };                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    // ─── Doughnut ────────────────────────────────────────                                                                                                                                                         
    doughnutLegend = [                                                                                                                                                                                               
      { label: 'Direct',   value: 35, color: '#6366f1' },                                                                                                                                                            
      { label: 'Organic',  value: 28, color: '#8b5cf6' },                                                                                                                                                            
      { label: 'Social',   value: 20, color: '#06b6d4' },                                                                                                                                                            
      { label: 'Email',    value: 12, color: '#10b981' },                                                                                                                                                            
      { label: 'Other',    value: 5,  color: '#f59e0b' },                                                                                                                                                            
    ];
    doughnutData: ChartData<'doughnut'> = {                                                                                                                                                                          
      labels: this.doughnutLegend.map(d => d.label),                                                                                                                                                                 
      datasets: [{                                                                                                                                                                                                   
        data: this.doughnutLegend.map(d => d.value),                                                                                                                                                                 
        backgroundColor: this.doughnutLegend.map(d => d.color),                                                                                                                                                      
        borderWidth: 0,                                                                                                                                                                                              
        hoverOffset: 6,                                                                                                                                                                                              
      }],                                                                                                                                                                                                            
    };                                                                                                                                                                                                               
    doughnutOptions: ChartOptions<'doughnut'> = {                                                                                                                                                                    
      responsive: true,                                                                                                                                                                                              
      cutout: '72%',                                                                                                                                                                                                 
      plugins: { legend: { display: false } },                                                                                                                                                                       
    };                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    // ─── Radar ───────────────────────────────────────────                                                                                                                                                         
    radarData: ChartData<'radar'> = {                                                                                                                                                                                
      labels: ['Speed','Reliability','Scalability','Security','Usability','Support'],                                                                                                                                
      datasets: [                                                                                                                                                                                                    
        {                                                                                                                                                                                                            
          label: 'Product A',                                                                                                                                                                                        
          data: [90, 85, 78, 92, 88, 75],                                                                                                                                                                            
          borderColor: '#6366f1',                                                                                                                                                                                    
          backgroundColor: 'rgba(99,102,241,0.15)',                                                                                                                                                                  
          pointBackgroundColor: '#6366f1',                                                                                                                                                                           
        },                                                                                                                                                                                                           
        {                                                                                                                                                                                                            
          label: 'Product B',                                                                                                                                                                                        
          data: [72, 90, 85, 70, 80, 92],                                                                                                                                                                            
          borderColor: '#10b981',                                                                                                                                                                                    
          backgroundColor: 'rgba(16,185,129,0.15)',                                                                                                                                                                  
          pointBackgroundColor: '#10b981',                                                                                                                                                                           
        },
        ],                                                                                                                                                                                                             
    };                                                                                                                                                                                                               
    radarOptions: ChartOptions<'radar'> = {                                                                                                                                                                          
      responsive: true,                                                                                                                                                                                              
      plugins: { legend: { position: 'top' } },                                                                                                                                                                      
      scales: { r: { beginAtZero: true, max: 100 } },
    };                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    // ─── Polar Area ──────────────────────────────────────                                                                                                                                                         
    polarData: ChartData<'polarArea'> = {                                                                                                                                                                            
      labels: ['Infrastructure','Marketing','R&D','Sales','Operations','HR'],                                                                                                                                        
      datasets: [{                                                                                                                                                                                                   
        data: [28, 18, 24, 15, 10, 5],        
        backgroundColor: [                                                                                                                                                                                           
          'rgba(99,102,241,0.7)', 'rgba(139,92,246,0.7)',                                                                                                                                                            
          'rgba(6,182,212,0.7)',  'rgba(16,185,129,0.7)',                                                                                                                                                            
          'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)',                                                                                                                                                             
        ],                                                                                                                                                                                                           
      }],                                                                                                                                                                                                            
    };                                                                                                                                                                                                               
    polarOptions: ChartOptions<'polarArea'> = {                                                                                                                                                                      
      responsive: true,                                                                                                                                                                                              
      plugins: { legend: { position: 'right' } },                                                                                                                                                                    
    };                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    downloadChart(id: string) {                                                                                                                                                                                      
      const canvas = document.getElementById(id) as HTMLCanvasElement;                                                                                                                                               
      if (!canvas) return;                                                                                                                                                                                           
      const a = document.createElement('a');                                                                                                                                                                         
      a.href = canvas.toDataURL('image/png');                                                                                                                                                                        
      a.download = `chart-${id}.png`;                                                                                                                                                                                
      a.click();                                                                                                                                                                                                     
    }                                                                                                                                                                                                                
  }
  