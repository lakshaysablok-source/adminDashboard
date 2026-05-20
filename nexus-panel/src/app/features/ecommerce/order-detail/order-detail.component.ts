import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2 text-sm">
          <a routerLink="/ecommerce/orders" style="color:var(--text-muted);text-decoration:none" class="hover:underline">Orders</a>
          <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">chevron_right</mat-icon>
          <span class="font-semibold text-primary">#ORD-5521</span>
          <span class="order-badge order-delivered">Delivered</span>
        </div>
        <div class="flex gap-2">
          <button style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">print</mat-icon> Print
          </button>
          <button style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            <mat-icon style="font-size:16px;width:16px;height:16px">receipt_long</mat-icon> Invoice
          </button>
        </div>
      </div>

      <div class="order-layout">

        <!-- Left -->
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:16px">

          <!-- Order items -->
          <div class="card">
            <h3 class="section-title">Order Items <span style="color:var(--text-muted);font-weight:400">(3 items)</span></h3>
            @for (item of items; track item.name) {
              <div class="order-item">
                <div style="width:56px;height:56px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0" [style.background]="item.img">
                  <mat-icon style="font-size:24px;width:24px;height:24px;color:rgba(255,255,255,.6)">inventory_2</mat-icon>
                </div>
                <div style="flex:1;min-width:0">
                  <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ item.name }}</p>
                  <p style="font-size:11px;color:var(--text-muted);margin-top:2px">SKU: {{ item.sku }} · {{ item.variant }}</p>
                </div>
                <div style="text-align:right">
                  <p style="font-size:13px;font-weight:700;color:var(--text-primary)">\${{ (item.price * item.qty).toFixed(2) }}</p>
                  <p style="font-size:11px;color:var(--text-muted)">\${{ item.price }} × {{ item.qty }}</p>
                </div>
              </div>
            }
            <div style="border-top:1px solid var(--border-default);margin-top:16px;padding-top:16px">
              <div class="total-row"><span>Subtotal</span><span>\$437.98</span></div>
              <div class="total-row"><span>Shipping</span><span style="color:#22c55e">Free</span></div>
              <div class="total-row"><span>Tax (10%)</span><span>\$43.80</span></div>
              <div class="total-row" style="font-size:15px;font-weight:800;color:var(--text-primary);border-top:1px solid var(--border-default);padding-top:12px;margin-top:4px">
                <span>Total</span><span style="color:var(--accent-500)">\$481.78</span>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="card">
            <h3 class="section-title">Order Timeline</h3>
            <div class="timeline">
              @for (t of timeline; track t.title; let last = $last) {
                <div class="timeline-item" [class.done]="t.done">
                  <div class="timeline-dot" [style.background]="t.done ? '#22c55e' : 'var(--border-default)'">
                    <mat-icon style="font-size:12px;width:12px;height:12px;color:#fff">{{ t.done ? 'check' : 'circle' }}</mat-icon>
                  </div>
                  @if (!last) { <div class="timeline-line" [style.background]="t.done ? '#22c55e' : 'var(--border-default)'"></div> }
                  <div style="padding-bottom:20px">
                    <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ t.title }}</p>
                    <p style="font-size:11px;color:var(--text-muted);margin-top:2px">{{ t.desc }}</p>
                    <p style="font-size:11px;color:var(--text-muted);margin-top:1px">{{ t.time }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- Right -->
        <div style="width:300px;flex-shrink:0;display:flex;flex-direction:column;gap:16px">

          <!-- Customer -->
          <div class="card">
            <h3 class="section-title">Customer</h3>
            <div class="flex items-center gap-3 mb-4">
              <div style="width:44px;height:44px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0">AS</div>
              <div>
                <p style="font-size:14px;font-weight:700;color:var(--text-primary)">Alice Summers</p>
                <p style="font-size:12px;color:var(--text-muted)">alice&#64;email.com</p>
              </div>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);line-height:2">
              <div class="flex justify-between"><span style="color:var(--text-muted)">Phone</span><span>+1 (555) 234-5678</span></div>
              <div class="flex justify-between"><span style="color:var(--text-muted)">Total orders</span><span>14 orders</span></div>
              <div class="flex justify-between"><span style="color:var(--text-muted)">Total spent</span><span style="font-weight:600;color:var(--accent-500)">\$3,240</span></div>
            </div>
          </div>

          <!-- Shipping address -->
          <div class="card">
            <h3 class="section-title">Shipping Address</h3>
            <p style="font-size:13px;font-weight:600;color:var(--text-primary)">Alice Summers</p>
            <p style="font-size:12px;color:var(--text-muted);line-height:1.8;margin-top:4px">
              742 Evergreen Terrace<br>
              Springfield, IL 62701<br>
              United States
            </p>
            <div style="margin-top:10px;padding:8px 12px;border-radius:8px;background:var(--bg-elevated);display:flex;align-items:center;gap:8px">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--accent-500)">local_shipping</mat-icon>
              <div>
                <p style="font-size:11px;font-weight:600;color:var(--text-primary)">DHL Express</p>
                <p style="font-size:10px;color:var(--text-muted)">Tracking: DHL-8473628190</p>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="card">
            <h3 class="section-title">Payment</h3>
            <div style="display:flex;align-items:center;gap:10px;padding:12px;border-radius:8px;background:var(--bg-elevated)">
              <div style="width:36px;height:24px;border-radius:4px;background:#1a1f71;display:flex;align-items:center;justify-content:center">
                <span style="font-size:9px;font-weight:800;color:#fff">VISA</span>
              </div>
              <div>
                <p style="font-size:12px;font-weight:600;color:var(--text-primary)">•••• •••• •••• 4242</p>
                <p style="font-size:11px;color:var(--text-muted)">Expires 09/26</p>
              </div>
              <span style="margin-left:auto;font-size:11px;font-weight:700;padding:2px 8px;border-radius:9999px;background:rgba(34,197,94,.12);color:#22c55e">Paid</span>
            </div>
          </div>

          <!-- Note -->
          <div class="card">
            <h3 class="section-title">Order Note</h3>
            <textarea rows="3" placeholder="Add a note…" style="width:100%;border:1px solid var(--border-default);border-radius:8px;padding:8px 12px;font-size:12px;font-family:inherit;background:var(--bg-elevated);color:var(--text-primary);outline:none;resize:none;box-sizing:border-box">Please leave at door. Ring bell twice.</textarea>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-layout { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .section-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }

    .order-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 9999px; text-transform: capitalize;
      &.order-delivered { background: rgba(34,197,94,.12); color: #22c55e; }
    }

    .order-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border-default); &:last-of-type { border-bottom: none; } }

    .total-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); padding: 6px 0; }

    .timeline { position: relative; padding-left: 28px; }
    .timeline-item { position: relative; display: flex; gap: 12px; }
    .timeline-dot { position: absolute; left: -28px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; top: 2px; }
    .timeline-line { position: absolute; left: -19px; top: 22px; width: 2px; height: calc(100% - 10px); border-radius: 2px; }
  `],
})
export default class OrderDetailComponent {
  items = [
    { name: 'Wireless Noise-Cancelling Headphones', sku: 'ELC-001', variant: 'Black / M', price: 299.99, qty: 1, img: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { name: 'Organic Cotton T-Shirt Set',           sku: 'CLT-004', variant: 'White / L', price: 59.99,  qty: 2, img: 'linear-gradient(135deg,#10b981,#06b6d4)' },
    { name: 'Vitamin C Face Serum',                 sku: 'BTY-009', variant: '30ml',       price: 45.00,  qty: 2, img: 'linear-gradient(135deg,#f43f5e,#f59e0b)' },
  ];

  timeline = [
    { title: 'Order Placed',      desc: 'Order #ORD-5521 confirmed',       time: 'Jun 10, 2024 · 09:14 AM', done: true  },
    { title: 'Payment Verified',  desc: 'Visa •• 4242 charged \$481.78',   time: 'Jun 10, 2024 · 09:15 AM', done: true  },
    { title: 'Processing',        desc: 'Items picked from warehouse',      time: 'Jun 10, 2024 · 02:30 PM', done: true  },
    { title: 'Shipped',           desc: 'DHL Express · DHL-8473628190',    time: 'Jun 11, 2024 · 10:00 AM', done: true  },
    { title: 'Out for Delivery',  desc: 'With courier in Springfield',      time: 'Jun 13, 2024 · 08:45 AM', done: true  },
    { title: 'Delivered',         desc: 'Left at door as requested',        time: 'Jun 13, 2024 · 02:20 PM', done: true  },
  ];
}