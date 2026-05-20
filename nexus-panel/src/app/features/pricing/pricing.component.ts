import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Plan {
  name: string;
  price: number;
  annualPrice: number;
  desc: string;
  color: string;
  popular: boolean;
  icon: string;
  features: string[];
  cta: string;
}

interface CompareFeature {
  category: string;
  rows: { label: string; free: string | boolean; pro: string | boolean; enterprise: string | boolean }[];
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-8 animate-fade-in">

      <!-- Hero -->
      <div style="text-align:center;padding:24px 0 8px">
        <div style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:9999px;background:rgba(99,102,241,.1);color:var(--accent-500);font-size:12px;font-weight:700;margin-bottom:16px">
          <mat-icon style="font-size:14px;width:14px;height:14px">local_offer</mat-icon>
          Simple, transparent pricing
        </div>
        <h1 style="font-size:32px;font-weight:900;color:var(--text-primary);letter-spacing:-.03em;line-height:1.15">
          Choose the plan that's<br>
          <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">right for your team</span>
        </h1>
        <p style="font-size:15px;color:var(--text-muted);margin-top:12px;max-width:460px;margin-left:auto;margin-right:auto;line-height:1.6">
          Start free, scale when you need. No hidden fees, cancel anytime.
        </p>
        <!-- Billing toggle -->
        <div style="display:inline-flex;align-items:center;gap:12px;margin-top:24px;padding:4px;border-radius:10px;background:var(--bg-elevated);border:1px solid var(--border-default)">
          <button class="billing-btn" [class.active]="!annual()" (click)="annual.set(false)">Monthly</button>
          <button class="billing-btn" [class.active]="annual()" (click)="annual.set(true)">
            Annual
            <span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:9999px;background:#22c55e;color:#fff;margin-left:4px">Save 20%</span>
          </button>
        </div>
      </div>

      <!-- Plan cards -->
      <div class="plans-grid">
        @for (plan of plans; track plan.name) {
          <div class="plan-card" [class.popular]="plan.popular">
            @if (plan.popular) {
              <div class="popular-badge">Most Popular</div>
            }
            <!-- Header -->
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
              <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0" [style.background]="plan.color + '18'">
                <mat-icon style="font-size:22px;width:22px;height:22px" [style.color]="plan.color">{{ plan.icon }}</mat-icon>
              </div>
              <div>
                <p style="font-size:16px;font-weight:800;color:var(--text-primary)">{{ plan.name }}</p>
                <p style="font-size:12px;color:var(--text-muted)">{{ plan.desc }}</p>
              </div>
            </div>
            <!-- Price -->
            <div style="margin-bottom:24px">
              <div style="display:flex;align-items:baseline;gap:4px">
                <span style="font-size:38px;font-weight:900;color:var(--text-primary);letter-spacing:-.04em">
                  {{ plan.price === 0 ? 'Free' : '$' + (annual() ? plan.annualPrice : plan.price) }}
                </span>
                @if (plan.price > 0) {
                  <span style="font-size:14px;color:var(--text-muted)">/mo</span>
                }
              </div>
              @if (plan.price > 0 && annual()) {
                <p style="font-size:12px;color:var(--text-muted);margin-top:2px">Billed annually (\${{ plan.annualPrice * 12 }}/yr)</p>
              }
              @if (plan.price > 0 && !annual()) {
                <p style="font-size:12px;color:var(--text-muted);margin-top:2px">Billed monthly</p>
              }
            </div>
            <!-- CTA -->
            <button class="plan-cta" [class.primary]="plan.popular" [style.background]="plan.popular ? 'var(--accent-500)' : 'transparent'" [style.border-color]="plan.popular ? 'transparent' : plan.color" [style.color]="plan.popular ? '#fff' : plan.color">
              {{ plan.cta }}
            </button>
            <!-- Features -->
            <div style="margin-top:24px;display:flex;flex-direction:column;gap:10px">
              @for (feat of plan.features; track feat) {
                <div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text-secondary)">
                  <mat-icon style="font-size:16px;width:16px;height:16px;flex-shrink:0;margin-top:1px;color:#22c55e">check_circle</mat-icon>
                  {{ feat }}
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Feature comparison table -->
      <div>
        <h2 style="font-size:20px;font-weight:800;color:var(--text-primary);text-align:center;margin-bottom:24px">Full Feature Comparison</h2>
        <div class="card" style="padding:0;overflow:hidden">
          <!-- Sticky header -->
          <div class="compare-header">
            <div style="flex:1;padding:16px 20px;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em">Feature</div>
            @for (plan of plans; track plan.name) {
              <div style="width:120px;text-align:center;padding:16px 8px;flex-shrink:0">
                <p style="font-size:13px;font-weight:800;color:var(--text-primary)">{{ plan.name }}</p>
                <p style="font-size:11px;font-weight:700;margin-top:2px" [style.color]="plan.color">
                  {{ plan.price === 0 ? 'Free' : '$' + (annual() ? plan.annualPrice : plan.price) + '/mo' }}
                </p>
              </div>
            }
          </div>

          @for (section of compareFeatures; track section.category) {
            <!-- Category header -->
            <div style="padding:10px 20px;background:var(--bg-elevated);border-top:2px solid var(--border-default);border-bottom:1px solid var(--border-default)">
              <span style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em">{{ section.category }}</span>
            </div>
            @for (row of section.rows; track row.label) {
              <div class="compare-row">
                <div style="flex:1;padding:12px 20px;font-size:13px;color:var(--text-secondary)">{{ row.label }}</div>
                <div style="width:120px;text-align:center;padding:12px 8px;flex-shrink:0">
                  <ng-container *ngTemplateOutlet="cellTpl; context:{val: row.free}"></ng-container>
                </div><div style="width:120px;text-align:center;padding:12px 8px;flex-shrink:0;background:rgba(99,102,241,.03)">
                  <ng-container *ngTemplateOutlet="cellTpl; context:{val: row.pro}"></ng-container>
                </div>
                <div style="width:120px;text-align:center;padding:12px 8px;flex-shrink:0">
                  <ng-container *ngTemplateOutlet="cellTpl; context:{val: row.enterprise}"></ng-container>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- Cell template -->
      <ng-template #cellTpl let-val="val">
        @if (val === true) {
          <mat-icon style="font-size:18px;width:18px;height:18px;color:#22c55e">check_circle</mat-icon>
        } @else if (val === false) {
          <mat-icon style="font-size:18px;width:18px;height:18px;color:var(--border-default)">remove</mat-icon>
        } @else {
          <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">{{ val }}</span>
        }
      </ng-template>

      <!-- FAQ -->
      <div>
        <h2 style="font-size:20px;font-weight:800;color:var(--text-primary);text-align:center;margin-bottom:20px">Frequently Asked Questions</h2>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          @for (faq of faqs; track faq.q; let i = $index) {
            <div class="card" style="cursor:pointer" (click)="openFaq.set(openFaq()===i ? -1 : i)">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
                <p style="font-size:14px;font-weight:700;color:var(--text-primary)">{{ faq.q }}</p>
                <mat-icon style="flex-shrink:0;color:var(--text-muted);transition:transform 200ms" [style.transform]="openFaq()===i ? 'rotate(180deg)' : 'none'">expand_more</mat-icon>
              </div>
              @if (openFaq() === i) {
                <p style="font-size:13px;color:var(--text-secondary);margin-top:10px;line-height:1.7">{{ faq.a }}</p>
              }
            </div>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    .billing-btn {
      padding: 7px 16px; border-radius: 8px; border: none; background: transparent;
      cursor: pointer; font-size: 13px; font-weight: 600; color: var(--text-muted);
      transition: all 150ms; display: flex; align-items: center; gap: 4px;
      &.active { background: var(--bg-surface); color: var(--text-primary); box-shadow: 0 1px 4px rgba(0,0,0,.1); }
    }

    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; align-items: start; }

    .plan-card {
      background: var(--bg-surface); border: 1px solid var(--border-default);
      border-radius: 16px; padding: 28px; position: relative;
      transition: box-shadow 200ms, transform 200ms;
      &:hover { box-shadow: 0 8px 32px rgba(0,0,0,.12); transform: translateY(-2px); }
      &.popular {
        border-color: var(--accent-500);
        box-shadow: 0 0 0 1px var(--accent-500), 0 8px 32px rgba(99,102,241,.15);
      }
    }

    .popular-badge {
      position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; font-size: 11px; font-weight: 700;
      padding: 4px 14px; border-radius: 9999px; white-space: nowrap;
    }

    .plan-cta {
      width: 100%; padding: 11px; border-radius: 10px; font-size: 14px; font-weight: 700;
      cursor: pointer; border: 2px solid; transition: all 200ms;
      &.primary:hover { opacity: .9; }
      &:not(.primary):hover { background: var(--bg-elevated) !important; }
    }

    .compare-header {
      display: flex; align-items: center;
      background: var(--bg-elevated); border-bottom: 1px solid var(--border-default);
      position: sticky; top: 0; z-index: 10;
    }

    .compare-row {
      display: flex; align-items: center;
      border-bottom: 1px solid var(--border-default);
      transition: background 120ms;
      &:hover { background: var(--bg-elevated); }
      &:last-child { border-bottom: none; }
    }
  `],
})
export default class PricingComponent {
  annual   = signal(true);
  openFaq  = signal(-1);

  plans: Plan[] = [
    {
      name: 'Starter', price: 0, annualPrice: 0,
      desc: 'For individuals & small projects',
      color: '#94a3b8', popular: false, icon: 'rocket_launch', cta: 'Get Started Free',
      features: [
        '1 workspace', 'Up to 3 users', '5 GB storage', 'Basic analytics',
        'Dashboard & Charts', 'Email support',
      ],
    },
    {
      name: 'Pro', price: 29, annualPrice: 23,
      desc: 'For growing teams & businesses',
      color: '#6366f1', popular: true, icon: 'workspace_premium', cta: 'Start Pro Trial',
      features: [
        'Unlimited workspaces', 'Up to 25 users', '100 GB storage', 'Advanced analytics',
        'All APPS (Kanban, Calendar, Chat)', 'E-Commerce module',
        'User management & roles', 'Priority support', 'API access',
      ],
    },
    {
      name: 'Enterprise', price: 99, annualPrice: 79,
      desc: 'For large organizations',
      color: '#f59e0b', popular: false, icon: 'corporate_fare', cta: 'Contact Sales',
      features: [
        'Unlimited everything', 'Unlimited users', '1 TB storage', 'Custom reports & exports',
        'SSO / SAML authentication', 'Audit logs & compliance',
        'Dedicated account manager', 'SLA guarantee (99.9%)', 'Custom integrations',
      ],
    },
  ];

  compareFeatures: CompareFeature[] = [
    {
      category: 'Core',
      rows: [
        { label: 'Dashboard & Analytics',    free: true,       pro: true,        enterprise: true         },
        { label: 'Users',                    free: '3 users',  pro: '25 users',  enterprise: 'Unlimited'  },
        { label: 'Storage',                  free: '5 GB',     pro: '100 GB',    enterprise: '1 TB'       },
        { label: 'Workspaces',               free: '1',        pro: 'Unlimited', enterprise: 'Unlimited'  },
      ],
    },
    {
      category: 'Apps',
      rows: [
        { label: 'Kanban Board',             free: false,  pro: true,  enterprise: true },
        { label: 'Calendar',                 free: false,  pro: true,  enterprise: true },
        { label: 'Chat',                     free: false,  pro: true,  enterprise: true },
        { label: 'File Manager',             free: true,   pro: true,  enterprise: true },
        { label: 'Invoice',                  free: false,  pro: true,  enterprise: true },
      ],
    },
    {
      category: 'E-Commerce',
      rows: [
        { label: 'Products & Orders',        free: false,  pro: true,  enterprise: true },
        { label: 'Refunds & Payments',       free: false,  pro: true,  enterprise: true },
        { label: 'Custom Storefront',        free: false,  pro: false, enterprise: true },
      ],
    },
    {
      category: 'Security & Admin',
      rows: [
        { label: 'Role-based Access Control', free: false, pro: true,enterprise: true },
        { label: 'SSO / SAML',               free: false,  pro: false, enterprise: true },
        { label: 'Audit Logs',               free: false,  pro: false, enterprise: true },
        { label: '2FA Enforcement',          free: false,  pro: true,  enterprise: true },
        { label: 'IP Allowlisting',          free: false,  pro: false, enterprise: true },
      ],
    },
    {
      category: 'Support',
      rows: [
        { label: 'Email Support',            free: true,          pro: true,             enterprise: true           },
        { label: 'Priority Support',         free: false,         pro: true,             enterprise: true           },
        { label: 'Dedicated Account Manager',free: false,         pro: false,            enterprise: true           },
        { label: 'SLA',                      free: 'Best effort', pro: '99.5% uptime',   enterprise: '99.9% uptime' },
        { label: 'Onboarding',               free: false,         pro: 'Self-serve',     enterprise: 'Guided'       },
      ],
    },
  ];

  faqs = [
    { q: 'Can I switch plans at any time?',        a: 'Yes, you can upgrade or downgrade at any time. When upgrading, you\'ll be charged the prorated difference immediately. Downgrades take effect at the next billing cycle.' },
    { q: 'Is there a free trial?',                 a: 'Pro and Enterprise plans include a 14-day free trial, no credit card required. You\'ll have full access to all features during the trial period.' },
    { q: 'What payment methods do you accept?',    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as PayPal and bank transfers for annual Enterprise plans.' },
    { q: 'Can I add more users later?',            a: 'Absolutely. You can add team members at any time from your workspace settings. Additional users beyond the plan limit are billed on a per-seat basis.' },
    { q: 'What happens to my data if I cancel?',   a: 'Your data is retained for 30 days after cancellation, giving you time to export everything. After that, it is permanently deleted from our servers.' },
    { q: 'Do you offer discounts for non-profits?', a: 'Yes! Non-profit organizations and educational institutions are eligible for a 50% discount on any plan. Contact our sales team with proof of status.' },
  ];
}