import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Permission {
  action: string;
  admin: boolean;
  manager: boolean;
  editor: boolean;
  viewer: boolean;
}

interface PermGroup {
  module: string;
  icon: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Roles & Permissions</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">Configure what each role can access</p>
        </div>
        <div class="flex gap-2">
          <button (click)="saved=false" *ngIf="saved" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">Reset</button>
          <button (click)="save()" style="display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:none;background:var(--accent-500);cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            <mat-icon style="font-size:16px;width:16px;height:16px">{{ saved ? 'check' : 'save' }}</mat-icon>
            {{ saved ? 'Saved!' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Role cards -->
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        @for (r of roles; track r.name) {
          <div class="card" style="padding:18px;border-top:3px solid" [style.border-top-color]="r.color">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center" [style.background]="r.color + '18'">
                <mat-icon style="font-size:20px;width:20px;height:20px" [style.color]="r.color">{{ r.icon }}</mat-icon>
              </div>
              <div>
                <p style="font-size:14px;font-weight:700;color:var(--text-primary)">{{ r.name }}</p>
                <p style="font-size:11px;color:var(--text-muted)">{{ r.users }} users</p>
              </div>
            </div>
            <p style="font-size:12px;color:var(--text-secondary);line-height:1.6">{{ r.desc }}</p>
          </div>
        }
      </div>

      <!-- Permissions matrix -->
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-default);display:flex;align-items:center;justify-content:space-between">
          <h3 style="font-size:14px;font-weight:700;color:var(--text-primary)">Permission Matrix</h3>
          <span style="font-size:12px;color:var(--text-muted)">Click to toggle permissions</span>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;min-width:600px">
            <thead>
              <tr style="background:var(--bg-elevated)">
                <th style="padding:12px 20px;text-align:left;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;width:40%">Module / Action</th>
                @for (r of roles; track r.name) {
                  <th style="padding:12px 16px;text-align:center;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;width:15%" [style.color]="r.color">{{ r.name }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (grp of permGroups; track grp.module) {
                <!-- Module header row -->
                <tr style="background:var(--bg-elevated)">
                  <td colspan="5" style="padding:8px 20px;font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;border-top:2px solid var(--border-default)">
                    <div style="display:flex;align-items:center;gap:8px">
                      <mat-icon style="font-size:14px;width:14px;height:14px">{{ grp.icon }}</mat-icon>
                      {{ grp.module }}
                    </div>
                  </td>
                </tr>
                <!-- Permission rows -->
                @for (perm of grp.permissions; track perm.action) {
                  <tr class="perm-row">
                    <td style="padding:11px 20px 11px 32px;font-size:13px;color:var(--text-secondary);border-bottom:1px solid var(--border-default)">{{ perm.action }}</td>
                    <td style="padding:11px 16px;text-align:center;border-bottom:1px solid var(--border-default)">
                      <button class="perm-toggle" [class.on]="perm.admin" (click)="perm.admin=!perm.admin">
                        <mat-icon style="font-size:16px;width:16px;height:16px">{{ perm.admin ? 'check' : 'remove' }}</mat-icon>
                      </button>
                    </td>
                    <td style="padding:11px 16px;text-align:center;border-bottom:1px solid var(--border-default)">
                      <button class="perm-toggle" [class.on]="perm.manager" (click)="perm.manager=!perm.manager">
                        <mat-icon style="font-size:16px;width:16px;height:16px">{{ perm.manager ? 'check' : 'remove' }}</mat-icon>
                      </button>
                    </td>
                    <td style="padding:11px 16px;text-align:center;border-bottom:1px solid var(--border-default)">
                      <button class="perm-toggle" [class.on]="perm.editor" (click)="perm.editor=!perm.editor">
                        <mat-icon style="font-size:16px;width:16px;height:16px">{{ perm.editor ? 'check' : 'remove' }}</mat-icon>
                      </button>
                    </td>
                    <td style="padding:11px 16px;text-align:center;border-bottom:1px solid var(--border-default)">
                      <button class="perm-toggle" [class.on]="perm.viewer" (click)="perm.viewer=!perm.viewer">
                        <mat-icon style="font-size:16px;width:16px;height:16px">{{ perm.viewer ? 'check' : 'remove' }}</mat-icon>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .perm-row { &:hover { background: var(--bg-elevated); } }

    .perm-toggle {
      width: 28px; height: 28px; border-radius: 6px; border: 1.5px solid var(--border-default);
      background: transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
      color: var(--text-muted); transition: all 150ms;
      &:hover { border-color: var(--accent-500); color: var(--accent-500); }
      &.on { background: rgba(34,197,94,.12); border-color: #22c55e; color: #22c55e; }
    }
  `],
})
export default class RolesComponent {
  saved = false;

  roles = [
    { name: 'Admin',   icon: 'admin_panel_settings', color: '#ef4444', users: 3,  desc: 'Full system access. Can manage users, settings, and all content.' },
    { name: 'Manager', icon: 'manage_accounts',       color: '#f59e0b', users: 12, desc: 'Can manage team members and content within their department.' },
    { name: 'Editor',  icon: 'edit_note',             color: '#6366f1', users: 45, desc: 'Can create and edit content but cannot delete or manage users.' },
    { name: 'Viewer',  icon: 'visibility',            color: '#94a3b8', users: 188,desc: 'Read-only access to content and reports.' },
  ];

  permGroups: PermGroup[] = [
    {
      module: 'Dashboard & Analytics', icon: 'dashboard',
      permissions: [
        { action: 'View Dashboard',       admin:true,  manager:true,  editor:true,  viewer:true  },
        { action: 'View Analytics',       admin:true,  manager:true,  editor:true,  viewer:true  },
        { action: 'Export Reports',       admin:true,  manager:true,  editor:false, viewer:false },
      ],
    },
    {
      module: 'User Management', icon: 'group',
      permissions: [
        { action: 'View Users',           admin:true,  manager:true,  editor:false, viewer:false },
        { action: 'Invite Users',         admin:true,  manager:true,  editor:false, viewer:false },
        { action: 'Edit User Roles',      admin:true,  manager:false, editor:false, viewer:false },
        { action: 'Ban / Delete Users',   admin:true,  manager:false, editor:false, viewer:false },
      ],
    },
    {
      module: 'E-Commerce', icon: 'shopping_bag',
      permissions: [
        { action: 'View Products',        admin:true,  manager:true,  editor:true,  viewer:true  },
        { action: 'Create / Edit Products',admin:true, manager:true,  editor:true,  viewer:false },
        { action: 'Delete Products',      admin:true,  manager:true,  editor:false, viewer:false },
        { action: 'View Orders',          admin:true,  manager:true,  editor:true,  viewer:true  },
        { action: 'Update Order Status',  admin:true,  manager:true,  editor:false, viewer:false },
        { action: 'Issue Refunds',        admin:true,  manager:false, editor:false, viewer:false },
      ],
    },
    {
      module: 'Content & Media', icon: 'folder_open',
      permissions: [
        { action: 'View Files',           admin:true,  manager:true,  editor:true,  viewer:true  },
        { action: 'Upload Files',         admin:true,  manager:true,  editor:true,  viewer:false },
        { action: 'Delete Files',         admin:true,  manager:true,  editor:false, viewer:false },
      ],
    },
    {
      module: 'Settings', icon: 'settings',
      permissions: [
        { action: 'View Settings',        admin:true,  manager:true,  editor:false, viewer:false },
        { action: 'Edit General Settings',admin:true,  manager:false, editor:false, viewer:false },
        { action: 'Manage Billing',       admin:true,  manager:false, editor:false, viewer:false },
        { action: 'API Keys',             admin:true,  manager:false, editor:false, viewer:false },
      ],
    },
  ];

  save() { this.saved = true; }
}