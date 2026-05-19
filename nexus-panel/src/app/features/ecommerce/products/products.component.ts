import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  image: string;
  sales: number;
  rating: number;
  sku: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatMenuModule, MatButtonModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Products</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">
            {{ filtered().length }} products
          </p>
        </div>
        <div class="flex gap-2">
          <button style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">file_download</mat-icon> Export
          </button>
          <button [routerLink]="['/ecommerce/product-detail']" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            <mat-icon style="font-size:16px;width:16px;height:16px">add</mat-icon> Add Product
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        @for (s of stats; track s.label) {
          <div class="card" style="padding:16px">
            <p style="font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">{{ s.label }}</p>
            <p style="font-size:24px;font-weight:800;color:var(--text-primary);margin-top:4px">{{ s.value }}</p>
            <p style="font-size:11px;margin-top:4px" [style.color]="s.up ? '#22c55e' : '#ef4444'">
              <span>{{ s.up ? '▲' : '▼' }} {{ s.change }}</span>
              <span style="color:var(--text-muted)"> vs last month</span>
            </p>
          </div>
        }
      </div>

      <!-- Filters & search -->
      <div class="card" style="padding:14px">
        <div class="flex items-center gap-3 flex-wrap">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:200px;padding:8px 12px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated)">
            <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">search</mat-icon>
            <input [(ngModel)]="search" placeholder="Search products…" style="border:none;background:transparent;outline:none;font-size:13px;color:var(--text-primary);flex:1;font-family:inherit">
          </div>
          <select [(ngModel)]="catFilter" class="filter-select">
            <option value="">All Categories</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
          </select>
          <select [(ngModel)]="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <div class="flex gap-1">
            <button class="view-btn" [class.active]="view()==='grid'" (click)="view.set('grid')">
              <mat-icon style="font-size:18px;width:18px;height:18px">grid_view</mat-icon>
            </button>
            <button class="view-btn" [class.active]="view()==='list'" (click)="view.set('list')">
              <mat-icon style="font-size:18px;width:18px;height:18px">view_list</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Grid view -->
      @if (view() === 'grid') {
        <div class="products-grid">
          @for (p of filtered(); track p.id) {
            <div class="product-card">
              <div class="product-img-wrap">
                <div class="product-img" [style.background]="p.image">
                  <mat-icon style="font-size:40px;width:40px;height:40px;color:rgba(255,255,255,.6)">inventory_2</mat-icon>
                </div>
                <span class="status-chip status-{{ p.status }}">{{ p.status }}</span>
                <button [matMenuTriggerFor]="pMenu" (click)="$event.stopPropagation()" class="product-menu-btn">
                  <mat-icon style="font-size:18px;width:18px;height:18px">more_vert</mat-icon>
                </button>
                <mat-menu #pMenu="matMenu">
                  <button mat-menu-item [routerLink]="['/ecommerce/product-detail']"><mat-icon>edit</mat-icon> Edit</button>
                  <button mat-menu-item><mat-icon>content_copy</mat-icon> Duplicate</button>
                  <button mat-menu-item style="color:#ef4444"><mat-icon style="color:#ef4444">delete</mat-icon> Delete</button>
                </mat-menu>
              </div>
              <div style="padding:14px">
                <p style="font-size:10px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em">{{ p.category }}</p>
                <p style="font-size:14px;font-weight:700;color:var(--text-primary);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ p.name }}</p>
                <div class="flex items-center gap-1 mt-1">
                  @for (s of stars(p.rating); track $index) {
                    <mat-icon style="font-size:12px;width:12px;height:12px;color:#f59e0b">{{ s }}</mat-icon>
                  }
                  <span style="font-size:11px;color:var(--text-muted);margin-left:2px">{{ p.rating }}</span>
                </div>
                <div class="flex items-center justify-between mt-3">
                  <span style="font-size:18px;font-weight:800;color:var(--accent-500)">\${{ p.price.toFixed(2) }}</span>
                  <span style="font-size:11px;padding:3px 8px;border-radius:6px" [style.background]="p.stock < 10 ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)'" [style.color]="p.stock < 10 ? '#ef4444' : '#22c55e'">
                    {{ p.stock < 10 ? 'Low: ' : 'Stock: ' }}{{ p.stock }}
                  </span>
                </div>
                <p style="font-size:11px;color:var(--text-muted);margin-top:6px">{{ p.sales }} sales · SKU: {{ p.sku }}</p>
              </div>
            </div>
          }
        </div>
      }

      <!-- List view -->
      @if (view() === 'list') {
        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg-elevated)">
                <th class="th">Product</th>
                <th class="th">Category</th>
                <th class="th">Price</th>
                <th class="th">Stock</th>
                <th class="th">Sales</th>
                <th class="th">Status</th>
                <th class="th"></th>
              </tr>
            </thead>
            <tbody>
              @for (p of filtered(); track p.id) {
                <tr class="tr">
                  <td class="td">
                    <div class="flex items-center gap-3">
                      <div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0" [style.background]="p.image">
                        <mat-icon style="font-size:20px;width:20px;height:20px;color:rgba(255,255,255,.7)">inventory_2</mat-icon>
                      </div>
                      <div>
                        <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ p.name }}</p>
                        <p style="font-size:11px;color:var(--text-muted)">{{ p.sku }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="td"><span style="font-size:12px;color:var(--text-secondary)">{{ p.category }}</span></td>
                  <td class="td"><span style="font-size:13px;font-weight:700;color:var(--accent-500)">\${{ p.price.toFixed(2) }}</span></td>
                  <td class="td">
                    <span style="font-size:12px;padding:3px 8px;border-radius:6px" [style.background]="p.stock < 10 ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)'" [style.color]="p.stock < 10 ? '#ef4444' : '#22c55e'">{{ p.stock }}</span>
                  </td>
                  <td class="td"><span style="font-size:12px;color:var(--text-secondary)">{{ p.sales }}</span></td>
                  <td class="td"><span class="status-chip status-{{ p.status }}">{{ p.status }}</span></td>
                  <td class="td">
                    <button [matMenuTriggerFor]="listMenu" style="border:none;background:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px">
                      <mat-icon style="font-size:16px;width:16px;height:16px">more_vert</mat-icon>
                    </button>
                    <mat-menu #listMenu="matMenu">
                      <button mat-menu-item [routerLink]="['/ecommerce/product-detail']"><mat-icon>edit</mat-icon> Edit</button>
                      <button mat-menu-item><mat-icon>content_copy</mat-icon> Duplicate</button>
                      <button mat-menu-item style="color:#ef4444"><mat-icon style="color:#ef4444">delete</mat-icon> Delete</button>
                    </mat-menu>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

    </div>
  `,
  styles: [`
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

    .product-card {
      background: var(--bg-surface); border: 1px solid var(--border-default);
      border-radius: 12px; overflow: hidden;
      transition: box-shadow 200ms ease, transform 200ms ease;
      &:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); transform: translateY(-2px); }
    }

    .product-img-wrap { position: relative; }
    .product-img {
      height: 160px; display: flex; align-items: center; justify-content: center;
    }

    .status-chip {
      position: absolute; top: 8px; left: 8px;
      font-size: 10px; font-weight: 700; padding: 3px 8px;
      border-radius: 9999px; text-transform: capitalize;
      &.status-active   { background: rgba(34,197,94,.15);  color: #22c55e; }
      &.status-draft    { background: rgba(245,158,11,.15); color: #f59e0b; }
      &.status-archived { background: rgba(148,163,184,.15); color: #94a3b8; }
    }

    .product-menu-btn {
      position: absolute; top: 6px; right: 6px;
      border: none; background: rgba(0,0,0,.3); color: #fff;
      border-radius: 6px; width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; opacity: 0; transition: opacity 150ms;
    }
    .product-card:hover .product-menu-btn { opacity: 1; }

    .filter-select {
      padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border-default); background: var(--bg-elevated);
      color: var(--text-primary); font-size: 13px; font-family: inherit;
      outline: none; cursor: pointer;
    }
    .view-btn {
      width: 34px; height: 34px; border-radius: 8px;
      border: 1px solid var(--border-default); background: transparent;
      cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center;
      &.active { background: var(--accent-50); color: var(--accent-600); border-color: var(--accent-500); }
    }
    .th { padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border-default); }
    .td { padding: 12px 14px; border-bottom: 1px solid var(--border-default); }
    .tr { transition: background 120ms; cursor: pointer; &:hover { background: var(--bg-elevated); } &:last-child td { border-bottom: none; } }
  `],
})
export default class ProductsComponent {
  search = '';
  catFilter = '';
  statusFilter = '';
  view = signal<'grid' | 'list'>('grid');

  categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'];

  stats = [
    { label: 'Total Products', value: '248',    change: '12 new',  up: true  },
    { label: 'Total Revenue',  value: '$84.2K', change: '8.4%',    up: true  },
    { label: 'Avg. Rating',    value: '4.6★',   change: '0.2',     up: true  },
    { label: 'Low Stock',      value: '14',     change: '3 items', up: false },
  ];

  products: Product[] = [
    { id:'p1',  name:'Wireless Noise-Cancelling Headphones', category:'Electronics',   price:299.99, stock:45,  status:'active',   image:'linear-gradient(135deg,#6366f1,#8b5cf6)', sales:1240, rating:4.8, sku:'ELC-001' },
    { id:'p2',  name:'Premium Leather Sneakers',            category:'Clothing',       price:189.00, stock:28,  status:'active',   image:'linear-gradient(135deg,#f59e0b,#ef4444)', sales:876,  rating:4.6, sku:'CLT-002' },
    { id:'p3',  name:'Smart Home Security Camera',          category:'Electronics',    price:149.99, stock:62,  status:'active',   image:'linear-gradient(135deg,#06b6d4,#6366f1)', sales:654,  rating:4.7, sku:'ELC-003' },
    { id:'p4',  name:'Organic Cotton T-Shirt Set',          category:'Clothing',       price:59.99,  stock:8,   status:'active',   image:'linear-gradient(135deg,#10b981,#06b6d4)', sales:2100, rating:4.5, sku:'CLT-004' },
    { id:'p5',  name:'Bamboo Yoga Mat Pro',                 category:'Sports',         price:89.00,  stock:33,  status:'active',   image:'linear-gradient(135deg,#22c55e,#10b981)', sales:430,  rating:4.9, sku:'SPT-005' },
    { id:'p6',  name:'4K Ultra HD Monitor 27"',             category:'Electronics',    price:549.00, stock:5,   status:'active',   image:'linear-gradient(135deg,#3b82f6,#6366f1)', sales:312,  rating:4.7, sku:'ELC-006' },
    { id:'p7',  name:'Minimalist Desk Lamp',                category:'Home & Garden',  price:79.99,  stock:50,  status:'draft',    image:'linear-gradient(135deg,#f59e0b,#fbbf24)', sales:0,    rating:0,   sku:'HMG-007' },
    { id:'p8',  name:'JavaScript Deep Dive Book',           category:'Books',          price:39.99,  stock:120, status:'active',   image:'linear-gradient(135deg,#8b5cf6,#6366f1)', sales:890,  rating:4.8, sku:'BKS-008' },
    { id:'p9',  name:'Vitamin C Face Serum',                category:'Beauty',         price:45.00,  stock:75,  status:'active',   image:'linear-gradient(135deg,#f43f5e,#f59e0b)', sales:1560, rating:4.6, sku:'BTY-009' },
    { id:'p10', name:'Mechanical Keyboard RGB',             category:'Electronics',    price:129.99, stock:3,   status:'active',   image:'linear-gradient(135deg,#06b6d4,#10b981)', sales:720,  rating:4.5, sku:'ELC-010' },
    { id:'p11', name:'Insulated Water Bottle 1L',           category:'Sports',         price:34.99,  stock:200, status:'active',   image:'linear-gradient(135deg,#3b82f6,#06b6d4)', sales:3400, rating:4.9, sku:'SPT-011' },
    { id:'p12', name:'Vintage Denim Jacket',                category:'Clothing',       price:145.00, stock:0,   status:'archived', image:'linear-gradient(135deg,#64748b,#334155)', sales:245,  rating:4.3, sku:'CLT-012' },
  ];

  filtered = computed(() => {
    let list = this.products;
    if (this.catFilter)    list = list.filter(p => p.category === this.catFilter);
    if (this.statusFilter) list = list.filter(p => p.status === this.statusFilter);
    if (this.search)       list = list.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
    return list;
  });

  stars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? 'star' : 'star_border');
  }
}