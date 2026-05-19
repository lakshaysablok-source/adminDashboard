import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatTabsModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Breadcrumb header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2 text-sm">
          <a routerLink="/ecommerce/products" style="color:var(--text-muted);text-decoration:none;cursor:pointer"
            class="hover:underline">Products</a>
          <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">chevron_right</mat-icon>
          <span class="font-semibold text-primary">{{ product.name }}</span>
        </div>
        <div class="flex gap-2">
          <button style="padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            Discard
          </button>
          <button (click)="saved=true" style="padding:8px 14px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            {{ saved ? '✓ Saved' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div class="detail-layout">

        <!-- Left column -->
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:16px">

          <!-- General info -->
          <div class="card">
            <h3 class="section-title">General Information</h3>
            <div class="space-y-4">
              <div>
                <label class="field-label">Product Name</label>
                <input [(ngModel)]="product.name" class="field-input">
              </div>
              <div>
                <label class="field-label">Description</label>
                <textarea [(ngModel)]="product.description" rows="4" class="field-input" style="resize:vertical"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="field-label">Category</label>
                  <select [(ngModel)]="product.category" class="field-input">
                    <option>Electronics</option><option>Clothing</option>
                    <option>Home & Garden</option><option>Sports</option>
                    <option>Books</option><option>Beauty</option>
                  </select>
                </div>
                <div>
                  <label class="field-label">Brand</label>
                  <input [(ngModel)]="product.brand" class="field-input">
                </div>
              </div>
              <div>
                <label class="field-label">Tags</label>
                <div class="tags-wrap">
                  @for (tag of product.tags; track tag) {
                    <span class="tag">{{ tag }}
                      <button (click)="removeTag(tag)" style="border:none;background:none;cursor:pointer;padding:0;margin-left:3px;line-height:1;color:inherit">×</button>
                    </span>
                  }
                  <input [(ngModel)]="newTag" (keyup.enter)="addTag()" placeholder="Add tag…"
                    style="border:none;background:transparent;outline:none;font-size:12px;color:var(--text-primary);font-family:inherit;min-width:80px">
                </div>
              </div>
            </div>
          </div>

          <!-- Images -->
          <div class="card">
            <h3 class="section-title">Product Images</h3>
            <div class="images-grid">
              @for (img of product.images; track $index; let i = $index) {
                <div class="img-thumb" [class.main-img]="i===0">
                  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:8px" [style.background]="img">
                    <mat-icon style="font-size:32px;width:32px;height:32px;color:rgba(255,255,255,.6)">inventory_2</mat-icon>
                  </div>
                  @if (i === 0) {
                    <span style="position:absolute;bottom:4px;left:4px;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(0,0,0,.5);color:#fff">MAIN</span>
                  }
                </div>
              }
              <div class="img-upload">
                <mat-icon style="font-size:24px;width:24px;height:24px;color:var(--text-muted)">add_photo_alternate</mat-icon>
                <span style="font-size:11px;color:var(--text-muted);margin-top:4px">Add Image</span>
              </div>
            </div>
          </div>

          <!-- Variants -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="section-title" style="margin:0">Variants</h3>
              <button style="font-size:12px;padding:5px 10px;border-radius:6px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary)">
                + Add Variant
              </button>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--bg-elevated)">
                  <th class="th">SKU</th><th class="th">Size</th><th class="th">Color</th>
                  <th class="th">Stock</th><th class="th">Price</th>
                </tr>
              </thead>
              <tbody>
                @for (v of product.variants; track v.sku) {
                  <tr style="border-bottom:1px solid var(--border-default)">
                    <td class="td" style="font-weight:500">{{ v.sku }}</td>
                    <td class="td">{{ v.size }}</td>
                    <td class="td"><div style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:12px;border-radius:50%" [style.background]="v.colorHex"></div>{{ v.color }}</div></td>
                    <td class="td">
                      <span style="font-size:11px;padding:2px 8px;border-radius:6px" [style.background]="v.stock < 5 ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)'" [style.color]="v.stock < 5 ? '#ef4444' : '#22c55e'">{{ v.stock }}</span>
                    </td>
                    <td class="td" style="font-weight:600;color:var(--accent-500)">\${{ v.price.toFixed(2) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right column -->
        <div style="width:300px;flex-shrink:0;display:flex;flex-direction:column;gap:16px">

          <!-- Status -->
          <div class="card">
            <h3 class="section-title">Status</h3>
            <select [(ngModel)]="product.status" class="field-input">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <div class="flex items-center justify-between mt-3 p-3 rounded-lg" style="background:var(--bg-elevated)">
              <span style="font-size:12px;color:var(--text-secondary)">Visibility</span>
              <div class="toggle-wrap" [class.on]="product.visible" (click)="product.visible=!product.visible">
                <div class="toggle-thumb"></div>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="card">
            <h3 class="section-title">Pricing</h3>
            <div class="space-y-3">
              <div>
                <label class="field-label">Price</label>
                <div style="position:relative">
                  <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:13px">$</span>
                  <input [(ngModel)]="product.price" type="number" class="field-input" style="padding-left:24px">
                </div>
              </div>
              <div>
                <label class="field-label">Compare at Price</label>
                <div style="position:relative">
                  <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:13px">$</span>
                  <input [(ngModel)]="product.comparePrice" type="number" class="field-input" style="padding-left:24px">
                </div>
              </div>
              <div>
                <label class="field-label">Cost per Item</label>
                <div style="position:relative">
                  <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:13px">$</span>
                  <input [(ngModel)]="product.cost" type="number" class="field-input" style="padding-left:24px">
                </div>
              </div>
              @if (product.comparePrice > product.price) {
                <div style="padding:8px;border-radius:8px;background:rgba(34,197,94,.1);font-size:12px;color:#22c55e;text-align:center">
                  {{ discount() }}% discount applied
                </div>
              }
            </div>
          </div>

          <!-- Inventory -->
          <div class="card">
            <h3 class="section-title">Inventory</h3>
            <div class="space-y-3">
              <div>
                <label class="field-label">SKU</label>
                <input [(ngModel)]="product.sku" class="field-input">
              </div>
              <div>
                <label class="field-label">Barcode (ISBN, UPC)</label>
                <input [(ngModel)]="product.barcode" class="field-input">
              </div>
              <div>
                <label class="field-label">Quantity</label>
                <input [(ngModel)]="product.stock" type="number" class="field-input">
              </div>
            </div>
          </div>

          <!-- Shipping -->
          <div class="card">
            <h3 class="section-title">Shipping</h3>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div><label class="field-label">Weight (kg)</label><input [(ngModel)]="product.weight" type="number" class="field-input"></div>
                <div><label class="field-label">Length (cm)</label><input [(ngModel)]="product.length" type="number" class="field-input"></div>
                <div><label class="field-label">Width (cm)</label><input [(ngModel)]="product.width" type="number" class="field-input"></div>
                <div><label class="field-label">Height (cm)</label><input [(ngModel)]="product.height" type="number" class="field-input"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-layout { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .section-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 5px; }
    .field-input { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-default); background: var(--bg-elevated); color: var(--text-primary); font-size: 13px; font-family: inherit; outline: none; box-sizing: border-box; &:focus { border-color: var(--accent-500); } }

    .images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .img-thumb { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 2px solid var(--border-default); &.main-img { border-color: var(--accent-500); } }
    .img-upload { aspect-ratio: 1; border-radius: 8px; border: 2px dashed var(--border-default); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; &:hover { border-color: var(--accent-500); background: var(--accent-50); } }

    .tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; border-radius: 8px; border: 1px solid var(--border-default); background: var(--bg-elevated); min-height: 40px; }
    .tag { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 9999px; background: var(--accent-100); color: var(--accent-700); font-size: 11px; font-weight: 600; }

    .toggle-wrap { width: 36px; height: 20px; border-radius: 10px; background: var(--border-default); cursor: pointer; position: relative; transition: background 200ms; &.on { background: var(--accent-500); } }
    .toggle-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 200ms; .on & { transform: translateX(16px); } }

    .th { padding: 8px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); text-align: left; }
    .td { padding: 10px 12px; color: var(--text-secondary); }
  `],
})
export default class ProductDetailComponent {
  saved = false;
  newTag = '';

  product = {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with industry-leading noise cancellation, 30-hour battery life, and exceptional sound quality. Features adaptive sound control, touch controls, and foldable design for portability.',
    category: 'Electronics',
    brand: 'SoundPro',
    status: 'active',
    visible: true,
    price: 299.99,
    comparePrice: 399.99,
    cost: 120.00,
    sku: 'ELC-001',
    barcode: '012345678901',
    stock: 45,
    weight: 0.25,
    length: 20, width: 18, height: 8,
    tags: ['wireless', 'audio', 'premium', 'noise-cancelling'],
    images: [
      'linear-gradient(135deg,#6366f1,#8b5cf6)',
      'linear-gradient(135deg,#8b5cf6,#06b6d4)',
      'linear-gradient(135deg,#06b6d4,#10b981)',
    ],
    variants: [
      { sku:'ELC-001-BK-M', size:'M', color:'Black',  colorHex:'#1e293b', stock:15, price:299.99 },
      { sku:'ELC-001-WH-M', size:'M', color:'White',  colorHex:'#f1f5f9', stock:12, price:299.99 },
      { sku:'ELC-001-BL-L', size:'L', color:'Blue',   colorHex:'#6366f1', stock:10, price:309.99 },
      { sku:'ELC-001-RD-L', size:'L', color:'Red',    colorHex:'#ef4444', stock:3,  price:309.99 },
      { sku:'ELC-001-GR-S', size:'S', color:'Green',  colorHex:'#22c55e', stock:5,  price:289.99 },
    ],
  };

  discount() {
    return Math.round((1 - this.product.price / this.product.comparePrice) * 100);
  }
  addTag() {
    if (this.newTag.trim() && !this.product.tags.includes(this.newTag.trim())) {
      this.product.tags = [...this.product.tags, this.newTag.trim()];
    }
    this.newTag = '';
  }
  removeTag(tag: string) { this.product.tags = this.product.tags.filter(t => t !== tag); }
}