import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  body: string;
  date: string;
  likes: number;
  liked: boolean;
}

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  template: `
    <div class="animate-fade-in" style="max-width:860px;margin:0 auto">

      <!-- Back -->
      <a routerLink="/blog/posts" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;text-decoration:none;margin-bottom:20px;transition:color .15s"
         onmouseenter="this.style.color='var(--accent-500)'" onmouseleave="this.style.color='var(--text-muted)'">
        <mat-icon style="font-size:16px;width:16px;height:16px">arrow_back</mat-icon>
        Back to Posts
      </a>

      <!-- Hero cover -->
      <div [style.background]="post().cover" style="height:320px;border-radius:16px;margin-bottom:32px;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 60%)"></div>
        <div style="position:absolute;bottom:24px;left:28px;right:28px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <span style="padding:3px 10px;border-radius:6px;background:var(--accent-500);color:#fff;font-size:11px;font-weight:700;text-transform:uppercase">{{ post().category }}</span>
            <span style="font-size:12px;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:4px">
              <mat-icon style="font-size:13px;width:13px;height:13px">schedule</mat-icon>
              {{ post().readTime }} min read
            </span>
          </div>
          <h1 style="font-size:26px;font-weight:900;color:#fff;line-height:1.25;letter-spacing:-.02em">{{ post().title }}</h1>
        </div>
      </div>

      <!-- Meta bar -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border-default)">
        <div style="display:flex;align-items:center;gap:12px">
          <div [style.background]="post().authorAvatar" style="width:44px;height:44px;border-radius:50%"></div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--text-primary)">{{ post().author }}</div>
            <div style="font-size:12px;color:var(--text-muted)">{{ post().publishedAt }} &bull; {{ post().readTime }} min read</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;color:var(--text-muted);font-size:13px">
          <span style="display:flex;align-items:center;gap:4px"><mat-icon style="font-size:15px;width:15px;height:15px">visibility</mat-icon>{{ post().views.toLocaleString() }}</span>
          <button (click)="toggleLike()" style="display:flex;align-items:center;gap:4px;border:none;background:none;cursor:pointer;font-size:13px;transition:color .15s"
                  [style.color]="liked() ? '#ef4444' : 'var(--text-muted)'">
            <mat-icon style="font-size:15px;width:15px;height:15px">{{ liked() ? 'favorite' : 'favorite_border' }}</mat-icon>{{ likeCount() }}
          </button>
          <span style="display:flex;align-items:center;gap:4px"><mat-icon style="font-size:15px;width:15px;height:15px">chat_bubble_outline</mat-icon>{{ comments().length }}</span>
          <button (click)="copyLink()" title="Share" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-secondary);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s"
                  onmouseenter="this.style.borderColor='var(--accent-500)';this.style.color='var(--accent-500)'" onmouseleave="this.style.borderColor='var(--border-default)';this.style.color='var(--text-secondary)'">
            <mat-icon style="font-size:14px;width:14px;height:14px">share</mat-icon>
            Share
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:28px">
        @for (tag of post().tags; track tag) {
          <span style="padding:4px 12px;border-radius:8px;background:var(--bg-elevated);border:1px solid var(--border-default);color:var(--text-muted);font-size:12px;font-weight:500">#{{ tag }}</span>
        }
      </div>

      <!-- Article body -->
      <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:32px;margin-bottom:32px;line-height:1.8;color:var(--text-secondary);font-size:15px">
        @for (section of post().sections; track section.heading) {
          <h2 style="font-size:20px;font-weight:800;color:var(--text-primary);margin:28px 0 12px;letter-spacing:-.02em">{{ section.heading }}</h2>
          <p style="margin-bottom:16px">{{ section.body }}</p>
          @if (section.code) {
            <pre style="background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:10px;padding:16px;font-size:13px;overflow-x:auto;color:var(--accent-400);line-height:1.6;margin-bottom:20px">{{ section.code }}</pre>
          }
        }
      </div>

      <!-- Related posts -->
      <div style="margin-bottom:36px">
        <h2 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:16px;letter-spacing:-.02em">Related Posts</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
          @for (r of related(); track r.id) {
            <a [routerLink]="['/blog/post-detail', r.id]" style="display:block;background:var(--bg-card);border:1px solid var(--border-default);border-radius:12px;overflow:hidden;text-decoration:none;transition:transform .2s"
               onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform='none'">
              <div [style.background]="r.cover" style="height:100px"></div>
              <div style="padding:12px">
                <span style="font-size:10px;font-weight:700;color:var(--accent-500);text-transform:uppercase">{{ r.category }}</span>
                <p style="font-size:13px;font-weight:700;color:var(--text-primary);margin-top:4px;line-height:1.4">{{ r.title }}</p>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Comments -->
      <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:24px">
        <h2 style="font-size:18px;font-weight:800;color:var(--text-primary);margin-bottom:20px;letter-spacing:-.02em">
          Comments <span style="font-size:14px;font-weight:500;color:var(--text-muted)">({{ comments().length }})</span>
        </h2>

        <!-- Add comment -->
        <div style="display:flex;gap:12px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border-default)">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);flex-shrink:0"></div>
          <div style="flex:1">
            <textarea [(ngModel)]="newComment" placeholder="Write a comment…" rows="3"
                      style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;resize:vertical;outline:none;box-sizing:border-box;font-family:inherit"
                      [ngModelOptions]="{standalone:true}"></textarea>
            <button (click)="submitComment()"
                    style="margin-top:8px;padding:7px 18px;border-radius:8px;background:var(--accent-500);color:#fff;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:opacity .15s"
                    onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
              Post Comment
            </button>
          </div>
        </div>

        <!-- Comment list -->
        <div style="display:flex;flex-direction:column;gap:20px">
          @for (c of comments(); track c.id) {
            <div style="display:flex;gap:12px">
              <div [style.background]="c.avatar" style="width:36px;height:36px;border-radius:50%;flex-shrink:0"></div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="font-size:13px;font-weight:700;color:var(--text-primary)">{{ c.author }}</span>
                  <span style="font-size:11px;color:var(--text-muted)">{{ c.date }}</span>
                </div>
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:8px">{{ c.body }}</p>
                <button (click)="likeComment(c.id)"
                        [style.color]="c.liked ? '#ef4444' : 'var(--text-muted)'"
                        style="display:inline-flex;align-items:center;gap:4px;font-size:12px;border:none;background:none;cursor:pointer;transition:color .15s">
                  <mat-icon style="font-size:13px;width:13px;height:13px">{{ c.liked ? 'favorite' : 'favorite_border' }}</mat-icon>
                  {{ c.likes }}
                </button>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  `,
})
export default class PostDetailComponent {
  newComment = '';
  liked = signal(false);
  likeCount = signal(182);

  post = signal({
    id: 1,
    title: 'Building Scalable Admin Dashboards with Angular 17',
    category: 'Development',
    cover: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
    author: 'Alex Morgan',
    authorAvatar: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    publishedAt: 'May 12, 2025',
    readTime: 8,
    views: 4821,
    tags: ['angular', 'typescript', 'architecture', 'standalone', 'signals'],
    sections: [
      {
        heading: 'Introduction',
        body: 'Building admin dashboards has evolved dramatically with the release of Angular 17. The introduction of signals, improved standalone component APIs, and built-in control flow syntax (@if, @for) has fundamentally changed how we structure large-scale applications. In this guide, we\'ll explore the architecture patterns that lead to maintainable, performant dashboards.',
        code: null,
      },
      {
        heading: 'Project Structure',
        body: 'The key to a scalable admin panel is a feature-based folder structure. Each feature module is self-contained — it owns its components, services, and models. This avoids the "shared barrel" anti-pattern and enables true lazy loading.',
        code: `src/app/\n  core/          ← guards, interceptors, global services\n  features/      ← one folder per route (dashboard, users…)\n  layout/        ← shell components (sidebar, topbar)\n  shared/        ← reusable UI components only`,
      },
      {
        heading: 'Using Angular Signals',
        body: 'Signals replace traditional RxJS state in component-level reactivity. They\'re simpler, synchronous, and integrate natively with Angular\'s change detection. Use computed() for derived state and effect() for side-effects that react to signal changes.',
        code: `const count = signal(0);\nconst doubled = computed(() => count() * 2);\n\neffect(() => console.log('Count is', count()));`,
      },
      {
        heading: 'Lazy Loading Routes',
        body: 'Every route in a production dashboard should be lazy loaded. Angular\'s loadComponent() with standalone components eliminates the need for NgModules entirely, reducing boilerplate by ~40% and improving initial bundle size.',
        code: `{ path: 'analytics', loadComponent: () =>\n    import('./features/analytics/analytics.component') }`,
      },
      {
        heading: 'Conclusion',
        body: 'The combination of standalone components, signals-based reactivity, and feature-based architecture gives us a dashboard template that is both developer-friendly and production-ready. Apply these patterns consistently and your Angular admin panel will scale without the complexity tax.',
        code: null,
      },
    ],
  });

  related = signal([
    { id: 2, title: 'Mastering Tailwind CSS: From Zero to Production', category: 'Design', cover: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { id: 6, title: 'How to Build a REST API with Node.js and TypeScript', category: 'Tutorial', cover: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
    { id: 3, title: 'SaaS Pricing Strategies That Actually Convert', category: 'Business', cover: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  ]);

  comments = signal<Comment[]>([
    { id: 1, author: 'Daniel Brooks', avatar: 'linear-gradient(135deg,#10b981,#06b6d4)', body: 'Really well-written! The signals section cleared up a lot of confusion I had with the new API. Keep these coming.', date: 'May 13, 2025', likes: 12, liked: false },
    { id: 2, author: 'Priya Sharma', avatar: 'linear-gradient(135deg,#ec4899,#8b5cf6)', body: 'The project structure tip is gold. I\'ve been struggling with a monolithic shared module for months — refactoring this week.', date: 'May 14, 2025', likes: 8, liked: false },
    { id: 3, author: 'Marcus Lee', avatar: 'linear-gradient(135deg,#f59e0b,#ef4444)', body: 'Bookmarked this. Angular 17 finally feels fun again after years of NgModule boilerplate.', date: 'May 15, 2025', likes: 5, liked: false },
  ]);

  toggleLike() {
    this.liked.update(v => !v);
    this.likeCount.update(n => this.liked() ? n + 1 : n - 1);
  }

  likeComment(id: number) {
    this.comments.update(list =>
      list.map(c => c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c));
  }

  submitComment() {
    if (!this.newComment.trim()) return;
    this.comments.update(list => [{
      id: Date.now(), author: 'You', avatar: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      body: this.newComment.trim(), date: 'Just now', likes: 0, liked: false,
    }, ...list]);
    this.newComment = '';
  }

  copyLink() {
    navigator.clipboard?.writeText(window.location.href);
  }
}