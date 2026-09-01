/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
        impact: ['Impact', 'Charcoal', 'sans-serif'],
      },
      colors: {
        'brutal-bg': '#F4F4F0',
        'brutal-dark': '#0D0D0D',
        'brutal-yellow': '#FFE600',
        'brutal-blue': '#0055FF',
        'brutal-pink': '#FF2E93',
        'brutal-green': '#00E676',
        'brutal-purple': '#8A2BE2',
        'brutal-orange': '#FF5400',
        'brutal-cyan': '#00F0FF',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px 0px #000000',
        'brutal': '5px 5px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-xl': '12px 12px 0px 0px #000000',
        'brutal-white': '5px 5px 0px 0px #FFFFFF',
        'brutal-yellow': '6px 6px 0px 0px #FFE600',
        'brutal-pink': '6px 6px 0px 0px #FF2E93',
        'brutal-green': '6px 6px 0px 0px #00E676',
        'brutal-cyan': '6px 6px 0px 0px #00F0FF',
        'none': '0px 0px 0px 0px transparent',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 3px)' },
          '40%': { transform: 'translate(-3px, -3px)' },
          '60%': { transform: 'translate(3px, 3px)' },
          '80%': { transform: 'translate(3px, -3px)' },
          '100%': { transform: 'translate(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        'marquee-fast': 'marquee 12s linear infinite',
        'marquee-reverse': 'marquee-reverse 20s linear infinite',
        glitch: 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        blink: 'blink 1s infinite',
      }
    },
  },
  plugins: [],
}
