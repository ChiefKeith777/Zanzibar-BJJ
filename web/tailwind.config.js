/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand:    '#f4f1ea',
        dark:    '#1d1c18',
        darker:  '#131210',
        mid:     '#26251f',
        border:  '#3a382f',
        blue:    '#00A3DD',
        'blue-h':'#12b4ef',
        gold:    '#FCD116',
        'gold-h':'#ffe04d',
        muted:   '#8d897e',
        light:   '#cfccc3',
        soft:    '#b5b1a6',
        warm:    '#6f6b60',
        tan:     '#55524a',
        cream:   '#e8e5dd',
        'line':  '#e6e2d8',
        'line2': '#eeebe3',
        yellow:  '#fdf6d8',
        'yellow-b':'#f2dd7a',
        green:   '#25D366',
      },
      fontFamily: {
        sans: ['Archivo', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
