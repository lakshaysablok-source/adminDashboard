import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Activity {
  id: string;
  user: string;
  initials: string;
  avatarBg: string;
  action: string;
  target: string;
  targetLink?: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'order' | 'comment' | 'upload' | 'settings';
  timeAgo: string;
  timestamp: string;
  meta?: string;
  group: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Activity Feed</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">Real-time log of all team actions</p>
        </div>
        <div class="flex gap-2">
          <button style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">file_download</mat-icon> Export Log
          </button>
        </div>
      </div>

      <!-- Two-column layout: feed + sidebar -->
      <div class="activity-layout">

        <!-- Feed -->
        <div style="flex:1;min-width:0">

          <!-- Type filter chips -->
          <div class="flex gap-2 flex-wrap mb-4">
            @for (f of filters; track f.value) {
              <button class="filter-chip" [class.active]="activeFilter()===f.value" (click)="activeFilter.set(f.value)">
                <mat-icon style="font-size:14px;width:14px;height:14px">{{ f.icon }}</mat-icon>
                {{ f.label }}
              </button>
            }
          </div>

          <!-- Timeline -->
          @for (grp of grouped(); track grp.label) {
            <div style="margin-bottom:28px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                <span style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;white-space:nowrap">{{ grp.label }}</span>
                <div style="flex:1;height:1px;background:var(--border-default)"></div>
                <span style="font-size:11px;color:var(--text-muted);white-space:nowrap">{{ grp.items.length }} events</span>
              </div>

              <div class="timeline">
                @for (a of grp.items; track a.id; let last = $last) {
                  <div class="timeline-item">
                    <!-- Dot -->
                    <div class="tl-dot" [style.background]="typeColor(a.type) + '18'">
                      <mat-icon style="font-size:14px;width:14px;height:14px" [style.color]="typeColor(a.type)">{{ typeIcon(a.type) }}</mat-icon>
                    </div>
                    <!-- Line -->
                    @if (!last) {
                      <div class="tl-line"></div>
                    }
                    <!-- Card -->
                    <div class="tl-card">
                      <div class="flex items-start gap-3">
                        <div style="width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0" [style.background]="a.avatarBg">{{ a.initials }}</div>
                        <div style="flex:1;min-width:0">
                          <div class="flex items-start justify-between gap-2 flex-wrap">
                            <p style="font-size:13px;color:var(--text-secondary);line-height:1.5">
                              <span style="font-weight:700;color:var(--text-primary)">{{ a.user }}</span>
                              {{ a.action }}
                              <span style="font-weight:600;color:var(--accent-500)">{{ a.target }}</span>
                            </p>
                            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;flex-shrink:0">{{ a.timeAgo }}</span>
                          </div>
                          @if (a.meta) {
                            <div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:var(--bg-elevated);font-size:12px;color:var(--text-secondary);border-left:3px solid" [style.border-left-color]="typeColor(a.type)">
                              {{ a.meta }}
                            </div>
                          }
                          <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
                            <span class="type-chip-sm" [style.color]="typeColor(a.type)" [style.background]="typeColor(a.type) + '12'">
                              {{ a.type }}
                            </span>
                            <span style="font-size:11px;color:var(--text-muted)">{{ a.timestamp }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (grouped().length === 0) {
            <div class="card" style="padding:60px 20px;text-align:center">
              <mat-icon style="font-size:48px;width:48px;height:48px;color:var(--text-muted);display:block;margin:0 auto 12px">history</mat-icon>
              <p style="font-size:15px;font-weight:600;color:var(--text-secondary)">No activity found</p>
            </div>
          }
        </div>

        <!-- Sidebar -->
        <div style="width:280px;flex-shrink:0;display:flex;flex-direction:column;gap:16px">

          <!-- Stats -->
          <div class="card">
            <h3 style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:14px">Activity Summary</h3>
            @for (s of summary; track s.label) {
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-default)">
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:8px;height:8px;border-radius:50%" [style.background]="s.color"></div>
                  <span style="font-size:12px;color:var(--text-secondary)">{{ s.label }}</span>
                </div>
                <span style="font-size:12px;font-weight:700;color:var(--text-primary)">{{ s.count }}</span>
              </div>
            }
          </div>

          <!-- Most active users -->
          <div class="card">
            <h3 style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:14px">Most Active</h3>
            @for (u of activeUsers; track u.name) {
              <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-default)">
                <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0" [style.background]="u.bg">{{ u.initials }}</div>
                <div style="flex:1;min-width:0">
                  <p style="font-size:12px;font-weight:600;color:var(--text-primary)">{{ u.name }}</p>
                  <div style="height:4px;border-radius:2px;background:var(--border-default);margin-top:4px">
                    <div style="height:100%;border-radius:2px;background:var(--accent-500);transition:width 600ms" [style.width]="(u.actions / 48 * 100) + '%'"></div>
                  </div>
                </div>
                <span style="font-size:12px;font-weight:700;color:var(--text-muted)">{{ u.actions }}</span>
              </div>
            }
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    .activity-layout { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; }

    .filter-chip {
      display: flex; align-items: center; gap: 5px; padding: 6px 12px;
      border-radius: 9999px; border: 1px solid var(--border-default);
      background: transparent; cursor: pointer; font-size: 12px; font-weight: 600;
      color: var(--text-muted); transition: all 150ms;
      &:hover { border-color: var(--accent-500); color: var(--accent-500); }
      &.active { background: var(--accent-500); color: #fff; border-color: var(--accent-500); }
    }

    .timeline { position: relative; padding-left: 36px; }
    .timeline-item { position: relative; margin-bottom: 16px; }

    .tl-dot {
      position: absolute; left: -36px; top: 0;
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .tl-line {
      position: absolute; left: -20px; top: 32px;
      width: 2px; height: calc(100% - 10px);
      background: var(--border-default); border-radius: 2px;
    }

    .tl-card {
      background: var(--bg-surface); border: 1px solid var(--border-default);
      border-radius: 12px; padding: 14px;
      transition: border-color 150ms;
      &:hover { border-color: var(--accent-500); }
    }

    .type-chip-sm { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; text-transform: capitalize; }
  `],
})
export default class ActivityComponent {
  activeFilter = signal('all');

  filters = [
    { label: 'All',      value: 'all',      icon: 'apps'         },
    { label: 'Created',  value: 'create',   icon: 'add_circle'   },
    { label: 'Updated',  value: 'update',   icon: 'edit'         },
    { label: 'Deleted',  value: 'delete',   icon: 'delete'       },
    { label: 'Orders',   value: 'order',    icon: 'shopping_bag' },
    { label: 'Logins',   value: 'login',    icon: 'login'        },
  ];

  summary = [
    { label: 'Created',    count: 24, color: '#22c55e' },
    { label: 'Updated',    count: 58, color: '#6366f1' },
    { label: 'Deleted',    count: 6,  color: '#ef4444' },
    { label: 'Orders',     count: 14, color: '#f59e0b' },
    { label: 'Logins',     count: 31, color: '#06b6d4' },
    { label: 'Uploads',    count: 12, color: '#a855f7' },
  ];

  activeUsers = [
    { name: 'Alice Summers', initials: 'AS', bg: '#6366f1', actions: 48 },
    { name: 'David Wilson',  initials: 'DW', bg: '#3b82f6', actions: 36 },
    { name: 'Ryan Kim',      initials: 'RK', bg: '#10b981', actions: 29 },
    { name: 'Mark Chen',     initials: 'MC', bg: '#f59e0b', actions: 21 },
    { name: 'Julia Morgan',  initials: 'JM', bg: '#ef4444', actions: 14 },
  ];

  activities = signal<Activity[]>([
    { id:'a1',  user:'Alice Summers', initials:'AS', avatarBg:'#6366f1', action:'created a new product', target:'Wireless Noise-Cancelling Headphones',                       type:'create',   timeAgo:'2 min ago',    timestamp:'10:24 AM', group:'Today',     meta: 'SKU: ELC-001 · Category: Electronics · Price: $299.99' },
    { id:'a2',  user:'David Wilson',  initials:'DW', avatarBg:'#3b82f6', action:'updated order status to Shipped for', target:'#ORD-5520',                                    type:'order',    timeAgo:'15 min ago',   timestamp:'10:11 AM', group:'Today',     meta: 'Tracking: DHL-8473628190 · Customer: Ryan Kim' },
    { id:'a3',  user:'Ryan Kim',      initials:'RK', avatarBg:'#10b981', action:'uploaded 5 files to', target:'Product Images / Electronics',                                 type:'upload',   timeAgo:'42 min ago',   timestamp:'09:44 AM', group:'Today',     meta: 'headphones_01.jpg, headphones_02.jpg, headphones_03.jpg...' },
    { id:'a4',  user:'Julia Morgan',  initials:'JM', avatarBg:'#ef4444', action:'deleted product', target:'Vintage Denim Jacket (CLT-012)',                                   type:'delete',   timeAgo:'1 hr ago',     timestamp:'09:20 AM', group:'Today',     meta: undefined },
    { id:'a5',  user:'Mark Chen',     initials:'MC', avatarBg:'#f59e0b', action:'updated pricing for', target:'4K Ultra HD Monitor 27"',                                      type:'update',   timeAgo:'2 hrs ago',    timestamp:'08:30 AM', group:'Today',     meta: 'Price changed from $599.00 → $549.00' },
    { id:'a6',  user:'Alice Summers', initials:'AS', avatarBg:'#6366f1', action:'logged in from', target:'San Francisco, CA',                                                  type:'login',    timeAgo:'3 hrs ago',    timestamp:'07:58 AM', group:'Today',     meta: 'Device: MacBook Pro · Browser: Chrome 125' },
    { id:'a7',  user:'Lisa Park',     initials:'LP', avatarBg:'#a855f7', action:'commented on issue', target:'#BUG-142 — Dashboard chart rendering',                         type:'comment',  timeAgo:'4 hrs ago',    timestamp:'06:45 AM', group:'Today',     meta: '"The issue only reproduces in dark mode when sidebar is collapsed."' },
    { id:'a8',  user:'Carlos Ruiz',   initials:'CR', avatarBg:'#0ea5e9', action:'updated settings for', target:'Email Notifications',                                         type:'settings', timeAgo:'Yesterday',    timestamp:'4:12 PM',  group:'Yesterday', meta: 'Digest frequency changed: Real-time → Daily' },
    { id:'a9',  user:'Emma Johnson',  initials:'EJ', avatarBg:'#22c55e', action:'created invoice', target:'#INV-2024-005 for TechStart Inc',                                  type:'create',   timeAgo:'Yesterday',    timestamp:'2:30 PM',  group:'Yesterday', meta: 'Amount: $3,400.00 · Due: Jul 20, 2024' },
    { id:'a10', user:'David Wilson',  initials:'DW', avatarBg:'#3b82f6', action:'invited new user', target:'sophie@nexus.io',                                                 type:'create',   timeAgo:'Yesterday',    timestamp:'11:00 AM', group:'Yesterday', meta: 'Role: Editor · Department: Design' },
    { id:'a11', user:'Alice Summers', initials:'AS', avatarBg:'#6366f1', action:'banned user account', target:'Tom Bradley',                                                  type:'settings', timeAgo:'Yesterday',    timestamp:'09:45 AM', group:'Yesterday', meta: 'Reason: Policy violations — repeated unauthorized access attempts' },
    { id:'a12', user:'Ryan Kim',      initials:'RK', avatarBg:'#10b981', action:'processed refund for', target:'Order #ORD-5516 ($89.00)',                                    type:'order',    timeAgo:'2 days ago',   timestamp:'3:15 PM',  group:'This Week', meta: 'Refund method: Visa •• 5678 · Status: Processed' },
    { id:'a13', user:'Mark Chen',     initials:'MC', avatarBg:'#f59e0b', action:'deleted 3 draft products from', target:'Clothing category',                                  type:'delete',   timeAgo:'3 days ago',   timestamp:'10:20 AM', group:'This Week', meta: undefined },
    { id:'a14', user:'Julia Morgan',  initials:'JM', avatarBg:'#ef4444', action:'created new landing page for', target:'Summer Sale Campaign',                               type:'create',   timeAgo:'4 days ago',   timestamp:'2:00 PM',  group:'This Week', meta: undefined },
    { id:'a15', user:'Carlos Ruiz',   initials:'CR', avatarBg:'#0ea5e9', action:'bulk-updated inventory for', target:'12 Electronics products',                              type:'update',   timeAgo:'1 week ago',   timestamp:'11:30 AM', group:'Earlier',   meta: 'Stock levels adjusted after Q2 audit' },
    { id:'a16', user:'Alice Summers', initials:'AS', avatarBg:'#6366f1', action:'updated role permissions for', target:'Editor role',                                         type:'settings', timeAgo:'1 week ago',   timestamp:'09:00 AM', group:'Earlier',   meta: 'Added: Export Reports · Removed: Delete Products' },
  ]);

  filtered = computed(() => {
    const f = this.activeFilter();
    if (f === 'all') return this.activities();
    return this.activities().filter(a => a.type === f);
  });

  grouped = computed(() => {
    const groups = ['Today', 'Yesterday', 'This Week', 'Earlier'] as const;
    return groups
      .map(label => ({ label, items: this.filtered().filter(a => a.group === label) }))
      .filter(g => g.items.length > 0);
  });

  typeIcon(type: string): string {
    const map: Record<string, string> = { create:'add_circle', update:'edit', delete:'delete', login:'login', order:'shopping_bag', comment:'chat', upload:'upload', settings:'settings' };
    return map[type] ?? 'circle';
  }

  typeColor(type: string): string {
    const map: Record<string, string> = { create:'#22c55e', update:'#6366f1', delete:'#ef4444', login:'#06b6d4', order:'#f59e0b', comment:'#f43f5e', upload:'#a855f7', settings:'#94a3b8' };
    return map[type] ?? '#6366f1';
  }
}