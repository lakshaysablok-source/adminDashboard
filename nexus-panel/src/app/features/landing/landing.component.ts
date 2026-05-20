import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div style="min-height:100vh;background:var(--bg-base);color:var(--text-primary);overflow-x:hidden">

      <!-- Nav -->
      <nav style="position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:rgba(var(--bg-base-rgb,255,255,255),.85);border-bottom:1px solid var(--border-default);padding:0 24px">
        <div style="max-width:1140px;margin:0 auto;height:60px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center">
              <mat-icon style="color:#fff;font-size:18px;width:18px;height:18px">dashboard</mat-icon>
            </div>
            <span style="font-size:17px;font-weight:800;letter-spacing:-.03em">Nexus Panel</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <a routerLink="/auth/login" style="padding:8px 16px;border-radius:9px;font-size:13px;font-weight:600;color:var(--text-secondary);text-decoration:none;transition:color .15s"
               onmouseenter="this.style.color='var(--accent-500)'" onmouseleave="this.style.color='var(--text-secondary)'">Sign In</a>
            <a routerLink="/dashboard" style="padding:8px 18px;border-radius:9px;background:var(--accent-500);color:#fff;font-size:13px;font-weight:600;text-decoration:none;transition:opacity .15s"
               onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">Live Demo</a>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="max-width:1140px;margin:0 auto;padding:80px 24px 64px;text-align:center">
        <div style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:9999px;background:rgba(99,102,241,.1);color:var(--accent-500);font-size:12px;font-weight:700;margin-bottom:24px">
          <mat-icon style="font-size:14px;width:14px;height:14px">new_releases</mat-icon>
          Angular 19 · Tailwind CSS · 30+ Pages
        </div>
        <h1 style="font-size:56px;font-weight:900;letter-spacing:-.05em;line-height:1.05;margin-bottom:20px;max-width:820px;margin-left:auto;margin-right:auto">
          The last admin template<br>
          <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">you'll ever need</span>
        </h1>
        <p style="font-size:17px;color:var(--text-muted);line-height:1.7;max-width:560px;margin:0 auto 36px">
          Nexus Panel is a production-ready Angular admin dashboard with a beautiful design system, dark mode, 6 accent colors, and 30+ fully built pages.
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap">
          <a routerLink="/dashboard"
             style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:12px;background:var(--accent-500);color:#fff;font-size:15px;font-weight:700;text-decoration:none;transition:opacity .15s"
             onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
            <mat-icon style="font-size:18px;width:18px;height:18px">play_arrow</mat-icon>
            View Live Demo
          </a>
          <a href="#features"
             style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:12px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-primary);font-size:15px;font-weight:600;text-decoration:none;transition:border-color .15s"
             onmouseenter="this.style.borderColor='var(--accent-500)'" onmouseleave="this.style.borderColor='var(--border-default)'">
            <mat-icon style="font-size:18px;width:18px;height:18px">info</mat-icon>
            Learn More
          </a>
        </div>

        <!-- Stats bar -->
        <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:40px;margin-top:56px;padding-top:40px;border-top:1px solid var(--border-default)">
          @for (stat of stats; track stat.label) {
            <div style="text-align:center">
              <div style="font-size:28px;font-weight:900;color:var(--text-primary);letter-spacing:-.04em">{{ stat.value }}</div>
              <div style="font-size:13px;color:var(--text-muted);margin-top:4px">{{ stat.label }}</div>
            </div>
          }
        </div>
      </section>

      <!-- Dashboard preview card -->
      <section style="max-width:1100px;margin:0 auto 80px;padding:0 24px">
        <div style="border-radius:20px;overflow:hidden;border:1px solid var(--border-default);box-shadow:0 32px 80px rgba(0,0,0,.12)">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:12px 16px;display:flex;align-items:center;gap:6px">
            <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4)"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4)"></div>
            <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4)"></div>
            <span style="margin-left:8px;font-size:12px;color:rgba(255,255,255,.7)">nexuspanel.app/dashboard</span>
          </div>
          <div style="background:var(--bg-card);padding:32px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
            @for (card of previewCards; track card.label) {
              <div style="background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:12px;padding:16px">
                <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">{{ card.label }}</div>
                <div style="font-size:22px;font-weight:900;color:var(--text-primary)">{{ card.value }}</div>
                <div style="font-size:11px;color:#16a34a;margin-top:4px">{{ card.change }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" style="max-width:1140px;margin:0 auto;padding:0 24px 80px">
        <div style="text-align:center;margin-bottom:48px">
          <h2 style="font-size:36px;font-weight:900;letter-spacing:-.04em;margin-bottom:12px">Everything you need, nothing you don't</h2>
          <p style="font-size:15px;color:var(--text-muted);max-width:480px;margin:0 auto">Built for developers who want to ship fast without compromising on quality.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
          @for (feat of features; track feat.title) {
            <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:16px;padding:24px;transition:transform .2s,box-shadow .2s"
                 onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,.1)'"
                 onmouseleave="this.style.transform='none';this.style.boxShadow='none'">
              <div style="width:44px;height:44px;border-radius:12px;background:rgba(99,102,241,.1);display:flex;align-items:center;justify-content:center;margin-bottom:16px">
                <mat-icon style="font-size:22px;width:22px;height:22px;color:var(--accent-500)">{{ feat.icon }}</mat-icon>
              </div>
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:8px">{{ feat.title }}</h3>
              <p style="font-size:13px;color:var(--text-muted);line-height:1.6">{{ feat.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Pages list -->
      <section style="background:var(--bg-card);border-top:1px solid var(--border-default);border-bottom:1px solid var(--border-default);padding:64px 24px">
        <div style="max-width:1140px;margin:0 auto">
          <div style="text-align:center;margin-bottom:40px">
            <h2 style="font-size:32px;font-weight:900;letter-spacing:-.04em;margin-bottom:10px">30+ Pages included</h2>
            <p style="font-size:14px;color:var(--text-muted)">Every page is fully built — no placeholders, no lorem ipsum.</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
            @for (page of pages; track page) {
              <span style="padding:6px 14px;border-radius:8px;background:var(--bg-elevated);border:1px solid var(--border-default);font-size:13px;color:var(--text-secondary);font-weight:500">{{ page }}</span>
            }
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section style="max-width:680px;margin:80px auto;padding:0 24px;text-align:center">
        <h2 style="font-size:36px;font-weight:900;letter-spacing:-.04em;margin-bottom:16px">Ready to build faster?</h2>
        <p style="font-size:15px;color:var(--text-muted);margin-bottom:32px;line-height:1.7">Start with a solid foundation. Nexus Panel is your shortcut from idea to production.</p>
        <a routerLink="/dashboard"
           style="display:inline-flex;align-items:center;gap:8px;padding:16px 36px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:16px;font-weight:700;text-decoration:none;transition:opacity .15s;box-shadow:0 8px 32px rgba(99,102,241,.35)"
           onmouseenter="this.style.opacity='.9'" onmouseleave="this.style.opacity='1'">
          <mat-icon style="font-size:20px;width:20px;height:20px">rocket_launch</mat-icon>
          Try the Live Demo
        </a>
      </section>

      <!-- Footer -->
      <footer style="border-top:1px solid var(--border-default);padding:24px;text-align:center;font-size:13px;color:var(--text-muted)">
        © 2025 Nexus Panel · Built with Angular 19 · Available on ThemeForest
      </footer>

    </div>
  `,
})
export default class LandingComponent {
  stats = [
    { value: '30+',  label: 'Pages & Views'      },
    { value: '6',    label: 'Accent Colors'       },
    { value: 'Dark', label: '+ Light Mode'        },
    { value: 'A19',  label: 'Angular 19'          },
    { value: '100%', label: 'Standalone Components' },
  ];

  previewCards = [
    { label: 'Total Revenue',  value: '$84.2K', change: '+12.5% this month' },
    { label: 'Active Users',   value: '3,821',  change: '+8.1% this month'  },
    { label: 'New Orders',     value: '642',    change: '+5.4% this week'   },
    { label: 'Conversion',     value: '4.7%',   change: '+0.9% vs last'     },
  ];

  features = [
    { icon: 'dark_mode',         title: 'Dark & Light Mode',       desc: 'Seamless theme switching persisted to localStorage. Zero flash on reload.' },
    { icon: 'palette',           title: '6 Accent Colors',         desc: 'Indigo, Violet, Cyan, Rose, Amber, Emerald — switch live in the settings.' },
    { icon: 'bolt',              title: 'Angular 19 Signals',      desc: 'Modern reactive state with signals and computed values. No NgRx needed.' },
    { icon: 'responsive',        title: 'Fully Responsive',        desc: 'Every page is tested on mobile, tablet, and desktop breakpoints.' },
    { icon: 'lock',              title: 'Auth Guards',             desc: 'Route guards protecting all dashboard pages. Swap in your own auth backend.' },
    { icon: 'speed',             title: 'Lazy Loaded Routes',      desc: 'Every route is lazy loaded. Fast initial load, great Lighthouse scores.' },
    { icon: 'shopping_cart',     title: 'E-Commerce Pack',         desc: 'Products, orders, order detail, and product detail — all fully built.' },
    { icon: 'article',           title: 'Blog / CMS',             desc: 'Posts list, post detail with comments, and a rich new-post editor.' },
    { icon: 'view_kanban',       title: 'Kanban + Calendar',       desc: 'Drag-and-drop task board and a full month-view calendar with events.' },
    { icon: 'group',             title: 'User Management',         desc: 'Users table, roles matrix, and permissions grid — all interactive.' },
    { icon: 'bar_chart',         title: 'Charts & Analytics',      desc: 'Dashboard analytics, chart library, and data visualizations.' },
    { icon: 'description',       title: 'Full Documentation',      desc: 'In-app docs covering setup, customization, and component reference.' },
  ];

  pages = [
    'Dashboard', 'Analytics', 'Basic Table', 'Advanced Table',
    'Form Elements', 'Form Validation', 'Charts', 'Buttons', 'Badges', 'Cards', 'Modals',
    'Kanban', 'Calendar', 'Chat', 'Invoice', 'File Manager',
    'Products', 'Product Detail', 'Orders', 'Order Detail',
    'Users', 'Roles & Permissions', 'Notifications', 'Activity Feed',
    'Pricing', 'Blog Posts', 'Post Detail', 'New Post',
    'Profile', 'Settings', 'FAQ', 'Docs',
    '404', '403', '500', 'Coming Soon', 'Maintenance',
  ];
}