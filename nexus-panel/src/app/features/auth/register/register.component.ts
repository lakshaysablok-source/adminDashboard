import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
            MatFormFieldModule, MatInputModule, MatButtonModule,
            MatCheckboxModule, MatSelectModule, MatIconModule],
  template: `
    <div class="animate-fade-in">
      <h2 class="text-3xl font-bold text-primary mb-1">Create account</h2>
      <p class="text-muted mb-6">Join NexusPanel — free forever for demo use</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">

        <!-- Name row -->
        <div class="grid grid-cols-2 gap-3">
          <mat-form-field appearance="outline">
            <mat-label>First name</mat-label>
            <input matInput formControlName="firstName" placeholder="Alex">
            @if (form.get('firstName')?.errors?.['required'] && form.get('firstName')?.touched) {
              <mat-error>Required</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last name</mat-label>
            <input matInput formControlName="lastName" placeholder="Johnson">
          </mat-form-field>
        </div>

        <!-- Email -->
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
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>

        <!-- Role -->
        <mat-form-field appearance="outline">
          <mat-label>Account role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="admin">
              <span class="font-medium">Admin</span>
              <span class="text-xs text-muted ml-2">— full access</span>
            </mat-option>
            <mat-option value="editor">
              <span class="font-medium">Editor</span>
              <span class="text-xs text-muted ml-2">— can edit content</span>
            </mat-option>
            <mat-option value="viewer">
              <span class="font-medium">Viewer</span>
              <span class="text-xs text-muted ml-2">— read only</span>
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Password -->
        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <mat-icon matPrefix style="font-size:18px;width:18px;height:18px;
                                     line-height:18px;color:var(--text-muted);margin-right:6px">
            lock_outline
          </mat-icon>
          <input matInput [type]="showPwd ? 'text' : 'password'" formControlName="password">
          <button matSuffix type="button" (click)="showPwd = !showPwd"
                  style="border:none;background:none;cursor:pointer;padding:4px 6px;
                         display:flex;align-items:center;color:var(--text-secondary)">
            <mat-icon style="font-size:20px;width:20px;height:20px;line-height:20px">
              {{ showPwd ? 'visibility_off' : 'visibility' }}
            </mat-icon>
          </button>
          @if (form.get('password')?.errors?.['minlength'] && form.get('password')?.touched) {
            <mat-error>Minimum 8 characters</mat-error>
          }
        </mat-form-field>

        <!-- Password strength bar (computed signal — no CD lag) -->
        @if (pwdValue()) {
          <div class="space-y-1 -mt-2">
            <div class="flex gap-1">
              @for (i of [0,1,2,3]; track i) {
                <div class="h-1 flex-1 rounded-full transition-all duration-300"
                  [style.background]="i < strength() ? strengthColor() : 'var(--border-default)'">
                </div>
              }
            </div>
            <p class="text-xs" [style.color]="strengthColor()">{{ strengthLabel() }}</p>
          </div>
        }

        <!-- Confirm password -->
        <mat-form-field appearance="outline">
          <mat-label>Confirm password</mat-label>
          <input matInput [type]="showPwd ? 'text' : 'password'" formControlName="confirmPassword">
          @if (form.errors?.['mismatch'] && form.get('confirmPassword')?.touched) {
            <mat-error>Passwords do not match</mat-error>
          }
        </mat-form-field>

        <!-- Terms -->
        <div class="flex items-start gap-2 pt-1">
          <mat-checkbox formControlName="terms" color="primary" class="mt-0.5"></mat-checkbox>
          <span class="text-sm text-muted leading-relaxed">
            I agree to the
            <a href="#" class="text-accent-600 hover:underline">Terms of Service</a>
            and <a href="#" class="text-accent-600 hover:underline">Privacy Policy</a>
          </span>
        </div>

        <!-- Error -->
        @if (error()) {
          <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg
                      text-sm text-red-600 animate-fade-in">
            <mat-icon style="font-size:16px;width:16px;height:16px;line-height:16px">error_outline</mat-icon>
            {{ error() }}
          </div>
        }

        <!-- Submit -->
        <button mat-flat-button class="w-full !h-11 !text-sm !font-semibold"
          style="background:var(--accent-600);color:white;border-radius:10px"
          type="submit" [disabled]="form.invalid || loading()">
          @if (loading()) {
            <span class="flex items-center justify-center gap-2">
              <mat-icon style="font-size:18px;width:18px;height:18px;line-height:18px"
                        class="animate-spin">autorenew</mat-icon>
              Creating account...
            </span>
          } @else {
            Create Account
          }
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-muted">
        Already have an account?
        <a routerLink="/auth/login" class="text-accent-600 font-medium hover:underline ml-1">
          Sign in
        </a>
      </p>
    </div>
  `,
})
export default class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  showPwd = false;
  loading = signal(false);
  error   = signal('');

  form = this.fb.group({
    firstName:       ['', Validators.required],
    lastName:        [''],
    email:           ['', [Validators.required, Validators.email]],
    role:            ['viewer'],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    terms:           [false, Validators.requiredTrue],
  }, { validators: passwordMatchValidator });

  // Reactive — only updates when the field changes, not every CD cycle
  pwdValue = toSignal(this.form.get('password')!.valueChanges, { initialValue: '' });

  strength = computed(() => {
    const p = this.pwdValue() ?? '';
    return [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)]
      .filter(Boolean).length;
  });

  strengthColor = computed(() =>
    (['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'] as const)[this.strength() - 1] ?? '#e2e8f0'
  );

  strengthLabel = computed(() =>
    (['Weak', 'Fair', 'Good', 'Strong'] as const)[this.strength() - 1] ?? ''
  );

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const { firstName, lastName, email, password, role } = this.form.value;

    // Simulate async registration (network delay)
    setTimeout(() => {
      this.auth.register(
        firstName!,
        lastName ?? '',
        email!,
        password!,
        (role as 'admin' | 'editor' | 'viewer') ?? 'viewer',
      );
      this.router.navigate(['/dashboard']);
    }, 1200);
  }
}