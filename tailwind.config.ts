import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      "blue": "#2463EB",
      "blue-secondary": "#93C5FD",
      "green": "#1FA95D",
      "green-secondary": "#00ff73",
      "purple": "#C084FC",
      "dark-gray": "#1F2937",
      "light-gray": "#8F949B",
      "white": "#FFFFFF",
    },
    fontSize: {
      "sm": "15px",
      "md": "20px",
      "lg": "25px",
      "xl": "30px",
      "2xl": "40px",
    },
    extend: {
      fontFamily: {
        roobert: ['var(--font-roobert)'],
      },
      backgroundImage: {
        shapes:
          "radial-gradient(circle, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0) 0%), url('../public/shapesBg.svg')",
      },
    },
  },
  plugins: [],
};
export default config;
