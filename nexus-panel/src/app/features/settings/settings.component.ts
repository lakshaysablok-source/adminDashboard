import { Component, inject, signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatSlideToggleModule } from '@angular/material/slide-toggle';
  import { MatSelectModule } from '@angular/material/select';
  import { MatDialogModule, MatDialog } from '@angular/material/dialog';
  import { ThemeService, AccentColor } from '../../core/services/theme.service';
  import { AuthService } from '../../core/services/auth.service';

  type SettingsTab = 'general' | 'security' | 'notifications' | 'appearance' | 'billing' | 'danger';

  @Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
      CommonModule, ReactiveFormsModule,
      MatFormFieldModule, MatInputModule, MatButtonModule,
      MatSlideToggleModule, MatSelectModule, MatDialogModule,
    ],
    template: `
      <div class="space-y-6 animate-fade-in">
        <div>
          <h1 class="text-2xl font-bold text-primary">Settings</h1>
          <p class="text-muted text-sm mt-1">Manage your account and preferences</p>
        </div>

        <div class="flex gap-6 flex-col xl:flex-row">

          <!-- Sidebar nav -->
          <aside class="xl:w-56 flex-shrink-0">
            <nav class="card !p-2 space-y-0.5 sticky top-24">
              @for (item of navItems; track item.id) {
                <button (click)="activeTab.set(item.id)"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
                  [class.bg-accent-50]="activeTab() === item.id"
                  [class.text-accent-600]="activeTab() === item.id"
                  [class.font-medium]="activeTab() === item.id"
                  [class.text-secondary]="activeTab() !== item.id"
                  [class.hover:bg-elevated]="activeTab() !== item.id">
                  <span>{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                </button>
              }
            </nav>
          </aside>

          <!-- Content -->
          <div class="flex-1 min-w-0">

            <!-- General -->
            @if (activeTab() === 'general') {
              <div class="card animate-fade-in">
                <h2 class="text-lg font-semibold text-primary mb-5">General Settings</h2>
                <form [formGroup]="generalForm" (ngSubmit)="saveGeneral()" class="space-y-4">
                  <!-- Avatar -->
                  <div class="flex items-center gap-4 pb-4 border-b border-border">
                    <img [src]="auth.currentUser()?.avatar" class="w-16 h-16 rounded-xl border border-border object-cover">
                    <div>
                      <button type="button" mat-stroked-button class="!text-sm mb-1">Change Photo</button>
                      <p class="text-xs text-muted">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput formControlName="firstName">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput formControlName="lastName">
                    </mat-form-field>
                  </div>
                  <mat-form-field appearance="outline">
                    <mat-label>Email Address</mat-label>
                    <input matInput type="email" formControlName="email">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Username</mat-label>
                    <span matTextPrefix class="text-muted">&#64;&nbsp;</span>
                    <input matInput formControlName="username">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Language</mat-label>
                    <mat-select formControlName="language">
                      <mat-option value="en">English</mat-option>
                      <mat-option value="es">Spanish</mat-option>
                      <mat-option value="fr">French</mat-option>
                      <mat-option value="de">German</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Timezone</mat-label>
                    <mat-select formControlName="timezone">
                      <mat-option value="utc">UTC</mat-option>
                      <mat-option value="est">Eastern (EST)</mat-option>
                      <mat-option value="pst">Pacific (PST)</mat-option>
                      <mat-option value="ist">India (IST)</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <div class="flex items-center gap-3">
                    <button mat-flat-button type="submit" class="!bg-accent-600 !text-white">
                      Save Changes
                    </button>
                    @if (generalSaved()) {
                      <span class="text-sm text-green-500 animate-fade-in">✅ Saved!</span>
                    }
                  </div>
                </form>
              </div>
            }

            <!-- Security -->
            @if (activeTab() === 'security') {
              <div class="space-y-4 animate-fade-in">
                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-5">Change Password</h2>
                  <form [formGroup]="pwdForm" (ngSubmit)="savePwd()" class="space-y-3 max-w-md">
                    <mat-form-field appearance="outline">
                      <mat-label>Current Password</mat-label>
                      <input matInput type="password" formControlName="current">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>New Password</mat-label>
                      <input matInput type="password" formControlName="newPwd">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Confirm New Password</mat-label>
                      <input matInput type="password" formControlName="confirm">
                    </mat-form-field>
                    <button mat-flat-button type="submit" class="!bg-accent-600 !text-white">
                      Update Password
                    </button>
                  </form>
                </div>

                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-4">Two-Factor Authentication</h2>
                  <div class="flex items-center justify-between p-4 bg-elevated rounded-xl">
                    <div>
                      <p class="font-medium text-sm">Authenticator App</p>
                      <p class="text-xs text-muted mt-0.5">Use an authenticator app to generate codes</p>
                    </div>
                    <mat-slide-toggle color="primary" [checked]="true"></mat-slide-toggle>
                  </div>
                </div>

                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-4">Active Sessions</h2>
                  <div class="space-y-3">
                    @for (session of sessions; track session.id) {
                      <div class="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div class="flex items-center gap-3">
                          <span class="text-2xl">{{ session.icon }}</span>
                          <div>
                            <p class="text-sm font-medium">{{ session.device }}</p>
                            <p class="text-xs text-muted">{{ session.location }} · {{ session.time }}</p>
                          </div>
                        </div>
                        @if (session.current) {
                          <span class="badge badge-success text-xs">Current</span>
                        } @else {
                          <button class="text-xs text-red-500 hover:underline border-none bg-transparent cursor-pointer">
                            Revoke
                          </button>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Notifications -->
            @if (activeTab() === 'notifications') {
              <div class="card animate-fade-in">
                <h2 class="text-lg font-semibold text-primary mb-5">Notification Preferences</h2>
                <div class="space-y-0">
                  @for (group of notifGroups; track group.label; let last = $last) {
                    <div class="pb-5 mb-5" [class.border-b]="!last" [class.border-border]="!last">
                      <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                        {{ group.label }}
                      </h3>
                      <div class="space-y-3">
                        @for (item of group.items; track item.label) {
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="text-sm font-medium text-primary">{{ item.label }}</p>
                              <p class="text-xs text-muted">{{ item.desc }}</p>
                            </div>
                            <mat-slide-toggle color="primary" [checked]="item.checked"></mat-slide-toggle>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Appearance ★ THE KEY PREMIUM FEATURE ★ -->
            @if (activeTab() === 'appearance') {
              <div class="space-y-4 animate-fade-in">

                <!-- Dark / Light mode -->
                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-4">Color Mode</h2>
                  <div class="grid grid-cols-2 gap-3">
                    <button (click)="theme.mode.set('light')"
                      class="p-4 rounded-xl border-2 transition-all text-left"
                      [class.border-accent-500]="theme.mode() === 'light'"
                      [class.border-border]="theme.mode() !== 'light'">
                      <div class="w-full h-20 rounded-lg mb-3 bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                        <div class="w-full h-full p-2 flex gap-1.5">
                          <div class="w-6 h-full rounded bg-gray-100"></div>
                          <div class="flex-1 space-y-1.5">
                            <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-100 rounded"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-sm">Light</p>
                          <p class="text-xs text-muted">Clean and bright</p>
                        </div>
                        @if (theme.mode() === 'light') {
                          <span class="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs">✓</span>
                        }
                      </div>
                    </button>

                    <button (click)="theme.mode.set('dark')"
                      class="p-4 rounded-xl border-2 transition-all text-left"
                      [class.border-accent-500]="theme.mode() === 'dark'"
                      [class.border-border]="theme.mode() !== 'dark'">
                      <div class="w-full h-20 rounded-lg mb-3 border border-gray-700 flex items-center justify-center overflow-hidden"
                        style="background:#1e293b">
                        <div class="w-full h-full p-2 flex gap-1.5">
                          <div class="w-6 h-full rounded" style="background:#0f172a"></div>
                          <div class="flex-1 space-y-1.5">
                            <div class="h-3 rounded w-3/4" style="background:#334155"></div>
                            <div class="h-3 rounded" style="background:#1e293b"></div>
                            <div class="h-3 rounded w-1/2" style="background:#1e293b"></div>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-sm">Dark</p>
                          <p class="text-xs text-muted">Easy on the eyes</p>
                        </div>
                        @if (theme.mode() === 'dark') {
                          <span class="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs">✓</span>
                        }
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Accent color picker -->
                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-1">Accent Color</h2>
                  <p class="text-sm text-muted mb-4">Choose your preferred accent color — applies instantly</p>
                  <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    @for (color of accentColors; track color.id) {
                      <button (click)="theme.setAccent(color.id)"
                        class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                        [class.border-accent-500]="theme.accent() === color.id"
                        [class.border-transparent]="theme.accent() !== color.id"
                        [class.bg-accent-50]="theme.accent() === color.id"
                        [class.hover:bg-elevated]="theme.accent() !== color.id">
                        <div class="w-8 h-8 rounded-full shadow-sm ring-2 ring-offset-2 transition-all"
                          [style.background]="color.hex"
                          [style.ring-color]="theme.accent() === color.id ? color.hex : 'transparent'">
                        </div>
                        <span class="text-xs font-medium" [class.text-accent-600]="theme.accent() === color.id"
                                                           [class.text-muted]="theme.accent() !== color.id">
                          {{ color.label }}
                        </span>
                      </button>
                    }
                  </div>

                  <!-- Live preview -->
                  <div class="mt-4 p-4 rounded-xl border border-border bg-elevated">
                    <p class="text-xs text-muted uppercase tracking-wide font-medium mb-3">Preview</p>
                    <div class="flex flex-wrap gap-2 items-center">
                      <button class="px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
                        [style.background]="'var(--accent-600)'">
                        Primary Button
                      </button>
                      <span class="badge badge-accent">Badge</span>
                      <div class="w-4 h-4 rounded-full" [style.background]="'var(--accent-500)'"></div>
                      <div class="flex-1 h-1.5 rounded-full bg-border min-w-[60px]">
                        <div class="h-1.5 rounded-full w-2/3 transition-colors"
                          [style.background]="'var(--accent-500)'"></div>
                      </div>
                      <span class="text-sm font-medium" [style.color]="'var(--accent-600)'">Link text</span>
                    </div>
                  </div>
                </div>

                <!-- Layout density -->
                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-4">Layout</h2>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium">Compact sidebar</p>
                        <p class="text-xs text-muted">Show icons only in the sidebar</p>
                      </div>
                      <mat-slide-toggle color="primary"></mat-slide-toggle>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium">Sticky header</p>
                        <p class="text-xs text-muted">Keep the topbar visible when scrolling</p>
                      </div>
                      <mat-slide-toggle color="primary" [checked]="true"></mat-slide-toggle>
                    </div>
                  </div>
                </div>

              </div>
            }

            <!-- Billing -->
            @if (activeTab() === 'billing') {
              <div class="space-y-4 animate-fade-in">
                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-4">Current Plan</h2>
                  <div class="flex items-center justify-between p-4 bg-accent-50 rounded-xl border border-accent-100">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-accent-700 text-lg">Pro Plan</span>
                        <span class="badge badge-accent">Active</span>
                      </div>
                      <p class="text-sm text-accent-600 mt-0.5">$29/month · Renews June 1, 2026</p>
                    </div>
                    <button mat-stroked-button class="!border-accent-400 !text-accent-700">Manage</button>
                  </div>
                </div>

                <div class="card">
                  <h2 class="text-lg font-semibold text-primary mb-4">Payment Method</h2>
                  <div class="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div>
                        <p class="text-sm font-medium">•••• •••• •••• 4242</p>
                        <p class="text-xs text-muted">Expires 12/27</p>
                      </div>
                    </div>
                    <button mat-stroked-button class="!text-sm">Update</button>
                  </div>
                </div>
              </div>
            }

            <!-- Danger Zone -->
            @if (activeTab() === 'danger') {
              <div class="card border-red-200 animate-fade-in">
                <h2 class="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
                <p class="text-sm text-muted mb-5">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div class="space-y-3">
                  @for (action of dangerActions; track action.label) {
                    <div class="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/50">
                      <div>
                        <p class="text-sm font-medium text-primary">{{ action.label }}</p>
                        <p class="text-xs text-muted">{{ action.desc }}</p>
                      </div>
                      <button class="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-300
                                     text-red-600 bg-white hover:bg-red-50 transition-colors cursor-pointer"
                        (click)="confirmDanger(action.label)">
                        {{ action.btn }}
                      </button>
                    </div>
                  }
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    `,
  })
  export default class SettingsComponent {
    private fb   = inject(FormBuilder);
    theme        = inject(ThemeService);
    auth         = inject(AuthService);

    activeTab    = signal<SettingsTab>('general');
    generalSaved = signal(false);

    navItems: { id: SettingsTab; icon: string; label: string }[] = [
      { id: 'general',       icon: '👤', label: 'General'       },
      { id: 'security',      icon: '🔒', label: 'Security'      },
      { id: 'notifications', icon: '🔔', label: 'Notifications' },
      { id: 'appearance',    icon: '🎨', label: 'Appearance'    },
      { id: 'billing',       icon: '💳', label: 'Billing'       },
      { id: 'danger',        icon: '⚠️ ', label: 'Danger Zone'   },
    ];

    accentColors: { id: AccentColor; label: string; hex: string }[] = [
      { id: 'indigo',  label: 'Indigo',  hex: '#6366f1' },
      { id: 'violet',  label: 'Violet',  hex: '#8b5cf6' },
      { id: 'cyan',    label: 'Cyan',    hex: '#06b6d4' },
      { id: 'emerald', label: 'Emerald', hex: '#10b981' },
      { id: 'amber',   label: 'Amber',   hex: '#f59e0b' },
      { id: 'rose',    label: 'Rose',    hex: '#f43f5e' },
    ];

    sessions = [
      { id: 1, icon: '💻', device: 'Windows PC — Chrome 120',  location: 'New York, US',    time: 'Active now',   current: true  },
      { id: 2, icon: '📱', device: 'iPhone 15 — Safari',       location: 'San Francisco, US',time: '2 hours ago',  current: false },
      { id: 3, icon: '💻', device: 'MacBook Pro — Firefox',    location: 'London, UK',       time: '3 days ago',   current: false },
    ];

    notifGroups = [
      {
        label: 'Activity',
        items: [
          { label: 'New comments',      desc: 'When someone comments on your posts',        checked: true  },
          { label: 'Mentions',          desc: 'When someone mentions you',                  checked: true  },
          { label: 'Follows',           desc: 'When someone follows your account',          checked: false },
        ],
      },
      {
        label: 'System',
        items: [
          { label: 'Security alerts',   desc: 'Login from new device or location',          checked: true  },
          { label: 'Product updates',   desc: 'New features and improvements',              checked: true  },
          { label: 'Marketing emails',  desc: 'Tips, promotions and announcements',         checked: false },
          { label: 'Weekly digest',     desc: 'Summary of your account activity',           checked: true  },
        ],
      },
    ];

    dangerActions = [
      { label: 'Export Data',     desc: 'Download a copy of all your data',                btn: 'Export'  },
      { label: 'Deactivate Account', desc: 'Temporarily disable your account',             btn: 'Deactivate' },
      { label: 'Delete Account',  desc: 'Permanently delete your account and all data',    btn: 'Delete'  },
    ];

    generalForm = this.fb.group({
      firstName: [this.auth.currentUser()?.name?.split(' ')[0] ?? '', Validators.required],
      lastName:  [this.auth.currentUser()?.name?.split(' ')[1] ?? ''],
      email:     [this.auth.currentUser()?.email ?? '', [Validators.required, Validators.email]],
      username:  ['alexjohnson'],
      language:  ['en'],
      timezone:  ['est'],
    });

    pwdForm = this.fb.group({
      current: ['', Validators.required],
      newPwd:  ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', Validators.required],
    });

    saveGeneral() {
      this.generalSaved.set(true);
      setTimeout(() => this.generalSaved.set(false), 3000);
    }

    savePwd() { alert('Password updated!'); }

    confirmDanger(action: string) {
      if (confirm(`Are you sure you want to: ${action}? This cannot be undone.`)) {
        alert(`${action} initiated.`);
      }
    }
  }