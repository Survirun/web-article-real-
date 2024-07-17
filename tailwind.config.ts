import type { Config } from "tailwindcss";

const GRAY = {
  100: '#FFFFFF',
  200: '#FAFAFC',
  300: '#EEEEF0',
  400: '#DCDCEA',
  500: '#BEBEC8',
  600: '#A0A0AB',
  700: '#84848F',
  800: '#686874',
  900: '#3F3F46',
  1000: '#18171D',
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      gray: {
        ...GRAY
      },
      main: {
        primary: `${GRAY[900]}`,
        light: `${GRAY[700]}`,
        dark: `${GRAY[1000]}`
      }
    },
    fontFamily: {

    },
    spacing: {
      headerH: '3.75rem',
      contentW: '60rem'
    },
    extend: {
      
    },
  },
  plugins: [
    ({ addUtilities, addComponents, theme }: any) => {
      addUtilities({
        ".bg-transparent": {
          "background-color": "transparent"
        },
        ".scrollbar-none": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }
      });
      addComponents({
        ".img": {
          width: '14.25rem',
          height: '14.25rem',
          borderRadius: '0.25rem',
          backgroundColor: theme('colors.gray[300]'),
          objectFit: 'cover',
          flexShrink: 0,
        }
      })
    },
  ],
};

export default config;
