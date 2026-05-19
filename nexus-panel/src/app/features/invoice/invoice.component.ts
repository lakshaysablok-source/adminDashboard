import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface LineItem {
  description: string;
  qty: number;
  rate: number;
}

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Page header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Invoice</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">Manage and send invoices</p>
        </div>
        <div class="flex gap-2">
          <button (click)="print()" style="
            display:flex;align-items:center;gap:6px;padding:8px 14px;
            border-radius:8px;border:1px solid var(--border-default);
            background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px;font-weight:500">
            <mat-icon style="font-size:16px;width:16px;height:16px">print</mat-icon>
            Print
          </button>
          <button style="
            display:flex;align-items:center;gap:6px;padding:8px 14px;
            border-radius:8px;border:none;background:var(--accent-500);
            cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            <mat-icon style="font-size:16px;width:16px;height:16px">send</mat-icon>
            Send Invoice
          </button>
        </div>
      </div>

      <!-- Invoice list + detail layout -->
      <div class="invoice-layout">

        <!-- Invoice list -->
        <div style="width:280px;flex-shrink:0">
          <div class="card" style="padding:0;overflow:hidden">
            @for (inv of invoiceList; track inv.id) {
              <div class="inv-list-item" [class.active]="selectedInv === inv.id" (click)="selectedInv = inv.id">
                <div class="flex items-start justify-between mb-1">
                  <span style="font-size:13px;font-weight:700;color:var(--text-primary)">#{{ inv.id }}</span>
                  <span class="badge badge-{{ inv.statusClass }}">{{ inv.status }}</span>
                </div>
                <p style="font-size:12px;color:var(--text-secondary)">{{ inv.client }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span style="font-size:13px;font-weight:600;color:var(--text-primary)">\${{ inv.amount.toLocaleString() }}</span>
                  <span style="font-size:11px;color:var(--text-muted)">{{ inv.date }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Invoice detail -->
        <div class="card invoice-paper" id="invoice-print">

          <!-- Status banner -->
          <div class="inv-status-bar badge-{{ currentInvoice().statusClass }}">
            <mat-icon style="font-size:16px;width:16px;height:16px">{{ currentInvoice().statusIcon }}</mat-icon>
            {{ currentInvoice().status }}
          </div>

          <!-- Header -->
          <div class="inv-header">
            <div>
              <div class="inv-logo">N</div>
              <h2 style="font-size:22px;font-weight:800;color:var(--text-primary);margin-top:8px">NexusPanel</h2>
              <p style="font-size:12px;color:var(--text-muted);line-height:1.6">
                123 Tech Street<br>San Francisco, CA 94105<br>billing&#64;nexuspanel.io
              </p>
            </div>
            <div style="text-align:right">
              <p style="font-size:32px;font-weight:800;color:var(--accent-500);letter-spacing:-.02em">INVOICE</p>
              <p style="font-size:15px;font-weight:700;color:var(--text-primary)">#{{ currentInvoice().id }}</p>
              <div style="margin-top:12px;font-size:12px;color:var(--text-muted);line-height:2">
                <div class="flex justify-end gap-4">
                  <span>Issue Date:</span>
                  <span style="color:var(--text-primary);font-weight:500">{{ currentInvoice().date }}</span>
                </div>
                <div class="flex justify-end gap-4">
                  <span>Due Date:</span>
                  <span style="color:var(--text-primary);font-weight:500">{{ currentInvoice().dueDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bill to -->
          <div class="inv-bill-row">
            <div class="bill-card">
              <p style="font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">Bill To</p>
              <p style="font-size:14px;font-weight:700;color:var(--text-primary)">{{ currentInvoice().client }}</p>
              <p style="font-size:12px;color:var(--text-muted);line-height:1.8">
                {{ currentInvoice().clientEmail }}<br>{{ currentInvoice().clientAddr }}
              </p>
            </div>
            <div class="bill-card">
              <p style="font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">Payment Method</p>
              <p style="font-size:13px;font-weight:600;color:var(--text-primary)">Bank Transfer</p>
              <p style="font-size:12px;color:var(--text-muted);line-height:1.8">
                IBAN: US12 3456 7890 1234<br>SWIFT: NEXUSBANK
              </p>
            </div>
          </div>

          <!-- Line items -->
          <table class="inv-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align:center;width:60px">Qty</th>
                <th style="text-align:right;width:100px">Rate</th>
                <th style="text-align:right;width:100px">Amount</th>
              </tr>
            </thead>
            <tbody>
              @for (item of currentInvoice().items; track item.description) {
                <tr>
                  <td>{{ item.description }}</td>
                  <td style="text-align:center">{{ item.qty }}</td>
                  <td style="text-align:right">\${{ item.rate.toLocaleString() }}</td>
                  <td style="text-align:right;font-weight:600">\${{ (item.qty * item.rate).toLocaleString() }}</td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Totals -->
          <div class="inv-totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>\${{ subtotal().toLocaleString() }}</span>
            </div>
            <div class="total-row">
              <span>Tax (10%)</span>
              <span>\${{ tax().toLocaleString() }}</span>
            </div>
            <div class="total-row total-final">
              <span>Total Due</span>
              <span>\${{ total().toLocaleString() }}</span>
            </div>
          </div>

          <!-- Notes -->
          <div style="margin-top:24px;padding:16px;background:var(--bg-elevated);border-radius:8px;font-size:12px;color:var(--text-muted)">
            <strong style="color:var(--text-primary)">Notes:</strong> Payment is due within 30 days. Late payments are subject to a 1.5% monthly fee.
            Thank you for your business!
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-layout { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }

    .inv-list-item {
      padding: 14px 16px; cursor: pointer;
      border-bottom: 1px solid var(--border-default);
      transition: background 150ms ease;
      &:hover { background: var(--bg-elevated); }
      &.active { background: var(--accent-50); border-left: 3px solid var(--accent-500); }
      &:last-child { border-bottom: none; }
    }

    .invoice-paper { flex: 1; min-width: 0; }

    .inv-status-bar {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700;
      margin-bottom: 24px;
      &.badge-success { background: #dcfce7; color: #15803d; }
      &.badge-warning { background: #fef9c3; color: #854d0e; }
      &.badge-info    { background: #dbeafe; color: #1d4ed8; }
    }

    .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }

    .inv-logo {
      width: 48px; height: 48px; border-radius: 12px;
      background: linear-gradient(135deg, #818cf8, #6366f1);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; color: #fff;
    }

    .inv-bill-row { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
    .bill-card { flex: 1; min-width: 180px; padding: 16px; background: var(--bg-elevated); border-radius: 10px; }

    .inv-table {
      width: 100%; border-collapse: collapse; font-size: 13px;
      th {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: .06em; color: var(--text-muted);
        padding: 10px 12px; background: var(--bg-elevated);
        border-bottom: 1px solid var(--border-default);
        text-align: left;
      }
      td { padding: 12px; border-bottom: 1px solid var(--border-default); color: var(--text-secondary); }
      tr:last-child td { border-bottom: none; }
    }

    .inv-totals {
      margin-top: 16px; margin-left: auto; width: 260px;
    }
    .total-row {
      display: flex; justify-content: space-between;
      padding: 8px 0; font-size: 13px; color: var(--text-secondary);
      border-bottom: 1px solid var(--border-default);
    }
    .total-final {
      font-size: 16px; font-weight: 800; color: var(--text-primary);
      border-bottom: none; margin-top: 4px;
      span:last-child { color: var(--accent-500); }
    }
  `],
})
export default class InvoiceComponent {

  selectedInv = 'INV-2024-001';

  invoiceList = [
    { id: 'INV-2024-001', client: 'Acme Corp',       amount: 4850,  date: 'Jun 1, 2024',  status: 'Paid',    statusClass: 'success', statusIcon: 'check_circle', dueDate: 'Jun 30, 2024', clientEmail: 'billing@acme.com', clientAddr: '500 Main St, New York, NY', items: [{ description: 'UI/UX Design (10 screens)', qty: 10, rate: 250 }, { description: 'Frontend Development', qty: 20, rate: 150 }, { description: 'Project Management', qty: 5, rate: 100 }] },
    { id: 'INV-2024-002', client: 'TechStart Inc',   amount: 2300,  date: 'Jun 10, 2024', status: 'Pending', statusClass: 'warning', statusIcon: 'schedule',     dueDate: 'Jul 10, 2024', clientEmail: 'ap@techstart.io',  clientAddr: '800 Oak Ave, Austin, TX',  items: [{ description: 'API Integration', qty: 8, rate: 200 }, { description: 'Backend Development', qty: 7, rate: 180 }, { description: 'Testing & QA', qty: 3, rate: 120 }] },
    { id: 'INV-2024-003', client: 'Blue Ocean Ltd',  amount: 7200,  date: 'Jun 15, 2024', status: 'Sent',    statusClass: 'info',    statusIcon: 'email',        dueDate: 'Jul 15, 2024', clientEmail: 'finance@blueocean.com', clientAddr: '22 Harbor Rd, Miami, FL', items: [{ description: 'Full-Stack Development (40h)', qty: 40, rate: 150 }, { description: 'DevOps Setup', qty: 8, rate: 150 }, { description: 'Documentation', qty: 4, rate: 100 }] },
    { id: 'INV-2024-004', client: 'Globex Systems',  amount: 1500,  date: 'May 28, 2024', status: 'Paid',    statusClass: 'success', statusIcon: 'check_circle', dueDate: 'Jun 27, 2024', clientEmail: 'accounts@globex.com',  clientAddr: '10 Industrial Blvd, Chicago, IL', items: [{ description: 'Consulting (10h)', qty: 10, rate: 150 }] },
  ];

  currentInvoice() {
    return this.invoiceList.find(i => i.id === this.selectedInv) ?? this.invoiceList[0];
  }

  subtotal() { return this.currentInvoice().items.reduce((s, i) => s + i.qty * i.rate, 0); }
  tax()      { return Math.round(this.subtotal() * 0.1); }
  total()    { return this.subtotal() + this.tax(); }

  print() { window.print(); }
}