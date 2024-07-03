/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '527': '527px',
        '435': '435px'
      },
      width: {
        '1024': '1024px',
        '569': '569px',
        '380': '380px',
      },
      fontFamily: {
        mono: ['SometypeMono']
      },
      borderColor: {
        'custom-gray': 'rgb(171 172 172 / 1)',
      },
      borderRadius: {
        'custom': '1.4rem',
      },
      padding: {
        '20': '20rem'
      }
    },
  },
  plugins: [],
}