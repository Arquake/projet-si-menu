/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'electric-violet': {
          '50': '#f3f2ff',
          '100': '#eae7ff',
          '200': '#d6d2ff',
          '300': '#b9aeff',
          '400': '#9680ff',
          '500': '#764dff',
          '600': '#743dff',
          '700': '#5716eb',
          '800': '#4912c5',
          '900': '#3d11a1',
          '950': '#22076e',
        },
      },
    },
  },
  plugins: [],
};
