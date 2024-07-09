/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    fontFamily: {
      "Roboto": ["Roboto", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, rgb(63 63 70), rgb(39 39 42), #000000)',
      },
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
  plugins: [
    flowbite.plugin(),
  ],
}

