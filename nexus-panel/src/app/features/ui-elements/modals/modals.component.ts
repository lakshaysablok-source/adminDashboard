import { Component, inject, signal } from '@angular/core';                                                                                                                                                         
  import { CommonModule } from '@angular/common';
  import { MatButtonModule } from '@angular/material/button';                                                                                                                                                        
  import { MatDialogModule, MatDialog } from '@angular/material/dialog';                                                                                                                                             
  import { MatFormFieldModule } from '@angular/material/form-field';                                                                                                                                                 
  import { MatInputModule } from '@angular/material/input';                                                                                                                                                          
  import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';                                                                                                                                     
                                                                                                                                                                                                                     
  // ─── Confirm Dialog ──────────────────────────────────────                                                                                                                                                       
  @Component({                                                                                                                                                                                                       
    selector: 'app-confirm-dialog',                                                                                                                                                                                  
    standalone: true,                                                                                                                                                                                                
    imports: [MatButtonModule, MatDialogModule],                                                                                                                                                                     
    template: `                                                                                                                                                                                                      
      <div class="p-6">
        <div class="text-4xl mb-3 text-center">⚠️ </div>
        <h2 class="text-lg font-semibold text-primary text-center mb-2">Delete Item</h2>
        <p class="text-sm text-muted text-center mb-6">
          Are you sure you want to delete this item?<br>This action cannot be undone.
        </p>                                                                                                                                                                                                         
        <div class="flex gap-3">                                                                                                                                                                                     
          <button mat-stroked-button [mat-dialog-close]="false" class="flex-1">Cancel</button>                                                                                                                       
          <button mat-flat-button [mat-dialog-close]="true"                                                                                                                                                          
            class="flex-1 !bg-red-600 !text-white">Delete</button>                                                                                                                                                   
        </div>                                                                                                                                                                                                       
      </div>                              
    `,                                                                                                                                                                                                               
  })                                                                                                                                                                                                                 
  export class ConfirmDialogComponent {}                                                                                                                                                                             
                                                                                                                                                                                                                     
  // ─── Form Dialog ─────────────────────────────────────────
  @Component({                                                                                                                                                                                                       
    selector: 'app-form-dialog',
    standalone: true,                                                                                                                                                                                                
    imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    template: `                               
      <div class="p-6 w-96">              
        <h2 class="text-lg font-semibold text-primary mb-4">Add New User</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3">                                                                                                                                            
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>                                                                                                                                                                         
            <input matInput formControlName="name">                                                                                                                                                                  
          </mat-form-field>
          <mat-form-field appearance="outline">                                                                                                                                                                      
            <mat-label>Email</mat-label>                                                                                                                                                                             
            <input matInput type="email" formControlName="email">                                                                                                                                                    
          </mat-form-field>                   
          <div class="flex gap-3 pt-2">   
            <button mat-stroked-button type="button" [mat-dialog-close]="null" class="flex-1">Cancel</button>
            <button mat-flat-button type="submit" class="flex-1 !bg-accent-600 !text-white"                                                                                                                          
              [disabled]="form.invalid">Add User</button>
          </div>                                                                                                                                                                                                     
        </form>   
      </div>                                                                                                                                                                                                         
    `,            
  })                                                                                                                                                                                                                 
  export class FormDialogComponent {
    private fb = inject(FormBuilder);
    private dialog = inject(MatDialog);
                                              
    form = this.fb.group({                
      name:  ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],                                                                                                                                                          
    });                                       
                                                                                                                                                                                                                     
    submit() {    
      if (this.form.valid) {                                                                                                                                                                                         
        inject(MatDialog);
      }                                                                                                                                                                                                              
    }             
  }

  // ─── Main Page ───────────────────────────────────────────
  @Component({
    selector: 'app-modals',
    standalone: true,                         
    imports: [CommonModule, MatButtonModule, MatDialogModule],
    template: `
      <div class="space-y-6 animate-fade-in">                                                                                                                                                                        
        <div>
          <h1 class="text-2xl font-bold text-primary">Modals & Dialogs</h1>                                                                                                                                          
          <p class="text-muted text-sm mt-1">Angular Material dialog examples</p>
        </div>                            

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">                                                                                                                                           
                                          
          <div class="card">                                                                                                                                                                                         
            <h4 class="font-semibold text-primary mb-1">Confirmation Dialog</h4>                                                                                                                                     
            <p class="text-sm text-muted mb-4">Ask user to confirm a destructive action.</p>
            <button class="btn btn-danger w-full" (click)="openConfirm()">Open Confirm Dialog</button>                                                                                                               
            @if (confirmResult() !== null) {
              <p class="text-sm mt-3 text-center" [class.text-green-500]="!confirmResult()"
                                                   [class.text-red-500]="confirmResult()">
                {{ confirmResult() ? '🗑 Deleted!' : '✓ Cancelled' }}
              </p>                                                                                                                                                                                                   
            }                                                                                                                                                                                                        
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <div class="card">
            <h4 class="font-semibold text-primary mb-1">Form Dialog</h4>
            <p class="text-sm text-muted mb-4">A dialog with a reactive form inside.</p>
            <button class="btn btn-primary w-full" (click)="openForm()">Open Form Dialog</button>
            @if (formResult()) {
              <p class="text-sm mt-3 text-green-500 text-center">✅ User added: {{ formResult()?.name }}</p>
            }                                 
          </div>                          

          <div class="card">                                                                                                                                                                                         
            <h4 class="font-semibold text-primary mb-1">Inline Modal</h4>
            <p class="text-sm text-muted mb-4">A modal rendered directly in the component template.</p>
            <button class="btn btn-primary w-full" (click)="inlineOpen.set(true)">Open Inline Modal</button>
          </div>                              
                                              
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <!-- Inline Modal Overlay -->                                                                                                                                                                                
        @if (inlineOpen()) {                                                                                                                                                                                         
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">                                                                                                                      
            <div class="absolute inset-0 bg-black/50" (click)="inlineOpen.set(false)"></div>                                                                                                                         
            <div class="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 z-10 animate-slide-in">
              <button class="absolute top-4 right-4 text-muted hover:text-primary border-none bg-transparent cursor-pointer text-xl"                                                                                 
                (click)="inlineOpen.set(false)">✕</button>
              <h3 class="text-lg font-semibold text-primary mb-2">Inline Modal</h3>                                                                                                                                  
              <p class="text-sm text-muted mb-4">
                This modal is rendered directly in the component template using Angular's                                                                                                                            
                <code class="bg-elevated px-1 rounded text-xs">&#64;if</code> syntax.                                                                                                                                
                No MatDialog needed.                                                                                                                                                                                 
              </p>                                                                                                                                                                                                   
              <div class="flex gap-3">                                                                                                                                                                               
                <button class="btn btn-ghost flex-1" (click)="inlineOpen.set(false)">Cancel</button>                                                                                                                 
                <button class="btn btn-primary flex-1" (click)="inlineOpen.set(false)">Confirm</button>
              </div>                                                                                                                                                                                                 
            </div>                            
          </div>                          
        }
                                                                                                                                                                                                                     
      </div>
    `,                                                                                                                                                                                                               
    styles: [`.btn { display:inline-flex;align-items:center;justify-content:center;padding:.5rem 1rem;border-radius:var(--radius-md);font-size:.875rem;font-weight:500;cursor:pointer;border:1px solid 
  transparent;transition:all 150ms ease; }    
    .btn-primary { background:var(--accent-600);color:#fff; }
    .btn-danger  { background:#dc2626;color:#fff; }
    .btn-ghost   { background:transparent;color:var(--text-secondary);border:1px solid var(--border-default); }`]                                                                                                    
  })                                          
  export default class ModalsComponent {                                                                                                                                                                             
    private dialog = inject(MatDialog);
                                                                                                                                                                                                                     
    inlineOpen    = signal(false);        
    confirmResult = signal<boolean | null>(null);                                                                                                                                                                    
    formResult    = signal<any>(null);                                                                                                                                                                               
   
    openConfirm() {                                                                                                                                                                                                  
      this.dialog.open(ConfirmDialogComponent, { width: '360px', panelClass: 'rounded-dialog' })
        .afterClosed().subscribe(result => {  
          if (result !== undefined) this.confirmResult.set(result);
        });
    }                                                                                                                                                                                                                
   
    openForm() {                                                                                                                                                                                                     
      this.dialog.open(FormDialogComponent, { panelClass: 'rounded-dialog' })
        .afterClosed().subscribe(result => {
          if (result) this.formResult.set(result);
        });
    }
  }