import { Component, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Message {
  id: number;
  text: string;
  time: string;
  mine: boolean;
}

interface Conversation {
  id: number;
  name: string;
  initials: string;
  avatarBg: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-4 animate-fade-in">

      <div>
        <h1 class="text-2xl font-bold text-primary">Messages</h1>
        <p class="text-sm mt-0.5" style="color:var(--text-muted)">
          {{ totalUnread() }} unread messages
        </p>
      </div>

      <div class="chat-layout card" style="padding:0;overflow:hidden;height:600px">

        <!-- Sidebar -->
        <div class="chat-sidebar">
          <div class="sidebar-search">
            <mat-icon style="font-size:16px;width:16px;height:16px;color:var(--text-muted);flex-shrink:0">search</mat-icon>
            <input [(ngModel)]="search" placeholder="Search conversations…" style="
              border:none;background:transparent;outline:none;font-size:13px;
              color:var(--text-primary);flex:1;font-family:inherit">
          </div>
          <div class="convos-list">
            @for (c of filteredConvos(); track c.id) {
              <div class="convo-item" [class.active]="activeId() === c.id" (click)="setActive(c.id)">
                <div class="relative">
                  <div class="avatar" [style.background]="c.avatarBg">{{ c.initials }}</div>
                  @if (c.online) {
                    <div class="online-dot"></div>
                  }
                </div>
                <div style="flex:1;min-width:0">
                  <div class="flex items-center justify-between">
                    <span style="font-size:13px;font-weight:600;color:var(--text-primary)">{{ c.name }}</span>
                    <span style="font-size:10px;color:var(--text-muted)">{{ c.time }}</span>
                  </div>
                  <div class="flex items-center justify-between mt-0.5">
                    <span style="font-size:12px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px">
                      {{ c.lastMsg }}
                    </span>
                    @if (c.unread > 0) {
                      <span style="
                        font-size:10px;font-weight:700;padding:1px 6px;
                        border-radius:9999px;background:var(--accent-500);color:#fff;
                        flex-shrink:0;margin-left:4px">
                        {{ c.unread }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Chat area -->
        @if (active(); as c) {
          <div class="chat-main">

            <!-- Header -->
            <div class="chat-header">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="avatar" [style.background]="c.avatarBg">{{ c.initials }}</div>
                  @if (c.online) { <div class="online-dot"></div> }
                </div>
                <div>
                  <p style="font-size:14px;font-weight:700;color:var(--text-primary)">{{ c.name }}</p>
                  <p style="font-size:11px;color:var(--text-muted)">{{ c.online ? 'Online' : 'Offline' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button class="icon-btn"><mat-icon style="font-size:18px;width:18px;height:18px">call</mat-icon></button>
                <button class="icon-btn"><mat-icon style="font-size:18px;width:18px;height:18px">videocam</mat-icon></button>
                <button class="icon-btn"><mat-icon style="font-size:18px;width:18px;height:18px">more_vert</mat-icon></button>
              </div>
            </div>

            <!-- Messages -->
            <div class="messages-area" #messagesEl>
              @for (msg of c.messages; track msg.id) {
                <div class="msg-row" [class.mine]="msg.mine">
                  @if (!msg.mine) {
                    <div class="avatar-sm" [style.background]="c.avatarBg">{{ c.initials }}</div>
                  }
                  <div>
                    <div class="bubble" [class.bubble-mine]="msg.mine">{{ msg.text }}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:3px" [style.text-align]="msg.mine ? 'right' : 'left'">
                      {{ msg.time }}
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Input -->
            <div class="chat-input-bar">
              <button class="icon-btn"><mat-icon style="font-size:18px;width:18px;height:18px">attach_file</mat-icon></button>
              <button class="icon-btn"><mat-icon style="font-size:18px;width:18px;height:18px">sentiment_satisfied</mat-icon></button>
              <input [(ngModel)]="newMsg" (keyup.enter)="send()"
                placeholder="Type a message…" class="chat-input">
              <button (click)="send()" class="send-btn"
                [style.opacity]="newMsg.trim() ? '1' : '0.5'">
                <mat-icon style="font-size:18px;width:18px;height:18px">send</mat-icon>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .chat-layout { display: flex; }

    .chat-sidebar {
      width: 300px; flex-shrink: 0;
      border-right: 1px solid var(--border-default);
      display: flex; flex-direction: column;
    }

    .sidebar-search {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-default);
      background: var(--bg-elevated);
    }

    .convos-list { flex: 1; overflow-y: auto; &::-webkit-scrollbar { width: 0; } }

    .convo-item {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; cursor: pointer;
      transition: background 150ms ease;
      border-bottom: 1px solid var(--border-default);
      &:hover { background: var(--bg-elevated); }
      &.active { background: var(--accent-50); }
    }

    .avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
    }

    .avatar-sm {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0;
    }.online-dot {
      position: absolute; bottom: 1px; right: 1px;
      width: 10px; height: 10px; border-radius: 50%;
      background: #22c55e; border: 2px solid var(--bg-surface);
    }

    .chat-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

    .chat-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-default);
      background: var(--bg-surface);
    }

    .messages-area {
      flex: 1; overflow-y: auto; padding: 20px;
      display: flex; flex-direction: column; gap: 16px;
      background: var(--bg-elevated);
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
    }

    .msg-row {
      display: flex; gap: 8px; align-items: flex-start;
      &.mine { flex-direction: row-reverse; }
    }

    .bubble {
      max-width: 340px; padding: 10px 14px;
      border-radius: 16px; font-size: 13px; line-height: 1.5;
      background: var(--bg-surface); color: var(--text-primary);
      border: 1px solid var(--border-default);
      border-bottom-left-radius: 4px;
      &.bubble-mine {
        background: var(--accent-500); color: #fff; border-color: transparent;
        border-bottom-left-radius: 16px; border-bottom-right-radius: 4px;
      }
    }

    .chat-input-bar {
      display: flex; align-items: center; gap: 6px;
      padding: 12px 16px;
      border-top: 1px solid var(--border-default);
      background: var(--bg-surface);
    }

    .chat-input {
      flex: 1; border: 1px solid var(--border-default);
      border-radius: 20px; padding: 8px 16px;
      font-size: 13px; font-family: inherit;
      background: var(--bg-elevated); color: var(--text-primary);
      outline: none;
      &:focus { border-color: var(--accent-500); }
    }

    .icon-btn {
      width: 36px; height: 36px; border-radius: 50%;
      border: none; background: transparent; cursor: pointer;
      color: var(--text-muted); display: flex; align-items: center; justify-content: center;
      &:hover { background: var(--bg-elevated); color: var(--text-primary); }
    }

    .send-btn {
      width: 36px; height: 36px; border-radius: 50%;
      border: none; background: var(--accent-500); color: #fff;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: opacity 150ms ease;
    }
  `],
})
export default class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesEl') messagesEl!: ElementRef<HTMLDivElement>;

  search = '';
  newMsg = '';
  private _activeId = signal(1);
  activeId = this._activeId.asReadonly();

  private _convos = signal<Conversation[]>([
    {
      id: 1, name: 'Alice Summers', initials: 'AS', avatarBg: '#6366f1',
      lastMsg: 'Sounds good, see you then!', time: '2m', unread: 2, online: true,
      messages: [
        { id:1, text: 'Hey! Did you review the latest designs?', time: '10:02 AM', mine: false },
        { id:2, text: 'Yes! I love the new color palette. Really clean.', time: '10:04 AM', mine: true },
        { id:3, text: 'Great! I was thinking we could also update the typography.', time: '10:05 AM', mine: false },
        { id:4, text: 'Agreed. Let\'s sync up this afternoon?', time: '10:06 AM', mine: true },
        { id:5, text: 'Sounds good, see you then!', time: '10:07 AM', mine: false },
      ],
    },
    {
      id: 2, name: 'Ryan Kim', initials: 'RK', avatarBg: '#10b981',
      lastMsg: 'PR is ready for review', time: '15m', unread: 1, online: true,
      messages: [
        { id:1, text: 'Hey, just pushed the auth refactor.', time: '9:45 AM', mine: false },
        { id:2, text: 'Nice, how long did it take?', time: '9:47 AM', mine: true },
        { id:3, text: 'About 3 hours. Cleaned up a lot of legacy code.', time: '9:48 AM', mine: false },
        { id:4, text: 'PR is ready for review', time: '9:50 AM', mine: false },
      ],
    },
    {
      id: 3, name: 'Julia Morgan', initials: 'JM', avatarBg: '#ef4444',
      lastMsg: 'Can we push the deadline?', time: '1h', unread: 0, online: false,
      messages: [
        { id:1, text: 'The client is asking for an extra feature.', time: '9:00 AM', mine: false },
        { id:2, text: 'What feature specifically?', time: '9:05 AM', mine: true },
        { id:3, text: 'Export to PDF from the reports page.', time: '9:06 AM', mine: false },
        { id:4, text: 'That\'s doable but will need 2 more days.', time: '9:08 AM', mine: true },
        { id:5, text: 'Can we push the deadline?', time: '9:09 AM', mine: false },
      ],
    },
    {
      id: 4, name: 'Sam Rivera', initials: 'SR', avatarBg: '#8b5cf6',
      lastMsg: 'Marketing assets are ready', time: '3h', unread: 0, online: true,
      messages: [
        { id:1, text: 'All the social media banners are done!', time: '8:00 AM', mine: false },
        { id:2, text: 'Perfect, uploading them now?', time: '8:02 AM', mine: true },
        { id:3, text: 'Marketing assets are ready', time: '8:04 AM', mine: false },
      ],
    },
    {
      id: 5, name: 'Dev Team', initials: 'DT', avatarBg: '#f59e0b',
      lastMsg: 'Sprint retro at 4pm today', time: 'Yesterday', unread: 5, online: true,
      messages: [
        { id:1, text: 'Reminder: sprint retro at 4pm today.', time: 'Yesterday', mine: false },
        { id:2, text: 'I\'ll be there. Need to prepare anything?', time: 'Yesterday', mine: true },
        { id:3, text: 'Just bring your notes on blockers.', time: 'Yesterday', mine: false },
        { id:4, text: 'Sprint retro at 4pm today', time: 'Yesterday', mine: false },
      ],
    },
  ]);

  filteredConvos = computed(() => {
    const q = this.search.toLowerCase();
    return q ? this._convos().filter(c => c.name.toLowerCase().includes(q)) : this._convos();
  });

  active = computed(() => this._convos().find(c => c.id === this._activeId()));

  totalUnread = computed(() => this._convos().reduce((s, c) => s + c.unread, 0));

  private shouldScroll = false;

  setActive(id: number) {
    this._activeId.set(id);
    this._convos.update(cs => cs.map(c => c.id === id ? { ...c, unread: 0 } : c));
    this.shouldScroll = true;
  }

  send() {
    if (!this.newMsg.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const text = this.newMsg.trim();
    this._convos.update(cs => cs.map(c => c.id === this._activeId()
      ? { ...c, messages: [...c.messages, { id: Date.now(), text, time: now, mine: true }], lastMsg: text, time: 'now' }
      : c
    ));
    this.newMsg = '';
    this.shouldScroll = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.messagesEl) {
      const el = this.messagesEl.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }
}