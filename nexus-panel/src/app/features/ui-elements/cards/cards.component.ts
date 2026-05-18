import { Component } from '@angular/core';                                                                                                                                                                         
  import { CommonModule } from '@angular/common';
  import { MatButtonModule } from '@angular/material/button';                                                                                                                                                        
  import { MatMenuModule } from '@angular/material/menu';
                                                                                                                                                                                                                     
  @Component({                                                                                                                                                                                                       
    selector: 'app-cards',                                                                                                                                                                                           
    standalone: true,                                                                                                                                                                                                
    imports: [CommonModule, MatButtonModule, MatMenuModule],                                                                                                                                                         
    template: `                                                                                                                                                                                                      
      <div class="space-y-6 animate-fade-in">                                                                                                                                                                        
        <div>                                                                                                                                                                                                        
          <h1 class="text-2xl font-bold text-primary">Cards</h1>                                                                                                                                                     
          <p class="text-muted text-sm mt-1">Card components for every use case</p>                                                                                                                                  
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <!-- Basic Cards -->                                                                                                                                                                                         
        <div>                                                                                                                                                                                                        
          <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Basic</h3>                                                                                                                       
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">                                                                                                                                         
            <div class="card">                                                                                                                                                                                       
              <h4 class="font-semibold text-primary mb-1">Simple Card</h4>                                                                                                                                           
              <p class="text-sm text-muted">Basic card with title and body text. Use it to group related content.</p>                                                                                                
            </div>                                                                                                                                                                                                   
            <div class="card">                                                                                                                                                                                       
              <div class="flex items-center justify-between mb-3">                                                                                                                                                   
                <h4 class="font-semibold text-primary">With Action</h4>                                                                                                                                              
                <button class="text-xs text-accent-600 hover:underline border-none bg-transparent cursor-pointer">View all</button>                                                                                  
              </div>                                                                                                                                                                                                 
              <p class="text-sm text-muted">Card with a header action link for navigation or triggering a modal.</p>                                                                                                 
            </div>                            
            <div class="card">                                                                                                                                                                                       
              <h4 class="font-semibold text-primary mb-1">With Footer</h4>                                                                                                                                           
              <p class="text-sm text-muted mb-4">Content area with a separator and footer actions below.</p>                                                                                                         
              <div class="pt-3 border-t border-border flex gap-2">
                <button class="btn btn-primary !text-xs !py-1">Accept</button>                                                                                                                                       
                <button class="btn btn-ghost !text-xs !py-1">Decline</button>                                                                                                                                        
              </div>                                                                                                                                                                                                 
            </div>                                                                                                                                                                                                   
          </div>                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <!-- Profile Cards -->                                                                                                                                                                                       
        <div>     
          <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Profile</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            @for (user of users; track user.name) {
              <div class="card text-center hover:shadow-card-hover transition-shadow">
                <img [src]="user.avatar" class="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-border" [alt]="user.name">                                                                                       
                <h4 class="font-semibold text-primary">{{ user.name }}</h4>                                                                                                                                          
                <p class="text-sm text-muted mb-1">{{ user.role }}</p>                                                                                                                                               
                <span class="badge badge-success mb-3">{{ user.status }}</span>                                                                                                                                      
                <div class="flex justify-center gap-6 pt-3 border-t border-border text-sm">                                                                                                                          
                  <div class="text-center">                                                                                                                                                                          
                    <div class="font-bold text-primary">{{ user.posts }}</div>                                                                                                                                       
                    <div class="text-muted text-xs">Posts</div>                                                                                                                                                      
                  </div>                                                                                                                                                                                             
                  <div class="text-center">                                                                                                                                                                          
                    <div class="font-bold text-primary">{{ user.followers }}</div>                                                                                                                                   
                    <div class="text-muted text-xs">Followers</div>                                                                                                                                                  
                  </div>                                                                                                                                                                                             
                  <div class="text-center">                                                                                                                                                                          
                    <div class="font-bold text-primary">{{ user.following }}</div>                                                                                                                                   
                    <div class="text-muted text-xs">Following</div>                                                                                                                                                  
                  </div>                                                                                                                                                                                             
                </div>                                                                                                                                                                                               
              </div>                                                                                                                                                                                                 
            }                                                                                                                                                                                                        
          </div>                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <!-- Stats Cards -->
         <div>                                                                                                                                                                                                        
          <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Stats</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            @for (stat of statCards; track stat.label) {
              <div class="card" [style.border-left]="'3px solid ' + stat.color">
                <div class="flex items-center justify-between">
                  <div>                                                                                                                                                                                              
                    <p class="text-xs text-muted uppercase tracking-wide">{{ stat.label }}</p>                                                                                                                       
                    <p class="text-2xl font-bold text-primary mt-1">{{ stat.value }}</p>                                                                                                                             
                    <p class="text-xs mt-1" [style.color]="stat.color">{{ stat.trend }}</p>                                                                                                                          
                  </div>                                                                                                                                                                                             
                  <div class="text-3xl opacity-80">{{ stat.icon }}</div>                                                                                                                                             
                </div>                                                                                                                                                                                               
              </div>                                                                                                                                                                                                 
            }                                                                                                                                                                                                        
          </div>                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <!-- Pricing Cards -->                                                                                                                                                                                       
        <div>                             
          <h3 class="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Pricing</h3>                                                                                                                     
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">                                                                                                                                                        
            @for (plan of plans; track plan.name) {                                                                                                                                                                  
              <div class="card relative" [class.!border-accent-500]="plan.popular"                                                                                                                                   
                   [class.!shadow-lg]="plan.popular">                                                                                                                                                                
                @if (plan.popular) {                                                                                                                                                                                 
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2">                                                                                                                                            
                    <span class="badge badge-accent px-3 py-1 shadow-sm">Most Popular</span>                                                                                                                         
                  </div>                                                                                                                                                                                             
                }                                                                                                                                                                                                    
                <div class="text-center mb-4">                                                                                                                                                                       
                  <h4 class="font-bold text-primary text-lg">{{ plan.name }}</h4>                                                                                                                                    
                  <div class="mt-2">                                                                                                                                                                                 
                    <span class="text-4xl font-black text-primary">{{ plan.price }}</span>                                                                                                                           
                    <span class="text-muted text-sm">/month</span>                                                                                                                                                   
                  </div>
                  <p class="text-sm text-muted mt-1">{{ plan.desc }}</p>                                                                                                                                             
                </div>                                                                                                                                                                                               
                <ul class="space-y-2 mb-6">                                                                                                                                                                          
                  @for (f of plan.features; track f) {                                                                                                                                                               
                    <li class="flex items-center gap-2 text-sm">                                                                                                                                                     
                      <span class="text-green-500">✓</span>                                                                                                                                                          
                      <span class="text-secondary">{{ f }}</span>                                                                                                                                                    
                    </li>                                                                                                                                                                                            
                  }                                                                                                                                                                                                  
                </ul>                                                                                                                                                                                                
                <button class="w-full py-2 rounded-lg text-sm font-medium transition-colors"                                                                                                                         
                  [class.bg-accent-600]="plan.popular" [class.text-white]="plan.popular"                                                                                                                             
                  [class.border]="!plan.popular" [class.border-accent-500]="!plan.popular"                                                                                                                           
                  [class.text-accent-600]="!plan.popular">
                  Get Started                                                                                                                                                                                        
                </button>                                                                                                                                                                                            
              </div>                                                                                                                                                                                                 
            }                                                                                                                                                                                                        
          </div>                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
      </div>                                  
    `,                                    
    styles: [`.btn { display:inline-flex;align-items:center;justify-content:center;padding:.5rem 1rem;border-radius:var(--radius-md);font-size:.875rem;font-weight:500;cursor:pointer;border:1px solid 
  transparent;transition:all 150ms ease; }                                                                                                                                                                           
    .btn-primary { background:var(--accent-600);color:#fff; }
    .btn-ghost { background:transparent;color:var(--text-secondary); }`]                                                                                                                                             
  })                                                                                                                                                                                                                 
  export default class CardsComponent {                                                                                                                                                                              
    users = [                                                                                                                                                                                                        
      { name: 'Alice Johnson', role: 'Frontend Dev',    status: 'online',  posts: '124', followers: '1.2k', following: '340', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },                     
      { name: 'Bob Smith',     role: 'Backend Dev',     status: 'busy',    posts: '87',  followers: '894',  following: '210', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },                       
      { name: 'Carol White',   role: 'UX Designer',     status: 'online',  posts: '203', followers: '2.4k', following: '512', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },                     
    ];                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    statCards = [{ label: 'Total Revenue', value: '$84.5k', trend: '↑ 12.5% this month', color: '#6366f1', icon: '💰' },                                                                                                        
      { label: 'Active Users',  value: '24,310', trend: '↑ 8.1% this week',   color: '#10b981', icon: '👥' },                                                                                                        
      { label: 'New Orders',    value: '1,429',  trend: '↑ 4.6% today',       color: '#f59e0b', icon: '📦' },                                                                                                        
      { label: 'Churn Rate',    value: '2.4%',   trend: '↓ 0.3% this month',  color: '#ef4444', icon: '📉' },
    ];                                                                                                                                                                                                               
                                                                                                                                                                                                                     
    plans = [                                                                                                                                                                                                        
      {                                                                                                                                                                                                              
        name: 'Starter', price: '$9', desc: 'Perfect for side projects', popular: false,                                                                                                                             
        features: ['5 Projects', '10GB Storage', 'Basic Analytics', 'Email Support'],                                                                                                                                
      },                                      
      {                                   
        name: 'Pro', price: '$29', desc: 'For growing teams', popular: true,                                                                                                                                         
        features: ['Unlimited Projects', '100GB Storage', 'Advanced Analytics', 'Priority Support', 'Custom Domain', 'API Access'],                                                                                  
      },                                                                                                                                                                                                             
      {                                                                                                                                                                                                              
        name: 'Enterprise', price: '$99', desc: 'For large organizations', popular: false,
        features: ['Everything in Pro', '1TB Storage', 'SLA Guarantee', 'Dedicated Manager', 'SSO / SAML', 'Audit Logs'],                                                                                            
      },                                  
    ];                                                                                                                                                                                                               
  }