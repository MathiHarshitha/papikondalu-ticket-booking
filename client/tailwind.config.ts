import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        river: {
          DEFAULT: '#123B56',
          50: '#e8f1f7',
          100: '#c5d8e8',
          200: '#9fbdd8',
          300: '#75a1c7',
          400: '#548ab9',
          500: '#3273ab',
          600: '#2b65a3',
          700: '#215398',
          800: '#17418e',
          900: '#123B56',
        },
        teal: {
          DEFAULT: '#168C8C',
          light: '#1aa8a8',
          dark: '#0e6060',
        },
        forest: '#285943',
        sunset: '#F29B38',
        ivory: '#FAF7F0',
        ink: '#1C2933',
        muted: '#687783',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}

export default config
