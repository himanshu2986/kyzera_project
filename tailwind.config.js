/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#0a0d14',
          surface: '#101623',
          card: '#131a29',
          cardHover: '#172134',
          border: '#1f2a3e',
          borderLight: '#2a3a54',
          muted: '#62728f',
          textMuted: '#94a3b8',
          textBright: '#f8fafc',
          blue: '#3b82f6',
          blueGlow: '#60a5fa',
          cyan: '#38bdf8',
          amber: '#f59e0b',
          amberGlow: '#fbbf24',
          red: '#ef4444',
          green: '#10b981',
          purple: '#8b5cf6',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(59, 130, 246, 0.25)',
        'glow': '0 0 25px -5px rgba(59, 130, 246, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

