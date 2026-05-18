import { Injectable, signal, effect } from '@angular/core';

  export type ThemeMode   = 'light' | 'dark';
  export type AccentColor = 'indigo' | 'violet' | 'cyan' | 'rose' | 'amber' | 'emerald';

  @Injectable({ providedIn: 'root' })
  export class ThemeService {
    mode   = signal<ThemeMode>(this.getSaved('nexus_mode', 'light') as ThemeMode);
    accent = signal<AccentColor>(this.getSaved('nexus_accent', 'indigo') as AccentColor);

    constructor() {
      effect(() => {
        document.documentElement.setAttribute('data-mode',   this.mode());
        document.documentElement.setAttribute('data-accent', this.accent());
        localStorage.setItem('nexus_mode',   this.mode());
        localStorage.setItem('nexus_accent', this.accent());
      });
    }

    toggleMode() {
      this.mode.update(m => m === 'light' ? 'dark' : 'light');
    }

    setAccent(color: AccentColor) {
      this.accent.set(color);
    }

    private getSaved(key: string, fallback: string): string {
      return localStorage.getItem(key) ?? fallback;
    }
  }