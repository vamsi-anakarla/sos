/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1c1c1c',
          soft: '#2a2a2a',
        },
        comic: {
          red: '#e52421',
          yellow: '#fff28a',
          'yellow-deep': '#ffd93d',
          orange: '#ff8a1c',
          cream: '#fdf8e8',
          paper: '#f4f1e8',
        },
      },
      fontFamily: {
        display: ['Bangers', 'Impact', 'sans-serif'],
        body: ['Rubik', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '6px 6px 0 0 #0d0d0d',
        'panel-sm': '3px 3px 0 0 #0d0d0d',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.85) rotate(-2deg)', opacity: '0' },
          '60%': { transform: 'scale(1.04) rotate(1deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.5s ease-out both',
        wiggle: 'wiggle 0.4s ease-in-out 2',
      },
    },
  },
  plugins: [],
};
