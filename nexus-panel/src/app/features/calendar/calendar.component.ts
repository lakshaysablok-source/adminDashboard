import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface CalEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  color: string;
  category: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-5 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-primary">Calendar</h1>
          <p class="text-sm mt-0.5" style="color:var(--text-muted)">
            {{ events.length }} events this month
          </p>
        </div>
        <button (click)="showAdd=true" style="
          display:flex;align-items:center;gap:6px;
          padding:8px 16px;border-radius:8px;border:none;cursor:pointer;
          background:var(--accent-500);color:#fff;font-size:13px;font-weight:600">
          <mat-icon style="font-size:18px;width:18px;height:18px">add</mat-icon>
          New Event
        </button>
      </div>

      <div class="cal-layout">

        <!-- Calendar grid -->
        <div class="card" style="flex:1;min-width:0">

          <!-- Month nav -->
          <div class="flex items-center justify-between mb-5">
            <button (click)="prevMonth()" style="
              border:1px solid var(--border-default);background:transparent;
              border-radius:8px;padding:6px;cursor:pointer;color:var(--text-secondary);
              display:flex;align-items:center;">
              <mat-icon style="font-size:18px;width:18px;height:18px">chevron_left</mat-icon>
            </button>
            <h2 class="font-bold text-primary" style="font-size:16px">{{ monthLabel() }}</h2>
            <button (click)="nextMonth()" style="
              border:1px solid var(--border-default);background:transparent;
              border-radius:8px;padding:6px;cursor:pointer;color:var(--text-secondary);
              display:flex;align-items:center;">
              <mat-icon style="font-size:18px;width:18px;height:18px">chevron_right</mat-icon>
            </button>
          </div>

          <!-- Day labels -->
          <div class="day-labels">
            @for (d of dayNames; track d) {
              <div class="day-label">{{ d }}</div>
            }
          </div>

          <!-- Grid -->
          <div class="cal-grid">
            @for (cell of calCells(); track $index) {
              <div class="cal-cell"
                [class.other-month]="!cell.currentMonth"
                [class.today]="cell.isToday"
                [class.selected]="cell.date === selectedDate()"
                (click)="selectDate(cell.date)">
                <span class="day-num">{{ cell.day }}</span>
                @for (ev of cell.events.slice(0,2); track ev.id) {
                  <div class="cal-event-chip" [style.background]="ev.color + '22'" [style.color]="ev.color">
                    {{ ev.title }}
                  </div>
                }
                @if (cell.events.length > 2) {
                  <div style="font-size:9px;color:var(--text-muted);padding:0 2px">+{{ cell.events.length - 2 }} more</div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Sidebar -->
        <div style="width:280px;flex-shrink:0;display:flex;flex-direction:column;gap:16px">

          <!-- Today btn + mini legend -->
          <div class="card" style="padding:16px">
            <button (click)="goToday()" style="
              width:100%;padding:8px;border-radius:8px;border:1px solid var(--accent-500);
              background:var(--accent-50);color:var(--accent-600);font-weight:600;
              font-size:13px;cursor:pointer">
              Today
            </button>
            <div class="space-y-2" style="margin-top:14px">
              @for (cat of categories; track cat.label) {
                <div class="flex items-center gap-2">
                  <div style="width:10px;height:10px;border-radius:3px;flex-shrink:0" [style.background]="cat.color"></div>
                  <span style="font-size:12px;color:var(--text-secondary)">{{ cat.label }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Selected day events -->
          <div class="card" style="padding:16px;flex:1">
            <h3 style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:12px">
              {{ selectedDateLabel() }}
            </h3>
            @if (selectedEvents().length === 0) {
              <div style="text-align:center;padding:24px 0">
                <mat-icon style="font-size:32px;width:32px;height:32px;color:var(--text-muted);opacity:.4">event_busy</mat-icon>
                <p style="font-size:12px;color:var(--text-muted);margin-top:8px">No events</p>
              </div>
            }
            @for (ev of selectedEvents(); track ev.id) {
              <div class="event-item" [style.border-left-color]="ev.color">
                <p style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ ev.title }}</p>
                <p style="font-size:11px;color:var(--text-muted);margin-top:2px">
                  {{ ev.time || 'All day' }} · {{ ev.category }}
                </p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Add Event Modal -->
      @if (showAdd) {
        <div class="modal-backdrop" (click)="showAdd=false">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between mb-4">
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary)">New Event</h3>
              <button (click)="showAdd=false" style="border:none;background:none;cursor:pointer;color:var(--text-muted)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="space-y-3">
              <div>
                <label class="field-label">Event Title</label>
                <input [(ngModel)]="newEv.title" placeholder="Add title…" class="field-input">
              </div>
              <div class="flex gap-3">
                <div style="flex:1">
                  <label class="field-label">Date</label>
                  <input type="date" [value]="newEv.date" (change)="newEv.date=$any($event.target).value" class="field-input">
                </div>
                <div style="flex:1">
                  <label class="field-label">Time</label>
                  <input type="time" [value]="newEv.time" (change)="newEv.time=$any($event.target).value" class="field-input">
                </div>
              </div>
              <div><label class="field-label">Category</label>
                <select [value]="newEv.category" (change)="newEv.category=$any($event.target).value" class="field-input">
                  @for (c of categories; track c.label) {
                    <option [value]="c.label">{{ c.label }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-5">
              <button (click)="showAdd=false" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border-default);background:transparent;cursor:pointer;color:var(--text-secondary);font-size:13px">Cancel</button>
              <button (click)="addEvent()" style="padding:8px 16px;border-radius:8px;border:none;cursor:pointer;background:var(--accent-500);color:#fff;font-size:13px;font-weight:600">Save Event</button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .cal-layout { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }

    .day-labels {
      display: grid; grid-template-columns: repeat(7, 1fr);
      margin-bottom: 4px;
    }
    .day-label {
      text-align: center; font-size: 11px; font-weight: 700;
      color: var(--text-muted); padding: 4px 0; text-transform: uppercase; letter-spacing: .06em;
    }

    .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }

    .cal-cell {
      min-height: 80px; padding: 6px; border-radius: 8px;
      border: 1px solid transparent; cursor: pointer;
      transition: background 150ms ease, border-color 150ms ease;
      &:hover { background: var(--bg-elevated); }
      &.other-month .day-num { color: var(--text-muted); opacity: .4; }
      &.today .day-num {
        background: var(--accent-500); color: #fff;
        border-radius: 50%; width: 24px; height: 24px;
        display: flex; align-items: center; justify-content: center;
      }
      &.selected { background: var(--accent-50); border-color: var(--accent-200, var(--accent-100)); }
    }
    .day-num { font-size: 12px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; display: block; }

    .cal-event-chip {
      font-size: 9px; font-weight: 600; padding: 1px 5px;
      border-radius: 4px; white-space: nowrap; overflow: hidden;
      text-overflow: ellipsis; margin-bottom: 1px;
    }

    .event-item {
      padding: 10px 10px 10px 12px;
      border-left: 3px solid;
      background: var(--bg-elevated);
      border-radius: 0 8px 8px 0;
      margin-bottom: 8px;
    }

    .modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px; }
    .modal-box { background:var(--bg-surface);border-radius:16px;padding:24px;width:100%;max-width:440px;box-shadow:0 20px 60px rgba(0,0,0,.2);border:1px solid var(--border-default); }
    .field-label { font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:5px; }
    .field-input { width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;box-sizing:border-box;&:focus{border-color:var(--accent-500);} }
  `],
})
export default class CalendarComponent {

  showAdd = false;
  newEv = { title: '', date: this.todayStr(), time: '', category: 'Meeting' };

  categories = [
    { label: 'Meeting',  color: '#6366f1' },
    { label: 'Release',  color: '#22c55e' },
    { label: 'Deadline', color: '#ef4444' },
    { label: 'Review',   color: '#f59e0b' },
    { label: 'Personal', color: '#8b5cf6' },
  ];

  events: CalEvent[] = [
    { id:1,  title: 'Sprint planning',    date: this.dateStr(1),  time: '09:00', color: '#6366f1', category: 'Meeting'  },
    { id:2,  title: 'Design review',      date: this.dateStr(1),  time: '14:00', color: '#f59e0b', category: 'Review'   },
    { id:3,  title: 'v2.0 Release',       date: this.dateStr(5),  time: '10:00', color: '#22c55e', category: 'Release'  },
    { id:4,  title: 'Team standup',       date: this.dateStr(7),  time: '09:30', color: '#6366f1', category: 'Meeting'  },
    { id:5,  title: 'Project deadline',   date: this.dateStr(10), time: '17:00', color: '#ef4444', category: 'Deadline' },
    { id:6,  title: 'UX workshop',        date: this.dateStr(10), time: '11:00', color: '#8b5cf6', category: 'Meeting'  },
    { id:7,  title: 'Investor call',      date: this.dateStr(14), time: '15:00', color: '#6366f1', category: 'Meeting'  },
    { id:8,  title: 'API v3 deadline',    date: this.dateStr(18), time: '18:00', color: '#ef4444', category: 'Deadline' },
    { id:9,  title: 'Code freeze',        date: this.dateStr(20), color: '#22c55e', category: 'Release'  },
    { id:10, title: 'Performance review', date: this.dateStr(22), time: '10:00', color: '#f59e0b', category: 'Review'   },
    { id:11, title: 'Lunch & Learn',      date: this.dateStr(25), time: '12:30', color: '#8b5cf6', category: 'Personal' },
    { id:12, title: 'Product demo',       date: this.dateStr(28), time: '16:00', color: '#6366f1', category: 'Meeting'  },
  ];

  private _year  = signal(new Date().getFullYear());
  private _month = signal(new Date().getMonth());
  private _today = new Date();
  private _selectedDate = signal(this.todayStr());

  selectedDate = this._selectedDate.asReadonly();

  monthLabel = computed(() => {
    return new Date(this._year(), this._month(), 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  selectedDateLabel = computed(() => {
    const d = new Date(this._selectedDate() + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  });

  selectedEvents = computed(() =>
    this.events.filter(e => e.date === this._selectedDate())
  );

  calCells = computed(() => {
    const y = this._year(), m = this._month();
    const first = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev  = new Date(y, m, 0).getDate();
    const cells: any[] = [];

    for (let i = first - 1; i >= 0; i--) {
      const day = daysInPrev - i;
      const d = new Date(y, m - 1, day);
      cells.push({ day, date: this.fmt(d), currentMonth: false, isToday: false, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(y, m, d);
      const dateStr = this.fmt(dt);
      cells.push({
        day: d, date: dateStr, currentMonth: true,
        isToday: dateStr === this.todayStr(),
        events: this.events.filter(e => e.date === dateStr),
      });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const dt = new Date(y, m + 1, d);
      cells.push({ day: d, date: this.fmt(dt), currentMonth: false, isToday: false, events: [] });
    }
    return cells;
  });

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  prevMonth() { this._month.update(m => { if (m === 0) { this._year.update(y => y-1); return 11; } return m-1; }); }
  nextMonth() { this._month.update(m => { if (m === 11) { this._year.update(y => y+1); return 0; } return m+1; }); }
  goToday() { this._year.set(this._today.getFullYear()); this._month.set(this._today.getMonth()); this._selectedDate.set(this.todayStr()); }
  selectDate(date: string) { this._selectedDate.set(date); }

  addEvent() {
    if (!this.newEv.title.trim() || !this.newEv.date) return;
    const cat = this.categories.find(c => c.label === this.newEv.category);
    this.events = [...this.events, {
      id: Date.now(), title: this.newEv.title, date: this.newEv.date,
      time: this.newEv.time || undefined, color: cat?.color || '#6366f1', category: this.newEv.category,
    }];
    this.showAdd = false;
    this.newEv = { title: '', date: this.todayStr(), time: '', category: 'Meeting' };
  }

  private todayStr() {
    const t = new Date();
    return this.fmt(t);
  }
  private fmt(d: Date) {
    return d.toISOString().split('T')[0];
  }
  private dateStr(offset: number) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return this.fmt(d);
  }
}