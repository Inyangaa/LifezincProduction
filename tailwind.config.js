/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Poppins',
          'Nunito',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      colors: {
        brand: {
          // Primary: Calming Sage Green (Nature, Growth, Renewal)
          primary: {
            50: '#f4f8f7',
            100: '#e3eeeb',
            200: '#c7ddd7',
            300: '#a0c4ba',
            400: '#75a599',
            500: '#588a7e', // Main brand color
            600: '#456f66',
            700: '#385a53',
            800: '#2f4a45',
            900: '#293e3b',
          },
          // Accent: Warm Terracotta (Grounding, Comfort, Stability)
          accent: {
            50: '#fdf8f6',
            100: '#f9ede8',
            200: '#f3d9ce',
            300: '#ebbfa9',
            400: '#e19b7d',
            500: '#d4795a', // Warm, inviting accent
            600: '#c15d42',
            700: '#a14937',
            800: '#843e32',
            900: '#6c352c',
          },
          // Soft Backgrounds: Warm Neutrals
          soft: {
            cream: '#faf9f7',
            sand: '#f5f3f0',
            mist: '#f0eeeb',
            pearl: '#fdfcfb',
          },
          // Neutral Text: Warm Grays
          text: {
            primary: '#2d3436',   // Almost black, warm undertone
            secondary: '#4a5258', // Medium gray
            tertiary: '#6b7c7a',  // Lighter gray (current tagline color)
            muted: '#8f9c9a',     // Subtle gray
            placeholder: '#b0bbb9', // Very light
          },
          // Verse Highlight: Soft Golden Amber
          verse: {
            50: '#fffbf0',
            100: '#fef6dc',
            200: '#fdeab8',
            300: '#fbd98a',
            400: '#f8c04f',
            500: '#f5a524', // Warm, uplifting gold
            600: '#e68710',
            700: '#c16710',
            800: '#9a5214',
            900: '#7c4415',
          },
          // Crisis Warning: Clear Coral Red (Urgent but not harsh)
          crisis: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Clear warning red
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          // Success: Peaceful Green
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          // Info: Calming Blue
          info: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
        },
      },
    },
  },
  plugins: [],
};
