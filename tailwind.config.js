/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{js,ts,jsx,tsx,md,mdx}',
    './app/**/*.{js,ts,jsx,tsx,md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.indigo.600'),
              '&:hover': {
                color: theme('colors.indigo.800'),
              },
              code: { color: theme('colors.indigo.600') },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              lineHeight: 1.2,
              '&:hover a': {
                opacity: 1,
              },
            },
            'h1, h2': {
              letterSpacing: '-0.025em',
            },
            h1: {
              fontSize: theme('fontSize.4xl'),
              marginTop: '1.5em',
              marginBottom: '0.5em',
              '@screen md': {
                fontSize: theme('fontSize.5xl'),
              },
            },
            h2: {
              fontSize: theme('fontSize.2xl'),
              marginTop: '2em',
              marginBottom: '0.75em',
              '@screen md': {
                fontSize: theme('fontSize.3xl'),
              },
            },
            h3: {
              fontSize: theme('fontSize.xl'),
              marginTop: '1.5em',
              marginBottom: '0.5em',
              '@screen md': {
                fontSize: theme('fontSize.2xl'),
              },
            },
            'h4, h5, h6': {
              fontSize: theme('fontSize.lg'),
              marginTop: '1.25em',
              marginBottom: '0.5em',
              '@screen md': {
                fontSize: theme('fontSize.xl'),
              },
            },
            'p, ul, ol, blockquote, pre, table': {
              marginTop: '1em',
              marginBottom: '1em',
            },
            'ul, ol': {
              paddingLeft: '1.5em',
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li > p, li > ul, li > ol': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'ul > li': {
              paddingLeft: '0.375em',
              '&::marker': {
                color: theme('colors.gray.500'),
              },
            },
            'ol > li': {
              paddingLeft: '0.5em',
              '&::marker': {
                color: theme('colors.gray.500'),
                fontWeight: '600',
              },
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: theme('colors.gray.900'),
              borderLeftWidth: '0.25rem',
              borderLeftColor: theme('colors.indigo.200'),
              quotes: '"\u201C""\u201D""\u2018""\u2019"',
              paddingLeft: '1em',
              marginLeft: '0',
              marginRight: '0',
              '> :first-child': {
                marginTop: '0',
              },
              '> :last-child': {
                marginBottom: '0',
              },
            },
            'pre, code': {
              color: theme('colors.gray.800'),
              backgroundColor: theme('colors.gray.50'),
              borderRadius: theme('borderRadius.DEFAULT'),
              padding: '0.2em 0.4em',
              fontSize: '0.9em',
              fontFamily: theme('fontFamily.mono').join(', '),
            },
            pre: {
              padding: '1em',
              overflowX: 'auto',
              marginTop: '1.5em',
              marginBottom: '1.5em',
              code: {
                backgroundColor: 'transparent',
                padding: '0',
                borderRadius: '0',
              },
            },
            'code::before, code::after': {
              content: 'none',
            },
            'pre code::before, pre code::after': {
              content: 'none',
            },
            'pre, pre[class*="language-"]': {
              color: theme('colors.gray.200'),
              backgroundColor: theme('colors.gray.900'),
            },
            'pre code, pre[class*="language-"] code': {
              color: 'inherit',
              backgroundColor: 'transparent',
            },
            'code[class*="language-"]': {
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.9em',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5em',
              marginBottom: '1.5em',
              'th, td': {
                borderWidth: '1px',
                borderColor: theme('colors.gray.200'),
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
              },
              'thead th': {
                backgroundColor: theme('colors.gray.50'),
                fontWeight: '600',
                color: theme('colors.gray.900'),
              },
              'tbody tr:nth-child(odd)': {
                backgroundColor: theme('colors.gray.50'),
              },
            },
            'img, video': {
              maxWidth: '100%',
              height: 'auto',
              marginTop: '1.5em',
              marginBottom: '1.5em',
              borderRadius: theme('borderRadius.lg'),
            },
            'figure > *': {
              marginTop: '0',
              marginBottom: '0',
            },
            figcaption: {
              textAlign: 'center',
              fontSize: theme('fontSize.sm'),
              color: theme('colors.gray.500'),
              marginTop: '0.5em',
            },
            hr: {
              borderColor: theme('colors.gray.200'),
              borderTopWidth: '1px',
              marginTop: '3em',
              marginBottom: '3em',
            },
            '> :first-child': {
              marginTop: '0 !important',
            },
            '> :last-child': {
              marginBottom: '0 !important',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.indigo.400'),
              '&:hover': {
                color: theme('colors.indigo.300'),
              },
              code: { color: theme('colors.indigo.400') },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.white'),
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.indigo.800'),
            },
            'pre, code': {
              color: theme('colors.gray.300'),
              backgroundColor: theme('colors.gray.800'),
            },
            'pre, pre[class*="language-"]': {
              backgroundColor: theme('colors.gray.900'),
            },
            'pre code, pre[class*="language-"] code': {
              color: 'inherit',
              backgroundColor: 'transparent',
            },
            table: {
              'th, td': {
                borderColor: theme('colors.gray.700'),
              },
              'thead th': {
                backgroundColor: theme('colors.gray.800'),
                color: theme('colors.white'),
              },
              'tbody tr:nth-child(odd)': {
                backgroundColor: theme('colors.gray.800'),
              },
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
          },
        },
      }),
      colors: {
        primary: {
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
          950: '#082f49',
        },
      },
      // Add some useful extensions for modern development
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ❌ REMOVED: require('@tailwindcss/line-clamp'), - This is now built-in!
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
