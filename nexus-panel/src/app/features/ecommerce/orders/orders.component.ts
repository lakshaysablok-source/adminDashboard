import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

interface Order {
  id: string;
  customer: string;
  initials: string;
  avatarBg: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled' | 'pending';
  payment: 'paid' | 'pending' | 'refunded';
  method: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatMenuModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Orders</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">{{ filtered().length }} orders</p>
        </div>
        <div class="flex gap-2">
          <button style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">file_download</mat-icon> Export
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        @for (s of stats; track s.label) {
          <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
            <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0" [style.background]="s.color + '18'">
              <mat-icon style="font-size:22px;width:22px;height:22px" [style.color]="s.color">{{ s.icon }}</mat-icon>
            </div>
            <div>
              <p style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">{{ s.label }}</p>
              <p style="font-size:20px;font-weight:800;color:var(--text-primary)">{{ s.value }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Filters -->
      <div class="card" style="padding:14px">
        <div class="flex items-center gap-3 flex-wrap">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:200px;padding:8px 12px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated)">
            <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">search</mat-icon>
            <input [(ngModel)]="search" placeholder="Search orders, customers…" style="border:none;background:transparent;outline:none;font-size:13px;color:var(--text-primary);flex:1;font-family:inherit">
          </div>
          <div class="status-tabs">
            @for (t of tabs; track t.value) {
              <button class="tab-btn" [class.active]="activeTab()===t.value" (click)="activeTab.set(t.value)">
                {{ t.label }}
                <span class="tab-count">{{ tabCount(t.value) }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--bg-elevated)">
              <th class="th">Order</th>
              <th class="th">Customer</th>
              <th class="th">Date</th>
              <th class="th">Items</th>
              <th class="th">Total</th>
              <th class="th">Payment</th>
              <th class="th">Status</th>
              <th class="th"></th>
            </tr>
          </thead>
          <tbody>
            @for (o of filtered(); track o.id) {
              <tr class="tr" [routerLink]="['/ecommerce/order-detail']">
                <td class="td">
                  <span style="font-size:13px;font-weight:700;color:var(--accent-500)">#{{ o.id }}</span>
                </td>
                <td class="td">
                  <div class="flex items-center gap-2">
                    <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0" [style.background]="o.avatarBg">{{ o.initials }}</div>
                    <div>
                      <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ o.customer }}</p>
                      <p style="font-size:11px;color:var(--text-muted)">{{ o.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="td"><span style="font-size:12px;color:var(--text-secondary)">{{ o.date }}</span></td>
                <td class="td"><span style="font-size:12px;color:var(--text-secondary)">{{ o.items }} items</span></td>
                <td class="td"><span style="font-size:13px;font-weight:700;color:var(--text-primary)">\${{ o.total.toFixed(2) }}</span></td>
                <td class="td">
                  <div style="display:flex;flex-direction:column;gap:2px">
                    <span class="pay-badge pay-{{ o.payment }}">{{ o.payment }}</span>
                    <span style="font-size:10px;color:var(--text-muted)">{{ o.method }}</span>
                  </div>
                </td>
                <td class="td"><span class="order-badge order-{{ o.status }}">{{ o.status }}</span></td>
                <td class="td" (click)="$event.stopPropagation()">
                  <button [matMenuTriggerFor]="oMenu" style="border:none;background:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px">
                    <mat-icon style="font-size:16px;width:16px;height:16px">more_vert</mat-icon>
                  </button>
                  <mat-menu #oMenu="matMenu">
                    <button mat-menu-item [routerLink]="['/ecommerce/order-detail']"><mat-icon>visibility</mat-icon> View</button>
                    <button mat-menu-item><mat-icon>print</mat-icon> Print Invoice</button>
                    <button mat-menu-item style="color:#ef4444"><mat-icon style="color:#ef4444">cancel</mat-icon> Cancel Order</button>
                  </mat-menu>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <!-- Pagination -->
        <div style="display:flex;align-items:center;justify-content:between;padding:14px 16px;border-top:1px solid var(--border-default)">
          <span style="font-size:12px;color:var(--text-muted)">Showing {{ filtered().length }} of {{ orders.length }} orders</span>
          <div style="display:flex;gap:4px;margin-left:auto">
            @for (p of [1,2,3,4,5]; track p) {<button style="width:30px;height:30px;border-radius:6px;border:1px solid var(--border-default);cursor:pointer;font-size:12px" [style.background]="p===1 ? 'var(--accent-500)' : 'transparent'" [style.color]="p===1 ? '#fff' : 'var(--text-secondary)'">{{ p }}</button>
            }
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .status-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
    .tab-btn {
      padding: 6px 12px; border-radius: 8px; border: 1px solid transparent;
      background: transparent; cursor: pointer; font-size: 12px; font-weight: 500;
      color: var(--text-secondary); display: flex; align-items: center; gap: 5px;
      transition: all 150ms;
      &:hover { background: var(--bg-elevated); }
      &.active { background: var(--accent-50); color: var(--accent-700); border-color: var(--accent-200, var(--accent-100)); font-weight: 600; }
    }
    .tab-count { font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 9999px; background: var(--bg-elevated); color: var(--text-muted); border: 1px solid var(--border-default); }
    .th { padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border-default); white-space: nowrap; }
    .td { padding: 12px 14px; border-bottom: 1px solid var(--border-default); }
    .tr { transition: background 120ms; cursor: pointer; &:hover { background: var(--bg-elevated); } &:last-child td { border-bottom: none; } }
    .order-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 9999px; text-transform: capitalize;
      &.order-delivered  { background: rgba(34,197,94,.12);  color: #22c55e; }
      &.order-shipped    { background: rgba(59,130,246,.12);  color: #3b82f6; }
      &.order-processing { background: rgba(245,158,11,.12); color: #f59e0b; }
      &.order-pending    { background: rgba(148,163,184,.12); color: #94a3b8; }
      &.order-cancelled  { background: rgba(239,68,68,.12);  color: #ef4444; }
    }
    .pay-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; text-transform: capitalize;
      &.pay-paid     { background: rgba(34,197,94,.12);  color: #22c55e; }
      &.pay-pending  { background: rgba(245,158,11,.12); color: #f59e0b; }
      &.pay-refunded { background: rgba(239,68,68,.12);  color: #ef4444; }
    }
  `],
})
export default class OrdersComponent {
  search = '';
  activeTab = signal('all');

  tabs = [
    { label: 'All',        value: 'all'        },
    { label: 'Pending',    value: 'pending'     },
    { label: 'Processing', value: 'processing'  },
    { label: 'Shipped',    value: 'shipped'     },
    { label: 'Delivered',  value: 'delivered'   },
    { label: 'Cancelled',  value: 'cancelled'   },
  ];

  stats = [
    { label: 'Total Orders',   value: '1,248', icon: 'shopping_bag',    color: '#6366f1' },
    { label: 'Delivered',      value: '842',   icon: 'local_shipping',  color: '#22c55e' },
    { label: 'Processing',     value: '156',   icon: 'autorenew',       color: '#f59e0b' },
    { label: 'Cancelled',      value: '48',    icon: 'cancel',          color: '#ef4444' },
  ];

  orders: Order[] = [
    { id:'ORD-5521', customer:'Alice Summers',   initials:'AS', avatarBg:'#6366f1', email:'alice@email.com',   date:'Jun 10, 2024', items:3, total:487.50, status:'delivered',  payment:'paid',    method:'Visa •• 4242' },
    { id:'ORD-5520', customer:'Ryan Kim',        initials:'RK', avatarBg:'#10b981', email:'ryan@email.com',    date:'Jun 10, 2024', items:1, total:299.99, status:'shipped',    payment:'paid',    method:'Mastercard •• 1234' },
    { id:'ORD-5519', customer:'Julia Morgan',    initials:'JM', avatarBg:'#ef4444', email:'julia@email.com',   date:'Jun 9, 2024',  items:5, total:834.00, status:'processing', payment:'paid',    method:'PayPal' },
    { id:'ORD-5518', customer:'Sam Rivera',      initials:'SR', avatarBg:'#8b5cf6', email:'sam@email.com',     date:'Jun 9, 2024',  items:2, total:189.00, status:'pending',    payment:'pending', method:'Bank Transfer' },
    { id:'ORD-5517', customer:'Mark Chen',       initials:'MC', avatarBg:'#f59e0b', email:'mark@email.com',    date:'Jun 8, 2024',  items:4, total:612.45, status:'delivered',  payment:'paid',    method:'Visa •• 9012' },
    { id:'ORD-5516', customer:'Priya Patel',     initials:'PP', avatarBg:'#06b6d4', email:'priya@email.com',   date:'Jun 8, 2024',  items:1, total:89.00,  status:'cancelled',  payment:'refunded',method:'Visa •• 5678' },
    { id:'ORD-5515', customer:'David Wilson',    initials:'DW', avatarBg:'#3b82f6', email:'david@email.com',   date:'Jun 7, 2024',  items:6, total:1240.00,status:'delivered',  payment:'paid',    method:'Amex •• 3456' },
    { id:'ORD-5514', customer:'Emma Johnson',    initials:'EJ', avatarBg:'#22c55e', email:'emma@email.com',    date:'Jun 7, 2024',  items:2, total:345.98, status:'shipped',    payment:'paid',    method:'Stripe' },
    { id:'ORD-5513', customer:'Tom Bradley',     initials:'TB', avatarBg:'#f43f5e', email:'tom@email.com',     date:'Jun 6, 2024',  items:1, total:549.00, status:'processing', payment:'paid',    method:'Visa •• 7890' },
    { id:'ORD-5512', customer:'Lisa Park',       initials:'LP', avatarBg:'#a855f7', email:'lisa@email.com',    date:'Jun 6, 2024',  items:3, total:224.97, status:'delivered',  payment:'paid',    method:'PayPal' },
  ];

  filtered = computed(() => {
    let list = this.orders;
    if (this.activeTab() !== 'all') list = list.filter(o => o.status === this.activeTab());
    if (this.search) list = list.filter(o =>
      o.customer.toLowerCase().includes(this.search.toLowerCase()) ||
      o.id.toLowerCase().includes(this.search.toLowerCase())
    );
    return list;
  });

  tabCount(val: string) {
    if (val === 'all') return this.orders.length;
    return this.orders.filter(o => o.status === val).length;
  }
}