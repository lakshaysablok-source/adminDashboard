import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';

  @Component({
    selector: 'app-server-error',
    standalone: true,
    imports: [RouterLink],
    template: `
      <div class="min-h-screen flex items-center justify-center bg-base p-6">
        <div class="text-center animate-fade-in max-w-md">
          <div class="text-[8rem] font-black leading-none select-none mb-2"
            style="background: linear-gradient(135deg, #f59e0b, #b45309);
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            500
          </div>

          <div class="text-5xl mb-4">⚙️ </div>
          <h2 class="text-2xl font-bold text-primary mb-2">Internal Server Error</h2>
          <p class="text-muted mb-8 leading-relaxed">
            Something went wrong on our end. Our team has been notified
            and is working to fix the issue.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button onclick="window.location.reload()"
              class="px-6 py-2.5 bg-accent-600 text-white rounded-xl font-medium
                     hover:bg-accent-700 transition-colors text-sm cursor-pointer border-none">
              ↻ Retry
            </button>
            <a routerLink="/dashboard"
              class="px-6 py-2.5 border border-border text-secondary rounded-xl font-medium
                     hover:bg-elevated transition-colors text-sm">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  })
  export default class ServerErrorComponent {}