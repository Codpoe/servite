const colors = require('tailwindcss/colors');

const colorVars = [
  'c-brand',
  'c-brand-light',
  'c-brand-dark',
  'c-bg-0',
  'c-bg-1',
  'c-bg-2',
  'c-bg-sidebar',
  'c-text-0',
  'c-text-1',
  'c-text-2',
  'c-text-3',
  'c-border-0',
  'c-border-1',
  'c-border-2',
];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      colors: colorVars.reduce((acc, cur) => {
        acc[cur] = `var(--${cur})`;
        return acc;
      }, {}),
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-headings': colors.gray[800],
            '--tw-prose-links': colors.gray[800],
            '--tw-prose-bold': colors.gray[800],
            '--tw-prose-quotes': colors.gray[800],
            '--tw-prose-code': colors.gray[800],
            '--tw-prose-invert-headings': colors.gray[200],
            '--tw-prose-invert-links': colors.gray[200],
            '--tw-prose-invert-bold': colors.gray[200],
            '--tw-prose-invert-code': colors.gray[200],
          },
        },
      },
    },
  },
  plugins: [require('tailwind-typography')({ target: 'legacy-not-prose' })],
};
