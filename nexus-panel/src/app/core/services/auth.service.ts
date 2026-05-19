import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

interface DemoUser extends User {
  password: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'admin@nexuspanel.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: '2',
    name: 'Sarah Parker',
    email: 'editor@nexuspanel.com',
    password: 'editor123',
    role: 'editor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'viewer@nexuspanel.com',
    password: 'viewer123',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.loadUser());

  /** Exposed so the login page can render quick-fill buttons */
  readonly demoCredentials = DEMO_USERS.map(({ email, password, role, name }) => ({
    email, password, role, name,
  }));

  constructor(private router: Router) {}

  login(email: string, password: string): { ok: boolean; error?: string } {
    const match = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (match) {
      const user: User = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        avatar: match.avatar,
      };
      localStorage.setItem('nexus_user', JSON.stringify(user));
      localStorage.setItem('nexus_token', `demo-token-${user.id}`);
      this.currentUser.set(user);
      return { ok: true };
    }

    return { ok: false, error: 'Invalid email or password.' };
  }

  register(firstName: string, lastName: string, email: string, _password: string, role: 'admin' | 'editor' | 'viewer' = 'viewer'): void {
    const user: User = {
      id: Date.now().toString(),
      name: `${firstName} ${lastName}`.trim(),
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
    };
    localStorage.setItem('nexus_user', JSON.stringify(user));
    localStorage.setItem('nexus_token', `demo-token-${user.id}`);
    this.currentUser.set(user);
  }

  updateProfile(partial: Partial<Pick<User, 'name' | 'email' | 'avatar'>>): void {
    const current = this.currentUser();
    if (!current) return;
    const updated: User = { ...current, ...partial };
    localStorage.setItem('nexus_user', JSON.stringify(updated));
    this.currentUser.set(updated);
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