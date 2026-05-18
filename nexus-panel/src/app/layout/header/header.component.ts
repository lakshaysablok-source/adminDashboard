import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiStore } from '../../store/ui.store';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatMenuModule, MatButtonModule,
            MatDividerModule, MatIconModule, MatTooltipModule],
  template: `
    <header class="app-header">

      <!-- Left -->
      <div class="flex items-center gap-2">
        <button class="header-icon-btn" (click)="uiStore.toggleSidebar()" matTooltip="Toggle sidebar">
          <mat-icon>menu</mat-icon>
        </button>

        <!-- Breadcrumb - hidden on small screens -->
        <div class="hidden md:flex items-center gap-1.5 text-sm">
          <span class="text-muted">NexusPanel</span>
          <mat-icon class="text-muted !text-base !w-4 !h-4">chevron_right</mat-icon>
          <span class="font-medium text-primary">Dashboard</span>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-1">

        <!-- Search -->
        <button class="header-icon-btn hidden sm:flex" matTooltip="Search (Ctrl+K)">
          <mat-icon>search</mat-icon>
        </button>

        <!-- Theme toggle -->
        <button class="header-icon-btn"
          (click)="theme.toggleMode()"
          [matTooltip]="theme.mode() === 'dark' ? 'Light mode' : 'Dark mode'">
          <mat-icon>{{ theme.mode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- Notifications -->
        <button class="header-icon-btn relative" [matMenuTriggerFor]="notifMenu"
          matTooltip="Notifications">
          <mat-icon>notifications</mat-icon>
          <span class="notif-badge">3</span>
        </button>

        <mat-menu #notifMenu="matMenu" xPosition="before" class="notif-panel">
          <div class="px-4 py-3 flex items-center justify-between border-b border-border"
            (click)="$event.stopPropagation()">
            <span class="font-semibold text-sm text-primary">Notifications</span>
            <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer">
              Mark all read
            </button>
          </div>
          <div class="w-80 max-h-80 overflow-y-auto">
            @for (n of notifications; track n.id) {
              <button mat-menu-item class="!h-auto !py-3">
                <div class="flex gap-3 items-start w-full">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    [style.background]="'var(--accent-50)'">
                    <mat-icon class="!text-base !w-4 !h-4" style="color:var(--accent-600)">
                      {{ n.icon }}
                    </mat-icon>
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
          <div class="px-4 py-2 border-t border-border" (click)="$event.stopPropagation()">
            <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer w-full text-center">
              View all notifications
            </button>
          </div>
        </mat-menu>

        <!-- User menu -->
        <button class="user-menu-trigger" [matMenuTriggerFor]="userMenu">
          <img [src]="auth.currentUser()?.avatar" class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
               alt="avatar" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=U'">
          <div class="hidden sm:flex flex-col items-start leading-tight">
            <span class="text-sm font-semibold text-primary max-w-[120px] truncate">
              {{ auth.currentUser()?.name }}
            </span>
            <span class="text-xs text-muted capitalize">
              {{ auth.currentUser()?.role }}
            </span>
          </div>
          <mat-icon class="text-muted !text-base !w-4 !h-4">expand_more</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="px-4 py-3 border-b border-border" (click)="$event.stopPropagation()">
            <p class="font-semibold text-sm text-primary">{{ auth.currentUser()?.name }}</p>
            <p class="text-xs text-muted">{{ auth.currentUser()?.email }}</p>
          </div>
          <button mat-menu-item [routerLink]="['/profile']">
            <mat-icon>person_outline</mat-icon> Profile
          </button>
          <button mat-menu-item [routerLink]="['/settings']">
            <mat-icon>settings</mat-icon> Settings
          </button>
          <mat-divider />
          <button mat-menu-item (click)="auth.logout()" class="!text-red-500">
            <mat-icon class="!text-red-500">logout</mat-icon> Sign out
          </button>
        </mat-menu>

      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height);
      padding: 0 1.25rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-default);
      position: sticky;
      top: 0;
      z-index: 30;
      gap: 12px;
    }

    .header-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 150ms ease;
      position: relative;
      flex-shrink: 0;

      mat-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
        font-family: 'Material Icons Round', sans-serif !important;
      }

      &:hover {
        background: var(--bg-elevated);
        color: var(--text-primary);
      }
    }

    .notif-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      font-size: 9px;
      font-weight: 700;
      display: flex;
      align-items: center;justify-content: center;
      line-height: 1;
      border: 2px solid var(--bg-surface);
    }

    .user-menu-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px 4px 4px;
      border: 1px solid var(--border-default);
      border-radius: 10px;
      background: transparent;
      cursor: pointer;
      transition: all 150ms ease;
      margin-left: 4px;

      &:hover {
        background: var(--bg-elevated);
        border-color: var(--text-muted);
      }
    }
  `],
})
export class HeaderComponent {
  uiStore = inject(UiStore);
  theme   = inject(ThemeService);
  auth    = inject(AuthService);

  notifications = [
    { id: 1, icon: 'person_add',    title: 'New user registered',    time: '2 min ago',   read: false },
    { id: 2, icon: 'assessment',    title: 'Monthly report is ready',time: '1 hour ago',  read: false },
    { id: 3, icon: 'warning_amber', title: 'Server usage at 85%',    time: '3 hours ago', read: false },
  ];
}