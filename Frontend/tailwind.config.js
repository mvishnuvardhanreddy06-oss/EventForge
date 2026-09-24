/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        onaccent: 'var(--on-accent)',
        gold: 'var(--gold)',
        teal: 'var(--teal)',
        brand: {
          50: '#f0f4ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a'
        }
      }
    },
  },
  plugins: [],
}
