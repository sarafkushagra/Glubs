/** @type {import('tailwindcss').Config} */
const { TAILWIND_COLORS } = require('./src/config/theme.config.js');

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: TAILWIND_COLORS.primary,
        secondary: TAILWIND_COLORS.secondary,
        accent: TAILWIND_COLORS.accent,
        success: TAILWIND_COLORS.success,
        warning: TAILWIND_COLORS.warning,
        error: TAILWIND_COLORS.error,
        neutral: TAILWIND_COLORS.neutral,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.6)',
        'glow-md': '0 0 15px rgba(99, 102, 241, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
