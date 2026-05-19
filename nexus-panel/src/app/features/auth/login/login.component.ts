import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
            MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="animate-fade-in">
      <h2 class="text-3xl font-bold text-primary mb-1">Welcome back</h2>
      <p class="text-muted mb-6">Sign in to your NexusPanel account</p>

      <!-- Demo quick-fill -->
      <div class="mb-5 p-3.5 bg-elevated rounded-xl border border-border">
        <p class="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
          Quick Demo Login
        </p>
        <div class="flex flex-col gap-1.5">
          @for (demo of auth.demoCredentials; track demo.role) {
            <button type="button" (click)="quickFill(demo.email, demo.password)"
              class="flex items-center justify-between px-3 py-2 rounded-lg border border-border
                     bg-surface hover:bg-elevated hover:border-accent-200 transition-all text-left group">
              <div class="flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  [style.background]="roleColor(demo.role)">
                  {{ demo.name[0] }}
                </span>
                <div>
                  <span class="text-xs font-semibold text-primary capitalize">{{ demo.role }}</span>
                  <span class="text-xs text-muted ml-1.5">{{ demo.email }}</span>
                </div>
              </div>
              <span class="text-[10px] text-muted group-hover:text-accent-600 transition-colors">
                click to fill →
              </span>
            </button>
          }
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="you@example.com">
          <mat-icon matPrefix class="!text-muted !text-base !mr-1">mail_outline</mat-icon>
          @if (form.get('email')?.errors?.['required'] && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.errors?.['email'] && form.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <mat-icon matPrefix class="!text-muted !text-base !mr-1">lock_outline</mat-icon>
          <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
          <button matSuffix type="button" (click)="showPassword = !showPassword"
            style="border:none;background:none;cursor:pointer;padding:4px 6px;
                   display:flex;align-items:center;color:var(--text-secondary)">
            <mat-icon style="font-size:20px;width:20px;height:20px;line-height:20px">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </mat-icon>
          </button>
          @if (form.get('password')?.errors?.['required'] && form.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        <div class="flex items-center justify-between text-sm">
          <a routerLink="/auth/forgot" class="text-accent-600 hover:underline">Forgot password?</a>
        </div>

        @if (error) {
          <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 animate-fade-in">
            <mat-icon class="!text-base flex-shrink-0">error_outline</mat-icon>
            {{ error }}
          </div>
        }

        <button mat-flat-button class="w-full !h-11 !text-sm !font-semibold"
          style="background:var(--accent-600);color:white;border-radius:10px"
          type="submit" [disabled]="form.invalid || loading">
          @if (loading) {
            <span class="flex items-center justify-center gap-2">
              <mat-icon class="animate-spin !text-base">autorenew</mat-icon>
              Signing in...
            </span>
          } @else {
            Sign In
          }
        </button>
      </form>

      <div class="mt-5 text-center text-sm text-muted">
        Don't have an account?
        <a routerLink="/auth/register" class="text-accent-600 font-medium hover:underline ml-1">
          Create one
        </a>
      </div>
    </div>
  `,
})
export default class LoginComponent {
  private fb     = inject(FormBuilder);
  auth           = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email:    ['admin@nexuspanel.com', [Validators.required, Validators.email]],
    password: ['admin123',             Validators.required],
  });

  showPassword = false;
  loading      = false;
  error        = '';

  roleColor(role: string) {
    const map: Record<string, string> = {
      admin:  '#6366f1',
      editor: '#06b6d4',
      viewer: '#10b981',
    };
    return map[role] ?? '#94a3b8';
  }

  quickFill(email: string, password: string) {
    this.form.patchValue({ email, password });
    this.error = '';
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    const { email, password } = this.form.value;
    const result = this.auth.login(email!, password!);

    if (result.ok) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = result.error ?? 'Login failed. Please try again.';
    }
    this.loading = false;
  }
}