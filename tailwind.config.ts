import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: 'rgb(var(--primary))',
        secondary: 'rgb(var(--secondary))',
        accent1: 'rgb(var(--accent1))',
        accent2: 'rgb(var(--accent2))',
  
      },
    },
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
  },
  
  plugins: [],
};
export default config;
