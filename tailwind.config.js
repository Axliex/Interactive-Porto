/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontWeight: {
        extralight: '200',
        normal: '400',
      },
      animation: {
        'sonar-ping-slow': 'sonarPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'sonar-ping-fast': 'sonarPing 2.5s cubic-bezier(0, 0, 0.2, 1) 0.8s infinite',
        'sonar-ping-outer': 'sonarPing 2.5s cubic-bezier(0, 0, 0.2, 1) 1.6s infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sonarPing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
