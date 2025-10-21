/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f2ff",
          100: "#efe6ff",
          200: "#dac6ff",
          300: "#c2a2ff",
          400: "#a66dff",
          500: "#8b3dff",
          600: "#7329eb",
          700: "#5d21bf",
          800: "#4b1b99",
          900: "#3d167c"
        }
      },
      fontFamily: { sans: ["Poppins","ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","Noto Sans","Ubuntu","Cantarell","Helvetica Neue","Arial"] },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
        shine: { '0%': { left: '-40%' }, '100%': { left: '140%' } }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        marquee: 'marquee 16s linear infinite',
        shine: 'shine 2.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
