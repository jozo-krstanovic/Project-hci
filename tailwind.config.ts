import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          black: "var(--brand-black)",
          primary: "var(--brand)",
          "text-strong": "var(--brand-text-strong)",
          "text-weak": "var(--brand-text-weak)",
          "dark-background": "var(--brand-bg-primary)",
          "fill": "var(--brand-bg-secondary)"
        }
      },
      fontFamily: {
        ubuntu: ['var(--font-ubuntu)'],
        montserrat: ['var(--font-montserrat)'],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
} satisfies Config;
