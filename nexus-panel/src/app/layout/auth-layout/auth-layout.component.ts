import { Component } from '@angular/core';
  import { RouterOutlet } from '@angular/router';

  @Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
      <div class="min-h-screen flex bg-base">
        <!-- Left Panel: Branding -->
        <div class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12
                    bg-accent-600 text-white relative overflow-hidden">
          <!-- Background circles decoration -->
          <div class="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3"></div>

          <div class="relative z-10 text-center">
            <div class="text-5xl font-bold mb-4">NexusPanel</div>
            <p class="text-xl text-white/80 mb-8">
              The premium Angular admin dashboard<br>built for modern web applications.
            </p>
            <div class="flex gap-6 justify-center">
              <div class="text-center">
                <div class="text-3xl font-bold">50+</div>
                <div class="text-white/70 text-sm">Components</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold">6</div>
                <div class="text-white/70 text-sm">Color Themes</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold">20+</div>
                <div class="text-white/70 text-sm">Pages</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Form -->
        <div class="flex-1 flex items-center justify-center p-8">
          <div class="w-full max-w-md">
            <div class="lg:hidden text-2xl font-bold text-accent-600 mb-8 text-center">
              NexusPanel
            </div>
            <router-outlet />
          </div>
        </div>
      </div>
    `,
  })
  export default class AuthLayoutComponent {}