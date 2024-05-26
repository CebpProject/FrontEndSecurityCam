import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      ...require('tailwindcss/colors'),
      'text': '#f7ebe8',
      'text-alt': '#1e1e24',
      'background': '#1e1e24',
      'background-alt': '#29292f',
      'primary': '#e64c4c',
      'secondary': '#ffa785',
      'accent': '#CAA8F5',
    },
  },
  plugins: [],
}
export default config
