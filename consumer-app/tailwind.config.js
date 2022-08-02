module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or "media" or "class"
  theme: {
    extend: {
      fontSize: {
        xxs: [".625rem", ".75rem"],
      },
      colors: {
        primary: {
          dark: "#5151C6",
          DEFAULT: "#7BC0DE",
          hover: "#3362A3",
        },
        secondary: {
          DEFAULT: "#BACDF2",
          dark: "#888BF4",
        },
        cancel: {
          DEFAULT: "#D0995D",
        },
        copy: {
          DEFAULT: "#707070",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
