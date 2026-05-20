import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface DocSection { id: string; title: string; icon: string; content: DocBlock[]; }
interface DocBlock { type: 'text' | 'code' | 'note' | 'warning' | 'steps'; body: string; steps?: string[]; }

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="animate-fade-in" style="display:grid;grid-template-columns:220px 1fr;gap:28px;align-items:start">

      <!-- Sidebar nav -->
      <div style="position:sticky;top:20px;background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;overflow:hidden">
        <div style="padding:14px 16px;border-bottom:1px solid var(--border-default)">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">Documentation</div>
        </div>
        <nav style="padding:8px">
          @for (s of sections; track s.id) {
            <button (click)="active.set(s.id)"
                    [style.background]="active() === s.id ? 'rgba(99,102,241,.1)' : 'transparent'"
                    [style.color]="active() === s.id ? 'var(--accent-500)' : 'var(--text-secondary)'"
                    style="width:100%;display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:9px;border:none;cursor:pointer;font-size:13px;font-weight:500;text-align:left;transition:all .15s">
              <mat-icon style="font-size:15px;width:15px;height:15px">{{ s.icon }}</mat-icon>
              {{ s.title }}
            </button>
          }
        </nav>
        <div style="padding:14px 16px;border-top:1px solid var(--border-default)">
          <div style="font-size:11px;color:var(--text-muted)">v1.0.0 · Angular 19</div>
        </div>
      </div>

      <!-- Content -->
      <div style="min-width:0">
        @for (section of sections; track section.id) {
          @if (active() === section.id) {
            <div>
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border-default)">
                <div style="width:42px;height:42px;border-radius:12px;background:rgba(99,102,241,.1);display:flex;align-items:center;justify-content:center">
                  <mat-icon style="font-size:22px;width:22px;height:22px;color:var(--accent-500)">{{ section.icon }}</mat-icon>
                </div>
                <h1 style="font-size:24px;font-weight:800;color:var(--text-primary);letter-spacing:-.03em">{{ section.title }}</h1>
              </div>
              <div style="display:flex;flex-direction:column;gap:18px">
                @for (block of section.content; track block.body) {
                  @if (block.type === 'text') {
                    <p style="font-size:14px;color:var(--text-secondary);line-height:1.8">{{ block.body }}</p>
                  }
                  @if (block.type === 'code') {
                    <pre style="background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:12px;padding:18px;font-size:13px;overflow-x:auto;color:var(--accent-400);line-height:1.7;margin:0">{{ block.body }}</pre>
                  }
                  @if (block.type === 'note') {
                    <div style="display:flex;gap:12px;padding:14px 16px;border-radius:10px;background:rgba(99,102,241,.06);border-left:3px solid var(--accent-500)">
                      <mat-icon style="font-size:18px;width:18px;height:18px;color:var(--accent-500);flex-shrink:0;margin-top:1px">info</mat-icon>
                      <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin:0">{{ block.body }}</p>
                    </div>
                  }
                  @if (block.type === 'warning') {
                    <div style="display:flex;gap:12px;padding:14px 16px;border-radius:10px;background:rgba(245,158,11,.06);border-left:3px solid #f59e0b">
                      <mat-icon style="font-size:18px;width:18px;height:18px;color:#f59e0b;flex-shrink:0;margin-top:1px">warning</mat-icon>
                      <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin:0">{{ block.body }}</p>
                    </div>
                  }
                  @if (block.type === 'steps') {
                    <ol style="margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:10px">
                      @for (step of block.steps; track step; let i = $index) {
                        <li style="display:flex;gap:12px;align-items:flex-start">
                          <span style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--accent-500);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px">{{ i + 1 }}</span>
                          <span style="font-size:13px;color:var(--text-secondary);line-height:1.7">{{ step }}</span>
                        </li>
                      }
                    </ol>
                  }
                }
              </div>
            </div>
          }
        }
      </div>

    </div>
  `,
})
export default class DocsComponent {
  active = signal('getting-started');

  sections: DocSection[] = [
    {
      id: 'getting-started', title: 'Getting Started', icon: 'rocket_launch',
      content: [
        { type: 'text', body: 'Welcome to Nexus Panel — a premium Angular 19 admin dashboard template. This documentation will guide you through setup, customization, and deployment.' },
        { type: 'note', body: 'Requires Node.js 18+ and Angular CLI 19. Run `node -v` and `ng version` to verify your environment before starting.' },
        { type: 'steps', body: '', steps: [
          'Download and unzip the Nexus Panel package from your purchase.',
          'Open a terminal and navigate to the project folder: `cd nexus-panel`',
          'Install dependencies: `npm install`',
          'Start the development server: `ng serve`',
          'Open http://localhost:4200 in your browser.',
          'Login with demo credentials: admin@nexus.com / password',
        ]},
        { type: 'code', body: '# Clone or extract, then:\nnpm install\nng serve\n\n# Production build:\nng build --configuration production' },
      ],
    },
    {
      id: 'folder-structure', title: 'Folder Structure', icon: 'folder_open',
      content: [
        { type: 'text', body: 'Nexus Panel uses a feature-based folder structure. Each route is a standalone component in its own folder. This enables lazy loading and keeps the codebase organized as it grows.' },
        { type: 'code', body: 'src/app/\n  core/\n    config/        ← nav.config.ts (sidebar nav)\n    guards/        ← auth.guard.ts, no-auth.guard.ts\n    services/      ← auth.service.ts, theme.service.ts\n  features/\n    dashboard/     ← one folder per page\n    analytics/\n    blog/\n    ...\n  layout/\n    layout.component.ts       ← main shell (sidebar + topbar)\n    auth-layout/              ← auth pages shell\n  app.routes.ts              ← all route definitions\n  app.config.ts              ← app bootstrap config' },
        { type: 'note', body: 'All components are standalone — no NgModules. Every feature is lazy loaded via loadComponent() for the best possible initial load performance.' },
      ],
    },
    {
      id: 'theming', title: 'Theming', icon: 'palette',
      content: [
        { type: 'text', body: 'Nexus Panel supports dark/light mode and 6 accent colors (Indigo, Violet, Cyan, Rose, Amber, Emerald). Theme state is managed by ThemeService and persisted to localStorage automatically.' },
        { type: 'code', body: '// src/app/core/services/theme.service.ts\n\n// Change accent color programmatically:\nthemeService.setAccent("cyan");\n\n// Toggle dark/light mode:\nthemeService.toggleMode();\n\n// Read current values:\nconsole.log(themeService.mode());   // "light" | "dark"\nconsole.log(themeService.accent()); // "indigo" | "violet" | ...' },
        { type: 'note', body: 'CSS custom properties (--accent-500, --bg-base, --text-primary, etc.) are defined in styles.scss and change automatically when data-mode or data-accent attributes are applied to the <html> element.' },
      ],
    },
    {
      id: 'adding-pages', title: 'Adding Pages', icon: 'add_circle',
      content: [
        { type: 'text', body: 'Adding a new page takes 3 steps: create the component, register the route, and add a nav entry.' },
        { type: 'steps', body: '', steps: [
          'Create a new folder: src/app/features/my-page/',
          'Create my-page.component.ts as a standalone component with `export default class MyPageComponent`',
          'Add the route in app.routes.ts inside the main shell children array',
          'Add a nav entry in src/app/core/config/nav.config.ts',
        ]},
        { type: 'code', body: '// app.routes.ts — add inside the children array:\n{ path: "my-page", loadComponent: () =>\n    import("./features/my-page/my-page.component") }\n\n// nav.config.ts — add to any group:\n{ label: "My Page", icon: "star", route: "/my-page" }' },
        { type: 'warning', body: 'Make sure your component uses `export default` (not `export class`). The loadComponent() dynamic import relies on the default export.' },
      ],
    },
    {
      id: 'authentication', title: 'Authentication', icon: 'lock',
      content: [
        { type: 'text', body: 'The included AuthService is a demo implementation using localStorage. It simulates login/logout without a real backend. For production, replace the service methods with HTTP calls to your own API.' },
        { type: 'code', body: '// src/app/core/services/auth.service.ts\n// Replace login() with a real HTTP call:\n\nlogin(email: string, password: string) {\n  return this.http.post("/api/auth/login", { email, password })\n    .pipe(tap(res => {\n      localStorage.setItem("token", res.token);\n      this.currentUser.set(res.user);\n    }));\n}' },
        { type: 'note', body: 'The route guards (auth.guard.ts and no-auth.guard.ts) check AuthService.isLoggedIn(). As long as your AuthService sets this signal correctly, the guards will work without modification.' },
      ],
    },
    {
      id: 'deployment', title: 'Deployment', icon: 'cloud_upload',
      content: [
        { type: 'text', body: 'Nexus Panel is a Single Page Application (SPA). You deploy the static output from `ng build`. The built files go into dist/nexus-panel/browser/.' },
        { type: 'steps', body: '', steps: [
          'Run: ng build --configuration production',
          'The output is in dist/nexus-panel/browser/',
          'Deploy to your chosen host (see options below)',
          'Configure your host to redirect all 404s to index.html (required for Angular routing)',
        ]},
        { type: 'code', body: '# Netlify — create src/_redirects file:\n/*  /index.html  200\n\n# Firebase — firebase.json:\n"rewrites": [{ "source": "**", "destination": "/index.html" }]\n\n# Vercel — vercel.json:\n{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }' },
        { type: 'warning', body: 'Without the redirect rule, directly accessing any route (e.g. /dashboard) on a hard refresh will return a 404 error from the server.' },
      ],
    },
    {
      id: 'changelog', title: 'Changelog', icon: 'history',
      content: [
        { type: 'text', body: 'Nexus Panel follows semantic versioning. Breaking changes are documented here.' },
        { type: 'code', body: 'v1.0.0 — Initial Release\n──────────────────────────────\n+ 30+ pages across 7 categories\n+ Dark/light mode with 6 accent colors\n+ Angular 19 standalone components + signals\n+ Blog: posts list, post detail, new post editor\n+ E-Commerce: products, orders, detail pages\n+ User management: users table + roles matrix\n+ Kanban, Calendar, Chat, Invoice, File Manager\n+ Coming Soon + Maintenance pages\n+ FAQ + Documentation pages\n+ Landing/marketing page\n+ Production build ready' },
      ],
    },
  ];
}