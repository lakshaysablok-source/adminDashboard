import { Component, signal, computed } from '@angular/core';                                                                                                                                                       
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';                                                                                                                                                                      
  import { MatTableModule } from '@angular/material/table';                                                                                                                                                          
  import { MatSortModule, Sort } from '@angular/material/sort';                                                                                                                                                      
  import { MatButtonModule } from '@angular/material/button';                                                                                                                                                        
  import { MatFormFieldModule } from '@angular/material/form-field';                                                                                                                                                 
  import { MatInputModule } from '@angular/material/input';                                                                                                                                                          
                                                                                                                                                                                                                     
  interface Employee {                                                                                                                                                                                               
    id: number; name: string; role: string;                                                                                                                                                                          
    department: string; status: string; salary: string;                                                                                                                                                              
  }                                                                                                                                                                                                                  
                                                                                                                                                                                                                     
  const EMPLOYEES: Employee[] = [                                                                                                                                                                                    
    { id: 1, name: 'Alice Johnson',  role: 'Frontend Dev',   department: 'Engineering', status: 'active',   salary: '$95,000' },                                                                                     
    { id: 2, name: 'Bob Smith',      role: 'Backend Dev',    department: 'Engineering', status: 'active',   salary: '$98,000' },                                                                                     
    { id: 3, name: 'Carol White',    role: 'UX Designer',    department: 'Design',      status: 'active',   salary: '$88,000' },                                                                                     
    { id: 4, name: 'Dan Brown',      role: 'Product Manager',department: 'Product',     status: 'inactive', salary: '$110,000'},
    { id: 5, name: 'Eva Martinez',   role: 'Data Analyst',   department: 'Analytics',   status: 'active',   salary: '$92,000' },                                                                                     
    { id: 6, name: 'Frank Lee',      role: 'DevOps Engineer',department: 'Engineering', status: 'active',   salary: '$105,000'},                                                                                     
    { id: 7, name: 'Grace Kim',      role: 'QA Engineer',    department: 'Engineering', status: 'inactive', salary: '$82,000' },                                                                                     
    { id: 8, name: 'Henry Wilson',   role: 'Sales Lead',     department: 'Sales',       status: 'active',   salary: '$78,000' },                                                                                     
  ];                                                                                                                                                                                                                 
                                                                                                                                                                                                                     
  @Component({                                                                                                                                                                                                       
    selector: 'app-basic-table',                                                                                                                                                                                     
    standalone: true,                                                                                                                                                                                                
    imports: [CommonModule, FormsModule, MatTableModule, MatSortModule, MatButtonModule, MatFormFieldModule, MatInputModule],                                                                                        
    template: `                               
      <div class="space-y-4 animate-fade-in">
        <div>                                 
          <h1 class="text-2xl font-bold text-primary">Basic Table</h1>                                                                                                                                               
          <p class="text-muted text-sm mt-1">Simple data table with search and sorting</p>
        </div>                                                                                                                                                                                                       
                                                                                                                                                                                                                     
        <div class="card">
          <!-- Toolbar -->                                                                                                                                                                                           
          <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">                                                                                                                                       
            <mat-form-field appearance="outline" class="!w-64">                                                                                                                                                      
              <mat-label>Search employees</mat-label>                                                                                                                                                                
              <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" placeholder="Name, role...">                                                                                               
            </mat-form-field>                                                                                                                                                                                        
            <div class="flex gap-2">                                                                                                                                                                                 
              <button mat-stroked-button (click)="exportCSV()">⬇ Export CSV</button>                                                                                                                                 
            </div>                                                                                                                                                                                                   
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <!-- Table -->                                                                                                                                                                                             
          <div class="overflow-x-auto">                                                                                                                                                                              
            <table mat-table [dataSource]="filtered()" matSort (matSortChange)="onSort($event)"                                                                                                                      
                   class="w-full">            
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="!text-muted !text-xs !font-medium">#</th>
                <td mat-cell *matCellDef="let row" class="!text-muted">{{ row.id }}</td>                                                                                                                             
              </ng-container>                                                                                                                                                                                        
                                                                                                                                                                                                                     
              <ng-container matColumnDef="name">                                                                                                                                                                     
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="!text-muted !text-xs !font-medium">Name</th>                                                                                            
                <td mat-cell *matCellDef="let row">                                                                                                                                                                  
                  <div class="flex items-center gap-2 py-1">                                                                                                                                                         
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"                                                                                                  
                      [style.background]="'var(--accent-500)'">                                                                                                                                                      
                      {{ row.name.charAt(0) }}                                                                                                                                                                       
                    </div>                                                                                                                                                                                           
                    <span class="font-medium">{{ row.name }}</span>                                                                                                                                                  
                  </div>                                                                                                                                                                                             
                </td>                                                                                                                                                                                                
              </ng-container>                                                                                                                                                                                        
                                                                                                                                                                                                                     
              <ng-container matColumnDef="role">                                                                                                                                                                     
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="!text-muted !text-xs !font-medium">Role</th>                                                                                            
                <td mat-cell *matCellDef="let row">{{ row.role }}</td>                                                                                                                                               
              </ng-container>                                                                                                                                                                                        
                                                                                                                                                                                                                     
              <ng-container matColumnDef="department">                                                                                                                                                               
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="!text-muted !text-xs !font-medium">Department</th>                                                                                      
                <td mat-cell *matCellDef="let row">                                                                                                                                                                  
                  <span class="badge badge-accent">{{ row.department }}</span>                                                                                                                                       
                </td>                                                                                                                                                                                                
              </ng-container>                                                                                                                                                                                        
                                                                                                                                                                                                                     
              <ng-container matColumnDef="salary">                                                                                                                                                                   
                <th mat-header-cell *matHeaderCellDef mat-sort-header class="!text-muted !text-xs !font-medium">Salary</th>                                                                                          
                <td mat-cell *matCellDef="let row" class="font-semibold">{{ row.salary }}</td>                                                                                                                       
              </ng-container>                                                                                                                                                                                        
                                                                                                                                                                                                                     
              <ng-container matColumnDef="status">                                                                                                                                                                   
                <th mat-header-cell *matHeaderCellDef class="!text-muted !text-xs !font-medium">Status</th>                                                                                                          
                <td mat-cell *matCellDef="let row">                                                                                                                                                                  
                  <span class="badge" [class.badge-success]="row.status==='active'"                                                                                                                                  
                                      [class.badge-danger]="row.status==='inactive'">                                                                                                                                
                    {{ row.status }}                                                                                                                                                                                 
                  </span>                                                                                                                                                                                            
                </td>                                                                                                                                                                                                
              </ng-container>                                                                                                                                                                                        
                                                                                                                                                                                                                     
              <tr mat-header-row *matHeaderRowDef="columns"                                                                                                                                                          
                  class="border-b border-border"></tr>                                                                                                                                                               
              <tr mat-row *matRowDef="let row; columns: columns"                                                                                                                                                     
                  class="border-b border-border/50 hover:bg-elevated transition-colors cursor-pointer"></tr>                                                                                                         
            </table>                                                                                                                                                                                                 
          </div>                                                                                                                                                                                                     
                                                                                                                                                                                                                     
          <div class="mt-4 text-sm text-muted">Showing {{ filtered().length }} of {{ employees.length }} employees                                                                                                                                      
          </div>                                                                                                                                                                                                     
        </div>                                                                                                                                                                                                       
      </div>                                                                                                                                                                                                         
    `,                                                                                                                                                                                                               
  })                                                                                                                                                                                                                 
  export default class BasicTableComponent {                                                                                                                                                                         
    columns   = ['id', 'name', 'role', 'department', 'salary', 'status'];                                                                                                                                            
    employees = EMPLOYEES;                                                                                                                                                                                           
    searchTerm = '';                          
    sortState  = signal<Sort>({ active: '', direction: '' });                                                                                                                                                        
                                                                                                                                                                                                                     
    filtered = computed(() => {                                                                                                                                                                                      
      const term = this.searchTerm.toLowerCase();                                                                                                                                                                    
      let data = term                                                                                                                                                                                                
        ? this.employees.filter(e =>                                                                                                                                                                                 
            e.name.toLowerCase().includes(term) ||                                                                                                                                                                   
            e.role.toLowerCase().includes(term) ||                                                                                                                                                                   
            e.department.toLowerCase().includes(term))                                                                                                                                                               
        : [...this.employees];                                                                                                                                                                                       
                                                                                                                                                                                                                     
      const { active, direction } = this.sortState();                                                                                                                                                                
      if (active && direction) {                                                                                                                                                                                     
        data = [...data].sort((a, b) => {                                                                                                                                                                            
          const v1 = (a as any)[active];      
          const v2 = (b as any)[active];      
          return (v1 < v2 ? -1 : v1 > v2 ? 1 : 0) * (direction === 'asc' ? 1 : -1);
        });                                                                                                                                                                                                          
      }                                                                                                                                                                                                              
      return data;                                                                                                                                                                                                   
    });                                                                                                                                                                                                              
                                                                                                                                                                                                                     
    onSearch(_: string) {}                                                                                                                                                                                           
    onSort(sort: Sort) { this.sortState.set(sort); }

    exportCSV() {                                                                                                                                                                                                    
      const headers = 'ID,Name,Role,Department,Salary,Status';
      const rows = this.filtered().map(e =>`${e.id},"${e.name}","${e.role}","${e.department}","${e.salary}","${e.status}"`
      ).join('\n');                           
      const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });                                                                                                                                          
      const a = document.createElement('a');                                                                                                                                                                         
      a.href = URL.createObjectURL(blob);                                                                                                                                                                            
      a.download = 'employees.csv';                                                                                                                                                                                  
      a.click();                                                                                                                                                                                                     
    }                                                                                                                                                                                                                
  }