import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  cover: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  comments: number;
  likes: number;
  publishedAt: string;
  readTime: number;
}

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h1 style="font-size:24px;font-weight:800;color:var(--text-primary);letter-spacing:-.02em">Blog Posts</h1>
          <p style="font-size:13px;color:var(--text-muted);margin-top:2px">{{ filtered().length }} posts &bull; {{ publishedCount() }} published</p>
        </div>
        <a routerLink="/blog/new-post"
           style="display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:10px;background:var(--accent-500);color:#fff;font-size:13px;font-weight:600;text-decoration:none;transition:opacity .15s"
           onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
          <mat-icon style="font-size:16px;width:16px;height:16px">add</mat-icon>
          New Post
        </a>
      </div>

      <!-- Filters row -->
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <!-- Search -->
        <div style="position:relative;flex:1;min-width:220px">
          <mat-icon style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:16px;width:16px;height:16px;color:var(--text-muted)">search</mat-icon>
          <input [(ngModel)]="search" placeholder="Search posts…"
                 style="width:100%;padding:8px 12px 8px 34px;border-radius:9px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-primary);font-size:13px;outline:none;box-sizing:border-box"/>
        </div>
        <!-- Status filter -->
        <div style="display:flex;gap:6px">
          @for (s of statuses; track s.value) {
            <button (click)="statusFilter.set(s.value)"
                    [style.background]="statusFilter() === s.value ? 'var(--accent-500)' : 'var(--bg-elevated)'"
                    [style.color]="statusFilter() === s.value ? '#fff' : 'var(--text-secondary)'"
                    style="padding:6px 14px;border-radius:8px;border:1px solid var(--border-default);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s">
              {{ s.label }}
            </button>
          }
        </div>
        <!-- Category filter -->
        <select [(ngModel)]="categoryFilter"
                style="padding:8px 12px;border-radius:9px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-primary);font-size:13px;outline:none">
          <option value="">All Categories</option>
          @for (c of categories; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
      </div>

      <!-- View toggle + sort -->
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:12px;color:var(--text-muted)">Showing {{ filtered().length }} results</span>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="display:flex;border:1px solid var(--border-default);border-radius:8px;overflow:hidden">
            <button (click)="view.set('grid')" [style.background]="view()==='grid'?'var(--accent-500)':'var(--bg-card)'" [style.color]="view()==='grid'?'#fff':'var(--text-muted)'" style="padding:6px 10px;border:none;cursor:pointer">
              <mat-icon style="font-size:16px;width:16px;height:16px">grid_view</mat-icon>
            </button>
            <button (click)="view.set('list')" [style.background]="view()==='list'?'var(--accent-500)':'var(--bg-card)'" [style.color]="view()==='list'?'#fff':'var(--text-muted)'" style="padding:6px 10px;border:none;cursor:pointer">
              <mat-icon style="font-size:16px;width:16px;height:16px">view_list</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Grid view -->
      @if (view() === 'grid') {
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px">
          @for (post of filtered(); track post.id) {
            <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;overflow:hidden;transition:transform .2s,box-shadow .2s;cursor:pointer"
                 onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.12)'"
                 onmouseleave="this.style.transform='none';this.style.boxShadow='none'">
              <!-- Cover -->
              <div [style.background]="post.cover" style="height:160px;position:relative">
                <span [class]="'status-badge ' + post.status"
                      style="position:absolute;top:10px;right:10px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase">
                  {{ post.status }}
                </span>
              </div>
              <div style="padding:16px">
                <!-- Category + read time -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                  <span style="font-size:11px;font-weight:700;color:var(--accent-500);text-transform:uppercase;letter-spacing:.05em">{{ post.category }}</span>
                  <span style="font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:3px">
                    <mat-icon style="font-size:12px;width:12px;height:12px">schedule</mat-icon>
                    {{ post.readTime }} min read
                  </span>
                </div>
                <a [routerLink]="['/blog/post-detail', post.id]" style="text-decoration:none">
                  <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);line-height:1.4;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                    {{ post.title }}
                  </h3>
                </a>
                <p style="font-size:13px;color:var(--text-muted);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:12px">
                  {{ post.excerpt }}
                </p>
                <!-- Tags -->
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">
                  @for (tag of post.tags.slice(0,3); track tag) {
                    <span style="padding:2px 8px;border-radius:5px;background:var(--bg-elevated);color:var(--text-muted);font-size:11px">#{{ tag }}</span>
                  }
                </div>
                <!-- Footer -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border-default)">
                  <div style="display:flex;align-items:center;gap:8px">
                    <div [style.background]="post.authorAvatar" style="width:28px;height:28px;border-radius:50%"></div>
                    <div>
                      <div style="font-size:12px;font-weight:600;color:var(--text-primary)">{{ post.author }}</div>
                      <div style="font-size:11px;color:var(--text-muted)">{{ post.publishedAt }}</div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:10px;color:var(--text-muted);font-size:12px">
                    <span style="display:flex;align-items:center;gap:3px"><mat-icon style="font-size:13px;width:13px;height:13px">visibility</mat-icon>{{ post.views }}</span>
                    <span style="display:flex;align-items:center;gap:3px"><mat-icon style="font-size:13px;width:13px;height:13px">favorite</mat-icon>{{ post.likes }}</span>
                    <span style="display:flex;align-items:center;gap:3px"><mat-icon style="font-size:13px;width:13px;height:13px">chat_bubble</mat-icon>{{ post.comments }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- List view -->
      @if (view() === 'list') {
        <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg-elevated);font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">
                <th style="padding:12px 16px;text-align:left">Post</th>
                <th style="padding:12px 16px;text-align:left">Category</th>
                <th style="padding:12px 16px;text-align:left">Status</th>
                <th style="padding:12px 16px;text-align:right">Views</th>
                <th style="padding:12px 16px;text-align:right">Likes</th>
                <th style="padding:12px 16px;text-align:left">Date</th>
                <th style="padding:12px 16px;text-align:center">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (post of filtered(); track post.id; let last = $last) {
                <tr [style.border-bottom]="last ? 'none' : '1px solid var(--border-default)'"
                    style="transition:background .15s" onmouseenter="this.style.background='var(--bg-elevated)'" onmouseleave="this.style.background='transparent'">
                  <td style="padding:14px 16px">
                    <div style="display:flex;align-items:center;gap:12px">
                      <div [style.background]="post.cover" style="width:48px;height:36px;border-radius:6px;flex-shrink:0"></div>
                      <div>
                        <a [routerLink]="['/blog/post-detail', post.id]" style="font-size:13px;font-weight:600;color:var(--text-primary);text-decoration:none;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;max-width:280px">{{ post.title }}</a>
                        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">{{ post.readTime }} min read</div>
                      </div>
                    </div>
                  </td>
                  <td style="padding:14px 16px"><span style="font-size:12px;color:var(--accent-500);font-weight:600">{{ post.category }}</span></td>
                  <td style="padding:14px 16px">
                    <span [class]="'status-badge ' + post.status" style="padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase">{{ post.status }}</span>
                  </td>
                  <td style="padding:14px 16px;text-align:right;font-size:13px;color:var(--text-secondary)">{{ post.views.toLocaleString() }}</td>
                  <td style="padding:14px 16px;text-align:right;font-size:13px;color:var(--text-secondary)">{{ post.likes }}</td>
                  <td style="padding:14px 16px;font-size:12px;color:var(--text-muted)">{{ post.publishedAt }}</td>
                  <td style="padding:14px 16px;text-align:center">
                    <div style="display:flex;align-items:center;justify-content:center;gap:6px">
                      <a [routerLink]="['/blog/post-detail', post.id]" title="View"
                         style="display:inline-flex;padding:5px;border-radius:7px;background:var(--bg-elevated);color:var(--text-muted);text-decoration:none;border:1px solid var(--border-default)">
                        <mat-icon style="font-size:14px;width:14px;height:14px">visibility</mat-icon>
                      </a>
                      <a routerLink="/blog/new-post" title="Edit"
                         style="display:inline-flex;padding:5px;border-radius:7px;background:var(--bg-elevated);color:var(--text-muted);text-decoration:none;border:1px solid var(--border-default)">
                        <mat-icon style="font-size:14px;width:14px;height:14px">edit</mat-icon>
                      </a>
                      <button (click)="deletePost(post.id)" title="Delete"
                              style="display:inline-flex;padding:5px;border-radius:7px;background:var(--bg-elevated);color:#ef4444;border:1px solid var(--border-default);cursor:pointer">
                        <mat-icon style="font-size:14px;width:14px;height:14px">delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Empty state -->
      @if (filtered().length === 0) {
        <div style="text-align:center;padding:64px 24px;background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px">
          <mat-icon style="font-size:48px;width:48px;height:48px;color:var(--text-muted);display:block;margin:0 auto 16px">article</mat-icon>
          <h3 style="font-size:16px;font-weight:700;color:var(--text-primary)">No posts found</h3>
          <p style="font-size:13px;color:var(--text-muted);margin-top:6px">Try adjusting your search or filters</p>
        </div>
      }

    </div>
  `,
  styles: [`
    .status-badge.published  { background: rgba(34,197,94,.12);  color: #16a34a; }
    .status-badge.draft      { background: rgba(234,179,8,.12);   color: #ca8a04; }
    .status-badge.scheduled  { background: rgba(99,102,241,.12);  color: var(--accent-500); }
  `],
})
export default class PostsComponent {
  search = '';
  categoryFilter = '';
  statusFilter = signal<string>('all');
  view = signal<'grid' | 'list'>('grid');

  statuses = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  categories = ['Design', 'Development', 'Marketing', 'Business', 'Technology', 'Tutorial'];

  posts = signal<Post[]>([
    { id: 1, title: 'Building Scalable Admin Dashboards with Angular 17', slug: 'scalable-admin-dashboards-angular', excerpt: 'Explore the best practices for building production-ready admin panels using Angular signals, lazy loading, and standalone components.', content: '', author: 'Alex Morgan', authorAvatar: 'linear-gradient(135deg,#6366f1,#8b5cf6)', category: 'Development', tags: ['angular', 'typescript', 'architecture'], cover: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', status: 'published', views: 4821, comments: 34, likes: 182, publishedAt: 'May 12, 2025', readTime: 8 },
    { id: 2, title: 'Mastering Tailwind CSS: From Zero to Production', slug: 'mastering-tailwind-css', excerpt: 'A comprehensive guide on using Tailwind CSS utility classes to build beautiful, responsive interfaces without writing custom CSS.', content: '', author: 'Sara Lee', authorAvatar: 'linear-gradient(135deg,#f59e0b,#ef4444)', category: 'Design', tags: ['tailwind', 'css', 'ui'], cover: 'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)', status: 'published', views: 3204, comments: 21, likes: 145, publishedAt: 'May 8, 2025', readTime: 6 },
    { id: 3, title: 'SaaS Pricing Strategies That Actually Convert', slug: 'saas-pricing-strategies', excerpt: 'Discover how top SaaS companies structure their pricing tiers to maximize conversion rates and reduce churn.', content: '', author: 'James Patel', authorAvatar: 'linear-gradient(135deg,#10b981,#06b6d4)', category: 'Business', tags: ['saas', 'pricing', 'growth'], cover: 'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)', status: 'published', views: 2877, comments: 17, likes: 98, publishedAt: 'May 5, 2025', readTime: 5 },
    { id: 4, title: 'The Ultimate Guide to UI Component Libraries in 2025', slug: 'ui-component-libraries-2025', excerpt: 'Comparing the top component libraries for React, Angular and Vue — which one fits your project best?', content: '', author: 'Maria Chen', authorAvatar: 'linear-gradient(135deg,#ec4899,#8b5cf6)', category: 'Design', tags: ['ui', 'components', 'comparison'], cover: 'linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)', status: 'draft', views: 0, comments: 0, likes: 0, publishedAt: 'Unpublished', readTime: 11 },
    { id: 5, title: 'Email Marketing Automation: A 2025 Playbook', slug: 'email-marketing-automation-2025', excerpt: 'Learn how to set up automated email funnels that nurture leads and convert them into paying customers.', content: '', author: 'Tom Wilson', authorAvatar: 'linear-gradient(135deg,#f97316,#eab308)', category: 'Marketing', tags: ['email', 'automation', 'marketing'], cover: 'linear-gradient(135deg,#f97316 0%,#eab308 100%)', status: 'scheduled', views: 0, comments: 0, likes: 0, publishedAt: 'Jun 1, 2025', readTime: 7 },
    { id: 6, title: 'How to Build a REST API with Node.js and TypeScript', slug: 'rest-api-nodejs-typescript', excerpt: 'Step-by-step tutorial covering Express setup, authentication middleware, database integration, and deployment.', content: '', author: 'Alex Morgan', authorAvatar: 'linear-gradient(135deg,#6366f1,#8b5cf6)', category: 'Tutorial', tags: ['nodejs', 'typescript', 'api'], cover: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)', status: 'published', views: 5632, comments: 48, likes: 231, publishedAt: 'Apr 28, 2025', readTime: 12 },
  ]);

  publishedCount = computed(() => this.posts().filter(p => p.status === 'published').length);

  filtered = computed(() => {
    return this.posts().filter(p => {
      const matchSearch = !this.search || p.title.toLowerCase().includes(this.search.toLowerCase()) || p.excerpt.toLowerCase().includes(this.search.toLowerCase());
      const matchStatus = this.statusFilter() === 'all' || p.status === this.statusFilter();
      const matchCategory = !this.categoryFilter || p.category === this.categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  });

  deletePost(id: number) {
    this.posts.update(posts => posts.filter(p => p.id !== id));
  }
}