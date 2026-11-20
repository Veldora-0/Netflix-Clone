/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          dark: '#080B12',
          card: '#0E1420',
          surface: '#151D2B',
          'surface-hover': '#1C273A',
          border: '#1F2B3E',
          text: '#F5F7FA',
          muted: '#9AA7B8',
          accent: '#56E6D1',
          'accent-glow': 'rgba(86, 230, 209, 0.25)',
          purple: '#A78BFA',
          'purple-glow': 'rgba(167, 139, 250, 0.25)',
          amber: '#FFB86B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(86, 230, 209, 0.3)',
        'neon-purple': '0 0 25px -5px rgba(167, 139, 250, 0.3)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
