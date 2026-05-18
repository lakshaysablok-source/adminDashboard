import { Component, inject, signal } from '@angular/core';                                                                                                                                                         
  import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
  import { Router, RouterLink } from '@angular/router';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { CommonModule } from '@angular/common';                                                                                                                                                                    
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
              MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],                                                                                                                               
    template: `                                                                                                                                                                                                      
      <div class="animate-fade-in">                                                                                                                                                                                  
        <h2 class="text-3xl font-bold text-primary mb-2">Create account</h2>                                                                                                                                         
        <p class="text-muted mb-8">Join NexusPanel today — it's free</p>                                                                                                                                             
                                                                                                                                                                                                                     
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">                                                                                                                                            
          <div class="grid grid-cols-2 gap-3">                                                                                                                                                                       
            <mat-form-field appearance="outline">                                                                                                                                                                    
              <mat-label>First name</mat-label>                                                                                                                                                                      
              <input matInput formControlName="firstName">                                                                                                                                                           
              @if (form.get('firstName')?.errors?.['required'] && form.get('firstName')?.touched) {                                                                                                                  
                <mat-error>Required</mat-error>                                                                                                                                                                      
              }                                                                                                                                                                                                      
            </mat-form-field>                                                                                                                                                                                        
            <mat-form-field appearance="outline">                                                                                                                                                                    
              <mat-label>Last name</mat-label>
              <input matInput formControlName="lastName">                                                                                                                                                            
            </mat-form-field>                                                                                                                                                                                        
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <mat-form-field appearance="outline">                                                                                                                                                                      
            <mat-label>Email address</mat-label>                                                                                                                                                                     
            <input matInput type="email" formControlName="email">                                                                                                                                                    
            @if (form.get('email')?.errors?.['email'] && form.get('email')?.touched) {                                                                                                                               
              <mat-error>Enter a valid email</mat-error>
            }                                                                                                                                                                                                        
          </mat-form-field>                                                                                                                                                                                          
                                                                                                                                                                                                                     
          <mat-form-field appearance="outline">                                                                                                                                                                      
            <mat-label>Password</mat-label>                                                                                                                                                                          
            <input matInput [type]="showPwd ? 'text' : 'password'" formControlName="password"                                                                                                                        
                   (input)="updateStrength()">                                                                                                                                                                       
            <button matSuffix type="button" (click)="showPwd = !showPwd"                                                                                                                                             
                    style="border:none;background:none;cursor:pointer">                                                                                                                                              
              {{ showPwd ? '🙈' : '👁️ ' }}                                                                                                                                                                            
            </button>                                                                                                                                                                                                
          </mat-form-field>                                                                                                                                                                                          
                                                                                                                                                                                                                     
          <!-- Password strength bar -->                                                                                                                                                                             
          @if (form.get('password')?.value) {                                                                                                                                                                        
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
                                                                                                                                                                                                                     
          <mat-form-field appearance="outline" [formGroup]="form">                                                                                                                                                   
            <mat-label>Confirm password</mat-label>                                                                                                                                                                  
            <input matInput [type]="showPwd ? 'text' : 'password'" formControlName="confirmPassword">                                                                                                                
            @if (form.errors?.['mismatch'] && form.get('confirmPassword')?.touched) {                                                                                                                                
              <mat-error>Passwords do not match</mat-error>
            }                                                                                                                                                                                                        
          </mat-form-field>                                                                                                                                                                                          
                                                                                                                                                                                                                     
          <div class="flex items-start gap-2">                                                                                                                                                                       
            <mat-checkbox formControlName="terms" color="primary"></mat-checkbox>                                                                                                                                    
            <span class="text-sm text-muted mt-0.5">                                                                                                                                                                 
              I agree to the <a href="#" class="text-accent-600 hover:underline">Terms of Service</a>                                                                                                                
              and <a href="#" class="text-accent-600 hover:underline">Privacy Policy</a>                                                                                                                             
            </span>                                                                                                                                                                                                  
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <button mat-flat-button class="w-full !bg-accent-600 !text-white !h-11 !text-base"                                                                                                                         
            type="submit" [disabled]="form.invalid || loading()">                                                                                                                                                    
            {{ loading() ? 'Creating account...' : 'Create Account' }}                                                                                                                                               
          </button>                                                                                                                                                                                                  
        </form>                                                                                                                                                                                                      
                                                                                                                                                                                                                     
        <p class="mt-6 text-center text-sm text-muted">                                                                                                                                                              
          Already have an account?                                                                                                                                                                                   
          <a routerLink="/auth/login" class="text-accent-600 font-medium hover:underline ml-1">Sign in</a>                                                                                                           
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
    strength = signal(0);                                                                                                                                                                                            
                                                                                                                                                                                                                     
    form = this.fb.group({                                                                                                                                                                                           
      firstName:       ['', Validators.required],                                                                                                                                                                    
      lastName:        [''],                                                                                                                                                                                         
      email:           ['', [Validators.required, Validators.email]],                                                                                                                                                
      password:        ['', [Validators.required, Validators.minLength(8)]],                                                                                                                                         
      confirmPassword: ['', Validators.required],                                                                                                                                                                    
      terms:           [false, Validators.requiredTrue],
    }, { validators: passwordMatchValidator });                                                                                                                                                                      
                                                                                                                                                                                                                     
    updateStrength() {                                                                                                                                                                                               
      const pwd = this.form.get('password')?.value ?? '';                                                                                                                                                            
      let score = 0;                                                                                                                                                                                                 
      if (pwd.length >= 8)          score++;                                                                                                                                                                         
      if (/[A-Z]/.test(pwd))        score++;                                                                                                                                                                         
      if (/[0-9]/.test(pwd))        score++;                                                                                                                                                                         
      if (/[^A-Za-z0-9]/.test(pwd)) score++;                                                                                                                                                                         
      this.strength.set(score);                                                                                                                                                                                      
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    strengthColor() {                                                                                                                                                                                                
      return ['#ef4444','#f59e0b','#3b82f6','#22c55e'][this.strength() - 1] ?? '#e2e8f0';                                                                                                                            
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    strengthLabel() {                         
      return ['Weak','Fair','Good','Strong'][this.strength() - 1] ?? '';                                                                                                                                             
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    submit() {
      if (this.form.invalid) return;                                                                                                                                                                                 
      this.loading.set(true);                 
      const { email, password } = this.form.value;                                                                                                                                                                   
      this.auth.login(email!, password!);     
      this.router.navigate(['/dashboard']);                                                                                                                                                                          
    }                                                                                                                                                                                                                
  }