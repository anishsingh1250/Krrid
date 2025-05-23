
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '7xl': '4.5rem',
        '6xl': '3.75rem',
        '5xl': '3rem',
      },
      colors: {
        primary: '#25C6F5',
        black: '#181A1B',
        white: '#FFFFFF',
        gray: {
          100: '#F5F7FA',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
        },
        accent: '#FF3B3F',
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
