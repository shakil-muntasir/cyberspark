/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'

const { fontFamily } = require('tailwindcss/defaultTheme')

const config = {
  darkMode: ['class'],
  content: ['./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php', './storage/framework/views/*.php', './resources/views/**/*.blade.php', './resources/js/**/*.tsx'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        brand: '#C4161C',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      width: {
        '4.5': '1.125rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '21.5': '5.375rem'
      },
      minWidth: {
        '15': '3.75rem'
      },
      height: {
        '18': '4.5rem',
        '8.5': '2.125rem'
      },
      margin: {
        '58': '14.5rem'
      },
      fontSize: {
        xxs: '0.625rem'
      },
      transitionProperty: {
        height: 'height',
        'height-padding-opacity': 'height, padding, opacity'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    // Add the no-spin utility to hide the number input spinner
    function ({ addUtilities }) {
      addUtilities({
        '.no-spin': {
          '-webkit-appearance': 'none',
          '-moz-appearance': 'textfield',
          '&::-webkit-outer-spin-button': { display: 'none' },
          '&::-webkit-inner-spin-button': { display: 'none' }
        }
      })
    }
  ],
  safelist: ['bg-violet-400', 'bg-green-400', 'bg-yellow-400', 'bg-sky-400', 'bg-orange-400', 'bg-indigo-400', 'text-violet-400', 'text-green-400', 'text-yellow-400', 'text-sky-400', 'text-orange-400', 'text-indigo-400']
} satisfies Config

export default config
