import { Injectable, signal } from '@angular/core';
  import { Router } from '@angular/router';
  import { User } from '../models/user.model';

  @Injectable({ providedIn: 'root' })
  export class AuthService {
    currentUser = signal<User | null>(this.loadUser());

    constructor(private router: Router) {}

    login(email: string, password: string): boolean {
      // Mock auth — replace with real API call
      if (email && password) {
        const user: User = {
          id: '1',
          name: 'Alex Johnson',
          email,
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        };
        localStorage.setItem('nexus_user', JSON.stringify(user));
        localStorage.setItem('nexus_token', 'mock-jwt-token');
        this.currentUser.set(user);
        return true;
      }
      return false;
    }

    logout() {
      localStorage.removeItem('nexus_user');
      localStorage.removeItem('nexus_token');
      this.currentUser.set(null);
      this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
      return !!localStorage.getItem('nexus_token');
    }

    private loadUser(): User | null {
      const raw = localStorage.getItem('nexus_user');
      return raw ? JSON.parse(raw) : null;
    }
  }