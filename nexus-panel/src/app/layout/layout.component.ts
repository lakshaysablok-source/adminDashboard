import { Component, inject } from '@angular/core';                                                                                                                                                                 
  import { RouterOutlet } from '@angular/router';
  import { UiStore } from '../store/ui.store';                                                                                                                                                                       
  import { SidebarComponent } from './sidebar/sidebar.component';
  import { HeaderComponent } from './header/header.component';                                                                                                                                                       
                                              
  @Component({                                                                                                                                                                                                       
    selector: 'app-layout',                                                                                                                                                                                          
    standalone: true,                                                                                                                                                                                                
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],                                                                                                                                                      
    template: `                                                                                                                                                                                                      
      <div class="layout-wrapper" [class.collapsed]="uiStore.sidebarCollapsed()">                                                                                                                                    
        <app-sidebar />                                                                                                                                                                                              
        <div class="main-content">                                                                                                                                                                                   
          <app-header />                                                                                                                                                                                             
          <main class="page-content">                                                                                                                                                                                
            <router-outlet />                                                                                                                                                                                        
          </main>                                                                                                                                                                                                    
          <footer class="px-6 py-4 text-center text-sm text-muted border-t border-border">                                                                                                                           
            © 2024 NexusPanel. Built with Angular 17+.                                                                                                                                                               
          </footer>                                                                                                                                                                                                  
        </div>                                                                                                                                                                                                       
      </div>                                                                                                                                                                                                         
    `,                                                                                                                                                                                                               
  })                                                                                                                                                                                                                 
  export default class LayoutComponent {                                                                                                                                                                             
    uiStore = inject(UiStore);                                                                                                                                                                                       
  }