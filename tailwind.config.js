/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },

      fontSize: {
        h1: ['28px', { lineHeight: '40px', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '28px', fontWeight: '700' }],
        h3: ['18px', { lineHeight: '26px', fontWeight: '700' }],
        h4: ['16px', { lineHeight: '24px', fontWeight: '700' }],

        'body-basic-regular': ['14px', { lineHeight: '16px', fontWeight: '400' }],
        'body-basic-medium': ['14px', { lineHeight: '16px', fontWeight: '500' }],
        'body-basic-bold': ['14px', { lineHeight: '16px', fontWeight: '700' }],
        'body-basic-underline': ['14px', { lineHeight: '16px', fontWeight: '400', textDecoration: 'underline' }],

        'body-small-regular': ['12px', { lineHeight: '14px', fontWeight: '400' }],
        'body-small-medium': ['12px', { lineHeight: '14px', fontWeight: '500' }],
        'body-small-bold': ['12px', { lineHeight: '14px', fontWeight: '700' }],
        'body-small-underline': ['12px', { lineHeight: '14px', fontWeight: '500', textDecoration: 'underline' }],

        // underline needs a class
        sm: ['0.875rem', '16px'],
        xs: ['0.75rem', '14px'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        border: 'var(--color-border-default)',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'var(--color-bg-mapping-primary)',
        foreground: 'var(--color-text-default)', //color-text-default
        warning: 'var(--bg-warning)',
        danger: 'var(--bg-danger)',
        success: 'var(--bg-success)',
        info: 'var(--bg-info)',
        onblack: 'var(--color-text-onblack)',
        againstbg: 'var(--color-text-againstbg)',
        badge: {
          yellow: 'var(--color-bg-badge-yellow)',
          red: 'var(--color-bg-badge-red)',
          green: 'var(--color-bg-badge-green)',
          blue: 'var(--color-bg-badge-blue)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'var(--color-text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--color-bg-mapping-primary-hover)',
          foreground: 'var(--color-text-default)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'var(--color-text-default)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        customColors: {
          primary: 'hsl(var(--primary-color))',
          secondary: 'hsl(var(--secondary-color))',
          tertiary: 'hsl(var(--tertiary-color))',
          quaternary: 'hsl(var(--quaternary-color))',
          quinary: 'hsl(var(--quinary-color))',
        },
      },

      button: {
        default: {
          bg: 'var(--red-700)',
          text: 'var(--gray-100)',
          hover: 'var(--red-800)',
          active: 'var(--red-900)',
          disabled: 'var(--red-300)',
        },
        secondary: {
          bg: 'var(--gray-200)',
          text: 'var(--gray-900)',
          hover: 'var(--gray-300)',
          active: 'var(--gray-400)',
          disabled: 'var(--gray-100)',
        },
        destructive: {
          bg: 'var(--danger-600)',
          text: 'var(--gray-100)',
          hover: 'var(--danger-700)',
          active: 'var(--danger-800)',
          disabled: 'var(--danger-300)',
        },
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      icons: {
        primary: 'var(--color-icon-primary)',
        secondary: 'var(--color-icon-secondary)',
        tertiary: 'var(--color-icon-tertiary)',
        quaternary: 'var(--color-icon-quaternary)',
        quinary: 'var(--color-icon-quinary)',
      },

      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'collapsible-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        'expand-down': {
          '0%': {
            maxHeight: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            maxHeight: '1000px',
            transform: 'translateY(0)',
          },
        },
        'expand-up': {
          '0%': {
            maxHeight: '1000px',
            transform: 'translateY(0)',
          },
          '100%': {
            maxHeight: '0',
            transform: 'translateY(-10px)',
          },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.3s ease-out',
        'collapsible-up': 'collapsible-up 0.3s ease-out',
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out',
        'expand-down': 'expand-down 0.2s ease-out forwards',
        'expand-up': 'expand-up 0.2s ease-out forwards',
      },
    },
    containerType: 'inline-size',
    darkMode: ['class'],
    safelist: ['dark'],
  },
  plugins: [require('tailwindcss-animate')],
};
