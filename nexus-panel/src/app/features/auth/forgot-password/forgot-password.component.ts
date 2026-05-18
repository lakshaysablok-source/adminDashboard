import { Component } from '@angular/core';                                                                                                                                                                         
  import { RouterLink } from '@angular/router';
                                                                                                                                                                                                                     
  @Component({                                                                                                                                                                                                       
    selector: 'app-forgot-password',
    standalone: true,                                                                                                                                                                                                
    imports: [RouterLink],
    template: `           
      <div class="animate-fade-in">
        <h2 class="text-3xl font-bold text-primary mb-2">Forgot password?</h2>
        <p class="text-muted mb-8">We'll send you a reset link.</p>           
        <p class="text-secondary">Forgot password form coming soon.</p>                                                                                                                                              
        <a routerLink="/auth/login" class="text-accent-600 hover:underline text-sm mt-4 block">
          ← Back to login                                                                                                                                                                                            
        </a>                                                                                                                                                                                                         
      </div>                                                                                                                                                                                                         
    `,                                                                                                                                                                                                               
  })                                                                                                                                                                                                                 
  export default class ForgotPasswordComponent {}