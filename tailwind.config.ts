import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary brand colors - Mentor app burgundy theme */
        primary: {
          DEFAULT: '#923D41',
          dark: '#6A0A1D',
          light: '#B85459',
          50: '#FBF7F7',
        },
        /* Accent color - pink accents */
        accent: {
          DEFAULT: '#FFB7B9',
          dark: '#FF9094',
          light: '#FFD3D5',
          50: '#FFF8F8',
        },
        /* Status colors */
        'tag-purple': {
          DEFAULT: '#FFB7B9',
          50: '#FFF8F8',
          100: '#FFECEE',
          200: '#FFD9DD',
        },
        /* Secondary status colors */
        warning: '#F59E0B',
        danger: '#EF4444',
        success: '#10B981',
        info: '#923D41',
        /* Neutrals */
        surface: '#FFFFFF',
        page: '#FFF8F7',
        sidebar: '#923D41',
        overlay: '#0F1419',
        /* Design specific backgrounds */
        'chat-bg': '#FFF8F7',
        'impact-bg': '#F8E3E3',
        'light-pink': '#FFB7B9',
        /* Text colors */
        text: {
          DEFAULT: '#6A0A1D',
          primary: '#6A0A1D',
          secondary: '#78716C',
          sub: '#A8A29E',
          tertiary: '#9CA3AF',
          muted: '#D1D5DB',
          inverse: '#FFFFFF',
        },
        /* Borders */
        border: '#DDC0C0',
        'border-light': '#E8DFE0',
        'border-strong': '#C7BEB8',
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
        'accent': '0 4px 16px rgba(255, 183, 185, 0.16)',
        'primary': '0 4px 16px rgba(146, 61, 65, 0.16)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
