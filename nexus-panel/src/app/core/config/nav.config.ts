export interface NavItem {
  label: string;
  icon:  string; // Material Icons name
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
      { label: 'Dashboard', icon: 'dashboard',  route: '/dashboard' },
      { label: 'Analytics', icon: 'bar_chart',  route: '/analytics', badge: 'NEW' },
    ],
  },
  {
    label: 'COMPONENTS',
    items: [
      {
        label: 'Tables', icon: 'table_chart',
        children: [
          { label: 'Basic Table',    icon: 'list',          route: '/tables/basic' },
          { label: 'Advanced Table', icon: 'filter_list',   route: '/tables/advanced' },
        ],
      },
      {
        label: 'Forms', icon: 'description',
        children: [
          { label: 'Form Elements',   icon: 'input',         route: '/forms/elements' },
          { label: 'Form Validation', icon: 'check_circle',  route: '/forms/validation' },
        ],
      },
      { label: 'Charts',      icon: 'donut_large',   route: '/charts' },
      {
        label: 'UI Elements', icon: 'widgets',
        children: [
          { label: 'Buttons',        icon: 'smart_button',  route: '/ui/buttons' },
          { label: 'Badges & Chips', icon: 'label',         route: '/ui/badges' },
          { label: 'Cards',          icon: 'credit_card',   route: '/ui/cards' },
          { label: 'Modals',         icon: 'open_in_new',   route: '/ui/modals' },
        ],
      },
    ],
  },
  {
    label: 'ADVANCED',
    items: [
      { label: 'Diagrams',  icon: 'account_tree', route: '/diagrams', badge: 'NEW' },
      { label: 'Maps',      icon: 'map',          route: '/maps',     badge: 'NEW' },
    ],
  },
  {
    label: 'APPS',
    items: [
      { label: 'Kanban',       icon: 'view_kanban',  route: '/kanban'       },
      { label: 'Calendar',     icon: 'calendar_month', route: '/calendar'   },
      { label: 'Chat',         icon: 'chat',         route: '/chat'         },
      { label: 'Invoice',      icon: 'receipt_long', route: '/invoice'      },
      { label: 'File Manager', icon: 'folder_open',  route: '/file-manager' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { label: 'Profile',  icon: 'person',   route: '/profile' },
      { label: 'Settings', icon: 'settings', route: '/settings' },
    ],
  },
  {
    label: 'PAGES',
    items: [
      { label: '404 Not Found', icon: 'search_off', route: '/errors/404' },
      { label: '403 Forbidden', icon: 'lock',       route: '/errors/403' },
      { label: '500 Error',     icon: 'error',      route: '/errors/500' },
    ],
  },
];