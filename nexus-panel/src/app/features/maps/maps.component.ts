import {
  Component, AfterViewInit, OnDestroy, signal, computed, ChangeDetectionStrategy, ElementRef, ViewChild, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  users: number;
  revenue: number;
  type: 'office' | 'partner' | 'user';
}

@Component({
  selector: 'app-maps',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="space-y-4 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-primary">Maps</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">
            Global user distribution · {{ markers.length }} tracked locations
          </p>
        </div>
        <div class="flex gap-2">
          <button mat-stroked-button (click)="setLayer('street')"
            [style.background]="activeLayer() === 'street' ? 'var(--accent-100)' : 'transparent'"
            [style.border-color]="activeLayer() === 'street' ? 'var(--accent-500)' : 'var(--border-default)'"
            [style.color]="activeLayer() === 'street' ? 'var(--accent-700)' : 'var(--text-secondary)'">
            Street
          </button>
          <button mat-stroked-button (click)="setLayer('satellite')"
            [style.background]="activeLayer() === 'satellite' ? 'var(--accent-100)' : 'transparent'"
            [style.border-color]="activeLayer() === 'satellite' ? 'var(--accent-500)' : 'var(--border-default)'"
            [style.color]="activeLayer() === 'satellite' ? 'var(--accent-700)' : 'var(--text-secondary)'">
            Satellite
          </button>
          <button mat-stroked-button (click)="fitBounds()"
            style="border-color:var(--border-default);color:var(--text-secondary)">
            <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px">fit_screen</mat-icon>
            Fit All
          </button>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (stat of stats; track stat.label) {
          <div class="card text-center">
            <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
            <div class="text-xs mt-0.5" style="color:var(--text-muted)">{{ stat.label }}</div>
          </div>
        }
      </div>

      <!-- Map + Sidebar -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">

        <!-- Map -->
        <div class="card !p-0 overflow-hidden xl:col-span-3" style="height: 500px">
          <div #mapEl style="width:100%;height:100%"></div>
        </div>

        <!-- Locations list -->
        <div class="card overflow-y-auto" style="height:500px">
          <h3 class="font-semibold text-primary mb-3 sticky top-0 pb-2"
            style="background:var(--bg-surface);border-bottom:1px solid var(--border-default)">
            Locations
          </h3>
          <div class="space-y-2 mt-2">
            @for (m of markers; track m.id) {
              <div class="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-elevated"
                [style.border]="selectedId() === m.id ? '1px solid var(--accent-500)' : '1px solid transparent'"
                [style.background]="selectedId() === m.id ? 'var(--accent-50)' : ''"
                (click)="selectMarker(m)">
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2 h-2 rounded-full flex-shrink-0"
                    [style.background]="colorFor(m.type)"></span>
                  <span class="text-sm font-medium text-primary">{{ m.city }}</span>
                  <span class="text-xs ml-auto" style="color:var(--text-muted)">{{ m.country }}</span>
                </div>
                <div class="flex gap-3 text-xs" style="color:var(--text-muted)">
                  <span>{{ m.users | number }} users</span>
                  <span>$ {{ m.revenue | number }}</span>
                </div>
              </div>
            }
          </div>
          <!-- Legend -->
          <div class="mt-4 pt-3" style="border-top:1px solid var(--border-default)">
            <p class="text-xs font-medium text-primary mb-2">Legend</p>
            <div class="space-y-1.5">
              @for (l of legend; track l.label) {
                <div class="flex items-center gap-2 text-xs" style="color:var(--text-secondary)">
                  <span class="w-2.5 h-2.5 rounded-full" [style.background]="l.color"></span>
                  {{ l.label }}
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
})
export default class MapsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private mapInstance: any = null;
  private tileLayer: any = null;

  activeLayer = signal<'street' | 'satellite'>('street');
  selectedId  = signal<string | null>(null);

  markers: MapMarker[] = [
    { id: 'm1', lat:  40.71, lng: -74.01, city: 'New York',    country: 'US',  users: 12400, revenue: 84200, type: 'office'  },
    { id: 'm2', lat:  51.51, lng:  -0.13, city: 'London',      country: 'UK',  users:  9800, revenue: 67400, type: 'office'  },
    { id: 'm3', lat:  48.85, lng:   2.35, city: 'Paris',       country: 'FR',  users:  6200, revenue: 43100, type: 'partner' },
    { id: 'm4', lat:  52.52, lng:  13.40, city: 'Berlin',      country: 'DE',  users:  5100, revenue: 38900, type: 'partner' },
    { id: 'm5', lat:  35.68, lng: 139.69, city: 'Tokyo',       country: 'JP',  users:  8700, revenue: 61500, type: 'office'  },
    { id: 'm6', lat: -33.87, lng: 151.21, city: 'Sydney',      country: 'AU',  users:  3400, revenue: 26800, type: 'user'    },
    { id: 'm7', lat:  19.08, lng:  72.88, city: 'Mumbai',      country: 'IN',  users:  7600, revenue: 29400, type: 'partner' },
    { id: 'm8', lat: -23.55, lng: -46.63, city: 'São Paulo',   country: 'BR',  users:  4200, revenue: 18700, type: 'user'    },
    { id: 'm9', lat:  55.75, lng:  37.62, city: 'Moscow',      country: 'RU',  users:  2900, revenue: 14200, type: 'user'    },
    { id:'m10', lat:  31.23, lng: 121.47, city: 'Shanghai',    country: 'CN',  users:  9300, revenue: 52100, type: 'partner' },
    { id:'m11', lat:  1.35,  lng: 103.82, city: 'Singapore',   country: 'SG',  users:  4800, revenue: 39200, type: 'office'  },
    { id:'m12', lat: -26.20, lng:  28.04, city: 'Johannesburg',country: 'ZA',  users:  1800, revenue:  8900, type: 'user'    },
  ];

  stats = [
    { label: 'Total Users',   value: (this.markers.reduce((s, m) => s + m.users, 0) / 1000).toFixed(0) + 'k' },
    { label: 'Total Revenue', value: '$' + (this.markers.reduce((s, m) => s + m.revenue, 0) / 1000).toFixed(0) + 'k' },
    { label: 'Countries',     value: new Set(this.markers.map(m => m.country)).size.toString() },
    { label: 'Locations',     value: this.markers.length.toString() },
  ];

  legend = [
    { label: 'Office',  color: 'var(--accent-500)' },
    { label: 'Partner', color: '#f59e0b' },
    { label: 'User',    color: '#22c55e' },
  ];

  colorFor(type: MapMarker['type']): string {
    return { office: 'var(--accent-500)', partner: '#f59e0b', user: '#22c55e' }[type];
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const L = await import('leaflet');

    // Fix default icon paths broken in bundlers
    (L as any).Icon.Default.mergeOptions({
      iconRetinaUrl: '',
      iconUrl: '',
      shadowUrl: '',
    });

    this.mapInstance = L.map(this.mapEl.nativeElement, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
    });

    this.applyTileLayer(L, 'street');

    this.markers.forEach(m => {
      const color = { office: '#6366f1', partner: '#f59e0b', user: '#22c55e' }[m.type];
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
          <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
                fill="${color}" opacity="0.95"/>
          <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
        </svg>`;
      const icon = L.divIcon({
        html: svg, className: '', iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -36],
      });
      const popup = `
        <div style="font-family:Inter,sans-serif;min-width:140px">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px">${m.city}, ${m.country}</div>
          <div style="font-size:11px;color:#64748b;line-height:1.6">
            <div>👥 ${m.users.toLocaleString()} users</div>
            <div>💰 $${m.revenue.toLocaleString()}</div>
            <div style="display:inline-block;margin-top:4px;padding:1px 8px;border-radius:12px;
                        background:${color}22;color:${color};font-size:10px;font-weight:500;text-transform:capitalize">
              ${m.type}
            </div>
          </div>
        </div>`;
      L.marker([m.lat, m.lng], { icon }).addTo(this.mapInstance).bindPopup(popup);
    });
  }

  private applyTileLayer(L: any, layer: 'street' | 'satellite') {
    if (this.tileLayer) this.mapInstance.removeLayer(this.tileLayer);
    const url = layer === 'street'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const attr = layer === 'street'
      ? '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      : '© <a href="https://www.esri.com">Esri</a>';
    this.tileLayer = L.tileLayer(url, { attribution: attr, maxZoom: 18 }).addTo(this.mapInstance);
  }

  async setLayer(layer: 'street' | 'satellite') {
    this.activeLayer.set(layer);
    if (!this.mapInstance) return;
    const L = await import('leaflet');
    this.applyTileLayer(L, layer);
  }

  selectMarker(m: MapMarker) {
    this.selectedId.set(m.id);
    if (this.mapInstance) {
      this.mapInstance.flyTo([m.lat, m.lng], 5, { duration: 1 });
    }
  }

  fitBounds() {
    if (!this.mapInstance) return;
    this.mapInstance.flyTo([20, 0], 2, { duration: 1 });
    this.selectedId.set(null);
  }

  ngOnDestroy() {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }
}