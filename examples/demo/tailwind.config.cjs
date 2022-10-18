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
          primary: "#9F98E0",
          secondary: "#819EAD",
          accent: "rgb(220, 140, 149)",
          neutral: "#fee6f0",
          "base-100": "#D3D3D3"
        }
      }
    ]
  }
};
