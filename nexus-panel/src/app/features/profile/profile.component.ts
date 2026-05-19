import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatTabsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule,
  ],
  template: `
    <div class="space-y-6 animate-fade-in">

      <!-- Cover + Avatar -->
      <div class="card !p-0 overflow-hidden">
        <div class="h-40 relative"
          style="background: linear-gradient(135deg, var(--accent-600) 0%, var(--accent-700) 50%, #8b5cf6 100%)">
          <div class="absolute inset-0 opacity-20"
            style="background-image: radial-gradient(circle at 25% 50%, white 1px, transparent 1px);
                   background-size: 32px 32px;"></div>
        </div>

        <div class="px-6 pb-4">
          <div class="flex items-end justify-between -mt-12 mb-4">
            <div class="relative group">
              <img [src]="user()?.avatar" [alt]="user()?.name"
                class="w-24 h-24 rounded-2xl border-4 object-cover shadow-lg"
                style="border-color: var(--bg-surface)">
              <div class="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100
                          transition-opacity flex items-center justify-center cursor-pointer">
                <span class="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <div class="flex gap-2 mb-2">
              <button class="btn btn-ghost text-sm">Message</button>
              <button class="btn btn-primary text-sm">Follow</button>
            </div>
          </div>

          <div class="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 class="text-xl font-bold text-primary">{{ user()?.name }}</h1>
              <p class="text-sm mt-0.5" style="color:var(--text-muted)">
                {{ user()?.role | titlecase }} · NexusPanel
              </p>
              <p class="text-sm mt-1" style="color:var(--text-secondary)">
                Building beautiful UIs with Angular · Open to work
              </p>
              <div class="flex items-center gap-4 mt-2 text-xs" style="color:var(--text-muted)">
                <span>📍 San Francisco, CA</span>
                <span>🔗 nexuspanel.dev</span>
                <span>📅 Joined Jan 2024</span>
              </div>
            </div>

            <div class="flex gap-6">
              @for (stat of profileStats; track stat.label) {
                <div class="text-center">
                  <div class="text-xl font-bold text-primary">{{ stat.value }}</div>
                  <div class="text-xs" style="color:var(--text-muted)">{{ stat.label }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <mat-tab-group animationDuration="200ms">

        <!-- Overview Tab -->
        <mat-tab label="Overview">
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">

            <div class="space-y-4">
              <div class="card">
                <h3 class="font-semibold text-primary mb-3">About</h3>
                <p class="text-sm leading-relaxed" style="color:var(--text-secondary)">
                  Senior Angular developer with 5+ years of experience building
                  enterprise-grade applications. Passionate about clean code,
                  performance optimization, and developer experience.
                </p>
              </div>

              <div class="card">
                <h3 class="font-semibold text-primary mb-3">Skills</h3>
                <div class="space-y-2">
                  @for (skill of skills; track skill.name) {
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span style="color:var(--text-secondary)">{{ skill.name }}</span>
                        <span class="font-medium text-primary">{{ skill.level }}%</span>
                      </div>
                      <div class="w-full rounded-full h-1.5" style="background:var(--bg-elevated)">
                        <div class="h-1.5 rounded-full transition-all duration-700"
                          style="background:var(--accent-500)"
                          [style.width]="skill.level + '%'"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="card">
                <h3 class="font-semibold text-primary mb-3">Links</h3>
                <div class="space-y-2">
                  @for (link of socialLinks; track link.label) {
                    <a href="#" class="flex items-center gap-2 text-sm transition-colors"
                       style="color:var(--text-secondary)"
                       onmouseover="this.style.color='var(--accent-600)'"
                       onmouseout="this.style.color='var(--text-secondary)'">
                      <span>{{ link.icon }}</span>
                      <span>{{ link.label }}</span>
                    </a>
                  }
                </div>
              </div>
            </div>

            <div class="xl:col-span-2">
              <div class="card">
                <h3 class="font-semibold text-primary mb-4">Recent Activity</h3>
                <div class="space-y-0">
                  @for (item of activity; track item.id; let last = $last) {
                    <div class="flex gap-3 py-3"
                         [style.border-bottom]="!last ? '1px solid var(--border-default)' : 'none'">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        style="background:var(--accent-50);color:var(--accent-600)">
                        {{ item.icon }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-primary">{{ item.text }}</p>
                        <p class="text-xs mt-0.5" style="color:var(--text-muted)">{{ item.time }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

          </div>
        </mat-tab>

        <!-- Edit Profile Tab -->
        <mat-tab label="Edit Profile">
          <div class="mt-4 max-w-2xl">
            <div class="card">
              <h3 class="font-semibold text-primary mb-4">Edit Profile</h3>
              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <mat-form-field appearance="outline">
                    <mat-label>First Name</mat-label>
                    <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;line-height:18px;margin-right:6px;color:var(--text-muted)">person</mat-icon>
                    <input matInput formControlName="firstName">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName">
                  </mat-form-field>
                </div>
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;line-height:18px;margin-right:6px;color:var(--text-muted)">mail</mat-icon>
                  <input matInput type="email" formControlName="email">
                  <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                    Enter a valid email address
                  </mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Job Title</mat-label>
                  <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;line-height:18px;margin-right:6px;color:var(--text-muted)">work</mat-icon>
                  <input matInput formControlName="title">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Location</mat-label>
                  <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;line-height:18px;margin-right:6px;color:var(--text-muted)">location_on</mat-icon>
                  <input matInput formControlName="location">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Bio</mat-label>
                  <textarea matInput formControlName="bio" rows="3"></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Website</mat-label>
                  <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;line-height:18px;margin-right:6px;color:var(--text-muted)">link</mat-icon>
                  <input matInput formControlName="website" placeholder="https://...">
                </mat-form-field>
                <div class="flex gap-3">
                  <button mat-flat-button type="submit"
                    [disabled]="profileForm.invalid"
                    style="background:var(--accent-600);color:#fff">
                    Save Changes
                  </button>
                  <button mat-stroked-button type="button"
                    (click)="resetForm()"
                    style="border-color:var(--border-default);color:var(--text-secondary)">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .btn { display:inline-flex;align-items:center;justify-content:center;padding:.4rem .9rem;
           border-radius:var(--radius-md);font-size:.875rem;font-weight:500;cursor:pointer;
           border:1px solid transparent;transition:all 150ms ease; }
    .btn-primary { background:var(--accent-600);color:#fff; }
    .btn-ghost   { background:transparent;color:var(--text-secondary);border:1px solid var(--border-default); }
  `],
})
export default class ProfileComponent {
  private fb   = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  auth          = inject(AuthService);
  user          = this.auth.currentUser;

  profileStats = [
    { label: 'Posts',     value: '142'  },
    { label: 'Followers', value: '2.4k' },
    { label: 'Following', value: '318'  },
  ];

  skills = [
    { name: 'Angular',    level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'RxJS',       level: 82 },
    { name: 'Tailwind',   level: 88 },
    { name: 'Node.js',    level: 70 },
  ];

  socialLinks = [
    { icon: '🐙', label: 'github.com/alexjohnson' },
    { icon: '🐦', label: 'twitter.com/alexjohnson' },
    { icon: '💼', label: 'linkedin.com/in/alexjohnson' },
    { icon: '🌐', label: 'alexjohnson.dev' },
  ];

  activity = [
    { id: 1, icon: '⭐', text: 'Starred the repository nexus-panel',                    time: '2 hours ago' },
    { id: 2, icon: '💬', text: 'Commented on issue #142: "Dashboard layout broken"',     time: '4 hours ago' },
    { id: 3, icon: '🔀', text: 'Opened pull request: "Add dark mode support"',           time: 'Yesterday'   },
    { id: 4, icon: '📦', text: 'Published package @nexus/ui@2.1.0',                      time: '2 days ago'  },
    { id: 5, icon: '✅', text: 'Closed issue #138: "Chart colors not updating on theme"', time: '3 days ago'  },
    { id: 6, icon: '🚀', text: 'Deployed v2.0.0 to production',                          time: '1 week ago'  },
  ];

  profileForm = this.fb.group({
    firstName: [this.user()?.name?.split(' ')[0] ?? '', Validators.required],
    lastName:  [this.user()?.name?.split(' ')[1] ?? ''],
    email:     [this.user()?.email ?? '', [Validators.required, Validators.email]],
    title:     ['Senior Angular Developer'],
    location:  ['San Francisco, CA'],
    bio:       ['Building beautiful UIs with Angular'],
    website:   ['https://nexuspanel.dev'],
  });

  saveProfile() {
    if (this.profileForm.invalid) return;
    const v = this.profileForm.getRawValue();
    const name = [v.firstName, v.lastName].filter(Boolean).join(' ');
    this.auth.updateProfile({ name, email: v.email ?? undefined });
    this.snack.open('Profile updated successfully!', '✕', {
      duration: 3000, horizontalPosition: 'right', verticalPosition: 'top',
      panelClass: ['toast-success'],
    });
  }

  resetForm() {
    this.profileForm.patchValue({
      firstName: this.user()?.name?.split(' ')[0] ?? '',
      lastName:  this.user()?.name?.split(' ')[1] ?? '',
      email:     this.user()?.email ?? '',
    });
  }
}