import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth shell (no sidebar)
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./layout/auth-layout/auth-layout.component'),
    children: [
      { path: '',         redirectTo: 'login', pathMatch: 'full' },
      { path: 'login',    loadComponent: () => import('./features/auth/login/login.component') },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component') },
      { path: 'forgot',   loadComponent: () => import('./features/auth/forgot-password/forgot-password.component') },
    ],
  },

  // Main dashboard shell (with sidebar)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout.component'),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component'),  data: { breadcrumb: 'Dashboard' } },
      { path: 'analytics', loadComponent: () => import('./features/analytics/analytics.component'),  data: { breadcrumb: 'Analytics' } },
      {
        path: 'tables', data: { breadcrumb: 'Tables' },
        children: [
          { path: 'basic',    loadComponent: () => import('./features/tables/basic-table/basic-table.component') },
          { path: 'advanced', loadComponent: () => import('./features/tables/advanced-table/advanced-table.component') },
          { path: '', redirectTo: 'basic', pathMatch: 'full' },
        ],
      },
      {
        path: 'forms', data: { breadcrumb: 'Forms' },
        children: [
          { path: 'elements',   loadComponent: () => import('./features/forms/form-elements/form-elements.component') },
          { path: 'validation', loadComponent: () => import('./features/forms/form-validation/form-validation.component') },
          { path: '', redirectTo: 'elements', pathMatch: 'full' },
        ],
      },
      { path: 'charts',   loadComponent: () => import('./features/charts/charts.component') },
      {
        path: 'ui', data: { breadcrumb: 'UI Elements' },
        children: [
          { path: 'buttons', loadComponent: () => import('./features/ui-elements/buttons/buttons.component') },
          { path: 'badges',  loadComponent: () => import('./features/ui-elements/badges/badges.component') },
          { path: 'cards',   loadComponent: () => import('./features/ui-elements/cards/cards.component') },
          { path: 'modals',  loadComponent: () => import('./features/ui-elements/modals/modals.component') },
          { path: '', redirectTo: 'buttons', pathMatch: 'full' },
        ],
      },
      { path: 'diagrams', loadComponent: () => import('./features/diagrams/diagrams.component'),    data: { breadcrumb: 'Diagrams' } },
      { path: 'maps',     loadComponent: () => import('./features/maps/maps.component'),            data: { breadcrumb: 'Maps' } },
      { path: 'profile',  loadComponent: () => import('./features/profile/profile.component') },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component') },
      {
        path: 'errors',
        children: [
          { path: '404', loadComponent: () => import('./features/errors/not-found/not-found.component') },
          { path: '403', loadComponent: () => import('./features/errors/forbidden/forbidden.component') },
          { path: '500', loadComponent: () => import('./features/errors/server-error/server-error.component') },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'errors/404' },
];