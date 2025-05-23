import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#25C6F5', // Figma blue accent
        black: '#181A1B',   // Deep black for text/background
        white: '#FFFFFF',
        gray: {
          100: '#F5F7FA',  // Light gray for backgrounds
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
        },
        accent: '#FF3B3F', // Red accent for highlights
      },
      fontFamily: {
        heading: ['Poppins', 'Montserrat', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        special: ['Georgia', 'serif'], // For italic Krrid
      },
      borderRadius: {
        xl: '2rem', // For large rounded cards/sections
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

export default config; 