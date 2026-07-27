/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        spotify: {
          bg: 'rgb(var(--theme-bg) / <alpha-value>)',
          surface: 'rgb(var(--theme-surface) / <alpha-value>)',
          card: 'rgb(var(--theme-card) / <alpha-value>)',
          green: 'rgb(var(--theme-primary) / <alpha-value>)',
          'green-hover': 'rgb(var(--theme-primary-hover) / <alpha-value>)',
          text: 'rgb(var(--theme-text) / <alpha-value>)',
          'text-secondary': 'rgb(var(--theme-text-muted) / <alpha-value>)',
          white: 'rgb(var(--theme-fg) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: 'var(--theme-font-body)',
        display: 'var(--theme-font-heading)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'pulse-green': 'pulseGreen 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'reveal': 'reveal 0.6s ease-out forwards',
        'reveal-delayed': 'reveal 0.6s ease-out 0.2s forwards',
        'reveal-more': 'reveal 0.6s ease-out 0.4s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(29, 185, 84, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(29, 185, 84, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(29, 185, 84, 0.3)' },
          '50%': { textShadow: '0 0 20px rgba(29, 185, 84, 0.6), 0 0 40px rgba(29, 185, 84, 0.3)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};