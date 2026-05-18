export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'editor' | 'viewer';
  }