import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';

  @Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
      <div class="min-h-screen flex items-center justify-center bg-base p-6">
        <div class="text-center animate-fade-in max-w-md">
          <!-- Illustration -->
          <div class="relative inline-block mb-6">
            <div class="text-[8rem] font-black leading-none select-none"
              style="background: linear-gradient(135deg, var(--accent-500), var(--accent-700));
                     -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              404
            </div>
            <div class="absolute inset-0 flex items-center justify-center text-5xl opacity-20 blur-sm
                        text-[8rem] font-black leading-none"
              style="-webkit-text-fill-color: var(--accent-500);">404</div>
          </div>

          <h2 class="text-2xl font-bold text-primary mb-2">Page Not Found</h2>
          <p class="text-muted mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a routerLink="/dashboard"
              class="px-6 py-2.5 bg-accent-600 text-white rounded-xl font-medium
                     hover:bg-accent-700 transition-colors text-sm">
              ← Go to Dashboard
            </a>
            <button onclick="history.back()"
              class="px-6 py-2.5 border border-border text-secondary rounded-xl font-medium
                     hover:bg-elevated transition-colors text-sm cursor-pointer bg-transparent">
              Go Back
            </button>
          </div>

          <!-- Suggestions -->
          <div class="mt-10 pt-6 border-t border-border">
            <p class="text-xs text-muted mb-3">You might be looking for:</p>
            <div class="flex flex-wrap gap-2 justify-center">
              @for (link of suggestions; track link.label) {
                <a [routerLink]="link.route"
                  class="px-3 py-1 text-xs rounded-full border border-border
                         text-secondary hover:text-accent-600 hover:border-accent-300
                         transition-colors">
                  {{ link.label }}
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    `,
  })
  export default class NotFoundComponent {
    suggestions = [
      { label: 'Dashboard',  route: '/dashboard'   },
      { label: 'Analytics',  route: '/analytics'   },
      { label: 'Tables',     route: '/tables/basic' },
      { label: 'Charts',     route: '/charts'       },
      { label: 'Settings',   route: '/settings'     },
    ];
  }