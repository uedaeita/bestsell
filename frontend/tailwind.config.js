module.exports = {
  mode: 'jit',
  purge: [
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: {
        dark: '#00796B',
        light: '#B2DFDB',
        DEFAULT: '#009688',
        text: '#212121'
      },
      secondary: {
        text: '#757575'
      },
      accent: '#607D8B',
      text: '#FFFFFF',
      divider: '#BDBDBD',
      transparent: 'transparent'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
