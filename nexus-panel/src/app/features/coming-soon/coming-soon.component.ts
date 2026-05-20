import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  template: `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:var(--bg-base);position:relative;overflow:hidden">

      <!-- Decorative blobs -->
      <div style="position:absolute;top:-120px;right:-120px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.15),transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-120px;left:-120px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.12),transparent 70%);pointer-events:none"></div>

      <div style="max-width:560px;width:100%;text-align:center;position:relative">

        <!-- Logo -->
        <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:48px">
          <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center">
            <mat-icon style="color:#fff;font-size:22px;width:22px;height:22px">dashboard</mat-icon>
          </div>
          <span style="font-size:20px;font-weight:800;color:var(--text-primary);letter-spacing:-.03em">Nexus Panel</span>
        </div>

        <!-- Icon -->
        <div style="width:80px;height:80px;border-radius:24px;background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.1));border:1px solid rgba(99,102,241,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 28px">
          <mat-icon style="font-size:40px;width:40px;height:40px;color:var(--accent-500)">rocket_launch</mat-icon>
        </div>

        <h1 style="font-size:42px;font-weight:900;color:var(--text-primary);letter-spacing:-.04em;line-height:1.1;margin-bottom:16px">
          Something big is<br>
          <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">coming soon</span>
        </h1>
        <p style="font-size:15px;color:var(--text-muted);line-height:1.7;margin-bottom:40px">
          We're working hard to bring you something amazing. Leave your email and we'll notify you the moment we launch.
        </p>

        <!-- Countdown -->
        <div style="display:flex;justify-content:center;gap:16px;margin-bottom:40px;flex-wrap:wrap">
          @for (unit of countdown(); track unit.label) {
            <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px 20px;min-width:72px">
              <div style="font-size:32px;font-weight:900;color:var(--text-primary);letter-spacing:-.04em;line-height:1">{{ unit.value }}</div>
              <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-top:4px">{{ unit.label }}</div>
            </div>
          }
        </div>

        <!-- Email signup -->
        @if (!subscribed()) {
          <div style="display:flex;gap:8px;max-width:400px;margin:0 auto 32px">
            <input [(ngModel)]="email" type="email" placeholder="Enter your email…"
                   style="flex:1;padding:12px 16px;border-radius:11px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-primary);font-size:14px;outline:none"/>
            <button (click)="subscribe()" [disabled]="!email.includes('@')"
                    style="padding:12px 20px;border-radius:11px;border:none;background:var(--accent-500);color:#fff;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:opacity .15s"
                    onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
              Notify Me
            </button>
          </div>
        } @else {
          <div style="display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:11px;background:rgba(34,197,94,.1);color:#16a34a;font-size:14px;font-weight:600;margin-bottom:32px">
            <mat-icon style="font-size:18px;width:18px;height:18px">check_circle</mat-icon>
            You're on the list! We'll be in touch.
          </div>
        }

        <!-- Progress bar -->
        <div style="margin-bottom:32px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:8px">
            <span>Launch progress</span><span>78% complete</span>
          </div>
          <div style="height:6px;border-radius:3px;background:var(--bg-elevated);overflow:hidden">
            <div style="height:100%;width:78%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6)"></div>
          </div>
        </div>

        <!-- Socials -->
        <div style="display:flex;justify-content:center;gap:12px">
          @for (s of socials; track s.label) {
            <a href="#" [title]="s.label"
               style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-muted);text-decoration:none;transition:all .15s"
               onmouseenter="this.style.borderColor='var(--accent-500)';this.style.color='var(--accent-500)'"
               onmouseleave="this.style.borderColor='var(--border-default)';this.style.color='var(--text-muted)'">
              <mat-icon style="font-size:16px;width:16px;height:16px">{{ s.icon }}</mat-icon>
            </a>
          }
        </div>

      </div>
    </div>
  `,
})
export default class ComingSoonComponent implements OnInit, OnDestroy {
  email = '';
  subscribed = signal(false);
  private timer: ReturnType<typeof setInterval> | null = null;

  target = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

  countdown = signal([
    { label: 'Days',    value: '00' },
    { label: 'Hours',   value: '00' },
    { label: 'Minutes', value: '00' },
    { label: 'Seconds', value: '00' },
  ]);

  socials = [
    { label: 'Twitter', icon: 'alternate_email' },
    { label: 'GitHub',  icon: 'code' },
    { label: 'Discord', icon: 'forum' },
    { label: 'Email',   icon: 'mail' },
  ];

  ngOnInit() { this.tick(); this.timer = setInterval(() => this.tick(), 1000); }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  tick() {
    const diff = Math.max(0, this.target.getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.countdown.set([
      { label: 'Days',    value: String(d).padStart(2, '0') },
      { label: 'Hours',   value: String(h).padStart(2, '0') },
      { label: 'Minutes', value: String(m).padStart(2, '0') },
      { label: 'Seconds', value: String(s).padStart(2, '0') },
    ]);
  }

  subscribe() { if (this.email.includes('@')) this.subscribed.set(true); }
}