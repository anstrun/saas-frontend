import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface:  { DEFAULT: '#111113', raised: '#18181B', overlay: '#1C1C1F' },
        edge:     { subtle: 'rgba(255,255,255,0.05)', DEFAULT: 'rgba(255,255,255,0.08)', strong: 'rgba(255,255,255,0.12)' },
        ink:      { primary: '#FAFAFA', secondary: '#A1A1AA', tertiary: '#71717A', ghost: '#3F3F46' },
        blue:     { DEFAULT: '#3B82F6', hover: '#2563EB', muted: 'rgba(59,130,246,0.12)', glow: 'rgba(59,130,246,0.25)' },
        green:    { DEFAULT: '#22C55E', muted: 'rgba(34,197,94,0.12)' },
        amber:    { DEFAULT: '#F59E0B', muted: 'rgba(245,158,11,0.12)' },
        red:      { DEFAULT: '#EF4444', muted: 'rgba(239,68,68,0.12)' },
      },
      keyframes: {
        'fade-up':  { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer:    { from: { backgroundPosition: '-600px 0' }, to: { backgroundPosition: '600px 0' } },
      },
      animation: {
        'fade-up': 'fade-up 0.28s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.2s ease both',
        shimmer:   'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
