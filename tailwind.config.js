/** @type {import('tailwindcss').Config} */

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgba(var(${variable}), ${opacityValue})`;
  };
}

export default {
  content: [
    "./frontend/**/*.{js,jsx,ts,tsx}",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/**/*.{json,liquid}",
    "./layout/*.liquid",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Matter", "sans-serif"],
        heading: ["Gothic", "sans-serif"],
      },
      colors: {
        primary: withOpacityValue("--color-primary"),
        contrast: withOpacityValue("--color-contrast"),
        accent: withOpacityValue("--color-accent"),
      },
      transitionDuration: {
        1500: "1500ms",
        2000: "2000ms",
        2500: "2500ms",
      },
    },
  },
  plugins: [],
};
