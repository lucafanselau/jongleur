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
    extend: {}
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        spline: {
          primary: "#BB7553", // the orange
          secondary: "#9A8DF0", // the chair tone
          accent: "#445E85",
          neutral: "#663D26", //"#FFFFFF",
          "base-100": "#a9866b" // "#663D26"
        }
      }
    ]
  }
};
