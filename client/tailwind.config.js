/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      "Roboto": ["Roboto", "sans-serif"],
    },
    extend: {
      showContent: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      boxShadow: {
        '3xl': '0 3px 10px 8px rgba(255, 255, 255, 0.6)',
      }
    },
    animation: {
      showContent: "showContent 0.5s linear 1s forwards",
    },
    transitionDelay: {
      "1200": "1.2s",
    },
    keyframes: {
      showContent: {
        "0%": {
          opacity: 0,
          filter: "blur(10px)",
          transform: "translateY(20px)",
        },
        "100%": {
          opacity: 1,
          filter: "blur(0)",
          tranform: "translateY(0)",
        },
      }
    }
  },
  plugins: [],
}

