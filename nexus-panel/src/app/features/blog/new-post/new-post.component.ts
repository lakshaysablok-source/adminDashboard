import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatIconModule],
  template: `
    <div class="animate-fade-in" style="max-width:900px;margin:0 auto">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:12px">
          <a routerLink="/blog/posts" style="display:inline-flex;padding:8px;border-radius:10px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-muted);text-decoration:none;transition:all .15s"
             onmouseenter="this.style.borderColor='var(--accent-500)'" onmouseleave="this.style.borderColor='var(--border-default)'">
            <mat-icon style="font-size:18px;width:18px;height:18px">arrow_back</mat-icon>
          </a>
          <div>
            <h1 style="font-size:22px;font-weight:800;color:var(--text-primary);letter-spacing:-.02em">New Post</h1>
            <p style="font-size:12px;color:var(--text-muted);margin-top:2px">Create and publish a new article</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button (click)="save('draft')" [disabled]="form.invalid"
                  style="padding:9px 18px;border-radius:10px;border:1px solid var(--border-default);background:var(--bg-card);color:var(--text-secondary);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s"
                  onmouseenter="this.style.borderColor='var(--accent-500)'" onmouseleave="this.style.borderColor='var(--border-default)'">
            Save Draft
          </button>
          <button (click)="save('published')" [disabled]="form.invalid"
                  style="padding:9px 18px;border-radius:10px;border:none;background:var(--accent-500);color:#fff;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .15s"
                  onmouseenter="this.style.opacity='.85'" onmouseleave="this.style.opacity='1'">
            <span style="display:flex;align-items:center;gap:6px">
              <mat-icon style="font-size:15px;width:15px;height:15px">publish</mat-icon>
              Publish Now
            </span>
          </button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start">

        <!-- Main editor -->
        <div style="display:flex;flex-direction:column;gap:16px">

          <!-- Cover preview -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;overflow:hidden">
            <div [style.background]="coverPreview()" style="height:200px;position:relative;transition:background .4s">
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
                <div style="text-align:center;color:rgba(255,255,255,.8)">
                  <mat-icon style="font-size:32px;width:32px;height:32px;display:block;margin:0 auto 8px">image</mat-icon>
                  <span style="font-size:13px">Cover image preview</span>
                </div>
              </div>
            </div>
            <div style="padding:14px 16px;display:flex;align-items:center;gap:8px">
              <mat-icon style="font-size:15px;width:15px;height:15px;color:var(--text-muted)">link</mat-icon>
              <span style="font-size:12px;color:var(--text-muted);flex:1">Cover gradient theme:</span>
              <div style="display:flex;gap:6px">
                @for (g of gradients; track g.value) {
                  <button (click)="selectGradient(g.value)"
                          [style.background]="g.value"
                          [style.box-shadow]="coverPreview() === g.value ? '0 0 0 3px var(--accent-500)' : 'none'"
                          style="width:22px;height:22px;border-radius:50%;border:2px solid var(--bg-card);cursor:pointer;transition:box-shadow .15s">
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Title -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:8px">Title *</label>
            <input [formControl]="c['title']" placeholder="Enter a compelling title…"
                   style="width:100%;font-size:20px;font-weight:700;color:var(--text-primary);border:none;background:transparent;outline:none;box-sizing:border-box;font-family:inherit"/>
            <div style="margin-top:8px;display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
              <span>Slug: /blog/{{ slug() }}</span>
              <span [style.color]="titleLen() > 80 ? '#ef4444' : 'var(--text-muted)'">{{ titleLen() }}/80</span>
            </div>
          </div>

          <!-- Excerpt -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px">
            <label style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:8px">Excerpt *</label>
            <textarea [formControl]="c['excerpt']" rows="3" placeholder="A short summary shown in post cards and SEO…"
                      style="width:100%;font-size:14px;color:var(--text-primary);border:none;background:transparent;outline:none;resize:vertical;box-sizing:border-box;line-height:1.6;font-family:inherit"></textarea>
            <div style="text-align:right;font-size:11px" [style.color]="excerptLen() > 200 ? '#ef4444' : 'var(--text-muted)'">{{ excerptLen() }}/200</div>
          </div>

          <!-- Body editor -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;overflow:hidden">
            <!-- Toolbar -->
            <div style="display:flex;align-items:center;gap:2px;padding:10px 12px;border-bottom:1px solid var(--border-default);flex-wrap:wrap">
              @for (btn of toolbar; track btn.label) {
                <button (click)="btn.action()" [title]="btn.label"
                        style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:6px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;font-size:12px;font-weight:700;transition:background .15s"
                        onmouseenter="this.style.background='var(--bg-elevated)'" onmouseleave="this.style.background='transparent'">
                  @if (btn.icon) {
                    <mat-icon style="font-size:14px;width:14px;height:14px">{{ btn.icon }}</mat-icon>
                  } @else {
                    {{ btn.label }}
                  }
                </button>
              }
            </div>
            <textarea [formControl]="c['content']" #bodyRef rows="18" placeholder="Write your article content here…&#10;&#10;Use the toolbar above for formatting hints, or write plain Markdown."
                      style="width:100%;padding:16px;font-size:14px;color:var(--text-primary);border:none;background:transparent;outline:none;resize:vertical;box-sizing:border-box;line-height:1.8;font-family:inherit"></textarea>
            <div style="padding:8px 14px;border-top:1px solid var(--border-default);display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
              <span>{{ wordCount() }} words &bull; ~{{ readTime() }} min read</span>
              <span>Markdown supported</span>
            </div>
          </div>
        </div>

        <!-- Sidebar settings -->
        <div style="display:flex;flex-direction:column;gap:16px;position:sticky;top:20px">

          <!-- Publish status -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px">
            <h3 style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">Publish Settings</h3>
            <div style="display:flex;flex-direction:column;gap:10px">
              <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block">Status</label>
              <select [formControl]="c['status']"
                      style="width:100%;padding:8px 12px;border-radius:9px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;outline:none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
              @if (form.value.status === 'scheduled') {
                <div>
                  <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px">Publish Date</label>
                  <input type="date" [formControl]="c['scheduleDate']"
                         style="width:100%;padding:8px 12px;border-radius:9px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;outline:none;box-sizing:border-box"/>
                </div>
              }
            </div>
          </div>

          <!-- Category & Tags -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px">
            <h3 style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">Categorization</h3>
            <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px">Category *</label>
            <select [formControl]="c['category']"
                    style="width:100%;padding:8px 12px;border-radius:9px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:13px;outline:none;margin-bottom:12px">
              <option value="">Select category…</option>
              @for (c of categories; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
            <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px">Tags</label>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
              @for (tag of selectedTags(); track tag) {
                <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;background:rgba(99,102,241,.12);color:var(--accent-500);font-size:12px;font-weight:500">
                  #{{ tag }}
                  <button (click)="removeTag(tag)" style="border:none;background:none;cursor:pointer;color:inherit;padding:0;line-height:1;font-size:14px">&times;</button>
                </span>
              }
            </div>
            <div style="display:flex;gap:6px">
              <input [(ngModel)]="tagInput" [ngModelOptions]="{standalone:true}" placeholder="Add tag…" (keydown.enter)="addTag()"
                     style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-primary);font-size:12px;outline:none"/>
              <button (click)="addTag()" style="padding:7px 10px;border-radius:8px;border:1px solid var(--border-default);background:var(--bg-elevated);color:var(--text-muted);cursor:pointer;font-size:12px">Add</button>
            </div>
          </div>

          <!-- SEO -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px">
            <h3 style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">SEO Preview</h3>
            <div style="background:var(--bg-elevated);border-radius:10px;padding:12px;font-size:12px">
              <div style="color:#1a73e8;font-size:14px;font-weight:500;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                {{ form.value.title || 'Post title' }}
              </div>
              <div style="color:#006621;margin-bottom:4px">nexus-panel.com/blog/{{ slug() }}</div>
              <div style="color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                {{ form.value.excerpt || 'Post excerpt will appear here…' }}
              </div>
            </div>
            <div style="margin-top:10px">
              <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px">
                <span>Title length</span>
                <span [style.color]="titleLen() > 60 ? '#f59e0b' : '#16a34a'">{{ titleLen() }}/60 ideal</span>
              </div>
              <div style="height:4px;border-radius:2px;background:var(--bg-elevated);overflow:hidden">
                <div [style.width]="Math.min(titleLen()/60*100,100)+'%'" [style.background]="titleLen()>80?'#ef4444':titleLen()>60?'#f59e0b':'#16a34a'" style="height:100%;transition:width .3s,background .3s;border-radius:2px"></div>
              </div>
            </div>
          </div>

          <!-- Checklist -->
          <div style="background:var(--bg-card);border:1px solid var(--border-default);border-radius:14px;padding:16px">
            <h3 style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">Pre-publish Checklist</h3>
            <div style="display:flex;flex-direction:column;gap:8px">
              @for (item of checklist(); track item.label) {
                <div style="display:flex;align-items:center;gap:8px">
                  <mat-icon [style.color]="item.done ? '#16a34a' : 'var(--text-muted)'" style="font-size:16px;width:16px;height:16px">
                    {{ item.done ? 'check_circle' : 'radio_button_unchecked' }}
                  </mat-icon>
                  <span style="font-size:12px" [style.color]="item.done ? 'var(--text-primary)' : 'var(--text-muted)'">{{ item.label }}</span>
                </div>
              }
            </div>
            <div style="margin-top:12px;height:6px;border-radius:3px;background:var(--bg-elevated);overflow:hidden">
              <div [style.width]="checkScore()+'%'" style="height:100%;border-radius:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6);transition:width .4s"></div>
            </div>
            <div style="text-align:right;font-size:11px;color:var(--text-muted);margin-top:4px">{{ checkScore() }}% ready</div>
          </div>

        </div>
      </div>

      <!-- Saved toast -->
      @if (saved()) {
        <div style="position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:12px;background:#16a34a;color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,.15);z-index:999;animation:slideUp .3s ease">
          <mat-icon style="font-size:18px;width:18px;height:18px">check_circle</mat-icon>
          Post {{ savedStatus() === 'draft' ? 'saved as draft' : 'published' }} successfully!
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    :host { display: block; }
  `],
})
export default class NewPostComponent {
  tagInput = '';
  selectedTags = signal<string[]>(['angular', 'tutorial']);
  saved = signal(false);
  savedStatus = signal<'draft' | 'published'>('draft');
  Math = Math;
  get c(): Record<string, FormControl> { return this.form.controls as unknown as Record<string, FormControl>; }

  categories = ['Design', 'Development', 'Marketing', 'Business', 'Technology', 'Tutorial'];

  gradients = [
    { value: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)' },
    { value: 'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)' },
    { value: 'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)' },
    { value: 'linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)' },
    { value: 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)' },
    { value: 'linear-gradient(135deg,#f97316 0%,#eab308 100%)' },
  ];

  coverPreview = signal(this.gradients[0].value);

  toolbar = [
    { label: 'H1', icon: '', action: () => this.insertText('# ') },
    { label: 'H2', icon: '', action: () => this.insertText('## ') },
    { label: 'H3', icon: '', action: () => this.insertText('### ') },
    { label: '|', icon: '', action: () => {} },
    { label: 'B', icon: '', action: () => this.wrapText('**') },
    { label: 'I', icon: '', action: () => this.wrapText('_') },
    { label: '`', icon: '', action: () => this.wrapText('`') },
    { label: '', icon: 'link', action: () => this.insertText('[text](url)') },
    { label: '', icon: 'format_list_bulleted', action: () => this.insertText('\n- ') },
    { label: '', icon: 'format_list_numbered', action: () => this.insertText('\n1. ') },
    { label: '', icon: 'code', action: () => this.insertText('\n```\ncode here\n```\n') },
    { label: '', icon: 'format_quote', action: () => this.insertText('\n> ') },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(80)]],
      excerpt: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', Validators.required],
      category: ['', Validators.required],
      status: ['draft'],
      scheduleDate: [''],
    });
  }

  slug = computed(() => {
    return (this.form.value.title || '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post-slug';
  });

  titleLen = computed(() => (this.form.value.title || '').length);
  excerptLen = computed(() => (this.form.value.excerpt || '').length);
  wordCount = computed(() => {
    const text = (this.form.value.content || '').trim();
    return text ? text.split(/\s+/).length : 0;
  });
  readTime = computed(() => Math.max(1, Math.ceil(this.wordCount() / 200)));

  checklist = computed(() => [
    { label: 'Title added', done: this.titleLen() > 5 },
    { label: 'Excerpt written', done: this.excerptLen() > 20 },
    { label: 'Content written (>100 words)', done: this.wordCount() >= 100 },
    { label: 'Category selected', done: !!this.form.value.category },
    { label: 'Tags added', done: this.selectedTags().length > 0 },
  ]);

  checkScore = computed(() => {
    const done = this.checklist().filter(c => c.done).length;
    return Math.round((done / this.checklist().length) * 100);
  });

  selectGradient(value: string) { this.coverPreview.set(value); }

  addTag() {
    const t = this.tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (t && !this.selectedTags().includes(t)) this.selectedTags.update(tags => [...tags, t]);
    this.tagInput = '';
  }

  removeTag(tag: string) { this.selectedTags.update(tags => tags.filter(t => t !== tag)); }

  insertText(text: string) {
    const ctrl = this.c['content'];
    ctrl.setValue((ctrl.value || '') + text);
  }

  wrapText(wrap: string) {
    const ctrl = this.c['content'];
    ctrl.setValue((ctrl.value || '') + wrap + 'text' + wrap);
  }

  save(status: 'draft' | 'published') {
    if (this.form.invalid) return;
    this.savedStatus.set(status);
    this.saved.set(true);
    setTimeout(() => {
      this.saved.set(false);
      if (status === 'published') this.router.navigate(['/blog/posts']);
    }, 2000);
  }
}