import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'Manager';
  department: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  joined: string;
  lastActive: string;
  twoFA: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">User Management</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">{{ filtered().length }} users total</p>
        </div>
        <div class="flex gap-2">
          <button style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">file_download</mat-icon> Export
          </button>
          <button (click)="showInvite=true" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            <mat-icon style="font-size:16px;width:16px;height:16px">person_add</mat-icon> Invite User
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        @for (s of stats; track s.label) {
          <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
            <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0" [style.background]="s.color + '18'">
              <mat-icon style="font-size:22px;width:22px;height:22px" [style.color]="s.color">{{ s.icon }}</mat-icon>
            </div>
            <div>
              <p style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">{{ s.label }}</p>
              <p style="font-size:22px;font-weight:800;color:var(--text-primary)">{{ s.value }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Filters -->
      <div class="card" style="padding:14px">
        <div class="flex items-center gap-3 flex-wrap">
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:200px;padding:8px 12px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated)">
            <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">search</mat-icon>
            <input [(ngModel)]="search" placeholder="Search users…" style="border:none;background:transparent;outline:none;font-size:13px;color:var(--text-primary);flex:1;font-family:inherit">
          </div>
          <select [(ngModel)]="roleFilter" class="filter-select">
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select [(ngModel)]="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--bg-elevated)">
              <th class="th">
                <input type="checkbox" style="cursor:pointer;accent-color:var(--accent-500)">
              </th>
              <th class="th">User</th>
              <th class="th">Role</th>
              <th class="th">Department</th>
              <th class="th">Status</th>
              <th class="th">2FA</th>
              <th class="th">Last Active</th>
              <th class="th">Joined</th>
              <th class="th"></th>
            </tr>
          </thead>
          <tbody>
            @for (u of filtered(); track u.id) {
              <tr class="tr">
                <td class="td" style="width:40px">
                  <input type="checkbox" style="cursor:pointer;accent-color:var(--accent-500)">
                </td>
                <td class="td">
                  <div class="flex items-center gap-3">
                    <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0" [style.background]="u.avatarBg">{{ u.initials }}</div>
                    <div>
                      <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ u.name }}</p>
                      <p style="font-size:11px;color:var(--text-muted)">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="td">
                  <span class="role-badge role-{{ u.role.toLowerCase() }}">{{ u.role }}</span>
                </td>
                <td class="td">
                  <span style="font-size:12px;color:var(--text-secondary)">{{ u.department }}</span>
                </td>
                <td class="td">
                  <span class="status-badge status-{{ u.status }}">
                    <span class="status-dot"></span>{{ u.status }}
                  </span>
                </td>
                <td class="td">
                  @if (u.twoFA) {
                    <span style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:#22c55e">
                      <mat-icon style="font-size:14px;width:14px;height:14px">verified_user</mat-icon>On
                    </span>
                  } @else {
                    <span style="font-size:11px;color:var(--text-muted)">Off</span>
                  }
                </td>
                <td class="td"><span style="font-size:12px;color:var(--text-secondary)">{{ u.lastActive }}</span></td>
                <td class="td"><span style="font-size:12px;color:var(--text-muted)">{{ u.joined }}</span></td>
                <td class="td" (click)="$event.stopPropagation()">
                  <button [matMenuTriggerFor]="uMenu" style="border:none;background:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px">
                    <mat-icon style="font-size:16px;width:16px;height:16px">more_vert</mat-icon>
                  </button>
                  <mat-menu #uMenu="matMenu">
                    <button mat-menu-item (click)="editUser(u)"><mat-icon>edit</mat-icon> Edit User</button>
                    <button mat-menu-item><mat-icon>key</mat-icon> Reset Password</button>
                    <button mat-menu-item><mat-icon>shield</mat-icon> Change Role</button>
                    <button mat-menu-item [style.color]="u.status==='banned' ? '#22c55e' : '#f59e0b'" (click)="toggleBan(u)">
                      <mat-icon [style.color]="u.status==='banned' ? '#22c55e' : '#f59e0b'">{{ u.status==='banned' ? 'lock_open' : 'block' }}</mat-icon>
                      {{ u.status==='banned' ? 'Unban' : 'Ban' }} User
                    </button>
                    <button mat-menu-item style="color:#ef4444"><mat-icon style="color:#ef4444">delete</mat-icon> Delete</button>
                  </mat-menu>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Pagination -->
        <div style="display:flex;align-items:center;justify-content:between;padding:14px 16px;border-top:1px solid var(--border-default)">
          <span style="font-size:12px;color:var(--text-muted)">Showing {{ filtered().length }} of {{ users.length }} users</span>
          <div style="display:flex;gap:4px;margin-left:auto">
            <button style="width:30px;height:30px;border-radius:6px;border:1px solid var(--border-default);cursor:pointer;font-size:12px;background:transparent;color:var(--text-secondary)">‹</button>
            @for (p of [1,2,3]; track p) {
              <button style="width:30px;height:30px;border-radius:6px;border:1px solid var(--border-default);cursor:pointer;font-size:12px" [style.background]="p===1 ? 'var(--accent-500)' : 'transparent'" [style.color]="p===1 ? '#fff' : 'var(--text-secondary)'">{{ p }}</button>
            }
            <button style="width:30px;height:30px;border-radius:6px;border:1px solid var(--border-default);cursor:pointer;font-size:12px;background:transparent;color:var(--text-secondary)">›</button>
          </div>
        </div>
      </div>

    </div>

    <!-- Invite Modal -->
    @if (showInvite) {
      <div class="modal-backdrop" (click)="showInvite=false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-5">
            <h2 style="font-size:16px;font-weight:800;color:var(--text-primary)">Invite User</h2>
            <button (click)="showInvite=false" style="border:none;background:none;cursor:pointer;color:var(--text-muted);padding:4px">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="field-label">Full Name</label>
              <input [(ngModel)]="invite.name" class="field-input" placeholder="Jane Smith">
            </div>
            <div>
              <label class="field-label">Email Address</label>
              <input [(ngModel)]="invite.email" type="email" class="field-input" placeholder="jane@company.com">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="field-label">Role</label>
                <select [(ngModel)]="invite.role" class="field-input">
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label class="field-label">Department</label>
                <select [(ngModel)]="invite.department" class="field-input">
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Operations</option>
                  <option>HR</option>
                </select>
              </div>
            </div>
            <div style="padding:12px;border-radius:8px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.2);font-size:12px;color:var(--text-secondary);display:flex;gap:10px;align-items:flex-start">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--accent-500);flex-shrink:0;margin-top:1px">info</mat-icon>
              An email invitation will be sent. The link expires in 48 hours.
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="showInvite=false" style="flex:1;padding:10px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;font-size:13px;color:var(--text-secondary)">Cancel</button>
            <button (click)="sendInvite()" style="flex:1;padding:10px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;font-size:13px;font-weight:600;color:#fff">Send Invite</button>
          </div>
        </div>
      </div>
    }

    <!-- Edit Modal -->
    @if (editTarget) {
      <div class="modal-backdrop" (click)="editTarget=null">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-5">
            <h2 style="font-size:16px;font-weight:800;color:var(--text-primary)">Edit User</h2>
            <button (click)="editTarget=null" style="border:none;background:none;cursor:pointer;color:var(--text-muted);padding:4px">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="flex items-center gap-3 mb-5 p-4 rounded-xl" style="background:var(--bg-elevated)">
            <div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff" [style.background]="editTarget.avatarBg">{{ editTarget.initials }}</div>
            <div>
              <p style="font-size:14px;font-weight:700;color:var(--text-primary)">{{ editTarget.name }}</p>
              <p style="font-size:12px;color:var(--text-muted)">{{ editTarget.email }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="field-label">Role</label>
                <select [(ngModel)]="editTarget.role" class="field-input">
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label class="field-label">Status</label>
                <select [(ngModel)]="editTarget.status" class="field-input">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>
            <div>
              <label class="field-label">Department</label>
              <select [(ngModel)]="editTarget.department" class="field-input">
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>HR</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button (click)="editTarget=null" style="flex:1;padding:10px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;font-size:13px;color:var(--text-secondary)">Cancel</button>
            <button (click)="editTarget=null" style="flex:1;padding:10px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;font-size:13px;font-weight:600;color:#fff">Save Changes</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .filter-select { padding:8px 12px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;cursor:pointer; }
    .th { padding:10px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);text-align:left;border-bottom:1px solid var(--border-default);white-space:nowrap; }
    .td { padding:12px 14px;border-bottom:1px solid var(--border-default); }
    .tr { transition:background 120ms;cursor:default; &:hover { background:var(--bg-elevated); } &:last-child td { border-bottom:none; } }

    .role-badge { font-size:11px;font-weight:700;padding:3px 10px;border-radius:9999px;
      &.role-admin   { background:rgba(239,68,68,.12);  color:#ef4444; }
      &.role-manager { background:rgba(245,158,11,.12); color:#f59e0b; }
      &.role-editor  { background:rgba(99,102,241,.12); color:#6366f1; }
      &.role-viewer  { background:rgba(148,163,184,.12);color:#94a3b8; }
    }

    .status-badge { display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:3px 9px;border-radius:9999px;text-transform:capitalize;
      &.status-active   { background:rgba(34,197,94,.12); color:#22c55e; }
      &.status-inactive { background:rgba(148,163,184,.12);color:#94a3b8; }
      &.status-pending  { background:rgba(245,158,11,.12);color:#f59e0b; }
      &.status-banned   { background:rgba(239,68,68,.12); color:#ef4444; }
    }
    .status-dot { width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0; }

    .modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px; }
    .modal-box { background:var(--bg-surface);border-radius:16px;padding:24px;width:100%;max-width:460px;border:1px solid var(--border-default); }
    .field-label { font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:5px; }
    .field-input { width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;box-sizing:border-box; &:focus { border-color:var(--accent-500); } }
  `],
})
export default class UsersComponent {
  search = '';
  roleFilter = '';
  statusFilter = '';
  showInvite = false;
  editTarget: User | null = null;

  invite = { name: '', email: '', role: 'Viewer', department: 'Engineering' };

  stats = [
    { label: 'Total Users',   value: '248', icon: 'group',          color: '#6366f1' },
    { label: 'Active',        value: '186', icon: 'check_circle',   color: '#22c55e' },
    { label: 'Pending Invite',value: '24',  icon: 'schedule',       color: '#f59e0b' },
    { label: 'Banned',        value: '8',   icon: 'block',          color: '#ef4444' },
  ];

  users: User[] = [
    { id:'u1',  name:'Alice Summers',  initials:'AS', avatarBg:'#6366f1', email:'alice@nexus.io',   role:'Admin',   department:'Engineering', status:'active',   joined:'Jan 12, 2023', lastActive:'2 min ago',   twoFA:true  },
    { id:'u2',  name:'Ryan Kim',       initials:'RK', avatarBg:'#10b981', email:'ryan@nexus.io',    role:'Manager', department:'Design',       status:'active',   joined:'Mar 5, 2023',  lastActive:'1 hr ago',    twoFA:true  },
    { id:'u3',  name:'Julia Morgan',   initials:'JM', avatarBg:'#ef4444', email:'julia@nexus.io',   role:'Editor',  department:'Marketing',    status:'active',   joined:'Apr 18, 2023', lastActive:'3 hrs ago',   twoFA:false },
    { id:'u4',  name:'Sam Rivera',     initials:'SR', avatarBg:'#8b5cf6', email:'sam@nexus.io',     role:'Viewer',  department:'Finance',      status:'pending',  joined:'Jun 1, 2024',  lastActive:'Never',       twoFA:false },
    { id:'u5',  name:'Mark Chen',      initials:'MC', avatarBg:'#f59e0b', email:'mark@nexus.io',    role:'Editor',  department:'Engineering',  status:'active',   joined:'Feb 20, 2023', lastActive:'Yesterday',   twoFA:true  },
    { id:'u6',  name:'Priya Patel',    initials:'PP', avatarBg:'#06b6d4', email:'priya@nexus.io',   role:'Manager', department:'Operations',   status:'inactive', joined:'Jul 8, 2022',  lastActive:'2 weeks ago', twoFA:false },
    { id:'u7',  name:'David Wilson',   initials:'DW', avatarBg:'#3b82f6', email:'david@nexus.io',   role:'Admin',   department:'Engineering',  status:'active',   joined:'Nov 3, 2022',  lastActive:'Just now',    twoFA:true  },
    { id:'u8',  name:'Emma Johnson',   initials:'EJ', avatarBg:'#22c55e', email:'emma@nexus.io',    role:'Viewer',  department:'HR',           status:'active',   joined:'May 14, 2024', lastActive:'5 min ago',   twoFA:false },
    { id:'u9',  name:'Tom Bradley',    initials:'TB', avatarBg:'#f43f5e', email:'tom@nexus.io',     role:'Editor',  department:'Marketing',    status:'banned',   joined:'Jan 30, 2023', lastActive:'1 month ago', twoFA:false },
    { id:'u10', name:'Lisa Park',      initials:'LP', avatarBg:'#a855f7', email:'lisa@nexus.io',    role:'Viewer',  department:'Finance',      status:'active',   joined:'Sep 22, 2023', lastActive:'4 hrs ago',   twoFA:true  },
    { id:'u11', name:'Carlos Ruiz',    initials:'CR', avatarBg:'#0ea5e9', email:'carlos@nexus.io',  role:'Manager', department:'Engineering',  status:'active',   joined:'Oct 10, 2022', lastActive:'30 min ago',  twoFA:true  },
    { id:'u12', name:'Sophie Laurent', initials:'SL', avatarBg:'#d946ef', email:'sophie@nexus.io',  role:'Editor',  department:'Design',       status:'pending',  joined:'Jun 18, 2024', lastActive:'Never',       twoFA:false },
  ];

  filtered = computed(() => {
    let list = this.users;
    if (this.roleFilter)   list = list.filter(u => u.role === this.roleFilter);
    if (this.statusFilter) list = list.filter(u => u.status === this.statusFilter);
    if (this.search)       list = list.filter(u =>
      u.name.toLowerCase().includes(this.search.toLowerCase()) ||
      u.email.toLowerCase().includes(this.search.toLowerCase())
    );
    return list;
  });

  toggleBan(u: User) {
    u.status = u.status === 'banned' ? 'active' : 'banned';
  }

  editUser(u: User) { this.editTarget = { ...u }; }

  sendInvite() {
    this.showInvite = false;
    this.invite = { name: '', email: '', role: 'Viewer', department: 'Engineering' };
  }
}