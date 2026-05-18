import { Component, inject, signal } from '@angular/core';
  import { RouterLink, RouterLinkActive } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { UiStore } from '../../store/ui.store';
  import { NAV_CONFIG, NavGroup, NavItem } from '../../core/config/nav.config';

  @Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
      <aside class="sidebar" [class.collapsed]="uiStore.sidebarCollapsed()">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">N</div>
          @if (!uiStore.sidebarCollapsed()) {
            <span class="logo-text">NexusPanel</span>
          }
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          @for (group of navConfig; track group.label) {
            <div class="nav-group">
              @if (!uiStore.sidebarCollapsed()) {
                <div class="nav-group-label">{{ group.label }}</div>
              }
              @for (item of group.items; track item.label) {
                <div class="nav-item-wrapper">
                  @if (item.children) {
                    <!-- Parent with children -->
                    <button class="nav-item" (click)="toggleExpanded(item.label)"
                      [class.expanded]="expandedItems().has(item.label)">
                      <span class="nav-icon">{{ item.icon }}</span>
                      @if (!uiStore.sidebarCollapsed()) {
                        <span class="nav-label">{{ item.label }}</span>
                        <span class="nav-chevron" [class.rotate]="expandedItems().has(item.label)">▾</span>
                      }
                    </button>
                    @if (expandedItems().has(item.label) && !uiStore.sidebarCollapsed()) {
                      <div class="nav-children">
                        @for (child of item.children; track child.label) {
                          <a class="nav-child" [routerLink]="child.route"
                            routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
                            {{ child.label }}
                          </a>
                        }
                      </div>
                    }
                  } @else {
                    <!-- Leaf item -->
                    <a class="nav-item" [routerLink]="item.route"
                      routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
                      [title]="uiStore.sidebarCollapsed() ? item.label : ''">
                      <span class="nav-icon">{{ item.icon }}</span>
                      @if (!uiStore.sidebarCollapsed()) {
                        <span class="nav-label">{{ item.label }}</span>
                        @if (item.badge) {
                          <span class="badge badge-accent text-xs">{{ item.badge }}</span>
                        }
                      }
                    </a>
                  }
                </div>
              }
            </div>
          }
        </nav>
      </aside>
    `,
    styles: [`
      .sidebar {
        background: var(--bg-surface);
        border-right: 1px solid var(--border-default);
        height: 100vh;
        position: sticky;
        top: 0;
        overflow-y: auto;
        overflow-x: hidden;
        transition: width 300ms cubic-bezier(0.4,0,0.2,1);
        width: var(--sidebar-width);
        display: flex;
        flex-direction: column;

        &.collapsed { width: var(--sidebar-collapsed); }
        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
      }

      .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--border-default);
        min-height: var(--header-height);
      }

      .logo-icon {
        width: 36px;
        height: 36px;
        background: var(--accent-600);
        color: white;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
        flex-shrink: 0;
      }

      .logo-text {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--text-primary);
        white-space: nowrap;
      }

      .sidebar-nav { padding: 0.75rem 0; flex: 1; }

      .nav-group { margin-bottom: 0.5rem; }

      .nav-group-label {
        padding: 0.5rem 1rem 0.25rem;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        text-transform: uppercase;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1rem;
        width: 100%;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0;
        text-decoration: none;
        transition: all 150ms ease;
        white-space: nowrap;
        position: relative;

        &:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        &.active {
          color: var(--accent-600);
          background: var(--accent-50);
          border-right: 3px solid var(--accent-500);
          font-weight: 600;
        }
      }

      .nav-icon { font-size: 0.8rem; width: 18px; flex-shrink: 0; }
      .nav-label { flex: 1; }
      .nav-chevron { font-size: 0.7rem; transition: transform 200ms ease; &.rotate { transform: rotate(180deg); } }

      .nav-children {
        padding-left: 2.75rem;
        overflow: hidden;
      }

      .nav-child {
        display: block;
        padding: 0.45rem 0.75rem;
        font-size: 0.825rem;
        color: var(--text-secondary);
        text-decoration: none;
        border-radius: var(--radius-sm);
        transition: all 150ms ease;
        white-space: nowrap;

        &:hover { color: var(--text-primary); background: var(--bg-elevated); }
        &.active { color: var(--accent-600); font-weight: 600; }
      }
    `],
  })
  export class SidebarComponent {
    uiStore  = inject(UiStore);
    navConfig = NAV_CONFIG;
    expandedItems = signal<Set<string>>(new Set());

    toggleExpanded(label: string) {
      this.expandedItems.update(set => {
        const next = new Set(set);
        next.has(label) ? next.delete(label) : next.add(label);
        return next;
      });
    }
  }