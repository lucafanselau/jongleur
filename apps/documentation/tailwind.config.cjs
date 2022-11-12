const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateRows: {
        "md-layout": "auto auto 1fr",
      },
      gridTemplateColumns: {
        "md-layout": "16rem minmax(0, 1fr)",
        // The 65vh width comes from the max width of the tailwind typography plugin
        // https://tailwindcss.com/docs/typography-plugin#overriding-max-width
        layout: "16rem minmax(0, 65ch) 16rem",
      },
      colors: {
        nord: {
          100: "#95A0B2",
          200: "#67768E",
          300: "#565F76",
          400: "#454D5F",
          // this is the normal background
          500: "#2e3440ff",
          600: "#22272F",
        },
        "nord-text": {
          500: "#D8DEE9",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("flowbite/plugin"),
    require("@headlessui/tailwindcss"),
  ],
};
