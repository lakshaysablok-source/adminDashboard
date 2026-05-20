import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface FaqItem { q: string; a: string; open: boolean; }
interface FaqGroup { category: string; icon: string; items: FaqItem[]; }

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fade-in">

      <!-- Hero -->
      <div style="text-align:center;padding:24px 0 8px">
        <div style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:9999px;background:rgba(99,102,241,.1);color:var(--accent-500);font-size:12px;font-weight:700;margin-bottom:16px">
          <mat-icon style="font-size:14px;width:14px;height:14px">help_outline</mat-icon>
          Help Center
        </div>
        <h1 style="font-size:30px;font-weight:900;color:var(--text-primary);letter-spacing:-.03em">Frequently Asked Questions</h1>
        <p style="font-size:14px;color:var(--text-muted);margin-top:10px;max-width:480px;margin-left:auto;margin-right:auto">
          Can't find what you're looking for? <a href="#" style="color:var(--accent-500);text-decoration:none">Contact support</a>
        </p>

        <!-- Search -->
        <div style="position:relative;max-width:480px;margin:20px auto 0">
          <mat-icon style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:18px;width:18px;height:18px;color:var(--text-muted)">search</mat-icon>
          <input [(ngModel)]="search" placeholder="Search questions…"
                 style="width:100%;padding:12px 16px 12px 42px;border-radius:12px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-primary);font-size:14px;outline:none;box-sizing:border-box"/>
        </div>
      </div>

      <!-- Category chips -->
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px">
        @for (g of groups(); track g.category) {
          <button (click)="activeCategory.set(activeCategory() === g.category ? '' : g.category)"
                  [style.background]="activeCategory() === g.category ? 'var(--accent-500)' : 'var(--bg-card)'"
                  [style.color]="activeCategory() === g.category ? '#fff' : 'var(--text-secondary)'"
                  style="display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:9999px;border:1px solid var(--border-default);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s">
            <mat-icon style="font-size:14px;width:14px;height:14px">{{ g.icon }}</mat-icon>
            {{ g.category }}
          </button>
        }
      </div>

      <!-- FAQ groups -->
      <div style="max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:28px">
        @for (group of filtered(); track group.category) {
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
              <div style="width:32px;height:32px;border-radius:9px;background:rgba(99,102,241,.1);display:flex;align-items:center;justify-content:center">
                <mat-icon style="font-size:17px;width:17px;height:17px;color:var(--accent-500)">{{ group.icon }}</mat-icon>
              </div>
              <h2 style="font-size:15px;font-weight:800;color:var(--text-primary)">{{ group.category }}</h2>
              <span style="font-size:12px;color:var(--text-muted)">({{ group.items.length }})</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              @for (item of group.items; track item.q) {
                <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:12px;overflow:hidden;transition:border-color .15s"
                     [style.border-color]="item.open ? 'var(--accent-500)' : 'var(--border-default)'">
                  <button (click)="item.open = !item.open"
                          style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:transparent;border:none;cursor:pointer;text-align:left;gap:12px">
                    <span style="font-size:14px;font-weight:600;color:var(--text-primary)">{{ item.q }}</span>
                    <mat-icon style="font-size:18px;width:18px;height:18px;color:var(--text-muted);flex-shrink:0;transition:transform .2s"
                              [style.transform]="item.open ? 'rotate(180deg)' : 'rotate(0)'">expand_more</mat-icon>
                  </button>
                  @if (item.open) {
                    <div style="padding:0 18px 16px;font-size:13px;color:var(--text-muted);line-height:1.7;border-top:1px solid var(--border-default);padding-top:14px">
                      {{ item.a }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }

        @if (filtered().length === 0) {
          <div style="text-align:center;padding:48px;background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px">
            <mat-icon style="font-size:40px;width:40px;height:40px;color:var(--text-muted);display:block;margin:0 auto 12px">search_off</mat-icon>
            <p style="color:var(--text-muted);font-size:14px">No questions match your search.</p>
          </div>
        }
      </div>

      <!-- Still need help CTA -->
      <div style="max-width:760px;margin:0 auto;background:linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.08));border:1px solid rgba(99,102,241,.2);border-radius:16px;padding:32px;text-align:center">
        <mat-icon style="font-size:36px;width:36px;height:36px;color:var(--accent-500);display:block;margin:0 auto 12px">support_agent</mat-icon>
        <h3 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:8px">Still have questions?</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px">Our support team typically replies within 24 hours.</p>
        <a href="mailto:support@nexuspanel.com"
           style="display:inline-flex;align-items:center;gap:6px;padding:10px 24px;border-radius:10px;background:var(--accent-500);color:#fff;font-size:13px;font-weight:600;text-decoration:none">
          <mat-icon style="font-size:16px;width:16px;height:16px">mail</mat-icon>
          Email Support
        </a>
      </div>

    </div>
  `,
})
export default class FaqComponent {
  search = '';
  activeCategory = signal('');

  groups = signal<FaqGroup[]>([
    {
      category: 'Getting Started', icon: 'rocket_launch', items: [
        { q: 'What is Nexus Panel?', a: 'Nexus Panel is a premium Angular 19 admin dashboard template with 30+ pages, dark/light mode, multiple accent colors, and production-ready components. It\'s built with standalone components, Angular signals, and Tailwind CSS.', open: false },
        { q: 'What technologies are used?', a: 'Angular 19, TypeScript, Tailwind CSS, Angular Material, standalone components, and Angular Signals for reactive state management. No extra state management library needed.', open: false },
        { q: 'How do I run the project locally?', a: 'Install Node.js 18+, run `npm install` in the project root, then `ng serve`. The app will be available at http://localhost:4200.', open: false },
        { q: 'Do I need an Angular license?', a: 'No. Angular is open-source and free. You only need to purchase a Nexus Panel license to use this template in your projects.', open: false },
      ],
    },
    {
      category: 'Customization', icon: 'palette', items: [
        { q: 'How do I change the accent color?', a: 'Click the palette icon in the top navigation bar. You can switch between Indigo, Violet, Cyan, Rose, Amber, and Emerald. The selection is persisted to localStorage automatically.', open: false },
        { q: 'How do I switch between light and dark mode?', a: 'Click the sun/moon icon in the top bar. The theme is saved automatically and will persist across browser sessions.', open: false },
        { q: 'Can I add my own pages?', a: 'Yes. Create a new standalone component in `src/app/features/`, add a route in `app.routes.ts`, and add a nav entry in `nav.config.ts`. All pages are lazy-loaded automatically.', open: false },
        { q: 'How do I change the logo or app name?', a: 'The logo and app name are in `src/app/layout/layout.component.ts`. Search for "Nexus" and replace with your brand name and icon.', open: false },
      ],
    },
    {
      category: 'License & Usage', icon: 'verified', items: [
        { q: 'Can I use this in a commercial project?', a: 'Yes. A Regular License allows use in one end product where end users are not charged. An Extended License allows use in a product sold to end users (e.g. a SaaS app).', open: false },
        { q: 'Can I use this for multiple projects?', a: 'Each license covers one project. For multiple projects, you need to purchase a license for each, or contact us for a multi-license deal.', open: false },
        { q: 'Is support included?', a: '6 months of support is included with every purchase. This covers bug fixes and general questions about using the template. Feature requests are not included.', open: false },
      ],
    },
    {
      category: 'Technical', icon: 'code', items: [
        { q: 'Is the authentication real or mock?', a: 'The included authentication is a demo using localStorage. For production, replace the AuthService with calls to your own backend (REST, Firebase, Auth0, etc.).', open: false },
        { q: 'How do I connect a real API?', a: 'Replace the mock data arrays in each component with HTTP calls using Angular\'s `HttpClient`. Create services in `src/app/core/services/` and inject them into components.', open: false },
        { q: 'Does it support SSR (Server-Side Rendering)?', a: 'The current build is a Single Page Application (SPA). Angular Universal can be added for SSR, but it requires additional configuration not included in this template.', open: false },
        { q: 'How do I deploy to production?', a: 'Run `ng build --configuration production`. This generates the `dist/nexus-panel/browser/` folder. Deploy that folder to any static host: Netlify, Vercel, Firebase Hosting, or a CDN.', open: false },
      ],
    },
  ]);

  filtered() {
    let data = this.groups();
    if (this.activeCategory()) data = data.filter(g => g.category === this.activeCategory());
    if (!this.search.trim()) return data;
    const q = this.search.toLowerCase();
    return data.map(g => ({
      ...g,
      items: g.items.filter(i => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
    })).filter(g => g.items.length > 0);
  }
}