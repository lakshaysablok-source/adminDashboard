import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
            MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="animate-fade-in">

      @if (!sent()) {
        <!-- Request form -->
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
             style="background:var(--accent-100)">
          <mat-icon style="color:var(--accent-600);font-size:24px;width:24px;height:24px;line-height:24px">
            lock_reset
          </mat-icon>
        </div>

        <h2 class="text-3xl font-bold text-primary mb-1">Forgot password?</h2>
        <p class="text-muted mb-6">
          Enter your email and we'll send a reset link to your inbox.
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <mat-form-field appearance="outline">
            <mat-label>Email address</mat-label>
            <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;
                                       line-height:18px;color:var(--text-muted);margin-right:6px">
              mail_outline
            </mat-icon>
            <input matInput type="email" formControlName="email" placeholder="you@example.com">
            @if (form.get('email')?.errors?.['required'] && form.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
            @if (form.get('email')?.errors?.['email'] && form.get('email')?.touched) {
              <mat-error>Enter a valid email address</mat-error>
            }
          </mat-form-field>

          <button mat-flat-button class="w-full !h-11 !text-sm !font-semibold"
            style="background:var(--accent-600);color:white;border-radius:10px"
            type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <span class="flex items-center justify-center gap-2">
                <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px"
                          class="animate-spin">autorenew</mat-icon>
                Sending...
              </span>
            } @else {
              Send Reset Link
            }
          </button>
        </form>

      } @else {
        <!-- Success state -->
        <div class="text-center animate-fade-in">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
               style="background:var(--accent-100)">
            <mat-icon style="color:var(--accent-600);font-size:32px;width:32px;height:32px;line-height:32px">
              mark_email_read
            </mat-icon>
          </div>

          <h2 class="text-2xl font-bold text-primary mb-2">Check your inbox</h2>
          <p class="text-muted mb-1">
            We sent a password reset link to
          </p>
          <p class="font-semibold text-primary mb-6">{{ form.get('email')?.value }}</p>

          <div class="p-4 rounded-xl border border-border bg-elevated text-left space-y-2 mb-6">
            <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Next steps</p>
            @for (step of steps; track step.text) {
              <div class="flex items-start gap-2.5 text-sm">
                <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                     style="background:var(--accent-100)">
                  <mat-icon style="font-size:12px;width:12px;height:12px;line-height:12px;
                                   color:var(--accent-600)">{{ step.icon }}</mat-icon>
                </div>
                <span class="text-secondary">{{ step.text }}</span>
              </div>
            }
          </div>

          <p class="text-sm text-muted">
            Didn't receive it?
            <button (click)="resend()"
              class="text-accent-600 hover:underline font-medium border-none bg-transparent cursor-pointer ml-1">
              Resend email
            </button>
          </p>
        </div>
      }

      <!-- Back to login -->
      <a routerLink="/auth/login"
         class="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mt-8">
        <mat-icon style="font-size:16px;width:16px;height:16px;line-height:16px">arrow_back</mat-icon>
        Back to login
      </a>
    </div>
  `,
})
export default class ForgotPasswordComponent {
  private fb = inject(FormBuilder);

  sent    = signal(false);
  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  steps = [
    { icon: 'inbox',       text: 'Open the email from NexusPanel' },
    { icon: 'link',        text: 'Click the "Reset Password" link' },
    { icon: 'lock_open',   text: 'Create a new secure password' },
  ];

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.sent.set(true);
    }, 1200);
  }

  resend() {
    this.sent.set(false);
    this.form.reset();
  }
}