/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  corePlugins: {
    preflight: false, // stops CSS reset war with Angular Material
  },
  darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: {
          50:  'var(--accent-50)',
          100: 'var(--accent-100)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
        },
        surface:   'var(--bg-surface)',
        base:      'var(--bg-base)',
        elevated:  'var(--bg-elevated)',
        border:    'var(--border-default)',
        primary:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted:     'var(--text-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:        'var(--shadow-card)',
        'card-hover':'var(--shadow-card-hover)',
      },
    },
  },
  plugins: [],
};