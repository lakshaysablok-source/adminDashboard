import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-form-elements',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, MatRadioModule, MatSliderModule,
    MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule,
    MatChipsModule, MatButtonModule, MatIconModule, MatAutocompleteModule,
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-bold text-primary">Form Elements</h1>
        <p class="text-muted text-sm mt-1">Showcase of all Angular Material form controls</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <!-- Text Inputs -->
        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Text Inputs</h3>
          <div class="space-y-3" [formGroup]="form">
            <mat-form-field appearance="outline">
              <mat-label>Default Input</mat-label>
              <input matInput formControlName="text" placeholder="Enter text...">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>With Hint</mat-label>
              <input matInput formControlName="hint" placeholder="your@email.com">
              <mat-hint>We'll never share your email</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>With Prefix</mat-label>
              <span matTextPrefix class="text-muted mr-1">$&nbsp;</span>
              <input matInput type="number" formControlName="amount" placeholder="0.00">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPwd ? 'text' : 'password'" formControlName="password">
              <button matSuffix type="button" (click)="showPwd = !showPwd"
                      style="border:none;background:none;cursor:pointer;padding:4px 6px;
                             display:flex;align-items:center;color:var(--text-secondary)">
                <mat-icon style="font-size:20px;width:20px;height:20px;line-height:20px">
                  {{ showPwd ? 'visibility_off' : 'visibility' }}
                </mat-icon>
              </button>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Textarea</mat-label>
              <textarea matInput formControlName="bio" rows="3"
                        placeholder="Tell us about yourself..."></textarea>
            </mat-form-field>
          </div>
        </div>

        <!-- Select & Autocomplete -->
        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Select & Autocomplete</h3>
          <div class="space-y-3" [formGroup]="form">
            <mat-form-field appearance="outline">
              <mat-label>Single Select</mat-label>
              <mat-select formControlName="country">
                @for (c of countries; track c) {
                  <mat-option [value]="c">{{ c }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Multi Select</mat-label>
              <mat-select formControlName="skills" multiple>
                @for (s of skills; track s) {
                  <mat-option [value]="s">{{ s }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Autocomplete</mat-label>
              <input matInput formControlName="framework" [matAutocomplete]="auto"
                     placeholder="Search framework...">
              <mat-autocomplete #auto="matAutocomplete">
                @for (f of filteredFrameworks(); track f) {
                  <mat-option [value]="f">{{ f }}</mat-option>
                }
              </mat-autocomplete>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date Picker</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>
        </div>

        <!-- Checkboxes & Radio -->
        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Checkboxes & Radio Buttons</h3>
          <div class="space-y-4" [formGroup]="form">
            <div>
              <p class="text-sm text-muted mb-2">Notifications</p>
              <div class="space-y-2">
                <mat-checkbox color="primary">Email notifications</mat-checkbox>
                <mat-checkbox color="primary" [checked]="true">Push notifications</mat-checkbox>
                <mat-checkbox color="primary">SMS alerts</mat-checkbox>
                <mat-checkbox color="warn">Marketing emails</mat-checkbox>
              </div>
            </div>
            <div>
              <p class="text-sm text-muted mb-2">Account type</p>
              <mat-radio-group formControlName="role" class="flex flex-col gap-2">
                <mat-radio-button value="admin"  color="primary">Admin</mat-radio-button>
                <mat-radio-button value="editor" color="primary">Editor</mat-radio-button>
                <mat-radio-button value="viewer" color="primary">Viewer (read-only)</mat-radio-button>
              </mat-radio-group>
            </div>
          </div>
        </div>

        <!-- Toggles & Sliders -->
        <div class="card">
          <h3 class="font-semibold text-primary mb-4">Toggles & Sliders</h3>
          <div class="space-y-5">
            <div>
              <p class="text-sm text-muted mb-3">Feature Flags</p>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">Dark mode</span>
                  <mat-slide-toggle color="primary" [checked]="true"></mat-slide-toggle>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Beta features</span>
                  <mat-slide-toggle color="primary"></mat-slide-toggle>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm">Two-factor auth</span>
                  <mat-slide-toggle color="primary" [checked]="true"></mat-slide-toggle>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted">Maintenance mode</span>
                  <mat-slide-toggle color="warn"></mat-slide-toggle>
                </div>
              </div>
            </div>

            <!-- Slider: signal + (valueChange) — no Zone.js CD on every drag -->
            <div>
              <p class="text-sm text-muted mb-2">Volume: {{ sliderValue() }}</p>
              <mat-slider min="0" max="100" step="1" class="w-full">
                <input matSliderThumb
                       [value]="sliderValue()"
                       (valueChange)="sliderValue.set($event)">
              </mat-slider>
            </div>

            <div>
              <p class="text-sm text-muted mb-2">
                Price range: $ {{ rangeMin() }} – $ {{ rangeMax() }}
              </p>
              <mat-slider min="0" max="1000" step="10" class="w-full">
                <input matSliderStartThumb
                       [value]="rangeMin()"
                       (valueChange)="rangeMin.set($event)">
                <input matSliderEndThumb
                       [value]="rangeMax()"
                       (valueChange)="rangeMax.set($event)">
              </mat-slider>
            </div>
          </div>
        </div>

        <!-- Chips / Tags -->
        <div class="card xl:col-span-2">
          <h3 class="font-semibold text-primary mb-4">Chips & Tags</h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-muted mb-2">Static chips</p>
              <mat-chip-set>
                @for (tag of tags; track tag) {
                  <mat-chip>{{ tag }}</mat-chip>
                }
              </mat-chip-set>
            </div>
            <div>
              <p class="text-sm text-muted mb-2">Removable chips</p>
              <mat-chip-set>
                @for (tag of removableTags(); track tag) {
                  <mat-chip (removed)="removeTag(tag)" [removable]="true">
                    {{ tag }}
                    <button matChipRemove>✕</button>
                  </mat-chip>
                }
              </mat-chip-set>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
})
export default class FormElementsComponent {
  private fb = inject(FormBuilder);

  showPwd = false;

  // Signals — updates are fine-grained; no Zone.js full-tree CD on slider drag
  sliderValue   = signal(65);
  rangeMin      = signal(100);
  rangeMax      = signal(600);
  removableTags = signal(['Frontend', 'Backend', 'DevOps', 'Design']);

  tags      = ['Angular', 'TypeScript', 'Tailwind', 'Chart.js', 'NgRx', 'RxJS'];
  countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India'];
  skills    = ['Angular', 'React', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Go'];
  frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Next.js', 'Nuxt', 'Remix', 'Astro'];

  form = this.fb.group({
    text: [''], hint: [''], amount: [null], password: [''],
    bio: [''], country: ['United States'], skills: [[]],
    framework: [''], date: [null], role: ['editor'],
  });

  // Only recomputes when the framework input actually changes — not every CD cycle
  private frameworkValue = toSignal(
    this.form.get('framework')!.valueChanges,
    { initialValue: '' },
  );

  filteredFrameworks = computed(() => {
    const val = (this.frameworkValue() ?? '').toLowerCase();
    return val ? this.frameworks.filter(f => f.toLowerCase().includes(val)) : this.frameworks;
  });

  removeTag(tag: string) {
    this.removableTags.update(tags => tags.filter(t => t !== tag));
  }
}