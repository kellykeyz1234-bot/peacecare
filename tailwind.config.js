/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Slate green: the dark sidebar and main buttons
        green: {
          50: '#f1f6f5',
          100: '#dde9e7',
          200: '#bcd3cf',
          300: '#93b5af',
          400: '#6b948d',
          500: '#4e7a73',
          600: '#3f6560',
          700: '#35544f',
          800: '#2c4440',
          900: '#243835',
          950: '#172523',
        },
        // Soft teal: highlights, icon tiles and chart accents
        emerald: {
          50: '#eef8f6',
          100: '#d5eeea',
          200: '#acddd6',
          300: '#7cc6bc',
          400: '#4fada1',
          500: '#2f9488',
          600: '#257a70',
          700: '#20635b',
          800: '#1d4f49',
          900: '#1a423d',
          950: '#0e2623',
        },
        // Mustard gold: the accent from your reference
        gold: {
          50: '#fdf8e7',
          100: '#faefc2',
          200: '#f4de85',
          300: '#ecca52',
          400: '#e0b93a',
          500: '#d4a72c',
          600: '#b98a1c',
          700: '#946b17',
          800: '#6f5014',
          900: '#4d3810',
        },
      },
    },
  },
  plugins: [],
}