import { Component, inject, signal } from '@angular/core';                                                                                                                                                         
  import { CommonModule } from '@angular/common';
  import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';                                                                                     
  import { MatFormFieldModule } from '@angular/material/form-field';                                                                                                                                                 
  import { MatInputModule } from '@angular/material/input';                                                                                                                                                          
  import { MatButtonModule } from '@angular/material/button';                                                                                                                                                        
  import { MatSelectModule } from '@angular/material/select';                                                                                                                                                        
  import { MatCheckboxModule } from '@angular/material/checkbox';                                                                                                                                                    
  import { MatStepperModule } from '@angular/material/stepper';                                                                                                                                                      
                  
  const noSpacesValidator: ValidatorFn = (c: AbstractControl): ValidationErrors | null =>
    /\s/.test(c.value) ? { noSpaces: true } : null;
                                              
  const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {                                                                                                                 
    const pwd  = group.get('password')?.value;
    const conf = group.get('confirm')?.value;                                                                                                                                                                        
    return pwd && conf && pwd !== conf ? { mismatch: true } : null;                                                                                                                                                  
  };                                                                                                                                                                                                                 
                                                                                                                                                                                                                     
  @Component({    
    selector: 'app-form-validation',                                                                                                                                                                                 
    standalone: true,                         
    imports: [                                                                                                                                                                                                       
      CommonModule, ReactiveFormsModule,  
      MatFormFieldModule, MatInputModule, MatButtonModule,                                                                                                                                                           
      MatSelectModule, MatCheckboxModule, MatStepperModule,                                                                                                                                                          
    ],                                                                                                                                                                                                               
    template: `                                                                                                                                                                                                      
      <div class="space-y-6 animate-fade-in">                                                                                                                                                                        
        <div>                                                                                                                                                                                                        
          <h1 class="text-2xl font-bold text-primary">Form Validation</h1>                                                                                                                                           
          <p class="text-muted text-sm mt-1">Reactive forms with built-in and custom validators</p>
        </div>                                                                                                                                                                                                       
                                          
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">                                                                                                                                                          
                                                                                                                                                                                                                     
          <!-- Basic Validation -->                                                                                                                                                                                  
          <div class="card">                                                                                                                                                                                         
            <h3 class="font-semibold text-primary mb-4">Basic Validators</h3>
            <form [formGroup]="basicForm" (ngSubmit)="submitBasic()" class="space-y-3">                                                                                                                              
                                              
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name">                                                                                                                                                              
                @if (basicForm.get('name')?.errors?.['required'] && basicForm.get('name')?.touched) {                                                                                                                
                  <mat-error>Name is required</mat-error>                                                                                                                                                            
                }                                                                                                                                                                                                    
                @if (basicForm.get('name')?.errors?.['minlength']) {                                                                                                                                                 
                  <mat-error>Minimum 3 characters</mat-error>                                                                                                                                                        
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Email</mat-label>                                                                                                                                                                         
                <input matInput type="email" formControlName="email">                                                                                                                                                
                @if (basicForm.get('email')?.errors?.['required'] && basicForm.get('email')?.touched) {                                                                                                              
                  <mat-error>Email is required</mat-error>                                                                                                                                                           
                }                                                                                                                                                                                                    
                @if (basicForm.get('email')?.errors?.['email']) {                                                                                                                                                    
                  <mat-error>Enter a valid email address</mat-error>                                                                                                                                                 
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Username (no spaces)</mat-label>                                                                                                                                                          
                <input matInput formControlName="username">                                                                                                                                                          
                @if (basicForm.get('username')?.errors?.['noSpaces']) {                                                                                                                                              
                  <mat-error>Username cannot contain spaces</mat-error>                                                                                                                                              
                }                                                                                                                                                                                                    
                @if (basicForm.get('username')?.errors?.['minlength']) {                                                                                                                                             
                  <mat-error>Minimum 4 characters</mat-error>                                                                                                                                                        
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Age</mat-label>
                <input matInput type="number" formControlName="age">                                                                                                                                                 
                @if (basicForm.get('age')?.errors?.['min']) {                                                                                                                                                        
                  <mat-error>Must be at least 18</mat-error>                                                                                                                                                         
                }                                                                                                                                                                                                    
                @if (basicForm.get('age')?.errors?.['max']) {                                                                                                                                                        
                  <mat-error>Must be under 120</mat-error>                                                                                                                                                           
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Website URL</mat-label>                                                                                                                                                                   
                <input matInput formControlName="website" placeholder="https://...">                                                                                                                                 
                @if (basicForm.get('website')?.errors?.['pattern']) {                                                                                                                                                
                  <mat-error>Must start with https://</mat-error>                                                                                                                                                    
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <button mat-flat-button class="w-full !bg-accent-600 !text-white"                                                                                                                                      
                type="submit" [disabled]="basicForm.invalid">                                                                                                                                                        
                Submit                                                                                                                                                                                               
              </button>                                                                                                                                                                                              
                                                                                                                                                                                                                     
              @if (basicSubmitted()) {                                                                                                                                                                               
                <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 animate-fade-in">                                                                                              
                  ✅ Form submitted successfully!                                                                                                                                                                    
                </div>                                                                                                                                                                                               
              }                                                                                                                                                                                                      
            </form>                                                                                                                                                                                                  
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Password Validation -->                                                                                                                                                                               
          <div class="card">
            <h3 class="font-semibold text-primary mb-4">Password Validation</h3>
            <form [formGroup]="pwdForm" (ngSubmit)="submitPwd()" class="space-y-3">                                                                                                                                  
                                              
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Current Password</mat-label>                                                                                                                                                              
                <input matInput type="password" formControlName="current">                                                                                                                                           
                @if (pwdForm.get('current')?.errors?.['required'] && pwdForm.get('current')?.touched) {                                                                                                              
                  <mat-error>Current password required</mat-error>                                                                                                                                                   
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>New Password</mat-label>                                                                                                                                                                  
                <input matInput [type]="showNew ? 'text' : 'password'" formControlName="password"                                                                                                                    
                       (input)="calcStrength()">                                                                                                                                                                     
                <button matSuffix type="button" (click)="showNew = !showNew"                                                                                                                                         
                        style="border:none;background:none;cursor:pointer">                                                                                                                                          
                  {{ showNew ? '🙈' : '👁️ ' }}                                                                                                                                                                        
                </button>                                                                                                                                                                                            
                @if (pwdForm.get('password')?.errors?.['minlength']) {                                                                                                                                               
                  <mat-error>Minimum 8 characters</mat-error>                                                                                                                                                        
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <!-- Strength indicator -->                                                                                                                                                                            
              @if (pwdForm.get('password')?.value) {                                                                                                                                                                 
                <div class="space-y-2">                                                                                                                                                                              
                  <div class="flex gap-1.5">                                                                                                                                                                         
                    @for (i of [0,1,2,3]; track i) {                                                                                                                                                                 
                      <div class="h-1.5 flex-1 rounded-full transition-all duration-300"                                                                                                                             
                        [style.background]="i < pwdStrength() ? pwdStrengthColor() : 'var(--border-default)'">                                                                                                       
                      </div>                                                                                                                                                                                         
                    }                                                                                                                                                                                                
                  </div>
                  <div class="flex justify-between text-xs">                                                                                                                                                         
                    <span [style.color]="pwdStrengthColor()">{{ pwdStrengthLabel() }}</span>                                                                                                                         
                    <span class="text-muted">Use uppercase, numbers & symbols</span>                                                                                                                                 
                  </div>                                                                                                                                                                                             
                  <div class="space-y-1">                                                                                                                                                                            
                    @for (rule of pwdRules(); track rule.label) {                                                                                                                                                    
                      <div class="flex items-center gap-1.5 text-xs"                                                                                                                                                 
                        [class.text-green-500]="rule.pass" [class.text-muted]="!rule.pass">                                                                                                                          
                        {{ rule.pass ? '✓' : '○' }} {{ rule.label }}                                                                                                                                                 
                      </div>                                                                                                                                                                                         
                    }                                                                                                                                                                                                
                  </div>                                                                                                                                                                                             
                </div>                                                                                                                                                                                               
              }                                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <mat-form-field appearance="outline">                                                                                                                                                                  
                <mat-label>Confirm Password</mat-label>
                <input matInput type="password" formControlName="confirm">
                @if (pwdForm.errors?.['mismatch'] && pwdForm.get('confirm')?.touched) {                                                                                                                              
                  <mat-error>Passwords do not match</mat-error>
                }                                                                                                                                                                                                    
              </mat-form-field>                                                                                                                                                                                      
                                                                                                                                                                                                                     
              <button mat-flat-button class="w-full !bg-accent-600 !text-white"                                                                                                                                      
                type="submit" [disabled]="pwdForm.invalid">                                                                                                                                                          
                Update Password                                                                                                                                                                                      
              </button>                       
                                                                                                                                                                                                                     
              @if (pwdSubmitted()) {                                                                                                                                                                                 
                <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 animate-fade-in">                                                                                              
                  ✅ Password updated!                                                                                                                                                                               
                </div>                                                                                                                                                                                               
              }                           
            </form>                                                                                                                                                                                                  
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Multi-step Form -->
           <div class="card xl:col-span-2">
            <h3 class="font-semibold text-primary mb-6">Multi-Step Form</h3>                                                                                                                                         
            <mat-stepper [linear]="true" #stepper>                                                                                                                                                                   
                                                                                                                                                                                                                     
              <mat-step [stepControl]="step1">                                                                                                                                                                       
                <ng-template matStepLabel>Personal Info</ng-template>                                                                                                                                                
                <form [formGroup]="step1" class="space-y-3 pt-4">                                                                                                                                                    
                  <div class="grid grid-cols-2 gap-3">                                                                                                                                                               
                    <mat-form-field appearance="outline">                                                                                                                                                            
                      <mat-label>First Name</mat-label>                                                                                                                                                              
                      <input matInput formControlName="firstName">                                                                                                                                                   
                      @if (step1.get('firstName')?.errors?.['required'] && step1.get('firstName')?.touched) {                                                                                                        
                        <mat-error>Required</mat-error>                                                                                                                                                              
                      }                                                                                                                                                                                              
                    </mat-form-field>                                                                                                                                                                                
                    <mat-form-field appearance="outline">                                                                                                                                                            
                      <mat-label>Last Name</mat-label>                                                                                                                                                               
                      <input matInput formControlName="lastName">                                                                                                                                                    
                    </mat-form-field>                                                                                                                                                                                
                  </div>                                                                                                                                                                                             
                  <mat-form-field appearance="outline">                                                                                                                                                              
                    <mat-label>Email</mat-label>                                                                                                                                                                     
                    <input matInput type="email" formControlName="email">                                                                                                                                            
                    @if (step1.get('email')?.errors?.['email'] && step1.get('email')?.touched) {                                                                                                                     
                      <mat-error>Invalid email</mat-error>                                                                                                                                                           
                    }                                                                                                                                                                                                
                  </mat-form-field>                                                                                                                                                                                  
                  <div class="flex justify-end mt-2">                                                                                                                                                                
                    <button mat-flat-button matStepperNext class="!bg-accent-600 !text-white"                                                                                                                        
                      [disabled]="step1.invalid">Next</button>                                                                                                                                                       
                  </div>                                                                                                                                                                                             
                </form>                                                                                                                                                                                              
              </mat-step>
              <mat-step [stepControl]="step2">                                                                                                                                                                       
                <ng-template matStepLabel>Account Details</ng-template>                                                                                                                                              
                <form [formGroup]="step2" class="space-y-3 pt-4">                                                                                                                                                    
                  <mat-form-field appearance="outline">                                                                                                                                                              
                    <mat-label>Username</mat-label>                                                                                                                                                                  
                    <input matInput formControlName="username">                                                                                                                                                      
                  </mat-form-field>                                                                                                                                                                                  
                  <mat-form-field appearance="outline">                                                                                                                                                              
                    <mat-label>Role</mat-label>                                                                                                                                                                      
                    <mat-select formControlName="role">                                                                                                                                                              
                      <mat-option value="admin">Admin</mat-option>                                                                                                                                                   
                      <mat-option value="editor">Editor</mat-option>                                                                                                                                                 
                      <mat-option value="viewer">Viewer</mat-option>                                                                                                                                                 
                    </mat-select>                                                                                                                                                                                    
                  </mat-form-field>                                                                                                                                                                                  
                  <div class="flex justify-between mt-2">                                                                                                                                                            
                    <button mat-stroked-button matStepperPrevious>Back</button>                                                                                                                                      
                    <button mat-flat-button matStepperNext class="!bg-accent-600 !text-white"                                                                                                                        
                      [disabled]="step2.invalid">Next</button>                                                                                                                                                       
                  </div>                                                                                                                                                                                             
                </form>                                                                                                                                                                                              
              </mat-step>                                                                                                                                                                                            
                                                                                                                                                                                                                     
              <mat-step>                                                                                                                                                                                             
                <ng-template matStepLabel>Confirm</ng-template>                                                                                                                                                      
                <div class="pt-4 space-y-3">                                                                                                                                                                         
                  <div class="p-4 bg-elevated rounded-lg space-y-2 text-sm">                                                                                                                                         
                    <div class="flex justify-between">                                                                                                                                                               
                      <span class="text-muted">Name</span>                                                                                                                                                           
                      <span class="font-medium">{{ step1.get('firstName')?.value }} {{ step1.get('lastName')?.value }}</span>                                                                                        
                    </div>                                                                                                                                                                                           
                    <div class="flex justify-between">
                      <span class="text-muted">Email</span>                                                                                                                                                          
                      <span class="font-medium">{{ step1.get('email')?.value }}</span>                                                                                                                               
                    </div>                    
                    <div class="flex justify-between">                                                                                                                                                               
                      <span class="text-muted">Username</span>                                                                                                                                                       
                      <span class="font-medium">{{ step2.get('username')?.value }}</span>                                                                                                                            
                    </div>                                                                                                                                                                                           
                    <div class="flex justify-between">                                                                                                                                                               
                      <span class="text-muted">Role</span>
                      <span class="font-medium capitalize">{{ step2.get('role')?.value }}</span>                                                                                                                     
                    </div>                                                                                                                                                                                           
                  </div>                                                                                                                                                                                             
                  <div class="flex justify-between">                                                                                                                                                                 
                    <button mat-stroked-button matStepperPrevious>Back</button>                                                                                                                                      
                    <button mat-flat-button class="!bg-accent-600 !text-white"                                                                                                                                       
                      (click)="stepSubmitted.set(true); stepper.reset()">                                                                                                                                            
                      {{ stepSubmitted() ? '✅ Submitted!' : 'Submit' }}                                                                                                                                             
                    </button>                                                                                                                                                                                        
                  </div>                                                                                                                                                                                             
                </div>                                                                                                                                                                                               
              </mat-step>                                                                                                                                                                                            
                                                                                                                                                                                                                     
            </mat-stepper>                                                                                                                                                                                           
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
      </div>                                                                                                                                                                                                         
    `,                                                                                                                                                                                                               
  })                                      
  export default class FormValidationComponent {                                                                                                                                                                     
    private fb = inject(FormBuilder);                                                                                                                                                                                
                                              
    showNew       = false;                                                                                                                                                                                           
    basicSubmitted = signal(false);                                                                                                                                                                                  
    pwdSubmitted   = signal(false);                                                                                                                                                                                  
    stepSubmitted  = signal(false);
    pwdStrength    = signal(0);                                                                                                                                                                                      
                                                                                                                                                                                                                     
    basicForm = this.fb.group({                                                                                                                                                                                      
      name:     ['', [Validators.required, Validators.minLength(3)]],                                                                                                                                                
      email:    ['', [Validators.required, Validators.email]],                                                                                                                                                       
      username: ['', [Validators.required, Validators.minLength(4), noSpacesValidator]],                                                                                                                             
      age:      [null, [Validators.min(18), Validators.max(120)]],                                                                                                                                                   
      website:  ['', Validators.pattern(/^https:\/\/.+/)],                                                                                                                                                           
    });                                                                                                                                                                                                              
                                                                                                                                                                                                                     
    pwdForm = this.fb.group({                                                                                                                                                                                        
      current:  ['', Validators.required],                                                                                                                                                                           
      password: ['', [Validators.required, Validators.minLength(8)]],                                                                                                                                                
      confirm:  ['', Validators.required],                                                                                                                                                                           
    }, { validators: passwordMatchValidator });                                                                                                                                                                      
                                                                                                                                                                                                                     
    step1 = this.fb.group({                                                                                                                                                                                          
      firstName: ['', Validators.required],                                                                                                                                                                          
      lastName:  [''],                                                                                                                                                                                               
      email:     ['', [Validators.required, Validators.email]],                                                                                                                                                      
    });                                                                                                                                                                                                              
                                                                                                                                                                                                                     
    step2 = this.fb.group({                                                                                                                                                                                          
      username: ['', Validators.required],                                                                                                                                                                           
      role:     ['editor', Validators.required],                                                                                                                                                                     
    });                                                                                                                                                                                                              
                                                                                                                                                                                                                     
    calcStrength() {                                                                                                                                                                                                 
      const pwd = this.pwdForm.get('password')?.value ?? '';                                                                                                                                                         
      let s = 0;                                                                                                                                                                                                     
      if (pwd.length >= 8)          s++;                                                                                                                                                                             
      if (/[A-Z]/.test(pwd))        s++;                                                                                                                                                                             
      if (/[0-9]/.test(pwd))s++;                                                                                                                                                                             
      if (/[^A-Za-z0-9]/.test(pwd)) s++;                                                                                                                                                                             
      this.pwdStrength.set(s);                                                                                                                                                                                       
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    pwdStrengthColor() {                                                                                                                                                                                             
      return ['#ef4444','#f59e0b','#3b82f6','#22c55e'][this.pwdStrength() - 1] ?? '#e2e8f0';                                                                                                                         
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    pwdStrengthLabel() {                      
      return ['Weak','Fair','Good','Strong'][this.pwdStrength() - 1] ?? '';                                                                                                                                          
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    pwdRules() {                                                                                                                                                                                                     
      const pwd = this.pwdForm.get('password')?.value ?? '';                                                                                                                                                         
      return [                                
        { label: 'At least 8 characters',      pass: pwd.length >= 8 },                                                                                                                                              
        { label: 'One uppercase letter (A-Z)',  pass: /[A-Z]/.test(pwd) },
        { label: 'One number (0-9)',            pass: /[0-9]/.test(pwd) },                                                                                                                                           
        { label: 'One special character (!@#)', pass: /[^A-Za-z0-9]/.test(pwd) },                                                                                                                                    
      ];                                                                                                                                                                                                             
    }                                                                                                                                                                                                                
                                                                                                                                                                                                                     
    submitBasic() { if (this.basicForm.valid) this.basicSubmitted.set(true); }                                                                                                                                       
    submitPwd()   { if (this.pwdForm.valid)   this.pwdSubmitted.set(true); }                                                                                                                                         
  }