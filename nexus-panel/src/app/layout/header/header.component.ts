import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiStore } from '../../store/ui.store';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

interface Breadcrumb { label: string; parent?: string; }

const ROUTE_MAP: Record<string, Breadcrumb> = {
  '/dashboard':        { label: 'Dashboard' },
  '/analytics':        { label: 'Analytics' },
  '/tables/basic':     { label: 'Basic Table',     parent: 'Tables' },
  '/tables/advanced':  { label: 'Advanced Table',  parent: 'Tables' },
  '/forms/elements':   { label: 'Form Elements',   parent: 'Forms' },
  '/forms/validation': { label: 'Form Validation', parent: 'Forms' },
  '/charts':           { label: 'Charts' },
  '/ui/buttons':       { label: 'Buttons',          parent: 'UI Elements' },
  '/ui/badges':        { label: 'Badges & Chips',   parent: 'UI Elements' },
  '/ui/cards':         { label: 'Cards',            parent: 'UI Elements' },
  '/ui/modals':        { label: 'Modals',           parent: 'UI Elements' },
  '/profile':          { label: 'Profile' },
  '/settings':         { label: 'Settings' },
  '/errors/404':       { label: '404 Not Found',   parent: 'Errors' },
  '/errors/403':       { label: '403 Forbidden',   parent: 'Errors' },
  '/errors/500':       { label: '500 Error',       parent: 'Errors' },
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatMenuModule, MatButtonModule,
            MatDividerModule, MatIconModule, MatTooltipModule],
  template: `
    <header class="app-header">

      <!-- Left: menu + breadcrumb -->
      <div class="flex items-center gap-2">
        <button class="header-icon-btn" (click)="uiStore.toggleSidebar()" matTooltip="Toggle sidebar">
          <mat-icon>menu</mat-icon>
        </button>
        <div class="hidden md:flex items-center gap-1 text-sm">
          <span class="text-muted">NexusPanel</span>
          @if (breadcrumb().parent) {
            <mat-icon class="text-muted !text-sm !w-4 !h-4">chevron_right</mat-icon>
            <span class="text-muted">{{ breadcrumb().parent }}</span>
          }
          <mat-icon class="text-muted !text-sm !w-4 !h-4">chevron_right</mat-icon>
          <span class="font-semibold text-primary">{{ breadcrumb().label }}</span>
        </div>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-1">

        <!-- Theme toggle -->
        <button class="header-icon-btn" (click)="theme.toggleMode()"
          [matTooltip]="theme.mode() === 'dark' ? 'Light mode' : 'Dark mode'">
          <mat-icon>{{ theme.mode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- Notifications -->
        <button class="header-icon-btn relative" [matMenuTriggerFor]="notifMenu" matTooltip="Notifications">
          <mat-icon>notifications</mat-icon>
          @if (unreadCount() > 0) {
            <span class="notif-badge">{{ unreadCount() }}</span>
          }
        </button>

        <mat-menu #notifMenu="matMenu" xPosition="before">
          <div class="px-4 py-3 flex items-center justify-between border-b border-border"
            (click)="$event.stopPropagation()">
            <span class="font-semibold text-sm text-primary">Notifications</span>
            <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer"
              (click)="markAllRead()">Mark all read</button>
          </div>
          <div class="w-80 max-h-72 overflow-y-auto">
            @for (n of notifications(); track n.id) {
              <button mat-menu-item class="!h-auto !py-3" (click)="markRead(n.id)">
                <div class="flex gap-3 items-start w-full">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style="background:var(--accent-50)">
                    <mat-icon class="!text-base !w-4 !h-4" style="color:var(--accent-600)">{{ n.icon }}</mat-icon>
                  </div>
                  <div class="flex-1 min-w-0 text-left">
                    <p class="text-sm font-medium text-primary leading-snug">{{ n.title }}</p>
                    <p class="text-xs text-muted mt-0.5">{{ n.time }}</p>
                  </div>
                  @if (!n.read) {
                    <div class="w-2 h-2 rounded-full bg-accent-500 flex-shrink-0 mt-1.5"></div>
                  }
                </div>
              </button>
            }
          </div>
          <div class="px-4 py-2 border-t border-border text-center" (click)="$event.stopPropagation()">
            <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer">
              View all notifications
            </button>
          </div>
        </mat-menu>

        <!-- User menu -->
        <button class="user-menu-trigger" [matMenuTriggerFor]="userMenu">
          <img [src]="auth.currentUser()?.avatar" class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
               alt="avatar" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=U'">
          <div class="hidden sm:flex flex-col items-start" style="line-height:1.3;gap:1px">
            <span class="text-sm font-semibold text-primary max-w-[120px] truncate">
              {{ auth.currentUser()?.name }}
            </span>
            <span class="text-xs text-muted capitalize">{{ auth.currentUser()?.role }}</span>
          </div>
          <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px;
                           color:var(--text-muted);flex-shrink:0">expand_more</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="px-4 py-3" style="border-bottom:1px solid var(--border-default)"
               (click)="$event.stopPropagation()">
            <p class="font-semibold text-sm" style="color:var(--text-primary)">{{ auth.currentUser()?.name }}</p>
            <p class="text-xs" style="color:var(--text-muted);margin-top:2px">{{ auth.currentUser()?.email }}</p>
            <span class="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide"
              style="margin-top:6px;background:var(--accent-100);color:var(--accent-700)">
              {{ auth.currentUser()?.role }}
            </span>
          </div><button mat-menu-item [routerLink]="['/profile']">
            <mat-icon>person_outline</mat-icon> Profile
          </button>
          <button mat-menu-item [routerLink]="['/settings']">
            <mat-icon>settings</mat-icon> Settings
          </button>
          <mat-divider />
          <button mat-menu-item (click)="auth.logout()"
                  style="color:#ef4444 !important">
            <mat-icon style="color:#ef4444 !important">logout</mat-icon> Sign out
          </button>
        </mat-menu>

      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex; align-items: center; justify-content: space-between;
      height: var(--header-height); padding: 0 1.25rem;
      background: var(--bg-surface); border-bottom: 1px solid var(--border-default);
      position: sticky; top: 0; z-index: 30; gap: 12px;
    }
    .header-icon-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border: none; background: transparent;
      border-radius: 8px; cursor: pointer; color: var(--text-secondary);
      transition: all 150ms ease; position: relative; flex-shrink: 0;
      mat-icon { font-size: 20px !important; width: 20px !important; height: 20px !important;
        font-family: 'Material Icons Round', sans-serif !important; }
      &:hover { background: var(--bg-elevated); color: var(--text-primary); }
    }
    .notif-badge {
      position: absolute; top: 4px; right: 4px; width: 16px; height: 16px;
      background: #ef4444; color: white; border-radius: 50%;
      font-size: 9px; font-weight: 700; display: flex;
      align-items: center; justify-content: center;
      border: 2px solid var(--bg-surface);
    }
    .user-menu-trigger {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 8px 4px 4px; border: 1px solid var(--border-default);
      border-radius: 10px; background: transparent; cursor: pointer;
      transition: all 150ms ease; margin-left: 4px;
      &:hover { background: var(--bg-elevated); border-color: var(--text-muted); }
    }
  `],
})
export class HeaderComponent implements OnInit {
  uiStore     = inject(UiStore);
  theme       = inject(ThemeService);
  auth        = inject(AuthService);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  breadcrumb = signal<Breadcrumb>({ label: 'Dashboard' });

  notifications = signal([
    { id: 1, icon: 'person_add',    title: 'New user registered',     time: '2 min ago',   read: false },
    { id: 2, icon: 'assessment',    title: 'Monthly report is ready', time: '1 hour ago',  read: false },
    { id: 3, icon: 'warning_amber', title: 'Server usage at 85%',     time: '3 hours ago', read: false },
    { id: 4, icon: 'shopping_cart', title: 'New order #4720 received',time: '5 hours ago', read: true  },
    { id: 5, icon: 'check_circle',  title: 'Deployment successful',   time: 'Yesterday',   read: true  },
  ]);

  unreadCount = () => this.notifications().filter(n => !n.read).length;

  ngOnInit() {
    this.updateBreadcrumb(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((e: any) => this.updateBreadcrumb(e.urlAfterRedirects ?? e.url));
  }

  markRead(id: number) {
    this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  private updateBreadcrumb(url: string) {
    const path = url.split('?')[0];
    this.breadcrumb.set(ROUTE_MAP[path] ?? { label: 'Page' });
  }
}