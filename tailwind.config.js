import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.tsx',
  ],

  darkMode: 'class', // Add this line to enable class-based dark mode

  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // You can extend your color palette for dark mode if needed
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#0e2a6b',
        },
      },
    },
  },

  plugins: [
    forms, // Make sure you're using this plugin if you imported it
    require('daisyui'),
  ],

  // Optional: DaisyUI configuration
  daisyui: {
    themes: false, // Set to false if you want to use only your custom dark mode
    // or you can use DaisyUI's built-in dark theme by:
    // themes: ["light", "dark"],
    darkTheme: "dark", // Only needed if you're using DaisyUI themes
  },
};
