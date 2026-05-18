export interface NavItem {
    label: string;
    icon:  string;
    route?: string;
    badge?: string;
    children?: NavItem[];
  }

  export interface NavGroup {
    label: string;
    items: NavItem[];
  }

  export const NAV_CONFIG: NavGroup[] = [
    {
      label: 'MAIN MENU',
      items: [
        { label: 'Dashboard', icon: 'layout-dashboard', route: '/dashboard' },
        { label: 'Analytics',  icon: 'bar-chart-2',     route: '/analytics', badge: 'NEW' },
      ],
    },
    {
      label: 'COMPONENTS',
      items: [
        {
          label: 'Tables', icon: 'table',
          children: [
            { label: 'Basic Table',    icon: 'list',         route: '/tables/basic' },
            { label: 'Advanced Table', icon: 'table-2',      route: '/tables/advanced' },
          ],
        },
        {
          label: 'Forms', icon: 'file-text',
          children: [
            { label: 'Form Elements',   icon: 'square',        route: '/forms/elements' },
            { label: 'Form Validation', icon: 'check-square',  route: '/forms/validation' },
          ],
        },
        { label: 'Charts',      icon: 'pie-chart',  route: '/charts' },
        {
          label: 'UI Elements', icon: 'layers',
          children: [
            { label: 'Buttons',        icon: 'mouse-pointer-click', route: '/ui/buttons' },
            { label: 'Badges & Chips', icon: 'tag',                 route: '/ui/badges' },
            { label: 'Cards',          icon: 'credit-card',         route: '/ui/cards' },
            { label: 'Modals',         icon: 'maximize-2',          route: '/ui/modals' },
          ],
        },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { label: 'Profile',  icon: 'user',     route: '/profile' },
        { label: 'Settings', icon: 'settings', route: '/settings' },
      ],
    },
    {
      label: 'PAGES',
      items: [
        { label: '404 Not Found', icon: 'alert-circle', route: '/errors/404' },
        { label: '403 Forbidden', icon: 'lock',         route: '/errors/403' },
      ],
    },
  ];