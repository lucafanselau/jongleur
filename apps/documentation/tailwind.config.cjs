const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto Flex", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        "md-layout": "16rem minmax(0, 1fr)",
        // The 65vh width comes from the max width of the tailwind typography plugin
        // https://tailwindcss.com/docs/typography-plugin#overriding-max-width
        layout: "16rem minmax(0, 65ch) 16rem",
      },
      colors: {
        "light-blue": colors.sky[300],
        "light-gray": colors.slate[300],
        "mid-gray": colors.slate[500],
        "dark-gray": colors.slate[800],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("flowbite/plugin")],
};
