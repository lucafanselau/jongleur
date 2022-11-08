/*
spline: {
  primary: "#9F98E0",
  secondary: "#819EAD",
  accent: "rgb(220, 140, 149)",
  neutral: "#fee6f0",
  "base-100": "#D3D3D3"
}
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-400": "#525252"
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        spline: {
          primary: "#4A4485", // the orange
          secondary: "#BB7553", // the chair tone
          accent: "#9A8DF0",
          neutral: "#020202", //"#FFFFFF",
          "base-100": "#F3F6F6", // "#663D26"
          "base-200": "#E5EBEA",
          "base-300": "#D0DCDC"
        }
      }
    ]
  }
};
