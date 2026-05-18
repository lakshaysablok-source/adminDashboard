import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiStore } from '../../store/ui.store';
import { NAV_CONFIG } from '../../core/config/nav.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  template: `
    <aside class="sidebar" [class.collapsed]="uiStore.sidebarCollapsed()">

      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-mark">N</div>
        @if (!uiStore.sidebarCollapsed()) {
          <div class="logo-text">
            <span class="logo-name">NexusPanel</span>
            <span class="logo-version">v1.0</span>
          </div>
        }
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        @for (group of navConfig; track group.label) {
          <div class="nav-group">
            @if (!uiStore.sidebarCollapsed()) {
              <div class="nav-group-label">{{ group.label }}</div>
            } @else {
              <div class="nav-divider"></div>
            }

            @for (item of group.items; track item.label) {

              <!-- Parent item with children -->
              @if (item.children) {
                <div>
                  <button class="nav-item"
                    [class.nav-item--active]="isExpanded(item.label)"
                    (click)="toggle(item.label)"
                    [matTooltip]="uiStore.sidebarCollapsed() ? item.label : ''"
                    matTooltipPosition="right">
                    <span class="nav-icon">
                      <mat-icon>{{ item.icon }}</mat-icon>
                    </span>
                    @if (!uiStore.sidebarCollapsed()) {
                      <span class="nav-label">{{ item.label }}</span>
                      <mat-icon class="nav-chevron" [class.nav-chevron--open]="isExpanded(item.label)">
                        expand_more
                      </mat-icon>
                    }
                  </button>

                  @if (isExpanded(item.label) && !uiStore.sidebarCollapsed()) {
                    <div class="nav-children">
                      @for (child of item.children; track child.label) {
                        <a class="nav-child"
                          [routerLink]="child.route"
                          routerLinkActive="nav-child--active"
                          [routerLinkActiveOptions]="{ exact: true }">
                          <span class="nav-child-dot"></span>
                          {{ child.label }}
                        </a>
                      }
                    </div>
                  }
                </div>

              <!-- Leaf item -->
              } @else {
                <a class="nav-item"
                  [routerLink]="item.route"
                  routerLinkActive="nav-item--active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  [matTooltip]="uiStore.sidebarCollapsed() ? item.label : ''"
                  matTooltipPosition="right">
                  <span class="nav-icon">
                    <mat-icon>{{ item.icon }}</mat-icon>
                  </span>
                  @if (!uiStore.sidebarCollapsed()) {
                    <span class="nav-label">{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="nav-badge">{{ item.badge }}</span>
                    }
                  }
                </a>
              }

            }
          </div>
        }
      </nav>

      <!-- Footer -->
      @if (!uiStore.sidebarCollapsed()) {
        <div class="sidebar-footer">
          <div class="sidebar-footer-card">
            <p class="text-xs font-semibold text-white/80 mb-0.5">Upgrade to Pro</p>
            <p class="text-[11px] text-white/50 leading-relaxed">Unlock all features and components</p>
          </div>
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      height: 100vh;
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      background: linear-gradient(180deg, #1e1b4b 0%, #2d2a6e 100%);
      overflow-y: auto;
      overflow-x: hidden;
      transition: width 300ms cubic-bezier(.4,0,.2,1),
                  min-width 300ms cubic-bezier(.4,0,.2,1);
      z-index: 40;

      &.collapsed {
        width: var(--sidebar-collapsed);
        min-width: var(--sidebar-collapsed);
      }

      &::-webkit-scrollbar { width: 0; }
    }

    /* ── Logo ── */
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      height: var(--header-height);
      padding: 0 16px;
      border-bottom: 1px solid rgba(255,255,255,.07);
      flex-shrink: 0;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      min-width: 36px;
      background: linear-gradient(135deg, #818cf8, #6366f1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
      color: white;
      box-shadow: 0 4px 12px rgba(99,102,241,.4);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      white-space: nowrap;
    }

    .logo-name {
      font-size: 15px;
      font-weight: 700;
      color: rgba(255,255,255,.95);
      letter-spacing: -.01em;
    }

    .logo-version {
      font-size: 10px;
      color: rgba(255,255,255,.35);
      font-weight: 500;
    }

    /* ── Nav ── */
    .sidebar-nav {
      flex: 1;
      padding: 8px 0 16px;
      overflow-y: auto;
      overflow-x: hidden;
      &::-webkit-scrollbar { width: 0; }
    }

    .nav-group {
      margin-bottom: 4px;
    }

    .nav-group-label {
      padding: 16px 20px 6px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: rgba(255,255,255,.3);
      white-space: nowrap;
      overflow: hidden;
    }

    .nav-divider {
      height: 1px;
      background: rgba(255,255,255,.07);
      margin: 8px 12px;
    }

    /* ── Nav Item ── */
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 0 12px;
      height: 40px;
      margin: 1px 0;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: rgba(255,255,255,.55);
      font-size: 13px;
      font-weight: 500;
      font-family: 'Inter', system-ui, sans-serif;
      text-decoration: none;
      background: transparent;
      transition: all 150ms ease;
      white-space: nowrap;
      overflow: hidden;
      position: relative;

      &:hover {
        color: rgba(255,255,255,.9);
        background: rgba(255,255,255,.07);
      }

      &.nav-item--active {
        color: #fff;
        background: rgba(255,255,255,.12);
        font-weight: 600;

        .nav-icon mat-icon { color: #a5b4fc; }

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #818cf8;
          border-radius: 0 3px 3px 0;
        }
      }
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      min-width: 20px;

      mat-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        color: inherit;
        font-family: 'Material Icons Round', sans-serif !important;
      }
    }

    .nav-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-chevron {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: rgba(255,255,255,.3);
      transition: transform 200ms ease;
      font-family: 'Material Icons Round', sans-serif !important;

      &.nav-chevron--open { transform: rotate(180deg); }
    }

    .nav-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 9999px;
      background: #818cf8;
      color: white;
      letter-spacing: .04em;
    }

    /* ── Children ── */
    .nav-children {
      margin-left: 42px;
      margin-right: 8px;
      padding-bottom: 4px;
    }

    .nav-child {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 8px;
      font-size: 12.5px;
      font-weight: 500;
      color: rgba(255,255,255,.45);
      text-decoration: none;
      border-radius: 6px;
      transition: all 150ms ease;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        color: rgba(255,255,255,.85);
        background: rgba(255,255,255,.05);
      }

      &.nav-child--active {
        color: #c7d2fe;
        font-weight: 600;
      }
    }

    .nav-child-dot {
      width: 4px;
      height: 4px;
      min-width: 4px;
      border-radius: 50%;
      background: currentColor;
      opacity: .6;
    }

    /* ── Footer ── */
    .sidebar-footer {
      padding: 12px;
      flex-shrink: 0;
    }

    .sidebar-footer-card {
      padding: 12px 14px;
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 10px;
    }
  `],
})
export class SidebarComponent {
  uiStore   = inject(UiStore);
  navConfig = NAV_CONFIG;
  expanded  = signal<Set<string>>(new Set(['Tables', 'Forms', 'UI Elements']));

  isExpanded(label: string) { return this.expanded().has(label); }

  toggle(label: string) {
    this.expanded.update(s => {
      const n = new Set(s);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });
  }
}