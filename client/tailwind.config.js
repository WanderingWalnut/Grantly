/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Civic Trust Light Theme
        primary: {
          50: '#EBF4FF',
          100: '#D6E9FF',
          200: '#B3D7FF',
          300: '#8CC5FF',
          400: '#66B3FF',
          500: '#3A86FF', // Main primary color
          600: '#0066FF',
          700: '#0052D6',
          800: '#003DAD',
          900: '#002E85',
        },
        secondary: {
          50: '#E6FFFE',
          100: '#CCFFFC',
          200: '#99FFF9',
          300: '#66FFF6',
          400: '#33FFF3',
          500: '#2EC4B6', // Main secondary color
          600: '#00A896',
          700: '#008C7A',
          800: '#00705F',
          900: '#005444',
        },
        accent: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFD166', // Main accent color
          600: '#FFBB00',
          700: '#D69E00',
          800: '#AD8100',
          900: '#856400',
        },
        surface: {
          50: '#FFFFFF',  // White for cards/surfaces
          100: '#F8F9FA', // Off-white background
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D', // Cool gray for secondary text
          700: '#495057',
          800: '#343A40',
          900: '#2D2D2D', // Charcoal gray for primary text
        },
        success: '#20C997',  // Teal green
        error: '#FF6B6B',    // Coral red
        warning: '#FFD166',  // Golden sand
        info: '#3A86FF',     // Soft blue
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'civic': '8px',   // Standard civic rounded corners
        'civic-lg': '12px', // Larger civic rounded corners
      },
      boxShadow: {
        'civic': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'civic-md': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
        'civic-lg': '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-civic': 'linear-gradient(135deg, #3A86FF 0%, #2EC4B6 100%)',
        'gradient-civic-subtle': 'linear-gradient(135deg, rgba(58, 134, 255, 0.1) 0%, rgba(46, 196, 182, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}