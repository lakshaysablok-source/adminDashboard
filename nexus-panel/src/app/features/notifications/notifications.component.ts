import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Notification {
  id: string;
  type: 'order' | 'user' | 'system' | 'comment' | 'alert' | 'payment';
  title: string;
  body: string;
  time: string;
  timeAgo: string;
  read: boolean;
  avatar?: string;
  avatarBg?: string;
  initials?: string;
  group: 'Today' | 'Yesterday' | 'This Week' | 'Earlier';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Notifications</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">
            {{ unreadCount() }} unread notification{{ unreadCount() !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex gap-2">
          <button (click)="markAllRead()" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">done_all</mat-icon> Mark all read
          </button>
          <button (click)="clearAll()" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">delete_sweep</mat-icon> Clear all
          </button>
        </div>
      </div>

      <!-- Filter tabs + settings row -->
      <div class="card" style="padding:12px 16px">
        <div class="flex items-center gap-3 flex-wrap justify-between">
          <div class="flex gap-1">
            @for (tab of tabs; track tab.value) {
              <button class="tab-btn" [class.active]="activeTab()===tab.value" (click)="activeTab.set(tab.value)">
                {{ tab.label }}
                @if (tab.value === 'unread' && unreadCount() > 0) {
                  <span class="tab-badge">{{ unreadCount() }}</span>
                }
              </button>
            }
          </div>
          <div class="flex gap-2">
            @for (type of typeFilters; track type.value) {
              <button class="type-chip" [class.active]="typeFilter()===type.value" (click)="typeFilter.set(type.value)">
                <mat-icon style="font-size:14px;width:14px;height:14px">{{ type.icon }}</mat-icon>
                {{ type.label }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Notification groups -->
      @if (grouped().length === 0) {
        <div class="card" style="padding:60px 20px;text-align:center">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:var(--text-muted);display:block;margin:0 auto 12px">notifications_none</mat-icon>
          <p style="font-size:15px;font-weight:600;color:var(--text-secondary)">No notifications</p>
          <p style="font-size:13px;color:var(--text-muted);margin-top:4px">You're all caught up!</p>
        </div>
      }

      @for (grp of grouped(); track grp.label) {
        <div>
          <p style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;padding:0 4px">{{ grp.label }}</p>
          <div class="card" style="padding:0;overflow:hidden">
            @for (n of grp.items; track n.id; let last = $last) {
              <div class="notif-item" [class.unread]="!n.read" (click)="markRead(n)">
                <!-- Left indicator -->
                <div style="width:3px;align-self:stretch;border-radius:0 3px 3px 0;flex-shrink:0;transition:background 200ms" [style.background]="!n.read ? 'var(--accent-500)' : 'transparent'"></div>

                <!-- Icon / Avatar -->
                <div style="flex-shrink:0;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center" [style.background]="typeColor(n.type) + '18'">
                  @if (n.initials) {
                    <span style="font-size:13px;font-weight:700;color:#fff" [style.color]="typeColor(n.type)">{{ n.initials }}</span>
                  } @else {
                    <mat-icon style="font-size:20px;width:20px;height:20px" [style.color]="typeColor(n.type)">{{ typeIcon(n.type) }}</mat-icon>
                  }
                </div>

                <!-- Content -->
                <div style="flex:1;min-width:0">
                  <div class="flex items-start justify-between gap-2">
                    <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ n.title }}</p>
                    <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;flex-shrink:0">{{ n.timeAgo }}</span>
                  </div>
                  <p style="font-size:12px;color:var(--text-secondary);margin-top:2px;line-height:1.5">{{ n.body }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="type-label" [style.color]="typeColor(n.type)" [style.background]="typeColor(n.type) + '12'">{{ n.type }}</span>
                    @if (!n.read) {
                      <span style="width:7px;height:7px;border-radius:50%;background:var(--accent-500);display:inline-block;flex-shrink:0"></span>
                    }
                  </div>
                </div>

                <!-- Actions -->
                <div class="notif-actions">
                  @if (!n.read) {
                    <button (click)="markRead(n);$event.stopPropagation()" class="notif-action-btn" title="Mark read">
                      <mat-icon style="font-size:16px;width:16px;height:16px">check</mat-icon>
                    </button>
                  }
                  <button (click)="dismiss(n);$event.stopPropagation()" class="notif-action-btn notif-delete" title="Dismiss">
                    <mat-icon style="font-size:16px;width:16px;height:16px">close</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .tab-btn {
      padding: 6px 14px; border-radius: 8px; border: 1px solid transparent;
      background: transparent; cursor: pointer; font-size: 12px; font-weight: 500;
      color: var(--text-secondary); display: flex; align-items: center; gap: 6px;
      transition: all 150ms;
      &:hover { background: var(--bg-elevated); }
      &.active { background: var(--accent-50); color: var(--accent-700); border-color: var(--accent-200, var(--accent-100)); font-weight: 700; }
    }
    .tab-badge { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 9999px; background: var(--accent-500); color: #fff; }

    .type-chip {
      display: flex; align-items: center; gap: 5px; padding: 5px 10px;
      border-radius: 9999px; border: 1px solid var(--border-default);
      background: transparent; cursor: pointer; font-size: 11px; font-weight: 600;
      color: var(--text-muted); transition: all 150ms;
      &:hover { border-color: var(--accent-500); color: var(--accent-500); }
      &.active { background: var(--accent-500); color: #fff; border-color: var(--accent-500); }
    }

    .notif-item {
      display: flex; align-items: flex-start; gap: 14px; padding: 14px 16px 14px 0;
      border-bottom: 1px solid var(--border-default); cursor: pointer;
      transition: background 150ms; position: relative;
      &:last-child { border-bottom: none; }
      &:hover { background: var(--bg-elevated); }
      &:hover .notif-actions { opacity: 1; }
      &.unread { background: rgba(99,102,241,.03); }
    }

    .type-label { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; text-transform: capitalize; }

    .notif-actions { display: flex; gap: 4px; align-items: center; opacity: 0; transition: opacity 150ms; flex-shrink: 0; }
    .notif-action-btn {
      width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border-default);
      background: var(--bg-surface); cursor: pointer; color: var(--text-muted);
      display: flex; align-items: center; justify-content: center; transition: all 150ms;
      &:hover { background: var(--bg-elevated); color: var(--text-primary); }
      &.notif-delete:hover { background: rgba(239,68,68,.1); color: #ef4444; border-color: #ef4444; }
    }
  `],
})
export default class NotificationsComponent {
  activeTab  = signal<'all' | 'unread' | 'mentions'>('all');
  typeFilter = signal<string>('all');

  tabs: { label: string; value: 'all' | 'unread' | 'mentions' }[] = [
    { label: 'All',      value: 'all'      },
    { label: 'Unread',   value: 'unread'   },
    { label: 'Mentions', value: 'mentions' },
  ];

  typeFilters = [
    { label: 'All',     value: 'all',     icon: 'apps'          },
    { label: 'Orders',  value: 'order',   icon: 'shopping_bag'  },
    { label: 'Users',   value: 'user',    icon: 'group'         },
    { label: 'System',  value: 'system',  icon: 'settings'      },
    { label: 'Alerts',  value: 'alert',   icon: 'warning'       },
  ];

  notifications = signal<Notification[]>([
    { id:'n1',  type:'order',   title:'New order received',           body:'Order #ORD-5530 from Marcus Webb — $348.00',                  time:'10:24 AM', timeAgo:'5 min ago',   read:false, avatarBg:'#6366f1', initials:'MW', group:'Today'     },
    { id:'n2',  type:'payment', title:'Payment confirmed',            body:'$481.78 payment for order #ORD-5521 has been processed.',    time:'09:58 AM', timeAgo:'31 min ago',  read:false, group:'Today'     },
    { id:'n3',  type:'user',    title:'New user registered',          body:'Sophie Laurent (sophie@nexus.io) joined as Editor.',         time:'09:15 AM', timeAgo:'1 hr ago',    read:false, avatarBg:'#d946ef', initials:'SL', group:'Today' },
    { id:'n4',  type:'comment', title:'New comment on your post',     body:'Ryan Kim mentioned you: "@admin great update on the dashboard release!"', time:'08:30 AM', timeAgo:'2 hrs ago',   read:false, avatarBg:'#10b981', initials:'RK', group:'Today' },
    { id:'n5',  type:'alert',   title:'Low stock alert',              body:'Product "Mechanical Keyboard RGB" has only 3 items left.',   time:'07:00 AM', timeAgo:'3 hrs ago',   read:true,  group:'Today'     },
    { id:'n6',  type:'system',  title:'Scheduled backup completed',   body:'Daily database backup completed successfully. Size: 2.4 GB.', time:'03:00 AM', timeAgo:'7 hrs ago',  read:true,  group:'Today'     },
    { id:'n7',  type:'order',   title:'Order cancelled',              body:'Order #ORD-5516 by Priya Patel has been cancelled. Refund initiated.', time:'Yesterday', timeAgo:'Yesterday', read:true, avatarBg:'#06b6d4', initials:'PP', group:'Yesterday' },
    { id:'n8',  type:'user',    title:'User account banned',          body:'Tom Bradley\'s account was banned due to policy violations.', time:'Yesterday', timeAgo:'Yesterday',  read:true,  avatarBg:'#f43f5e', initials:'TB', group:'Yesterday' },
    { id:'n9',  type:'alert',   title:'Server CPU spike',             body:'Production server CPU reached 94% for 5 minutes at 14:22.',  time:'Yesterday', timeAgo:'Yesterday',  read:true,  group:'Yesterday' },
    { id:'n10', type:'payment', title:'Refund processed',             body:'$89.00 refund for order #ORD-5516 sent to Visa •• 5678.',    time:'2 days ago', timeAgo:'2 days ago', read:true,  group:'This Week' },
    { id:'n11', type:'system',  title:'SSL certificate renewed',      body:'SSL certificate for nexuspanel.io renewed. Valid for 1 year.', time:'3 days ago', timeAgo:'3 days ago', read:true, group:'This Week' },
    { id:'n12', type:'user',    title:'Team invitation accepted',     body:'Carlos Ruiz accepted the invitation and joined Engineering.', time:'4 days ago', timeAgo:'4 days ago', read:true, avatarBg:'#0ea5e9', initials:'CR', group:'This Week' },
    { id:'n13', type:'order',   title:'Bulk order from enterprise',   body:'Order #ORD-5499 from GlobalEx Corp — $12,400.00',            time:'Last week',  timeAgo:'8 days ago', read:true,  group:'Earlier'   },
    { id:'n14', type:'system',  title:'New API version available',    body:'API v3.2.0 is now available with improved rate limiting.',   time:'Last week',  timeAgo:'9 days ago', read:true,  group:'Earlier'   },
  ]);

  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  filtered = computed(() => {
    let list = this.notifications();
    if (this.activeTab() === 'unread')   list = list.filter(n => !n.read);
    if (this.activeTab() === 'mentions') list = list.filter(n => n.type === 'comment');
    if (this.typeFilter() !== 'all')     list = list.filter(n => n.type === this.typeFilter());
    return list;
  });

  grouped = computed(() => {
    const groups = ['Today', 'Yesterday', 'This Week', 'Earlier'] as const;
    return groups
      .map(label => ({ label, items: this.filtered().filter(n => n.group === label) }))
      .filter(g => g.items.length > 0);
  });

  typeIcon(type: string): string {
    const map: Record<string, string> = { order:'shopping_bag', user:'person', system:'settings', comment:'chat', alert:'warning', payment:'payments' };
    return map[type] ?? 'notifications';
  }

  typeColor(type: string): string {
    const map: Record<string, string> = { order:'#6366f1', user:'#10b981', system:'#94a3b8', comment:'#f59e0b', alert:'#ef4444', payment:'#22c55e' };
    return map[type] ?? '#6366f1';
  }

  markRead(n: Notification) {
    this.notifications.update(list => list.map(x => x.id === n.id ? { ...x, read: true } : x));
  }

  markAllRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  dismiss(n: Notification) {
    this.notifications.update(list => list.filter(x => x.id !== n.id));
  }

  clearAll() {
    this.notifications.set([]);
  }
}