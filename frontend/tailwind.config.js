/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F0',
          200: '#F3EDE2',
          300: '#E7DDD0',
          400: '#D6C8B5',
        },
        // Mapped to Be Bodywise signature brand color #0A42C1
        sage: {
          50: '#EFF4FE',
          100: '#DBE7FB',
          200: '#BDD3F8',
          300: '#91B6F4',
          400: '#5F93EE',
          500: '#2E71E4',
          600: '#0A42C1', // Exact Be Bodywise Brand Color
          700: '#08359B',
          800: '#062875',
          900: '#041B50',
          950: '#020E2E',
        },
        bodywise: {
          50: '#EFF4FE',
          100: '#DBE7FB',
          200: '#BDD3F8',
          300: '#91B6F4',
          400: '#5F93EE',
          500: '#2E71E4',
          600: '#0A42C1', // Exact Be Bodywise Brand Color
          700: '#08359B',
          800: '#062875',
          900: '#041B50',
          950: '#020E2E',
        },
        lavender: {
          50: '#F8F6FB',
          100: '#EFEBF6',
          200: '#DED5EC',
          300: '#C4B4DC',
          400: '#A58EC5',
          500: '#896EAE',
          600: '#715496',
          700: '#5A4278',
        },
        beige: {
          50: '#FAF8F5',
          100: '#F4EFE9',
          200: '#E7DFD5',
          300: '#D6C9BA',
          400: '#BEAD9B',
        },
        charcoal: {
          50: '#F6F7F9',
          100: '#EDEFF2',
          200: '#D7DBE2',
          300: '#B0B7C3',
          400: '#7E8796',
          500: '#555E6D',
          600: '#3D4552',
          700: '#2B313B',
          800: '#1D222A',
          900: '#12151B',
          950: '#0A0C10',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(10, 66, 193, 0.04)',
        'card': '0 4px 20px -2px rgba(10, 66, 193, 0.06), 0 2px 6px -1px rgba(10, 66, 193, 0.03)',
        'float': '0 12px 36px -4px rgba(10, 66, 193, 0.12), 0 4px 12px -2px rgba(10, 66, 193, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
