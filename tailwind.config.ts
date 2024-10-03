import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        roobert: ['var(--font-roobert)'],
      },
      backgroundImage: {
        shapes:
          "radial-gradient(circle, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0) 0%), url('../public/shapes-bg.svg')",
      },
    },
  },
  plugins: [],
};
export default config;
