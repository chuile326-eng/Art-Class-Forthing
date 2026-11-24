import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F3EA', ivory: '#FFFCF7', graphite: '#242424', charcoal: '#41403E',
        terracotta: '#D56B46', coral: '#EF8B73', sage: '#8C9B85', lavender: '#A59ACB',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 30px rgba(36,36,36,0.08)' },
    },
  },
  plugins: [],
};
export default config;
