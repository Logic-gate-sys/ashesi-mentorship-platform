import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary brand colors - Ashesi maroon */
        primary: {
          DEFAULT: '#7F1D1D',
          dark: '#5F1515',
          light: '#A02E2E',
          50: '#F9F3F3',
        },
        /* Accent color - using tag purple */
        accent: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#A78BFA',
          50: '#F5F3FF',
        },
        /* Alumni designation color */
        'tag-purple': {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
        },
        /* Secondary status colors */
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#7F1D1D',  /* Using primary maroon for info */
        /* Neutrals */
        surface: '#FFFFFF',
        page: '#F8F9FB',
        sidebar: '#0F1419',
        overlay: '#0F1419',
        /* Text colors */
        text: {
          DEFAULT: '#0F1419',
          primary: '#0F1419',
          secondary: '#4B5563',
          sub: '#4B5563',
          tertiary: '#9CA3AF',
          muted: '#D1D5DB',
          inverse: '#FFFFFF',
        },
        /* Borders */
        border: '#E5E7EB',
        'border-light': '#F3F4F7',
        'border-strong': '#D1D5DB',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      spacing: {
        '85': '21.25rem',
        '125': '31.25rem',
      },
      borderRadius: {
        'btn': '0.75rem',
      },
      boxShadow: {
        'accent': '0 4px 16px rgba(124, 58, 237, 0.16)',
        'primary': '0 4px 16px rgba(127, 29, 29, 0.16)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
