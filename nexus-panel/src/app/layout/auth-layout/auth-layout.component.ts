import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex bg-base">

      <!-- Left Panel: Branding (hidden on mobile) -->
      <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12
                  relative overflow-hidden"
           style="background: linear-gradient(135deg, var(--accent-700) 0%, var(--accent-500) 100%)">

        <!-- Background decorations -->
        <div class="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5
                    -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-white/5
                    translate-x-1/3 translate-y-1/3"></div>
        <div class="absolute top-1/2 right-0 w-40 h-40 rounded-full bg-white/5
                    translate-x-1/2 -translate-y-1/2"></div>

        <!-- Top: Logo -->
        <div class="relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center
                        text-white font-black text-lg">N</div>
            <span class="text-white text-xl font-bold tracking-tight">NexusPanel</span>
          </div>
        </div>

        <!-- Middle: Headline + features -->
        <div class="relative z-10 space-y-8">
          <div>
            <h1 class="text-4xl font-bold text-white leading-tight mb-3">
              The modern Angular<br>admin dashboard
            </h1>
            <p class="text-white/70 text-lg">
              Built with Angular 19, Material Design, and Tailwind CSS.
              Everything you need to ship faster.
            </p>
          </div>

          <div class="space-y-3">
            @for (feat of features; track feat.text) {
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8"
                          stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span class="text-white/85 text-sm">{{ feat.text }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Bottom: Stats -->
        <div class="relative z-10 flex gap-8 pt-8 border-t border-white/20">
          @for (stat of stats; track stat.label) {
            <div>
              <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
              <div class="text-white/60 text-xs mt-0.5">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>

      <!-- Right Panel: Auth form -->
      <div class="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div class="w-full max-w-md py-8">
          <!-- Mobile logo -->
          <div class="lg:hidden flex items-center gap-2 mb-8">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                 style="background:var(--accent-600)">N</div>
            <span class="text-xl font-bold text-primary">NexusPanel</span>
          </div>
          <router-outlet />
        </div>
      </div>

    </div>
  `,
})
export default class AuthLayoutComponent {
  features = [
    { text: '6 accent color themes + dark mode' },
    { text: 'Role-based auth (Admin / Editor / Viewer)' },
    { text: '20+ pages — tables, charts, forms, UI kit' },
    { text: 'Fully responsive — mobile, tablet, desktop' },
    { text: 'Built with Angular 19 standalone components' },
  ];

  stats = [
    { value: '50+', label: 'Components' },
    { value: '6',   label: 'Color themes' },
    { value: '20+', label: 'Pages' },
    { value: '100%', label: 'TypeScript' },
  ];
}