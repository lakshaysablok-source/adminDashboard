import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:var(--bg-base);position:relative;overflow:hidden">

      <!-- Decorative blobs -->
      <div style="position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(245,158,11,.08),transparent 70%);pointer-events:none"></div>

      <div style="max-width:520px;width:100%;text-align:center;position:relative">

        <!-- Logo -->
        <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:48px">
          <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center">
            <mat-icon style="color:#fff;font-size:22px;width:22px;height:22px">dashboard</mat-icon>
          </div>
          <span style="font-size:20px;font-weight:800;color:var(--text-primary);letter-spacing:-.03em">Nexus Panel</span>
        </div>

        <!-- Animated icon -->
        <div style="width:90px;height:90px;border-radius:50%;background:rgba(245,158,11,.1);border:2px solid rgba(245,158,11,.25);display:flex;align-items:center;justify-content:center;margin:0 auto 28px;animation:spin 8s linear infinite">
          <mat-icon style="font-size:44px;width:44px;height:44px;color:#f59e0b">settings</mat-icon>
        </div>

        <h1 style="font-size:36px;font-weight:900;color:var(--text-primary);letter-spacing:-.04em;line-height:1.1;margin-bottom:14px">
          Under Maintenance
        </h1>
        <p style="font-size:15px;color:var(--text-muted);line-height:1.7;margin-bottom:36px">
          We're performing scheduled maintenance to improve your experience. We'll be back online shortly.
        </p>

        <!-- Countdown -->
        <div style="display:flex;justify-content:center;gap:12px;margin-bottom:36px;flex-wrap:wrap">
          @for (unit of countdown(); track unit.label) {
            <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:12px;padding:14px 18px;min-width:68px">
              <div style="font-size:28px;font-weight:900;color:var(--text-primary);line-height:1">{{ unit.value }}</div>
              <div style="font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;margin-top:4px">{{ unit.label }}</div>
            </div>
          }
        </div>

        <!-- Status checklist -->
        <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:20px;margin-bottom:32px;text-align:left">
          <h3 style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px">Maintenance Status</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            @for (task of tasks; track task.label) {
              <div style="display:flex;align-items:center;gap:10px">
                @if (task.status === 'done') {
                  <mat-icon style="font-size:17px;width:17px;height:17px;color:#16a34a">check_circle</mat-icon>
                } @else if (task.status === 'progress') {
                  <mat-icon style="font-size:17px;width:17px;height:17px;color:#f59e0b">pending</mat-icon>
                } @else {
                  <mat-icon style="font-size:17px;width:17px;height:17px;color:var(--text-muted)">radio_button_unchecked</mat-icon>
                }
                <span style="font-size:13px" [style.color]="task.status === 'done' ? 'var(--text-primary)' : task.status === 'progress' ? '#f59e0b' : 'var(--text-muted)'">
                  {{ task.label }}
                </span>
                @if (task.status === 'progress') {
                  <span style="margin-left:auto;font-size:11px;font-weight:600;color:#f59e0b">In progress</span>
                }
              </div>
            }
          </div>
        </div>

        <!-- Contact -->
        <p style="font-size:13px;color:var(--text-muted)">
          Need urgent help?
          <a href="mailto:support@nexuspanel.com" style="color:var(--accent-500);text-decoration:none;font-weight:600">Contact us</a>
          or follow
          <a href="#" style="color:var(--accent-500);text-decoration:none;font-weight:600">&#64;nexuspanel</a>
          for updates.
        </p>

      </div>
    </div>
  `,
  styles: [`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`],
})
export default class MaintenanceComponent implements OnInit, OnDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;
  target = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

  countdown = signal([
    { label: 'Hours',   value: '02' },
    { label: 'Minutes', value: '00' },
    { label: 'Seconds', value: '00' },
  ]);

  tasks = [
    { label: 'Database backup completed',         status: 'done'     },
    { label: 'Server infrastructure upgrade',      status: 'done'     },
    { label: 'Performance optimizations',          status: 'progress' },
    { label: 'Security patches',                   status: 'pending'  },
    { label: 'Final QA & smoke tests',             status: 'pending'  },
  ];

  ngOnInit() {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  tick() {
    const diff = Math.max(0, this.target.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.countdown.set([
      { label: 'Hours',   value: String(h).padStart(2, '0') },
      { label: 'Minutes', value: String(m).padStart(2, '0') },
      { label: 'Seconds', value: String(s).padStart(2, '0') },
    ]);
  }
}