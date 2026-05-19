import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  priority: 'low' | 'medium' | 'high';
  initials: string;
  avatarBg: string;
  date?: string;
  subtasks?: number;
  subtasksDone?: number;
  comments?: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  accent: string;
  cards: KanbanCard[];
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Kanban Board</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">
            {{ totalCards() }} tasks across {{ columns().length }} columns
          </p>
        </div>
        <div class="flex gap-2">
          <button (click)="showAdd=true" style="
            display:flex;align-items:center;gap:6px;
            padding:8px 16px;border-radius:8px;border:none;cursor:pointer;
            background:var(--accent-500);color:#fff;font-size:13px;font-weight:600;">
            <mat-icon style="font-size:18px;width:18px;height:18px">add</mat-icon>
            Add Task
          </button>
        </div>
      </div>

      <!-- Board -->
      <div class="kanban-board">
        @for (col of columns(); track col.id) {
          <div class="kanban-col">

            <!-- Column header -->
            <div class="col-header">
              <div class="flex items-center gap-2">
                <div class="col-dot" [style.background]="col.accent"></div>
                <span class="col-title">{{ col.title }}</span>
                <span class="col-count">{{ col.cards.length }}</span>
              </div>
              <button mat-icon-button style="width:28px;height:28px;line-height:28px"
                (click)="openAddInColumn(col.id)">
                <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted)">add</mat-icon>
              </button>
            </div>

            <!-- Cards drop zone -->
            <div cdkDropList
              [id]="col.id"
              [cdkDropListData]="col.cards"
              [cdkDropListConnectedTo]="columnIds()"
              (cdkDropListDropped)="onDrop($event)"
              class="cards-list">

              @for (card of col.cards; track card.id) {
                <div cdkDrag class="kanban-card" [cdkDragData]="card">

                  <!-- Drag placeholder -->
                  <div *cdkDragPlaceholder class="card-placeholder"></div>

                  <!-- Tag -->
                  <div class="card-tag" [style.background]="card.tagColor + '20'" [style.color]="card.tagColor">
                    {{ card.tag }}
                  </div>

                  <!-- Title -->
                  <p class="card-title">{{ card.title }}</p>

                  <!-- Subtasks progress -->
                  @if (card.subtasks) {
                    <div class="subtask-row">
                      <div class="subtask-bar">
                        <div class="subtask-fill"
                          [style.width.%]="(card.subtasksDone! / card.subtasks) * 100"
                          [style.background]="col.accent"></div>
                      </div>
                      <span class="subtask-label">{{ card.subtasksDone }}/{{ card.subtasks }}</span>
                    </div>
                  }

                  <!-- Footer -->
                  <div class="card-footer">
                    <div class="flex items-center gap-2">
                      <!-- Priority -->
                      <span class="priority-badge priority-{{ card.priority }}">
                        {{ card.priority }}
                      </span>
                      <!-- Date -->
                      @if (card.date) {
                        <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:2px">
                          <mat-icon style="font-size:12px;width:12px;height:12px">calendar_today</mat-icon>
                          {{ card.date }}
                        </span>
                      }
                    </div>
                    <div class="flex items-center gap-2">
                      @if (card.comments) {
                        <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:2px">
                          <mat-icon style="font-size:12px;width:12px;height:12px">chat_bubble_outline</mat-icon>
                          {{ card.comments }}
                        </span>
                      }
                      <!-- Avatar -->
                      <div class="avatar-sm" [style.background]="card.avatarBg">{{ card.initials }}</div>
                    </div>
                  </div>
                </div>
              }

              <!-- Empty state -->
              @if (col.cards.length === 0) {
                <div class="empty-col">
                  <mat-icon style="font-size:28px;width:28px;height:28px;color:var(--text-muted);opacity:.4">inbox</mat-icon>
                  <p style="font-size:12px;color:var(--text-muted);margin-top:6px">Drop tasks here</p>
                </div>
              }
            </div>

          </div>
        }
      </div>

      <!-- Add Task Modal -->
      @if (showAdd) {
        <div class="modal-backdrop" (click)="showAdd=false">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-primary" style="font-size:15px">Add New Task</h3>
              <button (click)="showAdd=false" style="border:none;background:none;cursor:pointer;color:var(--text-muted)">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="field-label">Title</label>
                <input [(ngModel)]="newCard.title" placeholder="Task title…" class="field-input">
              </div>
              <div class="flex gap-3">
                <div style="flex:1">
                  <label class="field-label">Column</label>
                  <select [(ngModel)]="newCard.colId" class="field-input">
                    @for (c of columns(); track c.id) {
                      <option [value]="c.id">{{ c.title }}</option>}
                  </select>
                </div>
                <div style="flex:1">
                  <label class="field-label">Priority</label>
                  <select [(ngModel)]="newCard.priority" class="field-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div class="flex gap-3">
                <div style="flex:1">
                  <label class="field-label">Tag</label>
                  <input [(ngModel)]="newCard.tag" placeholder="e.g. Design" class="field-input">
                </div>
                <div style="flex:1">
                  <label class="field-label">Due Date</label>
                  <input [(ngModel)]="newCard.date" type="date" class="field-input">
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-5">
              <button (click)="showAdd=false" style="
                padding:8px 16px;border-radius:8px;border:1px solid var(--border-default);
                background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">
                Cancel
              </button>
              <button (click)="addCard()" style="
                padding:8px 16px;border-radius:8px;border:none;cursor:pointer;
                background:var(--accent-500);color:#fff;font-size:13px;font-weight:600">
                Add Task
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .kanban-board {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 8px;
      align-items: flex-start;
      &::-webkit-scrollbar { height: 6px; }
      &::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 3px; }
    }

    .kanban-col {
      flex: 0 0 280px;
      background: var(--bg-elevated);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid var(--border-default);
    }

    .col-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px; padding: 0 2px;
    }
    .col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .col-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .col-count {
      font-size: 11px; font-weight: 600; padding: 1px 7px;
      border-radius: 9999px; background: var(--bg-surface);
      color: var(--text-muted); border: 1px solid var(--border-default);
    }

    .cards-list {
      display: flex; flex-direction: column; gap: 8px;
      min-height: 60px;
    }

    .kanban-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 10px;
      padding: 12px;
      cursor: grab;
      transition: box-shadow 150ms ease, transform 150ms ease;
      &:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); transform: translateY(-1px); }
      &:active { cursor: grabbing; }
    }

    .card-placeholder {
      background: var(--accent-50);
      border: 2px dashed var(--accent-500);
      border-radius: 10px;
      height: 80px;
    }

    .card-tag {
      display: inline-flex; align-items: center;
      font-size: 10px; font-weight: 700; letter-spacing: .04em;
      padding: 2px 8px; border-radius: 9999px;
      margin-bottom: 8px; text-transform: uppercase;
    }

    .card-title {
      font-size: 13px; font-weight: 500; color: var(--text-primary);
      line-height: 1.4; margin-bottom: 10px;
    }

    .subtask-row {
      display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
    }
    .subtask-bar {
      flex: 1; height: 4px; background: var(--border-default); border-radius: 2px; overflow: hidden;
    }
    .subtask-fill { height: 100%; border-radius: 2px; transition: width 300ms ease; }
    .subtask-label { font-size: 10px; color: var(--text-muted); white-space: nowrap; }

    .card-footer { display: flex; align-items: center; justify-content: space-between; }

    .priority-badge {
      font-size: 10px; font-weight: 700; padding: 2px 7px;
      border-radius: 9999px; text-transform: uppercase; letter-spacing: .04em;
      &.priority-high    { background: rgba(239,68,68,.12);  color: #ef4444; }
      &.priority-medium  { background: rgba(245,158,11,.12); color: #f59e0b; }
      &.priority-low     { background: rgba(34,197,94,.12);  color: #22c55e; }
    }

    .avatar-sm {
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0;
    }

    .empty-col {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 24px 0;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 16px;
    }
    .modal-box {
      background: var(--bg-surface); border-radius: 16px;
      padding: 24px; width: 100%; max-width: 440px;
      box-shadow: 0 20px 60px rgba(0,0,0,.2);
      border: 1px solid var(--border-default);
    }

    .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 5px; }
    .field-input {
      width: 100%; padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--border-default); background: var(--bg-elevated);
      color: var(--text-primary); font-size: 13px; font-family: inherit;
      outline: none; box-sizing: border-box;
      &:focus { border-color: var(--accent-500); }
    }

    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0,0,.2,1); }
    .cards-list.cdk-drop-list-dragging .kanban-card:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0,0,.2,1); }
  `],
})
export default class KanbanComponent {

  showAdd = false;
  newCard = { title: '', colId: 'todo', priority: 'medium' as 'low'|'medium'|'high', tag: 'Task', date: '' };

  private _columns = signal<KanbanColumn[]>([
    {
      id: 'todo', title: 'To Do', accent: '#94a3b8',
      cards: [
        { id: 'c1', title: 'Design new landing page hero section', tag: 'Design', tagColor: '#8b5cf6', priority: 'high',   initials: 'AS', avatarBg: '#6366f1', date: 'Jun 12', subtasks: 4, subtasksDone: 0, comments: 3 },
        { id: 'c2', title: 'Write unit tests for auth module',     tag: 'Dev',    tagColor: '#06b6d4', priority: 'medium', initials: 'RK', avatarBg: '#10b981', date: 'Jun 15', subtasks: 6, subtasksDone: 2, comments: 1 },
        { id: 'c3', title: 'Audit accessibility on all pages',     tag: 'QA',     tagColor: '#f59e0b', priority: 'low',    initials: 'PL', avatarBg: '#f59e0b', comments: 0 },
      ],
    },
    {
      id: 'inprogress', title: 'In Progress', accent: '#6366f1',
      cards: [
        { id: 'c4', title: 'Build Kanban drag-and-drop feature',   tag: 'Dev',    tagColor: '#06b6d4', priority: 'high',   initials: 'AS', avatarBg: '#6366f1', date: 'Jun 10', subtasks: 5, subtasksDone: 3, comments: 5 },
        { id: 'c5', title: 'Integrate Stripe payment gateway',      tag: 'Dev',    tagColor: '#06b6d4', priority: 'high',   initials: 'JM', avatarBg: '#ef4444', date: 'Jun 11', subtasks: 3, subtasksDone: 1, comments: 2 },
        { id: 'c6', title: 'Create onboarding email sequence',      tag: 'Content',tagColor: '#10b981', priority: 'medium', initials: 'SR', avatarBg: '#8b5cf6', date: 'Jun 14' },
      ],
    },
    {
      id: 'review', title: 'In Review', accent: '#f59e0b',
      cards: [
        { id: 'c7', title: 'Dashboard analytics redesign',          tag: 'Design', tagColor: '#8b5cf6', priority: 'medium', initials: 'RK', avatarBg: '#10b981', date: 'Jun 8',  subtasks: 3, subtasksDone: 3, comments: 7 },
        { id: 'c8', title: 'API rate limiting implementation',      tag: 'Dev',    tagColor: '#06b6d4', priority: 'high',   initials: 'AS', avatarBg: '#6366f1', date: 'Jun 9',  comments: 4 },
      ],
    },
    {
      id: 'done', title: 'Done', accent: '#22c55e',
      cards: [
        { id: 'c9',  title: 'Set up CI/CD pipeline',               tag: 'DevOps', tagColor: '#ef4444', priority: 'high',   initials: 'JM', avatarBg: '#ef4444', date: 'Jun 5',  subtasks: 4, subtasksDone: 4, comments: 2 },
        { id: 'c10', title: 'Dark mode implementation',             tag: 'Design', tagColor: '#8b5cf6', priority: 'medium', initials: 'SR', avatarBg: '#8b5cf6', date: 'Jun 3',  subtasks: 2, subtasksDone: 2, comments: 8 },
        { id: 'c11', title: 'User auth & JWT tokens',               tag: 'Dev',    tagColor: '#06b6d4', priority: 'high',   initials: 'AS', avatarBg: '#6366f1', date: 'Jun 1',  comments: 3 },
      ],
    },
  ]);

  columns = this._columns.asReadonly();
  columnIds = computed(() => this._columns().map(c => c.id));
  totalCards = computed(() => this._columns().reduce((s, c) => s + c.cards.length, 0));

  onDrop(event: CdkDragDrop<KanbanCard[]>) {
    this._columns.update(cols => {
      const updated = cols.map(c => ({ ...c, cards: [...c.cards] }));
      if (event.previousContainer === event.container) {
        const col = updated.find(c => c.id === event.container.id)!;
        moveItemInArray(col.cards, event.previousIndex, event.currentIndex);
      } else {
        const from = updated.find(c => c.id === event.previousContainer.id)!;
        const to   = updated.find(c => c.id === event.container.id)!;
        transferArrayItem(from.cards, to.cards, event.previousIndex, event.currentIndex);
      }
      return updated;
    });
  }

  openAddInColumn(colId: string) {
    this.newCard.colId = colId;
    this.showAdd = true;
  }

  addCard() {
    if (!this.newCard.title.trim()) return;
    const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const card: KanbanCard = {
      id: 'c' + Date.now(),
      title: this.newCard.title,
      tag: this.newCard.tag || 'Task',
      tagColor: randomColor,
      priority: this.newCard.priority,
      initials: 'ME',
      avatarBg: '#6366f1',
      date: this.newCard.date || undefined,
    };
    this._columns.update(cols =>
      cols.map(c => c.id === this.newCard.colId ? { ...c, cards: [...c.cards, card] } : c)
    );
    this.newCard = { title: '', colId: 'todo', priority: 'medium', tag: 'Task', date: '' };
    this.showAdd = false;
  }
}