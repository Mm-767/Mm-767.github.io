import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

// Design tokens from DESIGN.md (Pinterest / Gestalt-derived)
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}', './posts/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        pin: {
          red: '#e60023',            // primary CTA
          plum: '#211922',           // primary text (never pure black)
          olive: '#62625b',          // muted / secondary text
          silver: '#91918c',         // disabled text, input borders
          sand: '#e5e5e0',           // warm background / secondary button
          'warm-light': '#e0e0d9',   // circular buttons, badges
          fog: '#f6f6f3',            // light surface
          dark: '#33332e',           // dark footer surface
          link: '#2b48d4',
          focus: '#435ee5',
          error: '#9e0a0a',
          green: '#103c25',
          'border-disabled': '#c8c8c1',
          'hover-gray': '#bcbcb3',
        },
      },
      fontFamily: {
        sans: [
          'Pin Sans', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto',
          'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif',
        ],
      },
      fontSize: {
        caption: ['12px', { lineHeight: '1.5' }],
        'caption-bold': ['14px', { lineHeight: '1.4', fontWeight: '700' }],
        body: ['16px', { lineHeight: '1.4' }],
        heading: ['28px', { lineHeight: '1.2', letterSpacing: '-1.2px', fontWeight: '700' }],
        hero: ['70px', { lineHeight: '1.05', fontWeight: '600' }],
      },
      borderRadius: {
        'pin-sm': '8px',
        pin: '16px',       // buttons, inputs
        'pin-lg': '20px',  // cards
        'pin-xl': '28px',
        'pin-2xl': '32px',
        'pin-hero': '40px',
      },
      spacing: {
        section: '64px',
      },
      boxShadow: {
        none: 'none', // flat by design: depth comes from content, not shadow
      },
    },
  },
  plugins: [typography],
} satisfies Config;
