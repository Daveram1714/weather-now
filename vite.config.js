import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   theme: {
    extend: {
      fontFamily: {
        glamour: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [react() , tailwindcss()],
})



// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         glamour: ["Playfair Display", "serif"], // ✅ Add here
//       },
//       colors: {
//         cream: "#F2EEE7", // if needed
//       },
//     },
//   },
//   plugins: [],
// }
