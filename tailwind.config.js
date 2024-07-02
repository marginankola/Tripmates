/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00B25A',
        dark: '#222222',
        blue: '#4086F4',
        yellow: '#FFB60A',
        paragraph: '#666666',
        text: '#444444',
        primaryBg: '#FEFCFB',
        secondaryBg: '#F7F8FC',
        lightBlue: '#eff0f6',
        red: '#ef476f',
        lightRed: '#FFE7DB',
        transparent: 'transparent',
        white: '#ffffff',
      },
      width: {
        sm: '24rem',
        md: '28rem',
        lg: '32rem',
        xl: '36rem',
        '2xl': '48rem',
        '3xl': '56rem',
        '4xl': '64rem',
      },
    },
    fontFamily: {
      volkhov: ['Volkhov', 'Poppins', 'serif'],
      poppins: ['Poppins', 'serif'],
    },
  },
  plugins: [],
  darkMode: 'class',
}
