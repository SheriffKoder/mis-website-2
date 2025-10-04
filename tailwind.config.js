/** @type {import('tailwindcss').Config} */

// const colors = require("./constants.jsx");

// to use neon:
const plugin = require('tailwindcss/plugin')


module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",

  theme: {
    screens: {
      'sm': '360px',
      // => @media (min-width: 640px) { ... }

      'md': '470px',
      // => @media (min-width: 768px) { ... }

      'md1': '570px',
      // => @media (min-width: 768px) { ... }

      'md2': '850px',
      
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'lg1120': '1120px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    // colors,
    extend: {
      colors: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          primary: 'var(--primary)',
          secondary: 'var(--secondary)',
          accent1: 'var(--accent1)',
          accent2: 'var(--accent2)',
    
        },

      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },

  },
  plugins: [
    require("tailwindcss-autofill"),
    require("tailwindcss-shadow-fill"),
    require("tailwindcss-text-fill"),

    // add neon to be used in css by neon:
    plugin(function({addVariant}) {
      addVariant('neon', '.neon &')
    }),


  ],
}

