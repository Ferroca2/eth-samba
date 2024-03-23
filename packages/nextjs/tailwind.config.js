/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#1B1E2F", // Darkened from #212638
          "primary-content": "#F9FBFF",
          secondary: "#2C334D", // Darkened from #323f61
          "secondary-content": "#F9FBFF",
          accent: "#3B517A", // Darkened from #4969A6
          "accent-content": "#F9FBFF",
          neutral: "#E1E4F2", // Slightly lightened for contrast
          "neutral-content": "#2D3A5C", // Darkened from #385183
          "base-100": "#2D3A5C", // Darkened from #385183
          "base-200": "#232B4A", // Darkened from #2A3655
          "base-300": "#1A1F32", // Darkened from #212638
          "base-content": "#F9FBFF",
          info: "#2D3A5C", // Darkened from #385183
          success: "#2BC4A9", // Slightly darkened from #34EEB6
          warning: "#E6B062", // Slightly darkened from #FFCF72
          error: "#E66A50", // Slightly darkened from #FF8863

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
