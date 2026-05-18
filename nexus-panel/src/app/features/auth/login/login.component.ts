import { Component, inject } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterLink } from '@angular/router';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { AuthService } from '../../../core/services/auth.service';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
    template: `
      <div class="animate-fade-in">
        <h2 class="text-3xl font-bold text-primary mb-2">Welcome back</h2>
        <p class="text-muted mb-8">Sign in to your NexusPanel account</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="you@example.com">
            @if (form.get('email')?.errors?.['required'] && form.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password">
            <button matSuffix type="button" (click)="showPassword = !showPassword" style="border:none;background:none;cursor:pointer">
              {{ showPassword ? '🙈' : '👁️ ' }}
            </button>
          </mat-form-field>

          <div class="flex items-center justify-between">
            <mat-checkbox>Remember me</mat-checkbox>
            <a routerLink="/auth/forgot" class="text-sm text-accent-600 hover:underline">Forgot password?</a>
          </div>

          @if (error) {
            <div class="badge badge-danger w-full justify-center py-2">{{ error }}</div>
          }

          <button mat-flat-button class="w-full !bg-accent-600 !text-white !h-11 !text-base"
            type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-muted">
          Don't have an account?
          <a routerLink="/auth/register" class="text-accent-600 font-medium hover:underline ml-1">Create one</a>
        </div>

        <!-- Demo hint -->
        <div class="mt-6 p-3 bg-elevated rounded-lg text-xs text-muted text-center border border-border">
          Demo: any email + password works
        </div>
      </div>
    `,
  })
  export default class LoginComponent {
    private fb   = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    form = this.fb.group({
      email:    ['demo@nexuspanel.com', [Validators.required, Validators.email]],
      password: ['password123',         Validators.required],
    });

    showPassword = false;
    loading      = false;
    error        = '';

    submit() {
      if (this.form.invalid) return;
      this.loading = true;
      this.error   = '';

      const { email, password } = this.form.value;
      const ok = this.auth.login(email!, password!);

      if (ok) this.router.navigate(['/dashboard']);
      else    this.error = 'Invalid credentials';
      this.loading = false;
    }
  }