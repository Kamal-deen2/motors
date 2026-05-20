/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#0c0b0a',
        dark1: '#161412',
        dark2: '#1e1c19',
        dark3: '#282522',
        dark4: '#343130',
        stoneDk: '#524f4b',
        stone: '#716d68',
        stoneMd: '#9b9690',
        stoneLt: '#bfbbb5',
        warmLt: '#d8d4cc',
        offWhDk: '#e8e4dc',
        offWh: '#f0ece4',
        cream: '#f7f4ee',
        white: '#fdfcfa',
        gold: '#9b8a6b',
        goldLt: '#c4ab84',
        goldDk: '#7a6b50',
        red: '#7c2828',
        redLt: '#a33030',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      spacing: {
        'nav-h': '72px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'kenburns': 'kenburns 8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s 0.2s both',
        'slide-in': 'slideIn 0.8s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'scroll-pulse': 'scrollPulse 2s 1.5s infinite',
      },
      keyframes: {
        kenburns: {
          'from': { transform: 'scale(1.08)' },
          'to': { transform: 'scale(1.0)' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(28px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        scrollPulse: {
          'from': { top: '-100%' },
          'to': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
}
