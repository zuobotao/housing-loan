/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apple System Colors
        brand: {
          50: '#e8f2ff',
          100: '#cfe5ff',
          200: '#9fcbff',
          300: '#66abff',
          400: '#2e8dff',
          500: '#007AFF',
          600: '#0064d6',
          700: '#004fad',
          800: '#003b82',
          900: '#00275a',
        },
        background: {
          50: '#ffffff',
          100: '#f7f7fa',
          200: '#f2f2f7',
          300: '#e5e5ea',
          400: '#d1d1d6',
          500: '#aeaeb2',
          600: '#8e8e93',
          700: '#3a3a3c',
          800: '#1c1c1e',
          900: '#000000',
        },
        text: {
          50: '#f5f5f7',
          100: '#e3e3e8',
          200: '#c7c7cc',
          300: '#aeaeb2',
          400: '#8e8e93',
          500: '#6e6e73',
          600: '#48484a',
          700: '#3c3c43',
          800: '#1d1d1f',
          900: '#000000',
        },
        // Semantic colors
        primary: {
          DEFAULT: '#007AFF',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f2f2f7',
          foreground: '#1d1d1f',
        },
        muted: {
          DEFAULT: '#f2f2f7',
          foreground: '#8e8e93',
        },
        accent: {
          DEFAULT: '#f7f7fa',
          foreground: '#1d1d1f',
        },
        destructive: {
          DEFAULT: '#FF3B30',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#34C759',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#FF9500',
          foreground: '#ffffff',
        },
        // Chart colors (Apple system)
        chart: {
          1: '#34C759',
          2: '#007AFF',
          3: '#FF9500',
          4: '#5856d6',
          5: '#AF52DE',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"SF Pro Display"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        display: ['"DM Sans"', '"SF Pro Display"', '"Noto Sans SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Monaco', 'monospace'],
      },
      borderRadius: {
        'apple': '1.2rem',
        'apple-lg': '1.6rem',
        'apple-sm': '0.8rem',
      },
      boxShadow: {
        'apple-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'apple-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.05)',
        'apple': '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'apple-md': '0 4px 8px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'apple-lg': '0 8px 24px -8px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 16px 40px -10px rgba(0, 0, 0, 0.10), 0 8px 16px -8px rgba(0, 0, 0, 0.06)',
        'apple-2xl': '0 24px 64px -12px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
