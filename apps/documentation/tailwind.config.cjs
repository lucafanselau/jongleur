const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "md-layout": "16rem minmax(0, 1fr)",
        layout: "16rem minmax(0, 64rem) 16rem"
      },
      colors: {
        "light-blue": colors.sky[300],
        blue: colors.sky[600],
        "light-gray": colors.slate[300],
        "mid-gray": colors.slate[500],
        "dark-gray": colors.slate[800]
      }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("flowbite/plugin")]
};
