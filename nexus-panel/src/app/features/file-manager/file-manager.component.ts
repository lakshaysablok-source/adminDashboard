import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface FsItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'pdf' | 'doc' | 'video' | 'zip' | 'code';
  size?: string;
  modified: string;
  starred: boolean;
}

interface Folder { id: string; name: string; icon: string; count: number; }

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">File Manager</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">{{ items().length }} files · 4.2 GB used of 20 GB</p>
        </div>
        <div class="flex gap-2">
          <button style="
            display:flex;align-items:center;gap:6px;padding:8px 14px;
            border-radius:8px;border:1px solid var(--border-default);
            background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
            <mat-icon style="font-size:16px;width:16px;height:16px">create_new_folder</mat-icon>
            New Folder
          </button>
          <button style="
            display:flex;align-items:center;gap:6px;padding:8px 14px;
            border-radius:8px;border:none;background:var(--accent-500);
            cursor:pointer;color:#fff;font-size:13px;font-weight:600">
            <mat-icon style="font-size:16px;width:16px;height:16px">upload</mat-icon>
            Upload
          </button>
        </div>
      </div>

      <div class="fm-layout">

        <!-- Left sidebar -->
        <div style="width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:12px">

          <!-- Storage -->
          <div class="card" style="padding:16px">
            <p style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em">Storage</p>
            <div style="background:var(--bg-elevated);border-radius:4px;height:6px;overflow:hidden;margin-bottom:6px">
              <div style="width:21%;height:100%;background:linear-gradient(90deg,var(--accent-500),var(--accent-600));border-radius:4px"></div>
            </div>
            <p style="font-size:11px;color:var(--text-muted)">4.2 GB of 20 GB used</p>
            <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">
              @for (s of storageBreakdown; track s.label) {
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div style="width:8px;height:8px;border-radius:2px" [style.background]="s.color"></div>
                    <span style="font-size:11px;color:var(--text-secondary)">{{ s.label }}</span>
                  </div>
                  <span style="font-size:11px;color:var(--text-muted)">{{ s.size }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Quick access -->
          <div class="card" style="padding:12px">
            <p style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em">Quick Access</p>
            @for (f of folders; track f.id) {
              <div class="sidebar-folder" [class.active]="activeFolder() === f.id" (click)="setFolder(f.id)">
                <mat-icon style="font-size:16px;width:16px;height:16px" [style.color]="activeFolder()===f.id ? 'var(--accent-600)' : 'var(--text-muted)'">{{ f.icon }}</mat-icon>
                <span>{{ f.name }}</span>
                <span class="folder-count">{{ f.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Main content -->
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px">

          <!-- Toolbar -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="search-bar" style="flex:1;min-width:200px">
              <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">search</mat-icon>
              <input [(ngModel)]="search" placeholder="Search files…" style="
                border:none;background:transparent;outline:none;font-size:13px;
                color:var(--text-primary);flex:1;font-family:inherit">
            </div>
            <div class="flex gap-1">
              <button class="view-btn" [class.active]="view()==='grid'" (click)="view.set('grid')">
                <mat-icon style="font-size:18px;width:18px;height:18px">grid_view</mat-icon>
              </button>
              <button class="view-btn" [class.active]="view()==='list'" (click)="view.set('list')">
                <mat-icon style="font-size:18px;width:18px;height:18px">view_list</mat-icon>
              </button>
            </div>
          </div>

          <!-- Grid view -->
          @if (view() === 'grid') {
            <div class="file-grid">
              @for (item of filteredItems(); track item.id) {
                <div class="file-card" [class.selected]="selected().has(item.id)" (click)="toggleSelect(item.id)">
                  <div class="file-icon-wrap" [style.background]="typeColor(item.type) + '15'">
                    <mat-icon style="font-size:32px;width:32px;height:32px" [style.color]="typeColor(item.type)">
                      {{ typeIcon(item.type) }}
                    </mat-icon>
                  </div>
                  <div class="flex items-start justify-between gap-1" style="margin-top:8px">
                    <p class="file-name">{{ item.name }}</p>
                    <button class="star-btn" (click)="$event.stopPropagation(); toggleStar(item.id)"
                      [style.color]="item.starred ? '#f59e0b' : 'var(--text-muted)'">
                      <mat-icon style="font-size:14px;width:14px;height:14px">{{ item.starred ? 'star' : 'star_border' }}</mat-icon>
                    </button>
                  </div>
                  <p style="font-size:11px;color:var(--text-muted);margin-top:2px">{{ item.size || '—' }}</p>
                </div>
              }
            </div>
          }

          <!-- List view -->
          @if (view() === 'list') {
            <div class="card" style="padding:0;overflow:hidden">
              <table style="width:100%;border-collapse:collapse">
                <thead>
                  <tr style="background:var(--bg-elevated)">
                    <th class="list-th" style="width:40px"></th>
                    <th class="list-th">Name</th>
                    <th class="list-th" style="width:80px">Type</th>
                    <th class="list-th" style="width:80px">Size</th>
                    <th class="list-th" style="width:130px">Modified</th>
                    <th class="list-th" style="width:40px"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of filteredItems(); track item.id) {
                    <tr class="list-row" [class.selected]="selected().has(item.id)" (click)="toggleSelect(item.id)">
                      <td class="list-td">
                        <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center" [style.background]="typeColor(item.type)+'15'">
                          <mat-icon style="font-size:16px;width:16px;height:16px" [style.color]="typeColor(item.type)">{{ typeIcon(item.type) }}</mat-icon>
                        </div>
                      </td>
                      <td class="list-td"><span style="font-size:13px;font-weight:500;color:var(--text-primary)">{{ item.name }}</span></td>
                      <td class="list-td"><span style="font-size:11px;color:var(--text-muted);text-transform:uppercase">{{ item.type }}</span></td>
                      <td class="list-td"><span style="font-size:12px;color:var(--text-secondary)">{{ item.size || '—' }}</span></td>
                      <td class="list-td"><span style="font-size:12px;color:var(--text-muted)">{{ item.modified }}</span></td>
                      <td class="list-td">
                        <button [matMenuTriggerFor]="itemMenu" (click)="$event.stopPropagation()"
                          style="border:none;background:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:4px;line-height:1">
                          <mat-icon style="font-size:16px;width:16px;height:16px">more_vert</mat-icon>
                        </button>
                        <mat-menu #itemMenu="matMenu">
                          <button mat-menu-item><mat-icon>download</mat-icon> Download</button>
                          <button mat-menu-item><mat-icon>drive_file_rename_outline</mat-icon> Rename</button>
                          <button mat-menu-item><mat-icon>share</mat-icon> Share</button>
                          <button mat-menu-item style="color:#ef4444"><mat-icon style="color:#ef4444">delete</mat-icon> Delete</button>
                        </mat-menu>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <!-- Selection bar -->
          @if (selected().size > 0) {
            <div class="selection-bar">
              <span style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ selected().size }} selected</span>
              <div class="flex gap-2">
                <button style="display:flex;align-items:center;gap:4px;padding:6px 12px;border-radius:6px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:12px">
                  <mat-icon style="font-size:14px;width:14px;height:14px">download</mat-icon> Download
                </button>
                <button style="display:flex;align-items:center;gap:4px;padding:6px 12px;border-radius:6px;border:none;background:#ef4444;cursor:pointer;color:#fff;font-size:12px">
                  <mat-icon style="font-size:14px;width:14px;height:14px">delete</mat-icon> Delete
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fm-layout { display: flex; gap: 16px; align-items: flex-start; }

    .sidebar-folder {
      display: flex; align-items: center; gap: 8px; padding: 7px 8px;
      border-radius: 7px; cursor: pointer; font-size: 12px; font-weight: 500;
      color: var(--text-secondary); transition: background 150ms;
      &:hover { background: var(--bg-elevated); }
      &.active { background: var(--accent-50); color: var(--accent-700); font-weight: 600; }
    }
    .folder-count {
      margin-left: auto; font-size: 10px; font-weight: 600;
      background: var(--bg-elevated); color: var(--text-muted);
      border: 1px solid var(--border-default);
      padding: 1px 6px; border-radius: 9999px;
    }

    .search-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border-default); background: var(--bg-surface);
    }

    .view-btn {
      width: 34px; height: 34px; border-radius: 8px;
      border: 1px solid var(--border-default); background: transparent;
      cursor: pointer; color: var(--text-muted); display: flex; align-items: center; justify-content: center;
      &.active { background: var(--accent-50); color: var(--accent-600); border-color: var(--accent-500); }
    }

    .file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }

    .file-card {
      padding: 16px 12px; border-radius: 12px; cursor: pointer;
      border: 2px solid var(--border-default); background: var(--bg-surface);
      transition: border-color 150ms ease, box-shadow 150ms ease;
      text-align: center;
      &:hover { border-color: var(--accent-500); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
      &.selected { border-color: var(--accent-500); background: var(--accent-50); }
    }
    .file-icon-wrap { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
    .file-name { font-size: 12px; font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
    .star-btn { border: none; background: none; cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0; }

    .list-th { padding: 10px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); text-align: left; border-bottom: 1px solid var(--border-default); }
    .list-td { padding: 10px 12px; border-bottom: 1px solid var(--border-default); }
    .list-row {
      cursor: pointer; transition: background 150ms;
      &:hover { background: var(--bg-elevated); }
      &.selected { background: var(--accent-50); }
      &:last-child td { border-bottom: none; }
    }

    .selection-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; border-radius: 10px;
      background: var(--accent-50); border: 1px solid var(--accent-100);
    }
  `],
})
export default class FileManagerComponent {

  search = '';
  private _view = signal<'grid' | 'list'>('grid');
  view = this._view;
  private _activeFolder = signal('all');
  activeFolder = this._activeFolder.asReadonly();
  private _selected = signal<Set<string>>(new Set());
  selected = this._selected.asReadonly();

  storageBreakdown = [
    { label: 'Images', size: '1.8 GB', color: '#6366f1' },{ label: 'Videos', size: '1.2 GB', color: '#06b6d4' },
    { label: 'Documents', size: '0.8 GB', color: '#f59e0b' },
    { label: 'Other', size: '0.4 GB', color: '#94a3b8' },
  ];

  folders: Folder[] = [
    { id: 'all',       name: 'All Files',    icon: 'folder',       count: 24 },
    { id: 'images',    name: 'Images',       icon: 'image',        count: 10 },
    { id: 'documents', name: 'Documents',    icon: 'description',  count: 7  },
    { id: 'videos',    name: 'Videos',       icon: 'videocam',     count: 4  },
    { id: 'starred',   name: 'Starred',      icon: 'star',         count: 5  },
    { id: 'trash',     name: 'Trash',        icon: 'delete',       count: 3  },
  ];

  private _items = signal<FsItem[]>([
    { id:'f1', name:'Project Assets',    type:'folder', modified:'Jun 1, 2024',  starred:false },
    { id:'f2', name:'Design Files',      type:'folder', modified:'May 28, 2024', starred:true  },
    { id:'f3', name:'hero-banner.png',   type:'image',  size:'2.4 MB', modified:'Jun 5, 2024',  starred:true  },
    { id:'f4', name:'dashboard-ui.jpg',  type:'image',  size:'1.1 MB', modified:'Jun 4, 2024',  starred:false },
    { id:'f5', name:'logo-final.png',    type:'image',  size:'420 KB', modified:'Jun 3, 2024',  starred:true  },
    { id:'f6', name:'avatar-pack.zip',   type:'zip',    size:'5.8 MB', modified:'Jun 2, 2024',  starred:false },
    { id:'f7', name:'annual-report.pdf', type:'pdf',    size:'3.2 MB', modified:'Jun 1, 2024',  starred:true  },
    { id:'f8', name:'project-brief.pdf', type:'pdf',    size:'800 KB', modified:'May 30, 2024', starred:false },
    { id:'f9', name:'proposal.docx',     type:'doc',    size:'540 KB', modified:'May 29, 2024', starred:false },
    { id:'fa', name:'meeting-notes.doc', type:'doc',    size:'128 KB', modified:'May 28, 2024', starred:true  },
    { id:'fb', name:'onboarding.mp4',    type:'video',  size:'48 MB',  modified:'May 25, 2024', starred:false },
    { id:'fc', name:'demo-reel.mp4',     type:'video',  size:'120 MB', modified:'May 22, 2024', starred:false },
    { id:'fd', name:'app.component.ts',  type:'code',   size:'8 KB',   modified:'Jun 6, 2024',  starred:false },
    { id:'fe', name:'styles.scss',       type:'code',   size:'12 KB',  modified:'Jun 6, 2024',  starred:false },
  ]);

  items = this._items.asReadonly();

  filteredItems = computed(() => {
    let list = this._items();
    const folder = this._activeFolder();
    if (folder === 'images')    list = list.filter(i => i.type === 'image');
    if (folder === 'documents') list = list.filter(i => ['pdf','doc'].includes(i.type));
    if (folder === 'videos')    list = list.filter(i => i.type === 'video');
    if (folder === 'starred')   list = list.filter(i => i.starred);
    const q = this.search.toLowerCase();
    if (q) list = list.filter(i => i.name.toLowerCase().includes(q));
    return list;
  });

  setFolder(id: string) { this._activeFolder.set(id); this._selected.set(new Set()); }
  toggleSelect(id: string) { this._selected.update(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  toggleStar(id: string) { this._items.update(items => items.map(i => i.id === id ? { ...i, starred: !i.starred } : i)); }

  typeIcon(type: FsItem['type']) {
    const map: Record<string, string> = { folder:'folder', image:'image', pdf:'picture_as_pdf', doc:'description', video:'videocam', zip:'folder_zip', code:'code' };
    return map[type] ?? 'insert_drive_file';
  }

  typeColor(type: FsItem['type']) {
    const map: Record<string, string> = { folder:'#f59e0b', image:'#6366f1', pdf:'#ef4444', doc:'#3b82f6', video:'#8b5cf6', zip:'#10b981', code:'#06b6d4' };
    return map[type] ?? '#94a3b8';
  }
}